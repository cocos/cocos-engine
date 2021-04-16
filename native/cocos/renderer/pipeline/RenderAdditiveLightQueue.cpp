/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include <array>

#include "BatchedBuffer.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderAdditiveLightQueue.h"

#include "Define.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "SceneCulling.h"
#include "forward/ForwardPipeline.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXSampler.h"
#include "gfx-base/GFXTexture.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {

RenderAdditiveLightQueue::RenderAdditiveLightQueue(RenderPipeline *pipeline) : _pipeline(dynamic_cast<ForwardPipeline *>(pipeline)),
                                                                               _instancedQueue(CC_NEW(RenderInstancedQueue)),
                                                                               _batchedQueue(CC_NEW(RenderBatchedQueue)) {
    auto *     device        = gfx::Device::getInstance();
    const auto alignment     = device->getCapabilities().uboOffsetAlignment;
    _lightBufferStride       = ((UBOForwardLight::SIZE + alignment - 1) / alignment) * alignment;
    _lightBufferElementCount = _lightBufferStride / sizeof(float);
    _lightBuffer             = device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        _lightBufferStride * _lightBufferCount,
        _lightBufferStride,
    });
    _firstLightBufferView    = device->createBuffer({_lightBuffer, 0, UBOForwardLight::SIZE});
    _lightBufferData.resize(_lightBufferElementCount * _lightBufferCount);
    _dynamicOffsets.resize(1, 0);

    const gfx::SamplerInfo info{
        gfx::Filter::LINEAR,
        gfx::Filter::LINEAR,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        {},
        {},
        {},
        {},
    };
    const auto shadowMapSamplerHash = SamplerLib::genSamplerHash(info);
    _sampler                        = SamplerLib::getSampler(shadowMapSamplerHash);
    _phaseID = getPhaseID("forward-add");

    _shadowUBO.fill(0.F);
}

RenderAdditiveLightQueue ::~RenderAdditiveLightQueue() {
    CC_SAFE_DELETE(_instancedQueue);
    CC_SAFE_DELETE(_batchedQueue);
    CC_SAFE_DESTROY(_firstLightBufferView);
    CC_SAFE_DESTROY(_lightBuffer);
}

void RenderAdditiveLightQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    for (const auto &lightPass : _lightPasses) {
        const auto *const subModel       = lightPass.subModel;
        const auto *const pass           = lightPass.pass;
        const auto &dynamicOffsets = lightPass.dynamicOffsets;
        auto *      shader         = lightPass.shader;
        const auto  lights         = lightPass.lights;
        auto *      ia             = subModel->getInputAssembler();
        auto *      pso            = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);
        auto *      descriptorSet  = subModel->getDescriptorSet();

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);

        for (size_t i = 0; i < dynamicOffsets.size(); ++i) {
            const auto *light               = lights[i];
            auto *      globalDescriptorSet = getOrCreateDescriptorSet(light);
            _dynamicOffsets[0]              = dynamicOffsets[i];
            cmdBuffer->bindDescriptorSet(GLOBAL_SET, globalDescriptorSet);
            cmdBuffer->bindDescriptorSet(LOCAL_SET, descriptorSet, _dynamicOffsets);
            cmdBuffer->draw(ia);
        }
    }
}

void RenderAdditiveLightQueue::gatherLightPasses(const Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    static vector<uint> lightPassIndices;

    clear();

    gatherValidLights(camera);

    if (_validLights.empty()) return;

    updateUBOs(camera, cmdBuffer);
    updateLightDescriptorSet(camera, cmdBuffer);

    const auto &renderObjects = _pipeline->getPipelineSceneData()->getRenderObjects();
    for (const auto &renderObject : renderObjects) {
        const auto *const model = renderObject.model;
        if (!getLightPassIndex(model, &lightPassIndices)) continue;

        _lightIndices.clear();
        for (size_t i = 0; i < _validLights.size(); i++) {
            const auto *const light    = _validLights[i];
            const bool isCulled = cullingLight(light, model);
            if (!isCulled) {
                _lightIndices.emplace_back(i);
            }
        }

        if (_lightIndices.empty()) continue;
        const auto *const subModelArrayID = model->getSubModelID();
        const auto subModelCount   = subModelArrayID[0];
        for (unsigned j = 1; j <= subModelCount; j++) {
            const auto lightPassIdx = lightPassIndices[j - 1];
            if (lightPassIdx == UINT_MAX) continue;
            const auto *const subModel      = model->getSubModelView(subModelArrayID[j]);
            const auto *const pass          = subModel->getPassView(lightPassIdx);
            auto *            descriptorSet = subModel->getDescriptorSet();
            descriptorSet->bindBuffer(UBOForwardLight::BINDING, _firstLightBufferView);
            descriptorSet->update();

            addRenderQueue(pass, subModel, model, lightPassIdx);
        }
    }
    _instancedQueue->uploadBuffers(cmdBuffer);
    _batchedQueue->uploadBuffers(cmdBuffer);
}

