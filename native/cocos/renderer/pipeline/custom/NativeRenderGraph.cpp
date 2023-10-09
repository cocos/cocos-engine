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

#include "cocos/renderer/pipeline/custom/NativeBuiltinUtils.h"
#include "cocos/renderer/pipeline/custom/NativePipelineTypes.h"
#include "cocos/renderer/pipeline/custom/NativeRenderGraphUtils.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"
#include "cocos/scene/DirectionalLight.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/SpotLight.h"

namespace cc {

namespace render {

ccstd::string NativeRenderNode::getName() const {
    return std::string(get(RenderGraph::NameTag{}, *renderGraph, nodeID));
}

void NativeRenderNode::setName(const ccstd::string &name) { // NOLINT(readability-make-member-function-const)
    get(RenderGraph::NameTag{}, *renderGraph, nodeID) = std::string_view{name};
}

void NativeRenderNode::setCustomBehavior(const ccstd::string &name) { // NOLINT(readability-make-member-function-const)
    get(RenderGraph::DataTag{}, *renderGraph, nodeID).custom = std::string_view{name};
}

RenderGraph::vertex_descriptor RenderGraph::getPassID(vertex_descriptor nodeID) const {
    CC_EXPECTS(nodeID != null_vertex());
    for (auto parentID = nodeID;
         parentID != RenderGraph::null_vertex();
         parentID = parent(nodeID, *this)) {
        nodeID = parentID;
    }
    CC_ENSURES(nodeID != null_vertex());
    return nodeID;
}

namespace {

template <class Tag>
void addRenderTargetImpl(
    RenderGraph &graph,
    RenderGraph::vertex_descriptor passID,
    std::string_view name,
    std::string_view slotName,
    AccessType accessType,
    gfx::LoadOp loadOp,
    gfx::StoreOp storeOp,
    const gfx::Color &color) {
    auto &pass = get(Tag{}, passID, graph);
    auto iter = pass.rasterViews.find(name);
    if (iter != pass.rasterViews.end()) {
        // no overwrite
        return;
    }
    auto slotID = static_cast<uint32_t>(pass.rasterViews.size());
    auto res = pass.rasterViews.emplace(
        std::piecewise_construct,
        std::forward_as_tuple(name),
        std::forward_as_tuple(
            ccstd::pmr::string(slotName, graph.get_allocator()),
            accessType,
            AttachmentType::RENDER_TARGET,
            loadOp,
            storeOp,
            gfx::ClearFlagBit::COLOR,
            color,
            gfx::ShaderStageFlagBit::NONE));
    CC_ENSURES(res.second);
    res.first->second.slotID = slotID;
}

template <class Tag>
void addDepthStencilImpl(
    RenderGraph &graph,
    RenderGraph::vertex_descriptor passID,
    std::string_view name,
    std::string_view slotName,
    AccessType accessType,
    gfx::LoadOp loadOp,
    gfx::StoreOp storeOp,
    gfx::ClearFlagBit clearFlags,
    float depth,
    uint8_t stencil) {
    auto &pass = get(Tag{}, passID, graph);
    auto iter = pass.rasterViews.find(name);
    if (iter != pass.rasterViews.end()) {
        // no overwrite
        return;
    }
    auto slotID = static_cast<uint32_t>(pass.rasterViews.size());
    auto res = pass.rasterViews.emplace(
        std::piecewise_construct,
        std::forward_as_tuple(name),
        std::forward_as_tuple(
            ccstd::pmr::string(slotName, graph.get_allocator()),
            accessType,
            AttachmentType::DEPTH_STENCIL,
            loadOp,
            storeOp,
            clearFlags,
            gfx::Color{depth, static_cast<float>(stencil), 0, 0},
            gfx::ShaderStageFlagBit::NONE));
    CC_ENSURES(res.second);
    res.first->second.slotID = slotID;
}

} // namespace

void NativeRenderPassBuilder::addRenderTarget(
    const ccstd::string &name,
    gfx::LoadOp loadOp,
    gfx::StoreOp storeOp,
    const gfx::Color &color) {
    addRenderTargetImpl<RasterPassTag>(
        *renderGraph,
        nodeID,
        name,
        "",
        AccessType::WRITE,
        loadOp,
        storeOp,
        color);
}

void NativeRenderPassBuilder::addDepthStencil(
    const ccstd::string &name,
    gfx::LoadOp loadOp,
    gfx::StoreOp storeOp,
    float depth,
    uint8_t stencil,
    gfx::ClearFlagBit clearFlags) {
    addDepthStencilImpl<RasterPassTag>(
        *renderGraph,
        nodeID,
        name,
        "",
        AccessType::WRITE,
        loadOp,
        storeOp,
        clearFlags,
        depth,
        stencil);
}

// NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
void NativeRenderPassBuilder::addTexture(
    const ccstd::string &name, const ccstd::string &slotName,
    gfx::Sampler *sampler, uint32_t plane) {
    addPassComputeViewImpl(
        RasterPassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            AccessType::READ,
            plane,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
    if (sampler) {
        auto iter = layoutGraph->attributeIndex.find(std::string_view{slotName});
        if (iter != layoutGraph->attributeIndex.end()) {
            auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
            data.samplers[iter->second.value] = sampler;
        }
    }
}

void NativeRenderPassBuilder::addStorageBuffer(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addPassComputeViewImpl(
        RasterPassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

void NativeRenderPassBuilder::addStorageImage(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addPassComputeViewImpl(
        RasterPassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

void NativeRenderPassBuilder::addMaterialTexture(
    const ccstd::string &resourceName, gfx::ShaderStageFlagBit flags) {
    auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    pass.textures.emplace(resourceName, flags);
}

void NativeRenderPassBuilder::setCustomShaderStages(
    const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) {
    auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    {
        auto iter = pass.rasterViews.find(std::string_view{name});
        if (iter != pass.rasterViews.end()) {
            auto &view = iter->second;
            view.shaderStageFlags = stageFlags;
        }
    }
    {
        auto iter = pass.computeViews.find(std::string_view{name});
        if (iter != pass.computeViews.end()) {
            for (auto &view : iter->second) {
                view.shaderStageFlags = stageFlags;
            }
        }
    }
}

bool NativeRenderPassBuilder::getShowStatistics() const {
    const auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    return pass.showStatistics;
}

void NativeRenderPassBuilder::setShowStatistics(bool enable) {
    auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    pass.showStatistics = enable;
}

namespace {

uint32_t getSlotID(RasterPass &pass, std::string_view name, AttachmentType type) {
    if (type == AttachmentType::DEPTH_STENCIL) {
        return 0xFF;
    }

    const auto newID = static_cast<uint32_t>(pass.attachmentIndexMap.size());
    auto iter = pass.attachmentIndexMap.find(name);
    return iter != pass.attachmentIndexMap.end() ? iter->second : pass.attachmentIndexMap.emplace(name, newID).first->second;
}

template <class Tag>
void addRasterViewImpl(
    std::string_view name,
    std::string_view slotName,
    std::string_view slotName1,
    AccessType accessType,
    AttachmentType attachmentType,
    gfx::LoadOp loadOp,
    gfx::StoreOp storeOp,
    gfx::ClearFlagBit clearFlags,
    gfx::Color clearColor,
    RenderGraph::vertex_descriptor subpassID,
    RenderGraph &renderGraph) {
    CC_EXPECTS(!name.empty());
    auto &subpass = get(Tag{}, subpassID, renderGraph);
    const auto passID = parent(subpassID, renderGraph);
    CC_EXPECTS(passID != RenderGraph::null_vertex());
    CC_EXPECTS(holds<RasterPassTag>(passID, renderGraph));
    auto &pass = get(RasterPassTag{}, passID, renderGraph);
    CC_EXPECTS(subpass.subpassID < num_vertices(pass.subpassGraph));
    auto &subpassData = get(SubpassGraph::SubpassTag{}, pass.subpassGraph, subpass.subpassID);
    const auto slotID = static_cast<uint32_t>(subpass.rasterViews.size());
    CC_EXPECTS(subpass.rasterViews.size() == subpassData.rasterViews.size());
    auto nameIter = subpassData.rasterViews.find(name);

    if (nameIter != subpassData.rasterViews.end()) {
        auto &view = subpass.rasterViews.at(name.data());
        if (!defaultAttachment(slotName)) {
            nameIter->second.slotName = slotName;
            view.slotName = slotName;
        }
        if (!defaultAttachment(slotName1)) {
            nameIter->second.slotName1 = slotName1;
            view.slotName1 = slotName1;
        }
        return;
    }

    {
        auto res = subpassData.rasterViews.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(name),
            std::forward_as_tuple(
                ccstd::pmr::string(slotName, subpassData.get_allocator()),
                ccstd::pmr::string(slotName1, subpassData.get_allocator()),
                accessType,
                attachmentType,
                loadOp,
                storeOp,
                clearFlags,
                clearColor,
                gfx::ShaderStageFlagBit::NONE));
        CC_ENSURES(res.second);
        res.first->second.slotID = slotID;
    }
    {
        auto res = subpass.rasterViews.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(name),
            std::forward_as_tuple(
                ccstd::pmr::string(slotName, subpassData.get_allocator()),
                ccstd::pmr::string(slotName1, subpassData.get_allocator()),
                accessType,
                attachmentType,
                loadOp,
                storeOp,
                clearFlags,
                clearColor,
                gfx::ShaderStageFlagBit::NONE));
        CC_ENSURES(res.second);
        res.first->second.slotID = slotID;

        pass.rasterViews.emplace(name, subpass.rasterViews.at(name.data()));
    }
    CC_ENSURES(subpass.rasterViews.size() == subpassData.rasterViews.size());
}

} // namespace

void NativeRenderSubpassBuilderImpl::addRenderTarget(
    const ccstd::string &name,
    AccessType accessType,
    const ccstd::string &slotName,
    gfx::LoadOp loadOp, gfx::StoreOp storeOp,
    const gfx::Color &color) {
    addRasterViewImpl<RasterSubpassTag>(
        name,
        slotName,
        "",
        accessType,
        AttachmentType::RENDER_TARGET,
        loadOp,
        storeOp,
        gfx::ClearFlagBit::COLOR,
        color,
        nodeID,
        *renderGraph);
}

void NativeRenderSubpassBuilderImpl::addDepthStencil(
    const ccstd::string &name,
    AccessType accessType,
    const ccstd::string &depthSlotName,
    const ccstd::string &stencilSlotName,
    gfx::LoadOp loadOp, gfx::StoreOp storeOp,
    float depth, uint8_t stencil, gfx::ClearFlagBit clearFlags) {
    addRasterViewImpl<RasterSubpassTag>(
        name,
        depthSlotName,
        stencilSlotName,
        accessType,
        AttachmentType::DEPTH_STENCIL,
        loadOp,
        storeOp,
        clearFlags,
        gfx::Color{depth, static_cast<float>(stencil)},
        nodeID,
        *renderGraph);
}

// NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
void NativeRenderSubpassBuilderImpl::addTexture(
    const ccstd::string &name, const ccstd::string &slotName,
    gfx::Sampler *sampler, uint32_t plane) {
    addSubpassComputeViewImpl(
        RasterSubpassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            AccessType::READ,
            plane,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
    if (sampler) {
        auto iter = layoutGraph->attributeIndex.find(std::string_view{slotName});
        if (iter != layoutGraph->attributeIndex.end()) {
            auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
            data.samplers[iter->second.value] = sampler;
        }
    }
}

void NativeRenderSubpassBuilderImpl::addStorageBuffer(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addSubpassComputeViewImpl(
        RasterSubpassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

void NativeRenderSubpassBuilderImpl::addStorageImage(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addSubpassComputeViewImpl(
        RasterSubpassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

namespace {

template <class Tag>
void setSubpassResourceShaderStages(
    RenderGraph &rg,
    RenderGraph::vertex_descriptor subpassID,
    std::string_view name,
    gfx::ShaderStageFlagBit stageFlags) {
    auto &subpass = get(Tag{}, subpassID, rg);
    const auto passID = parent(subpassID, rg);
    CC_EXPECTS(passID != RenderGraph::null_vertex());
    CC_EXPECTS(holds<RasterPassTag>(passID, rg));
    auto &pass = get(RasterPassTag{}, passID, rg);
    CC_EXPECTS(subpass.subpassID < num_vertices(pass.subpassGraph));
    auto &subpassData = get(SubpassGraph::SubpassTag{}, pass.subpassGraph, subpass.subpassID);
    CC_EXPECTS(subpass.rasterViews.size() == subpassData.rasterViews.size());
    {
        auto iter = subpassData.rasterViews.find(name);
        if (iter != subpassData.rasterViews.end()) {
            auto &view = iter->second;
            view.shaderStageFlags = stageFlags;
        }
    }
    {
        auto iter = subpassData.computeViews.find(name);
        if (iter != subpassData.computeViews.end()) {
            for (auto &view : iter->second) {
                view.shaderStageFlags = stageFlags;
            }
        }
    }
    {
        auto iter = subpass.rasterViews.find(name);
        if (iter != subpass.rasterViews.end()) {
            auto &view = iter->second;
            view.shaderStageFlags = stageFlags;
        }
    }
    {
        auto iter = subpass.computeViews.find(name);
        if (iter != subpass.computeViews.end()) {
            for (auto &view : iter->second) {
                view.shaderStageFlags = stageFlags;
            }
        }
    }
}

} // namespace

void NativeRenderSubpassBuilderImpl::setCustomShaderStages(
    const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) {
    setSubpassResourceShaderStages<RasterSubpassTag>(*renderGraph, nodeID, name, stageFlags);
}

void NativeRenderSubpassBuilderImpl::setViewport(const gfx::Viewport &viewport) {
    auto &subpass = get(RasterSubpassTag{}, nodeID, *renderGraph);
    subpass.viewport = viewport;
}

RenderQueueBuilder *NativeRenderSubpassBuilderImpl::addQueue(
    QueueHint hint, const ccstd::string &phaseName) {
    CC_EXPECTS(!phaseName.empty());
    CC_EXPECTS(layoutID != LayoutGraphData::null_vertex());

    const auto phaseLayoutID = locate(layoutID, phaseName, *layoutGraph);
    CC_ENSURES(phaseLayoutID != LayoutGraphData::null_vertex());

    auto queueID = addVertex2(
        QueueTag{},
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(hint, phaseLayoutID),
        *renderGraph, nodeID);

    return new NativeRenderQueueBuilder(pipelineRuntime, renderGraph, queueID, layoutGraph, phaseLayoutID);
}

bool NativeRenderSubpassBuilderImpl::getShowStatistics() const {
    const auto &subpass = get(RasterSubpassTag{}, nodeID, *renderGraph);
    return subpass.showStatistics;
}

void NativeRenderSubpassBuilderImpl::setShowStatistics(bool enable) {
    auto &subpass = get(RasterSubpassTag{}, nodeID, *renderGraph);
    subpass.showStatistics = enable;
}

void NativeMultisampleRenderSubpassBuilder::resolveRenderTarget(
    const ccstd::string &source, const ccstd::string &target) { // NOLINT(bugprone-easily-swappable-parameters)
    auto &subpass = get(RasterSubpassTag{}, nodeID, *renderGraph);

    auto parentID = parent(nodeID, *renderGraph);
    auto &pass = get(RasterPassTag{}, parentID, *renderGraph);
    auto &subpassData = get(SubpassGraph::SubpassTag{}, pass.subpassGraph, subpass.subpassID);

    subpass.resolvePairs.emplace_back(
        ccstd::pmr::string(source.data(), renderGraph->get_allocator()),
        ccstd::pmr::string(target.data(), renderGraph->get_allocator()),
        ResolveFlags::COLOR,
        gfx::ResolveMode::AVERAGE,
        gfx::ResolveMode::NONE);

    subpassData.resolvePairs.emplace_back(subpass.resolvePairs.back());
}

void NativeMultisampleRenderSubpassBuilder::resolveDepthStencil(
    const ccstd::string &source, const ccstd::string &target,   // NOLINT(bugprone-easily-swappable-parameters)
    gfx::ResolveMode depthMode, gfx::ResolveMode stencilMode) { // NOLINT(bugprone-easily-swappable-parameters)
    auto &subpass = get(RasterSubpassTag{}, nodeID, *renderGraph);
    ResolveFlags flags = ResolveFlags::NONE;
    if (depthMode != gfx::ResolveMode::NONE) {
        flags |= ResolveFlags::DEPTH;
    }
    if (stencilMode != gfx::ResolveMode::NONE) {
        flags |= ResolveFlags::STENCIL;
    }

    auto parentID = parent(nodeID, *renderGraph);
    auto &pass = get(RasterPassTag{}, parentID, *renderGraph);
    auto &subpassData = get(SubpassGraph::SubpassTag{}, pass.subpassGraph, subpass.subpassID);

    subpass.resolvePairs.emplace_back(
        ccstd::pmr::string(source.data(), renderGraph->get_allocator()),
        ccstd::pmr::string(target.data(), renderGraph->get_allocator()),
        flags,
        depthMode,
        stencilMode);

    subpassData.resolvePairs.emplace_back(subpass.resolvePairs.back());
}

void NativeComputeSubpassBuilder::addRenderTarget(const ccstd::string &name, const ccstd::string &slotName) {
    addRasterViewImpl<ComputeSubpassTag>(
        name,
        slotName,
        "",
        AccessType::READ,
        AttachmentType::RENDER_TARGET,
        gfx::LoadOp::LOAD,
        gfx::StoreOp::STORE,
        gfx::ClearFlagBit::NONE,
        gfx::Color{},
        nodeID,
        *renderGraph);
}

// NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
void NativeComputeSubpassBuilder::addTexture(
    const ccstd::string &name, const ccstd::string &slotName,
    gfx::Sampler *sampler, uint32_t plane) {
    addSubpassComputeViewImpl(
        ComputeSubpassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            AccessType::READ,
            plane,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
    if (sampler) {
        auto iter = layoutGraph->attributeIndex.find(std::string_view{slotName});
        if (iter != layoutGraph->attributeIndex.end()) {
            auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
            data.samplers[iter->second.value] = sampler;
        }
    }
}

void NativeComputeSubpassBuilder::addStorageBuffer(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addSubpassComputeViewImpl(
        ComputeSubpassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

void NativeComputeSubpassBuilder::addStorageImage(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addSubpassComputeViewImpl(
        ComputeSubpassTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

void NativeComputeSubpassBuilder::setCustomShaderStages(
    const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) {
    setSubpassResourceShaderStages<ComputeSubpassTag>(*renderGraph, nodeID, name, stageFlags);
}

ComputeQueueBuilder *NativeComputeSubpassBuilder::addQueue(const ccstd::string &phaseName) {
    CC_EXPECTS(!phaseName.empty());
    CC_EXPECTS(layoutID != LayoutGraphData::null_vertex());

    const auto phaseLayoutID = locate(layoutID, phaseName, *layoutGraph);
    CC_ENSURES(phaseLayoutID != LayoutGraphData::null_vertex());

    auto queueID = addVertex2(
        QueueTag{},
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(phaseLayoutID),
        *renderGraph, nodeID);

    return new NativeComputeQueueBuilder(pipelineRuntime, renderGraph, queueID, layoutGraph, phaseLayoutID);
}

namespace {

CullingFlags makeCullingFlags(const LightInfo &light) {
    auto cullingFlags = CullingFlags::NONE;
    if (light.culledByLight) {
        cullingFlags |= CullingFlags::LIGHT_FRUSTUM;
    } else {
        cullingFlags |= CullingFlags::CAMERA_FRUSTUM;
        if (light.light) {
            cullingFlags |= CullingFlags::LIGHT_BOUNDS;
        }
    }
    return cullingFlags;
}

} // namespace

void NativeRenderQueueBuilder::addSceneOfCamera(
    scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) {
    const auto *pLight = light.light.get();
    SceneData scene(camera->getScene(), camera, sceneFlags, light, makeCullingFlags(light), light.light);
    auto sceneID = addVertex2(
        SceneTag{},
        std::forward_as_tuple("Camera"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(scene)),
        *renderGraph, nodeID);
    CC_ENSURES(sceneID != RenderGraph::null_vertex());

    auto &data = get(RenderGraph::DataTag{}, *renderGraph, sceneID);

    setCameraUBOValues(
        *camera,
        *layoutGraph,
        *pipelineRuntime->getPipelineSceneData(),
        camera->getScene()->getMainLight(), data);

    // notice: if light is not directional light, csm will be nullptr
    const auto *csm = getBuiltinShadowCSM(
        *pipelineRuntime, *camera,
        dynamic_cast<const scene::DirectionalLight *>(pLight));

    if (any(sceneFlags & SceneFlags::SHADOW_CASTER)) {
        if (pLight) {
            setShadowUBOLightView(
                pipelineRuntime->getDevice(),
                *layoutGraph,
                *pipelineRuntime->getPipelineSceneData(),
                csm, // csm might be nullptr
                *pLight, light.level, data);
        }
    } else {
        const auto *pDirLight = camera->getScene()->getMainLight();
        if (pDirLight) {
            setShadowUBOView(*pipelineRuntime->getDevice(),
                             *layoutGraph,
                             *pipelineRuntime->getPipelineSceneData(),
                             *pDirLight, data);
        }
    }
    setLegacyTextureUBOView(
        *pipelineRuntime->getDevice(),
        *layoutGraph,
        *pipelineRuntime->getPipelineSceneData(),
        data);
}

void NativeSceneBuilder::useLightFrustum(
    IntrusivePtr<scene::Light> light, uint32_t csmLevel, const scene::Camera *optCamera) {
    auto &sceneData = get(SceneTag{}, nodeID, *renderGraph);
    sceneData.light.light = light;
    sceneData.light.level = csmLevel;
    sceneData.light.culledByLight = true;
    if (optCamera) {
        sceneData.camera = optCamera;
    }

    // Disable camera frustum projection
    sceneData.cullingFlags &= ~CullingFlags::CAMERA_FRUSTUM;

    // Enable light frustum projection
    sceneData.cullingFlags |= CullingFlags::LIGHT_FRUSTUM;

    if (any(sceneData.flags & SceneFlags::NON_BUILTIN)) {
        return;
    }

    switch (light->getType()) {
        case scene::LightType::DIRECTIONAL: {
            setBuiltinDirectionalLightFrustumConstants(
                sceneData.camera, dynamic_cast<const scene::DirectionalLight *>(light.get()), csmLevel);
        } break;
        case scene::LightType::SPOT: {
            setBuiltinSpotLightFrustumConstants(
                dynamic_cast<const scene::SpotLight *>(light.get()));
        } break;
        default:
            // noop
            break;
    }
}

SceneBuilder *NativeRenderQueueBuilder::addScene(
    const scene::Camera *camera, SceneFlags sceneFlags, scene::Light *light) {
    const auto sceneID = addVertex2(
        SceneTag{},
        std::forward_as_tuple("Scene"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(
            camera->getScene(), // Scene and camera should be decoupled.
            camera,             // They are coupled for now.
            sceneFlags,
            LightInfo{nullptr, 0},
            // Objects are projected to camera by default and are culled further if light is available.
            light ? CullingFlags::CAMERA_FRUSTUM | CullingFlags::LIGHT_BOUNDS
                  : CullingFlags::CAMERA_FRUSTUM,
            light),
        *renderGraph, nodeID);
    CC_ENSURES(sceneID != RenderGraph::null_vertex());

    auto builder = std::make_unique<NativeSceneBuilder>(
        pipelineRuntime,
        renderGraph,
        sceneID,
        layoutGraph,
        layoutID);

    if (!any(sceneFlags & SceneFlags::NON_BUILTIN)) {
        // objects are projected to camera, set camera ubo
        builder->setBuiltinCameraConstants(camera);

        if (light) {
            switch (light->getType()) {
                case scene::LightType::DIRECTIONAL: {
                    const auto *pDirLight = dynamic_cast<const scene::DirectionalLight *>(light);
                    builder->setBuiltinDirectionalLightConstants(pDirLight, camera);
                } break;
                case scene::LightType::SPHERE: {
                    const auto *pSphereLight = dynamic_cast<const scene::SphereLight *>(light);
                    builder->setBuiltinSphereLightConstants(pSphereLight, camera);
                } break;
                case scene::LightType::SPOT: {
                    const auto *pSpotLight = dynamic_cast<const scene::SpotLight *>(light);
                    builder->setBuiltinSpotLightConstants(pSpotLight, camera);
                } break;
                case scene::LightType::POINT: {
                    const auto *pPointLight = dynamic_cast<const scene::PointLight *>(light);
                    builder->setBuiltinPointLightConstants(pPointLight, camera);
                } break;
                default:
                    // noop
                    break;
            }
        }

        // set builtin legacy ubo
        auto &data = get(RenderGraph::DataTag{}, *renderGraph, sceneID);
        setLegacyTextureUBOView(
            *pipelineRuntime->getDevice(),
            *layoutGraph,
            *pipelineRuntime->getPipelineSceneData(),
            data);
    }

    if (any(sceneFlags & SceneFlags::GPU_DRIVEN)) {
        const auto passID = renderGraph->getPassID(nodeID);
        const auto cullingID = dynamic_cast<const NativePipeline *>(pipelineRuntime)->nativeContext.sceneCulling.gpuCullingPassID;
        CC_EXPECTS(cullingID != 0xFFFFFFFF);
        if (holds<RasterPassTag>(passID, *renderGraph)) {
            ccstd::pmr::string drawIndirectBuffer("CCDrawIndirectBuffer");
            drawIndirectBuffer.append(std::to_string(cullingID));
            ccstd::pmr::string drawInstanceBuffer("CCDrawInstanceBuffer");
            drawInstanceBuffer.append(std::to_string(cullingID));

            auto &rasterPass = get(RasterPassTag{}, passID, *renderGraph);
            if (rasterPass.computeViews.find(drawIndirectBuffer) != rasterPass.computeViews.end()) {
                auto res = rasterPass.computeViews.emplace(
                    std::piecewise_construct,
                    std::forward_as_tuple(drawIndirectBuffer),
                    std::forward_as_tuple());
                CC_ENSURES(res.second);
                auto &view = res.first->second.emplace_back();
                view.name = "CCDrawIndirectBuffer";
                view.accessType = AccessType::READ;
                view.shaderStageFlags = gfx::ShaderStageFlagBit::VERTEX | gfx::ShaderStageFlagBit::FRAGMENT;
            }
            if (rasterPass.computeViews.find(drawInstanceBuffer) != rasterPass.computeViews.end()) {
                auto res = rasterPass.computeViews.emplace(
                    std::piecewise_construct,
                    std::forward_as_tuple(drawInstanceBuffer),
                    std::forward_as_tuple());
                CC_ENSURES(res.second);
                auto &view = res.first->second.emplace_back();
                view.name = "CCDrawInstanceBuffer";
                view.accessType = AccessType::READ;
                view.shaderStageFlags = gfx::ShaderStageFlagBit::VERTEX | gfx::ShaderStageFlagBit::FRAGMENT;
            }
        }
    }

    return builder.release();
}

void NativeRenderQueueBuilder::addFullscreenQuad(
    Material *material, uint32_t passID, SceneFlags sceneFlags) {
    std::string_view name = "FullscreenQuad";
    auto drawID = addVertex2(
        BlitTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(material, passID, sceneFlags, nullptr),
        *renderGraph, nodeID);
    CC_ENSURES(drawID != RenderGraph::null_vertex());
}

void NativeRenderQueueBuilder::addCameraQuad(
    scene::Camera *camera, cc::Material *material, uint32_t passID,
    SceneFlags sceneFlags) {
    std::string_view name = "CameraQuad";
    auto drawID = addVertex2(
        BlitTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(material, passID, sceneFlags, camera),
        *renderGraph, nodeID);
    CC_ENSURES(drawID != RenderGraph::null_vertex());

    auto &data = get(RenderGraph::DataTag{}, *renderGraph, drawID);

    setCameraUBOValues(
        *camera,
        *layoutGraph,
        *pipelineRuntime->getPipelineSceneData(),
        camera->getScene()->getMainLight(), data);

    if (any(sceneFlags & SceneFlags::SHADOW_CASTER)) {
    } else {
        const auto *pDirLight = camera->getScene()->getMainLight();
        if (pDirLight) {
            setShadowUBOView(*pipelineRuntime->getDevice(),
                             *layoutGraph,
                             *pipelineRuntime->getPipelineSceneData(),
                             *pDirLight, data);
        }
    }
    setLegacyTextureUBOView(
        *pipelineRuntime->getDevice(),
        *layoutGraph,
        *pipelineRuntime->getPipelineSceneData(),
        data);
}

void NativeRenderQueueBuilder::clearRenderTarget(const ccstd::string &name, const gfx::Color &color) {
    ccstd::pmr::vector<ClearView> clears(renderGraph->get_allocator());
    clears.emplace_back(name.c_str(), gfx::ClearFlagBit::COLOR, color);

    auto clearID = addVertex2(
        ClearTag{},
        std::forward_as_tuple("ClearRenderTarget"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(clears)),
        *renderGraph, nodeID);
    CC_ENSURES(clearID != RenderGraph::null_vertex());
}

void NativeRenderQueueBuilder::setViewport(const gfx::Viewport &viewport) {
    auto &queue = get(QueueTag{}, nodeID, *renderGraph);
    queue.viewport = viewport;
}

void NativeRenderQueueBuilder::addCustomCommand(std::string_view customBehavior) {
    std::string_view name = "FullscreenQuad";
    auto drawID = addVertex2(
        BlitTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(
            IntrusivePtr<cc::Material>{},
            RenderGraph::null_vertex(),
            SceneFlags::NONE,
            nullptr),
        *renderGraph, nodeID);
    CC_ENSURES(drawID != RenderGraph::null_vertex());
    auto &data = get(RenderGraph::DataTag{}, *renderGraph, drawID);
    data.custom = customBehavior;
}

RenderQueueBuilder *NativeRenderPassBuilder::addQueue(
    QueueHint hint, const ccstd::string &phaseName) {
    CC_EXPECTS(!phaseName.empty());
    CC_EXPECTS(layoutID != LayoutGraphData::null_vertex());

    const auto phaseLayoutID = locate(layoutID, phaseName, *layoutGraph);
    CC_ENSURES(phaseLayoutID != LayoutGraphData::null_vertex());

    auto queueID = addVertex2(
        QueueTag{},
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(hint, phaseLayoutID),
        *renderGraph, nodeID);

    return new NativeRenderQueueBuilder(pipelineRuntime, renderGraph, queueID, layoutGraph, phaseLayoutID);
}

namespace {

template <class SubpassBuilder>
SubpassBuilder *addRenderSubpassImpl(
    const PipelineRuntime *pipelineRuntime,
    RenderGraph &renderGraph, RenderGraph::vertex_descriptor passID,
    const LayoutGraphData &layoutGraph, LayoutGraphData::vertex_descriptor passLayoutID,
    const ccstd::string &subpassName,
    uint32_t count, uint32_t quality) { // NOLINT(bugprone-easily-swappable-parameters)
    auto &pass = get(RasterPassTag{}, passID, renderGraph);

    auto [subpassID, subpassLayoutID] = addRenderSubpassVertex(
        pass, renderGraph, passID, layoutGraph, passLayoutID, subpassName, count, quality);

    auto *builder = ccnew SubpassBuilder(
        pipelineRuntime, &renderGraph, subpassID, &layoutGraph, subpassLayoutID);

    updateRasterPassConstants(pass.width, pass.height, *builder);

    return builder;
}

} // namespace

RenderSubpassBuilder *NativeRenderPassBuilder::addRenderSubpass(const ccstd::string &subpassName) {
    return addRenderSubpassImpl<NativeRenderSubpassBuilder>(
        pipelineRuntime, *renderGraph, nodeID, *layoutGraph, layoutID, subpassName, 1, 0);
}

MultisampleRenderSubpassBuilder *NativeRenderPassBuilder::addMultisampleRenderSubpass(
    uint32_t count, uint32_t quality, const ccstd::string &subpassName) { // NOLINT(bugprone-easily-swappable-parameters)
    return addRenderSubpassImpl<NativeMultisampleRenderSubpassBuilder>(
        pipelineRuntime, *renderGraph, nodeID, *layoutGraph, layoutID, subpassName, count, quality);
}

ComputeSubpassBuilder *NativeRenderPassBuilder::addComputeSubpass(const ccstd::string &subpassName) {
    auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    auto &subpassGraph = pass.subpassGraph;
    const auto subpassIndex = num_vertices(pass.subpassGraph);
    {
        auto id = addVertex(
            std::piecewise_construct,
            std::forward_as_tuple(subpassName),
            std::forward_as_tuple(),
            subpassGraph);
        CC_ENSURES(id == subpassIndex);
    }

    ComputeSubpass subpass(subpassIndex, renderGraph->get_allocator());

    auto subpassID = addVertex2(
        ComputeSubpassTag{},
        std::forward_as_tuple(subpassName),
        std::forward_as_tuple(subpassName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(subpass)),
        *renderGraph, nodeID);

    auto subpassLayoutID = LayoutGraphData::null_vertex();
    if constexpr (ENABLE_SUBPASS) {
        subpassLayoutID = locate(layoutID, subpassName, *layoutGraph);
    } else {
        subpassLayoutID = locate(LayoutGraphData::null_vertex(), subpassName, *layoutGraph);
    }
    CC_EXPECTS(subpassLayoutID != LayoutGraphData::null_vertex());

    auto *builder = ccnew NativeComputeSubpassBuilder(
        pipelineRuntime, renderGraph, subpassID, layoutGraph, subpassLayoutID);
    updateRasterPassConstants(pass.width, pass.height, *builder);

    return builder;
}

void NativeRenderPassBuilder::setViewport(const gfx::Viewport &viewport) {
    auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    pass.viewport = viewport;
}

void NativeRenderPassBuilder::setVersion(const ccstd::string &name, uint64_t version) {
    // noop
}

void NativeMultisampleRenderPassBuilder::addRenderTarget(
    const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp, const gfx::Color &color) {
    addRasterViewImpl<RasterSubpassTag>(
        name,
        "",
        "",
        AccessType::WRITE,
        AttachmentType::RENDER_TARGET,
        loadOp,
        storeOp,
        gfx::ClearFlagBit::COLOR,
        color,
        subpassID,
        *renderGraph);
}

void NativeMultisampleRenderPassBuilder::addDepthStencil(
    const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp,
    float depth, uint8_t stencil, gfx::ClearFlagBit clearFlags) { // NOLINT(bugprone-easily-swappable-parameters)
    addRasterViewImpl<RasterSubpassTag>(
        name,
        "",
        "",
        AccessType::WRITE,
        AttachmentType::DEPTH_STENCIL,
        loadOp,
        storeOp,
        clearFlags,
        gfx::Color{depth, static_cast<float>(stencil)},
        subpassID,
        *renderGraph);
}

void NativeMultisampleRenderPassBuilder::addTexture(
    const ccstd::string &name, const ccstd::string &slotName, // NOLINT(bugprone-easily-swappable-parameters)
    gfx::Sampler *sampler, uint32_t plane) {
    addSubpassComputeViewImpl(
        RasterSubpassTag{},
        *renderGraph,
        subpassID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            AccessType::READ,
            plane,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
    if (sampler) {
        auto iter = layoutGraph->attributeIndex.find(std::string_view{slotName});
        if (iter != layoutGraph->attributeIndex.end()) {
            auto &data = get(RenderGraph::DataTag{}, *renderGraph, subpassID);
            data.samplers[iter->second.value] = sampler;
        }
    }
}

void NativeMultisampleRenderPassBuilder::addStorageBuffer(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addSubpassComputeViewImpl(
        RasterSubpassTag{},
        *renderGraph,
        subpassID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

void NativeMultisampleRenderPassBuilder::addStorageImage(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addSubpassComputeViewImpl(
        RasterSubpassTag{},
        *renderGraph,
        subpassID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

RenderQueueBuilder *NativeMultisampleRenderPassBuilder::addQueue(
    QueueHint hint, const ccstd::string &phaseName) {
    CC_EXPECTS(!phaseName.empty());
    CC_EXPECTS(subpassLayoutID == layoutID);
    CC_EXPECTS(subpassLayoutID != LayoutGraphData::null_vertex());

    const auto phaseLayoutID = locate(subpassLayoutID, phaseName, *layoutGraph);
    CC_ENSURES(phaseLayoutID != LayoutGraphData::null_vertex());

    auto queueID = addVertex2(
        QueueTag{},
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(hint, phaseLayoutID),
        *renderGraph, subpassID);

    return new NativeRenderQueueBuilder(pipelineRuntime, renderGraph, queueID, layoutGraph, phaseLayoutID);
}

void NativeMultisampleRenderPassBuilder::setViewport(const gfx::Viewport &viewport) {
    auto &subpass = get(RasterSubpassTag{}, subpassID, *renderGraph);
    subpass.viewport = viewport;
}

void NativeMultisampleRenderPassBuilder::setVersion(const ccstd::string &name, uint64_t version) {
    // noop
}

bool NativeMultisampleRenderPassBuilder::getShowStatistics() const {
    const auto &subpass = get(RasterSubpassTag{}, subpassID, *renderGraph);
    return subpass.showStatistics;
}

void NativeMultisampleRenderPassBuilder::setShowStatistics(bool enable) {
    auto &subpass = get(RasterSubpassTag{}, subpassID, *renderGraph);
    subpass.showStatistics = enable;
}

void NativeMultisampleRenderPassBuilder::resolveRenderTarget(
    const ccstd::string &source, const ccstd::string &target) { // NOLINT(bugprone-easily-swappable-parameters)
    auto &subpass = get(RasterSubpassTag{}, subpassID, *renderGraph);

    auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    auto &subpassData = get(SubpassGraph::SubpassTag{}, pass.subpassGraph, subpass.subpassID);

    subpass.resolvePairs.emplace_back(
        ccstd::pmr::string(source.data(), renderGraph->get_allocator()),
        ccstd::pmr::string(target.data(), renderGraph->get_allocator()),
        ResolveFlags::COLOR,
        gfx::ResolveMode::AVERAGE,
        gfx::ResolveMode::NONE);

    subpassData.resolvePairs.emplace_back(subpass.resolvePairs.back());
}

void NativeMultisampleRenderPassBuilder::resolveDepthStencil(
    const ccstd::string &source, const ccstd::string &target,   // NOLINT(bugprone-easily-swappable-parameters)
    gfx::ResolveMode depthMode, gfx::ResolveMode stencilMode) { // NOLINT(bugprone-easily-swappable-parameters)
    auto &subpass = get(RasterSubpassTag{}, subpassID, *renderGraph);
    ResolveFlags flags = ResolveFlags::NONE;
    if (depthMode != gfx::ResolveMode::NONE) {
        flags |= ResolveFlags::DEPTH;
    }
    if (stencilMode != gfx::ResolveMode::NONE) {
        flags |= ResolveFlags::STENCIL;
    }

    auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    auto &subpassData = get(SubpassGraph::SubpassTag{}, pass.subpassGraph, subpass.subpassID);

    subpass.resolvePairs.emplace_back(
        ccstd::pmr::string(source.data(), renderGraph->get_allocator()),
        ccstd::pmr::string(target.data(), renderGraph->get_allocator()),
        flags,
        depthMode,
        stencilMode);

    subpassData.resolvePairs.emplace_back(subpass.resolvePairs.back());
}

// NativeComputeQueue
void NativeComputeQueueBuilder::addDispatch(
    uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ,
    Material *material, uint32_t passID) {
    std::string_view name("Dispatch");
    addVertex2(
        DispatchTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(
            material,
            passID,
            threadGroupCountX,
            threadGroupCountY,
            threadGroupCountZ),
        *renderGraph, nodeID);
}

// NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
void NativeComputePassBuilder::addTexture(
    const ccstd::string &name, const ccstd::string &slotName,
    gfx::Sampler *sampler, uint32_t plane) {
    addPassComputeViewImpl(
        ComputeTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            AccessType::READ,
            plane,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
    if (sampler) {
        const auto iter = layoutGraph->attributeIndex.find(std::string_view{slotName});
        if (iter != layoutGraph->attributeIndex.end()) {
            auto &data = get(RenderGraph::DataTag{}, *renderGraph, nodeID);
            data.samplers[iter->second.value] = sampler;
        }
    }
}

void NativeComputePassBuilder::addStorageBuffer(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addPassComputeViewImpl(
        ComputeTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

void NativeComputePassBuilder::addStorageImage(
    const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
    addPassComputeViewImpl(
        ComputeTag{},
        *renderGraph,
        nodeID,
        name,
        ComputeView{
            ccstd::pmr::string(slotName, renderGraph->get_allocator()),
            accessType,
            gfx::ClearFlagBit::NONE,
            ClearValueType::NONE,
            ClearValue{},
            gfx::ShaderStageFlagBit::NONE,
            renderGraph->get_allocator()});
}

void NativeComputePassBuilder::addMaterialTexture(
    const ccstd::string &resourceName, gfx::ShaderStageFlagBit flags) {
    auto &pass = get(RasterPassTag{}, nodeID, *renderGraph);
    pass.textures.emplace(resourceName, flags);
}

void NativeComputePassBuilder::setCustomShaderStages(
    const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) {
    auto &pass = get(ComputeTag{}, nodeID, *renderGraph);
    {
        auto iter = pass.computeViews.find(std::string_view{name});
        if (iter != pass.computeViews.end()) {
            for (auto &view : iter->second) {
                view.shaderStageFlags = stageFlags;
            }
        }
    }
}

ComputeQueueBuilder *NativeComputePassBuilder::addQueue(const ccstd::string &phaseName) {
    CC_EXPECTS(!phaseName.empty());
    CC_EXPECTS(layoutID != LayoutGraphData::null_vertex());

    const auto phaseLayoutID = locate(layoutID, phaseName, *layoutGraph);
    CC_ENSURES(phaseLayoutID != LayoutGraphData::null_vertex());

    auto queueID = addVertex2(
        QueueTag{},
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(phaseName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(QueueHint::NONE, phaseLayoutID),
        *renderGraph, nodeID);

    return new NativeComputeQueueBuilder(pipelineRuntime, renderGraph, queueID, layoutGraph, phaseLayoutID);
}

} // namespace render

} // namespace cc
