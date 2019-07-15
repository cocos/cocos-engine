/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "ForwardRenderer.h"

#include "gfx/DeviceGraphics.h"
#include "gfx/Texture2D.h"
#include "gfx/VertexBuffer.h"
#include "gfx/IndexBuffer.h"
#include "gfx/FrameBuffer.h"
#include "ProgramLib.h"
#include "View.h"
#include "Scene.h"
#include "Effect.h"
#include "InputAssembler.h"
#include "Pass.h"
#include "Camera.h"
#include "Light.h"
#include <algorithm>

RENDERER_BEGIN

ForwardRenderer::ForwardRenderer()
{
    _arrayPool = new RecyclePool<float>([]()mutable->float*{return new float[16];}, 8);

}

ForwardRenderer::~ForwardRenderer()
{
    _directionalLights.clear();
    _pointLights.clear();
    _spotLights.clear();
    _shadowLights.clear();
    _ambientLights.clear();
    _defines.clear();
    
    delete _arrayPool;
    _arrayPool = nullptr;
}

bool ForwardRenderer::init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates, Texture2D* defaultTexture, int width, int height)
{
    BaseRenderer::init(device, programTemplates, defaultTexture);
    _width = width;
    _height = height;
    registerStage("opaque", std::bind(&ForwardRenderer::opaqueStage, this, std::placeholders::_1, std::placeholders::_2));
    registerStage("shadowcast", std::bind(&ForwardRenderer::shadowStage, this, std::placeholders::_1, std::placeholders::_2));
    registerStage("transparent", std::bind(&ForwardRenderer::transparentStage, this, std::placeholders::_1, std::placeholders::_2));
    return true;
}

void ForwardRenderer::resetData()
{
    _arrayPool->reset();
    reset();
}

void ForwardRenderer::render(Scene* scene)
{
    resetData();
    updateLights(scene);
    scene->sortCameras();
    auto& cameras = scene->getCameras();
    for (auto& camera : cameras)
    {
        View* view = requestView();
        camera->extractView(*view, _width, _height);
    }

    for (size_t i = 0, len = _views->getLength(); i < len; ++i) {
        const View* view = _views->getData(i);
        BaseRenderer::render(*view, scene);
    }
    
    scene->removeModels();
}

void ForwardRenderer::renderCamera(Camera* camera, Scene* scene)
{
    reset();
    int width = _width;
    int height = _height;
    FrameBuffer* fb = camera->getFrameBuffer();
    if (nullptr != fb) {
        width = fb->getWidth();
        height = fb->getHeight();
    }
    View* view = requestView();
    camera->extractView(*view, width, height);
    BaseRenderer::render(*view, scene);
    
    scene->removeModels();
}

void ForwardRenderer::updateLights(Scene* scene)
{
    _directionalLights.clear();
    _pointLights.clear();
    _spotLights.clear();
    _shadowLights.clear();
    _ambientLights.clear();
    
    const Vector<Light*> lights = scene->getLights();
    for (const auto& light : lights)
    {
        light->update(_device);
        if (light->getShadowType() != Light::ShadowType::NONE)
        {
            _shadowLights.pushBack(light);
            View* view = requestView();
            std::vector<std::string> stages;
            stages.push_back("shadowcast");
            light->extractView(*view, stages);
        }
        
        switch(light->getType())
        {
            case Light::LightType::DIRECTIONAL:
            {
                _directionalLights.pushBack(light);
                break;
            }
            case Light::LightType::POINT:
            {
                _pointLights.pushBack(light);
                break;
            }
            case Light::LightType::SPOT:
            {
                _spotLights.pushBack(light);
                break;
            }
            case Light::LightType::AMBIENT:
            {
                _ambientLights.pushBack(light);
                break;
            }
        }
    }
    
    if (lights.size() > 0)
    {
        updateDefines();
    }
    
    _numLights = lights.size();
}

void ForwardRenderer::updateDefines()
{
    _defines.emplace(std::make_pair("_NUM_DIR_LIGHTS", Value(std::min(4, (int)_directionalLights.size()))));
    _defines.emplace(std::make_pair("_NUM_POINT_LIGHTS", Value(std::min(4, (int)_pointLights.size()))));
    _defines.emplace(std::make_pair("_NUM_SPOT_LIGHTS", Value(std::min(4, (int)_spotLights.size()))));
    _defines.emplace(std::make_pair("_NUM_AMBIENT_LIGHTS", Value(std::min(4, (int)_ambientLights.size()))));
    _defines.emplace(std::make_pair("CC_NUM_SHADOW_LIGHTS", Value(std::min(4, (int)_shadowLights.size()))));
}