void RenderAdditiveLightQueue::destroy() {
    for (auto &pair : _descriptorSetMap) {
        auto *descriptorSet = pair.second;
        descriptorSet->getBuffer(UBOShadow::BINDING)->destroy();
        descriptorSet->getSampler(SHADOWMAP::BINDING)->destroy();
        descriptorSet->getTexture(SHADOWMAP::BINDING)->destroy();
        descriptorSet->getSampler(SPOT_LIGHTING_MAP::BINDING)->destroy();
        descriptorSet->getTexture(SPOT_LIGHTING_MAP::BINDING)->destroy();
        descriptorSet->destroy();
    }
    _descriptorSetMap.clear();
}

void RenderAdditiveLightQueue::clear() {
    _instancedQueue->clear();
    _batchedQueue->clear();
    _validLights.clear();

    for (auto lightPass : _lightPasses) {
        lightPass.dynamicOffsets.clear();
        lightPass.lights.clear();
    }
    _lightPasses.clear();
}

void RenderAdditiveLightQueue::gatherValidLights(const Camera *camera) {
    const auto *const scene              = camera->getScene();
    const auto *const sphereLightArrayID = scene->getSphereLightArrayID();
    auto       count              = sphereLightArrayID ? sphereLightArrayID[0] : 0;
    Sphere     sphere;
    for (unsigned i = 1; i <= count; i++) {
        const auto *const light = scene->getSphereLight(sphereLightArrayID[i]);
        sphere.setCenter(light->position);
        sphere.setRadius(light->range);
        if (sphere_frustum(&sphere, camera->getFrustum())) {
            _validLights.emplace_back(light);
            getOrCreateDescriptorSet(light);
        }
    }
    const auto *const spotLightArrayID = scene->getSpotLightArrayID();
    count                       = spotLightArrayID ? spotLightArrayID[0] : 0;
    for (unsigned i = 1; i <= count; i++) {
        const auto *const light = scene->getSpotLight(spotLightArrayID[i]);
        sphere.setCenter(light->position);
        sphere.setRadius(light->range);
        if (sphere_frustum(&sphere, camera->getFrustum())) {
            _validLights.emplace_back(light);
            getOrCreateDescriptorSet(light);
        }
    }
}

bool RenderAdditiveLightQueue::cullingLight(const Light *light, const ModelView *model) {
    switch (light->getType()) {
        case LightType::SPHERE:
            return model->worldBoundsID && !aabb_aabb(model->getWorldBounds(), light->getAABB());
        case LightType::SPOT:
            return model->worldBoundsID && (!aabb_aabb(model->getWorldBounds(), light->getAABB()) || !aabb_frustum(model->getWorldBounds(), light->getFrustum()));
        default: return false;
    }
}

void RenderAdditiveLightQueue::addRenderQueue(const PassView *pass, const SubModelView *subModel, const ModelView *model, uint lightPassIdx) {
    const auto batchingScheme = pass->getBatchingScheme();
    if (batchingScheme == BatchingSchemes::INSTANCING) { // instancing
        for (auto idx : _lightIndices) {
            auto *buffer = InstancedBuffer::get(subModel->passID[lightPassIdx], idx);
            buffer->merge(model, subModel, lightPassIdx);
            buffer->setDynamicOffset(0, _lightBufferStride * idx);
            _instancedQueue->add(buffer);
        }
    } else if (batchingScheme == BatchingSchemes::VB_MERGING) { // vb-merging
        for (auto idx : _lightIndices) {
            auto *buffer = BatchedBuffer::get(subModel->passID[lightPassIdx], idx);
            buffer->merge(subModel, lightPassIdx, model);
            buffer->setDynamicOffset(0, _lightBufferStride * idx);
            _batchedQueue->add(buffer);
        }
    } else { // standard draw
        const auto        count = _lightIndices.size();
        AdditiveLightPass lightPass;
        lightPass.subModel = subModel;
        lightPass.pass     = pass;
        lightPass.shader   = subModel->getShader(lightPassIdx);
        lightPass.dynamicOffsets.resize(count);
        for (unsigned idx = 0; idx < count; idx++) {
            const auto lightIdx = _lightIndices[idx];
            lightPass.lights.emplace_back(_validLights[lightIdx]);
            lightPass.dynamicOffsets[idx] = _lightBufferStride * lightIdx;
        }

        _lightPasses.emplace_back(std::move(lightPass));
    }
}

