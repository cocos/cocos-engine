/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "NativeBuiltinUtils.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/NativePipelineTypes.h"
#include "cocos/renderer/pipeline/custom/NativeTypes.h"
#include "cocos/renderer/pipeline/custom/NativeUtils.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"
#include "cocos/scene/Camera.h"
#include "cocos/scene/DirectionalLight.h"
#include "cocos/scene/Fog.h"
#include "cocos/scene/Shadow.h"
#include "cocos/scene/Skybox.h"
#include "cocos/scene/SpotLight.h"

namespace cc {

namespace render {

void setupQuadVertexBuffer(gfx::Device &device, const Vec4 &viewport, float vbData[16]) {
    const float minX = viewport.x;
    const float maxX = viewport.x + viewport.z;
    float minY = viewport.y;
    float maxY = viewport.y + viewport.w;
    if (device.getCapabilities().screenSpaceSignY > 0) {
        std::swap(minY, maxY);
    }
    int n = 0;
    vbData[n++] = -1.0F;
    vbData[n++] = -1.0F;
    vbData[n++] = minX; // uv
    vbData[n++] = maxY;
    vbData[n++] = 1.0F;
    vbData[n++] = -1.0F;
    vbData[n++] = maxX;
    vbData[n++] = maxY;
    vbData[n++] = -1.0F;
    vbData[n++] = 1.0F;
    vbData[n++] = minX;
    vbData[n++] = minY;
    vbData[n++] = 1.0F;
    vbData[n++] = 1.0F;
    vbData[n++] = maxX;
    vbData[n++] = minY;
}

// NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
void updateRasterPassConstants(uint32_t width, uint32_t height, Setter &setter) {
    const auto &root = *Root::getInstance();
    const auto shadingWidth = static_cast<float>(width);
    const auto shadingHeight = static_cast<float>(height);
    setter.setVec4(
        "cc_time",
        Vec4(
            root.getCumulativeTime(),
            root.getFrameTime(),
            static_cast<float>(CC_CURRENT_ENGINE()->getTotalFrames()),
            0.0F));

    setter.setVec4(
        "cc_screenSize",
        Vec4(shadingWidth, shadingHeight, 1.0F / shadingWidth, 1.0F / shadingHeight));
    setter.setVec4(
        "cc_nativeSize",
        Vec4(shadingWidth, shadingHeight, 1.0F / shadingWidth, 1.0F / shadingHeight));

    const auto *debugView = root.getDebugView();
    float debugViewData[4] = {0.0F, 0.0F, 0.0F, 0.0F};
    if (debugView && debugView->isEnabled()) {
        debugViewData[0] = static_cast<float>(debugView->getSingleMode());
        for (auto i = static_cast<uint32_t>(pipeline::DebugViewCompositeType::DIRECT_DIFFUSE);
             i < static_cast<uint32_t>(pipeline::DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
            const uint32_t offset = i >> 3;
            const uint32_t bit = i % 8;
            debugViewData[1 + offset] += (debugView->isCompositeModeEnabled(i) ? 1.0F : 0.0F) * powf(10.0F, static_cast<float>(bit));
        }
        debugViewData[3] += (debugView->isLightingWithAlbedo() ? 1.0F : 0.0F) * powf(10.0F, static_cast<float>(6));
        debugViewData[3] += (debugView->isCsmLayerColoration() ? 1.0F : 0.0F) * powf(10.0F, static_cast<float>(7));
    }
    setter.setVec4(
        "cc_debug_view_mode",
        Vec4(debugViewData[0], debugViewData[1], debugViewData[2], debugViewData[3]));
}

namespace {

uint8_t getCombineSignY(gfx::Device *device) {
    // 0: vk, 1: metal, 2: none, 3: gl-like
    static int8_t combineSignY{-1};
    if (combineSignY < 0) {
        const float screenSpaceSignY = device->getCapabilities().screenSpaceSignY * 0.5F + 0.5F;
        const float clipSpaceSignY = device->getCapabilities().clipSpaceSignY * 0.5F + 0.5F;
        combineSignY = static_cast<int8_t>(static_cast<int>(screenSpaceSignY) << 1 | static_cast<int>(clipSpaceSignY));
    }
    return static_cast<uint8_t>(combineSignY);
}

} // namespace

void setCameraUBOValues(
    const scene::Camera &camera,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &cfg,
    const scene::DirectionalLight *mainLight,
    RenderData &data) {
    CC_EXPECTS(camera.getNode());
    CC_EXPECTS(cfg.getSkybox());
    const auto &skybox = *cfg.getSkybox();
    const auto &shadingScale = cfg.getShadingScale();
    // Camera
    setMat4Impl(data, layoutGraph, "cc_matView", camera.getMatView());
    setMat4Impl(data, layoutGraph, "cc_matViewInv", camera.getNode()->getWorldMatrix());
    setMat4Impl(data, layoutGraph, "cc_matProj", camera.getMatProj());
    setMat4Impl(data, layoutGraph, "cc_matProjInv", camera.getMatProjInv());
    setMat4Impl(data, layoutGraph, "cc_matViewProj", camera.getMatViewProj());
    setMat4Impl(data, layoutGraph, "cc_matViewProjInv", camera.getMatViewProjInv());
    setVec4Impl(data, layoutGraph, "cc_cameraPos",
                Vec4(
                    camera.getPosition().x,
                    camera.getPosition().y,
                    camera.getPosition().z,
                    getCombineSignY(cc::gfx::Device::getInstance())));
    setVec4Impl(data, layoutGraph, "cc_surfaceTransform",
                Vec4(
                    static_cast<float>(camera.getSurfaceTransform()),
                    static_cast<float>(camera.getCameraUsage()),
                    cosf(static_cast<float>(mathutils::toRadian(skybox.getRotationAngle()))),
                    sinf(static_cast<float>(mathutils::toRadian(skybox.getRotationAngle())))));
    setVec4Impl(data, layoutGraph, "cc_screenScale",
                Vec4(
                    cfg.getShadingScale(),
                    cfg.getShadingScale(),
                    1.0F / cfg.getShadingScale(),
                    1.0F / cfg.getShadingScale()));
    setVec4Impl(data, layoutGraph, "cc_exposure",
                Vec4(
                    camera.getExposure(),
                    1.0F / camera.getExposure(),
                    cfg.isHDR() ? 1.0F : 0.0F,
                    1.0F / scene::Camera::getStandardExposureValue()));

    if (mainLight) {
        const auto &shadowInfo = *cfg.getShadows();
        const bool shadowEnable = (mainLight->isShadowEnabled() &&
                                   shadowInfo.getType() == scene::ShadowType::SHADOW_MAP);
        setVec4Impl(data, layoutGraph, "cc_mainLitDir",
                    Vec4(
                        mainLight->getDirection().x,
                        mainLight->getDirection().y,
                        mainLight->getDirection().z,
                        shadowEnable));
        auto r = mainLight->getColor().x;
        auto g = mainLight->getColor().y;
        auto b = mainLight->getColor().z;
        if (mainLight->isUseColorTemperature()) {
            r *= mainLight->getColorTemperatureRGB().x;
            g *= mainLight->getColorTemperatureRGB().y;
            b *= mainLight->getColorTemperatureRGB().z;
        }
        auto w = mainLight->getIlluminance();
        if (cfg.isHDR()) {
            w *= camera.getExposure();
        }
        setVec4Impl(data, layoutGraph, "cc_mainLitColor", Vec4(r, g, b, w));
    } else {
        setVec4Impl(data, layoutGraph, "cc_mainLitDir", Vec4(0, 0, 1, 0));
        setVec4Impl(data, layoutGraph, "cc_mainLitColor", Vec4(0, 0, 0, 0));
    }

    CC_EXPECTS(cfg.getAmbient());
    auto &ambient = *cfg.getAmbient();
    auto &skyColor = ambient.getSkyColor();
    if (cfg.isHDR()) {
        skyColor.w = ambient.getSkyIllum() * camera.getExposure();
    } else {
        skyColor.w = ambient.getSkyIllum();
    }
    setVec4Impl(data, layoutGraph, "cc_ambientSky",
                Vec4(skyColor.x, skyColor.y, skyColor.z, skyColor.w));
    setVec4Impl(data, layoutGraph, "cc_ambientGround",
                Vec4(
                    ambient.getGroundAlbedo().x,
                    ambient.getGroundAlbedo().y,
                    ambient.getGroundAlbedo().z,
                    skybox.getEnvmap() ? static_cast<float>(skybox.getEnvmap()->mipmapLevel()) : 1.0F));

    CC_EXPECTS(cfg.getFog());
    const auto &fog = *cfg.getFog();

    const auto &colorTempRGB = fog.getColorArray();
    setVec4Impl(data, layoutGraph, "cc_fogColor",
                Vec4(colorTempRGB.x, colorTempRGB.y, colorTempRGB.z, colorTempRGB.z));
    setVec4Impl(data, layoutGraph, "cc_fogBase",
                Vec4(fog.getFogStart(), fog.getFogEnd(), fog.getFogDensity(), 0.0F));
    setVec4Impl(data, layoutGraph, "cc_fogAdd",
                Vec4(fog.getFogTop(), fog.getFogRange(), fog.getFogAtten(), 0.0F));
    setVec4Impl(data, layoutGraph, "cc_nearFar",
                Vec4(camera.getNearClip(), camera.getFarClip(), camera.getClipSpaceMinz(), 0.0F));
    setVec4Impl(data, layoutGraph, "cc_viewPort",
                Vec4(
                    camera.getViewport().x,
                    camera.getViewport().y,
                    shadingScale * static_cast<float>(camera.getWindow()->getWidth()) * camera.getViewport().z,
                    shadingScale * static_cast<float>(camera.getWindow()->getHeight()) * camera.getViewport().w));
}

namespace {

float getPCFRadius(
    const scene::Shadows &shadowInfo,
    const scene::DirectionalLight &mainLight) {
    const auto &shadowMapSize = shadowInfo.getSize().x;
    switch (mainLight.getShadowPcf()) {
        case scene::PCFType::HARD:
            return 0.0F;
        case scene::PCFType::SOFT:
            return 1.0F / (shadowMapSize * 0.5F);
        case scene::PCFType::SOFT_2X:
            return 2.0F / (shadowMapSize * 0.5F);
        case scene::PCFType::SOFT_4X:
            return 3.0F / (shadowMapSize * 0.5F);
        default:
            break;
    }
    return 0.0F;
}

} // namespace

void setShadowUBOView(
    gfx::Device &device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &pplSceneData,
    const scene::DirectionalLight &mainLight,
    RenderData &data) {
    const auto &shadowInfo = *pplSceneData.getShadows();
    const auto &csmLayers = *pplSceneData.getCSMLayers();
    const auto &csmSupported = pplSceneData.getCSMSupported();
    const auto &packing = pipeline::supportsR32FloatTexture(&device) ? 0.0F : 1.0F;
    Vec4 vec4ShadowInfo{};
    if (shadowInfo.isEnabled()) {
        if (shadowInfo.getType() == scene::ShadowType::SHADOW_MAP) {
            if (mainLight.isShadowEnabled()) {
                if (mainLight.isShadowFixedArea() ||
                    mainLight.getCSMLevel() == scene::CSMLevel::LEVEL_1 || !csmSupported) {
                    // Shadow
                    const auto &matShadowView = csmLayers.getSpecialLayer()->getMatShadowView();
                    const auto &matShadowProj = csmLayers.getSpecialLayer()->getMatShadowProj();
                    const auto &matShadowViewProj = csmLayers.getSpecialLayer()->getMatShadowViewProj();
                    const auto &near = mainLight.getShadowNear();
                    const auto &far = mainLight.getShadowFar();

                    setMat4Impl(data, layoutGraph, "cc_matLightView", matShadowView);
                    setVec4Impl(data, layoutGraph, "cc_shadowProjDepthInfo",
                                Vec4(matShadowProj.m[10], matShadowProj.m[14],
                                     matShadowProj.m[11], matShadowProj.m[15]));

                    setVec4Impl(data, layoutGraph, "cc_shadowProjInfo",
                                Vec4(matShadowProj.m[00], matShadowProj.m[05],
                                     1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]));
                    setMat4Impl(data, layoutGraph, "cc_matLightViewProj", matShadowViewProj);
                    vec4ShadowInfo.set(near, far, 0, 1.0F - mainLight.getShadowSaturation());
                    setVec4Impl(data, layoutGraph, "cc_shadowNFLSInfo", vec4ShadowInfo);
                    vec4ShadowInfo.set(static_cast<float>(scene::LightType::DIRECTIONAL), packing, mainLight.getShadowNormalBias(), 0);
                    setVec4Impl(data, layoutGraph, "cc_shadowLPNNInfo", vec4ShadowInfo);
                } else {
                    { // CSM
                        const auto layerThreshold = getPCFRadius(shadowInfo, mainLight);
                        const auto numCascades = static_cast<uint32_t>(mainLight.getCSMLevel());
                        setVec4ArraySizeImpl(data, layoutGraph, "cc_csmViewDir0", numCascades);
                        setVec4ArraySizeImpl(data, layoutGraph, "cc_csmViewDir1", numCascades);
                        setVec4ArraySizeImpl(data, layoutGraph, "cc_csmViewDir2", numCascades);
                        setVec4ArraySizeImpl(data, layoutGraph, "cc_csmAtlas", numCascades);
                        setMat4ArraySizeImpl(data, layoutGraph, "cc_matCSMViewProj", numCascades);
                        setVec4ArraySizeImpl(data, layoutGraph, "cc_csmProjDepthInfo", numCascades);
                        setVec4ArraySizeImpl(data, layoutGraph, "cc_csmProjInfo", numCascades);

                        Vec4 csmSplitsInfo{};
                        for (uint32_t i = 0; i < numCascades; ++i) {
                            const auto &layer = *csmLayers.getLayers()[i];

                            const auto &matShadowView = layer.getMatShadowView();
                            vec4ShadowInfo.set(matShadowView.m[0], matShadowView.m[4], matShadowView.m[8], layerThreshold);
                            setVec4ArrayElemImpl(data, layoutGraph, "cc_csmViewDir0", vec4ShadowInfo, i);
                            vec4ShadowInfo.set(matShadowView.m[1], matShadowView.m[5], matShadowView.m[9], layer.getSplitCameraNear());
                            setVec4ArrayElemImpl(data, layoutGraph, "cc_csmViewDir1", vec4ShadowInfo, i);
                            vec4ShadowInfo.set(matShadowView.m[2], matShadowView.m[6], matShadowView.m[10], layer.getSplitCameraFar());
                            setVec4ArrayElemImpl(data, layoutGraph, "cc_csmViewDir2", vec4ShadowInfo, i);

                            const auto &csmAtlas = layer.getCSMAtlas();
                            setVec4ArrayElemImpl(data, layoutGraph, "cc_csmAtlas", csmAtlas, i);

                            const auto &matShadowViewProj = layer.getMatShadowViewProj();
                            setMat4ArrayElemImpl(data, layoutGraph, "cc_matCSMViewProj", matShadowViewProj, i);

                            const auto &matShadowProj = layer.getMatShadowProj();
                            setVec4ArrayElemImpl(data, layoutGraph,
                                                 "cc_csmProjDepthInfo",
                                                 Vec4(matShadowProj.m[10], matShadowProj.m[14],
                                                      matShadowProj.m[11], matShadowProj.m[15]),
                                                 i);

                            setVec4ArrayElemImpl(data, layoutGraph,
                                                 "cc_csmProjInfo",
                                                 Vec4(matShadowProj.m[00], matShadowProj.m[05],
                                                      1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]),
                                                 i);

                            (&csmSplitsInfo.x)[i] = layer.getSplitCameraFar() / mainLight.getShadowDistance();
                        }
                        setVec4Impl(data, layoutGraph, "cc_csmSplitsInfo", csmSplitsInfo);
                    }
                    { // Shadow
                        vec4ShadowInfo.set(0, 0, 0, 1.0F - mainLight.getShadowSaturation());
                        setVec4Impl(data, layoutGraph, "cc_shadowNFLSInfo", vec4ShadowInfo);
                        vec4ShadowInfo.set(
                            static_cast<float>(scene::LightType::DIRECTIONAL),
                            packing,
                            mainLight.getShadowNormalBias(),
                            static_cast<float>(mainLight.getCSMLevel()));
                        setVec4Impl(data, layoutGraph, "cc_shadowLPNNInfo", vec4ShadowInfo);
                    }
                }
                { // Shadow
                    vec4ShadowInfo.set(
                        shadowInfo.getSize().x, shadowInfo.getSize().y,
                        static_cast<float>(mainLight.getShadowPcf()), mainLight.getShadowBias());
                    setVec4Impl(data, layoutGraph, "cc_shadowWHPBInfo", vec4ShadowInfo);
                }
            }
        } else {
            const Vec3 tempVec3 = shadowInfo.getNormal().getNormalized();
            setVec4Impl(data, layoutGraph,
                        "cc_planarNDInfo",
                        Vec4(tempVec3.x, tempVec3.y, tempVec3.z, -shadowInfo.getDistance()));
            vec4ShadowInfo.set(
                0, 0,
                0, shadowInfo.getPlaneBias());
            setVec4Impl(data, layoutGraph, "cc_shadowWHPBInfo", vec4ShadowInfo);
        }
        {
            const auto &color = shadowInfo.getShadowColor4f();
            setColorImpl(data, layoutGraph, "cc_shadowColor",
                         gfx::Color{color[0], color[1], color[2], color[3]});
        }
    }
}

void setShadowUBOLightView(
    gfx::Device *device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &pplSceneData,
    const BuiltinCascadedShadowMap *csm,
    const scene::Light &light,
    uint32_t level,
    RenderData &data) {
    const auto &shadowInfo = *pplSceneData.getShadows();
    const auto &packing = pipeline::supportsR32FloatTexture(device) ? 0.0F : 1.0F;
    const auto &cap = device->getCapabilities();
    Vec4 vec4ShadowInfo{};

    // ShadowMap
    switch (light.getType()) {
        case scene::LightType::DIRECTIONAL: {
            const auto &mainLight = dynamic_cast<const scene::DirectionalLight &>(light);
            if (shadowInfo.isEnabled() && mainLight.isShadowEnabled()) {
                if (shadowInfo.getType() == scene::ShadowType::SHADOW_MAP) {
                    float near = 0.1F;
                    float far = 0.0F;
                    Mat4 matShadowView;
                    Mat4 matShadowProj;
                    Mat4 matShadowViewProj;
                    scene::CSMLevel levelCount{};
                    CC_EXPECTS(csm);
                    if (mainLight.isShadowFixedArea() || mainLight.getCSMLevel() == scene::CSMLevel::LEVEL_1) {
                        matShadowView = csm->specialLayer.shadowView;
                        matShadowProj = csm->specialLayer.shadowProj;
                        matShadowViewProj = csm->specialLayer.shadowViewProj;
                        if (mainLight.isShadowFixedArea()) {
                            near = mainLight.getShadowNear();
                            far = mainLight.getShadowFar();
                            levelCount = static_cast<scene::CSMLevel>(0);
                        } else {
                            near = 0.1F;
                            far = csm->specialLayer.shadowCameraFar;
                            levelCount = scene::CSMLevel::LEVEL_1;
                        }
                        vec4ShadowInfo.set(static_cast<float>(scene::LightType::DIRECTIONAL), packing, mainLight.getShadowNormalBias(), 0);
                        setVec4Impl(data, layoutGraph, "cc_shadowLPNNInfo", vec4ShadowInfo);
                    } else {
                        CC_EXPECTS(level < csm->layers.size());
                        const auto &layer = csm->layers[level];
                        matShadowView = layer.shadowView;
                        matShadowProj = layer.shadowProj;
                        matShadowViewProj = layer.shadowViewProj;

                        near = layer.splitCameraNear;
                        far = layer.splitCameraFar;
                        levelCount = mainLight.getCSMLevel();
                    }
                    setMat4Impl(data, layoutGraph, "cc_matLightView", matShadowView);
                    setVec4Impl(data, layoutGraph, "cc_shadowProjDepthInfo",
                                Vec4(
                                    matShadowProj.m[10],
                                    matShadowProj.m[14],
                                    matShadowProj.m[11],
                                    matShadowProj.m[15]));
                    setVec4Impl(data, layoutGraph, "cc_shadowProjInfo",
                                Vec4(
                                    matShadowProj.m[00],
                                    matShadowProj.m[05],
                                    1.0F / matShadowProj.m[00],
                                    1.0F / matShadowProj.m[05]));
                    setMat4Impl(data, layoutGraph, "cc_matLightViewProj", matShadowViewProj);
                    vec4ShadowInfo.set(near, far, 0, 1.0F - mainLight.getShadowSaturation());
                    setVec4Impl(data, layoutGraph, "cc_shadowNFLSInfo", vec4ShadowInfo);
                    vec4ShadowInfo.set(
                        static_cast<float>(scene::LightType::DIRECTIONAL),
                        packing,
                        mainLight.getShadowNormalBias(),
                        static_cast<float>(levelCount));
                    setVec4Impl(data, layoutGraph, "cc_shadowLPNNInfo", vec4ShadowInfo);
                    vec4ShadowInfo.set(
                        shadowInfo.getSize().x,
                        shadowInfo.getSize().y,
                        static_cast<float>(mainLight.getShadowPcf()),
                        mainLight.getShadowBias());
                    setVec4Impl(data, layoutGraph, "cc_shadowWHPBInfo", vec4ShadowInfo);
                }
            }
            break;
        }
        case scene::LightType::SPOT: {
            const auto &spotLight = dynamic_cast<const scene::SpotLight &>(light);
            if (shadowInfo.isEnabled() && spotLight.isShadowEnabled()) {
                const auto &matShadowCamera = spotLight.getNode()->getWorldMatrix();
                const auto matShadowView = matShadowCamera.getInversed();
                setMat4Impl(data, layoutGraph, "cc_matLightView", matShadowView);

                Mat4 matShadowViewProj{};
                Mat4::createPerspective(spotLight.getAngle(), 1.0F, 0.001F,
                                        spotLight.getRange(), true,
                                        cap.clipSpaceMinZ, cap.clipSpaceSignY, 0, &matShadowViewProj);
                matShadowViewProj.multiply(matShadowView);
                setMat4Impl(data, layoutGraph, "cc_matLightViewProj", matShadowViewProj);

                const Vec4 shadowNFLSInfos(0.01F, spotLight.getRange(), 0.0F, 0.0F);
                setVec4Impl(data, layoutGraph, "cc_shadowNFLSInfo", shadowNFLSInfos);

                const Vec4 shadowWHPBInfos(
                    shadowInfo.getSize().x,
                    shadowInfo.getSize().y,
                    spotLight.getShadowPcf(),
                    spotLight.getShadowBias());
                setVec4Impl(data, layoutGraph, "cc_shadowWHPBInfo", shadowWHPBInfos);

                const Vec4 shadowLPNNInfos(static_cast<float>(scene::LightType::SPOT), packing, spotLight.getShadowNormalBias(), 0.0F);
                setVec4Impl(data, layoutGraph, "cc_shadowLPNNInfo", shadowLPNNInfos);
            }
            break;
        }
        default:
            break;
    }

    const auto &color = shadowInfo.getShadowColor4f();
    setColorImpl(data, layoutGraph, "cc_shadowColor", gfx::Color{color[0], color[1], color[2], color[3]});
}

namespace {

void updatePlanarNormalAndDistance(
    const LayoutGraphData &layoutGraph,
    const scene::Shadows &shadowInfo,
    RenderData &data) {
    const Vec3 normal = shadowInfo.getNormal().getNormalized();
    const Vec4 planarNDInfo{normal.x, normal.y, normal.z, -shadowInfo.getDistance()};
    setVec4Impl(data, layoutGraph, "cc_planarNDInfo", planarNDInfo);
}

std::tuple<Mat4, Mat4, Mat4, Mat4>
computeShadowMatrices(
    const gfx::DeviceCaps &cap,
    const Mat4 &matShadowCamera,
    float fov, float farPlane) {
    auto matShadowView = matShadowCamera.getInversed();

    Mat4 matShadowProj;
    Mat4::createPerspective(
        fov, 1.0F, 0.001F, farPlane,
        true, cap.clipSpaceMinZ, cap.clipSpaceSignY,
        0, &matShadowProj);

    Mat4 matShadowViewProj = matShadowProj;
    Mat4 matShadowInvProj = matShadowProj;

    matShadowInvProj.inverse();
    matShadowViewProj.multiply(matShadowView);

    return {matShadowView, matShadowViewProj, matShadowProj, matShadowInvProj};
}

} // namespace

void setPunctualLightShadowUBO(
    gfx::Device *device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &pplSceneData,
    const scene::DirectionalLight *mainLight,
    const scene::Light &light,
    RenderData &data) {
    const auto &shadowInfo = *pplSceneData.getShadows();
    const auto &packing = pipeline::supportsR32FloatTexture(device) ? 0.0F : 1.0F;
    const auto &cap = device->getCapabilities();
    Vec4 vec4ShadowInfo{};

    if (mainLight) {
        // update planar PROJ
        updatePlanarNormalAndDistance(layoutGraph, shadowInfo, data);
    }

    // ShadowMap
    switch (light.getType()) {
        case scene::LightType::DIRECTIONAL:
            // noop
            break;
        case scene::LightType::SPHERE: {
            const auto &shadowSize = shadowInfo.getSize();
            setVec4Impl(
                data, layoutGraph, "cc_shadowWHPBInfo",
                Vec4{shadowSize.x, shadowSize.y, 1.0F, 0.0F});
            setVec4Impl(
                data, layoutGraph, "cc_shadowLPNNInfo",
                Vec4{static_cast<float>(scene::LightType::SPHERE), packing, 0.0F, 0.0F});
        } break;
        case scene::LightType::SPOT: {
            const auto &shadowSize = shadowInfo.getSize();
            const auto &spotLight = dynamic_cast<const scene::SpotLight &>(light);
            const auto &matShadowCamera = spotLight.getNode()->getWorldMatrix();
            const auto [matShadowView, matShadowViewProj, matShadowProj, matShadowInvProj] =
                computeShadowMatrices(cap, matShadowCamera, spotLight.getAngle(), spotLight.getRange());

            setMat4Impl(data, layoutGraph, "cc_matLightView", matShadowView);
            setMat4Impl(data, layoutGraph, "cc_matLightViewProj", matShadowViewProj);
            setVec4Impl(
                data, layoutGraph, "cc_shadowNFLSInfo",
                Vec4{0.1F, spotLight.getRange(), 0.0F, 0.0F});
            setVec4Impl(
                data, layoutGraph, "cc_shadowWHPBInfo",
                Vec4{shadowSize.x, shadowSize.y, spotLight.getShadowPcf(), spotLight.getShadowBias()});
            setVec4Impl(
                data, layoutGraph, "cc_shadowLPNNInfo",
                Vec4{static_cast<float>(scene::LightType::SPOT), packing, spotLight.getShadowNormalBias(), 0.0F});
            setVec4Impl(
                data, layoutGraph, "cc_shadowInvProjDepthInfo",
                Vec4{matShadowInvProj.m[10], matShadowInvProj.m[14], matShadowInvProj.m[11], matShadowInvProj.m[15]});
            setVec4Impl(
                data, layoutGraph, "cc_shadowProjDepthInfo",
                Vec4{matShadowProj.m[10], matShadowProj.m[14], matShadowProj.m[11], matShadowProj.m[15]});
            setVec4Impl(
                data, layoutGraph, "cc_shadowProjInfo",
                Vec4{matShadowProj.m[00], matShadowProj.m[05], 1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]});
        } break;
        case scene::LightType::POINT: {
            const auto &shadowSize = shadowInfo.getSize();
            setVec4Impl(
                data, layoutGraph, "cc_shadowWHPBInfo",
                Vec4{shadowSize.x, shadowSize.y, 1.0F, 0.0F});
            setVec4Impl(
                data, layoutGraph, "cc_shadowLPNNInfo",
                Vec4{static_cast<float>(scene::LightType::POINT), packing, 0.0F, 0.0F});
        } break;
        default:
            break;
    }
}

