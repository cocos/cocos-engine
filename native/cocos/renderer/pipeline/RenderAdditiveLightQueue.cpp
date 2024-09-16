/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "RenderAdditiveLightQueue.h"
#include "Define.h"
#include "GlobalDescriptorSetManager.h"
#include "InstancedBuffer.h"
#include "PipelineSceneData.h"
#include "PipelineStateManager.h"
#include "PipelineUBO.h"
#include "RenderInstancedQueue.h"
#include "base/Utils.h"
#include "forward/ForwardPipeline.h"
#include "gfx-base/GFXDevice.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/Light.h"
#include "scene/Pass.h"
#include "scene/PointLight.h"
#include "scene/RangedDirectionalLight.h"
#include "scene/RenderScene.h"
#include "scene/Shadow.h"
#include "scene/SphereLight.h"
#include "scene/SpotLight.h"

namespace cc {
namespace pipeline {

RenderAdditiveLightQueue::RenderAdditiveLightQueue(RenderPipeline *pipeline) : _pipeline(pipeline) {
    auto *device = gfx::Device::getInstance();
    const auto alignment = device->getCapabilities().uboOffsetAlignment;
    _lightBufferStride = ((UBOForwardLight::SIZE + alignment - 1) / alignment) * alignment;
    _lightBufferElementCount = _lightBufferStride / sizeof(float);
    _lightBuffer = device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        _lightBufferStride * _lightBufferCount,
        _lightBufferStride,
    });
    _firstLightBufferView = device->createBuffer({_lightBuffer, 0, UBOForwardLight::SIZE});
    _lightBufferData.resize(static_cast<size_t>(_lightBufferElementCount) * _lightBufferCount);
    _dynamicOffsets.resize(1, 0);
    _phaseID = getPhaseID("forward-add");
    _shadowUBO.fill(0.F);
}

void RenderAdditiveLightQueue::recordCommandBuffer(gfx::Device *device, scene::Camera *camera, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    const uint32_t offset = _pipeline->getPipelineUBO()->getCurrentCameraUBOOffset();
    for (uint32_t i = 0; i < _instancedQueues.size(); ++i) {
        const auto *light = _instancedLightPass.lights[i];
        _dynamicOffsets[0] = _instancedLightPass.dynamicOffsets[i];
        auto *globalDescriptorSet = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(light);
        _instancedQueues[i]->recordCommandBuffer(device, renderPass, cmdBuffer, globalDescriptorSet, offset, &_dynamicOffsets);
    }

    const bool enableOcclusionQuery = _pipeline->isOcclusionQueryEnabled();
    for (const auto &lightPass : _lightPasses) {
        const auto *const subModel = lightPass.subModel;

        if (!enableOcclusionQuery || !_pipeline->isOccluded(camera, subModel)) {
            const auto *pass = lightPass.pass;
            const auto &dynamicOffsets = lightPass.dynamicOffsets;
            auto *shader = lightPass.shader;
            const auto lights = lightPass.lights;
            auto *ia = subModel->getInputAssembler();
            auto *pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);
            auto *descriptorSet = subModel->getDescriptorSet();

            cmdBuffer->bindPipelineState(pso);
            cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            cmdBuffer->bindInputAssembler(ia);

            for (size_t i = 0; i < dynamicOffsets.size(); ++i) {
                const auto *light = lights[i];
                auto *globalDescriptorSet = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(light);
                _dynamicOffsets[0] = dynamicOffsets[i];
                cmdBuffer->bindDescriptorSet(globalSet, globalDescriptorSet, 1, &offset);
                cmdBuffer->bindDescriptorSet(localSet, descriptorSet, _dynamicOffsets);
                cmdBuffer->draw(ia);
            }
        }
    }
}

