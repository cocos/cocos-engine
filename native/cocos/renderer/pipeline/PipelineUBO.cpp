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

#include "PipelineUBO.h"
#include "GlobalDescriptorSetManager.h"
#include "PipelineSceneData.h"
#include "RenderPipeline.h"
#include "SceneCulling.h"
#include "application/ApplicationManager.h"
#include "core/Root.h"
#include "gfx-base/GFXDevice.h"
#include "renderer/pipeline/shadow/CSMLayers.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/Fog.h"
#include "scene/ReflectionProbeManager.h"
#include "scene/RenderScene.h"
#include "scene/Shadow.h"
#include "scene/Skybox.h"
#include "scene/SpotLight.h"

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

void PipelineUBO::updateGlobalUBOView(const scene::Camera *camera, ccstd::array<float, UBOGlobal::COUNT> *bufferView) {
    const auto *const root = Root::getInstance();
    ccstd::array<float, UBOGlobal::COUNT> &uboGlobalView = *bufferView;

    const auto shadingWidth = std::floor(camera->getWindow()->getWidth());
    const auto shadingHeight = std::floor(camera->getWindow()->getHeight());

    // update UBOGlobal
    uboGlobalView[UBOGlobal::TIME_OFFSET + 0] = root->getCumulativeTime();
    uboGlobalView[UBOGlobal::TIME_OFFSET + 1] = root->getFrameTime();
    uboGlobalView[UBOGlobal::TIME_OFFSET + 2] = static_cast<float>(CC_CURRENT_ENGINE()->getTotalFrames());
    uboGlobalView[UBOGlobal::TIME_OFFSET + 3] = root->getCumulativeTime() - floorf(root->getFrameTime());

    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 0] = static_cast<float>(shadingWidth);
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 1] = static_cast<float>(shadingHeight);
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 2] = 1.0F / uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 3] = 1.0F / uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 1];

    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 0] = static_cast<float>(shadingWidth);
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1] = static_cast<float>(shadingHeight);
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 2] = 1.0F / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 3] = 1.0F / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1];

    uboGlobalView[UBOGlobal::PROBE_INFO_OFFSET + 0] = scene::ReflectionProbeManager::getInstance()->getMaxProbeId() + 1;

    auto *debugView = root->getDebugView();
    uboGlobalView[UBOGlobal::DEBUG_VIEW_MODE_OFFSET] = static_cast<float>(debugView->getSingleMode());

    for (int i = 1; i <= 3; ++i) {
        uboGlobalView[UBOGlobal::DEBUG_VIEW_MODE_OFFSET + i] = 0.0F;
    }
    for (int i = 0; i < static_cast<int>(pipeline::DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
        int offset = i >> 3;
        int bit = i % 8;
        uboGlobalView[UBOGlobal::DEBUG_VIEW_MODE_OFFSET + 1 + offset] += (debugView->isCompositeModeEnabled(i) ? 1.0F : 0.0F) * pow(10.0F, static_cast<float>(bit));
    }

    uboGlobalView[UBOGlobal::DEBUG_VIEW_MODE_OFFSET + 3] += (debugView->isLightingWithAlbedo() ? 1.0F : 0.0F) * pow(10.0F, 6.0F);
    uboGlobalView[UBOGlobal::DEBUG_VIEW_MODE_OFFSET + 3] += (debugView->isCsmLayerColoration() ? 1.0F : 0.0F) * pow(10.0F, 7.0F);
}

void PipelineUBO::updateCameraUBOView(const RenderPipeline *pipeline, float *output, const scene::Camera *camera) {
    updateCameraUBOView(pipeline, output, camera, camera->getScene());
}