void setLegacyTextureUBOView(
    gfx::Device &device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &pplSceneData,
    RenderData &data) {
    const auto &skybox = *pplSceneData.getSkybox();
    if (skybox.getReflectionMap()) {
        auto &texture = *skybox.getReflectionMap()->getGFXTexture();
        auto *sampler = device.getSampler(skybox.getReflectionMap()->getSamplerInfo());
        setTextureImpl(data, layoutGraph, "cc_environment", &texture);
        setSamplerImpl(data, layoutGraph, "cc_environment", sampler);
    } else {
        const auto *envmap =
            skybox.getEnvmap()
                ? skybox.getEnvmap()
                : BuiltinResMgr::getInstance()->get<TextureCube>("default-cube-texture");
        if (envmap) {
            auto *texture = envmap->getGFXTexture();
            auto *sampler = device.getSampler(envmap->getSamplerInfo());
            setTextureImpl(data, layoutGraph, "cc_environment", texture);
            setSamplerImpl(data, layoutGraph, "cc_environment", sampler);
        }
    }
    const auto *diffuseMap =
        skybox.getDiffuseMap()
            ? skybox.getDiffuseMap()
            : BuiltinResMgr::getInstance()->get<TextureCube>("default-cube-texture");
    if (diffuseMap) {
        auto *texture = diffuseMap->getGFXTexture();
        auto *sampler = device.getSampler(diffuseMap->getSamplerInfo());
        setTextureImpl(data, layoutGraph, "cc_diffuseMap", texture);
        setSamplerImpl(data, layoutGraph, "cc_diffuseMap", sampler);
    }
    gfx::SamplerInfo samplerPointInfo{
        gfx::Filter::POINT,
        gfx::Filter::POINT,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP};
    auto *pointSampler = device.getSampler(samplerPointInfo);
    setSamplerImpl(data, layoutGraph, "cc_shadowMap", pointSampler);
    // setTextureImpl(data, layoutGraph, "cc_shadowMap", BuiltinResMgr::getInstance()->get<Texture2D>("default-texture")->getGFXTexture());
    setSamplerImpl(data, layoutGraph, "cc_spotShadowMap", pointSampler);
    // setTextureImpl(data, layoutGraph, "cc_spotShadowMap", BuiltinResMgr::getInstance()->get<Texture2D>("default-texture")->getGFXTexture());
}