void RenderAdditiveLightQueue::gatherLightPasses(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    static ccstd::vector<uint32_t> lightPassIndices;

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
        for (const auto &subModel : model->getSubModels()) {
            const auto lightPassIdx = lightPassIndices[i];
            if (lightPassIdx == UINT_MAX) continue;
            auto *pass = subModel->getPass(lightPassIdx);
            if (pass == nullptr) continue;

            const bool isTransparent = subModel->getPass(0)->getBlendState()->targets[0].blend;
            if (isTransparent) {
                continue;
            }
            auto *descriptorSet = subModel->getDescriptorSet();
            descriptorSet->bindBuffer(UBOForwardLight::BINDING, _firstLightBufferView);
            descriptorSet->update();

            addRenderQueue(subModel, model, pass, lightPassIdx);

            ++i;
        }
    }

    // only for instanced and batched, no light culling applied
    for (uint32_t l = 0; l < _validPunctualLights.size(); l++) {
        const auto *light = _validPunctualLights[l];
        _instancedLightPass.lights.emplace_back(light);
        _instancedLightPass.dynamicOffsets.emplace_back(_lightBufferStride * l);
    }
    for (const auto &instancedQueue : _instancedQueues) {
        instancedQueue->uploadBuffers(cmdBuffer);
    }
}

void RenderAdditiveLightQueue::clear() {
    for (const auto &instancedQueue : _instancedQueues) {
        instancedQueue->clear();
    }
    _instancedQueues.clear();

    for (auto lightPass : _lightPasses) {
        lightPass.dynamicOffsets.clear();
        lightPass.lights.clear();
    }
    _lightPasses.clear();

    _instancedLightPass.dynamicOffsets.clear();
    _instancedLightPass.lights.clear();
}

bool RenderAdditiveLightQueue::cullSphereLight(const scene::SphereLight *light, const scene::Model *model) {
    return model->getWorldBounds() && !model->getWorldBounds()->aabbAabb(light->getAABB());
}

bool RenderAdditiveLightQueue::cullSpotLight(const scene::SpotLight *light, const scene::Model *model) {
    return model->getWorldBounds() && (!model->getWorldBounds()->aabbAabb(light->getAABB()) || !model->getWorldBounds()->aabbFrustum(light->getFrustum()));
}

bool RenderAdditiveLightQueue::cullPointLight(const scene::PointLight *light, const scene::Model *model) {
    return model->getWorldBounds() && !model->getWorldBounds()->aabbAabb(light->getAABB());
}

bool RenderAdditiveLightQueue::cullRangedDirLight(const scene::RangedDirectionalLight *light, const scene::Model *model) {
    geometry::AABB rangedDirLightBoundingBox(0.0F, 0.0F, 0.0F, 0.5F, 0.5F, 0.5F);
    light->getNode()->updateWorldTransform();
    rangedDirLightBoundingBox.transform(light->getNode()->getWorldMatrix(), &rangedDirLightBoundingBox);
    return model->getWorldBounds() && (!model->getWorldBounds()->aabbAabb(rangedDirLightBoundingBox));
}

void RenderAdditiveLightQueue::addRenderQueue(scene::SubModel *subModel, const scene::Model *model, scene::Pass *pass, uint32_t lightPassIdx) {
    const auto lightCount = _lightIndices.size();
    const auto batchingScheme = pass->getBatchingScheme();

    AdditiveLightPass lightPass;
    if (batchingScheme == scene::BatchingSchemes::NONE) {
        lightPass.subModel = subModel;
        lightPass.pass = pass;
        lightPass.shader = subModel->getShader(lightPassIdx);
        lightPass.dynamicOffsets.resize(lightCount);
    }

    for (uint32_t i = 0; i < lightCount; ++i) {
        const auto lightIdx = _lightIndices[i];
        const auto *light = _validPunctualLights[lightIdx];
        const auto visibility = light->getVisibility();
        if ((visibility & model->getNode()->getLayer()) == model->getNode()->getLayer()) {
            switch (batchingScheme) {
                case scene::BatchingSchemes::INSTANCING: {
                    auto *buffer = pass->getInstancedBuffer(i);
                    buffer->merge(subModel, lightPassIdx);
                    buffer->setDynamicOffset(0, _lightBufferStride);
                    if (i >= _instancedQueues.size()) {
                        _instancedQueues.emplace_back(ccnew RenderInstancedQueue());
                    }
                    _instancedQueues[i]->add(buffer);
                } break;
                case scene::BatchingSchemes::NONE: {
                    lightPass.lights.emplace_back(light);
                    lightPass.dynamicOffsets[i] = _lightBufferStride * lightIdx;
                } break;
            }
        } else {
            lightPass.dynamicOffsets.clear();
        }
    }

    if (batchingScheme == scene::BatchingSchemes::NONE) {
        _lightPasses.emplace_back(std::move(lightPass));
    }
}

