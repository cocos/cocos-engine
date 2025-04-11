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

struct DescriptorSetVisitorContext {
    void setupRenderPass(RenderGraph::vertex_descriptor passID, std::string_view passLayoutName) {
        CC_EXPECTS(!passLayoutName.empty());
        CC_EXPECTS(mPassID == RenderGraph::null_vertex());
        CC_EXPECTS(mSubpassID == RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        CC_EXPECTS(mPassLayoutIdStack.empty());
        CC_EXPECTS(mPhaseLayoutIdStack.empty());

        // Get the pass layoutId from the layout graph
        auto passLayoutId = locate(LayoutGraphData::null_vertex(), passLayoutName, layoutGraph);
        CC_ENSURES(passLayoutId != LayoutGraphData::null_vertex());

        // Save the passId
        mPassID = passID;
        mPassLayoutIdStack.push_back(passLayoutId);

        CC_ENSURES(mPassID != RenderGraph::null_vertex());
        CC_ENSURES(mSubpassID == RenderGraph::null_vertex());
        CC_ENSURES(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass
        CC_ENSURES(mPassLayoutIdStack.size() == 1);
        CC_ENSURES(mPhaseLayoutIdStack.empty());
    }
    void resetRenderPass() noexcept {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mSubpassID == RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass
        CC_EXPECTS(mPassLayoutIdStack.size() == 1);
        CC_EXPECTS(mPhaseLayoutIdStack.empty());

        // Reset the pass layout ID and pass ID
        mPassID = RenderGraph::null_vertex();
        mPassLayoutIdStack.pop_back();

        CC_ENSURES(mPassID == RenderGraph::null_vertex());
        CC_ENSURES(mSubpassID == RenderGraph::null_vertex());
        CC_ENSURES(mQueueID == RenderGraph::null_vertex());
        CC_ENSURES(mPassLayoutIdStack.empty());
        CC_ENSURES(mPhaseLayoutIdStack.empty());
    }
    void setupRenderSubpass(RenderGraph::vertex_descriptor subpassID, std::string_view subpassLayoutName) {
        CC_EXPECTS(!subpassLayoutName.empty());
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mSubpassID == RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass
        CC_EXPECTS(mPassLayoutIdStack.size() == 1);
        CC_EXPECTS(mPhaseLayoutIdStack.empty());

        // Get the pass layoutId from the layout graph
        auto subpassLayoutId = locate(LayoutGraphData::null_vertex(), subpassLayoutName, layoutGraph);
        CC_ENSURES(subpassLayoutId != LayoutGraphData::null_vertex());

        // Save the passId
        mSubpassID = subpassID;
        mPassLayoutIdStack.push_back(subpassLayoutId);

        CC_ENSURES(mPassID != RenderGraph::null_vertex());
        CC_ENSURES(mSubpassID != RenderGraph::null_vertex());
        CC_ENSURES(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass + Subpass
        CC_ENSURES(mPassLayoutIdStack.size() == 2);
        CC_ENSURES(mPhaseLayoutIdStack.empty());
    }
    void resetRenderSubpass() noexcept {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mSubpassID != RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass + Subpass
        CC_EXPECTS(mPassLayoutIdStack.size() == 2);
        CC_EXPECTS(mPhaseLayoutIdStack.empty());

        // Reset the pass layout ID and pass ID
        mSubpassID = RenderGraph::null_vertex();
        mPassLayoutIdStack.pop_back();

        CC_ENSURES(mPassID != RenderGraph::null_vertex());
        CC_ENSURES(mSubpassID == RenderGraph::null_vertex());
        CC_ENSURES(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass
        CC_ENSURES(mPassLayoutIdStack.size() == 1);
        CC_ENSURES(mPhaseLayoutIdStack.empty());
    }
    void setupRenderQueue(RenderGraph::vertex_descriptor queueID, const RenderQueue& queueData) {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        CC_EXPECTS(mPassLayoutIdStack.size() == 1 + mSubpassID != RenderGraph::null_vertex()); // Pass(1) or Subpass(2)
        CC_EXPECTS(mPhaseLayoutIdStack.empty());
        // Stack: Pass + (Subpass)
        CC_EXPECTS(mPassLayoutIdStack.size() == 1 + mSubpassID != RenderGraph::null_vertex());
        CC_EXPECTS(mPhaseLayoutIdStack.empty());

        if (queueData.passLayoutID == LayoutGraphData::null_vertex()) {
            // If the pass layoutId is null, use the default pass layoutId
            auto passLayoutId = mPassLayoutIdStack.back();
            mPassLayoutIdStack.push_back(passLayoutId);
        } else {
            // Otherwise, use the pass layoutId from the queue data
            mPassLayoutIdStack.push_back(queueData.passLayoutID);
        }
        // pass layoutId must be valid
        CC_ENSURES(mPassLayoutIdStack.back() != LayoutGraphData::null_vertex());

        CC_EXPECTS(queueID != RenderGraph::null_vertex());
        mQueueID = queueID;
        CC_EXPECTS(queueData.phaseID != LayoutGraphData::null_vertex());
        mPhaseLayoutIdStack.push_back(queueData.phaseID);

        // Post conditions
        CC_ENSURES(mPassID != RenderGraph::null_vertex());
        CC_ENSURES(mQueueID != RenderGraph::null_vertex());
        // Stack: Pass + (Subpass) + Queue
        CC_ENSURES(mPassLayoutIdStack.size() == 2 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue
        CC_ENSURES(mPhaseLayoutIdStack.size() == 1);
    }
    void resetRenderQueue() noexcept {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID != RenderGraph::null_vertex());
        // Stack: Pass + (Subpass) + Queue
        CC_EXPECTS(mPassLayoutIdStack.size() == 2 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue
        CC_EXPECTS(mPhaseLayoutIdStack.size() == 1);

        // Reset the pass/queue layoutId and queueId
        mQueueID = RenderGraph::null_vertex();
        mPassLayoutIdStack.pop_back();
        mPhaseLayoutIdStack.pop_back();

        // Post conditions
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_ENSURES(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass + (Subpass)
        CC_ENSURES(mPassLayoutIdStack.size() == 1 + mSubpassID != RenderGraph::null_vertex());
        CC_ENSURES(mPhaseLayoutIdStack.empty());
    }
    void setupScene() {
        // Stack: Pass + (Subpass) + Queue
        CC_EXPECTS(mPassLayoutIdStack.size() == 2 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue
        CC_EXPECTS(mPhaseLayoutIdStack.size() == 1);

        const auto passLayoutId = mPassLayoutIdStack.back();
        mPassLayoutIdStack.push_back(passLayoutId);
        const auto phaseLayoutId = mPhaseLayoutIdStack.back();
        mPhaseLayoutIdStack.push_back(phaseLayoutId);

        // Stack: Pass + (Subpass) + Queue + Scene
        CC_ENSURES(mPassLayoutIdStack.size() == 3 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue + Scene
        CC_ENSURES(mPhaseLayoutIdStack.size() == 2);
    }
    void resetScene() noexcept {
        // Stack: Pass + (Subpass) + Queue + Scene
        CC_EXPECTS(mPassLayoutIdStack.size() == 3 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue + Scene
        CC_EXPECTS(mPhaseLayoutIdStack.size() == 2);
        mPassLayoutIdStack.pop_back();
        mPhaseLayoutIdStack.pop_back();
        // Stack: Pass + (Subpass) + Queue
        CC_ENSURES(mPassLayoutIdStack.size() == 2 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue
        CC_ENSURES(mPhaseLayoutIdStack.size() == 1);
    }

    template <class RenderOrComputePass>
    void buildRenderOrComputePassResourceIndex(
        RenderGraph::vertex_descriptor passID, const RenderOrComputePass& pass) const {
        // Build resource index
        auto& resourceIndex = pipeline.nativeContext.resourceGraphIndex[passID];
        CC_EXPECTS(resourceIndex.empty());
        renderDependencyGraph.buildDescriptorIndex(pass.computeViews, resourceIndex);
    }

    template <class RenderOrComputeSubpass>
    void buildRenderSubpassResourceIndex(
        RenderGraph::vertex_descriptor subpassID, const RenderOrComputeSubpass& subpass) const {
        auto& resourceIndex = pipeline.nativeContext.resourceGraphIndex[subpassID];
        CC_EXPECTS(resourceIndex.empty());
        renderDependencyGraph.buildDescriptorIndex(
            subpass.computeViews, subpass.rasterViews, resourceIndex);
    }

    RenderGraph::vertex_descriptor getPassOrSubpassID() const {
        if (mSubpassID != RenderGraph::null_vertex()) {
            return mSubpassID;
        }
        return mPassID;
    }

    DeviceRenderData& getOrCreateDeviceRenderData(const RootArgumentKey& key) const {
        auto& context = pipeline.nativeContext;
        auto iter = context.graphNodeRenderData.find(key);
        if (iter != context.graphNodeRenderData.end()) {
            CC_EXPECTS(iter->second.hasNoData());
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
    gfx::AccessFlagBit getAccessFlagBit(
        const ResourceAccessNode& accessNode,
        ResourceGraph::vertex_descriptor resID) const {
        // All sub-resources must be in the same access group
        auto parentID = parent(resID, pipeline.resourceGraph);
        parentID = parentID == ResourceGraph::null_vertex() ? resID : parentID;
        const auto& resName = get(ResourceGraph::NameTag{}, pipeline.resourceGraph, parentID);
        return accessNode.resourceStatus.at(resName).accessFlag;
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
                Expects(!accessNode);

                auto resID = iter->second;
                auto* texture = pipeline.resourceGraph.getTexture(resID);
                Expects(texture);
                const auto access = getAccessFlagBit(*accessNode, resID);
                return TextureWithAccessFlags{texture, access};
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
        const ResourceAccessNode* accessNode,
        const NameLocalID& attrID,
        DeviceRenderData& data) const {
        if (!resourceIndex) {
            return;
        }
        auto iter = resourceIndex->find(attrID);
        if (iter != resourceIndex->end()) {
            auto resID = iter->second;
            auto* texture = pipeline.resourceGraph.getTexture(resID);
            Expects(texture);
            const auto access = getAccessFlagBit(*accessNode, resID);
            if (texture) {
                auto res = data.textures.emplace(attrID, TextureWithAccessFlags{texture, access});
                CC_ENSURES(res.second);
            }
        }
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
                case DescriptorTypeOrder::INPUT_ATTACHMENT: {
                    for (const auto& d : block.descriptors) {
                        collectInputAttachment(
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
            const auto passOrSubpassID = getPassOrSubpassID();
            CC_EXPECTS(passOrSubpassID != RenderGraph::null_vertex());
            auto iter = pipeline.nativeContext.resourceGraphIndex.find(passOrSubpassID);
            if (iter != pipeline.nativeContext.resourceGraphIndex.end() &&
                !iter->second.empty()) {
                resourceIndex = &iter->second;
            }
            accessNode = &renderDependencyGraph.getAccessNode(passOrSubpassID);
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

    void collectPerPassDescriptors(const RenderGraphData::vertex_descriptor v) {
        CC_EXPECTS(mPassLayoutIdStack.size() >= 1);
        const bool fullRange = mPassLayoutIdStack.size() < 2 ||
                               mPassLayoutIdStack[mPassLayoutIdStack.size() - 1] !=
                                   mPassLayoutIdStack[mPassLayoutIdStack.size() - 2];
        const auto renderDataRange =
            fullRange
                // Render pass or not equal, collect full stack
                ? boost::span<const RenderData* const>(mRenderDataStack)
                // Last two layouts are equal, collect last element
                : boost::span<const RenderData* const>(&mRenderDataStack.back(), 1);

        const bool includeRenderGraphResource = fullRange;

        mPerPassDeviceRenderDataStack.emplace_back(
            collectDescriptors(
                renderDataRange,
                RootArgumentKey{v, UpdateFrequency::PER_PASS},
                mPassLayoutIdStack.back(),
                includeRenderGraphResource));
    }

    void collectPerPhaseDescriptors(const RenderGraphData::vertex_descriptor v) {
        CC_EXPECTS(mPhaseLayoutIdStack.size() >= 1);
        const auto renderDataRange =
            mPhaseLayoutIdStack.size() < 2 ||
                    mPhaseLayoutIdStack[mPhaseLayoutIdStack.size() - 1] !=
                        mPhaseLayoutIdStack[mPhaseLayoutIdStack.size() - 2]
                // Render queue or not equal, collect full stack
                ? boost::span<const RenderData* const>(mRenderDataStack)
                // Last two layouts are equal, collect last element
                : boost::span<const RenderData* const>(&mRenderDataStack.back(), 1);
        mPerQueueDeviceRenderDataStack.emplace_back(
            collectDescriptors(
                renderDataRange,
                RootArgumentKey{v, UpdateFrequency::PER_PHASE},
                mPhaseLayoutIdStack.back()));
    }

    void collectPassDescriptors(const RenderGraphData::vertex_descriptor v) {
        Expects(mPassID != RenderGraph::null_vertex());
        Expects(mSubpassID == RenderGraph::null_vertex());
        Expects(mQueueID == RenderGraph::null_vertex());
        Expects(mPassLayoutIdStack.size() == 1);
        Expects(mPhaseLayoutIdStack.empty());

        Expects(mRenderDataStack.empty());
        Expects(mPerPassDeviceRenderDataStack.empty());
        Expects(mPerQueueDeviceRenderDataStack.empty());

        // Add global and pass render data to the stack
        mRenderDataStack.emplace_back(&renderGraph.globalRenderData);
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));

        // Collect per pass descriptors
        collectPerPassDescriptors(v);

        // Post conditions
        Ensures(mRenderDataStack.size() == 2);
        Ensures(mPerPassDeviceRenderDataStack.size() == 1);
        Ensures(mPerQueueDeviceRenderDataStack.empty()); // Pass does not set queue descriptor set
    }

    void collectSubpassDescriptors(const RenderGraphData::vertex_descriptor v) {
        Expects(mPassID != RenderGraph::null_vertex());
        Expects(mSubpassID != RenderGraph::null_vertex());
        Expects(mQueueID == RenderGraph::null_vertex());
        Expects(mPassLayoutIdStack.size() == 2);
        Expects(mPhaseLayoutIdStack.empty());

        Expects(mRenderDataStack.size() == 2);
        Expects(mPerPassDeviceRenderDataStack.size() == 1);
        Expects(mPerQueueDeviceRenderDataStack.empty());

        // Add subpass render data to the stack
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));

        // Collect per pass descriptors
        collectPerPassDescriptors(v);

        // Post conditions
        Ensures(mRenderDataStack.size() == 3);
        Ensures(mPerPassDeviceRenderDataStack.size() == 2);
        Ensures(mPerQueueDeviceRenderDataStack.empty()); // Subpass does not set queue descriptor set
    }

    void collectQueueDescriptors(const RenderGraphData::vertex_descriptor v) {
        Expects(mPassID != RenderGraph::null_vertex());
        Expects(mQueueID != RenderGraph::null_vertex());
        Expects(mPassLayoutIdStack.size() == 1 + mSubpassID != RenderGraph::null_vertex());
        Expects(mPhaseLayoutIdStack.size() == 1);

        Expects(mRenderDataStack.size() == 2 + mSubpassID != RenderGraph::null_vertex());
        Expects(mPerPassDeviceRenderDataStack.size() == 1 + mSubpassID != RenderGraph::null_vertex());
        Expects(mPerQueueDeviceRenderDataStack.empty());

        // Add queue render data to the stack
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));

        // Collect per pass and per phase descriptors
        collectPerPassDescriptors(v);
        collectPerPhaseDescriptors(v);

        // Post conditions
        Ensures(mRenderDataStack.size() == 3 + mSubpassID != RenderGraph::null_vertex());
        Ensures(mPerPassDeviceRenderDataStack.size() == 2 + mSubpassID != RenderGraph::null_vertex());
        Ensures(mPerQueueDeviceRenderDataStack.size() == 1);
    }

    void collectSceneDescriptors(const RenderGraphData::vertex_descriptor v) {
        Expects(mPassID != RenderGraph::null_vertex());
        Expects(mQueueID != RenderGraph::null_vertex());
        // Stack: Pass + (Subpass) + Queue + Scene
        Expects(mPassLayoutIdStack.size() == 3 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue + Scene
        Expects(mPhaseLayoutIdStack.size() == 2);
        // Stack: Global + Pass + (Subpass) + Queue
        Expects(mRenderDataStack.size() == 3 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Pass + (Subpass) + Queue
        Expects(mPerPassDeviceRenderDataStack.size() == 2 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue
        Expects(mPerQueueDeviceRenderDataStack.size() == 1);

        // Add scene render data to the stack
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));

        // Collect per pass and per phase descriptors
        collectPerPassDescriptors(v);
        collectPerPhaseDescriptors(v);

        // Post conditions
        // Stack: Global + Pass + (Subpass) + Queue + Scene
        Ensures(mRenderDataStack.size() == 4 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Pass + (Subpass) + Queue + Scene
        Ensures(mPerPassDeviceRenderDataStack.size() == 3 + mSubpassID != RenderGraph::null_vertex());
        // Stack: Queue + Scene
        Ensures(mPerQueueDeviceRenderDataStack.size() == 2);
    }

    void prepareResourceGraphIndex(
        RenderGraph::vertex_descriptor vertID,
        const RasterPass& rasterPass) {
    }

    NativePipeline& pipeline;
    LayoutGraphData& layoutGraph;
    const RenderGraph& renderGraph;
    const FrameGraphDispatcher& renderDependencyGraph;

    RenderGraph::vertex_descriptor mPassID = RenderGraph::null_vertex();
    RenderGraph::vertex_descriptor mSubpassID = RenderGraph::null_vertex();
    RenderGraph::vertex_descriptor mQueueID = RenderGraph::null_vertex();

    // Pass + (Subpass) + Queue + Scene
    boost::container::static_vector<LayoutGraphData::vertex_descriptor, 4> mPassLayoutIdStack;
    // Queue + Scene
    boost::container::static_vector<LayoutGraphData::vertex_descriptor, 2> mPhaseLayoutIdStack;

    // Global + Pass + (Subpass) + Queue + Scene
    boost::container::static_vector<const RenderData*, 5> mRenderDataStack;
    // Pass + (Subpass) + Queue + Scene
    boost::container::static_vector<DeviceRenderData*, 4> mPerPassDeviceRenderDataStack;
    // Queue + Scene
    boost::container::static_vector<DeviceRenderData*, 2> mPerQueueDeviceRenderDataStack;
};

struct DescriptorSetVisitor : boost::dfs_visitor<> {
    void discover_vertex(
        RenderGraph::vertex_descriptor v,
        const AddressableView<RenderGraph>& gv) const {
        const auto& g = ctx.renderGraph;
        visitObject(
            v, g,
            [&](const RasterPass& pass) {
                const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.renderGraph, v);
                ctx.buildRenderOrComputePassResourceIndex(v, pass);
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
    // Notice: we do not call `nativeContext.resourceGraphIndex.clear()`.
    // Avoid memory allocation.
    for (auto& [_, index] : nativeContext.resourceGraphIndex) {
        index.clear();
    }

    // Notice: we do not call `nativeContext.graphNodeRenderData.clear()`.
    // Avoid memory allocation.
    // TODO(zhouzhenglong): we should use a pool allocator for this map.
    for (auto& [_, data] : nativeContext.graphNodeRenderData) {
        data.clear();
        CC_ENSURES(data.hasNoData());
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
