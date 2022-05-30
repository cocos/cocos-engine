/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include <memory>
#include <sstream>
#include <stdexcept>
#include <tuple>
#include <type_traits>
#include <utility>
#include "LayoutGraphGraphs.h"
#include "NativePipelineTypes.h"
#include "base/Macros.h"
#include "base/Ptr.h"
#include "boost/container/pmr/global_resource.hpp"
#include "boost/container/pmr/unsynchronized_pool_resource.hpp"
#include "boost/utility/string_view_fwd.hpp"
#include "cocos/base/StringUtil.h"
#include "cocos/renderer/gfx-base/GFXDescriptorSetLayout.h"
#include "cocos/renderer/pipeline/Enum.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/RenderPipeline.h"
#include "cocos/renderer/pipeline/custom/DebugUtils.h"
#include "cocos/renderer/pipeline/custom/GslUtils.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphNames.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/RenderWindow.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXSwapchain.h"
#include "gfx-base/states/GFXSampler.h"
#include "math/Mat4.h"
#include "pipeline/custom/LayoutGraphFwd.h"
#include "pipeline/custom/LayoutGraphTypes.h"
#include "pipeline/custom/NativePipelineFwd.h"
#include "pipeline/custom/Range.h"
#include "pipeline/custom/RenderGraphTypes.h"
#include "pipeline/custom/RenderInterfaceTypes.h"
#include "profiler/DebugRenderer.h"