void PipelineUBO::updateCameraUBOView(const RenderPipeline *pipeline, float *output, const scene::Camera *camera, const scene::RenderScene *scene) {
    const scene::DirectionalLight *mainLight = scene->getMainLight();
    const auto *sceneData = pipeline->getPipelineSceneData();
    const scene::Shadows *const shadowInfo = sceneData->getShadows();
    const auto *ambient = sceneData->getAmbient();
    auto *fog = sceneData->getFog();
    const auto isHDR = sceneData->isHDR();

    output[UBOCamera::SCREEN_SCALE_OFFSET + 0] = sceneData->getShadingScale();
    output[UBOCamera::SCREEN_SCALE_OFFSET + 1] = sceneData->getShadingScale();
    output[UBOCamera::SCREEN_SCALE_OFFSET + 2] = 1.0F / output[UBOCamera::SCREEN_SCALE_OFFSET];
    output[UBOCamera::SCREEN_SCALE_OFFSET + 3] = 1.0F / output[UBOCamera::SCREEN_SCALE_OFFSET + 1];

    const auto exposure = camera->getExposure();
    output[UBOCamera::EXPOSURE_OFFSET + 0] = exposure;
    output[UBOCamera::EXPOSURE_OFFSET + 1] = 1.0F / exposure;
    output[UBOCamera::EXPOSURE_OFFSET + 2] = isHDR ? 1.0F : 0.0F;
    output[UBOCamera::EXPOSURE_OFFSET + 3] = 1.0F / scene::Camera::getStandardExposureValue();

    if (mainLight) {
        const float shadowEnable = (mainLight->isShadowEnabled() && shadowInfo->getType() == scene::ShadowType::SHADOW_MAP) ? 1.0F : 0.0F;
        const Vec4 lightDir(mainLight->getDirection().x, mainLight->getDirection().y, mainLight->getDirection().z, shadowEnable);
        TO_VEC4(output, lightDir, UBOCamera::MAIN_LIT_DIR_OFFSET)
        TO_VEC3(output, mainLight->getColor(), UBOCamera::MAIN_LIT_COLOR_OFFSET)
        if (mainLight->isUseColorTemperature()) {
            const auto &colorTempRGB = mainLight->getColorTemperatureRGB();
            output[UBOCamera::MAIN_LIT_COLOR_OFFSET + 0] *= colorTempRGB.x;
            output[UBOCamera::MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
            output[UBOCamera::MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
        }

        if (isHDR) {
            output[UBOCamera::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->getIlluminanceHDR() * exposure;
        } else {
            output[UBOCamera::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->getIlluminanceLDR();
        }
    } else {
        const Vec4 lightDir(0.0F, 0.0F, 1.0F, 0.0F);
        TO_VEC4(output, lightDir, UBOCamera::MAIN_LIT_DIR_OFFSET)
        TO_VEC4(output, Vec4::ZERO, UBOCamera::MAIN_LIT_COLOR_OFFSET)
    }

    if (ambient != nullptr) {
        auto &skyColor = const_cast<scene::Ambient *>(ambient)->getSkyColor();
        if (isHDR) {
            skyColor.w = ambient->getSkyIllum() * exposure;
        } else {
            skyColor.w = ambient->getSkyIllum();
        }

        output[UBOCamera::AMBIENT_SKY_OFFSET + 0] = skyColor.x;
        output[UBOCamera::AMBIENT_SKY_OFFSET + 1] = skyColor.y;
        output[UBOCamera::AMBIENT_SKY_OFFSET + 2] = skyColor.z;
        output[UBOCamera::AMBIENT_SKY_OFFSET + 3] = skyColor.w;

        const auto &groundAlbedo = ambient->getGroundAlbedo();
        output[UBOCamera::AMBIENT_GROUND_OFFSET + 0] = groundAlbedo.x;
        output[UBOCamera::AMBIENT_GROUND_OFFSET + 1] = groundAlbedo.y;
        output[UBOCamera::AMBIENT_GROUND_OFFSET + 2] = groundAlbedo.z;
        output[UBOCamera::AMBIENT_GROUND_OFFSET + 3] = ambient->getMipmapCount();
    }

    // cjh TS doesn't have this logic ?    auto *const envmap = descriptorSet->getTexture(static_cast<uint32_t>(PipelineGlobalBindings::SAMPLER_ENVIRONMENT));
    //     if (envmap != nullptr) {
    //         output[UBOCamera::AMBIENT_GROUND_OFFSET + 3] = static_cast<float>(envmap->getLevelCount());
    //     }

    memcpy(output + UBOCamera::MAT_VIEW_OFFSET, camera->getMatView().m, sizeof(cc::Mat4));
    memcpy(output + UBOCamera::MAT_VIEW_INV_OFFSET, camera->getNode()->getWorldMatrix().m, sizeof(cc::Mat4));
    TO_VEC3(output, camera->getPosition(), UBOCamera::CAMERA_POS_OFFSET)

    memcpy(output + UBOCamera::MAT_PROJ_OFFSET, camera->getMatProj().m, sizeof(cc::Mat4));
    memcpy(output + UBOCamera::MAT_PROJ_INV_OFFSET, camera->getMatProjInv().m, sizeof(cc::Mat4));
    memcpy(output + UBOCamera::MAT_VIEW_PROJ_OFFSET, camera->getMatViewProj().m, sizeof(cc::Mat4));
    memcpy(output + UBOCamera::MAT_VIEW_PROJ_INV_OFFSET, camera->getMatViewProjInv().m, sizeof(cc::Mat4));
    output[UBOCamera::CAMERA_POS_OFFSET + 3] = getCombineSignY();

    output[UBOCamera::SURFACE_TRANSFORM_OFFSET + 0] = static_cast<float>(camera->getSurfaceTransform());
    output[UBOCamera::SURFACE_TRANSFORM_OFFSET + 1] = static_cast<float>(camera->getCameraUsage());
    const float angle = sceneData->getSkybox()->getRotationAngle();
    output[UBOCamera::SURFACE_TRANSFORM_OFFSET + 2] = static_cast<float>(cos(mathutils::toRadian(angle)));
    output[UBOCamera::SURFACE_TRANSFORM_OFFSET + 3] = static_cast<float>(sin(mathutils::toRadian(angle)));

    if (fog != nullptr) {
        const auto &colorTempRGB = fog->getColorArray();
        output[UBOCamera::GLOBAL_FOG_COLOR_OFFSET] = colorTempRGB.x;
        output[UBOCamera::GLOBAL_FOG_COLOR_OFFSET + 1] = colorTempRGB.y;
        output[UBOCamera::GLOBAL_FOG_COLOR_OFFSET + 2] = colorTempRGB.z;
        output[UBOCamera::GLOBAL_FOG_COLOR_OFFSET + 3] = colorTempRGB.z;

        output[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 0] = fog->getFogStart();
        output[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 1] = fog->getFogEnd();
        output[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 2] = fog->getFogDensity();

        output[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 0] = fog->getFogTop();
        output[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 1] = fog->getFogRange();
        output[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 2] = fog->getFogAtten();
    }

    output[UBOCamera::GLOBAL_NEAR_FAR_OFFSET + 0] = static_cast<float>(camera->getNearClip());
    output[UBOCamera::GLOBAL_NEAR_FAR_OFFSET + 1] = static_cast<float>(camera->getFarClip());
    output[UBOCamera::GLOBAL_NEAR_FAR_OFFSET + 2] = static_cast<float>(camera->getClipSpaceMinz());

    output[UBOCamera::GLOBAL_VIEW_PORT_OFFSET + 0] = sceneData->getShadingScale() * static_cast<float>(camera->getWindow()->getWidth()) * camera->getViewport().x;
    output[UBOCamera::GLOBAL_VIEW_PORT_OFFSET + 1] = sceneData->getShadingScale() * static_cast<float>(camera->getWindow()->getHeight()) * camera->getViewport().y;
    output[UBOCamera::GLOBAL_VIEW_PORT_OFFSET + 2] = sceneData->getShadingScale() * static_cast<float>(camera->getWindow()->getWidth()) * camera->getViewport().z;
    output[UBOCamera::GLOBAL_VIEW_PORT_OFFSET + 3] = sceneData->getShadingScale() * static_cast<float>(camera->getWindow()->getHeight()) * camera->getViewport().w;
}

void PipelineUBO::updateShadowUBOView(const RenderPipeline *pipeline, ccstd::array<float, UBOShadow::COUNT> *shadowBufferView,
                                      ccstd::array<float, UBOCSM::COUNT> *csmBufferView, const scene::Camera *camera) {
    const scene::RenderScene *const scene = camera->getScene();
    const scene::DirectionalLight *mainLight = scene->getMainLight();
    gfx::Device *device = gfx::Device::getInstance();
    const PipelineSceneData *sceneData = pipeline->getPipelineSceneData();
    const CSMLayers *csmLayers = sceneData->getCSMLayers();
    scene::Shadows *const shadowInfo = sceneData->getShadows();
    ccstd::array<float, UBOShadow::COUNT> &sv = *shadowBufferView;
    ccstd::array<float, UBOCSM::COUNT> &cv = *csmBufferView;
    const bool hFTexture = supportsR32FloatTexture(device);
    const float packing = hFTexture ? 0.0F : 1.0F;
    const bool csmSupported = sceneData->getCSMSupported();

    if (shadowInfo->isEnabled() && mainLight) {
        if (shadowInfo->getType() == scene::ShadowType::SHADOW_MAP) {
            if (mainLight->isShadowEnabled()) {
                if (mainLight->isShadowFixedArea() || mainLight->getCSMLevel() == scene::CSMLevel::LEVEL_1 || !csmSupported) {
                    const Mat4 &matShadowView = csmLayers->getSpecialLayer()->getMatShadowView();
                    const Mat4 &matShadowProj = csmLayers->getSpecialLayer()->getMatShadowProj();
                    const Mat4 &matShadowViewProj = csmLayers->getSpecialLayer()->getMatShadowViewProj();
                    float levelCount = 0.0F;
                    float nearClamp = 0.1F;
                    float farClamp = 0.0F;
                    if (mainLight->isShadowFixedArea()) {
                        nearClamp = mainLight->getShadowNear();
                        farClamp = mainLight->getShadowFar();
                        levelCount = 0.0F;
                    } else {
                        farClamp = csmLayers->getSpecialLayer()->getShadowCameraFar();
                        levelCount = 1.0F;
                    }

                    memcpy(sv.data() + UBOShadow::MAT_LIGHT_VIEW_OFFSET, matShadowView.m, sizeof(matShadowView));

                    const float shadowProjDepthInfos[4] = {matShadowProj.m[10], matShadowProj.m[14], matShadowProj.m[11], matShadowProj.m[15]};
                    memcpy(sv.data() + UBOShadow::SHADOW_PROJ_DEPTH_INFO_OFFSET, &shadowProjDepthInfos, sizeof(shadowProjDepthInfos));

                    const float shadowProjInfos[4] = {matShadowProj.m[00], matShadowProj.m[05], 1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]};
                    memcpy(sv.data() + UBOShadow::SHADOW_PROJ_INFO_OFFSET, &shadowProjInfos, sizeof(shadowProjInfos));

                    memcpy(sv.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));

                    const float shadowNFLSInfos[4] = {nearClamp, farClamp, 0.0F, 1.0F - mainLight->getShadowSaturation()};

                    memcpy(sv.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

                    const float shadowLPNNInfos[4] = {static_cast<float>(scene::LightType::DIRECTIONAL), packing, mainLight->getShadowNormalBias(), levelCount};
                    memcpy(sv.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(shadowLPNNInfos));
                } else {
                    const auto layerThreshold = PipelineUBO::getPCFRadius(shadowInfo, mainLight);
                    for (uint32_t i = 0; i < static_cast<uint32_t>(mainLight->getCSMLevel()); ++i) {
                        const auto *layer = csmLayers->getLayers()[i];
                        const Mat4 &matShadowView = layer->getMatShadowView();
                        const float csmViewDir0[4] = {matShadowView.m[0], matShadowView.m[4], matShadowView.m[8], layerThreshold};
                        memcpy(cv.data() + UBOCSM::CSM_VIEW_DIR_0_OFFSET + i * 4, &csmViewDir0, sizeof(csmViewDir0));

                        const float csmViewDir1[4] = {matShadowView.m[1], matShadowView.m[5], matShadowView.m[9], layer->getSplitCameraNear()};
                        memcpy(cv.data() + UBOCSM::CSM_VIEW_DIR_1_OFFSET + i * 4, &csmViewDir1, sizeof(csmViewDir1));

                        const float csmViewDir2[4] = {matShadowView.m[2], matShadowView.m[6], matShadowView.m[10], layer->getSplitCameraFar()};
                        memcpy(cv.data() + UBOCSM::CSM_VIEW_DIR_2_OFFSET + i * 4, &csmViewDir2, sizeof(csmViewDir2));

                        const auto &csmAtlas = layer->getCSMAtlas();
                        const float csmAtlasOffsets[4] = {csmAtlas.x, csmAtlas.y, csmAtlas.z, csmAtlas.w};
                        memcpy(cv.data() + UBOCSM::CSM_ATLAS_OFFSET + i * 4, &csmAtlasOffsets, sizeof(csmAtlasOffsets));

                        const Mat4 &matShadowViewProj = layer->getMatShadowViewProj();
                        memcpy(cv.data() + UBOCSM::MAT_CSM_VIEW_PROJ_LEVELS_OFFSET + i * 16, matShadowViewProj.m, sizeof(matShadowViewProj));

                        const Mat4 &matShadowProj = layer->getMatShadowProj();
                        const float shadowProjDepthInfos[4] = {matShadowProj.m[10], matShadowProj.m[14], matShadowProj.m[11], matShadowProj.m[15]};
                        memcpy(cv.data() + UBOCSM::CSM_PROJ_DEPTH_INFO_LEVELS_OFFSET + i * 4, &shadowProjDepthInfos, sizeof(shadowProjDepthInfos));

                        const float shadowProjInfos[4] = {matShadowProj.m[00], matShadowProj.m[05], 1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]};
                        memcpy(cv.data() + UBOCSM::CSM_PROJ_INFO_LEVELS_OFFSET + i * 4, &shadowProjInfos, sizeof(shadowProjInfos));
                    }
                    const float csmInfo[4] = {mainLight->getCSMTransitionRange(), 0.0F, 0.0F, 0.0F};
                    memcpy(cv.data() + UBOCSM::CSM_SPLITS_INFO_OFFSET, &csmInfo, sizeof(csmInfo));

                    const float shadowNFLSInfos[4] = {0.1F, mainLight->getShadowDistance(), 0.0F, 1.0F - mainLight->getShadowSaturation()};
                    memcpy(sv.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

                    const float shadowLPNNInfos[4] = {static_cast<float>(scene::LightType::DIRECTIONAL), packing, mainLight->getShadowNormalBias(), static_cast<float>(mainLight->getCSMLevel())};
                    memcpy(sv.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(shadowLPNNInfos));
                }
                const float shadowWHPBInfos[4] = {shadowInfo->getSize().x, shadowInfo->getSize().y, static_cast<float>(mainLight->getShadowPcf()), mainLight->getShadowBias()};
                memcpy(sv.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(shadowWHPBInfos));
            }
        } else if (mainLight && shadowInfo->getType() == scene::ShadowType::PLANAR) {
            PipelineUBO::updatePlanarNormalAndDistance(shadowInfo, shadowBufferView);
            const float shadowWHPBInfos[4] = {0, 0, 0, shadowInfo->getPlaneBias()};
            memcpy(sv.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(shadowWHPBInfos));
        }

        memcpy(sv.data() + UBOShadow::SHADOW_COLOR_OFFSET, shadowInfo->getShadowColor4f().data(), sizeof(float) * 4);
    }
}

void PipelineUBO::updateShadowUBOLightView(const RenderPipeline *pipeline, ccstd::array<float, UBOShadow::COUNT> *shadowBufferView,
                                           const scene::Light *light, uint32_t level) {
    const auto *sceneData = pipeline->getPipelineSceneData();
    const CSMLayers *csmLayers = sceneData->getCSMLayers();
    const auto *shadowInfo = sceneData->getShadows();
    const auto *device = gfx::Device::getInstance();
    auto &shadowUBO = *shadowBufferView;
    const bool hFTexture = supportsR32FloatTexture(device);
    const float packing = hFTexture ? 0.0F : 1.0F;
    const auto cap = pipeline->getDevice()->getCapabilities();
    const bool csmSupported = sceneData->getCSMSupported();

    switch (light->getType()) {
        case scene::LightType::DIRECTIONAL: {
            const auto *mainLight = static_cast<const scene::DirectionalLight *>(light);
            if (shadowInfo->isEnabled() && mainLight && mainLight->isShadowEnabled()) {
                if (shadowInfo->getType() == scene::ShadowType::SHADOW_MAP) {
                    float levelCount = 0.0F;
                    float nearClamp = 0.1F;
                    float farClamp = 0.0F;
                    Mat4 matShadowView;
                    Mat4 matShadowProj;
                    Mat4 matShadowViewProj;
                    if (mainLight->isShadowFixedArea() || mainLight->getCSMLevel() == scene::CSMLevel::LEVEL_1 || !csmSupported) {
                        matShadowView = csmLayers->getSpecialLayer()->getMatShadowView();
                        matShadowProj = csmLayers->getSpecialLayer()->getMatShadowProj();
                        matShadowViewProj = csmLayers->getSpecialLayer()->getMatShadowViewProj();
                        if (mainLight->isShadowFixedArea()) {
                            nearClamp = mainLight->getShadowNear();
                            farClamp = mainLight->getShadowFar();
                            levelCount = 0.0F;
                        } else {
                            nearClamp = 0.1F;
                            farClamp = csmLayers->getSpecialLayer()->getShadowCameraFar();
                            levelCount = 1.0F;
                        }
                        const float shadowLPNNInfos[4] = {static_cast<float>(scene::LightType::DIRECTIONAL), packing, mainLight->getShadowNormalBias(), 0.0F};
                        memcpy(shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(shadowLPNNInfos));
                    } else {
                        const CSMLayerInfo *layer = csmLayers->getLayers()[level];
                        levelCount = static_cast<float>(mainLight->getCSMLevel());
                        nearClamp = layer->getSplitCameraNear();
                        farClamp = layer->getSplitCameraFar();
                        matShadowView = layer->getMatShadowView();
                        matShadowProj = layer->getMatShadowProj();
                        matShadowViewProj = layer->getMatShadowViewProj();
                    }

                    memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_OFFSET, matShadowView.m, sizeof(matShadowView));

                    const float shadowProjDepthInfos[4] = {matShadowProj.m[10], matShadowProj.m[14], matShadowProj.m[11], matShadowProj.m[15]};
                    memcpy(shadowUBO.data() + UBOShadow::SHADOW_PROJ_DEPTH_INFO_OFFSET, &shadowProjDepthInfos, sizeof(shadowProjDepthInfos));

                    const float shadowProjInfos[4] = {matShadowProj.m[00], matShadowProj.m[05], 1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]};
                    memcpy(shadowUBO.data() + UBOShadow::SHADOW_PROJ_INFO_OFFSET, &shadowProjInfos, sizeof(shadowProjInfos));

                    memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));

                    const float shadowNFLSInfos[4] = {nearClamp, farClamp, 0.0F, 1.0F - mainLight->getShadowSaturation()};
                    memcpy(shadowUBO.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

                    const float shadowLPNNInfos[4] = {static_cast<float>(scene::LightType::DIRECTIONAL), packing, mainLight->getShadowNormalBias(), levelCount};
                    memcpy(shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(shadowLPNNInfos));

                    const float shadowWHPBInfos[4] = {shadowInfo->getSize().x, shadowInfo->getSize().y, static_cast<float>(mainLight->getShadowPcf()), mainLight->getShadowBias()};
                    memcpy(shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(shadowWHPBInfos));
                }
            }
        } break;
        case scene::LightType::SPOT: {
            const auto *spotLight = static_cast<const scene::SpotLight *>(light);
            if (shadowInfo->isEnabled() && spotLight && spotLight->isShadowEnabled()) {
                const auto &matShadowCamera = spotLight->getNode()->getWorldMatrix();
                const auto matShadowView = matShadowCamera.getInversed();
                memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_OFFSET, matShadowView.m, sizeof(matShadowView));

                Mat4::createPerspective(spotLight->getAngle(), 1.0F, 0.001F, spotLight->getRange(), true, cap.clipSpaceMinZ, cap.clipSpaceSignY, 0, &matShadowViewProj);

                matShadowViewProj.multiply(matShadowView);
                memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));

                const float shadowNFLSInfos[4] = {0.01F, spotLight->getRange(), 0.0F, 0.0F};
                memcpy(shadowUBO.data() + UBOShadow::SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET, &shadowNFLSInfos, sizeof(shadowNFLSInfos));

                const float shadowLPNNInfos[4] = {static_cast<float>(scene::LightType::SPOT), packing, spotLight->getShadowNormalBias(), 0.0F};
                memcpy(shadowUBO.data() + UBOShadow::SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET, &shadowLPNNInfos, sizeof(shadowLPNNInfos));

                const float shadowWHPBInfos[4] = {shadowInfo->getSize().x, shadowInfo->getSize().y, spotLight->getShadowPcf(), spotLight->getShadowBias()};
                memcpy(shadowUBO.data() + UBOShadow::SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET, &shadowWHPBInfos, sizeof(shadowWHPBInfos));
            }
        } break;
        case scene::LightType::SPHERE: break;
        case scene::LightType::UNKNOWN: break;
        default:
            break;
    }

    memcpy(shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, shadowInfo->getShadowColor4f().data(), sizeof(float) * 4);
}

