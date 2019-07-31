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

#include "BaseRenderer.h"
#include <new>
#include "gfx/DeviceGraphics.h"
#include "gfx/Texture2D.h"
#include "ProgramLib.h"
#include "View.h"
#include "Scene.h"
#include "Effect.h"
#include "Light.h"
#include "InputAssembler.h"
#include "Pass.h"
#include "Camera.h"
#include "Model.h"
#include "math/MathUtil.h"
#include "Program.h"

RENDERER_BEGIN

const size_t BaseRenderer::cc_dirLightDirection = std::hash<std::string>{}("cc_dirLightDirection");
const size_t BaseRenderer::cc_dirLightColor = std::hash<std::string>{}("cc_dirLightColor");
const size_t BaseRenderer::cc_pointLightPositionAndRange = std::hash<std::string>{}("cc_pointLightPositionAndRange");
const size_t BaseRenderer::cc_pointLightColor = std::hash<std::string>{}("cc_pointLightColor");
const size_t BaseRenderer::cc_spotLightDirection = std::hash<std::string>{}("cc_spotLightDirection");
const size_t BaseRenderer::cc_spotLightPositionAndRange = std::hash<std::string>{}("cc_spotLightPositionAndRange");
const size_t BaseRenderer::cc_spotLightColor = std::hash<std::string>{}("cc_spotLightColor");
const size_t BaseRenderer::cc_shadow_map = std::hash<std::string>{}("cc_shadow_map");
const size_t BaseRenderer::cc_shadow_map_lightViewProjMatrix = std::hash<std::string>{}("cc_shadow_map_lightViewProjMatrix");
const size_t BaseRenderer::cc_shadow_map_info = std::hash<std::string>{}("cc_shadow_map_info");
const size_t BaseRenderer::cc_shadow_map_bias = std::hash<std::string>{}("cc_shadow_map_bias");
const size_t BaseRenderer::cc_shadow_lightViewProjMatrix = std::hash<std::string>{}("cc_shadow_lightViewProjMatrix");
const size_t BaseRenderer::cc_shadow_info = std::hash<std::string>{}("cc_shadow_info");
const size_t BaseRenderer::cc_matView = std::hash<std::string>{}("cc_matView");
const size_t BaseRenderer::cc_matWorld = std::hash<std::string>{}("cc_matWorld");
const size_t BaseRenderer::cc_matWorldIT = std::hash<std::string>{}("cc_matWorldIT");
const size_t BaseRenderer::cc_matpProj = std::hash<std::string>{}("cc_matpProj");
const size_t BaseRenderer::cc_matViewProj = std::hash<std::string>{}("cc_matViewProj");
const size_t BaseRenderer::cc_cameraPos = std::hash<std::string>{}("cc_cameraPos");

BaseRenderer::BaseRenderer()
{
    _drawItems = new RecyclePool<DrawItem>([]()mutable->DrawItem*{return new DrawItem();},100);
    _stageInfos = new RecyclePool<StageInfo>([]()mutable->StageInfo*{return new StageInfo();}, 10);
    _views = new RecyclePool<View>([]()mutable->View*{return new View();}, 8);
    
    _tmpMat4 = new cocos2d::Mat4();
}

BaseRenderer::~BaseRenderer()
{
    _device->release();
    _device = nullptr;
    
    delete _programLib;
    _programLib = nullptr;
    
    RENDERER_SAFE_RELEASE(_defaultTexture);
    _defaultTexture = nullptr;
    
    delete _drawItems;
    _drawItems = nullptr;
    
    delete _stageInfos;
    _stageInfos = nullptr;
    
    delete _views;
    _views = nullptr;
    
    delete _tmpMat4;
    _tmpMat4 = nullptr;
}

bool BaseRenderer::init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates)
{
    _device = device;
    _device->retain();
    _programLib = new (std::nothrow) ProgramLib(_device, programTemplates);
    return true;
}

bool BaseRenderer::init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates, Texture2D* defaultTexture)
{
    _device = device;
    _device->retain();
    _defaultTexture = defaultTexture;
    RENDERER_SAFE_RETAIN(_defaultTexture);
    _programLib = new (std::nothrow) ProgramLib(_device, programTemplates);
    return true;
}

void BaseRenderer::registerStage(const std::string& name, const StageCallback& callback)
{
    _stage2fn.emplace(std::make_pair(name, callback));
}

