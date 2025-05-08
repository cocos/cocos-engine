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

#include "FGDispatcherTypes.h"
#include "LayoutGraphGraphs.h"
#include "LayoutGraphUtils.h"
#include "NativeExecutorRenderGraph.h" // IWYU pragma: keep
#include "NativePipelineTypes.h"
#include "RenderGraphGraphs.h"
#include "details/GraphView.h"

namespace cc {

namespace render {

namespace {

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
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mSubpassID == RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass
        CC_EXPECTS(mPassLayoutIdStack.size() == 1);
        CC_EXPECTS(mPhaseLayoutIdStack.empty());

        // Get the pass layoutId from the layout graph
        auto subpassLayoutId =
            subpassLayoutName.empty()
                ? mPassLayoutIdStack.back()
                : locate(LayoutGraphData::null_vertex(), subpassLayoutName, layoutGraph);
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
        CC_EXPECTS(mPassLayoutIdStack.size() == 1 + (mSubpassID != RenderGraph::null_vertex())); // Pass(1) or Subpass(2)
        CC_EXPECTS(mPhaseLayoutIdStack.empty());
        // Stack: Pass + (Subpass)
        CC_EXPECTS(mPassLayoutIdStack.size() == 1 + (mSubpassID != RenderGraph::null_vertex()));
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
        CC_ENSURES(mPassLayoutIdStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue
        CC_ENSURES(mPhaseLayoutIdStack.size() == 1);
    }
    void resetRenderQueue() noexcept {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID != RenderGraph::null_vertex());
        // Stack: Pass + (Subpass) + Queue
        CC_EXPECTS(mPassLayoutIdStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
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
        CC_ENSURES(mPassLayoutIdStack.size() == 1 + (mSubpassID != RenderGraph::null_vertex()));
        CC_ENSURES(mPhaseLayoutIdStack.empty());
    }
    void setupScene() {
        // Stack: Pass + (Subpass) + Queue
        CC_EXPECTS(mPassLayoutIdStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue
        CC_EXPECTS(mPhaseLayoutIdStack.size() == 1);

        // Use the last queue layoutId as the scene layoutId
        const auto passLayoutId = mPassLayoutIdStack.back();
        mPassLayoutIdStack.push_back(passLayoutId);
        const auto phaseLayoutId = mPhaseLayoutIdStack.back();
        mPhaseLayoutIdStack.push_back(phaseLayoutId);

        // Stack: Pass + (Subpass) + Queue + Scene
        CC_ENSURES(mPassLayoutIdStack.size() == 3 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue + Scene
        CC_ENSURES(mPhaseLayoutIdStack.size() == 2);
    }
    void resetScene() noexcept {
        // Stack: Pass + (Subpass) + Queue + Scene
        CC_EXPECTS(mPassLayoutIdStack.size() == 3 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue + Scene
        CC_EXPECTS(mPhaseLayoutIdStack.size() == 2);

        mPassLayoutIdStack.pop_back();
        mPhaseLayoutIdStack.pop_back();

        // Stack: Pass + (Subpass) + Queue
        CC_ENSURES(mPassLayoutIdStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
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

    DeviceRenderData& getOrCreateDeviceRenderData(const DescriptorSetKey& key) const {
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
        CC_ENSURES(res.second);
        return res.first->second;
    }

    void collectUniformBuffer(
        boost::span<const RenderData* const> renderDataRange,
        const gfx::UniformBlock& uniformBlock,
        DeviceRenderData& data) const {
        for (const auto& uniform : uniformBlock.members) {
            const auto valueID = [&]() {
                auto iter = layoutGraph.constantIndex.find(std::string_view{uniform.name});
                CC_EXPECTS(iter != layoutGraph.constantIndex.end());
                return iter->second.value;
            }();
            for (auto rangeIter = renderDataRange.rbegin(); rangeIter != renderDataRange.rend(); ++rangeIter) {
                const auto& renderData = **rangeIter;
                if (renderData.constants.empty()) {
                    continue;
                }
                if (renderData.constants.contains(valueID)) {
                    data.hasConstants = true;
                    return;
                }
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
            CC_EXPECTS(sampler);
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
                CC_EXPECTS(buffer);
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
                CC_EXPECTS(accessNode);
                auto resID = iter->second;
                auto* texture = pipeline.resourceGraph.getTexture(resID);
                CC_EXPECTS(texture);
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
            CC_EXPECTS(texture);
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
        CC_EXPECTS(!table.descriptorBlocks.empty());
        CC_EXPECTS(table.capacity); // Not unbounded
        for (const auto& block : table.descriptorBlocks) {
            switch (block.type) {
                case DescriptorTypeOrder::UNIFORM_BUFFER:
                case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER: {
                    for (const auto& d : block.descriptors) {
                        // Get uniform block
                        const auto& uniformBlock = table.uniformBlocks.at(d.descriptorID);
                        collectUniformBuffer(renderDataRange, uniformBlock, data);
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
        const DescriptorSetKey& key,
        LayoutGraphData::vertex_descriptor layoutID,
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

        const auto& layout = get(LayoutGraphData::LayoutTag{}, layoutGraph, layoutID);

        DeviceRenderData* deviceData = nullptr;
        // Collect resources from the current render graph node
        for (const auto& [freq, set] : layout.descriptorSets) {
            if (freq != key.frequency) {
                continue;
            }
            if (!deviceData) {
                deviceData = &getOrCreateDeviceRenderData(key);
            }
            CC_ENSURES(deviceData);
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

    void collectPerPassDescriptors(const RenderGraph::vertex_descriptor v) {
        CC_EXPECTS(mPassLayoutIdStack.size() >= 1);
        // Chec if the last two layout names are equal
        const bool fullRange = mPassLayoutIdStack.size() < 2 ||
                               mPassLayoutIdStack[mPassLayoutIdStack.size() - 1] !=
                                   mPassLayoutIdStack[mPassLayoutIdStack.size() - 2];
        // Collect the render data range
        const auto renderDataRange =
            fullRange
                // Last two layout names are not equal, collect from full stack
                ? boost::span<const RenderData* const>(mRenderDataStack)
                // Last two layout names are equal, collect from last render data
                : boost::span<const RenderData* const>(&mRenderDataStack.back(), 1);

        // If collecting full range, include render graph resource
        const bool includeRenderGraphResource = fullRange;

        mPerPassDeviceRenderDataStack.emplace_back(
            collectDescriptors(
                renderDataRange,
                DescriptorSetKey{v, UpdateFrequency::PER_PASS},
                mPassLayoutIdStack.back(),
                includeRenderGraphResource));
    }

    void collectPerPhaseDescriptors(const RenderGraph::vertex_descriptor v) {
        CC_EXPECTS(mPhaseLayoutIdStack.size() >= 1);
        const auto renderDataRange =
            mPhaseLayoutIdStack.size() < 2 ||
                    mPhaseLayoutIdStack[mPhaseLayoutIdStack.size() - 1] !=
                        mPhaseLayoutIdStack[mPhaseLayoutIdStack.size() - 2]
                // Last two layout names are not equal, collect from full stack
                ? boost::span<const RenderData* const>(mRenderDataStack)
                // Last two layouts are equal, collect last element
                : boost::span<const RenderData* const>(&mRenderDataStack.back(), 1);
        mPerQueueDeviceRenderDataStack.emplace_back(
            collectDescriptors(
                renderDataRange,
                DescriptorSetKey{v, UpdateFrequency::PER_PHASE},
                mPhaseLayoutIdStack.back()));
    }

    void collectPassDescriptors(const RenderGraph::vertex_descriptor v) {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mSubpassID == RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass
        CC_EXPECTS(mPassLayoutIdStack.size() == 1);
        // Stack: _
        CC_EXPECTS(mPhaseLayoutIdStack.empty());
        // Stack: _
        CC_EXPECTS(mRenderDataStack.empty());
        // Stack: _
        CC_EXPECTS(mPerPassDeviceRenderDataStack.empty());
        // Stack: _
        CC_EXPECTS(mPerQueueDeviceRenderDataStack.empty());

        // Add global and pass render data to the stack
        mRenderDataStack.emplace_back(&renderGraph.globalRenderData);
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));

        // Collect per pass descriptors
        collectPerPassDescriptors(v);

        // Post conditions
        // Stack: Global + Pass
        CC_ENSURES(mRenderDataStack.size() == 2);
        // Stack: Pass
        CC_ENSURES(mPerPassDeviceRenderDataStack.size() == 1);
        // Stack: _
        CC_ENSURES(mPerQueueDeviceRenderDataStack.empty()); // Pass does not set queue descriptor set
    }

    void collectSubpassDescriptors(const RenderGraph::vertex_descriptor v) {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mSubpassID != RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID == RenderGraph::null_vertex());
        // Stack: Pass + Subpass
        CC_EXPECTS(mPassLayoutIdStack.size() == 2);
        // Stack: _
        CC_EXPECTS(mPhaseLayoutIdStack.empty());
        // Stack: Global + Pass
        CC_EXPECTS(mRenderDataStack.size() == 2);
        // Stack: Pass
        CC_EXPECTS(mPerPassDeviceRenderDataStack.size() == 1);
        // Stack: _
        CC_EXPECTS(mPerQueueDeviceRenderDataStack.empty());

        // Add subpass render data to the stack
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));

        // Collect per pass descriptors
        collectPerPassDescriptors(v);

        // Post conditions
        // Stack: Global + Pass + Subpass
        CC_ENSURES(mRenderDataStack.size() == 3);
        // Stack: Pass + Subpass
        CC_ENSURES(mPerPassDeviceRenderDataStack.size() == 2);
        // Stack: _
        CC_ENSURES(mPerQueueDeviceRenderDataStack.empty()); // Subpass does not set queue descriptor set
    }

    void collectQueueDescriptors(const RenderGraph::vertex_descriptor v) {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID != RenderGraph::null_vertex());
        // Stack: Pass + (Subpass) + Queue
        CC_EXPECTS(mPassLayoutIdStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue
        CC_EXPECTS(mPhaseLayoutIdStack.size() == 1);
        // Stack: Global + Pass + (Subpass)
        CC_EXPECTS(mRenderDataStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Pass + (Subpass)
        CC_EXPECTS(mPerPassDeviceRenderDataStack.size() == 1 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: _
        CC_EXPECTS(mPerQueueDeviceRenderDataStack.empty());

        // Add queue render data to the stack
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));

        // Collect per pass and per phase descriptors
        collectPerPassDescriptors(v);
        collectPerPhaseDescriptors(v);

        // Post conditions
        // Stack: Global + Pass + (Subpass) + Queue
        CC_ENSURES(mRenderDataStack.size() == 3 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Pass + (Subpass) + Queue
        CC_ENSURES(mPerPassDeviceRenderDataStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue
        CC_ENSURES(mPerQueueDeviceRenderDataStack.size() == 1);
    }

    void collectSceneDescriptors(const RenderGraph::vertex_descriptor v) {
        CC_EXPECTS(mPassID != RenderGraph::null_vertex());
        CC_EXPECTS(mQueueID != RenderGraph::null_vertex());
        // Stack: Pass + (Subpass) + Queue + Scene
        CC_EXPECTS(mPassLayoutIdStack.size() == 3 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue + Scene
        CC_EXPECTS(mPhaseLayoutIdStack.size() == 2);
        // Stack: Global + Pass + (Subpass) + Queue
        CC_EXPECTS(mRenderDataStack.size() == 3 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Pass + (Subpass) + Queue
        CC_EXPECTS(mPerPassDeviceRenderDataStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue
        CC_EXPECTS(mPerQueueDeviceRenderDataStack.size() == 1);

        // Add scene render data to the stack
        mRenderDataStack.emplace_back(&get(RenderGraph::DataTag{}, renderGraph, v));

        // Collect per pass and per phase descriptors
        collectPerPassDescriptors(v);
        collectPerPhaseDescriptors(v);

        // Mark required
        if (mPerPassDeviceRenderDataStack.back()) {
            mPerPassDeviceRenderDataStack.back()->required = true;
        }
        if (mPerQueueDeviceRenderDataStack.back()) {
            mPerQueueDeviceRenderDataStack.back()->required = true;
        }

        // Post conditions
        // Stack: Global + Pass + (Subpass) + Queue + Scene
        CC_ENSURES(mRenderDataStack.size() == 4 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Pass + (Subpass) + Queue + Scene
        CC_ENSURES(mPerPassDeviceRenderDataStack.size() == 3 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue + Scene
        CC_ENSURES(mPerQueueDeviceRenderDataStack.size() == 2);
    }

    static std::pair<
        boost::span<LayoutGraphData::vertex_descriptor const>,
        boost::span<DeviceRenderData* const>>
    getConsistentLayoutIDsAndRenderDataRange(
        boost::span<LayoutGraphData::vertex_descriptor const> layoutIDs,
        boost::span<DeviceRenderData* const> renderDataFullRange) {
        CC_EXPECTS(layoutIDs.size() == renderDataFullRange.size());
        CC_EXPECTS(!layoutIDs.empty());

        auto i = static_cast<uint32_t>(layoutIDs.size());
        for (; i-- > 1;) {
            if (layoutIDs[i] != layoutIDs[i - 1]) {
                break;
            }
        }
        return {
            layoutIDs.subspan(i, layoutIDs.size() - i),
            renderDataFullRange.subspan(i, layoutIDs.size() - i),
        };
    }

    const ccstd::pmr::vector<char>* findUniform(std::string_view name) const {
        const auto valueId = [&]() {
            auto iter = layoutGraph.constantIndex.find(name);
            CC_EXPECTS(iter != layoutGraph.constantIndex.end());
            return iter->second.value;
        }();
        for (auto iter = mRenderDataStack.rbegin(); iter != mRenderDataStack.rend(); ++iter) {
            const auto& renderData = **iter;
            const auto iter2 = renderData.constants.find(valueId);
            if (iter2 != renderData.constants.end()) {
                return &iter2->second;
            }
        }
        return nullptr;
    }

    void updateCpuUniformBuffer(
        const gfx::UniformBlock& uniformBlock,
        ccstd::pmr::vector<char>& buffer) const {
        const auto& lg = layoutGraph;

        // calculate uniform block size
        const auto bufferSize =
            uniformBlock.count *
            getUniformBlockSize(uniformBlock.members);

        // check pre-condition
        CC_EXPECTS(buffer.size() == bufferSize);

        // reset buffer
        std::fill(buffer.begin(), buffer.end(), 0);

        uint32_t offset = 0;
        for (const auto& value : uniformBlock.members) {
            CC_EXPECTS(value.count);
            const auto typeSize = getTypeSize(value.type);
            const auto totalSize = typeSize * value.count;
            CC_ENSURES(typeSize);
            CC_ENSURES(totalSize);

            const auto* source = findUniform(value.name);
            if (source) {
                CC_EXPECTS(source->size() == totalSize);
                CC_EXPECTS(offset + totalSize <= bufferSize);
                memcpy(buffer.data() + offset, source->data(),
                       std::min<size_t>(source->size(), totalSize)); // safe guard min
            } else if (value.type == gfx::Type::MAT4) {
                // Set default matrix to identity
                CC_EXPECTS(sizeof(Mat4) == typeSize);
                static const Mat4 IDENTITY{};
                for (uint32_t i = 0; i != value.count; ++i) {
                    memcpy(buffer.data() + offset + (i * typeSize), IDENTITY.m, typeSize);
                }
            }
            offset += totalSize;
        }
        CC_ENSURES(offset == bufferSize);
    }

    gfx::Buffer* getBuffer(
        boost::span<const DeviceRenderData* const> dataRange,
        const NameLocalID& attrId) const {
        for (auto iter = dataRange.rbegin(); iter != dataRange.rend(); ++iter) {
            const auto* renderData = *iter;
            CC_EXPECTS(renderData);

            auto iter2 = renderData->buffers.find(attrId);
            if (iter2 != renderData->buffers.end()) {
                return iter2->second.get();
            }
        }
        return pipeline.nativeContext.defaultResource->getBuffer();
    }

    gfx::Texture* getTexture(
        boost::span<const DeviceRenderData* const> dataRange,
        const DescriptorData& d) const {
        for (auto iter = dataRange.rbegin(); iter != dataRange.rend(); ++iter) {
            const auto* renderData = *iter;
            CC_EXPECTS(renderData);

            auto iter2 = renderData->textures.find(d.descriptorID);
            if (iter2 != renderData->textures.end()) {
                return iter2->second.texture.get();
            }
        }
        // default textures
        gfx::TextureType type{};
        switch (d.type) {
            case gfx::Type::SAMPLER1D:
                type = gfx::TextureType::TEX1D;
                break;
            case gfx::Type::SAMPLER1D_ARRAY:
                type = gfx::TextureType::TEX1D_ARRAY;
                break;
            case gfx::Type::SAMPLER2D:
                type = gfx::TextureType::TEX2D;
                break;
            case gfx::Type::SAMPLER2D_ARRAY:
                type = gfx::TextureType::TEX2D_ARRAY;
                break;
            case gfx::Type::SAMPLER3D:
                type = gfx::TextureType::TEX3D;
                break;
            case gfx::Type::SAMPLER_CUBE:
                type = gfx::TextureType::CUBE;
                break;
            default:
                break;
        }
        return pipeline.nativeContext.defaultResource->getTexture(type);
    }

    static gfx::Sampler* getSampler(
        boost::span<const DeviceRenderData* const> dataRange,
        const NameLocalID& attrId) {
        for (auto iter = dataRange.rbegin(); iter != dataRange.rend(); ++iter) {
            const auto* renderData = *iter;
            CC_EXPECTS(renderData);

            auto iter2 = renderData->samplers.find(attrId);
            if (iter2 != renderData->samplers.end()) {
                return iter2->second;
            }
        }
        return nullptr;
    }

    void buildDescriptorSet(
        RenderGraph::vertex_descriptor nodeId,
        UpdateFrequency frequency,
        LayoutGraphData::vertex_descriptor layoutID,
        boost::span<const DeviceRenderData* const> dataRange) const {
        const auto& defaultResource = *pipeline.nativeContext.defaultResource;
        // Get layout
        const auto& layout = get(LayoutGraphData::LayoutTag{}, layoutGraph, layoutID);
        CC_EXPECTS(layout.descriptorSets.find(frequency) != layout.descriptorSets.end());
        const auto& data = layout.descriptorSets.at(frequency).descriptorSetLayoutData;

        // Get layout node resource
        auto& node = pipeline.nativeContext.layoutGraphResources.at(layoutID);

        // Allocate descriptor set
        gfx::DescriptorSet* newSet = node.descriptorSetPool.allocateDescriptorSet();
        CC_EXPECTS(newSet);

        for (const auto& block : data.descriptorBlocks) {
            CC_EXPECTS(block.descriptors.size() == block.capacity);
            auto bindId = block.offset;
            switch (block.type) {
                case DescriptorTypeOrder::UNIFORM_BUFFER:
                case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER: {
                    for (const auto& d : block.descriptors) {
                        // Get uniform block
                        const auto& uniformBlock = data.uniformBlocks.at(d.descriptorID);

                        // Update cpu uniform buffer
                        auto& resource = node.uniformBuffers.at(d.descriptorID);
                        CC_EXPECTS(resource.bufferPool.bufferSize == resource.cpuBuffer.size());
                        updateCpuUniformBuffer(uniformBlock, resource.cpuBuffer);

                        // upload gfx buffer
                        auto* gpuBuffer = resource.bufferPool.allocateBuffer();
                        CC_ENSURES(gpuBuffer);
                        cmdBuff.updateBuffer(gpuBuffer,
                                             resource.cpuBuffer.data(),
                                             static_cast<uint32_t>(resource.cpuBuffer.size()));

                        // bind buffer to descriptor set
                        newSet->bindBuffer(bindId, gpuBuffer);

                        // increase slot
                        // TODO(zhouzhenglong): here binding will be refactored in the future
                        // current implementation is incorrect, and we assume d.count == 1
                        CC_EXPECTS(d.count == 1);

                        // increase descriptor binding offset
                        bindId += d.count;
                    }
                } break;
                case DescriptorTypeOrder::STORAGE_BUFFER:
                case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER: {
                    for (const auto& d : block.descriptors) {
                        CC_EXPECTS(d.count == 1);
                        auto* buffer = getBuffer(dataRange, d.descriptorID);
                        CC_ENSURES(buffer);
                        newSet->bindBuffer(bindId, buffer);

                        // increase descriptor binding offset
                        bindId += d.count;
                    }
                } break;
                case DescriptorTypeOrder::SAMPLER_TEXTURE: {
                    for (const auto& d : block.descriptors) {
                        CC_EXPECTS(d.count == 1);
                        CC_EXPECTS(d.type >= gfx::Type::SAMPLER1D &&
                                   d.type <= gfx::Type::SAMPLER_CUBE);

                        auto* texture = getTexture(dataRange, d);
                        CC_ENSURES(texture);
                        newSet->bindTexture(bindId, texture);

                        auto* sampler = getSampler(dataRange, d.descriptorID);
                        if (sampler) {
                            newSet->bindSampler(bindId, sampler);
                        }

                        // increase descriptor binding offset
                        bindId += d.count;
                    }
                } break;
                case DescriptorTypeOrder::SAMPLER: {
                    for (const auto& d : block.descriptors) {
                        CC_EXPECTS(d.count == 1);

                        auto* sampler = getSampler(dataRange, d.descriptorID);
                        if (sampler) {
                            newSet->bindSampler(bindId, sampler);
                        }

                        // increase descriptor binding offset
                        bindId += d.count;
                    }
                } break;
                case DescriptorTypeOrder::TEXTURE: {
                    for (const auto& d : block.descriptors) {
                        CC_EXPECTS(d.count == 1);

                        auto* texture = getTexture(dataRange, d);
                        CC_ENSURES(texture);
                        newSet->bindTexture(bindId, texture);

                        // increase descriptor binding offset
                        bindId += d.count;
                    }
                } break;
                case DescriptorTypeOrder::STORAGE_IMAGE: {
                    for (const auto& d : block.descriptors) {
                        CC_EXPECTS(d.count == 1);

                        auto* texture = getTexture(dataRange, d);
                        CC_ENSURES(texture);
                        newSet->bindTexture(bindId, texture);

                        // increase descriptor binding offset
                        bindId += d.count;
                    }
                } break;
                case DescriptorTypeOrder::INPUT_ATTACHMENT: {
                    for (const auto& d : block.descriptors) {
                        CC_EXPECTS(d.count == 1);
                        CC_EXPECTS(d.type == gfx::Type::IMAGE2D);

                        auto* texture = getTexture(dataRange, d);
                        CC_ENSURES(texture);
                        newSet->bindTexture(bindId, texture);

                        // increase descriptor binding offset
                        bindId += d.count;
                    }
                } break;
                default:
                    CC_EXPECTS(false);
                    break;
            }
        }

        newSet->update();
        auto res = pipeline.nativeContext.graphNodeDescriptorSets.emplace(
            DescriptorSetKey{
                nodeId,
                frequency,
            },
            newSet);
        CC_ENSURES(res.second);
    }

    void tryCreateDescriptorSet(
        RenderGraph::vertex_descriptor nodeId,
        UpdateFrequency frequency,
        boost::span<LayoutGraphData::vertex_descriptor const> layoutIDs,
        boost::span<DeviceRenderData* const> renderDataFullRange) const {
        CC_EXPECTS(layoutIDs.size() == renderDataFullRange.size());

        auto* const targetRenderData = renderDataFullRange.back();

        // No descriptors defined in this descriptor set
        if (!targetRenderData) {
            return;
        }

        // If current node is not required,
        // it means all child nodes will bind descriptor sets.
        // Skip current node.
        if (!targetRenderData->required) {
            return;
        }

        // Get layout IDs and render data range of the same layoutId
        auto [layoutIDsRange, renderDataRange] =
            getConsistentLayoutIDsAndRenderDataRange(layoutIDs, renderDataFullRange);
        CC_ENSURES(layoutIDsRange.size() == renderDataRange.size());
        CC_ENSURES(!layoutIDsRange.empty());
        CC_ENSURES(renderDataRange.back() == targetRenderData);
        CC_ENSURES(std::all_of(
            layoutIDsRange.begin(), layoutIDsRange.end(),
            [value = layoutIDsRange.back()](auto id) {
                return id == value;
            }));

        // All render data in the range must be valid
        CC_EXPECTS(
            std::all_of(
                renderDataRange.begin(), renderDataRange.end(), [](const auto* data) {
                    return !!data;
                }));

        if (renderDataRange.size() > 1 &&          // More than 1 render data
            renderDataRange.back()->hasNoData()) { // Last render data is empty
            // Current render data is not set. There is nothing to bind.
            // Mark the render data with lower frequency as required
            CC_EXPECTS(renderDataRange[renderDataRange.size() - 2]);
            renderDataRange[renderDataRange.size() - 2]->required = true;
            return;
        }

        buildDescriptorSet(nodeId, frequency, layoutIDsRange.back(), renderDataRange);
    }

    void tryCreatePerPassDescriptorSet(RenderGraph::vertex_descriptor nodeId) const {
        tryCreateDescriptorSet(
            nodeId,
            UpdateFrequency::PER_PASS,
            mPassLayoutIdStack,
            mPerPassDeviceRenderDataStack);
    }
    void tryCreatePerPhaseDescriptorSet(RenderGraph::vertex_descriptor nodeId) const {
        tryCreateDescriptorSet(
            nodeId,
            UpdateFrequency::PER_PHASE,
            mPhaseLayoutIdStack,
            mPerQueueDeviceRenderDataStack);
    }

    void popPassDescriptors() {
        mRenderDataStack.pop_back(); // Pass data
        mRenderDataStack.pop_back(); // Global data
        mPerPassDeviceRenderDataStack.pop_back();
        CC_ENSURES(mRenderDataStack.empty());
        CC_ENSURES(mPerPassDeviceRenderDataStack.empty());
        CC_ENSURES(mPerQueueDeviceRenderDataStack.empty());
    }
    void popSubpassDescriptors() {
        mRenderDataStack.pop_back();
        mPerPassDeviceRenderDataStack.pop_back();
        // Stack: Global + Pass
        CC_ENSURES(mRenderDataStack.size() == 2);
        // Stack: Pass
        CC_ENSURES(mPerPassDeviceRenderDataStack.size() == 1);
        CC_ENSURES(mPerQueueDeviceRenderDataStack.empty());
    }
    void popQueueDescriptors() {
        mRenderDataStack.pop_back();
        mPerPassDeviceRenderDataStack.pop_back();
        mPerQueueDeviceRenderDataStack.pop_back();
        // Stack: Global + Pass + (Subpass)
        CC_ENSURES(mRenderDataStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Pass + (Subpass)
        CC_ENSURES(mPerPassDeviceRenderDataStack.size() == 1 + (mSubpassID != RenderGraph::null_vertex()));
        CC_ENSURES(mPerQueueDeviceRenderDataStack.empty());
    }
    void popSceneDescriptors() {
        mRenderDataStack.pop_back();
        mPerPassDeviceRenderDataStack.pop_back();
        mPerQueueDeviceRenderDataStack.pop_back();
        // Stack: Global + Pass + (Subpass) + Queue
        CC_ENSURES(mRenderDataStack.size() == 3 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Pass + (Subpass) + Queue
        CC_ENSURES(mPerPassDeviceRenderDataStack.size() == 2 + (mSubpassID != RenderGraph::null_vertex()));
        // Stack: Queue
        CC_ENSURES(mPerQueueDeviceRenderDataStack.size() == 1);
    }

    NativePipeline& pipeline;
    LayoutGraphData& layoutGraph;
    const RenderGraph& renderGraph;
    const FrameGraphDispatcher& renderDependencyGraph;
    gfx::CommandBuffer& cmdBuff;

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
        RenderGraph::vertex_descriptor v, const AddressableView<RenderGraph>& gv) const {
        std::ignore = gv;
        const auto& g = ctx.renderGraph;
        visitObject(
            v, g,
            // Pass
            [&](const RasterPass& pass) {
                const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.renderGraph, v);
                ctx.buildRenderOrComputePassResourceIndex(v, pass);
                ctx.setupRenderPass(v, passLayoutName);
                ctx.collectPassDescriptors(v);
            },
            [&](const ComputePass& pass) {
                const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.renderGraph, v);
                ctx.buildRenderOrComputePassResourceIndex(v, pass);
                ctx.setupRenderPass(v, passLayoutName);
                ctx.collectPassDescriptors(v);
            },
            [&](const RaytracePass& pass) {
                const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.renderGraph, v);
                ctx.buildRenderOrComputePassResourceIndex(v, pass);
                ctx.setupRenderPass(v, passLayoutName);
                ctx.collectPassDescriptors(v);
            },
            // Subpass
            [&](const RasterSubpass& subpass) {
                const auto& subpassLayoutName = get(RenderGraph::LayoutTag{}, ctx.renderGraph, v);
                ctx.buildRenderSubpassResourceIndex(v, subpass);
                ctx.setupRenderSubpass(v, subpassLayoutName);
                ctx.collectSubpassDescriptors(v);
            },
            [&](const ComputeSubpass& subpass) {
                const auto& subpassLayoutName = get(RenderGraph::LayoutTag{}, ctx.renderGraph, v);
                ctx.buildRenderSubpassResourceIndex(v, subpass);
                ctx.setupRenderSubpass(v, subpassLayoutName);
                ctx.collectSubpassDescriptors(v);
            },
            // Queue
            [&](const RenderQueue& queue) {
                ctx.setupRenderQueue(v, queue);
                ctx.collectQueueDescriptors(v);
            },
            // Scene
            [&](const SceneData& scene) {
                std::ignore = scene;
                ctx.setupScene();
                ctx.collectSceneDescriptors(v);
            },
            [&](const Blit& blit) {
                std::ignore = blit;
                ctx.setupScene();
                ctx.collectSceneDescriptors(v);
            },
            [&](const Dispatch& dispatch) {
                std::ignore = dispatch;
                ctx.setupScene();
                ctx.collectSceneDescriptors(v);
            },
            // Others
            [&](const ResolvePass& pass) {
                std::ignore = pass;
                // noop
            },
            [&](const CopyPass& pass) {
                std::ignore = pass;
                // noop
            },
            [&](const MovePass& pass) {
                std::ignore = pass;
                // noop
            },
            [&](const ccstd::pmr::vector<ClearView>& view) {
                std::ignore = view;
                // noop
            },
            [&](const gfx::Viewport& viewport) {
                std::ignore = viewport;
                // noop
            });
    }

    void finish_vertex(RenderGraph::vertex_descriptor v, const AddressableView<RenderGraph>& gv) {
        std::ignore = gv;
        const auto& g = ctx.renderGraph;
        // The following code can be simplified with C++20
        visitObject(
            v, g,
            // Pass
            [&](const RasterPass& pass) {
                std::ignore = pass;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.popPassDescriptors();
                ctx.resetRenderPass();
            },
            [&](const ComputePass& pass) {
                std::ignore = pass;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.popPassDescriptors();
                ctx.resetRenderPass();
            },
            [&](const RaytracePass& pass) {
                std::ignore = pass;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.popPassDescriptors();
                ctx.resetRenderPass();
            },
            // Subpass
            [&](const RasterSubpass& subpass) {
                std::ignore = subpass;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.popSubpassDescriptors();
                ctx.resetRenderSubpass();
            },
            [&](const ComputeSubpass& subpass) {
                std::ignore = subpass;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.popSubpassDescriptors();
                ctx.resetRenderSubpass();
            },
            // Queue
            [&](const RenderQueue& queue) {
                std::ignore = queue;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.tryCreatePerPhaseDescriptorSet(v);
                ctx.popQueueDescriptors();
                ctx.resetRenderQueue();
            },
            // Scene
            [&](const SceneData& scene) {
                std::ignore = scene;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.tryCreatePerPhaseDescriptorSet(v);
                ctx.popSceneDescriptors();
                ctx.resetScene();
            },
            [&](const Blit& blit) {
                std::ignore = blit;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.tryCreatePerPhaseDescriptorSet(v);
                ctx.popSceneDescriptors();
                ctx.resetScene();
            },
            [&](const Dispatch& dispatch) {
                std::ignore = dispatch;
                ctx.tryCreatePerPassDescriptorSet(v);
                ctx.tryCreatePerPhaseDescriptorSet(v);
                ctx.popSceneDescriptors();
                ctx.resetScene();
            },
            // Others
            [&](const ResolvePass& pass) {
                std::ignore = pass;
                // noop
            },
            [&](const CopyPass& pass) {
                std::ignore = pass;
                // noop
            },
            [&](const MovePass& pass) {
                std::ignore = pass;
                // noop
            },
            [&](const ccstd::pmr::vector<ClearView>& view) {
                std::ignore = view;
                // noop
            },
            [&](const gfx::Viewport& viewport) {
                std::ignore = viewport;
                // noop
            });
    }

    DescriptorSetVisitorContext& ctx;
};

} // namespace

void NativePipeline::prepareDescriptorSets(
    gfx::CommandBuffer& cmdBuff,
    const FrameGraphDispatcher& rdg,
    RenderGraph::vertex_descriptor passID) {
#if CC_DEBUG
    cmdBuff.beginMarker(makeMarkerInfo("Upload", RASTER_UPLOAD_COLOR));
#endif
    auto colors = renderGraph.colors(&unsyncPool);

    DescriptorSetVisitorContext context{
        *this,
        programLibrary->layoutGraph,
        renderGraph,
        rdg,
        cmdBuff,
    };

    DescriptorSetVisitor visitor{{}, context};

    AddressableView<RenderGraph> graphView(renderGraph);
    boost::depth_first_visit(graphView, passID, visitor, get(colors, renderGraph));

#if CC_DEBUG
    cmdBuff.endMarker();
#endif
}

} // namespace render

} // namespace cc
