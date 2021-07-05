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

#include "PipelineUBO.h"
#include "RenderPipeline.h"
#include "SceneCulling.h"
#include "gfx-base/GFXDevice.h"
#include "platform/Application.h"
#include "scene/RenderScene.h"

namespace cc {

namespace pipeline {

#define TO_VEC3(dst, src, offset)  \
    (dst)[(offset) + 0] = (src).x; \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z;
#define TO_VEC4(dst, src, offset)  \
    (dst)[(offset) + 0] = (src).x; \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z; \
    (dst)[(offset) + 3] = (src).w;

Mat4 matShadowViewProj;

void PipelineUBO::updateGlobalUBOView(const RenderPipeline * /*pipeline*/, std::array<float, UBOGlobal::COUNT> *bufferView) {
    auto *const root          = scene::Root::instance;
    auto *      device        = gfx::Device::getInstance();
    auto &      uboGlobalView = *bufferView;

    const auto shadingWidth  = std::floor(device->getWidth());
    const auto shadingHeight = std::floor(device->getHeight());

    // update UBOGlobal
    uboGlobalView[UBOGlobal::TIME_OFFSET + 0] = root->cumulativeTime;
    uboGlobalView[UBOGlobal::TIME_OFFSET + 1] = root->frameTime;
    uboGlobalView[UBOGlobal::TIME_OFFSET + 2] = static_cast<float>(Application::getInstance()->getTotalFrames());

    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 0] = static_cast<float>(device->getWidth());
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 1] = static_cast<float>(device->getHeight());
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 2] = 1.0F / uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 3] = 1.0F / uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 1];

    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 0] = static_cast<float>(shadingWidth);
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1] = static_cast<float>(shadingHeight);
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 2] = 1.0F / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 3] = 1.0F / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1];
}

void PipelineUBO::updateCameraUBOView(const RenderPipeline *pipeline, std::array<float, UBOCamera::COUNT> *bufferView,
                                      const scene::Camera *camera) {
    const auto *const              scene         = camera->scene;
    const scene::DirectionalLight *mainLight     = scene->getMainLight();
    auto *                         sceneData     = pipeline->getPipelineSceneData();
    auto *const                    sharedData    = sceneData->getSharedData();
    const auto                     fpScale       = sharedData->fpScale;
    auto *const                    descriptorSet = pipeline->getDescriptorSet();
    auto *                         ambient       = sharedData->ambient;
    auto *                         fog           = sharedData->fog;
    const auto                     isHDR         = sharedData->isHDR;
    const auto                     shadingScale  = sharedData->shadingScale;

    auto *device        = gfx::Device::getInstance();
    auto &uboCameraView = *bufferView;

    const auto shadingWidth  = std::floor(device->getWidth());
    const auto shadingHeight = std::floor(device->getHeight());

    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 0] = static_cast<float>(camera->width / shadingWidth * shadingScale);
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 1] = static_cast<float>(camera->height / shadingHeight * shadingScale);
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 2] = 1.0F / uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET];
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 3] = 1.0F / uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 1];

    const auto exposure                           = camera->exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 0] = exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 1] = 1.0F / exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 2] = isHDR ? 1.0F : 0.0F;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 3] = fpScale / exposure;

    if (mainLight) {
        TO_VEC3(uboCameraView, mainLight->getDirection(), UBOCamera::MAIN_LIT_DIR_OFFSET);
        TO_VEC3(uboCameraView, mainLight->getColor(), UBOCamera::MAIN_LIT_COLOR_OFFSET);
        if (mainLight->getUseColorTemperature()) {
            const auto &colorTempRGB = mainLight->getColorTemperatureRGB();
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 0] *= colorTempRGB.x;
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
        }

        if (isHDR) {
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->getIlluminance() * fpScale;
        } else {
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->getIlluminance() * exposure;
        }
    } else {
        TO_VEC3(uboCameraView, Vec3::UNIT_Z, UBOCamera::MAIN_LIT_DIR_OFFSET);
        TO_VEC4(uboCameraView, Vec4::ZERO, UBOCamera::MAIN_LIT_COLOR_OFFSET);
    }

    Vec4 skyColor = ambient->skyColor;
    if (isHDR) {
        skyColor.w = ambient->skyIllum * fpScale;
    } else {
        skyColor.w = ambient->skyIllum * exposure;
    }
    TO_VEC4(uboCameraView, skyColor, UBOCamera::AMBIENT_SKY_OFFSET);

    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 0] = ambient->groundAlbedo.x;
    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 1] = ambient->groundAlbedo.y;
    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 2] = ambient->groundAlbedo.z;
    auto *const envmap                                  = descriptorSet->getTexture(static_cast<uint>(PipelineGlobalBindings::SAMPLER_ENVIRONMENT));
    if (envmap) {
        uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 3] = static_cast<float>(envmap->getLevelCount());
    }

    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_OFFSET, camera->matView.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_INV_OFFSET, camera->node->getWorldMatrix().m, sizeof(cc::Mat4));
    TO_VEC3(uboCameraView, camera->position, UBOCamera::CAMERA_POS_OFFSET);

    memcpy(uboCameraView.data() + UBOCamera::MAT_PROJ_OFFSET, camera->matProj.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_PROJ_INV_OFFSET, camera->matProjInv.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_PROJ_OFFSET, camera->matViewProj.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_PROJ_INV_OFFSET, camera->matViewProjInv.m, sizeof(cc::Mat4));
    uboCameraView[UBOCamera::CAMERA_POS_OFFSET + 3] = getCombineSignY();

    if (fog->enabled) {
        TO_VEC4(uboCameraView, fog->color, UBOCamera::GLOBAL_FOG_COLOR_OFFSET);

        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 0] = fog->start;
        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 1] = fog->end;
        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 2] = fog->density;

        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 0] = fog->top;
        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 1] = fog->range;
        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 2] = fog->atten;
    }
}