void RenderAdditiveLightQueue::updateUBOs(const Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    const auto exposure        = camera->exposure;
    const auto validLightCount = _validLights.size();
    auto *const sceneData       = _pipeline->getPipelineSceneData();
    auto *const sharedData      = sceneData->getSharedData();
    if (validLightCount > _lightBufferCount) {
        _firstLightBufferView->destroy();

        _lightBufferCount = nextPow2(static_cast<uint>(validLightCount));
        _lightBuffer->resize(_lightBufferStride * _lightBufferCount);
        _lightBufferData.resize(_lightBufferElementCount * _lightBufferCount);
        _firstLightBufferView->initialize({_lightBuffer, 0, UBOForwardLight::SIZE});
    }

    for (unsigned l = 0, offset = 0; l < validLightCount; l++, offset += _lightBufferElementCount) {
        const auto *const light = _validLights[l];

        auto index                = offset + UBOForwardLight::LIGHT_POS_OFFSET;
        _lightBufferData[index++] = light->position.x;
        _lightBufferData[index++] = light->position.y;
        _lightBufferData[index]   = light->position.z;

        index                     = offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET;
        _lightBufferData[index++] = light->size;
        _lightBufferData[index]   = light->range;

        index             = offset + UBOForwardLight::LIGHT_COLOR_OFFSET;
        const auto &color = light->color;
        if (light->useColorTemperature) {
            const auto &tempRGB       = light->colorTemperatureRGB;
            _lightBufferData[index++] = color.x * tempRGB.x;
            _lightBufferData[index++] = color.y * tempRGB.y;
            _lightBufferData[index++] = color.z * tempRGB.z;
        } else {
            _lightBufferData[index++] = color.x;
            _lightBufferData[index++] = color.y;
            _lightBufferData[index++] = color.z;
        }
        if (sharedData->isHDR) {
            _lightBufferData[index] = light->luminance * sharedData->fpScale * _lightMeterScale;
        } else {
            _lightBufferData[index] = light->luminance * exposure * _lightMeterScale;
        }

        switch (light->getType()) {
            case LightType::SPHERE:
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3]              = 0;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
                break;
            case LightType::SPOT:
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3]              = 1.0F;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = light->spotAngle;

                index                     = offset + UBOForwardLight::LIGHT_DIR_OFFSET;
                _lightBufferData[index++] = light->direction.x;
                _lightBufferData[index++] = light->direction.y;
                _lightBufferData[index]   = light->direction.z;
                break;
            default:
                break;
        }
    }

    cmdBuffer->updateBuffer(_lightBuffer, _lightBufferData.data(), static_cast<uint>(_lightBufferData.size() * sizeof(float)));
}

