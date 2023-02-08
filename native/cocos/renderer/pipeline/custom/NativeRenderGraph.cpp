/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include <boost/graph/depth_first_search.hpp>
#include <boost/graph/filtered_graph.hpp>
#include "LayoutGraphGraphs.h"
#include "NativePipelineGraphs.h"
#include "NativePipelineTypes.h"
#include "RenderCommonNames.h"
#include "RenderCommonTypes.h"
#include "RenderGraphFwd.h"
#include "RenderGraphGraphs.h"
#include "RenderGraphTypes.h"
#include "cocos/math/Utils.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/PipelineUBO.h"
#include "cocos/scene/DirectionalLight.h"
#include "cocos/scene/Fog.h"
#include "cocos/scene/Skybox.h"
#include "cocos/scene/SpotLight.h"
#include "details/DebugUtils.h"
#include "details/GraphView.h"
#include "details/GslUtils.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline/PipelineSceneData.h"

namespace cc {

namespace render {

namespace {

render::NameLocalID getNameID(
    const PmrFlatMap<ccstd::pmr::string, render::NameLocalID> &index,
    std::string_view name) {
    auto iter = index.find(name);
    CC_EXPECTS(iter != index.end());
    return iter->second;
}

void addMat4(
    const LayoutGraphData &lg, std::string_view name,
    const cc::Mat4 &v, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Mat4) == 16 * 4, "sizeof(Mat4) is not 64 bytes");
    data.constants[nameID.value].resize(sizeof(Mat4));
    memcpy(data.constants[nameID.value].data(), v.m, sizeof(v));
}

void setMat4ArrayElemImpl(
    const LayoutGraphData &lg, std::string_view name,
    const cc::Mat4 &v, uint32_t i, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Mat4) == 16 * 4, "sizeof(Mat4) is not 64 bytes");
    auto &dst = data.constants[nameID.value];
    CC_EXPECTS(sizeof(Mat4) * (i + 1) <= dst.size());
    memcpy(dst.data() + sizeof(Mat4) * i, v.m, sizeof(v));
}

void setMat4ArraySizeImpl(
    const LayoutGraphData &lg, std::string_view name,
    uint32_t sz, RenderData &data) {
    CC_EXPECTS(sz);
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Mat4) == 16 * 4, "sizeof(Mat4) is not 64 bytes");
    data.constants[nameID.value].resize(sizeof(Mat4) * sz);
}

void addQuaternion(const LayoutGraphData &lg, const ccstd::string &name, const Quaternion &quat, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Quaternion) == 4 * 4, "sizeof(Quaternion) is not 16 bytes");
    static_assert(std::is_trivially_copyable<Quaternion>::value, "Quaternion is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Quaternion));
    memcpy(data.constants[nameID.value].data(), &quat, sizeof(quat));
}

void addColor(const LayoutGraphData &lg, const ccstd::string &name, const gfx::Color &color, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(gfx::Color) == 4 * 4, "sizeof(Color) is not 16 bytes");
    static_assert(std::is_trivially_copyable<gfx::Color>::value, "Color is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(gfx::Color));
    memcpy(data.constants[nameID.value].data(), &color, sizeof(color));
}

void addVec4(const LayoutGraphData &lg, const ccstd::string &name, const Vec4 &vec, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec4) == 4 * 4, "sizeof(Vec4) is not 16 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec4 is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Vec4));
    memcpy(data.constants[nameID.value].data(), &vec.x, sizeof(vec));
}

void setVec4ArrayElemImpl(const LayoutGraphData &lg, const ccstd::string &name,
                          const Vec4 &vec, uint32_t i, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec4) == 4 * 4, "sizeof(Vec4) is not 16 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec4 is not trivially copyable");
    auto &dst = data.constants[nameID.value];
    CC_EXPECTS(sizeof(Vec4) * (i + 1) <= dst.size());
    memcpy(dst.data() + sizeof(Vec4) * i, &vec.x, sizeof(vec));
}

void setVec4ArraySizeImpl(const LayoutGraphData &lg, const ccstd::string &name,
                          uint32_t sz, RenderData &data) {
    CC_EXPECTS(sz);
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec4) == 4 * 4, "sizeof(Vec4) is not 16 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec4 is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Vec4) * sz);
}

void addVec2(const LayoutGraphData &lg, const ccstd::string &name, const Vec2 &vec, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec2) == 2 * 4, "sizeof(Vec2) is not 8 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec2 is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Vec2));
    memcpy(data.constants[nameID.value].data(), &vec.x, sizeof(vec));
}

void addFloat(const LayoutGraphData &lg, const ccstd::string &name, float v, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(float) == 4, "sizeof(float) is not 4 bytes");
    data.constants[nameID.value].resize(sizeof(float));
    memcpy(data.constants[nameID.value].data(), &v, sizeof(v));
}

void addBuffer(const LayoutGraphData &lg, const ccstd::string &name, gfx::Buffer *buffer, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.buffers[nameID.value] = IntrusivePtr<gfx::Buffer>(buffer);
}

void addTexture(const LayoutGraphData &lg, const ccstd::string &name, gfx::Texture *texture, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.textures[nameID.value] = IntrusivePtr<gfx::Texture>(texture);
}

void addReadWriteBuffer(const LayoutGraphData &lg, const ccstd::string &name, gfx::Buffer *buffer, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.buffers[nameID.value] = IntrusivePtr<gfx::Buffer>(buffer);
}

void addReadWriteTexture(const LayoutGraphData &lg, const ccstd::string &name, gfx::Texture *texture, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.textures[nameID.value] = IntrusivePtr<gfx::Texture>(texture);
}

void addSampler(const LayoutGraphData &lg, const ccstd::string &name, gfx::Sampler *sampler, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.samplers[nameID.value].ptr = sampler;
}

} // namespace

ccstd::string NativeSetter::getName() const {
    return {};
}
void NativeSetter::setName(const ccstd::string &name) {
    // noop
}

void NativeSetter::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = renderData;
    addMat4(layoutGraph, name, mat, data);
}

void NativeSetter::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = renderData;
    addQuaternion(layoutGraph, name, quat, data);
}

