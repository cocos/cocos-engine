/****************************************************************************
 Copyright (c) 2022-2025 Xiamen Yaji Software Co., Ltd.

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

#include <boost/container/static_vector.hpp>
#include <boost/core/span.hpp>
#include <boost/graph/depth_first_search.hpp>

// #include <boost/graph/filtered_graph.hpp>
#include "LayoutGraphGraphs.h"
// #include "LayoutGraphUtils.h"
// #include "NativeExecutorRenderGraph.h"
#include "NativePipelineTypes.h"
// #include "NativeUtils.h"
#include "FGDispatcherTypes.h"
#include "RenderGraphGraphs.h"
#include "details/GraphView.h"

// #include "details/GslUtils.h"
// #include "details/Range.h"

#define Ensures CC_ENSURES
#define Expects CC_EXPECTS

namespace cc {

namespace render {

namespace {

using RenderGraphData = RenderGraph;
using RootSignatureGraphImpl = LayoutGraphData;
using RootArgumentKey = DescriptorSetKey;

constexpr bool isBuffer(DescriptorTypeOrder attr) noexcept {
    switch (attr) {
        case DescriptorTypeOrder::UNIFORM_BUFFER:
        case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
        case DescriptorTypeOrder::STORAGE_BUFFER:
        case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
            return true;
        default:
            return false;
    }
}

constexpr bool isTexture(DescriptorTypeOrder attr) noexcept {
    switch (attr) {
        case DescriptorTypeOrder::SAMPLER_TEXTURE:
        case DescriptorTypeOrder::TEXTURE:
        case DescriptorTypeOrder::STORAGE_IMAGE:
        case DescriptorTypeOrder::INPUT_ATTACHMENT:
            return true;
        default:
            return false;
    }
}

struct DescriptorSetVisitorContext {
    void setupRenderPass(RenderGraph::vertex_descriptor passID, std::string_view passLayoutName) {
        CC_EXPECTS(!passLayoutName.empty());
        CC_EXPECTS(mPassID == RenderGraph::null_vertex());
        CC_EXPECTS(mPassLayoutID == LayoutGraphData::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        CC_EXPECTS(mQueueLayoutID == LayoutGraphData::null_vertex());

        // Get the pass layoutId from the layout graph
        mDefaultPassLayoutID = locate(LayoutGraphData::null_vertex(), passLayoutName, layoutGraph);
        // Save the passId
        mPassID = passID;
    }
    void resetRenderPass() noexcept {
        CC_EXPECTS(mDefaultPassLayoutID != LayoutGraphData::null_vertex());
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mPassLayoutID == LayoutGraphData::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        CC_EXPECTS(mQueueLayoutID == LayoutGraphData::null_vertex());

        // Reset the pass layout ID and pass ID
        mDefaultPassLayoutID = LayoutGraphData::null_vertex();
        mPassID = RenderGraph::null_vertex();
    }
    void setupRenderQueue(RenderGraph::vertex_descriptor queueID, const RenderQueue& queueData) {
        CC_EXPECTS(mDefaultPassLayoutID != LayoutGraphData::null_vertex());
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mPassLayoutID == LayoutGraphData::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        CC_EXPECTS(mQueueLayoutID == LayoutGraphData::null_vertex());

        if (queueData.passLayoutID == LayoutGraphData::null_vertex()) {
            // If the pass layoutId is null, use the default pass layoutId
            mPassLayoutID = mDefaultPassLayoutID;
        } else {
            // Otherwise, use the pass layoutId from the queue data
            mPassLayoutID = queueData.passLayoutID;
        }
        // pass layoutId must be valid
        CC_ENSURES(mPassLayoutID != LayoutGraphData::null_vertex());

        CC_EXPECTS(queueID != RenderGraph::null_vertex());
        mQueueID = queueID;
        CC_EXPECTS(queueData.phaseID != LayoutGraphData::null_vertex());
        mQueueLayoutID = queueData.phaseID;

        // layoutId must be valid
        CC_ENSURES(mPassID != RenderGraph::null_vertex());
        CC_ENSURES(mPassLayoutID != LayoutGraphData::null_vertex());
        CC_ENSURES(mQueueID != RenderGraph::null_vertex());
        CC_ENSURES(mQueueLayoutID != LayoutGraphData::null_vertex());
    }
    void resetRenderQueue() noexcept {
        CC_EXPECTS(mDefaultPassLayoutID != LayoutGraphData::null_vertex());
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mPassLayoutID != LayoutGraphData::null_vertex());
        CC_EXPECTS(mQueueID != RenderGraph::null_vertex());
        CC_EXPECTS(mQueueLayoutID != LayoutGraphData::null_vertex());

        // Reset the pass/queue layoutId and queueId
        mPassLayoutID = LayoutGraphData::null_vertex();
        mQueueID = RenderGraph::null_vertex();
        mQueueLayoutID = LayoutGraphData::null_vertex();
    }

    DeviceRenderData& getOrCreateDeviceRenderData(const RootArgumentKey& key) const {
        auto& context = pipeline.nativeContext;
        auto iter = context.graphNodeRenderData.find(key);
        if (iter != context.graphNodeRenderData.end()) {
            return iter->second;
        }
        auto res = context.graphNodeRenderData.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(key),
            std::forward_as_tuple());
        Ensures(res.second);
        return res.first->second;
    }

    static void collectUniformBuffer(
        boost::span<const RenderData* const> renderDataRange,
        const NameLocalID& attrID,
        DeviceRenderData& data) {
        for (auto rangeIter = renderDataRange.rbegin(); rangeIter != renderDataRange.rend(); ++rangeIter) {
            const auto& renderData = **rangeIter;
            if (renderData.constants.empty()) {
                return;
            }
            if (renderData.constants.contains(attrID.value)) {
                data.hasConstants = true;
                break;
            }
        }
    }

    static gfx::Sampler* resolveSampler(
        boost::span<const RenderData* const> renderDataRange,
        const NameLocalID& attrID) {
        for (auto rangeIter = renderDataRange.rbegin();
             rangeIter != renderDataRange.rend();
             ++rangeIter) {
            const auto& renderData = **rangeIter;
            auto iter = renderData.samplers.find(attrID.value);
            if (iter == renderData.samplers.end()) {
                continue;
            }
            auto* sampler = iter->second;
            Expects(sampler);
            return sampler;
        }
        return nullptr;
    }

    static void collectSampler(
        boost::span<const RenderData* const> renderDataRange,
        const NameLocalID& attrID,
        DeviceRenderData& data) {
        auto* sampler = resolveSampler(renderDataRange, attrID);
        if (sampler) {
            auto res = data.samplers.emplace(attrID, sampler);
            CC_ENSURES(res.second);
        }
    }

    IntrusivePtr<gfx::Buffer> resolveBuffer(
        boost::span<const RenderData* const> renderDataRange,
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>* resourceIndex,
        const NameLocalID& attrID) const {
        // Need to find the resource in the resource graph
        if (resourceIndex) {
            auto iter = resourceIndex->find(attrID);
            if (iter != resourceIndex->end()) {
                auto* buffer = pipeline.resourceGraph.getBuffer(iter->second);
                Expects(buffer);
                return buffer;
            }
        }
        // Find the buffer from the render data stack
        for (auto rangeIter = renderDataRange.rbegin();
             rangeIter != renderDataRange.rend();
             ++rangeIter) {
            const auto& renderData = **rangeIter;
            auto iter = renderData.buffers.find(attrID.value);
            if (iter == renderData.buffers.end()) {
                continue;
            }
            return iter->second;
        }
        return nullptr;
    }

    void collectBuffer(
        boost::span<const RenderData* const> renderDataRange,
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>* resourceIndex,
        const NameLocalID& attrID,
        DeviceRenderData& data) const {
        auto buffer = resolveBuffer(renderDataRange, resourceIndex, attrID);
        if (buffer) {
            auto res = data.buffers.emplace(attrID, std::move(buffer));
            CC_ENSURES(res.second);
        }
    }

    TextureWithAccessFlags resolveTexture(
        boost::span<const RenderData* const> renderDataRange,
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>* resourceIndex,
        const ResourceAccessNode* accessNode,
        const NameLocalID& attrID) const {
        // Need to find the resource in the resource graph
        if (resourceIndex) {
            auto iter = resourceIndex->find(attrID);
            if (iter != resourceIndex->end()) {
                auto resID = iter->second;
                auto* texture = pipeline.resourceGraph.getTexture(resID);

                // auto* accessNode =

                Expects(texture);
                return TextureWithAccessFlags{texture};
            }
        }
        // Find the texture from the render data stack
        for (auto rangeIter = renderDataRange.rbegin();
             rangeIter != renderDataRange.rend();
             ++rangeIter) {
            const auto& renderData = **rangeIter;
            auto iter = renderData.textures.find(attrID.value);
            if (iter == renderData.textures.end()) {
                continue;
            }
            return TextureWithAccessFlags{iter->second};
        }
        return TextureWithAccessFlags{};
    }

    void collectTexture(
        boost::span<const RenderData* const> renderDataRange,
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>* resourceIndex,
        const ResourceAccessNode* accessNode,
        const NameLocalID& attrID,
        DeviceRenderData& data) const {
        auto texture = resolveTexture(renderDataRange, resourceIndex, accessNode, attrID);
        if (texture.texture) {
            auto res = data.textures.emplace(attrID, std::move(texture));
            CC_ENSURES(res.second);
        }
    }

    void collectSamplerTexture(
        boost::span<const RenderData* const> renderDataRange,
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>* resourceIndex,
        const ResourceAccessNode* accessNode,
        const NameLocalID& attrID,
        DeviceRenderData& data) const {
        auto texture = resolveTexture(renderDataRange, resourceIndex, accessNode, attrID);
        if (texture.texture) {
            auto res = data.textures.emplace(attrID, std::move(texture));
            CC_ENSURES(res.second);
        }
        auto* sampler = resolveSampler(renderDataRange, attrID);
        if (sampler) {
            auto res = data.samplers.emplace(attrID, sampler);
            CC_ENSURES(res.second);
        }
    }

    void collectInputAttachment(
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>* resourceIndex,
        const NameLocalID& attrID,
        DeviceRenderData& data) const {
        if (!resourceIndex) {
            return;
        }
        // const ResourceAccessNode* accessNode = nullptr;

        // auto iter = resourceIndex->find(attrID);
        // if (iter != resourceIndex->end()) {
        //     auto* texture = pipeline.resourceGraph.getTexture(iter->second);
        //     Expects(texture);
        //     return texture;
        // }
    }

    void collectResources(
        boost::span<const RenderData* const> renderDataRange,
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>* resourceIndex,
        const ResourceAccessNode* accessNode,
        const DescriptorSetLayoutData& table,
        DeviceRenderData& data) const {
        Expects(!table.descriptorBlocks.empty());
        Expects(table.capacity); // Not unbounded
        for (const auto& block : table.descriptorBlocks) {
            switch (block.type) {
                case DescriptorTypeOrder::UNIFORM_BUFFER:
                case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER: {
                    for (const auto& d : block.descriptors) {
                        collectUniformBuffer(renderDataRange, d.descriptorID, data);
                    }
                } break;
                case DescriptorTypeOrder::STORAGE_BUFFER:
                case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER: {
                    for (const auto& d : block.descriptors) {
                        collectBuffer(renderDataRange, resourceIndex, d.descriptorID, data);
                    }
                } break;
                case DescriptorTypeOrder::SAMPLER: {
                    for (const auto& d : block.descriptors) {
                        collectSampler(renderDataRange, d.descriptorID, data);
                    }
                } break;
                case DescriptorTypeOrder::SAMPLER_TEXTURE: {
                    for (const auto& d : block.descriptors) {
                        collectSamplerTexture(
                            renderDataRange,
                            resourceIndex,
                            accessNode,
                            d.descriptorID,
                            data);
                    }
                } break;
                case DescriptorTypeOrder::TEXTURE:
                case DescriptorTypeOrder::STORAGE_IMAGE: {
                    for (const auto& d : block.descriptors) {
                        collectTexture(
                            renderDataRange,
                            resourceIndex,
                            accessNode,
                            d.descriptorID,
                            data);
                    }
                } break;
                default:
                    CC_EXPECTS(false);
            }
        }
    }

    DeviceRenderData* collectDescriptors(
        boost::span<const RenderData* const> renderDataRange,
        const RootArgumentKey& key,
        RootSignatureGraphImpl::vertex_descriptor layoutID,
        bool includeRenderGraphResource = false) const {
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>*
            resourceIndex = nullptr;
        const ResourceAccessNode* accessNode = nullptr;

        if (includeRenderGraphResource) {
            auto iter = pipeline.nativeContext.resourceGraphIndex.find(key.nodeID);
            if (iter != pipeline.nativeContext.resourceGraphIndex.end() &&
                !iter->second.empty()) {
                resourceIndex = &iter->second;
            }
        }

        const auto& rsg = layoutGraph;
        const auto& layout = get(LayoutGraphData::LayoutTag{}, rsg, layoutID);

        DeviceRenderData* deviceData = nullptr;
        // Collect resources from the current render graph node
        for (const auto& [freq, set] : layout.descriptorSets) {
            if (freq != key.frequency) {
                continue;
            }
            if (!deviceData) {
                deviceData = &getOrCreateDeviceRenderData(key);
            }
            Ensures(deviceData);
            if (set.descriptorSetLayoutData.capacity == 0) {
                CC_EXPECTS(false); // unbounded resources not supported yet
                // collectUnboundedResources(
                //     renderDataRange,
                //     set.descriptorSetLayoutData,
                //     *deviceData);
            } else {
                collectResources(
                    renderDataRange,
                    resourceIndex,
                    accessNode,
                    set.descriptorSetLayoutData,
                    *deviceData);
            }
        }
        return deviceData;
    }

    void collectPassDescriptors(const RenderGraphData::vertex_descriptor v) {
        Expects(mRenderDataStack.empty());
        Expects(mPerPassDeviceRenderDataStack.empty());
        Expects(mPerQueueDeviceRenderDataStack.empty());

        mRenderDataStack.emplace_back(&renderGraph.globalRenderData);
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));
        Ensures(mRenderDataStack.size() == 2);

        Expects(mPassLayoutID == RootSignatureGraphImpl::null_vertex());
        mPerPassDeviceRenderDataStack.emplace_back(
            collectDescriptors(
                mRenderDataStack,
                RootArgumentKey{v, UpdateFrequency::PER_PASS},
                mDefaultPassLayoutID,
                true));

        Ensures(mRenderDataStack.size() == 2);
        Ensures(mPerPassDeviceRenderDataStack.size() == 1);
        Ensures(mPerQueueDeviceRenderDataStack.empty());
    }

    void prepareResourceGraphIndex(
        RenderGraph::vertex_descriptor vertID,
        const RasterPass& rasterPass) {
    }

    NativePipeline& pipeline;
    LayoutGraphData& layoutGraph;
    const RenderGraph& renderGraph;
    const FrameGraphDispatcher& renderDependencyGraph;

    LayoutGraphData::vertex_descriptor mDefaultPassLayoutID = LayoutGraphData::null_vertex();
    RenderGraph::vertex_descriptor mPassID = RenderGraph::null_vertex();
    LayoutGraphData::vertex_descriptor mPassLayoutID = LayoutGraphData::null_vertex();
    RenderGraph::vertex_descriptor mQueueID = RenderGraph::null_vertex();
    LayoutGraphData::vertex_descriptor mQueueLayoutID = LayoutGraphData::null_vertex();

    boost::container::static_vector<const RenderData*, 6> mRenderDataStack;
    boost::container::static_vector<DeviceRenderData*, 5> mPerPassDeviceRenderDataStack;
    boost::container::static_vector<DeviceRenderData*, 4> mPerQueueDeviceRenderDataStack;
};

struct DescriptorSetVisitor : boost::dfs_visitor<> {
    void discover_vertex(
        RenderGraph::vertex_descriptor v,
        const AddressableView<RenderGraph>& gv) const {
        const auto& g = ctx.renderGraph;
        visitObject(
            v, g,
            [&](const RasterPass&) {
                const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.renderGraph, v);
                ctx.setupRenderPass(v, passLayoutName);
                ctx.collectPassDescriptors(v);
            },
            [](const auto& /*res*/) {});

        // visit_vertex
        // const auto&g = ctx.renderGraph;
        // const auto& rg = gIn.get();
        // rg.visit_vertex(
        //     v,
        //     [&](const Graphics_ auto& pass) {
        //         setupRenderPass(v, pass.mLayoutName);
        //         collectPassDescriptors(v);
        //     },
        //     [&](const Render_ auto&) {
        //         // noop
        //     },
        //     [&](const RenderQueueData& queue) {
        //         setupRenderQueue(v, queue);
        //         collectQueueDescriptors(v);
        //     },
        //     [&](const SceneCommand_ auto&) {
        //         collectSceneDescriptors(v);
        //     });
    }

    DescriptorSetVisitorContext& ctx;
};

} // namespace

void NativePipeline::prepareDescriptorSets(RenderGraph::vertex_descriptor passID) {
    // Clear the resource graph index
    for (auto& [passId, index] : nativeContext.resourceGraphIndex) {
        index.clear();
    }

    // #if CC_DEBUG
    //    ctx.cmdBuff->beginMarker(makeMarkerInfo("Upload", RASTER_UPLOAD_COLOR));
    // #endif
    // auto colors = ctx.g.colors(ctx.scratch);
    // RenderGraphUploadVisitor visitor{{}, ctx};
    // AddressableView<RenderGraph> graphView(ctx.g);
    // boost::depth_first_visit(graphView, passID, visitor, get(colors, ctx.g));

    // if (holds<RasterPassTag>(passID, ctx.g)) {
    //     const auto& pass = get(RasterPassTag{}, passID, ctx.g);
    //     if (pass.showStatistics) {
    //         prepareStatisticsDescriptorSet(ctx, passID);
    //     }
    // }
    // #if CC_DEBUG
    //     ctx.cmdBuff->endMarker();
    // #endif
}

} // namespace render

} // namespace cc