namespace {

float kLightMeterScale{10000.0F};

} // namespace

void setLightUBO(
    const scene::Light *light, bool bHDR, float exposure,
    const scene::Shadows *shadowInfo,
    char *buffer, size_t bufferSize) {
    CC_EXPECTS(bufferSize % sizeof(float) == 0);
    const auto maxSize = bufferSize / sizeof(float);
    auto *lightBufferData = reinterpret_cast<float *>(buffer);

    size_t offset = 0;

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
    auto index = offset + pipeline::UBOForwardLight::LIGHT_POS_OFFSET;
    CC_EXPECTS(index + 4 < maxSize);
    lightBufferData[index++] = position.x;
    lightBufferData[index++] = position.y;
    lightBufferData[index] = position.z;

    index = offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET;
    CC_EXPECTS(index + 4 < maxSize);
    lightBufferData[index++] = size;
    lightBufferData[index] = range;

    index = offset + pipeline::UBOForwardLight::LIGHT_COLOR_OFFSET;
    CC_EXPECTS(index + 4 < maxSize);
    const auto &color = light->getColor();
    if (light->isUseColorTemperature()) {
        const auto &tempRGB = light->getColorTemperatureRGB();
        lightBufferData[index++] = color.x * tempRGB.x;
        lightBufferData[index++] = color.y * tempRGB.y;
        lightBufferData[index++] = color.z * tempRGB.z;
    } else {
        lightBufferData[index++] = color.x;
        lightBufferData[index++] = color.y;
        lightBufferData[index++] = color.z;
    }

    if (bHDR) {
        lightBufferData[index] = luminanceHDR * exposure * kLightMeterScale;
    } else {
        lightBufferData[index] = luminanceLDR;
    }

    switch (light->getType()) {
        case scene::LightType::SPHERE:
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_POS_OFFSET + 3] =
                static_cast<float>(scene::LightType::SPHERE);
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;
            break;
        case scene::LightType::SPOT: {
            const auto *spotLight = static_cast<const scene::SpotLight *>(light);
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_POS_OFFSET + 3] = static_cast<float>(scene::LightType::SPOT);
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = spotLight->getSpotAngle();
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] =
                (shadowInfo->isEnabled() &&
                 spotLight->isShadowEnabled() &&
                 shadowInfo->getType() == scene::ShadowType::SHADOW_MAP)
                    ? 1.0F
                    : 0.0F;

            index = offset + pipeline::UBOForwardLight::LIGHT_DIR_OFFSET;
            const auto &direction = spotLight->getDirection();
            lightBufferData[index++] = direction.x;
            lightBufferData[index++] = direction.y;
            lightBufferData[index] = direction.z;

            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 0] = 0;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 1] = 0;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 2] = 0;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 3] = spotLight->getAngleAttenuationStrength();
        } break;
        case scene::LightType::POINT:
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_POS_OFFSET + 3] = static_cast<float>(scene::LightType::POINT);
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;
            break;
        case scene::LightType::RANGED_DIRECTIONAL: {
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_POS_OFFSET + 3] = static_cast<float>(scene::LightType::RANGED_DIRECTIONAL);

            const auto *rangedDirLight = static_cast<const scene::RangedDirectionalLight *>(light);
            const Vec3 &right = rangedDirLight->getRight();
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 0] = right.x;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 1] = right.y;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = right.z;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;

            const auto &direction = rangedDirLight->getDirection();
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_DIR_OFFSET + 0] = direction.x;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_DIR_OFFSET + 1] = direction.y;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_DIR_OFFSET + 2] = direction.z;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_DIR_OFFSET + 3] = 0;

            const auto &scale = rangedDirLight->getScale();
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 0] = scale.x * 0.5F;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 1] = scale.y * 0.5F;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 2] = scale.z * 0.5F;
            lightBufferData[offset + pipeline::UBOForwardLight::LIGHT_BOUNDING_SIZE_VS_OFFSET + 3] = 0;
        } break;
        default:
            break;
    }
}