void NativeSetter::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = renderData;
    addColor(layoutGraph, name, color, data);
}

void NativeSetter::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = renderData;
    addVec4(layoutGraph, name, vec, data);
}

void NativeSetter::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = renderData;
    addVec2(layoutGraph, name, vec, data);
}

void NativeSetter::setFloat(const ccstd::string &name, float v) {
    auto &data = renderData;
    addFloat(layoutGraph, name, v, data);
}

void NativeSetter::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = renderData;
    addBuffer(layoutGraph, name, buffer, data);
}

void NativeSetter::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = renderData;
    addTexture(layoutGraph, name, texture, data);
}

void NativeSetter::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = renderData;
    addReadWriteBuffer(layoutGraph, name, buffer, data);
}

void NativeSetter::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = renderData;
    addReadWriteTexture(layoutGraph, name, texture, data);
}

void NativeSetter::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = renderData;
    addSampler(layoutGraph, name, sampler, data);
}

void NativeSetter::setVec4ArraySize(const ccstd::string &name, uint32_t sz) {
    setVec4ArraySizeImpl(layoutGraph, name, sz, renderData);
}

void NativeSetter::setVec4ArrayElem(const ccstd::string &name, const cc::Vec4 &vec, uint32_t id) {
    setVec4ArrayElemImpl(layoutGraph, name, vec, id, renderData);
}

void NativeSetter::setMat4ArraySize(const ccstd::string &name, uint32_t sz) {
    setMat4ArraySizeImpl(layoutGraph, name, sz, renderData);
}

void NativeSetter::setMat4ArrayElem(const ccstd::string &name, const cc::Mat4 &mat, uint32_t id) {
    setMat4ArrayElemImpl(layoutGraph, name, mat, id, renderData);
}

ccstd::string NativeRasterPassBuilder::getName() const {
    return std::string(get(RenderGraph::Name, *renderGraph, passID));
}

void NativeRasterPassBuilder::setName(const ccstd::string &name) {
    get(RenderGraph::Name, *renderGraph, passID) = std::string_view{name};
}

void NativeRasterPassBuilder::addRasterView(const ccstd::string &name, const RasterView &view) {
    auto &pass = get(RasterTag{}, passID, *renderGraph);
    auto slotID = static_cast<uint32_t>(pass.rasterViews.size());
    auto res = pass.rasterViews.emplace(
        std::piecewise_construct,
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(view));
    CC_ENSURES(res.second);
    res.first->second.slotID = slotID;
}

void NativeRasterPassBuilder::addComputeView(const ccstd::string &name, const ComputeView &view) {
    CC_EXPECTS(!name.empty());
    CC_EXPECTS(!view.name.empty());
    auto &pass = get(RasterTag{}, passID, *renderGraph);
    auto iter = pass.computeViews.find(name.c_str());
    if (iter == pass.computeViews.end()) {
        bool added = false;
        std::tie(iter, added) = pass.computeViews.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(name.c_str()),
            std::forward_as_tuple());
        CC_ENSURES(added);
    }
    iter->second.emplace_back(view);
}

bool NativeRasterPassBuilder::getShowStatistics() const {
    const auto &pass = get(RasterTag{}, passID, *renderGraph);
    return pass.showStatistics;
}

void NativeRasterPassBuilder::setShowStatistics(bool enable) {
    auto &pass = get(RasterTag{}, passID, *renderGraph);
    pass.showStatistics = enable;
}

ccstd::string NativeRasterQueueBuilder::getName() const {
    return std::string(get(RenderGraph::Name, *renderGraph, queueID));
}

void NativeRasterQueueBuilder::setName(const ccstd::string &name) {
    get(RenderGraph::Name, *renderGraph, queueID) = std::string_view{name};
}

