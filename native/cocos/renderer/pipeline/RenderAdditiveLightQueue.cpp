/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
#include "GlobalDescriptorSetManager.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "SceneCulling.h"
#include "base/Utils.h"
#include "forward/ForwardPipeline.h"
#include "gfx-base/GFXDevice.h"
#include "scene/RenderScene.h"

namespace cc {
namespace pipeline {

RenderAdditiveLightQueue::RenderAdditiveLightQueue(RenderPipeline *pipeline) : _pipeline(pipeline),
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
    _lightBufferData.resize(static_cast<size_t>(_lightBufferElementCount) * _lightBufferCount);
    _dynamicOffsets.resize(1, 0);
    _phaseID = getPhaseID("forward-add");
    _shadowUBO.fill(0.F);
}

RenderAdditiveLightQueue ::~RenderAdditiveLightQueue() {
    CC_SAFE_DELETE(_instancedQueue);
    CC_SAFE_DELETE(_batchedQueue);
    CC_SAFE_DESTROY(_firstLightBufferView);
    CC_SAFE_DESTROY(_lightBuffer);
}

void RenderAdditiveLightQueue::recordCommandBuffer(gfx::Device *device, scene::Camera *camera, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    const bool enableOcclusionQuery = _pipeline->getOcclusionQueryEnabled();
    const auto offset               = _pipeline->getPipelineUBO()->getCurrentCameraUBOOffset();

    for (const auto &lightPass : _lightPasses) {
        const auto *const subModel = lightPass.subModel;

        if (!enableOcclusionQuery || !_pipeline->isOccluded(camera, subModel)) {
            const auto *pass           = lightPass.pass;
            const auto &dynamicOffsets = lightPass.dynamicOffsets;
            auto *      shader         = lightPass.shader;
            const auto  lights         = lightPass.lights;
            auto *      ia             = subModel->getInputAssembler();
            auto *      pso            = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);
            auto *      descriptorSet  = subModel->getDescriptorSet();

            cmdBuffer->bindPipelineState(pso);
            cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            cmdBuffer->bindInputAssembler(ia);

            for (size_t i = 0; i < dynamicOffsets.size(); ++i) {
                const auto light               = lights[i];
                auto *     globalDescriptorSet = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(light);
                _dynamicOffsets[0]             = dynamicOffsets[i];
                cmdBuffer->bindDescriptorSet(globalSet, globalDescriptorSet, 1, &offset);
                cmdBuffer->bindDescriptorSet(localSet, descriptorSet, _dynamicOffsets);
                cmdBuffer->draw(ia);
            }
        }
    }
}

void RenderAdditiveLightQueue::gatherLightPasses(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    static vector<uint> lightPassIndices;

    clear();

    _validPunctualLights = _pipeline->getPipelineSceneData()->getValidPunctualLights();

    if (_validPunctualLights.empty()) return;

    updateUBOs(camera, cmdBuffer);
    updateLightDescriptorSet(camera, cmdBuffer);

    const auto &renderObjects = _pipeline->getPipelineSceneData()->getRenderObjects();
    for (const auto &renderObject : renderObjects) {
        const auto *const model = renderObject.model;
        if (!getLightPassIndex(model, &lightPassIndices)) continue;

        _lightIndices.clear();

        lightCulling(model);

        if (_lightIndices.empty()) continue;
        int i = 0;
        for (const auto *subModel : model->getSubModels()) {
            const auto lightPassIdx = lightPassIndices[i];
            if (lightPassIdx == UINT_MAX) continue;
            const auto *pass          = subModel->getPass(lightPassIdx);
            const bool  isTransparent = subModel->getPass(0)->getBlendState()->targets[0].blend;
            if (isTransparent) {
                continue;
            }
            auto *descriptorSet = subModel->getDescriptorSet();
            descriptorSet->bindBuffer(UBOForwardLight::BINDING, _firstLightBufferView);
            descriptorSet->update();

            addRenderQueue(pass, subModel, model, lightPassIdx);

            ++i;
        }
    }
    _instancedQueue->uploadBuffers(cmdBuffer);
    _batchedQueue->uploadBuffers(cmdBuffer);
}

