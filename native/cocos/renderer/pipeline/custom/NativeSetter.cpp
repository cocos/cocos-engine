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

void NativeSetter::setUint(const ccstd::string &name, uint32_t v) {
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setUintImpl(data, *layoutGraph, name, v);
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

void NativeSetter::setBuiltinDirectionalLightViewConstants(
    const scene::DirectionalLight *light, uint32_t level) {
    CC_EXPECTS(light);
    auto *device = pipelineRuntime->getDevice();
    const auto &sceneData = *pipelineRuntime->getPipelineSceneData();
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setShadowUBOLightView(device, *layoutGraph, sceneData, *light, level, data);
}

void NativeSetter::setBuiltinSpotLightViewConstants(const scene::SpotLight *light) {
    CC_EXPECTS(light);
    auto *device = pipelineRuntime->getDevice();
    const auto &sceneData = *pipelineRuntime->getPipelineSceneData();
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setShadowUBOLightView(device, *layoutGraph, sceneData, *light, 0, data);
}

void NativeSetter::setBuiltinShadowMapConstants(
    const scene::DirectionalLight *light) {
    CC_EXPECTS(light);
    auto *device = pipelineRuntime->getDevice();
    const auto &sceneData = *pipelineRuntime->getPipelineSceneData();
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
    setShadowUBOView(*device, *layoutGraph, sceneData, *light, data);
}

void NativeSetter::setBuiltinDirectionalLightConstants(const scene::DirectionalLight *light, const scene::Camera *camera) {
}

void NativeSetter::setBuiltinSphereLightConstants(const scene::SphereLight *light, const scene::Camera *camera) {
}

void NativeSetter::setBuiltinSpotLightConstants(const scene::SpotLight *light, const scene::Camera *camera) {
}

void NativeSetter::setBuiltinPointLightConstants(const scene::PointLight *light, const scene::Camera *camera) {
}

void NativeSetter::setBuiltinRangedDirectionalLightConstants(const scene::RangedDirectionalLight *light, const scene::Camera *camera) {
}

} // namespace render

} // namespace cc