void PipelineUBO::updateShadowUBOView(const RenderPipeline *pipeline, std::array<float, UBOShadow::COUNT> *bufferView, const scene::Camera *camera) {
    const auto *const              scene     = camera->scene;
    const scene::DirectionalLight *mainLight = scene->getMainLight();

    auto *      device     = gfx::Device::getInstance();
    auto *const sceneData  = pipeline->getPipelineSceneData();
    auto *const shadowInfo = sceneData->getSharedData()->shadow;
    auto &      shadowUBO  = *bufferView;
    auto *      sphere     = sceneData->getSphere();

    if (shadowInfo->enabled) {
        if (mainLight && shadowInfo->shadowType == scene::ShadowType::SHADOWMAP) {
            auto *const node = mainLight->getNode();
            cc::Mat4          matShadowCamera;

            // light proj
            float x;
            float y;
            float farClamp;
            if (shadowInfo->autoAdapt) {
                Vec3 tmpCenter;
                getShadowWorldMatrix(sphere, node->getWorldRotation(), mainLight->getDirection(), &matShadowCamera, &tmpCenter);

                const float radius = sphere->getRadius();
                x                  = radius * shadowInfo->aspect;
                y                  = radius;

                const float halfFar = tmpCenter.distance(sphere->getCenter());
                farClamp            = std::min(halfFar * COEFFICIENT_OF_EXPANSION, SHADOW_CAMERA_MAX_FAR);
            } else {
                matShadowCamera = mainLight->getNode()->getWorldMatrix();

                x = shadowInfo->orthoSize * shadowInfo->aspect;
                y = shadowInfo->orthoSize;

                farClamp = shadowInfo->farValue;
            }
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_OFFSET, matShadowCamera.m, sizeof(matShadowCamera));

            const auto matShadowView  = matShadowCamera.getInversed();
            const auto projectionSinY = device->getCapabilities().clipSpaceSignY;
            Mat4::createOrthographicOffCenter(-x, x, -y, y, shadowInfo->nearValue, farClamp, device->getCapabilities().clipSpaceMinZ, projectionSinY, &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));

            const auto isSupportHalfFloat = supportsHalfFloatTexture(device);
            const auto linear             = (static_cast<bool>(shadowInfo->linear) && isSupportHalfFloat) ? 1.0F : 0.0F;
            float      shadowNFLSInfos[4] = {shadowInfo->nearValue, farClamp, linear, static_cast<float>(shadowInfo->selfShadow)};
            memcpy(shadowUBO.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

            float shadowWHPBInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, static_cast<float>(shadowInfo->pcfType), shadowInfo->bias};
            memcpy(shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(shadowWHPBInfos));

            const auto packing            = static_cast<bool>(shadowInfo->packing) ? 1.0F : (isSupportHalfFloat ? 0.0F : 1.0F);
            float      shadowLPNNInfos[4] = {0.0F, packing, shadowInfo->normalBias, 0.0F};
            memcpy(shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(shadowLPNNInfos));
        } else if (mainLight && shadowInfo->shadowType == scene::ShadowType::PLANAR) {
            updateDirLight(shadowInfo, mainLight, &shadowUBO);
        }

        const float color[4] = {shadowInfo->color.x, shadowInfo->color.y, shadowInfo->color.z, shadowInfo->color.w};
        memcpy(shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &color, sizeof(float) * 4);
    }
}