void ForwardRenderer::submitLightsUniforms()
{
    if (_directionalLights.size() > 0)
    {
        size_t count = _directionalLights.size();
        float* directions = _arrayPool->add();
        float* colors = _arrayPool->add();
        Vec3 lightVec3;
        Vec3 colorVec3;
        for (int i = 0; i < count; ++i)
        {
            int index = i * 4;
            auto* light = _directionalLights.at(i);
            lightVec3.set(light->getDirectionUniform());
            *(directions + index) = lightVec3.x;
            *(directions + index + 1) = lightVec3.y;
            *(directions + index + 2) = lightVec3.z;
            *(directions + index + 3) = 0;
            
            colorVec3.set(light->getColorUniform());
            *(colors + index) = colorVec3.x;
            *(colors + index + 1) = colorVec3.y;
            *(colors + index + 2) = colorVec3.z;
            *(colors + index + 3) = 0;
        }
        _device->setUniformfv("cc_dirLightDirection", count * 4, directions);
        _device->setUniformfv("cc_dirLightColor", count * 4, colors);
    }
    
    if (_pointLights.size() > 0)
    {
        size_t count = _pointLights.size();
        float* positionAndRanges = _arrayPool->add();
        float* colors = _arrayPool->add();
        Vec3 posVec3;
        Vec3 colorVec3;
        for (int i = 0; i < count; ++i)
        {
            int index = i * 4;
            auto* light = _pointLights.at(i);
            posVec3.set(light->getPositionUniform());
            *(positionAndRanges + index) = posVec3.x;
            *(positionAndRanges + index + 1) = posVec3.y;
            *(positionAndRanges + index + 2) = posVec3.z;
            *(positionAndRanges + index + 3) = light->getRange();

            colorVec3.set(light->getColorUniform());
            *(colors + index) = colorVec3.x;
            *(colors + index + 1) = colorVec3.y;
            *(colors + index + 2) = colorVec3.z;
            *(colors + index + 3) = 0;
        }
        _device->setUniformfv("cc_pointLightPositionAndRange", count * 4, positionAndRanges);
        _device->setUniformfv("cc_pointLightColor", count * 4, colors);
    }
    
    if (_spotLights.size() > 0)
    {
        size_t count = _spotLights.size();
        float* directions = _arrayPool->add();
        float* positionAndRanges = _arrayPool->add();
        float* colors = _arrayPool->add();
        Vec3 lightVec3;
        Vec3 posVec3;
        Vec3 colorVec3;
        for (int i = 0; i < count; ++i)
        {
            int index = i * 4;
            auto* light = _spotLights.at(i);
            lightVec3.set(light->getDirectionUniform());
            *(directions + index) = lightVec3.x;
            *(directions + index + 1) = lightVec3.y;
            *(directions + index + 2) = lightVec3.z;
            *(directions + index + 3) = 0;
            
            posVec3.set(light->getPositionUniform());
            *(positionAndRanges + index) = posVec3.x;
            *(positionAndRanges + index + 1) = posVec3.y;
            *(positionAndRanges + index + 2) = posVec3.z;
            *(positionAndRanges + index + 3) = light->getRange();
            
            colorVec3.set(light->getColorUniform());
            *(colors + index) = colorVec3.x;
            *(colors + index + 1) = colorVec3.y;
            *(colors + index + 2) = colorVec3.z;
            *(colors + index + 3) = 0;
        }
        _device->setUniformfv("cc_spotLightDirection", count * 4, directions);
        _device->setUniformfv("cc_spotLightPositionAndRange", count * 4, positionAndRanges);
        _device->setUniformfv("cc_spotLightColor", count * 4, colors);
    }
    
    if (_ambientLights.size() > 0) {
        size_t count = _ambientLights.size();
        float* colors = _arrayPool->add();
        Vec3 colorVec3;
        for (int i = 0; i < count; ++i)
        {
            int index = i * 4;
            auto* light = _ambientLights.at(i);
            colorVec3.set(light->getColorUniform());
            *(colors + index) = colorVec3.x;
            *(colors + index + 1) = colorVec3.y;
            *(colors + index + 2) = colorVec3.z;
            *(colors + index + 3) = 0;
        }
        _device->setUniformfv("cc_pointLightColor", count * 4, colors);
    }
}

void ForwardRenderer::submitShadowStageUniforms(const View& view)
{
    static float* shadowInfo = new float[4];
    shadowInfo[0] = view.shadowLight->getShadowMinDepth();
    shadowInfo[1] = view.shadowLight->getShadowMaxDepth();
    shadowInfo[2] = view.shadowLight->getShadowDepthScale();
    shadowInfo[3] = view.shadowLight->getShadowDarkness();
    
    _device->setUniformMat4("cc_shadow_map_lightViewProjMatrix", view.matViewProj);
    _device->setUniformfv("cc_shadow_map_info", 4, shadowInfo);
    _device->setUniformf("cc_shadow_map_bias", view.shadowLight->getShadowBias());
}