void RenderAdditiveLightQueue::clear() {
    _instancedQueue->clear();
    _batchedQueue->clear();

    for (auto lightPass : _lightPasses) {
        lightPass.dynamicOffsets.clear();
        lightPass.lights.clear();
    }
    _lightPasses.clear();
}

bool RenderAdditiveLightQueue::cullSphereLight(const scene::SphereLight *light, const scene::Model *model) {
    return model->getWorldBounds() && !model->getWorldBounds()->aabbAabb(light->getAABB());
}

bool RenderAdditiveLightQueue::cullSpotLight(const scene::SpotLight *light, const scene::Model *model) {
    return model->getWorldBounds() && (!model->getWorldBounds()->aabbAabb(light->getAABB()) || !model->getWorldBounds()->aabbFrustum(light->getFrustum()));
}

void RenderAdditiveLightQueue::addRenderQueue(const scene::Pass *pass, const scene::SubModel *subModel, const scene::Model *model, uint lightPassIdx) {
    const auto batchingScheme = pass->getBatchingScheme();
    if (batchingScheme == scene::BatchingSchemes::INSTANCING) { // instancing
        for (const auto idx : _lightIndices) {
            auto *buffer = InstancedBuffer::get(subModel->getPass(lightPassIdx), idx);
            buffer->merge(model, subModel, lightPassIdx);
            buffer->setDynamicOffset(0, _lightBufferStride * idx);
            _instancedQueue->add(buffer);
        }
    } else if (batchingScheme == scene::BatchingSchemes::VB_MERGING) { // vb-merging
        for (const auto idx : _lightIndices) {
            auto *buffer = BatchedBuffer::get(subModel->getPass(lightPassIdx), idx);
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
            lightPass.lights.emplace_back(lightIdx);
            lightPass.dynamicOffsets[idx] = _lightBufferStride * lightIdx;
        }

        _lightPasses.emplace_back(std::move(lightPass));
    }
}