static uint8_t combineSignY = 0;
uint8_t PipelineUBO::getCombineSignY() {
    return combineSignY;
}

float PipelineUBO::getPCFRadius(const scene::Shadows *shadowInfo, const scene::DirectionalLight *dirLight) {
    const float shadowMapSize = shadowInfo->getSize().x;
    if (dirLight->getShadowPcf() == scene::PCFType::SOFT_4X) { // PCFType.SOFT_4X
        return 3.0F / (shadowMapSize * 0.5F);
    }
    if (dirLight->getShadowPcf() == scene::PCFType::SOFT_2X) { // PCFType.SOFT_2X
        return 2.0F / (shadowMapSize * 0.5F);
    }
    if (dirLight->getShadowPcf() == scene::PCFType::SOFT) { // PCFType.SOFT
        return 1.0F / (shadowMapSize * 0.5F);
    }
    return 0.0F; // PCFType.HARD
}

void PipelineUBO::updatePlanarNormalAndDistance(const scene::Shadows *shadowInfo, ccstd::array<float, UBOShadow::COUNT> *shadowUBO) {
    const Vec3 normal = shadowInfo->getNormal().getNormalized();
    const float planarNDInfo[4] = {normal.x, normal.y, normal.z, -shadowInfo->getDistance()};
    memcpy(shadowUBO->data() + UBOShadow::PLANAR_NORMAL_DISTANCE_INFO_OFFSET, &planarNDInfo, sizeof(planarNDInfo));
}