// protected functions

void BaseRenderer::render(const View& view, const Scene* scene)
{
    // setup framebuffer
    _device->setFrameBuffer(view.frameBuffer);
    
    // setup viewport
    _device->setViewport(view.rect.x,
                         view.rect.y,
                         view.rect.w,
                         view.rect.h);
    
    // setup clear
    Color4F clearColor;
    if (ClearFlag::COLOR & view.clearFlags)
        clearColor = view.color;
    _device->clear(view.clearFlags, &clearColor, view.depth, view.stencil);
    
    // get all draw items
    _drawItems->reset();
    int modelMask = -1;
    for (const auto& model : scene->getModels())
    {
        modelMask = model->getCullingMask();
        if (view.cullingByID)
        {
            if ((modelMask & view.cullingMask) == 0)
                continue;
        }
        else
        {
            if (-1 != modelMask)
                continue;
        }
        
        DrawItem* drawItem = _drawItems->add();
        model->extractDrawItem(*drawItem);
    }
    
    // dispatch draw items to different stage
    _stageInfos->reset();
    StageItem stageItem;
    std::vector<StageItem> stageItems;
    for (const auto& stage : view.stages)
    {
        for (size_t i = 0, len = _drawItems->getLength(); i < len; i++)
        {
            const DrawItem* item = _drawItems->getData(i);
            auto tech = item->effect->getTechnique(stage);
            if (tech)
            {
                stageItem.model = item->model;
                stageItem.ia = item->ia;
                stageItem.effect = item->effect;
                stageItem.defines = item->defines;
                stageItem.technique = tech;
                stageItem.sortKey = -1;
                stageItem.uniforms = item->uniforms;
                stageItem.definesKeyHash = item->definesKeyHash;
                
                stageItems.push_back(stageItem);
            }
        }
        StageInfo* stageInfo = _stageInfos->add();
        stageInfo->stage = stage;
        stageInfo->items = &stageItems;
    }
    
    // render stages
    std::unordered_map<std::string, const StageCallback>::iterator foundIter;
    for (size_t i = 0, len = _stageInfos->getLength(); i < len; i++)
    {
        const StageInfo* stageInfo = _stageInfos->getData(i);
        foundIter = _stage2fn.find(stageInfo->stage);
        if (_stage2fn.end() != foundIter)
        {
            auto& fn = foundIter->second;
            fn(view, *stageInfo->items);
        }
    }
}

void BaseRenderer::setProperty (Effect::Property& prop)
{
    Technique::Parameter::Type propType = prop.getType();
    auto& propName = prop.getName();
    auto propHashName = prop.getHashName();
    if (Effect::Property::Type::UNKNOWN == propType)
    {
        RENDERER_LOGW("Failed to set technique property, type unknown");
        return;
    }
    
    if (nullptr == prop.getValue())
    {
        prop = Effect::Property(propName, propType);
        
        if (Effect::Property::Type::TEXTURE_2D == propType)
        {
            prop.setTexture(_defaultTexture);
        }
    }
    
    if (nullptr == prop.getValue())
    {
        RENDERER_LOGW("Failed to set technique property %s, value not found", propName.c_str());
        return;
    }
    
    if (Effect::Property::Type::TEXTURE_2D == propType ||
        Effect::Property::Type::TEXTURE_CUBE == propType)
    {
        if (1 == prop.getCount())
        {
            _device->setTexture(propHashName,
                                (renderer::Texture *)(prop.getValue()),
                                allocTextureUnit());
        }
        else if (0 < prop.getCount())
        {
            std::vector<int> slots;
            slots.reserve(10);
            for (int i = 0; i < prop.getCount(); ++i)
            {
                slots.push_back(allocTextureUnit());
            }
            
            _device->setTextureArray(propHashName,
                                     prop.getTextureArray(),
                                     slots);
        }
    }
    else
    {
        if (0 != prop.getCount())
        {
//            if (Technique::Parameter::Type::COLOR3 == propType ||
//                Technique::Parameter::Type::INT3 == propType ||
//                Technique::Parameter::Type::FLOAT3 == propType ||
//                Technique::Parameter::Type::MAT3 == propType)
//            {
//                RENDERER_LOGW("Uinform array of color3/int3/float3/mat3 can not be supported!");
//                return;
//            }
            
            uint8_t size = Technique::Parameter::getElements(propType);
            if (size * prop.getCount() > 64)
            {
                RENDERER_LOGW("Uniform array is too long!");
                return;
            }
        }
        
        uint16_t bytes = prop.getBytes();
        if (Effect::Property::Type::INT == propType ||
            Effect::Property::Type::INT2 == propType ||
            Effect::Property::Type::INT4 == propType)
        {
            _device->setUniformiv(propHashName, bytes / sizeof(int), (const int*)prop.getValue());
        }
        else
        {
            _device->setUniformfv(propHashName, bytes / sizeof(float), (const float*)prop.getValue());
        }
    }
}