void RenderAdditiveLightQueue::updateLightDescriptorSet(const Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    auto *const       sceneData  = _pipeline->getPipelineSceneData();
    auto *       shadowInfo = sceneData->getSharedData()->getShadows();
    const auto *const scene      = camera->getScene();
    const Light *mainLight  = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();

    for (const auto *light : _validLights) {
        auto *descriptorSet = getOrCreateDescriptorSet(light);
        if (!descriptorSet) {
            return;
        }

        descriptorSet->bindSampler(SHADOWMAP::BINDING, _sampler);
        descriptorSet->bindSampler(SPOT_LIGHTING_MAP::BINDING, _sampler);
        // Main light sampler binding
        descriptorSet->bindTexture(SHADOWMAP::BINDING, _pipeline->getDefaultTexture());
        descriptorSet->update();

        _shadowUBO.fill(0.0F);

        switch (light->getType()) {
            case LightType::SPOT: {
                // update planar PROJ
                if (mainLight) {
                    updateDirLight(shadowInfo, mainLight, _shadowUBO);
                }

                const auto &matShadowCamera = light->getNode()->worldMatrix;

                const auto matShadowView = matShadowCamera.getInversed();

                cc::Mat4 matShadowViewProj;
                cc::Mat4::createPerspective(light->spotAngle, light->aspect, 0.001F, light->range, &matShadowViewProj);

                matShadowViewProj.multiply(matShadowView);

                // shadow info
                float shadowInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, static_cast<float>(shadowInfo->pcfType), shadowInfo->bias};
                memcpy(_shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
                const float color[4] = {shadowInfo->color.x, shadowInfo->color.y, shadowInfo->color.z, shadowInfo->color.w};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, color, sizeof(float) * 4);
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_INFO_OFFSET, &shadowInfos, sizeof(shadowInfos));
                // Spot light sampler binding
                const auto &shadowFramebufferMap = sceneData->getShadowFramebufferMap();
                if (shadowFramebufferMap.count(light) > 0) {
                    auto *texture = shadowFramebufferMap.at(light)->getColorTextures()[0];
                    if (texture) {
                        descriptorSet->bindTexture(SPOT_LIGHTING_MAP::BINDING, texture);
                    }
                }
            } break;
            case LightType::SPHERE: {
                // update planar PROJ
                if (mainLight) {
                    updateDirLight(shadowInfo, mainLight, _shadowUBO);
                }
                // Reserve sphere light shadow interface
            } break;
            default:
                break;
        }
        descriptorSet->update();

        cmdBuffer->updateBuffer(descriptorSet->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
    }
}

bool RenderAdditiveLightQueue::getLightPassIndex(const ModelView *model, vector<uint> *lightPassIndices) const {
    lightPassIndices->clear();
    bool hasValidLightPass = false;

    const auto *const subModelArrayID = model->getSubModelID();
    const auto count           = subModelArrayID[0];
    for (unsigned i = 1; i <= count; i++) {
        const auto *const subModel       = model->getSubModelView(subModelArrayID[i]);
        uint       lightPassIndex = UINT_MAX;
        for (unsigned passIdx = 0; passIdx < subModel->passCount; passIdx++) {
            const auto *const pass = subModel->getPassView(passIdx);
            if (pass->phase == _phaseID) {
                lightPassIndex    = passIdx;
                hasValidLightPass = true;
                break;
            }
        }
        lightPassIndices->push_back(lightPassIndex);
    }

    return hasValidLightPass;
}

gfx::DescriptorSet *RenderAdditiveLightQueue::getOrCreateDescriptorSet(const Light *light) {
    if (!_descriptorSetMap.count(light)) {
        auto *              device        = gfx::Device::getInstance();
        gfx::DescriptorSet *descriptorSet = device->createDescriptorSet({_pipeline->getDescriptorSetLayout()});

        descriptorSet->bindBuffer(UBOGlobal::BINDING, _pipeline->getDescriptorSet()->getBuffer(UBOGlobal::BINDING));

        descriptorSet->bindBuffer(UBOCamera::BINDING, _pipeline->getDescriptorSet()->getBuffer(UBOCamera::BINDING));

        auto *shadowUBO = device->createBuffer({
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            UBOShadow::SIZE,
            UBOShadow::SIZE,
            gfx::BufferFlagBit::NONE,
        });
        descriptorSet->bindBuffer(UBOShadow::BINDING, shadowUBO);

        // Main light sampler binding
        descriptorSet->bindSampler(SHADOWMAP::BINDING, _sampler);
        descriptorSet->bindTexture(SHADOWMAP::BINDING, _pipeline->getDefaultTexture());
        // Spot light sampler binding
        descriptorSet->bindSampler(SPOT_LIGHTING_MAP::BINDING, _sampler);
        descriptorSet->bindTexture(SPOT_LIGHTING_MAP::BINDING, _pipeline->getDefaultTexture());

        descriptorSet->update();

        _descriptorSetMap.emplace(map<const Light *, gfx::DescriptorSet *>::value_type(light, descriptorSet));

        return descriptorSet;
    }

    return _descriptorSetMap.at(light);
}

} // namespace pipeline
} // namespace cc