void RenderAdditiveLightQueue::updateUBOs(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    const auto exposure = camera->getExposure();
    const auto validLightCount = _validPunctualLights.size();
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto *shadowInfo = sceneData->getShadows();

    size_t offset = 0;
    if (validLightCount > _lightBufferCount) {
        _lightBufferCount = nextPow2(static_cast<uint32_t>(validLightCount));
        _lightBuffer->resize(utils::toUint(_lightBufferStride * _lightBufferCount));
        _lightBufferData.resize(static_cast<size_t>(_lightBufferElementCount) * _lightBufferCount);

        auto *device = gfx::Device::getInstance();
        _firstLightBufferView = device->createBuffer({_lightBuffer, 0, UBOForwardLight::SIZE});
    }

    for (unsigned l = 0; l < validLightCount; l++, offset += _lightBufferElementCount) {
        const auto *light = _validPunctualLights[l];
        Vec3 position = Vec3(0.0F, 0.0F, 0.0F);
        float size = 0.F;
        float range = 0.F;
        float luminanceHDR = 0.F;
        float luminanceLDR = 0.F;
        if (light->getType() == scene::LightType::SPHERE) {
            const auto *sphereLight = static_cast<const scene::SphereLight *>(light);
            position = sphereLight->getPosition();
            size = sphereLight->getSize();
            range = sphereLight->getRange();
            luminanceHDR = sphereLight->getLuminanceHDR();
            luminanceLDR = sphereLight->getLuminanceLDR();
        } else if (light->getType() == scene::LightType::SPOT) {
            const auto *spotLight = static_cast<const scene::SpotLight *>(light);
            position = spotLight->getPosition();
            size = spotLight->getSize();
            range = spotLight->getRange();
            luminanceHDR = spotLight->getLuminanceHDR();
            luminanceLDR = spotLight->getLuminanceLDR();
        } else if (light->getType() == scene::LightType::POINT) {
            const auto *pointLight = static_cast<const scene::PointLight *>(light);
            position = pointLight->getPosition();
            size = 0.0F;
            range = pointLight->getRange();
            luminanceHDR = pointLight->getLuminanceHDR();
            luminanceLDR = pointLight->getLuminanceLDR();
        } else if (light->getType() == scene::LightType::RANGED_DIRECTIONAL) {
            const auto *rangedDirLight = static_cast<const scene::RangedDirectionalLight *>(light);
            position = rangedDirLight->getPosition();
            size = 0.0F;
            range = 0.0F;
            luminanceHDR = rangedDirLight->getIlluminanceHDR();
            luminanceLDR = rangedDirLight->getIlluminanceLDR();
        }
        auto index = offset + UBOForwardLight::LIGHT_POS_OFFSET;
        _lightBufferData[index++] = position.x;
        _lightBufferData[index++] = position.y;
        _lightBufferData[index] = position.z;

        index = offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET;
        _lightBufferData[index++] = size;
        _lightBufferData[index] = range;

        index = offset + UBOForwardLight::LIGHT_COLOR_OFFSET;
        const auto &color = light->getColor();
        if (light->isUseColorTemperature()) {
            const auto &tempRGB = light->getColorTemperatureRGB();
            _lightBufferData[index++] = color.x * tempRGB.x;
            _lightBufferData[index++] = color.y * tempRGB.y;
            _lightBufferData[index++] = color.z * tempRGB.z;
        } else {
            _lightBufferData[index++] = color.x;
            _lightBufferData[index++] = color.y;
            _lightBufferData[index++] = color.z;
        }

        if (sceneData->isHDR()) {
            _lightBufferData[index] = luminanceHDR * exposure * _lightMeterScale;
        } else {
            _lightBufferData[index] = luminanceLDR;
        }

        switch (light->getType()) {
            case scene::LightType::SPHERE:
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3] = static_cast<float>(scene::LightType::SPHERE);
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;
                break;
            case scene::LightType::SPOT: {
                const auto *spotLight = static_cast<const scene::SpotLight *>(light);
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3] = static_cast<float>(scene::LightType::SPOT);
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = spotLight->getSpotAngle();
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = (shadowInfo->isEnabled() &&
                                                                                                 spotLight->isShadowEnabled() &&
                                                                                                 shadowInfo->getType() == scene::ShadowType::SHADOW_MAP)
                                                                                                    ? 1.0F
                                                                                                    : 0.0F;

                index = offset + UBOForwardLight::LIGHT_DIR_OFFSET;
                const auto &direction = spotLight->getDirection();
                _lightBufferData[index++] = direction.x;
                _lightBufferData[index++] = direction.y;
                _lightBufferData[index] = direction.z;

                _lightBufferData[offset + UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 0] = 0.0F;
                _lightBufferData[offset + UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 1] = 0.0F;
                _lightBufferData[offset + UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 2] = 0.0F;
                _lightBufferData[offset + UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 3] = spotLight->getAngleAttenuationStrength();
            } break;
            case scene::LightType::POINT:
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3] = static_cast<float>(scene::LightType::POINT);
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;
                break;
            case scene::LightType::RANGED_DIRECTIONAL: {
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3] = static_cast<float>(scene::LightType::RANGED_DIRECTIONAL);

                const auto *rangedDirLight = static_cast<const scene::RangedDirectionalLight *>(light);
                const Vec3 &right = rangedDirLight->getRight();
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 0] = right.x;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 1] = right.y;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = right.z;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;

                const auto &direction = rangedDirLight->getDirection();
                _lightBufferData[offset + UBOForwardLight::LIGHT_DIR_OFFSET + 0] = direction.x;
                _lightBufferData[offset + UBOForwardLight::LIGHT_DIR_OFFSET + 1] = direction.y;
                _lightBufferData[offset + UBOForwardLight::LIGHT_DIR_OFFSET + 2] = direction.z;
                _lightBufferData[offset + UBOForwardLight::LIGHT_DIR_OFFSET + 3] = 0;

                const auto &scale = rangedDirLight->getScale();
                _lightBufferData[offset + UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 0] = scale.x * 0.5F;
                _lightBufferData[offset + UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 1] = scale.y * 0.5F;
                _lightBufferData[offset + UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 2] = scale.z * 0.5F;
                _lightBufferData[offset + UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 3] = 0;
            } break;
            default:
                break;
        }
    }

    cmdBuffer->updateBuffer(_lightBuffer, _lightBufferData.data(), static_cast<uint32_t>(_lightBufferData.size() * sizeof(float)));
}