namespace cc {

namespace render {

uint32_t NativeLayoutGraphBuilder::addRenderStage(const ccstd::string &name) {
    return add_vertex(*data, RenderStageTag{}, name.c_str());
}

uint32_t NativeLayoutGraphBuilder::addRenderPhase(const ccstd::string &name, uint32_t parentID) {
    return add_vertex(*data, RenderPhaseTag{}, name.c_str(), parentID);
}

void NativeLayoutGraphBuilder::addDescriptorBlock(
    uint32_t nodeID,
    const DescriptorBlockIndex &index, const DescriptorBlock &block) {
    auto &g = *data;
    auto &ppl = get(LayoutGraphData::Layout, g, nodeID);

    CC_ASSERT(block.capacity);
    auto &layout = ppl.descriptorSets[index.updateFrequency].descriptorSetLayoutData;

    // add block
    layout.descriptorBlocks.emplace_back(
        index.descriptorType, index.visibility, block.capacity);

    auto &dstBlock = layout.descriptorBlocks.back();
    dstBlock.offset = layout.capacity;
    dstBlock.capacity = block.capacity;
    for (const auto &pairD : block.descriptors) {
        const auto &name = pairD.first;
        const auto &d = pairD.second;
        auto iter = g.attributeIndex.find(boost::string_view(name));
        if (iter == g.attributeIndex.end()) {
            throw std::out_of_range("attribute not found");
        }
        const auto &nameID = iter->second;
        dstBlock.descriptors.emplace_back(nameID, d.count);
    }
    // update layout
    layout.capacity += block.capacity;
}

void NativeLayoutGraphBuilder::reserveDescriptorBlock(
    uint32_t nodeID,
    const DescriptorBlockIndex &index, const DescriptorBlock &block) {
    auto &g = *data;
    auto &ppl = get(LayoutGraphData::Layout, g, nodeID);

    CC_ASSERT(block.capacity);
    auto &layout = ppl.descriptorSets[index.updateFrequency].descriptorSetLayoutData;

    // add block
    layout.descriptorBlocks.emplace_back(
        index.descriptorType, index.visibility, block.capacity);

    auto &dstBlock = layout.descriptorBlocks.back();
    dstBlock.offset = layout.capacity;
    dstBlock.capacity = block.capacity;

    // update layout
    layout.capacity += block.capacity;
}

void NativeRasterPassBuilder::addRasterView(const ccstd::string &name, const RasterView &view) {
    auto &pass = get(RasterTag{}, passID, *renderGraph);
    pass.rasterViews.emplace(
        std::piecewise_construct,
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(view));
}

void NativeRasterPassBuilder::addComputeView(const ccstd::string &name, const ComputeView &view) {
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

void NativeRasterQueueBuilder::addSceneOfCamera(scene::Camera *camera, const ccstd::string &name) {
    SceneData scene(renderGraph->get_allocator());
    scene.camera = camera;
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

void NativeRasterQueueBuilder::addSceneOfCamera(scene::Camera *camera) {
    addSceneOfCamera(camera, "Scene");
}

void NativeRasterQueueBuilder::addScene(const ccstd::string &name) {
    auto sceneID = addVertex(
        SceneTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        *renderGraph, queueID);
    CC_ENSURES(sceneID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::addFullscreenQuad(
    const ccstd::string &shader, const ccstd::string &name) { // NOLINT(bugprone-easily-swappable-parameters)
    auto drawID = addVertex(
        BlitTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(shader.c_str()),
        *renderGraph, queueID);
    CC_ENSURES(drawID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::addFullscreenQuad(const ccstd::string &shader) {
    addFullscreenQuad(shader, "FullscreenQuad");
}

namespace {

render::NameLocalID getNameID(
    const PmrFlatMap<ccstd::pmr::string, render::NameLocalID> &index,
    boost::string_view name) {
    auto iter = index.find(name);
    CC_EXPECTS(iter != index.end());
    return iter->second;
}

void addMat4(
    const LayoutGraphData &lg, boost::string_view name,
    const cc::Mat4 &v, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Mat4) == 16 * 4, "sizeof(Mat4) is not 64 bytes");
    data.constants[nameID.value].resize(sizeof(Mat4));
    memcpy(data.constants[nameID.value].data(), v.m, sizeof(v));
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

RasterQueueBuilder *NativeRasterPassBuilder::addQueue(
    QueueHint hint,
    const ccstd::string &layoutName, const ccstd::string &name) { // NOLINT(bugprone-easily-swappable-parameters)
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(hint),
        *renderGraph, passID);

    auto queueLayoutID = locate(layoutID, layoutName, *layoutGraph);

    return new NativeRasterQueueBuilder(renderGraph, queueID, layoutGraph, queueLayoutID);
}

RasterQueueBuilder *NativeRasterPassBuilder::addQueue(
    QueueHint hint,
    const ccstd::string &layoutName) {
    return addQueue(hint, layoutName, "Queue");
}

namespace {

const ccstd::pmr::string &getFirstChildLayoutName(
    const LayoutGraphData &lg,
    LayoutGraphData::vertex_descriptor parentID) {
    auto childNodes = children(parentID, lg);
    CC_EXPECTS(childNodes.first->target != LayoutGraphData::null_vertex());
    auto queueLayoutID = childNodes.first->target;
    const auto &layoutName = get(LayoutGraphData::Name, lg, queueLayoutID);
    return layoutName;
}

} // namespace

RasterQueueBuilder *NativeRasterPassBuilder::addQueue(QueueHint hint) {
    const auto &layoutName = getFirstChildLayoutName(*layoutGraph, passID);
    return addQueue(hint, layoutName.c_str(), "Queue"); // NOLINT(readability-redundant-string-cstr)
}

void NativeRasterPassBuilder::addFullscreenQuad(
    const ccstd::string &shader, const ccstd::string &layoutName, const ccstd::string &name) { // NOLINT(bugprone-easily-swappable-parameters)
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(QueueHint::RENDER_TRANSPARENT),
        *renderGraph, passID);

    addVertex(
        BlitTag{},
        std::forward_as_tuple("FullscreenQuad"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(shader.c_str()),
        *renderGraph, queueID);
}

void NativeRasterPassBuilder::addFullscreenQuad(
    const ccstd::string &shader, const ccstd::string &layoutName) { // NOLINT(bugprone-easily-swappable-parameters)
    return addFullscreenQuad(shader, layoutName, "FullscreenQuad");
}

void NativeRasterPassBuilder::addFullscreenQuad(const ccstd::string &shader) {
    const auto &layoutName = getFirstChildLayoutName(*layoutGraph, passID);
    return addFullscreenQuad(shader, layoutName.c_str()); // NOLINT(readability-redundant-string-cstr)
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

// NativeComputeQueue
void NativeComputeQueueBuilder::addDispatch(const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string &layoutName, const ccstd::string &name) { // NOLINT(bugprone-easily-swappable-parameters)
    addVertex(
        DispatchTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(shader.c_str(), threadGroupCountX, threadGroupCountY, threadGroupCountZ),
        *renderGraph, queueID);
}

void NativeComputeQueueBuilder::addDispatch(const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string &layoutName) {
    addDispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ, layoutName.c_str(), "Dispatch"); // NOLINT(readability-redundant-string-cstr)
}

void NativeComputeQueueBuilder::addDispatch(const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) {
    const auto &layoutName = getFirstChildLayoutName(*layoutGraph, queueID);
    addDispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ, layoutName.c_str()); // NOLINT(readability-redundant-string-cstr)
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

void NativeComputePassBuilder::addComputeView(const ccstd::string &name, const ComputeView &view) {
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

ComputeQueueBuilder *NativeComputePassBuilder::addQueue(
    const ccstd::string &layoutName, const ccstd::string &name) { // NOLINT(bugprone-easily-swappable-parameters)

    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(QueueHint::NONE),
        *renderGraph, passID);

    auto queueLayoutID = locate(layoutID, layoutName, *layoutGraph);

    return new NativeComputeQueueBuilder(renderGraph, queueID, layoutGraph, queueLayoutID);
}

ComputeQueueBuilder *NativeComputePassBuilder::addQueue(const ccstd::string &layoutName) {
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple("Compute"),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        *renderGraph, passID);

    auto queueLayoutID = locate(layoutID, layoutName, *layoutGraph);

    return new NativeComputeQueueBuilder(renderGraph, queueID, layoutGraph, queueLayoutID);
}

ComputeQueueBuilder *NativeComputePassBuilder::addQueue() {
    const auto &layoutName = getFirstChildLayoutName(*layoutGraph, passID);
    return addQueue(layoutName.c_str()); // NOLINT
}

void NativeComputePassBuilder::addDispatch(
    const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ,
    const ccstd::string &layoutName, const ccstd::string &name) { // NOLINT(bugprone-easily-swappable-parameters)
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        *renderGraph, passID);

    addVertex(
        DispatchTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(shader.c_str(), threadGroupCountX, threadGroupCountY, threadGroupCountZ),
        *renderGraph, queueID);
}

void NativeComputePassBuilder::addDispatch(
    const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string &layoutName) {
    addDispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ, layoutName, "Dispatch");
}

void NativeComputePassBuilder::addDispatch(
    const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) {
    const auto &layoutName = getFirstChildLayoutName(*layoutGraph, passID);

    addDispatch(
        shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ,
        layoutName.c_str()); // NOLINT(readability-redundant-string-cstr)
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

void NativeMovePassBuilder::addPair(const MovePair &pair) {
    auto &movePass = get(MoveTag{}, passID, *renderGraph);
    movePass.movePairs.emplace_back(pair);
}

void NativeCopyPassBuilder::addPair(const CopyPair &pair) {
    auto &copyPass = get(CopyTag{}, passID, *renderGraph);
    copyPass.copyPairs.emplace_back(pair);
}

SceneTask *NativeSceneTransversal::transverse(SceneVisitor *visitor) const {
    std::ignore = visitor;
    return nullptr;
}

namespace {

gfx::DescriptorType getGfxType(DescriptorTypeOrder type) {
    switch (type) {
        case DescriptorTypeOrder::UNIFORM_BUFFER:
            return gfx::DescriptorType::UNIFORM_BUFFER;
        case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
            return gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER;
        case DescriptorTypeOrder::SAMPLER_TEXTURE:
            return gfx::DescriptorType::SAMPLER_TEXTURE;
        case DescriptorTypeOrder::SAMPLER:
            return gfx::DescriptorType::SAMPLER;
        case DescriptorTypeOrder::TEXTURE:
            return gfx::DescriptorType::TEXTURE;
        case DescriptorTypeOrder::STORAGE_BUFFER:
            return gfx::DescriptorType::STORAGE_BUFFER;
        case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
            return gfx::DescriptorType::DYNAMIC_STORAGE_BUFFER;
        case DescriptorTypeOrder::STORAGE_IMAGE:
            return gfx::DescriptorType::STORAGE_IMAGE;
        case DescriptorTypeOrder::INPUT_ATTACHMENT:
            return gfx::DescriptorType::INPUT_ATTACHMENT;
    }
    throw std::invalid_argument("DescriptorType not found");
}

IntrusivePtr<gfx::DescriptorSetLayout> createDescriptorSetLayout(
    gfx::Device *device, const DescriptorSetLayoutData &layoutData) {
    gfx::DescriptorSetLayoutInfo info;

    for (const auto &block : layoutData.descriptorBlocks) {
        uint32_t slot = block.offset;
        for (const auto &d : block.descriptors) {
            gfx::DescriptorSetLayoutBinding binding;
            binding.binding = slot;
            binding.descriptorType = getGfxType(block.type);
            binding.count = d.count;
            binding.stageFlags = block.visibility;
            binding.immutableSamplers = {};
            info.bindings.emplace_back(std::move(binding));
            slot += d.count;
        }
    }

    return {device->createDescriptorSetLayout(info)};
}

} // namespace

int NativeLayoutGraphBuilder::compile() {
    auto &g = *data;
    // create descriptor sets
    for (const auto v : makeRange(vertices(g))) {
        auto &ppl = get(LayoutGraphData::Layout, g, v);
        for (auto &levelPair : ppl.descriptorSets) {
            auto &level = levelPair.second;
            const auto &layoutData = level.descriptorSetLayoutData;
            level.descriptorSetLayout = createDescriptorSetLayout(device, layoutData);
            level.descriptorSet = device->createDescriptorSet(
                gfx::DescriptorSetInfo{level.descriptorSetLayout.get()});
        }
    }

    return 0;
}

namespace {

ccstd::string getName(gfx::ShaderStageFlagBit stage) {
    std::ostringstream oss;
    int count = 0;
    if (hasFlag(stage, gfx::ShaderStageFlagBit::VERTEX)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Vertex";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::CONTROL)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Control";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::EVALUATION)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Evaluation";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::GEOMETRY)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Geometry";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::FRAGMENT)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Fragment";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::COMPUTE)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Compute";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::ALL)) {
        if (count++) {
            oss << " | ";
        }
        oss << "All";
    }
    return oss.str();
}

} // namespace

ccstd::string NativeLayoutGraphBuilder::print() const {
    std::ostringstream oss;
    boost::container::pmr::unsynchronized_pool_resource pool(
        boost::container::pmr::get_default_resource());
    ccstd::pmr::string space(&pool);

    auto &g = *data;
    for (const auto v : makeRange(vertices(g))) {
        if (parent(v, g) != LayoutGraphData::null_vertex()) {
            continue;
        }
        const auto &name = get(LayoutGraphData::Name, g, v);
        const auto &freq = get(LayoutGraphData::Update, g, v);
        OSS << "\"" << name << "\": ";

        visit(
            [&](auto tag) {
                oss << getName(tag);
            },
            tag(v, g));

        oss << "<" << getName(freq) << "> {\n";
        INDENT_BEG();
        const auto &info = get(LayoutGraphData::Layout, g, v);
        for (const auto &set : info.descriptorSets) {
            OSS << "Set<" << getName(set.first) << "> {\n";
            {
                INDENT();
                for (const auto &block : set.second.descriptorSetLayoutData.descriptorBlocks) {
                    OSS << "Block<" << getName(block.type) << ", " << getName(block.visibility) << "> {\n";
                    {
                        INDENT();
                        OSS << "capacity: " << block.capacity << ",\n";
                        OSS << "count: " << block.descriptors.size() << ",\n";
                        if (!block.descriptors.empty()) {
                            OSS << "Descriptors{ ";
                            int count = 0;
                            for (const auto &d : block.descriptors) {
                                if (count++) {
                                    oss << ", ";
                                }
                                const auto &name = g.valueNames.at(d.descriptorID.value);
                                oss << "\"" << name;
                                if (d.count != 1) {
                                    oss << "[" << d.count << "]";
                                }
                                oss << "\"";
                            }
                            oss << " }\n";
                        }
                    }
                    OSS << "}\n";
                }
            }
            OSS << "}\n";
        }
    }

    return oss.str();
}

NativePipeline::NativePipeline(const allocator_type &alloc) noexcept
: device(gfx::Device::getInstance()),
  globalDSManager(std::make_unique<pipeline::GlobalDSManager>()),
  layoutGraphs(alloc),
  pipelineSceneData(ccnew pipeline::PipelineSceneData()), // NOLINT
  resourceGraph(alloc),
  renderGraph(alloc) {
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addRenderTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow *renderWindow) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::ONE;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED;

