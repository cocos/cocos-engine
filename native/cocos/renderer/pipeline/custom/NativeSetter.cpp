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

#include "cocos/renderer/pipeline/custom/NativeBuiltinUtils.h"
#include "cocos/renderer/pipeline/custom/NativePipelineTypes.h"
#include "cocos/renderer/pipeline/custom/NativeUtils.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"
#include "cocos/scene/Light.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/SpotLight.h"

namespace cc {

namespace render {

void NativeSetter::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setMat4Impl(data, *layoutGraph, name, mat);
}

void NativeSetter::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setQuaternionImpl(data, *layoutGraph, name, quat);
}

void NativeSetter::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setColorImpl(data, *layoutGraph, name, color);
}

void NativeSetter::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setVec4Impl(data, *layoutGraph, name, vec);
}

void NativeSetter::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setVec2Impl(data, *layoutGraph, name, vec);
}

void NativeSetter::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setFloatImpl(data, *layoutGraph, name, v);
}

void NativeSetter::setArrayBuffer(const ccstd::string &name, const ArrayBuffer *buffer) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setArrayBufferImpl(data, *layoutGraph, name, *buffer);
}

void NativeSetter::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setBufferImpl(data, *layoutGraph, name, buffer);
}

void NativeSetter::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setTextureImpl(data, *layoutGraph, name, texture);
}

void NativeSetter::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setReadWriteBufferImpl(data, *layoutGraph, name, buffer);
}

void NativeSetter::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setReadWriteTextureImpl(data, *layoutGraph, name, texture);
}

void NativeSetter::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setSamplerImpl(data, *layoutGraph, name, sampler);
}

void NativeSetter::setVec4ArraySize(const ccstd::string &name, uint32_t sz) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setVec4ArraySizeImpl(data, *layoutGraph, name, sz);
}

void NativeSetter::setVec4ArrayElem(const ccstd::string &name, const cc::Vec4 &vec, uint32_t id) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setVec4ArrayElemImpl(data, *layoutGraph, name, vec, id);
}

void NativeSetter::setMat4ArraySize(const ccstd::string &name, uint32_t sz) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setMat4ArraySizeImpl(data, *layoutGraph, name, sz);
}

void NativeSetter::setMat4ArrayElem(const ccstd::string &name, const cc::Mat4 &mat, uint32_t id) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setMat4ArrayElemImpl(data, *layoutGraph, name, mat, id);
}

void NativeSetter::setBuiltinCameraConstants(const scene::Camera *camera) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setCameraUBOValues(
        *camera,
        *layoutGraph,
        *pipelineRuntime->getPipelineSceneData(),
        camera->getScene()->getMainLight(), data);
}

void NativeSetter::setBuiltinDirectionalLightFrustumConstants(
    const scene::Camera *camera,
    const scene::DirectionalLight *light, uint32_t level) {
    CC_EXPECTS(light);
    // if csm is actually activated, csm is not nullptr
    // update and get csm
    const auto *csm = getBuiltinShadowCSM(*pipelineRuntime, *camera, light);

    // set data
    auto *device = pipelineRuntime->getDevice();
    const auto &sceneData = *pipelineRuntime->getPipelineSceneData();
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setShadowUBOLightView(device, *layoutGraph, sceneData, csm, *light, level, data);
}

void NativeSetter::setBuiltinSpotLightFrustumConstants(const scene::SpotLight *light) {
    CC_EXPECTS(light);
    auto *device = pipelineRuntime->getDevice();
    const auto &sceneData = *pipelineRuntime->getPipelineSceneData();
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setShadowUBOLightView(device, *layoutGraph, sceneData, nullptr, *light, 0, data);
}

void NativeSetter::setBuiltinShadowMapConstants(
    const scene::DirectionalLight *light) {
    CC_EXPECTS(light);
    auto *device = pipelineRuntime->getDevice();
    const auto &sceneData = *pipelineRuntime->getPipelineSceneData();
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setShadowUBOView(*device, *layoutGraph, sceneData, *light, data);
}

namespace {

constexpr float LIGHT_METER_SCALE = 10000.0F;
constexpr bool ENABLE_NEW_MULTI_LIGHT = false;

} // namespace

void NativeSetter::setBuiltinDirectionalLightConstants(const scene::DirectionalLight *light, const scene::Camera *camera) {
    std::ignore = camera;
    setBuiltinShadowMapConstants(light);
}

void NativeSetter::setBuiltinSphereLightConstants(
    const scene::SphereLight *light, const scene::Camera *camera) {
    CC_EXPECTS(light);
    const auto &sceneData = *pipelineRuntime->getPipelineSceneData();
    const auto &shadowInfo = *sceneData.getShadows();

    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);

    if constexpr (ENABLE_NEW_MULTI_LIGHT) {
        setVec4Impl(
            data, *layoutGraph, "cc_lightPos",
            toVec4(light->getPosition(), static_cast<float>(scene::LightType::SPHERE)));
        auto color = toVec4(light->getColor());
        if (light->isUseColorTemperature()) {
            const auto &rgb = light->getColorTemperatureRGB();
            color.x *= rgb.x;
            color.y *= rgb.y;
            color.z *= rgb.z;
        }
        if (sceneData.isHDR()) {
            color.w = light->getLuminance() * camera->getExposure() * LIGHT_METER_SCALE;
        } else {
            color.w = light->getLuminance();
        }

        setVec4Impl(
            data, *layoutGraph, "cc_lightColor", color);
        setVec4Impl(
            data, *layoutGraph, "cc_lightSizeRangeAngle",
            Vec4(
                light->getSize(),
                light->getRange(),
                0.F,
                0.F));
    }
    setPunctualLightShadowUBO(
        pipelineRuntime->getDevice(), *layoutGraph, sceneData,
        camera->getScene()->getMainLight(), *light, data);
}