namespace {

uint8_t getCombineSignY(gfx::Device *device) {
    // 0: vk, 1: metal, 2: none, 3: gl-like
    static int8_t combineSignY{-1};
    if (combineSignY < 0) {
        const float screenSpaceSignY = device->getCapabilities().screenSpaceSignY * 0.5F + 0.5F;
        const float clipSpaceSignY = device->getCapabilities().clipSpaceSignY * 0.5F + 0.5F;
        combineSignY = static_cast<int8_t>(screenSpaceSignY) << 1 | static_cast<int8_t>(clipSpaceSignY);
    }
    return static_cast<uint8_t>(combineSignY);
}

void setCameraUBOValues(
    const scene::Camera &camera,
    const pipeline::PipelineSceneData &cfg,
    const scene::DirectionalLight *mainLight,
    Setter &setter) {
    CC_EXPECTS(camera.getNode());
    CC_EXPECTS(cfg.getSkybox());
    const auto &skybox = *cfg.getSkybox();
    const auto &shadingScale = cfg.getShadingScale();
    // Camera
    setter.setMat4("cc_matView", camera.getMatView());
    setter.setMat4("cc_matViewInv", camera.getNode()->getWorldMatrix());
    setter.setMat4("cc_matProj", camera.getMatProj());
    setter.setMat4("cc_matProjInv", camera.getMatProjInv());
    setter.setMat4("cc_matViewProj", camera.getMatViewProj());
    setter.setMat4("cc_matViewProjInv", camera.getMatViewProjInv());
    setter.setVec4("cc_cameraPos", Vec4(camera.getPosition().x,
                                        camera.getPosition().y,
                                        camera.getPosition().z,
                                        getCombineSignY(cc::gfx::Device::getInstance())));
    setter.setVec4("cc_surfaceTransform", Vec4(static_cast<float>(camera.getSurfaceTransform()),
                                               0.0F,
                                               cosf(static_cast<float>(mathutils::toRadian(skybox.getRotationAngle()))),
                                               sinf(static_cast<float>(mathutils::toRadian(skybox.getRotationAngle())))));
    setter.setVec4("cc_screenScale", Vec4(cfg.getShadingScale(),
                                          cfg.getShadingScale(),
                                          1.0F / cfg.getShadingScale(),
                                          1.0F / cfg.getShadingScale()));
    setter.setVec4("cc_exposure", Vec4(camera.getExposure(),
                                       1.0F / camera.getExposure(),
                                       cfg.isHDR() ? 1.0F : 0.0F,
                                       1.0F / scene::Camera::getStandardExposureValue()));

    if (mainLight) {
        const auto &shadowInfo = *cfg.getShadows();
        const bool shadowEnable = (mainLight->isShadowEnabled() &&
                                   shadowInfo.getType() == scene::ShadowType::SHADOW_MAP);
        setter.setVec4("cc_mainLitDir", Vec4(mainLight->getDirection().x,
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
        setter.setVec4("cc_mainLitColor", Vec4(r, g, b, w));
    } else {
        setter.setVec4("cc_mainLitDir", Vec4(0, 0, 1, 0));
        setter.setVec4("cc_mainLitColor", Vec4(0, 0, 0, 0));
    }

    CC_EXPECTS(cfg.getAmbient());
    auto &ambient = *cfg.getAmbient();
    auto &skyColor = ambient.getSkyColor();
    if (cfg.isHDR()) {
        skyColor.w = ambient.getSkyIllum() * camera.getExposure();
    } else {
        skyColor.w = ambient.getSkyIllum();
    }
    setter.setVec4("cc_ambientSky", Vec4(skyColor.x, skyColor.y, skyColor.z, skyColor.w));
    setter.setVec4("cc_ambientGround", Vec4(ambient.getGroundAlbedo().x,
                                            ambient.getGroundAlbedo().y,
                                            ambient.getGroundAlbedo().z,
                                            skybox.getEnvmap()
                                                ? static_cast<float>(skybox.getEnvmap()->mipmapLevel())
                                                : 1.0F));

    CC_EXPECTS(cfg.getFog());
    const auto &fog = *cfg.getFog();

    const auto &colorTempRGB = fog.getColorArray();
    setter.setVec4("cc_fogColor", Vec4(colorTempRGB.x, colorTempRGB.y, colorTempRGB.z, colorTempRGB.z));
    setter.setVec4("cc_fogBase", Vec4(fog.getFogStart(), fog.getFogEnd(), fog.getFogDensity(), 0.0F));
    setter.setVec4("cc_fogAdd", Vec4(fog.getFogTop(), fog.getFogRange(), fog.getFogAtten(), 0.0F));
    setter.setVec4("cc_nearFar", Vec4(camera.getNearClip(), camera.getFarClip(), 0.0F, 0.0F));
    setter.setVec4("cc_viewPort", Vec4(camera.getViewport().x,
                                       camera.getViewport().y,
                                       shadingScale * static_cast<float>(camera.getWindow()->getWidth()) * camera.getViewport().z,
                                       shadingScale * static_cast<float>(camera.getWindow()->getHeight()) * camera.getViewport().w));
}

void setShadowUBOLightView(
    gfx::Device *device,
    const pipeline::PipelineSceneData &sceneData,
    const scene::Light &light,
    uint32_t level, Setter &setter) {
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
                    float near = 0.1;
                    float far = 0;
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
                            near = 0.1;
                            far = csmLayers.getSpecialLayer()->getShadowCameraFar();
                            levelCount = scene::CSMLevel::LEVEL_1;
                        }
                        vec4ShadowInfo.set(0.0F, packing, mainLight.getShadowNormalBias(), 0);
                        setter.setVec4("cc_shadowLPNNInfo", vec4ShadowInfo);
                    } else {
                        const auto &layer = *csmLayers.getLayers()[level];
                        matShadowView = layer.getMatShadowView();
                        matShadowProj = layer.getMatShadowProj();
                        matShadowViewProj = layer.getMatShadowViewProj();

                        near = layer.getSplitCameraNear();
                        far = layer.getSplitCameraFar();
                        levelCount = mainLight.getCSMLevel();
                    }
                    setter.setMat4("cc_matLightView", matShadowView);
                    setter.setVec4("cc_shadowProjDepthInfo", Vec4(matShadowProj.m[10], matShadowProj.m[14],
                                                                  matShadowProj.m[11], matShadowProj.m[15]));
                    setter.setVec4("cc_shadowProjInfo", Vec4(matShadowProj.m[00], matShadowProj.m[05],
                                                             1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]));
                    setter.setMat4("cc_matLightViewProj", matShadowViewProj);
                    vec4ShadowInfo.set(near, far, 0, 1.0F - mainLight.getShadowSaturation());
                    setter.setVec4("cc_shadowNFLSInfo", vec4ShadowInfo);
                    vec4ShadowInfo.set(0.0F, packing, mainLight.getShadowNormalBias(), static_cast<float>(levelCount));
                    setter.setVec4("cc_shadowLPNNInfo", vec4ShadowInfo);
                    vec4ShadowInfo.set(shadowInfo.getSize().x, shadowInfo.getSize().y, static_cast<float>(mainLight.getShadowPcf()), mainLight.getShadowBias());
                    setter.setVec4("cc_shadowWHPBInfo", vec4ShadowInfo);
                }
            }
            break;
        }
        case scene::LightType::SPOT: {
            const auto &spotLight = dynamic_cast<const scene::SpotLight &>(light);
            if (shadowInfo.isEnabled() && spotLight.isShadowEnabled()) {
                const auto &matShadowCamera = spotLight.getNode()->getWorldMatrix();
                const auto matShadowView = matShadowCamera.getInversed();
                setter.setMat4("cc_matLightView", matShadowView);

                Mat4 matShadowViewProj{};
                Mat4::createPerspective(spotLight.getAngle(), 1.0F, 0.001F,
                                        spotLight.getRange(), true,
                                        cap.clipSpaceMinZ, cap.clipSpaceSignY, 0, &matShadowViewProj);
                matShadowViewProj.multiply(matShadowView);
                setter.setMat4("cc_matLightViewProj", matShadowViewProj);

                const Vec4 shadowNFLSInfos(0.01F, spotLight.getRange(), 0.0F, 0.0F);
                setter.setVec4("cc_shadowNFLSInfo", shadowNFLSInfos);

                const Vec4 shadowWHPBInfos(
                    shadowInfo.getSize().x,
                    shadowInfo.getSize().y,
                    spotLight.getShadowPcf(),
                    spotLight.getShadowBias());
                setter.setVec4("cc_shadowWHPBInfo", shadowWHPBInfos);

                const Vec4 shadowLPNNInfos(1.0F, packing, spotLight.getShadowNormalBias(), 0.0F);
                setter.setVec4("cc_shadowLPNNInfo", shadowLPNNInfos);
            }
            break;
        }
        default:
            break;
    }

    const auto &data = shadowInfo.getShadowColor4f();
    setter.setColor("cc_shadowColor", gfx::Color{data[0], data[1], data[2], data[3]});
}

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
        // case PCFType.SOFT_4X:
        //     return 3.0F  / (shadowMapSize * 0.5F);
        default:
            break;
    }
    return 0.0F;
}

