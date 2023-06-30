#include "NativeBuiltinUtils.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/NativeTypes.h"
#include "cocos/renderer/pipeline/custom/NativeUtils.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"
#include "cocos/scene/Camera.h"
#include "cocos/scene/Fog.h"
#include "cocos/scene/Skybox.h"
#include "cocos/scene/SpotLight.h"

namespace cc {

namespace render {

void setupQuadVertexBuffer(gfx::Device &device, const Vec4 &viewport, float vbData[16]) {
    auto minX = static_cast<float>(viewport.x);
    auto maxX = static_cast<float>(viewport.x + viewport.z);
    auto minY = static_cast<float>(viewport.y);
    auto maxY = static_cast<float>(viewport.y + viewport.w);
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
#if 0
    const auto *debugView = root.getDebugView();
    if (debugView) {
        setter.setVec4(
            "cc_debug_view_mode",
            Vec4(static_cast<float>(debugView->getSingleMode()),
                 debugView->isLightingWithAlbedo() ? 1.0F : 0.0F,
                 debugView->isCsmLayerColoration() ? 1.0F : 0.0F,
                 0.0F));
        Vec4 debugPackVec{};
        for (auto i = static_cast<uint32_t>(pipeline::DebugViewCompositeType::DIRECT_DIFFUSE);
             i < static_cast<uint32_t>(pipeline::DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
            const auto idx = i % 4;
            (&debugPackVec.x)[idx] = debugView->isCompositeModeEnabled(i) ? 1.0F : 0.0F;
            const auto packIdx = static_cast<uint32_t>(floor(static_cast<float>(i) / 4.0F));
            if (idx == 3) {
                std::string name("cc_debug_view_composite_pack_");
                name.append(std::to_string(packIdx + 1));
                setter.setVec4(name, debugPackVec);
            }
        }
    } else {
        setter.setVec4("cc_debug_view_mode", Vec4(0.0F, 1.0F, 0.0F, 0.0F));
        Vec4 debugPackVec{};
        for (auto i = static_cast<uint32_t>(pipeline::DebugViewCompositeType::DIRECT_DIFFUSE);
             i < static_cast<uint32_t>(pipeline::DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
            const auto idx = i % 4;
            (&debugPackVec.x)[idx] = 1.0F;
            const auto packIdx = static_cast<uint32_t>(floor(i / 4.0));
            if (idx == 3) {
                std::string name("cc_debug_view_composite_pack_");
                name.append(std::to_string(packIdx + 1));
                setter.setVec4(name, debugPackVec);
            }
        }
    }
#endif
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
    const pipeline::PipelineSceneData &sceneData,
    const scene::DirectionalLight &mainLight,
    RenderData &data) {
    const auto &shadowInfo = *sceneData.getShadows();
    const auto &csmLayers = *sceneData.getCSMLayers();
    const auto &csmSupported = sceneData.getCSMSupported();
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
            Vec3 tempVec3 = shadowInfo.getNormal().getNormalized();
            setVec4Impl(data, layoutGraph,
                        "cc_planarNDInfo",
                        Vec4(tempVec3.x, tempVec3.y, tempVec3.z, -shadowInfo.getDistance()));
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
    const pipeline::PipelineSceneData &sceneData,
    const scene::Light &light,
    uint32_t level,
    RenderData &data) {
    const auto &shadowInfo = *sceneData.getShadows();
    const auto &csmLayers = *sceneData.getCSMLayers();
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
                    if (mainLight.isShadowFixedArea() || mainLight.getCSMLevel() == scene::CSMLevel::LEVEL_1) {
                        matShadowView = csmLayers.getSpecialLayer()->getMatShadowView();
                        matShadowProj = csmLayers.getSpecialLayer()->getMatShadowProj();
                        matShadowViewProj = csmLayers.getSpecialLayer()->getMatShadowViewProj();
                        if (mainLight.isShadowFixedArea()) {
                            near = mainLight.getShadowNear();
                            far = mainLight.getShadowFar();
                            levelCount = static_cast<scene::CSMLevel>(0);
                        } else {
                            near = 0.1F;
                            far = csmLayers.getSpecialLayer()->getShadowCameraFar();
                            levelCount = scene::CSMLevel::LEVEL_1;
                        }
                        vec4ShadowInfo.set(static_cast<float>(scene::LightType::DIRECTIONAL), packing, mainLight.getShadowNormalBias(), 0);
                        setVec4Impl(data, layoutGraph, "cc_shadowLPNNInfo", vec4ShadowInfo);
                    } else {
                        const auto &layer = *csmLayers.getLayers()[level];
                        matShadowView = layer.getMatShadowView();
                        matShadowProj = layer.getMatShadowProj();
                        matShadowViewProj = layer.getMatShadowViewProj();

                        near = layer.getSplitCameraNear();
                        far = layer.getSplitCameraFar();
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

void setLegacyTextureUBOView(
    gfx::Device &device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &sceneData,
    RenderData &data) {
    const auto &skybox = *sceneData.getSkybox();
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

} // namespace render

} // namespace cc