void BaseRenderer::draw(const StageItem& item)
{
    const Mat4& worldMatrix = item.model->getWorldMatrix();
    _device->setUniformMat4(cc_matWorld, worldMatrix.m);
    
    _tmpMat4->set(worldMatrix);
    _tmpMat4->inverse();
    _tmpMat4->transpose();
    _device->setUniformMat4(cc_matWorldIT, _tmpMat4->m);
    
    // set technique uniforms
    for (int i = 0, len = (int)item.uniforms->size(); i < len; i++)
    {
        std::unordered_map<std::string, Effect::Property>* properties = (*item.uniforms)[i];
        for (auto& prop : *properties) {
            setProperty(prop.second);
        }
    }
    
    auto ia = item.ia;
    // for each pass
    for (const auto& pass : item.technique->getPasses())
    {
        // set vertex buffer
        _device->setVertexBuffer(0, ia->getVertexBuffer());
        
        // set index buffer
        if (ia->_indexBuffer)
            _device->setIndexBuffer(ia->_indexBuffer);
        
        // set primitive type
        _device->setPrimitiveType(ia->_primitiveType);
        
        // get program
        _program = _programLib->switchProgram(pass->getHashName(), item.definesKeyHash, *(item.defines));
        _device->setProgram(_program);
        
        // cull mode
        _device->setCullMode(pass->_cullMode);
        
        // blend
        if (pass->_blend)
        {
            _device->enableBlend();
            _device->setBlendFuncSeparate(pass->_blendSrc,
                                          pass->_blendDst,
                                          pass->_blendSrcAlpha,
                                          pass->_blendDstAlpha);
            _device->setBlendEquationSeparate(pass->_blendEq, pass->_blendAlphaEq);
            _device->setBlendColor(pass->_blendColor);
        }
        
        // depth test & write
        if (pass->_depthTest)
        {
            _device->enableDepthTest();
            _device->setDepthFunc(pass->_depthFunc);
        }
        if (pass->_depthWrite)
            _device->enableDepthWrite();
        
        // setencil
        if (pass->_stencilTest)
        {
            _device->enableStencilTest();
            
            // front
            _device->setStencilFuncFront(pass->_stencilFuncFront,
                                         pass->_stencilRefFront,
                                         pass->_stencilMaskFront);
            _device->setStencilOpFront(pass->_stencilFailOpFront,
                                       pass->_stencilZFailOpFront,
                                       pass->_stencilZPassOpFront,
                                       pass->_stencilWriteMaskFront);
            
            // back
            _device->setStencilFuncBack(pass->_stencilFuncBack,
                                        pass->_stencilRefBack,
                                        pass->_stencilMaskBack);
            _device->setStencilOpBack(pass->_stencilFailOpBack,
                                      pass->_stencilZFailOpBack,
                                      pass->_stencilZPassOpBack,
                                      pass->_stencilWriteMaskBack);
        }
        
        // draw pass
        _device->draw(ia->_start, ia->getPrimitiveCount());
        
        resetTextureUint();
    }
}

// private functions

void BaseRenderer::resetTextureUint()
{
    _usedTextureUnits = 0;
}

int BaseRenderer::allocTextureUnit()
{
    int maxTexureUnits = _device->getCapacity().maxTextureUnits;
    if (_usedTextureUnits >= maxTexureUnits)
        RENDERER_LOGW("Trying to use %d texture uints while this GPU only supports %d", _usedTextureUnits, maxTexureUnits);
    
    return _usedTextureUnits++;
}

void BaseRenderer::reset()
{
    _views->reset();
    _stageInfos->reset();
}

View* BaseRenderer::requestView()
{
    return _views->add();
}

RENDERER_END