void PipelineUBO::updateShadowUBOLightView(const RenderPipeline *pipeline, std::array<float, UBOShadow::COUNT> *bufferView, const scene::Light *light) {
    auto *const sceneData          = pipeline->getPipelineSceneData();
    auto *      shadowInfo         = sceneData->getSharedData()->shadow;
    auto *      device             = gfx::Device::getInstance();
    auto *      sphere             = sceneData->getSphere();
    auto &      shadowUBO          = *bufferView;
    const auto  isTextureHalfFloat = device->hasFeature(cc::gfx::Feature::TEXTURE_HALF_FLOAT);
    const auto  linear             = (static_cast<bool>(shadowInfo->linear) && isTextureHalfFloat) ? 1.0F : 0.0F;
    const auto  packing            = static_cast<bool>(shadowInfo->packing) ? 1.0F : (isTextureHalfFloat ? 0.0F : 1.0F);
    switch (light->getType()) {
        case scene::LightType::DIRECTIONAL: {
            const auto *directionalLight = static_cast<const scene::DirectionalLight *>(light);
            cc::Mat4    matShadowCamera;

            float x;
            float y;
            float farClamp;
            if (shadowInfo->autoAdapt) {
                Vec3 tmpCenter;
                getShadowWorldMatrix(sphere, directionalLight->getNode()->getWorldRotation(), directionalLight->getDirection(), &matShadowCamera, &tmpCenter);

                const auto radius = sphere->getRadius();
                x                 = radius * shadowInfo->aspect;
                y                 = radius;

                const float halfFar = tmpCenter.distance(sphere->getCenter());
                farClamp            = std::min(halfFar * COEFFICIENT_OF_EXPANSION, SHADOW_CAMERA_MAX_FAR);
            } else {
                matShadowCamera = light->getNode()->getWorldMatrix();

                x = shadowInfo->orthoSize * shadowInfo->aspect;
                y = shadowInfo->orthoSize;

                farClamp = shadowInfo->farValue;
            }
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_OFFSET, matShadowCamera.m, sizeof(matShadowCamera));

            const auto matShadowView  = matShadowCamera.getInversed();
            const auto projectionSinY = device->getCapabilities().clipSpaceSignY;
            Mat4::createOrthographicOffCenter(-x, x, -y, y, shadowInfo->nearValue, farClamp, device->getCapabilities().clipSpaceMinZ, projectionSinY, &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));

            float shadowNFLSInfos[4] = {shadowInfo->nearValue, farClamp, linear, static_cast<float>(shadowInfo->selfShadow)};
            memcpy(shadowUBO.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

            float shadowLPNNInfos[4] = {0.0F, packing, shadowInfo->normalBias, 0.0F};
            memcpy(shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(shadowLPNNInfos));
        } break;
        case scene::LightType::SPOT: {
            const auto *spotLight       = static_cast<const scene::SpotLight *>(light);
            const auto &matShadowCamera = spotLight->getNode()->getWorldMatrix();
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_OFFSET, matShadowCamera.m, sizeof(matShadowCamera));

            const auto matShadowView = matShadowCamera.getInversed();
            cc::Mat4::createPerspective(spotLight->getSpotAngle(), spotLight->getAspect(), 0.001F, spotLight->getRange(), &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));

            float shadowNFLSInfos[4] = {0.01F, spotLight->getRange(), linear, static_cast<float>(shadowInfo->selfShadow)};
            memcpy(shadowUBO.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

            float shadowLPNNInfos[4] = {1.0F, packing, shadowInfo->normalBias, 0.0F};
            memcpy(shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(shadowLPNNInfos));
        } break;
        default:
            break;
    }

    float shadowWHPBInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, static_cast<float>(shadowInfo->pcfType), shadowInfo->bias};
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(shadowWHPBInfos));

    const float color[4] = {shadowInfo->color.x, shadowInfo->color.y, shadowInfo->color.z, shadowInfo->color.w};
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &color, sizeof(float) * 4);
}