void RenderAdditiveLightQueue::updateUBOs(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    const auto  exposure        = camera->exposure;
    const auto  validLightCount = _validPunctualLights.size();
    const auto *sceneData       = _pipeline->getPipelineSceneData();

    const auto *sharedData = sceneData->getSharedData();
    const auto *shadowInfo = sharedData->shadow;
    size_t      offset     = 0;
    if (validLightCount > _lightBufferCount) {
        _firstLightBufferView->destroy();

        _lightBufferCount = nextPow2(static_cast<uint>(validLightCount));
        _lightBuffer->resize(utils::toUint(_lightBufferStride * _lightBufferCount));
        _lightBufferData.resize(static_cast<size_t>(_lightBufferElementCount) * _lightBufferCount);
        _firstLightBufferView->initialize({_lightBuffer, 0, UBOForwardLight::SIZE});
    }

    for (unsigned l = 0; l < validLightCount; l++, offset += _lightBufferElementCount) {
        const auto *light       = _validPunctualLights[l];
        const bool  isSpotLight = scene::LightType::SPOT == light->getType();
        const auto *spotLight   = isSpotLight ? static_cast<const scene::SpotLight *>(light) : nullptr;
        const auto *sphereLight = isSpotLight ? nullptr : static_cast<const scene::SphereLight *>(light);

        auto        index         = offset + UBOForwardLight::LIGHT_POS_OFFSET;
        const auto &position      = isSpotLight ? spotLight->getPosition() : sphereLight->getPosition();
        _lightBufferData[index++] = position.x;
        _lightBufferData[index++] = position.y;
        _lightBufferData[index]   = position.z;

        index                     = offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET;
        _lightBufferData[index++] = isSpotLight ? spotLight->getSize() : sphereLight->getSize();
        _lightBufferData[index]   = isSpotLight ? spotLight->getRange() : sphereLight->getRange();

        index             = offset + UBOForwardLight::LIGHT_COLOR_OFFSET;
        const auto &color = light->getColor();
        if (light->getUseColorTemperature()) {
            const auto &tempRGB       = light->getColorTemperatureRGB();
            _lightBufferData[index++] = color.x * tempRGB.x;
            _lightBufferData[index++] = color.y * tempRGB.y;
            _lightBufferData[index++] = color.z * tempRGB.z;
        } else {
            _lightBufferData[index++] = color.x;
            _lightBufferData[index++] = color.y;
            _lightBufferData[index++] = color.z;
        }

        const float luminanceHDR = isSpotLight ? spotLight->getLuminanceHDR() : sphereLight->getLuminanceHDR();
        const float luminanceLDR = isSpotLight ? spotLight->getLuminanceLDR() : sphereLight->getLuminanceLDR();
        if (sharedData->isHDR) {
            _lightBufferData[index] = luminanceHDR * exposure * _lightMeterScale;
        } else {
            _lightBufferData[index] = luminanceLDR;
        }

        switch (light->getType()) {
            case scene::LightType::SPHERE:
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3]              = 0;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;
                break;
            case scene::LightType::SPOT: {
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3]              = 1.0F;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = spotLight->getSpotAngle();
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = (spotLight->getShadowEnabled() && shadowInfo->shadowType == scene::ShadowType::SHADOWMAP) ? 1.0F : 0.0F;

                index                     = offset + UBOForwardLight::LIGHT_DIR_OFFSET;
                const auto &direction     = spotLight->getDirection();
                _lightBufferData[index++] = direction.x;
                _lightBufferData[index++] = direction.y;
                _lightBufferData[index]   = direction.z;
            } break;
            default:
                break;
        }
    }

    cmdBuffer->updateBuffer(_lightBuffer, _lightBufferData.data(), static_cast<uint>(_lightBufferData.size() * sizeof(float)));
}