void PipelineUBO::initCombineSignY() const {
    const float screenSpaceSignY = _device->getCapabilities().screenSpaceSignY * 0.5F + 0.5F;
    const float clipSpaceSignY = _device->getCapabilities().clipSpaceSignY * 0.5F + 0.5F;
    combineSignY = static_cast<uint8_t>(screenSpaceSignY) << 1 | static_cast<uint8_t>(clipSpaceSignY);
}

void PipelineUBO::activate(gfx::Device *device, RenderPipeline *pipeline) {
    _device = device;
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

    _alignedCameraUBOSize = utils::alignTo(UBOCamera::SIZE, _device->getCapabilities().uboOffsetAlignment);

    _cameraBuffer = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        _alignedCameraUBOSize,
        _alignedCameraUBOSize,
    });
    _ubos.push_back(_cameraBuffer);
    _cameraUBOs.resize(_alignedCameraUBOSize / sizeof(float));

    _cameraBufferView = _device->createBuffer({
        _cameraBuffer,
        0,
        UBOCamera::SIZE,
    });
    descriptorSet->bindBuffer(UBOCamera::BINDING, _cameraBufferView);
    _ubos.push_back(_cameraBufferView);

    auto *shadowUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::DEVICE,
        UBOShadow::SIZE,
        UBOShadow::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    descriptorSet->bindBuffer(UBOShadow::BINDING, shadowUBO);
    _ubos.push_back(shadowUBO);

    auto *csmUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::DEVICE,
        UBOCSM::SIZE,
        UBOCSM::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    descriptorSet->bindBuffer(UBOCSM::BINDING, csmUBO);
    _ubos.push_back(csmUBO);

    _shadowUBOUpdated = false;
}