void setShadowUBOView(
    gfx::Device &device,
    const pipeline::PipelineSceneData &sceneData,
    const scene::DirectionalLight &mainLight,
    NativeSetter &setter) {
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

                    setter.setMat4("cc_matLightView", matShadowView);
                    setter.setVec4("cc_shadowProjDepthInfo",
                                   Vec4(matShadowProj.m[10], matShadowProj.m[14],
                                        matShadowProj.m[11], matShadowProj.m[15]));

                    setter.setVec4("cc_shadowProjInfo",
                                   Vec4(matShadowProj.m[00], matShadowProj.m[05],
                                        1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]));
                    setter.setMat4("cc_matLightViewProj", matShadowViewProj);
                    vec4ShadowInfo.set(near, far, 0, 1.0F - mainLight.getShadowSaturation());
                    setter.setVec4("cc_shadowNFLSInfo", vec4ShadowInfo);
                    vec4ShadowInfo.set(0.0F, packing, mainLight.getShadowNormalBias(), 0);
                    setter.setVec4("cc_shadowLPNNInfo", vec4ShadowInfo);
                } else {
                    { // CSM
                        const auto layerThreshold = getPCFRadius(shadowInfo, mainLight);
                        const auto numCascades = static_cast<uint32_t>(mainLight.getCSMLevel());
                        setter.setVec4ArraySize("cc_csmViewDir0", numCascades);
                        setter.setVec4ArraySize("cc_csmViewDir1", numCascades);
                        setter.setVec4ArraySize("cc_csmViewDir2", numCascades);
                        setter.setVec4ArraySize("cc_csmAtlas", numCascades);
                        setter.setMat4ArraySize("cc_matCSMViewProj", numCascades);
                        setter.setVec4ArraySize("cc_csmProjDepthInfo", numCascades);
                        setter.setVec4ArraySize("cc_csmProjInfo", numCascades);

                        Vec4 csmSplitsInfo{};
                        for (uint32_t i = 0; i < numCascades; ++i) {
                            const auto &layer = *csmLayers.getLayers()[i];

                            const auto &matShadowView = layer.getMatShadowView();
                            vec4ShadowInfo.set(matShadowView.m[0], matShadowView.m[4], matShadowView.m[8], layerThreshold);
                            setter.setVec4ArrayElem("cc_csmViewDir0", vec4ShadowInfo, i);
                            vec4ShadowInfo.set(matShadowView.m[1], matShadowView.m[5], matShadowView.m[9], 0.0F);
                            setter.setVec4ArrayElem("cc_csmViewDir1", vec4ShadowInfo, i);
                            vec4ShadowInfo.set(matShadowView.m[2], matShadowView.m[6], matShadowView.m[0], 0.0F);
                            setter.setVec4ArrayElem("cc_csmViewDir2", vec4ShadowInfo, i);

                            const auto &csmAtlas = layer.getCSMAtlas();
                            setter.setVec4ArrayElem("cc_csmAtlas", csmAtlas, i);

                            const auto &matShadowViewProj = layer.getMatShadowViewProj();
                            setter.setMat4ArrayElem("cc_matCSMViewProj", matShadowViewProj, i);

                            const auto &matShadowProj = layer.getMatShadowProj();
                            setter.setVec4ArrayElem(
                                "cc_csmProjDepthInfo",
                                Vec4(matShadowProj.m[10], matShadowProj.m[14],
                                     matShadowProj.m[11], matShadowProj.m[15]),
                                i);

                            setter.setVec4ArrayElem(
                                "cc_csmProjInfo",
                                Vec4(matShadowProj.m[00], matShadowProj.m[05],
                                     1.0F / matShadowProj.m[00], 1.0F / matShadowProj.m[05]),
                                i);

                            (&csmSplitsInfo.x)[i] = layer.getSplitCameraFar() / mainLight.getShadowDistance();
                        }
                        setter.setVec4("cc_csmSplitsInfo", csmSplitsInfo);
                    }
                    { // Shadow
                        vec4ShadowInfo.set(0, 0, 0, 1.0F - mainLight.getShadowSaturation());
                        setter.setVec4("cc_shadowNFLSInfo", vec4ShadowInfo);
                        vec4ShadowInfo.set(
                            0.0F, packing,
                            mainLight.getShadowNormalBias(),
                            static_cast<float>(mainLight.getCSMLevel()));
                        setter.setVec4("cc_shadowLPNNInfo", vec4ShadowInfo);
                    }
                }
                { // Shadow
                    vec4ShadowInfo.set(
                        shadowInfo.getSize().x, shadowInfo.getSize().y,
                        static_cast<float>(mainLight.getShadowPcf()), mainLight.getShadowBias());
                    setter.setVec4("cc_shadowWHPBInfo", vec4ShadowInfo);
                }
            }
        } else {
            Vec3 tempVec3 = shadowInfo.getNormal().getNormalized();
            setter.setVec4(
                "cc_planarNDInfo",
                Vec4(tempVec3.x, tempVec3.y, tempVec3.z, -shadowInfo.getDistance()));
        }
        {
            const auto &data = shadowInfo.getShadowColor4f();
            setter.setColor("cc_shadowColor", gfx::Color{data[0], data[1], data[2], data[3]});
        }
    }
}