    CC_EXPECTS(renderWindow);

    if (!renderWindow->getSwapchain()) {
        CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().size() == 1);
        CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().at(0));
        return addVertex(
            FramebufferTag{},
            std::forward_as_tuple(name.c_str()),
            std::forward_as_tuple(desc),
            std::forward_as_tuple(ResourceTraits{ResourceResidency::EXTERNAL}),
            std::forward_as_tuple(),
            std::forward_as_tuple(IntrusivePtr<gfx::Framebuffer>(renderWindow->getFramebuffer())),
            resourceGraph);
    }

    CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().size() == 1);
    CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().at(0));
    return addVertex(
        SwapchainTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{ResourceResidency::BACKBUFFER}),
        std::forward_as_tuple(),
        std::forward_as_tuple(RenderSwapchain{renderWindow->getSwapchain()}),
        resourceGraph);
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addRenderTarget(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::ONE;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED;

    return addVertex(
        ManagedTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        resourceGraph);
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addDepthStencil(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::ONE;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::DEPTH_STENCIL_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED;

    CC_EXPECTS(residency == ResourceResidency::MANAGED && residency == ResourceResidency::MEMORYLESS);

    return addVertex(
        ManagedTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        resourceGraph);
}

void NativePipeline::beginFrame() {
    renderGraph = RenderGraph(get_allocator());
    if (!layoutGraphs.empty()) {
        layoutGraph = &layoutGraphs.begin()->second;
    }
}

void NativePipeline::endFrame() {
    layoutGraph = nullptr;
}

RasterPassBuilder *NativePipeline::addRasterPass(
    uint32_t width, uint32_t height, // NOLINT(bugprone-easily-swappable-parameters)
    const ccstd::string &layoutName, const ccstd::string &name) {
    RasterPass pass(renderGraph.get_allocator());
    pass.width = width;
    pass.height = height;

    auto passID = addVertex(
        RasterTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(pass)),
        renderGraph);

    CC_EXPECTS(layoutGraph);
    auto passLayoutID = locate(LayoutGraphData::null_vertex(), layoutName, *layoutGraph);
    CC_EXPECTS(passLayoutID);

    return new NativeRasterPassBuilder(&renderGraph, passID, layoutGraph, passLayoutID);
}