void ForwardRenderer::submitOtherStagesUniforms()
{
    size_t count = _shadowLights.size();
    float* shadowLightInfo = _arrayPool->add();
    static float* shadowLightProjs = new float[count * 16];
    for (int i = 0; i < count; ++i)
    {
        int index = i * 4;
        
        Light* light = _shadowLights.at(i);
        const Mat4 view = light->getViewProjMatrix();
        memcpy(shadowLightProjs + index, view.m, 16);
        
        *(shadowLightInfo + index) = light->getShadowMinDepth();
        *(shadowLightInfo + index + 1) = light->getShadowMaxDepth();
        *(shadowLightInfo + index + 2) = light->getShadowDepthScale();
        *(shadowLightInfo + index + 3) = light->getShadowDarkness();
    }
    
    _device->setUniformfv("cc_shadow_lightViewProjMatrix", count * 16, shadowLightProjs);
    _device->setUniformfv("cc_shadow_info", count * 4, shadowLightInfo);
}

void ForwardRenderer::updateShaderDefines(const StageItem& item)
{
    for (auto& e : _defines)
    {
        const std::string& key = e.first;
        if(item.defines->count(key) == 0)
        {
            item.defines->emplace(key, e.second);
        }
        else
        {
            item.defines->find(key)->second = e.second;
        }
    }
}

bool ForwardRenderer::compareItems(const StageItem &a, const StageItem &b)
{
    const Technique* techA = a.technique;
    const Technique* techB = b.technique;
    
    if (techA->getLayer() != techB->getLayer()) {
        return techA->getLayer() > techB->getLayer();
    }
    
    size_t pa = techA->getPasses().size();
    size_t pb = techB->getPasses().size();
    
    if (pa != pb) {
        return pa > pb;
    }
    
    return a.sortKey > b.sortKey;
}

void ForwardRenderer::sortItems(std::vector<StageItem>& items)
{
    std::sort(items.begin(), items.end(), compareItems);
}

void ForwardRenderer::drawItems(const std::vector<StageItem>& items)
{
    size_t count = _shadowLights.size();
    if (count == 0 && _numLights == 0)
    {
        for (const auto& item : items)
        {
            draw(item);
        }
    }
    else
    {
        std::vector<Texture*> shadowMaps;
        shadowMaps.reserve(count);
        std::vector<int> slots;
        slots.reserve(count);
        for (auto item : items)
        {
            shadowMaps.clear();
            for(int i = 0; i < count; i++)
            {
                Light* light = _shadowLights.at(i);
                shadowMaps.push_back(light->getShadowMap());
                slots.push_back(allocTextureUnit());
            }
            _device->setTextureArray("cc_shadow_map", shadowMaps, slots);
            updateShaderDefines(item);
            draw(item);
        }
    }
}

void ForwardRenderer::opaqueStage(const View& view, const std::vector<StageItem>& items)
{
    // update uniforms
    _device->setUniformMat4("cc_matView", view.matView);
    _device->setUniformMat4("cc_matpProj", view.matProj);
    _device->setUniformMat4("cc_matViewProj", view.matViewProj);
    static Vec3 cameraPos3;
    static Vec4 cameraPos4;
    view.getPosition(cameraPos3);
    cameraPos4.set(cameraPos3.x, cameraPos3.y, cameraPos3.z, 0);
    _device->setUniformVec4("cc_cameraPos", cameraPos4);
    submitLightsUniforms();
    submitOtherStagesUniforms();
    drawItems(items);
}

void ForwardRenderer::shadowStage(const View& view, const std::vector<StageItem>& items)
{
    // update rendering
    submitShadowStageUniforms(view);
    
    for (auto& item : items)
    {
        if (_programLib->getValueFromDefineList("CC_SHADOW_CASTING", *item.defines) != Value::Null) {
            updateShaderDefines(item);
            draw(item);
        }
    }
}

void ForwardRenderer::transparentStage(const View& view, const std::vector<StageItem>& items)
{
    // update uniforms
    _device->setUniformMat4("cc_matView", view.matView);
    _device->setUniformMat4("cc_matpProj", view.matProj);
    _device->setUniformMat4("cc_matViewProj", view.matViewProj);
    static Vec3 cameraPos3;
    static Vec4 cameraPos4;
    view.getPosition(cameraPos3);
    cameraPos4.set(cameraPos3.x, cameraPos3.y, cameraPos3.z, 0);
    _device->setUniformVec4("cc_cameraPos", cameraPos4);
    
    static Vec3 camFwd;
    static Vec3 tmpVec3;
    view.getForward(camFwd);
    
    submitLightsUniforms();
    submitOtherStagesUniforms();
    
    NodeProxy* node;
    // calculate zdist
    for (auto& item : const_cast<std::vector<StageItem>&>(items))
    {
        // TODO: we should use mesh center instead!
        node = const_cast<NodeProxy*>(item.model->getNode());
        if (node != nullptr)
        {
            node->getWorldPosition(&tmpVec3);
        }
        else
        {
            tmpVec3.set(0, 0, 0);
        }
        
        Vec3::subtract(tmpVec3, tmpVec3, &cameraPos3);
        item.sortKey = -Vec3::dot(tmpVec3, camFwd);
    }
    
    sortItems(const_cast<std::vector<StageItem>&>(items));
    drawItems(items);
}

RENDERER_END