void setTextureUBOView(
    gfx::Device &device,
    const pipeline::PipelineSceneData &sceneData,
    Setter &setter) {
    const auto &skybox = *sceneData.getSkybox();
    if (skybox.getReflectionMap()) {
        auto &texture = *skybox.getReflectionMap()->getGFXTexture();
        auto *sampler = device.getSampler(skybox.getReflectionMap()->getSamplerInfo());
        setter.setTexture("cc_environment", &texture);
        setter.setSampler("cc_environment", sampler);
    } else {
        const auto *envmap =
            skybox.getEnvmap()
                ? skybox.getEnvmap()
                : BuiltinResMgr::getInstance()->get<TextureCube>("default-cube-texture");
        if (envmap) {
            auto *texture = envmap->getGFXTexture();
            auto *sampler = device.getSampler(envmap->getSamplerInfo());
            setter.setTexture("cc_environment", texture);
            setter.setSampler("cc_environment", sampler);
        }
    }
    const auto *diffuseMap =
        skybox.getDiffuseMap()
            ? skybox.getDiffuseMap()
            : BuiltinResMgr::getInstance()->get<TextureCube>("default-cube-texture");
    if (diffuseMap) {
        auto *texture = diffuseMap->getGFXTexture();
        auto *sampler = device.getSampler(diffuseMap->getSamplerInfo());
        setter.setTexture("cc_diffuseMap", texture);
        setter.setSampler("cc_diffuseMap", sampler);
    }
    gfx::SamplerInfo samplerPointInfo{
        gfx::Filter::POINT,
        gfx::Filter::POINT,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP};
    auto *pointSampler = device.getSampler(samplerPointInfo);
    setter.setSampler("cc_shadowMap", pointSampler);
    setter.setTexture("cc_shadowMap", BuiltinResMgr::getInstance()->get<Texture2D>("default-texture")->getGFXTexture());
    setter.setSampler("cc_spotShadowMap", pointSampler);
    setter.setTexture("cc_spotShadowMap", BuiltinResMgr::getInstance()->get<Texture2D>("default-texture")->getGFXTexture());
}

} // namespace

void NativeRasterQueueBuilder::addSceneOfCamera(
    scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) {
    std::string_view name = "Camera";
    auto *pLight = light.light.get();
    SceneData scene(renderGraph->get_allocator());
    scene.name = name;
    scene.flags = sceneFlags;
    scene.camera = camera;
    scene.light = light;
    auto sceneID = addVertex(
        SceneTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(scene)),
        *renderGraph, queueID);
    CC_ENSURES(sceneID != RenderGraph::null_vertex());

    auto &data = get(RenderGraph::Data, *renderGraph, sceneID);
    NativeSetter setter{*layoutGraph, data};

    setCameraUBOValues(
        *camera,
        *pipelineRuntime->getPipelineSceneData(),
        camera->getScene()->getMainLight(), setter);

    if (any(sceneFlags & SceneFlags::SHADOW_CASTER)) {
        if (pLight) {
            setShadowUBOLightView(
                pipelineRuntime->getDevice(),
                *pipelineRuntime->getPipelineSceneData(),
                *pLight, light.level, setter);
        }
    } else {
        const auto *pDirLight = camera->getScene()->getMainLight();
        if (pDirLight) {
            setShadowUBOView(*pipelineRuntime->getDevice(),
                             *pipelineRuntime->getPipelineSceneData(),
                             *pDirLight, setter);
        }
    }
    setTextureUBOView(
        *pipelineRuntime->getDevice(),
        *pipelineRuntime->getPipelineSceneData(),
        setter);
}

void NativeRasterQueueBuilder::addScene(const ccstd::string &name, SceneFlags sceneFlags) {
    SceneData scene(renderGraph->get_allocator());
    scene.name = name;
    scene.flags = sceneFlags;

    auto sceneID = addVertex(
        SceneTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(scene)),
        *renderGraph, queueID);
    CC_ENSURES(sceneID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::addFullscreenQuad(
    Material *material, uint32_t passID, SceneFlags sceneFlags) {
    std::string_view name = "FullscreenQuad";
    auto drawID = addVertex(
        BlitTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(material, passID, sceneFlags, nullptr),
        *renderGraph, queueID);
    CC_ENSURES(drawID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::addCameraQuad(
    scene::Camera *camera, cc::Material *material, uint32_t passID,
    SceneFlags sceneFlags) {
    std::string_view name = "CameraQuad";
    auto drawID = addVertex(
        BlitTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(material, passID, sceneFlags, camera),
        *renderGraph, queueID);
    CC_ENSURES(drawID != RenderGraph::null_vertex());

    auto &data = get(RenderGraph::Data, *renderGraph, drawID);
    NativeSetter setter{*layoutGraph, data};

    setCameraUBOValues(
        *camera,
        *pipelineRuntime->getPipelineSceneData(),
        camera->getScene()->getMainLight(), setter);

    if (any(sceneFlags & SceneFlags::SHADOW_CASTER)) {
    } else {
        const auto *pDirLight = camera->getScene()->getMainLight();
        if (pDirLight) {
            setShadowUBOView(*pipelineRuntime->getDevice(),
                             *pipelineRuntime->getPipelineSceneData(),
                             *pDirLight, setter);
        }
    }
    setTextureUBOView(
        *pipelineRuntime->getDevice(),
        *pipelineRuntime->getPipelineSceneData(),
        setter);
}

void NativeRasterQueueBuilder::clearRenderTarget(const ccstd::string &name, const gfx::Color &color) {
    ccstd::pmr::vector<ClearView> clears(renderGraph->get_allocator());
    clears.emplace_back(name.c_str(), gfx::ClearFlagBit::COLOR, color);

    auto clearID = addVertex(
        ClearTag{},
        std::forward_as_tuple("ClearRenderTarget"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(clears)),
        *renderGraph, queueID);
    CC_ENSURES(clearID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::setViewport(const gfx::Viewport &viewport) {
    auto viewportID = addVertex(
        ViewportTag{},
        std::forward_as_tuple("Viewport"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(viewport),
        *renderGraph, queueID);
    CC_ENSURES(viewportID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addMat4(*layoutGraph, name, mat, data);
}

void NativeRasterQueueBuilder::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addQuaternion(*layoutGraph, name, quat, data);
}

void NativeRasterQueueBuilder::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addColor(*layoutGraph, name, color, data);
}

void NativeRasterQueueBuilder::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addVec4(*layoutGraph, name, vec, data);
}

void NativeRasterQueueBuilder::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addVec2(*layoutGraph, name, vec, data);
}

void NativeRasterQueueBuilder::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addFloat(*layoutGraph, name, v, data);
}

void NativeRasterQueueBuilder::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addBuffer(*layoutGraph, name, buffer, data);
}

void NativeRasterQueueBuilder::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addTexture(*layoutGraph, name, texture, data);
}