void PipelineUBO::destroy() {
    for (auto &ubo : _ubos) {
        CC_SAFE_DELETE(ubo)
    }
    _ubos.clear();
}

void PipelineUBO::updateGlobalUBO(const scene::Camera *camera) {
    auto *const globalDSManager = _pipeline->getGlobalDSManager();
    auto *const ds = _pipeline->getDescriptorSet();
    ds->update();
    updateGlobalUBOView(camera, &_globalUBO);
    ds->getBuffer(UBOGlobal::BINDING)->update(_globalUBO.data(), UBOGlobal::SIZE);

    globalDSManager->bindBuffer(UBOGlobal::BINDING, ds->getBuffer(UBOGlobal::BINDING));
    globalDSManager->update();
}

void PipelineUBO::updateCameraUBO(const scene::Camera *camera) {
    updateCameraUBO(camera, camera->getScene());
}

void PipelineUBO::updateCameraUBO(const scene::Camera *camera, const scene::RenderScene *scene) {
    auto *const cmdBuffer = _pipeline->getCommandBuffers()[0];
    updateCameraUBOView(_pipeline, _cameraUBOs.data(), camera, scene);
    cmdBuffer->updateBuffer(_cameraBuffer, _cameraUBOs.data());
}

void PipelineUBO::updateMultiCameraUBO(GlobalDSManager *globalDSMgr, const ccstd::vector<scene::Camera *> &cameras) {
    const auto cameraCount = cameras.size();
    const auto totalUboSize = static_cast<uint32_t>(_alignedCameraUBOSize * cameraCount);

    if (_cameraBuffer->getSize() < totalUboSize) {
        _cameraBuffer->resize(totalUboSize);
        _cameraUBOs.resize(totalUboSize / sizeof(float));

        if (_cameraBufferView != nullptr) {
            _ubos.erase(std::remove(_ubos.begin(), _ubos.end(), _cameraBufferView), _ubos.end());
            CC_SAFE_DELETE(_cameraBufferView);
        }
        _cameraBufferView = _device->createBuffer({
            _cameraBuffer,
            0,
            UBOCamera::SIZE,
        });
        globalDSMgr->bindBuffer(UBOCamera::BINDING, _cameraBufferView);
        _ubos.push_back(_cameraBufferView);
    }

    for (uint32_t cameraIdx = 0; cameraIdx < cameraCount; ++cameraIdx) {
        const auto *camera = cameras[cameraIdx];
        const auto offset = cameraIdx * _alignedCameraUBOSize / sizeof(float);
        PipelineUBO::updateCameraUBOView(_pipeline, &_cameraUBOs[offset], camera);
    }
    _cameraBuffer->update(_cameraUBOs.data());

    _currentCameraUBOOffset = 0;
}