void RenderAdditiveLightQueue::updateLightDescriptorSet(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    const auto *sceneData = _pipeline->getPipelineSceneData();
    auto *shadowInfo = sceneData->getShadows();
    const auto *const scene = camera->getScene();
    const auto *device = gfx::Device::getInstance();
    const bool hFTexture = supportsR32FloatTexture(device);
    const float packing = hFTexture ? 0.0F : 1.0F;
    const scene::Light *mainLight = scene->getMainLight();
    const auto cap = _pipeline->getDevice()->getCapabilities();

    for (const auto *light : _validPunctualLights) {
        auto *descriptorSet = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(light);
        if (!descriptorSet) {
            continue;
        }

        _shadowUBO.fill(0.0F);

        switch (light->getType()) {
            case scene::LightType::SPHERE: {
                // update planar PROJ
                if (mainLight) {
                    PipelineUBO::updatePlanarNormalAndDistance(shadowInfo, &_shadowUBO);
                }

                // Reserve sphere light shadow interface
                const auto &shadowSize = shadowInfo->getSize();
                float shadowWHPBInfos[4] = {shadowSize.x, shadowSize.y, 1.0F, 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(float) * 4);

                float shadowLPNNInfos[4] = {static_cast<float>(scene::LightType::SPHERE), packing, 0.0F, 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(float) * 4);
            } break;
            case scene::LightType::SPOT: {
                const auto *spotLight = static_cast<const scene::SpotLight *>(light);
                // update planar PROJ
                if (mainLight) {
                    PipelineUBO::updatePlanarNormalAndDistance(shadowInfo, &_shadowUBO);
                }

                const auto &matShadowCamera = light->getNode()->getWorldMatrix();
                const auto matShadowView = matShadowCamera.getInversed();

                cc::Mat4 matShadowProj;
                cc::Mat4::createPerspective(spotLight->getAngle(), 1.0F, 0.001F, spotLight->getRange(), true, cap.clipSpaceMinZ, cap.clipSpaceSignY, 0, &matShadowProj);
                cc::Mat4 matShadowViewProj = matShadowProj;
                cc::Mat4 matShadowInvProj = matShadowProj;
                matShadowInvProj.inverse();

                matShadowViewProj.multiply(matShadowView);

                memcpy(_shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_OFFSET, matShadowView.m, sizeof(matShadowView));
                memcpy(_shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));

                // shadow info
                float shadowNFLSInfos[4] = {0.1F, spotLight->getRange(), 0.0F, 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

                const auto &shadowSize = shadowInfo->getSize();
                float shadowWHPBInfos[4] = {shadowSize.x, shadowSize.y, spotLight->getShadowPcf(), spotLight->getShadowBias()};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(shadowWHPBInfos));

                float shadowLPNNInfos[4] = {static_cast<float>(scene::LightType::SPOT), packing, spotLight->getShadowNormalBias(), 0.0F};
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
                        descriptorSet->bindTexture(SPOTSHADOWMAP::BINDING, texture);
                    }
                }
            } break;
            case scene::LightType::POINT: {
                // update planar PROJ
                if (mainLight) {
                    PipelineUBO::updatePlanarNormalAndDistance(shadowInfo, &_shadowUBO);
                }

                // Reserve point light shadow interface
                const auto &shadowSize = shadowInfo->getSize();
                float shadowWHPBInfos[4] = {shadowSize.x, shadowSize.y, 1.0F, 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(float) * 4);

                float shadowLPNNInfos[4] = {static_cast<float>(scene::LightType::POINT), packing, 0.0F, 0.0F};
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(float) * 4);
            } break;
            default:
                break;
        }

        memcpy(_shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, shadowInfo->getShadowColor4f().data(), sizeof(float) * 4);

        descriptorSet->update();

        cmdBuffer->updateBuffer(descriptorSet->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
    }
}

bool RenderAdditiveLightQueue::getLightPassIndex(const scene::Model *model, ccstd::vector<uint32_t> *lightPassIndices) const {
    lightPassIndices->clear();
    bool hasValidLightPass = false;

    for (const auto &subModel : model->getSubModels()) {
        int lightPassIndex = 0;
        for (const auto &pass : *(subModel->getPasses())) {
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
            case scene::LightType::POINT:
                isCulled = cullSphereLight(static_cast<const scene::SphereLight *>(light), model);
                break;
            case scene::LightType::RANGED_DIRECTIONAL:
                isCulled = cullRangedDirLight(static_cast<const scene::RangedDirectionalLight *>(light), model);
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