void NativeRasterQueueBuilder::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addReadWriteBuffer(*layoutGraph, name, buffer, data);
}

void NativeRasterQueueBuilder::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addReadWriteTexture(*layoutGraph, name, texture, data);
}

void NativeRasterQueueBuilder::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addSampler(*layoutGraph, name, sampler, data);
}

RasterQueueBuilder *NativeRasterPassBuilder::addQueue(QueueHint hint) {
    std::string_view name = "Queue";
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(hint),
        *renderGraph, passID);

    return new NativeRasterQueueBuilder(pipelineRuntime, renderGraph, queueID, layoutGraph);
}

void NativeRasterPassBuilder::setViewport(const gfx::Viewport &viewport) {
    auto &pass = get(RasterTag{}, passID, *renderGraph);
    pass.viewport = viewport;
}

void NativeRasterPassBuilder::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addMat4(*layoutGraph, name, mat, data);
}

void NativeRasterPassBuilder::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addQuaternion(*layoutGraph, name, quat, data);
}

void NativeRasterPassBuilder::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addColor(*layoutGraph, name, color, data);
}

void NativeRasterPassBuilder::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addVec4(*layoutGraph, name, vec, data);
}

void NativeRasterPassBuilder::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addVec2(*layoutGraph, name, vec, data);
}

void NativeRasterPassBuilder::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addFloat(*layoutGraph, name, v, data);
}

void NativeRasterPassBuilder::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addBuffer(*layoutGraph, name, buffer, data);
}

void NativeRasterPassBuilder::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addTexture(*layoutGraph, name, texture, data);
}

void NativeRasterPassBuilder::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addReadWriteBuffer(*layoutGraph, name, buffer, data);
}

void NativeRasterPassBuilder::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addReadWriteTexture(*layoutGraph, name, texture, data);
}

void NativeRasterPassBuilder::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addSampler(*layoutGraph, name, sampler, data);
}

void NativeRasterPassBuilder::setVersion(const ccstd::string &name, uint64_t version) {
    // noop
}

// NativeComputeQueue
ccstd::string NativeComputeQueueBuilder::getName() const {
    return std::string(get(RenderGraph::Name, *renderGraph, queueID));
}

void NativeComputeQueueBuilder::setName(const ccstd::string &name) {
    get(RenderGraph::Name, *renderGraph, queueID) = std::string_view{name};
}

void NativeComputeQueueBuilder::addDispatch(const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) {
    std::string_view name("Dispatch");
    addVertex(
        DispatchTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(
            shader.c_str(),
            threadGroupCountX,
            threadGroupCountY,
            threadGroupCountZ),
        *renderGraph);
}

void NativeComputeQueueBuilder::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addMat4(*layoutGraph, name, mat, data);
}

void NativeComputeQueueBuilder::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addQuaternion(*layoutGraph, name, quat, data);
}

void NativeComputeQueueBuilder::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addColor(*layoutGraph, name, color, data);
}

void NativeComputeQueueBuilder::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addVec4(*layoutGraph, name, vec, data);
}

void NativeComputeQueueBuilder::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addVec2(*layoutGraph, name, vec, data);
}

void NativeComputeQueueBuilder::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addFloat(*layoutGraph, name, v, data);
}

void NativeComputeQueueBuilder::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addBuffer(*layoutGraph, name, buffer, data);
}

void NativeComputeQueueBuilder::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addTexture(*layoutGraph, name, texture, data);
}

void NativeComputeQueueBuilder::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addReadWriteBuffer(*layoutGraph, name, buffer, data);
}

void NativeComputeQueueBuilder::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addReadWriteTexture(*layoutGraph, name, texture, data);
}

void NativeComputeQueueBuilder::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addSampler(*layoutGraph, name, sampler, data);
}

ccstd::string NativeComputePassBuilder::getName() const {
    return std::string(get(RenderGraph::Name, *renderGraph, passID));
}

void NativeComputePassBuilder::setName(const ccstd::string &name) {
    get(RenderGraph::Name, *renderGraph, passID) = std::string_view{name};
}

void NativeComputePassBuilder::addComputeView(const ccstd::string &name, const ComputeView &view) {
    CC_EXPECTS(!name.empty());
    CC_EXPECTS(!view.name.empty());
    auto &pass = get(ComputeTag{}, passID, *renderGraph);
    auto iter = pass.computeViews.find(name.c_str());
    if (iter == pass.computeViews.end()) {
        bool added = false;
        std::tie(iter, added) = pass.computeViews.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(name.c_str()),
            std::forward_as_tuple());
        CC_ENSURES(added);
    }
    iter->second.emplace_back(view);
}

ComputeQueueBuilder *NativeComputePassBuilder::addQueue() {
    std::string_view name("Queue");
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(QueueHint::NONE),
        *renderGraph, passID);

    return new NativeComputeQueueBuilder(renderGraph, queueID, layoutGraph);
}

void NativeComputePassBuilder::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addMat4(*layoutGraph, name, mat, data);
}

void NativeComputePassBuilder::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addQuaternion(*layoutGraph, name, quat, data);
}

void NativeComputePassBuilder::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addColor(*layoutGraph, name, color, data);
}

void NativeComputePassBuilder::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addVec4(*layoutGraph, name, vec, data);
}

void NativeComputePassBuilder::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addVec2(*layoutGraph, name, vec, data);
}

