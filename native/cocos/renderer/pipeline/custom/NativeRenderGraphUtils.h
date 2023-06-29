#pragma once
#include "cocos/renderer/pipeline/custom/LayoutGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/NativeTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"
#include "pipeline/custom/RenderGraphTypes.h"

namespace cc {

namespace render {

inline std::tuple<RenderGraph::vertex_descriptor, LayoutGraphData::vertex_descriptor>
addRenderPassVertex(
    RenderGraph &renderGraph, const LayoutGraphData &layoutGraph,
    uint32_t width, uint32_t height,  // NOLINT(bugprone-easily-swappable-parameters)
    uint32_t count, uint32_t quality, // NOLINT(bugprone-easily-swappable-parameters)
    const ccstd::string &passName) {
    RasterPass pass(renderGraph.get_allocator());
    pass.width = width;
    pass.height = height;
    pass.viewport.width = width;
    pass.viewport.height = height;
    pass.count = count;
    pass.quality = quality;

    auto passID = addVertex(
        RasterPassTag{},
        std::forward_as_tuple(passName),
        std::forward_as_tuple(passName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(pass)),
        renderGraph);

    auto passLayoutID = locate(LayoutGraphData::null_vertex(), passName, layoutGraph);
    CC_EXPECTS(passLayoutID != LayoutGraphData::null_vertex());

    return {passID, passLayoutID};
}

inline std::tuple<RenderGraph::vertex_descriptor, LayoutGraphData::vertex_descriptor>
addRenderSubpassVertex(
    RasterPass &pass,
    RenderGraph &renderGraph, RenderGraph::vertex_descriptor passID,
    const LayoutGraphData &layoutGraph, LayoutGraphData::vertex_descriptor passLayoutID,
    const ccstd::string &subpassName,
    uint32_t count, uint32_t quality) { // NOLINT(bugprone-easily-swappable-parameters)

    // if subpassName is empty, it must be basic multisample render pass
    CC_EXPECTS(!subpassName.empty() || count > 1);

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

    RasterSubpass subpass(subpassIndex, count, quality, renderGraph.get_allocator());
    subpass.viewport.width = pass.width;
    subpass.viewport.height = pass.height;

    auto subpassID = addVertex(
        RasterSubpassTag{},
        std::forward_as_tuple(subpassName),
        std::forward_as_tuple(subpassName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(subpass)),
        renderGraph, passID);

    auto subpassLayoutID = LayoutGraphData::null_vertex();
    if (subpassName.empty()) { // Basic multisample render pass (single subpass)
        CC_EXPECTS(count > 1);
        subpassLayoutID = passLayoutID;
    } else {
        if constexpr (ENABLE_SUBPASS) {
            subpassLayoutID = locate(passLayoutID, subpassName, layoutGraph);
        } else {
            subpassLayoutID = locate(LayoutGraphData::null_vertex(), subpassName, layoutGraph);
        }
    }
    CC_ENSURES(subpassLayoutID != LayoutGraphData::null_vertex());

    return {subpassID, subpassLayoutID};
}

template <class Tag>
void addPassComputeViewImpl(
    Tag tag,
    RenderGraph &renderGraph,
    RenderGraph::vertex_descriptor passID,
    const ccstd::string &name, const ComputeView &view) {
    std::ignore = tag;
    CC_EXPECTS(!name.empty());
    CC_EXPECTS(!view.name.empty());
    auto &pass = get(Tag{}, passID, renderGraph);
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

template <class Tag>
void addSubpassComputeViewImpl(
    Tag tag,
    RenderGraph &renderGraph,
    RenderGraph::vertex_descriptor subpassID,
    const ccstd::string &name, const ComputeView &view) {
    std::ignore = tag;
    CC_EXPECTS(!name.empty());
    CC_EXPECTS(!view.name.empty());
    auto &subpass = get(Tag{}, subpassID, renderGraph);
    const auto passID = parent(subpassID, renderGraph);
    CC_EXPECTS(passID != RenderGraph::null_vertex());
    CC_EXPECTS(holds<RasterPassTag>(passID, renderGraph));
    auto &pass = get(RasterPassTag{}, passID, renderGraph);
    CC_EXPECTS(subpass.subpassID < num_vertices(pass.subpassGraph));
    auto &subpassData = get(SubpassGraph::SubpassTag{}, pass.subpassGraph, subpass.subpassID);
    CC_EXPECTS(subpass.computeViews.size() == subpassData.computeViews.size());
    {
        auto iter = subpassData.computeViews.find(name.c_str());
        if (iter == subpassData.computeViews.end()) {
            bool added = false;
            std::tie(iter, added) = subpassData.computeViews.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(name.c_str()),
                std::forward_as_tuple());
            CC_ENSURES(added);
        }
        iter->second.emplace_back(view);
    }
    {
        auto iter = subpass.computeViews.find(name.c_str());
        if (iter == subpass.computeViews.end()) {
            bool added = false;
            std::tie(iter, added) = subpass.computeViews.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(name.c_str()),
                std::forward_as_tuple());
            CC_ENSURES(added);
        }
        iter->second.emplace_back(view);
    }
    CC_ENSURES(subpass.computeViews.size() == subpassData.computeViews.size());
    CC_ENSURES(subpass.computeViews.find(std::string_view{name}) != subpass.computeViews.end());
    CC_ENSURES(subpassData.computeViews.find(std::string_view{name}) != subpassData.computeViews.end());
    CC_ENSURES(subpass.computeViews.find(std::string_view{name})->second.size() ==
               subpassData.computeViews.find(std::string_view{name})->second.size());
}

} // namespace render

} // namespace cc