static uint8_t combineSignY = 0;
uint8_t        PipelineUBO::getCombineSignY() {
    return combineSignY;
}

void PipelineUBO::initCombineSignY() {
    const float screenSpaceSignY = _device->getCapabilities().screenSpaceSignY * 0.5F + 0.5F;
    const float clipSpaceSignY   = _device->getCapabilities().clipSpaceSignY * 0.5F + 0.5F;
    combineSignY                 = static_cast<uint8_t>(screenSpaceSignY) << 1 | static_cast<uint8_t>(clipSpaceSignY);
}

void PipelineUBO::activate(gfx::Device *device, RenderPipeline *pipeline) {
    _device   = device;
    _pipeline = pipeline;

    auto *descriptorSet = pipeline->getDescriptorSet();
    initCombineSignY();
    auto *globalUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOGlobal::SIZE,
        UBOGlobal::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    descriptorSet->bindBuffer(UBOGlobal::BINDING, globalUBO);
    _ubos.push_back(globalUBO);

    auto *cameraUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOCamera::SIZE,
        UBOCamera::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    descriptorSet->bindBuffer(UBOCamera::BINDING, cameraUBO);
    _ubos.push_back(cameraUBO);

    auto *shadowUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOShadow::SIZE,
        UBOShadow::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    descriptorSet->bindBuffer(UBOShadow::BINDING, shadowUBO);
    _ubos.push_back(shadowUBO);
}

void PipelineUBO::destroy() {
    for (auto &ubo : _ubos) {
        CC_SAFE_DESTROY(ubo);
    }
    _ubos.clear();
}

void PipelineUBO::updateGlobalUBO() {
    auto *const globalDSManager = _pipeline->getGlobalDSManager();
    auto *const ds              = _pipeline->getDescriptorSet();
    ds->update();
    PipelineUBO::updateGlobalUBOView(_pipeline, &_globalUBO);
    ds->getBuffer(UBOGlobal::BINDING)->update(_globalUBO.data(), UBOGlobal::SIZE);

    globalDSManager->bindBuffer(UBOGlobal::BINDING, ds->getBuffer(UBOGlobal::BINDING));
    globalDSManager->update();
}