void NativeComputePassBuilder::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addFloat(*layoutGraph, name, v, data);
}

void NativeComputePassBuilder::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addBuffer(*layoutGraph, name, buffer, data);
}

void NativeComputePassBuilder::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addTexture(*layoutGraph, name, texture, data);
}

void NativeComputePassBuilder::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addReadWriteBuffer(*layoutGraph, name, buffer, data);
}

void NativeComputePassBuilder::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addReadWriteTexture(*layoutGraph, name, texture, data);
}

void NativeComputePassBuilder::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addSampler(*layoutGraph, name, sampler, data);
}

ccstd::string NativeMovePassBuilder::getName() const {
    return std::string(get(RenderGraph::Name, *renderGraph, passID));
}

void NativeMovePassBuilder::setName(const ccstd::string &name) {
    get(RenderGraph::Name, *renderGraph, passID) = std::string_view{name};
}

void NativeMovePassBuilder::addPair(const MovePair &pair) {
    auto &movePass = get(MoveTag{}, passID, *renderGraph);
    movePass.movePairs.emplace_back(pair);
}

ccstd::string NativeCopyPassBuilder::getName() const {
    return std::string(get(RenderGraph::Name, *renderGraph, passID));
}

void NativeCopyPassBuilder::setName(const ccstd::string &name) {
    get(RenderGraph::Name, *renderGraph, passID) = std::string_view{name};
}

void NativeCopyPassBuilder::addPair(const CopyPair &pair) {
    auto &copyPass = get(CopyTag{}, passID, *renderGraph);
    copyPass.copyPairs.emplace_back(pair);
}

namespace {

const char *getName(const gfx::LoadOp &op) {
    switch (op) {
        case gfx::LoadOp::LOAD:
            return "LOAD";
        case gfx::LoadOp::CLEAR:
            return "CLEAR";
        case gfx::LoadOp::DISCARD:
            return "DISCARD";
        default:
            return "UNKNOWN";
    }
    return "UNKNOWN";
}

const char *getName(const gfx::StoreOp &op) {
    switch (op) {
        case gfx::StoreOp::STORE:
            return "STORE";
        case gfx::StoreOp::DISCARD:
            return "DISCARD";
        default:
            return "UNKNOWN";
    }
    return "UNKNOWN";
}

std::string getName(const gfx::ClearFlagBit &flags) {
    std::ostringstream oss;
    int count = 0;
    if (hasAnyFlags(flags, gfx::ClearFlagBit::COLOR)) {
        if (count++) {
            oss << "|";
        }
        oss << "COLOR";
    }
    if (hasAnyFlags(flags, gfx::ClearFlagBit::DEPTH)) {
        if (count++) {
            oss << "|";
        }
        oss << "DEPTH";
    }
    if (hasAnyFlags(flags, gfx::ClearFlagBit::STENCIL)) {
        if (count++) {
            oss << "|";
        }
        oss << "STENCIL";
    }
    if (flags == gfx::ClearFlagBit::NONE) {
        oss << "NONE";
    }
    return oss.str();
}

struct RenderGraphPrintVisitor : boost::dfs_visitor<> {
    void discover_vertex(
        RenderGraph::vertex_descriptor vertID,
        const AddressableView<RenderGraph> &gv) const {
        const auto &g = gv.mGraph;
        const auto &name = get(RenderGraph::Name, g, vertID);
        visitObject(
            vertID, gv.mGraph,
            [&](const RasterPass &pass) {
                OSS << "RasterPass \"" << name << "\" {\n";
                indent(space);
                for (const auto &[name, rasterView] : pass.rasterViews) {
                    OSS << "RasterView \"" << name << "\" {\n";
                    {
                        INDENT();
                        OSS << "slotName: \"" << rasterView.slotName << "\";\n";
                        OSS << "accessType: " << getName(rasterView.accessType) << ";\n";
                        OSS << "attachmentType: " << getName(rasterView.attachmentType) << ";\n";
                        OSS << "loadOp: " << getName(rasterView.loadOp) << ";\n";
                        OSS << "storeOp: " << getName(rasterView.storeOp) << ";\n";
                        OSS << "clearFlags: " << getName(rasterView.clearFlags) << ";\n";
                        const auto &c = rasterView.clearColor;
                        if (hasAnyFlags(rasterView.clearFlags, gfx::ClearFlagBit::COLOR)) {
                            OSS << "clearColor: [" << c.x << ", " << c.y << ", " << c.z << ", " << c.z << "];\n";
                        } else if (hasAnyFlags(rasterView.clearFlags, gfx::ClearFlagBit::DEPTH_STENCIL)) {
                            OSS << "clearColor: [" << c.x << ", " << c.y << "];\n";
                        }
                    }
                    OSS << "}\n";
                }
                for (const auto &[name, computeViews] : pass.computeViews) {
                    OSS << "ComputeViews \"" << name << "\" {\n";
                    {
                        INDENT();
                        for (const auto &computeView : computeViews) {
                            OSS << "ComputeView \"" << computeView.name << "\" {\n";
                            {
                                INDENT();
                                OSS << "accessType: " << getName(computeView.accessType) << ";\n";
                                OSS << "clearFlags: " << getName(computeView.clearFlags) << ";\n";
                                const auto &c = computeView.clearColor;
                                if (hasAnyFlags(computeView.clearFlags, gfx::ClearFlagBit::COLOR)) {
                                    OSS << "clearColor: [" << c.x << ", " << c.y << ", " << c.z << ", " << c.z << "];\n";
                                } else if (hasAnyFlags(computeView.clearFlags, gfx::ClearFlagBit::DEPTH_STENCIL)) {
                                    OSS << "clearColor: [" << c.x << ", " << c.y << "];\n";
                                }
                            }
                            OSS << "}\n";
                        }
                    }
                    OSS << "}\n";
                }
            },
            [&](const ComputePass &pass) {
                OSS << "ComputePass \"" << name << "\" {\n";
                indent(space);
                for (const auto &[name, computeViews] : pass.computeViews) {
                    OSS << "ComputeViews \"" << name << "\" {\n";
                    {
                        INDENT();
                        for (const auto &computeView : computeViews) {
                            OSS << "ComputeView \"" << computeView.name << "\" {\n";
                            {
                                INDENT();
                                OSS << "accessType: " << getName(computeView.accessType) << ";\n";
                                OSS << "clearFlags: " << getName(computeView.clearFlags) << ";\n";
                                const auto &c = computeView.clearColor;
                                if (hasAnyFlags(computeView.clearFlags, gfx::ClearFlagBit::COLOR)) {
                                    OSS << "clearColor: [" << c.x << ", " << c.y << ", " << c.z << ", " << c.z << "];\n";
                                } else if (hasAnyFlags(computeView.clearFlags, gfx::ClearFlagBit::DEPTH_STENCIL)) {
                                    OSS << "clearColor: [" << c.x << ", " << c.y << "];\n";
                                }
                            }
                            OSS << "}\n";
                        }
                    }
                    OSS << "}\n";
                }
            },
            [&](const CopyPass &pass) {
                OSS << "CopyPass \"" << name << "\" {\n";
                for (const auto &pair : pass.copyPairs) {
                    INDENT();
                    OSS << "source: \"" << pair.source << "\", target: \"" << pair.target << "\"\n";
                }
                indent(space);
            },
            [&](const MovePass &pass) {
                OSS << "MovePass \"" << name << "\" {\n";
                for (const auto &pair : pass.movePairs) {
                    INDENT();
                    OSS << "source: \"" << pair.source << "\", target: \"" << pair.target << "\"\n";
                }
                indent(space);
            },
            [&](const PresentPass &pass) {
                OSS << "PresentPass \"" << name << "\" {\n";
                for (const auto &[name, present] : pass.presents) {
                    INDENT();
                    OSS << "present: \"" << name << "\", sync: " << present.syncInterval << ";\n";
                }
                indent(space);
            },
            [&](const RaytracePass &pass) {
                std::ignore = pass;
                OSS << "RaytracePass \"" << name << "\" {\n";
                indent(space);
            },
            [&](const RenderQueue &queue) {
                OSS << "Queue \"" << name << "\" {\n";
                {
                    INDENT();
                    OSS << "hint: " << getName(queue.hint) << ";\n";
                }
                indent(space);
            },
            [&](const SceneData &scene) {
                OSS << "Scene \"" << name << "\" {\n";
                {
                    INDENT();
                    // OSS << "name: \"" << scene.name << "\";\n";
                    OSS << "scenes: [";
                    int count = 0;
                    for (const auto &sceneName : scene.scenes) {
                        if (count++) {
                            oss << ", ";
                        }
                        oss << "\"" << sceneName << "\"";
                    }
                    oss << "];\n";
                    // OSS << "flags: " << getName(scene.flags) << ";\n";
                }
                indent(space);
            },
            [&](const Blit &blit) {
                std::ignore = blit;
                OSS << "Blit \"" << name << "\";\n";
            },
            [&](const Dispatch &dispatch) {
                OSS << "Dispatch \"" << name << "\", ["
                    << dispatch.threadGroupCountX << ", "
                    << dispatch.threadGroupCountY << ", "
                    << dispatch.threadGroupCountZ << "];\n";
            },
            [&](const ccstd::pmr::vector<ClearView> &clearViews) {
                OSS << "Clear \"" << name << "\" {\n";
                indent(space);
                for (const auto &view : clearViews) {
                    INDENT();
                    OSS << "\"" << view.slotName << "\" {\n";
                    {
                        INDENT();
                        OSS << "clearFlags: " << getName(view.clearFlags) << ";\n";
                        const auto &c = view.clearColor;
                        if (hasAnyFlags(view.clearFlags, gfx::ClearFlagBit::COLOR)) {
                            OSS << "clearColor: [" << c.x << ", " << c.y << ", " << c.z << ", " << c.z << "];\n";
                        } else if (hasAnyFlags(view.clearFlags, gfx::ClearFlagBit::DEPTH_STENCIL)) {
                            OSS << "clearColor: [" << c.x << ", " << c.y << "];\n";
                        }
                    }
                    OSS << "}\n";
                }
            },
            [&](const gfx::Viewport &vp) {
                OSS << "Viewport \"" << name << "\" ["
                    << "left: " << vp.left << ", "
                    << "top: " << vp.top << ", "
                    << "width: " << vp.width << ", "
                    << "height: " << vp.height << ", "
                    << "minDepth: " << vp.minDepth << ", "
                    << "maxDepth: " << vp.maxDepth << "]\n";
            });
    }