// NOLINTNEXTLINE
RasterPassBuilder *NativePipeline::addRasterPass(uint32_t width, uint32_t height, const ccstd::string &layoutName) {
    return addRasterPass(width, height, layoutName, "Raster");
}

// NOLINTNEXTLINE
ComputePassBuilder *NativePipeline::addComputePass(const ccstd::string &layoutName, const ccstd::string &name) {
    auto passID = addVertex(
        ComputeTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    CC_EXPECTS(layoutGraph);
    auto passLayoutID = locate(LayoutGraphData::null_vertex(), layoutName, *layoutGraph);

    return new NativeComputePassBuilder(&renderGraph, passID, layoutGraph, passLayoutID);
}

// NOLINTNEXTLINE
ComputePassBuilder *NativePipeline::addComputePass(const ccstd::string &layoutName) {
    return addComputePass(layoutName, "Compute");
}

// NOLINTNEXTLINE
MovePassBuilder *NativePipeline::addMovePass(const ccstd::string &name) {
    auto passID = addVertex(
        MoveTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    return new NativeMovePassBuilder(&renderGraph, passID);
}

// NOLINTNEXTLINE
CopyPassBuilder *NativePipeline::addCopyPass(const ccstd::string &name) {
    auto passID = addVertex(
        CopyTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    return new NativeCopyPassBuilder(&renderGraph, passID);
}

// NOLINTNEXTLINE
void NativePipeline::presentAll() {
    auto passID = addVertex(
        PresentTag{},
        std::forward_as_tuple("Present"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);
}

// NOLINTNEXTLINE
SceneTransversal *NativePipeline::createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) {
    return new NativeSceneTransversal(camera, scene);
}

LayoutGraphBuilder *NativePipeline::createLayoutGraph(const ccstd::string &name) {
    auto res = layoutGraphs.emplace(std::piecewise_construct,
                                    std::forward_as_tuple(name.c_str()),
                                    std::forward_as_tuple());
    CC_ASSERT(res.second);
    return ccnew NativeLayoutGraphBuilder(device, &res.first->second);
}

namespace {

void generateConstantMacros(
    gfx::Device *device,
    ccstd::string &constantMacros, bool clusterEnabled) {
    constantMacros = StringUtil::format(
        R"(
#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE %d
#define CC_ENABLE_CLUSTERED_LIGHT_CULLING %d
#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS %d
#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS %d
#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT %d
#define CC_PLATFORM_ANDROID_AND_WEBGL 0
#define CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES 0
        )",
        hasAnyFlags(device->getFormatFeatures(gfx::Format::RGBA32F),
                    gfx::FormatFeature::RENDER_TARGET | gfx::FormatFeature::SAMPLED_TEXTURE),
        clusterEnabled ? 1 : 0,
        device->getCapabilities().maxVertexUniformVectors,
        device->getCapabilities().maxFragmentUniformVectors,
        device->hasFeature(gfx::Feature::INPUT_ATTACHMENT_BENEFIT));
}

} // namespace

// NOLINTNEXTLINE
bool NativePipeline::activate(gfx::Swapchain *swapchainIn) {
    swapchain = swapchainIn;
    macros["CC_PIPELINE_TYPE"] = 0;
    globalDSManager->activate(device);
    pipelineSceneData->activate(device);
    DebugRenderer::getInstance()->activate(device);

    // generate macros here rather than construct func because _clusterEnabled
    // switch may be changed in root.ts setRenderPipeline() function which is after
    // pipeline construct.
    generateConstantMacros(device, constantMacros, false);

    return true;
}

bool NativePipeline::destroy() noexcept {
    if (globalDSManager) {
        globalDSManager->destroy();
        globalDSManager.reset();
    }
    if (pipelineSceneData) {
        pipelineSceneData->destroy();
        pipelineSceneData = {};
    }

    framegraph::FrameGraph::gc(0);

    return true;
}

// NOLINTNEXTLINE
void NativePipeline::render(const ccstd::vector<scene::Camera *> &cameras) {
    const auto *sceneData = pipelineSceneData.get();
    auto *commandBuffer = device->getCommandBuffer();
    float shadingScale = sceneData->getShadingScale();

    struct RenderData2 {
        framegraph::TextureHandle outputTex;
    };

    commandBuffer->begin();

    for (const auto *camera : cameras) {
        auto colorHandle = framegraph::FrameGraph::stringToHandle("outputTexture");

        auto forwardSetup = [&](framegraph::PassNodeBuilder &builder, RenderData2 &data) {
            gfx::Color clearColor;
            if (hasFlag(static_cast<gfx::ClearFlags>(camera->getClearFlag()), gfx::ClearFlagBit::COLOR)) {
                clearColor.x = camera->getClearColor().x;
                clearColor.y = camera->getClearColor().y;
                clearColor.z = camera->getClearColor().z;
            }
            clearColor.w = camera->getClearColor().w;
            // color
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = sceneData->isHDR() ? gfx::Format::RGBA16F : gfx::Format::RGBA8;
            colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT;
            colorTexInfo.width = static_cast<uint>(static_cast<float>(camera->getWindow()->getWidth()) * shadingScale);
            colorTexInfo.height = static_cast<uint>(static_cast<float>(camera->getWindow()->getHeight()) * shadingScale);
            if (shadingScale != 1.F) {
                colorTexInfo.usage |= gfx::TextureUsageBit::TRANSFER_SRC;
            }

            data.outputTex = builder.create(colorHandle, colorTexInfo);
            framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
            colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
            colorAttachmentInfo.clearColor = clearColor;
            colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;

            colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE;

            data.outputTex = builder.write(data.outputTex, colorAttachmentInfo);
            builder.writeToBlackboard(colorHandle, data.outputTex);

            auto getRenderArea = [](const scene::Camera *camera) {
                float w{static_cast<float>(camera->getWindow()->getWidth())};
                float h{static_cast<float>(camera->getWindow()->getHeight())};

                const auto &vp = camera->getViewport();
                return gfx::Rect{
                    static_cast<int32_t>(vp.x * w),
                    static_cast<int32_t>(vp.y * h),
                    static_cast<uint32_t>(vp.z * w),
                    static_cast<uint32_t>(vp.w * h),
                };
            };

            auto getViewport = [&shadingScale, &getRenderArea](const scene::Camera *camera) {
                const gfx::Rect &rect = getRenderArea(camera);
                return gfx::Viewport{
                    static_cast<int>(static_cast<float>(rect.x) * shadingScale),
                    static_cast<int>(static_cast<float>(rect.y) * shadingScale),
                    static_cast<uint>(static_cast<float>(rect.width) * shadingScale),
                    static_cast<uint>(static_cast<float>(rect.height) * shadingScale)};
            };

            auto getScissor = [&shadingScale, &getRenderArea](const scene::Camera *camera) {
                const gfx::Rect &rect = getRenderArea(camera);
                return gfx::Rect{
                    static_cast<int>(static_cast<float>(rect.x) * shadingScale),
                    static_cast<int>(static_cast<float>(rect.y) * shadingScale),
                    static_cast<uint>(static_cast<float>(rect.width) * shadingScale),
                    static_cast<uint>(static_cast<float>(rect.height) * shadingScale)};
            };

            builder.setViewport(getViewport(camera), getScissor(camera));
        };

        auto forwardExec = [](const RenderData2 & /*data*/,
                              const framegraph::DevicePassResourceTable &table) {
            // do nothing
        };

        auto passHandle = framegraph::FrameGraph::stringToHandle("forwardPass");

        frameGraph.addPass<RenderData2>(
            static_cast<uint>(ForwardInsertPoint::IP_FORWARD),
            passHandle, forwardSetup, forwardExec);

        frameGraph.presentFromBlackboard(colorHandle,
                                         camera->getWindow()->getFramebuffer()->getColorTextures()[0], true);
    }
    frameGraph.compile();
    frameGraph.execute();
    frameGraph.reset();

    ccstd::vector<gfx::CommandBuffer *> commandBuffers(1, commandBuffer);
    device->flushCommands(commandBuffers);
    device->getQueue()->submit(commandBuffers);

    commandBuffer->end();
    {
        static uint64_t frameCount{0U};
        static constexpr uint64_t INTERVAL_IN_SECONDS = 30;
        if (++frameCount % (INTERVAL_IN_SECONDS * 60) == 0) {
            framegraph::FrameGraph::gc(INTERVAL_IN_SECONDS * 60);
        }
    }
}

const MacroRecord &NativePipeline::getMacros() const {
    return macros;
}

pipeline::GlobalDSManager *NativePipeline::getGlobalDSManager() const {
    return globalDSManager.get();
}

gfx::DescriptorSetLayout *NativePipeline::getDescriptorSetLayout() const {
    return globalDSManager->getDescriptorSetLayout();
}

pipeline::PipelineSceneData *NativePipeline::getPipelineSceneData() const {
    return pipelineSceneData;
}

const ccstd::string &NativePipeline::getConstantMacros() const {
    return constantMacros;
}

scene::Model *NativePipeline::getProfiler() const {
    return profiler;
}

// NOLINTNEXTLINE
void NativePipeline::setProfiler(scene::Model *profilerIn) {
    profiler = profilerIn;
}

float NativePipeline::getShadingScale() const {
    return pipelineSceneData->getShadingScale();
}

void NativePipeline::setShadingScale(float scale) {
    pipelineSceneData->setShadingScale(scale);
}

void NativePipeline::onGlobalPipelineStateChanged() {
    pipelineSceneData->updatePipelineSceneData();
}

void NativePipeline::setValue(const ccstd::string &name, int32_t value) {
    macros[name] = value;
}

void NativePipeline::setValue(const ccstd::string &name, bool value) {
    macros[name] = value;
}

bool NativePipeline::isOcclusionQueryEnabled() const {
    return false;
}

} // namespace render

} // namespace cc