void RenderAdditiveLightQueue::updateLightDescriptorSet(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    const auto *        sceneData  = _pipeline->getPipelineSceneData();
    auto *              shadowInfo = sceneData->getSharedData()->shadow;
    const auto *const   scene      = camera->scene;
    auto *              device     = gfx::Device::getInstance();
    const bool          hFTexture  = supportsR32FloatTexture(device);
    const float         linear     = 0.0F;
    const float         packing    = hFTexture ? 0.0F : 1.0F;
    const scene::Light *mainLight  = scene->getMainLight();

    for (uint i = 0; i < _validPunctualLights.size(); ++i) {
        const auto *light         = _validPunctualLights[i];
        auto *      descriptorSet = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(i);
        if (!descriptorSet) {
            continue;
        }

        _shadowUBO.fill(0.0F);

        switch (light->getType()) {
            case scene::LightType::SPHERE: {
                // update planar PROJ
                if (mainLight) {
                    updateDirLight(shadowInfo, mainLight, &_shadowUBO);
                    updatePlanarNormalAndDistance(shadowInfo, &_shadowUBO);
                }

                // Reserve sphere light shadow interface
                float shadowWHPBInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, 1.0F, 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(float) * 4);

                float shadowLPNNInfos[4] = {2.0F, packing, 0.0F, 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(float) * 4);
            } break;
            case scene::LightType::SPOT: {
                const auto *spotLight = static_cast<const scene::SpotLight *>(light);
                // update planar PROJ
                if (mainLight) {
                    updateDirLight(shadowInfo, mainLight, &_shadowUBO);
                    updatePlanarNormalAndDistance(shadowInfo, &_shadowUBO);
                }

                const auto &matShadowCamera = light->getNode()->getWorldMatrix();
                const auto  matShadowView   = matShadowCamera.getInversed();

                cc::Mat4 matShadowProj;
                cc::Mat4::createPerspective(spotLight->getSpotAngle(), spotLight->getAspect(), 0.001F, spotLight->getRange(), &matShadowProj);
                cc::Mat4 matShadowViewProj = matShadowProj;
                cc::Mat4 matShadowInvProj  = matShadowProj;
                matShadowInvProj.inverse();

                matShadowViewProj.multiply(matShadowView);

                memcpy(_shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_OFFSET, matShadowView.m, sizeof(matShadowView));
                memcpy(_shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));

                // shadow info
                float shadowNFLSInfos[4] = {0.1F, spotLight->getRange(), linear, 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

                float shadowWHPBInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, static_cast<float>(spotLight->getShadowPcf()), spotLight->getShadowBias()};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(shadowWHPBInfos));

                float shadowLPNNInfos[4] = {1.0F, packing, spotLight->getShadowNormalBias(), 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(float) * 4);

                float shadowInvProjDepthInfos[4] = {matShadowInvProj.m[10], matShadowInvProj.m[14], matShadowInvProj.m[11], matShadowInvProj.m[15]};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_INV_PROJ_DEPTH_INFO_OFFSET, &shadowInvProjDepthInfos, sizeof(shadowInvProjDepthInfos));

                float shadowProjDepthInfos[4] = {matShadowProj.m[10], matShadowProj.m[14], matShadowProj.m[11], matShadowProj.m[15]};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_PROJ_DEPTH_INFO_OFFSET, &shadowProjDepthInfos, sizeof(shadowProjDepthInfos));

                float shadowProjInfos[4] = {matShadowProj.m[00], matShadowProj.m[05], 1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_PROJ_INFO_OFFSET, &shadowProjInfos, sizeof(shadowProjInfos));

                // Spot light sampler binding
                const auto &shadowFramebufferMap = sceneData->getShadowFramebufferMap();
                if (shadowFramebufferMap.count(light) > 0) {
                    auto *texture = shadowFramebufferMap.at(light)->getColorTextures()[0];
                    if (texture) {
                        descriptorSet->bindTexture(SPOTLIGHTINGMAP::BINDING, texture);
                    }
                }
            } break;
            default:
                break;
        }

        float color[4] = {shadowInfo->color.x, shadowInfo->color.y, shadowInfo->color.z, shadowInfo->color.w};
        memcpy(_shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &color, sizeof(float) * 4);

        descriptorSet->update();

        cmdBuffer->updateBuffer(descriptorSet->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
    }
}

bool RenderAdditiveLightQueue::getLightPassIndex(const scene::Model *model, vector<uint> *lightPassIndices) const {
    lightPassIndices->clear();
    bool hasValidLightPass = false;

    for (const auto *subModel : model->getSubModels()) {
        int lightPassIndex = 0;
        for (const auto *pass : subModel->getPasses()) {
            if (pass->getPhase() == _phaseID) {
                hasValidLightPass = true;
                break;
            }
            ++lightPassIndex;
        }
        lightPassIndices->push_back(lightPassIndex);
    }

    return hasValidLightPass;
}

void RenderAdditiveLightQueue::lightCulling(const scene::Model *model) {
    bool isCulled = false;
    for (size_t i = 0; i < _validPunctualLights.size(); i++) {
        const auto *const light = _validPunctualLights[i];
        switch (light->getType()) {
            case scene::LightType::SPHERE:
                isCulled = cullSphereLight(static_cast<const scene::SphereLight *>(light), model);
                break;
            case scene::LightType::SPOT:
                isCulled = cullSpotLight(static_cast<const scene::SpotLight *>(light), model);
                break;
            default:
                isCulled = false;
                break;
        }
        if (!isCulled) {
            _lightIndices.emplace_back(utils::toUint(i));
        }
    }
}

} // namespace pipeline
} // namespace cc