void NativeSetter::setBuiltinSpotLightConstants(const scene::SpotLight *light, const scene::Camera *camera) {
    CC_EXPECTS(light);
    const auto &sceneData = *this->pipelineRuntime->getPipelineSceneData();
    const auto &shadowInfo = *sceneData.getShadows();

    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);

    if constexpr (ENABLE_NEW_MULTI_LIGHT) {
        setVec4Impl(
            data, *layoutGraph, "cc_lightPos",
            toVec4(light->getPosition(), static_cast<float>(scene::LightType::SPOT)));

        auto color = toVec4(light->getColor());
        if (light->isUseColorTemperature()) {
            const auto &rgb = light->getColorTemperatureRGB();
            color.x *= rgb.x;
            color.y *= rgb.y;
            color.z *= rgb.z;
        }
        if (sceneData.isHDR()) {
            color.w = light->getLuminance() * camera->getExposure() * LIGHT_METER_SCALE;
        } else {
            color.w = light->getLuminance();
        }

        setVec4Impl(
            data, *layoutGraph, "cc_lightColor", color);

        setVec4Impl(
            data, *layoutGraph, "cc_lightSizeRangeAngle",
            Vec4(
                light->getSize(),
                light->getRange(),
                light->getSpotAngle(),
                shadowInfo.isEnabled() &&
                        light->isShadowEnabled() &&
                        shadowInfo.getType() == scene::ShadowType::SHADOW_MAP
                    ? 1.0F
                    : 0.0F));

        setVec4Impl(
            data, *layoutGraph, "cc_lightBoundingSizeVS",
            Vec4(0, 0, 0, light->getAngleAttenuationStrength()));

        setVec4Impl(
            data, *layoutGraph, "cc_lightDir",
            toVec4(light->getDirection()));
    }
    setPunctualLightShadowUBO(
        pipelineRuntime->getDevice(), *layoutGraph, sceneData,
        camera->getScene()->getMainLight(), *light, data);
}

void NativeSetter::setBuiltinPointLightConstants(const scene::PointLight *light, const scene::Camera *camera) {
    CC_EXPECTS(light);
    const auto &sceneData = *this->pipelineRuntime->getPipelineSceneData();
    const auto &shadowInfo = *sceneData.getShadows();

    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);

    if constexpr (ENABLE_NEW_MULTI_LIGHT) {
        setVec4Impl(
            data, *layoutGraph, "cc_lightPos",
            toVec4(light->getPosition(), static_cast<float>(scene::LightType::POINT)));
        auto color = toVec4(light->getColor());
        if (light->isUseColorTemperature()) {
            const auto &rgb = light->getColorTemperatureRGB();
            color.x *= rgb.x;
            color.y *= rgb.y;
            color.z *= rgb.z;
        }
        if (sceneData.isHDR()) {
            color.w = light->getLuminance() * camera->getExposure() * LIGHT_METER_SCALE;
        } else {
            color.w = light->getLuminance();
        }

        setVec4Impl(
            data, *layoutGraph, "cc_lightColor", color);
        setVec4Impl(
            data, *layoutGraph, "cc_lightSizeRangeAngle",
            Vec4(
                0.F,
                light->getRange(),
                0.F,
                0.F));
    }
    setPunctualLightShadowUBO(
        pipelineRuntime->getDevice(), *layoutGraph, sceneData,
        camera->getScene()->getMainLight(), *light, data);
}

void NativeSetter::setBuiltinRangedDirectionalLightConstants(const scene::RangedDirectionalLight *light, const scene::Camera *camera) {
    const auto &sceneData = *this->pipelineRuntime->getPipelineSceneData();
    const auto &shadowInfo = *sceneData.getShadows();

    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);

    if constexpr (ENABLE_NEW_MULTI_LIGHT) {
        setVec4Impl(
            data, *layoutGraph, "cc_lightPos",
            toVec4(light->getPosition(), static_cast<float>(scene::LightType::RANGED_DIRECTIONAL)));
        auto color = toVec4(light->getColor());
        if (light->isUseColorTemperature()) {
            const auto &rgb = light->getColorTemperatureRGB();
            color.x *= rgb.x;
            color.y *= rgb.y;
            color.z *= rgb.z;
        }
        if (sceneData.isHDR()) {
            color.w = light->getIlluminance() * camera->getExposure();
        } else {
            color.w = light->getIlluminance();
        }

        setVec4Impl(
            data, *layoutGraph, "cc_lightColor", color);
        setVec4Impl(
            data, *layoutGraph, "cc_lightSizeRangeAngle",
            Vec4(
                light->getRight().x,
                light->getRight().y,
                light->getRight().z,
                0.F));
    }
}

} // namespace render

} // namespace cc