void PipelineUBO::updateCameraUBO(const scene::Camera *camera) {
    auto *const globalDSManager = _pipeline->getGlobalDSManager();
    auto *const ds              = _pipeline->getDescriptorSet();
    auto *const cmdBuffer       = _pipeline->getCommandBuffers()[0];
    PipelineUBO::updateCameraUBOView(_pipeline, &_cameraUBO, camera);
    cmdBuffer->updateBuffer(ds->getBuffer(UBOCamera::BINDING), _cameraUBO.data(), UBOCamera::SIZE);

    globalDSManager->bindBuffer(UBOCamera::BINDING, ds->getBuffer(UBOCamera::BINDING));
    globalDSManager->update();
}

void PipelineUBO::updateMultiCameraUBO(const vector<scene::Camera *> &cameras) {
    auto *const ds           = _pipeline->getDescriptorSet();
    auto *      device       = _pipeline->getDevice();
    auto        uboAlignment = device->getCapabilities().uboOffsetAlignment;
    _alignedCameraUBOSize    = static_cast<uint>(std::ceil(UBOCamera::SIZE / static_cast<float>(uboAlignment))) * uboAlignment;
    auto cameraCount         = cameras.size();
    auto totalUboSize        = static_cast<uint>(_alignedCameraUBOSize * cameraCount);

    _cameraUBOs.resize(totalUboSize);
    _currentCameraUBOOffset = 0;
    for (uint cameraIdx = 0; cameraIdx < cameraCount; ++cameraIdx) {
        auto *camera = cameras[cameraIdx];
        PipelineUBO::updateCameraUBOView(_pipeline, &_cameraUBO, camera);
        auto offset = cameraIdx * _alignedCameraUBOSize;
        memcpy(&_cameraUBOs[offset], _cameraUBO.data(), UBOCamera::SIZE);
    }
    auto *uboBuffer = ds->getBuffer(UBOCamera::BINDING);
    if (uboBuffer->getSize() < totalUboSize) {
        uboBuffer->resize(totalUboSize);
    }
    uboBuffer->update(_cameraUBOs.data(), totalUboSize);

    ds->bindBuffer(UBOCamera::BINDING, uboBuffer);
    ds->update();
}

void PipelineUBO::updateShadowUBO(const scene::Camera *camera) {
    auto *const       ds         = _pipeline->getDescriptorSet();
    auto *const       cmdBuffer  = _pipeline->getCommandBuffers()[0];
    auto *const       sceneData  = _pipeline->getPipelineSceneData();
    auto *const       shadowInfo = sceneData->getSharedData()->shadow;
    const auto *const scene      = camera->scene;
    if (!shadowInfo->enabled) return;

    const auto &                   shadowFrameBufferMap = sceneData->getShadowFramebufferMap();
    const scene::DirectionalLight *mainLight            = scene->getMainLight();
    ds->update();
    if (mainLight && shadowInfo->shadowType == scene::ShadowType::SHADOWMAP) {
        if (shadowFrameBufferMap.count(mainLight) > 0) {
            auto *texture = shadowFrameBufferMap.at(mainLight)->getColorTextures()[0];
            if (texture) {
                ds->bindTexture(SHADOWMAP::BINDING, texture);
            }
        }
    }
    PipelineUBO::updateShadowUBOView(_pipeline, &_shadowUBO, camera);
    cmdBuffer->updateBuffer(ds->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
}

void PipelineUBO::updateShadowUBOLight(const scene::Light *light) {
    auto *const ds        = _pipeline->getDescriptorSet();
    auto *const cmdBuffer = _pipeline->getCommandBuffers()[0];
    PipelineUBO::updateShadowUBOLightView(_pipeline, &_shadowUBO, light);
    cmdBuffer->updateBuffer(ds->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
}

void PipelineUBO::updateShadowUBORange(uint offset, const Mat4 *data) {
    memcpy(_shadowUBO.data() + offset, data->m, sizeof(*data));
}

uint PipelineUBO::getCurrentCameraUBOOffset() const {
    return _currentCameraUBOOffset;
}

void PipelineUBO::incCameraUBOOffset() {
    _currentCameraUBOOffset += _alignedCameraUBOSize;
}

} // namespace pipeline
} // namespace cc