    void finish_vertex(
        RenderGraph::vertex_descriptor vertID,
        const AddressableView<RenderGraph> &gv) const {
        std::ignore = gv;
        visitObject(
            vertID, gv.mGraph,
            [&](const RasterPass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const ComputePass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const CopyPass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const MovePass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const PresentPass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const RaytracePass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const RenderQueue &queue) {
                std::ignore = queue;
                unindent(space);
                OSS << "}\n";
            },
            [&](const SceneData &scene) {
                std::ignore = scene;
                unindent(space);
                OSS << "}\n";
            },
            [&](const Blit &blit) {
            },
            [&](const Dispatch &dispatch) {
            },
            [&](const ccstd::pmr::vector<ClearView> &clear) {
                std::ignore = clear;
                unindent(space);
                OSS << "}\n";
            },
            [&](const gfx::Viewport &clear) {
            });
    }

    std::ostringstream &oss;
    ccstd::pmr::string &space;
};

} // namespace

ccstd::string RenderGraph::print(
    boost::container::pmr::memory_resource *scratch) const {
    const auto &rg = *this;
    std::ostringstream oss;
    ccstd::pmr::string space(scratch);
    oss << "\n";
    OSS << "RenderGraph {\n";
    {
        INDENT();
        RenderGraphPrintVisitor visitor{
            {}, oss, space};
        AddressableView<RenderGraph> graphView(rg);
        auto colors = rg.colors(scratch);
        boost::depth_first_search(graphView, visitor, get(colors, rg));
    }
    OSS << "}\n";
    return oss.str();
}

} // namespace render

} // namespace cc