void PipelineUBO::updateShadowUBO(const scene::Camera *camera) {
    auto *const ds = _pipeline->getDescriptorSet();
    auto *const cmdBuffer = _pipeline->getCommandBuffers()[0];
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto *shadowInfo = sceneData->getShadows();
    const auto *const scene = camera->getScene();
    if (shadowInfo == nullptr || !shadowInfo->isEnabled()) {
        // at least update once to avoid crash #10779
        if (_shadowUBOUpdated) {
            return;
        }
    }

    _shadowUBOUpdated = true;

    const auto &shadowFrameBufferMap = sceneData->getShadowFramebufferMap();
    const scene::DirectionalLight *mainLight = scene->getMainLight();
    if (mainLight && shadowInfo->getType() == scene::ShadowType::SHADOW_MAP) {
        if (shadowFrameBufferMap.count(mainLight) > 0) {
            auto *texture = shadowFrameBufferMap.at(mainLight)->getColorTextures()[0];
            if (texture) {
                ds->bindTexture(SHADOWMAP::BINDING, texture);
            }
        }
    }
    updateShadowUBOView(_pipeline, &_shadowUBO, &_csmUBO, camera);
    ds->update();
    cmdBuffer->updateBuffer(ds->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
    cmdBuffer->updateBuffer(ds->getBuffer(UBOCSM::BINDING), _csmUBO.data(), UBOCSM::SIZE);
}

void PipelineUBO::updateShadowUBOLight(gfx::DescriptorSet *globalDS, const scene::Light *light, uint32_t level) {
    auto *const cmdBuffer = _pipeline->getCommandBuffers()[0];
    updateShadowUBOLightView(_pipeline, &_shadowUBO, light, level);
    globalDS->update();
    cmdBuffer->updateBuffer(globalDS->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
}

void PipelineUBO::updateShadowUBORange(uint32_t offset, const Mat4 *data) {
    memcpy(_shadowUBO.data() + offset, data->m, sizeof(*data));
}

uint32_t PipelineUBO::getCurrentCameraUBOOffset() const {
    return _currentCameraUBOOffset;
}

void PipelineUBO::incCameraUBOOffset() {
    _currentCameraUBOOffset += _alignedCameraUBOSize;
}

} // namespace pipeline
} // namespace cc