const BuiltinCascadedShadowMap *getBuiltinShadowCSM(
    const PipelineRuntime &pplRuntime,
    const scene::Camera &camera,
    const scene::DirectionalLight *mainLight) {
    const auto &ppl = dynamic_cast<const NativePipeline &>(pplRuntime);
    // no main light
    if (!mainLight) {
        return nullptr;
    }
    // not attached to a node
    if (!mainLight->getNode()) {
        return nullptr;
    }
    const pipeline::PipelineSceneData &pplSceneData = *pplRuntime.getPipelineSceneData();
    auto &csmLayers = *pplSceneData.getCSMLayers();
    const auto &shadows = *pplSceneData.getShadows();
    // shadow not enabled
    if (!shadows.isEnabled()) {
        return nullptr;
    }
    // shadow type is planar
    if (shadows.getType() == scene::ShadowType::PLANAR) {
        return nullptr;
    }

    // find csm
    const BuiltinCascadedShadowMapKey key{&camera, mainLight};
    auto iter = ppl.builtinCSMs.find(key);
    if (iter != ppl.builtinCSMs.end()) {
        return &iter->second;
    }

    // add new csm info
    bool added = false;
    std::tie(iter, added) = ppl.builtinCSMs.emplace(
        std::piecewise_construct,
        std::forward_as_tuple(key),
        std::forward_as_tuple());
    CC_ENSURES(added);

    auto &csm = iter->second;

    // update csm layers
    csmLayers.update(&pplSceneData, &camera);

    // copy csm data
    CC_EXPECTS(csm.layers.size() == csmLayers.getLayers().size());
    for (uint32_t i = 0; i != csm.layers.size(); ++i) {
        const auto &src = *csmLayers.getLayers()[i];
        auto &dst = csm.layers[i];
        dst.shadowView = src.getMatShadowView();
        dst.shadowProj = src.getMatShadowProj();
        dst.shadowViewProj = src.getMatShadowViewProj();
        dst.validFrustum = src.getValidFrustum();
        dst.splitFrustum = src.getSplitFrustum();
        dst.lightViewFrustum = src.getLightViewFrustum();
        dst.castLightViewBoundingBox = src.getCastLightViewBoundingBox();
        dst.shadowCameraFar = src.getShadowCameraFar();
        dst.splitCameraNear = src.getSplitCameraNear();
        dst.splitCameraFar = src.getSplitCameraFar();
        dst.csmAtlas = src.getCSMAtlas();
    }

    {
        const auto &src = *csmLayers.getSpecialLayer();
        auto &dst = csm.specialLayer;
        dst.shadowView = src.getMatShadowView();
        dst.shadowProj = src.getMatShadowProj();
        dst.shadowViewProj = src.getMatShadowViewProj();
        dst.validFrustum = src.getValidFrustum();
        dst.splitFrustum = src.getSplitFrustum();
        dst.lightViewFrustum = src.getLightViewFrustum();
        dst.castLightViewBoundingBox = src.getCastLightViewBoundingBox();
        dst.shadowCameraFar = src.getShadowCameraFar();
    }

    csm.shadowDistance = mainLight->getShadowDistance();

    return &csm;
}

const geometry::Frustum &getBuiltinShadowFrustum(
    const PipelineRuntime &pplRuntime,
    const scene::Camera &camera,
    const scene::DirectionalLight *mainLight,
    uint32_t level) {
    const auto &ppl = dynamic_cast<const NativePipeline &>(pplRuntime);

    const auto &shadows = *ppl.pipelineSceneData->getShadows();
    if (shadows.getType() == scene::ShadowType::PLANAR) {
        return camera.getFrustum();
    }

    BuiltinCascadedShadowMapKey key{&camera, mainLight};
    auto iter = ppl.builtinCSMs.find(key);
    if (iter == ppl.builtinCSMs.end()) {
        throw std::runtime_error("Builtin shadow CSM not found");
    }

    const auto &csmLevel = mainLight->getCSMLevel();
    const auto &csm = iter->second;

    if (mainLight->isShadowFixedArea() || csmLevel == scene::CSMLevel::LEVEL_1) {
        return csm.specialLayer.validFrustum;
    }
    return csm.layers[level].validFrustum;
}

} // namespace render

} // namespace cc
