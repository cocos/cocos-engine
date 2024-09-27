/****************************************************************************
 Copyright (c) 2022-2024 Xiamen Yaji Software Co., Ltd.

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
#include "LayoutGraphUtils.h"
#include "NativeExecutorRenderGraph.h"
#include "NativePipelineTypes.h"
#include "NativeUtils.h"
#include "RenderGraphGraphs.h"
#include "details/GraphView.h"
#include "details/GslUtils.h"
#include "details/Range.h"

namespace cc {

namespace render {

namespace {

void updateCpuUniformBuffer(
    const LayoutGraphData& lg,
    const RenderData& user,
    const gfx::UniformBlock& uniformBlock,
    bool bInit,
    ccstd::pmr::vector<char>& buffer) {
    // calculate uniform block size
    const auto bufferSize = uniformBlock.count *
                            getUniformBlockSize(uniformBlock.members);
    // check pre-condition
    CC_EXPECTS(buffer.size() == bufferSize);

    // reset buffer
    if (bInit) {
        std::fill(buffer.begin(), buffer.end(), 0);
    }

    uint32_t offset = 0;
    for (const auto& value : uniformBlock.members) {
        CC_EXPECTS(value.count);
        const auto typeSize = getTypeSize(value.type);
        const auto totalSize = typeSize * value.count;
        CC_ENSURES(typeSize);
        CC_ENSURES(totalSize);

        const auto valueID = [&]() {
            auto iter = lg.constantIndex.find(std::string_view{value.name});
            CC_EXPECTS(iter != lg.constantIndex.end());
            return iter->second.value;
        }();

        const auto iter2 = user.constants.find(valueID);
        if (iter2 == user.constants.end() || iter2->second.empty()) {
            if (bInit) {
                if (value.type == gfx::Type::MAT4) {
                    // init matrix to identity
                    CC_EXPECTS(sizeof(Mat4) == typeSize);
                    const Mat4 id{};
                    for (uint32_t i = 0; i != value.count; ++i) {
                        memcpy(buffer.data() + offset + (i * typeSize), id.m, typeSize);
                    }
                }
            }
            offset += totalSize;
            continue;
        }
        const auto& source = iter2->second;
        CC_EXPECTS(source.size() == totalSize);
        CC_EXPECTS(offset + totalSize <= bufferSize);
        memcpy(buffer.data() + offset, source.data(),
               std::min<size_t>(source.size(), totalSize)); // safe guard min
        offset += totalSize;
    }
    CC_ENSURES(offset == bufferSize);
}

void uploadUniformBuffer(
    gfx::DescriptorSet* passSet,
    uint32_t bindID,
    UniformBlockResource& resource,
    gfx::CommandBuffer* cmdBuff) {
    auto* buffer = resource.bufferPool.allocateBuffer();
    CC_ENSURES(buffer);

    cmdBuff->updateBuffer(buffer, resource.cpuBuffer.data(), static_cast<uint32_t>(resource.cpuBuffer.size()));

    CC_EXPECTS(passSet);
    passSet->bindBuffer(bindID, buffer);
}

gfx::DescriptorSet* initDescriptorSet(
    ResourceGraph& resg,
    gfx::Device* device,
    gfx::CommandBuffer* cmdBuff,
    const gfx::DefaultResource& defaultResource,
    const LayoutGraphData& lg,
    const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>& resourceIndex,
    const DescriptorSetData& set,
    const RenderData& user,
    LayoutGraphNodeResource& node,
    const ResourceAccessNode* accessNode = nullptr,
    const SceneResource* sceneResource = nullptr) {
    // update per pass resources
    const auto& data = set.descriptorSetLayoutData;

    gfx::DescriptorSet* newSet = node.descriptorSetPool.allocateDescriptorSet();
    for (const auto& block : data.descriptorBlocks) {
        CC_EXPECTS(block.descriptors.size() == block.capacity);
        auto bindID = block.offset;
        switch (block.type) {
            case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
            case DescriptorTypeOrder::UNIFORM_BUFFER: {
                for (const auto& d : block.descriptors) {
                    // get uniform block
                    const auto& uniformBlock = data.uniformBlocks.at(d.descriptorID);

                    auto& resource = node.uniformBuffers.at(d.descriptorID);
                    updateCpuUniformBuffer(lg, user, uniformBlock, true, resource.cpuBuffer);
                    CC_ENSURES(resource.bufferPool.bufferSize == resource.cpuBuffer.size());

                    // upload gfx buffer
                    uploadUniformBuffer(newSet, bindID, resource, cmdBuff);

                    // increase slot
                    // TODO(zhouzhenglong): here binding will be refactored in the future
                    // current implementation is incorrect, and we assume d.count == 1
                    CC_EXPECTS(d.count == 1);
                    bindID += d.count;
                }
                break;
            }
            case DescriptorTypeOrder::SAMPLER_TEXTURE: {
                CC_EXPECTS(newSet);
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    CC_EXPECTS(d.type >= gfx::Type::SAMPLER1D &&
                               d.type <= gfx::Type::SAMPLER_CUBE);
                    // texture
                    if (auto iter = resourceIndex.find(d.descriptorID);
                        iter != resourceIndex.end()) {
                        // render graph textures
                        auto* texture = resg.getTexture(iter->second);
                        CC_ENSURES(texture);
                        newSet->bindTexture(bindID, texture);
                    } else {
                        // user provided textures
                        bool found = false;
                        if (auto iter = user.textures.find(d.descriptorID.value);
                            iter != user.textures.end()) {
                            newSet->bindTexture(bindID, iter->second.get());
                            found = true;
                        } else if (sceneResource) {
                            auto iter = sceneResource->resourceIndex.find(d.descriptorID);
                            if (iter != sceneResource->resourceIndex.end()) {
                                CC_EXPECTS(iter->second == ResourceType::STORAGE_IMAGE);
                                auto* pTex = sceneResource->storageImages.at(d.descriptorID).get();
                                newSet->bindTexture(bindID, pTex);
                                found = true;
                            }
                        }
                        if (!found) {
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
                            newSet->bindTexture(bindID, defaultResource.getTexture(type));
                        }
                    } // texture end

                    // user provided samplers
                    if (auto iter = user.samplers.find(d.descriptorID.value);
                        iter != user.samplers.end()) {
                        newSet->bindSampler(bindID, iter->second);
                    }

                    // increase descriptor binding offset
                    bindID += d.count;
                }
                break;
            }
            case DescriptorTypeOrder::SAMPLER:
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    auto iter = user.samplers.find(d.descriptorID.value);
                    if (iter != user.samplers.end()) {
                        newSet->bindSampler(bindID, iter->second);
                    } else {
                        gfx::SamplerInfo info{};
                        auto* sampler = device->getSampler(info);
                        newSet->bindSampler(bindID, sampler);
                    }
                    bindID += d.count;
                }
                break;
            case DescriptorTypeOrder::TEXTURE:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
            case DescriptorTypeOrder::STORAGE_BUFFER:
                CC_EXPECTS(newSet);
                for (const auto& d : block.descriptors) {
                    bool found = false;
                    CC_EXPECTS(d.count == 1);
                    if (auto iter = resourceIndex.find(d.descriptorID);
                        iter != resourceIndex.end()) {
                        // render graph textures
                        auto* buffer = resg.getBuffer(iter->second);
                        CC_ENSURES(buffer);
                        newSet->bindBuffer(bindID, buffer);
                        found = true;
                    } else if (sceneResource) {
                        auto iter = sceneResource->resourceIndex.find(d.descriptorID);
                        if (iter != sceneResource->resourceIndex.end()) {
                            CC_EXPECTS(iter->second == ResourceType::STORAGE_BUFFER);
                            auto* pBuffer = sceneResource->storageBuffers.at(d.descriptorID).get();
                            newSet->bindBuffer(bindID, pBuffer);
                            found = true;
                        }
                    }
                    if (!found) {
                        newSet->bindBuffer(bindID, defaultResource.getBuffer());
                    }
                    bindID += d.count;
                }
                break;
            case DescriptorTypeOrder::STORAGE_IMAGE:
                // not supported yet
                CC_EXPECTS(newSet);
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    CC_EXPECTS(d.type == gfx::Type::IMAGE2D);

                    auto iter = resourceIndex.find(d.descriptorID);
                    if (iter != resourceIndex.end()) {
                        gfx::AccessFlags access = gfx::AccessFlagBit::NONE;
                        if (accessNode != nullptr) {
                            const auto& resID = iter->second;
                            // whole access only now.
                            auto parentID = parent(resID, resg);
                            parentID = parentID == ResourceGraph::null_vertex() ? resID : parentID;
                            const auto& resName = get(ResourceGraph::NameTag{}, resg, parentID);
                            access = accessNode->resourceStatus.at(resName).accessFlag;
                        }

                        // render graph textures
                        auto* texture = resg.getTexture(iter->second);
                        CC_ENSURES(texture);
                        newSet->bindTexture(bindID, texture, 0, access);
                    }
                    bindID += d.count;
                }
                break;
            case DescriptorTypeOrder::INPUT_ATTACHMENT: {
                for (const auto& [descID, resID] : resourceIndex) {
                    std::ignore = descID;
                    // render graph textures
                    auto* texture = resg.getTexture(resID);
                    gfx::AccessFlags access = gfx::AccessFlagBit::NONE;
                    if (accessNode != nullptr) {
                        // whole access only now.
                        auto parentID = parent(resID, resg);
                        parentID = parentID == ResourceGraph::null_vertex() ? resID : parentID;
                        const auto& resName = get(ResourceGraph::NameTag{}, resg, parentID);
                        access = accessNode->resourceStatus.at(resName).accessFlag;
                    }

                    CC_ENSURES(texture);
                    newSet->bindTexture(bindID, texture, 0, access);
                    bindID += 1;
                }
            };
                break;
            default:
                CC_EXPECTS(false);
                break;
        }
    }
    newSet->update();

    return newSet;
}

gfx::DescriptorSet* updatePerPassDescriptorSet(
    gfx::CommandBuffer* cmdBuff,
    const LayoutGraphData& lg,
    const DescriptorSetData& set,
    const RenderData& user,
    LayoutGraphNodeResource& node) {
    // update per pass resources
    const auto& data = set.descriptorSetLayoutData;

    auto& prevSet = node.descriptorSetPool.getCurrentDescriptorSet();
    gfx::DescriptorSet* newSet = node.descriptorSetPool.allocateDescriptorSet();
    for (const auto& block : data.descriptorBlocks) {
        CC_EXPECTS(block.descriptors.size() == block.capacity);
        auto bindID = block.offset;
        switch (block.type) {
            case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
            case DescriptorTypeOrder::UNIFORM_BUFFER: {
                for (const auto& d : block.descriptors) {
                    // get uniform block
                    const auto& uniformBlock = data.uniformBlocks.at(d.descriptorID);

                    auto& resource = node.uniformBuffers.at(d.descriptorID);
                    updateCpuUniformBuffer(lg, user, uniformBlock, false, resource.cpuBuffer);

                    // upload gfx buffer
                    uploadUniformBuffer(newSet, bindID, resource, cmdBuff);

                    // increase slot
                    // TODO(zhouzhenglong): here binding will be refactored in the future
                    // current implementation is incorrect, and we assume d.count == 1
                    CC_EXPECTS(d.count == 1);
                    bindID += d.count;
                }
                break;
            }
            case DescriptorTypeOrder::SAMPLER_TEXTURE: {
                CC_EXPECTS(newSet);
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    CC_EXPECTS(d.type >= gfx::Type::SAMPLER1D &&
                               d.type <= gfx::Type::SAMPLER_CUBE);
                    // textures
                    if (auto iter = user.textures.find(d.descriptorID.value);
                        iter != user.textures.end()) {
                        newSet->bindTexture(bindID, iter->second.get());
                    } else {
                        auto* prevTexture = prevSet.getTexture(bindID);
                        CC_ENSURES(prevTexture);
                        newSet->bindTexture(bindID, prevTexture);
                    }

                    // samplers
                    if (auto iter = user.samplers.find(d.descriptorID.value);
                        iter != user.samplers.end()) {
                        newSet->bindSampler(bindID, iter->second);
                    }

                    // increase descriptor binding offset
                    bindID += d.count;
                }
                break;
            }
            case DescriptorTypeOrder::SAMPLER:
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    auto iter = user.samplers.find(d.descriptorID.value);
                    if (iter != user.samplers.end()) {
                        newSet->bindSampler(bindID, iter->second);
                    } else {
                        auto* prevSampler = prevSet.getSampler(bindID);
                        CC_ENSURES(prevSampler);
                        newSet->bindSampler(bindID, prevSampler);
                    }
                    bindID += d.count;
                }
                break;
            case DescriptorTypeOrder::TEXTURE:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
            case DescriptorTypeOrder::STORAGE_BUFFER:
                CC_EXPECTS(newSet);
                for (const auto& d : block.descriptors) {
                    bool found = false;
                    CC_EXPECTS(d.count == 1);
                    if (auto iter = user.buffers.find(d.descriptorID.value);
                        iter != user.buffers.end()) {
                        newSet->bindBuffer(bindID, iter->second.get());
                        found = true;
                    } else {
                        auto* prevBuffer = prevSet.getBuffer(bindID);
                        CC_ENSURES(prevBuffer);
                        newSet->bindBuffer(bindID, prevBuffer);
                    }
                    bindID += d.count;
                }
                break;
            case DescriptorTypeOrder::STORAGE_IMAGE:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::INPUT_ATTACHMENT:
                CC_EXPECTS(newSet);
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    auto iter = user.textures.find(d.descriptorID.value);
                    if (iter != user.textures.end()) {
                        newSet->bindTexture(bindID, iter->second.get());
                    } else {
                        auto* prevTexture = prevSet.getTexture(bindID);
                        if (prevTexture) {
                            newSet->bindTexture(bindID, prevTexture);
                        }
                    }
                    bindID += d.count;
                }
                break;
            default:
                CC_EXPECTS(false);
                break;
        }
    }
    newSet->update();

    return newSet;
}

gfx::DescriptorSet* updateCameraUniformBufferAndDescriptorSet(
    LayoutGraphData::vertex_descriptor passLayoutID,
    RenderGraphVisitorContext& ctx, RenderGraph::vertex_descriptor sceneID) {
    gfx::DescriptorSet* perPassSet = nullptr;
    // update states
    auto& layout = get(LayoutGraphData::LayoutTag{}, ctx.lg, passLayoutID);
    auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PASS);
    if (iter != layout.descriptorSets.end()) {
        auto& set = iter->second;
        auto& node = ctx.context.layoutGraphResources.at(passLayoutID);
        const auto& user = get(RenderGraph::DataTag{}, ctx.g, sceneID); // notice: sceneID
        perPassSet = updatePerPassDescriptorSet(ctx.cmdBuff, ctx.lg, set, user, node);
    }
    return perPassSet;
}

const PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>>&
getComputeViews(RenderGraph::vertex_descriptor passID, const RenderGraph& rg) {
    if (holds<RasterPassTag>(passID, rg)) {
        return get(RasterPassTag{}, passID, rg).computeViews;
    }
    if (holds<RasterSubpassTag>(passID, rg)) {
        return get(RasterSubpassTag{}, passID, rg).computeViews;
    }
    CC_EXPECTS(holds<ComputeTag>(passID, rg));
    return get(ComputeTag{}, passID, rg).computeViews;
}

struct RenderGraphUploadVisitor : boost::dfs_visitor<> {
    void updateAndCreatePerPassDescriptorSet(
        RenderGraph::vertex_descriptor leafNodeID) const {
        const auto queueID = parent(leafNodeID, ctx.g);
        const auto passOrSubpassID = parent(queueID, ctx.g);
        const auto passID = parent(passOrSubpassID, ctx.g);
        LayoutGraphData::vertex_descriptor parentPassLayoutID = LayoutGraphData::null_vertex();
        if (passID == RenderGraph::null_vertex()) {
            const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.g, passOrSubpassID);
            const auto passLayoutID = locate(
                LayoutGraphData::null_vertex(), passLayoutName, ctx.lg);
            auto* perPassSet = updateCameraUniformBufferAndDescriptorSet(
                passLayoutID, ctx, leafNodeID);
            if (perPassSet) {
                get<0>(ctx.renderGraphDescriptorSet[leafNodeID]) = perPassSet;
                parentPassLayoutID = passLayoutID;
            }
        } else {
            const auto subpassID = passOrSubpassID;
            const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.g, passID);
            const auto& subpassLayoutName = get(RenderGraph::LayoutTag{}, ctx.g, subpassID);
            const auto subpassLayoutID =
                subpassLayoutName.empty()
                    ? locate(LayoutGraphData::null_vertex(),
                             get(RenderGraph::LayoutTag{}, ctx.g, passID),
                             ctx.lg)
                    : locate(LayoutGraphData::null_vertex(),
                             get(RenderGraph::LayoutTag{}, ctx.g, subpassID),
                             ctx.lg);
            auto* perPassSet = updateCameraUniformBufferAndDescriptorSet(
                subpassLayoutID, ctx, leafNodeID);
            if (perPassSet) {
                get<0>(ctx.renderGraphDescriptorSet[leafNodeID]) = perPassSet;
                parentPassLayoutID = subpassLayoutID;
            }
        }
        if (holds<SceneTag>(leafNodeID, ctx.g)) {
            const auto& sceneData = get(SceneTag{}, leafNodeID, ctx.g);
            if (any(sceneData.flags & SceneFlags::UI)) {
                const auto passLayoutID = locate(LayoutGraphData::null_vertex(), "default", ctx.lg);
                CC_EXPECTS(passLayoutID != LayoutGraphData::null_vertex());
                if (passLayoutID != parentPassLayoutID) {
                    auto* perPassSet = updateCameraUniformBufferAndDescriptorSet(
                        passLayoutID, ctx, leafNodeID);
                    if (perPassSet) {
                        ctx.uiDescriptorSet[leafNodeID] = perPassSet;
                    }
                }
            }
        }
    }
    void uploadBlitOrDispatchUniformBlokcs(
        RenderGraph::vertex_descriptor vertID,
        scene::Pass& pass) const {
        pass.update();

        // get shader
        auto& shader = *pass.getShaderVariant();
        // update material ubo and descriptor set
        // get or create program per-instance descriptor set
        auto& node = ctx.context.layoutGraphResources.at(pass.getPhaseID());
        auto iter = node.programResources.find(std::string_view{shader.getName()});
        if (iter == node.programResources.end()) {
            // make program resource
            auto res = node.programResources.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(shader.getName()),
                std::forward_as_tuple());
            CC_ENSURES(res.second);
            iter = res.first;
            auto& instance = res.first->second;

            // make per-instance layout
            IntrusivePtr<gfx::DescriptorSetLayout> instanceSetLayout =
                &const_cast<gfx::DescriptorSetLayout&>(
                    ctx.programLib->getLocalDescriptorSetLayout(
                        ctx.device, pass.getPhaseID(), shader.getName()));

            // init per-instance descriptor set pool
            instance.descriptorSetPool.init(ctx.device, std::move(instanceSetLayout));

            for (const auto& block : shader.getBlocks()) {
                if (static_cast<pipeline::SetIndex>(block.set) != pipeline::SetIndex::LOCAL) {
                    continue;
                }
                const auto& name = block.name;
                auto iter = ctx.lg.attributeIndex.find(std::string_view{name});
                CC_EXPECTS(iter != ctx.lg.attributeIndex.end());
                const auto attrID = iter->second;
                auto sz = getUniformBlockSize(block.members);
                const auto bDynamic = isDynamicUniformBlock(block.name);
                instance.uniformBuffers[attrID].init(ctx.device, sz, bDynamic);
            }
        }

        // update per-instance buffer and descriptor set
        const auto& programLib = *dynamic_cast<const NativeProgramLibrary*>(ctx.programLib);
        const auto& data = programLib.localLayoutData;
        auto& instance = iter->second;
        auto* set = instance.descriptorSetPool.allocateDescriptorSet();
        CC_ENSURES(set);
        for (const auto& block : shader.getBlocks()) {
            if (static_cast<pipeline::SetIndex>(block.set) != pipeline::SetIndex::LOCAL) {
                continue;
            }
            // find descriptor name ID
            const auto& name = block.name;
            auto iter = ctx.lg.attributeIndex.find(std::string_view{name});
            CC_EXPECTS(iter != ctx.lg.attributeIndex.end());
            const auto attrID = iter->second;

            // get uniformBuffer
            auto& uniformBuffer = instance.uniformBuffers[attrID];
            CC_EXPECTS(uniformBuffer.cpuBuffer.size() == uniformBuffer.bufferPool.bufferSize);

            // fill cpu buffer
            auto& cpuData = uniformBuffer.cpuBuffer;
            if (false) { // NOLINT(readability-simplify-boolean-expr)
                for (const auto& v : block.members) {
                    CC_LOG_INFO(v.name.c_str());
                }
            }

            // create and upload buffer
            auto* buffer = uniformBuffer.createFromCpuBuffer();

            // set buffer descriptor
            const auto binding = data.bindingMap.at(attrID);
            set->bindBuffer(binding, buffer);
        }
        ctx.perInstanceDescriptorSets[vertID] = set;
    }

    const SceneResource* getFirstSceneResource(RenderGraph::vertex_descriptor vertID) const {
        const auto& g = ctx.g;
        CC_EXPECTS(holds<QueueTag>(vertID, g));
        for (const auto e : makeRange(children(vertID, g))) {
            const auto sceneID = target(e, g);
            if (holds<SceneTag>(sceneID, g)) {
                const auto& sceneData = get(SceneTag{}, sceneID, g);
                auto iter = ctx.context.renderSceneResources.find(sceneData.scene);
                if (iter != ctx.context.renderSceneResources.end()) {
                    return &iter->second;
                }
            }
        }
        return nullptr;
    }

    void buildPerPassDescriptorSet(
        RenderGraph::vertex_descriptor passOrSubpassID,
        const DescriptorSetData& passLayoutData,
        LayoutGraphData::vertex_descriptor passLayoutID,
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>& passResourceIndex,
        RenderGraph::vertex_descriptor targetPassOrQueueID) const {
        // Pass data
        const auto& passUserData = get(RenderGraph::DataTag{}, ctx.g, passOrSubpassID);
        auto& passLayoutResources = ctx.context.layoutGraphResources.at(passLayoutID);

        // Get pass accesses
        const auto& accessNode = ctx.fgd.getAccessNode(passOrSubpassID);

        // Populate set
        auto* perPassSet = initDescriptorSet(
            ctx.resourceGraph,
            ctx.device, ctx.cmdBuff,
            *ctx.context.defaultResource, ctx.lg,
            passResourceIndex, passLayoutData,
            passUserData,
            passLayoutResources, &accessNode);
        CC_ENSURES(perPassSet);

        get<0>(ctx.renderGraphDescriptorSet[targetPassOrQueueID]) = perPassSet;
    }

    void buildPerPhaseDescriptorSet(
        RenderGraph::vertex_descriptor queueID,
        const DescriptorSetData& queueLayoutData,
        LayoutGraphData::vertex_descriptor queueLayoutID,
        const PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor>& passResourceIndex) const {
        // Queue data
        const auto& queueUserData = get(RenderGraph::DataTag{}, ctx.g, queueID);
        auto& queueLayoutResources = ctx.context.layoutGraphResources.at(queueLayoutID);

        // Find scene resource
        const auto* const sceneResource = getFirstSceneResource(queueID);

        // Populate set
        auto* perPhaseSet = initDescriptorSet(
            ctx.resourceGraph,
            ctx.device, ctx.cmdBuff,
            *ctx.context.defaultResource, ctx.lg,
            passResourceIndex, queueLayoutData,
            queueUserData,
            queueLayoutResources, nullptr, sceneResource);
        CC_ENSURES(perPhaseSet);

        get<1>(ctx.renderGraphDescriptorSet[queueID]) = perPhaseSet;
    }

    void buildRenderOrComputePassDescriptorSet(RenderGraph::vertex_descriptor passID) const {
        // prepare pass resource index
        {
            const auto& computeViews =
                holds<RasterPassTag>(passID, ctx.g)
                    ? get(RasterPassTag{}, passID, ctx.g).computeViews
                    : get(ComputeTag{}, passID, ctx.g).computeViews;
            const auto& resourceIndex = ctx.fgd.buildDescriptorIndex(computeViews, ctx.scratch);
            ctx.perPassResourceIndex[passID] = resourceIndex;
        }

        // try to build per pass descriptor set
        const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.g, passID);
        const auto passLayoutID = locate(LayoutGraphData::null_vertex(), passLayoutName, ctx.lg);
        CC_EXPECTS(passLayoutID != LayoutGraphData::null_vertex());

        const auto& passLayout = get(LayoutGraphData::LayoutTag{}, ctx.lg, passLayoutID);

        const auto iter = passLayout.descriptorSets.find(UpdateFrequency::PER_PASS);
        if (iter == passLayout.descriptorSets.end()) {
            return;
        }
        const auto& passLayoutData = iter->second;
        const auto& resourceIndex = ctx.perPassResourceIndex.at(passID);
        buildPerPassDescriptorSet(passID, passLayoutData, passLayoutID, resourceIndex,
                                  passID);
    }

    void buildRenderSubpassDescriptorSet(RenderGraph::vertex_descriptor subpassID) const {
        // prepare subpass resource index
        {
            const auto& subpass = get(RasterSubpassTag{}, subpassID, ctx.g);
            ctx.perPassResourceIndex[subpassID] = ctx.fgd.buildDescriptorIndex(
                subpass.computeViews, subpass.rasterViews, ctx.scratch);
        }

        // Overwrite current passLayoutID
        const auto subpassLayoutID = [&]() {
            const auto passID = parent(subpassID, ctx.g);
            const auto& passLayoutName = get(RenderGraph::LayoutTag{}, ctx.g, passID);
            const auto& subpassLayoutName = get(RenderGraph::LayoutTag{}, ctx.g, subpassID);
            return subpassLayoutName.empty()
                       ? locate(LayoutGraphData::null_vertex(),
                                get(RenderGraph::LayoutTag{}, ctx.g, passID),
                                ctx.lg)
                       : locate(LayoutGraphData::null_vertex(),
                                get(RenderGraph::LayoutTag{}, ctx.g, subpassID),
                                ctx.lg);
        }();
        CC_ENSURES(subpassLayoutID != LayoutGraphData::null_vertex());

        // try to build per pass descriptor set
        const auto& passLayout = get(LayoutGraphData::LayoutTag{}, ctx.lg, subpassLayoutID);

        const auto iter = passLayout.descriptorSets.find(UpdateFrequency::PER_PASS);
        if (iter == passLayout.descriptorSets.end()) {
            return;
        }
        const auto& passLayoutData = iter->second;
        const auto& resourceIndex = ctx.perPassResourceIndex.at(subpassID);
        buildPerPassDescriptorSet(subpassID, passLayoutData, subpassLayoutID, resourceIndex,
                                  subpassID);
    }

    void buildQueueDescriptorSets(RenderGraph::vertex_descriptor queueID) const {
        // Queue Data
        const auto& queueData = get(QueueTag{}, queueID, ctx.g);
        const auto queueLayoutID = queueData.phaseID;
        CC_EXPECTS(queueData.phaseID != LayoutGraphData::null_vertex());
        if (queueData.phaseID == LayoutGraphData::null_vertex()) {
            return;
        }

        // Pass ID
        const auto passID = parent(queueID, ctx.g);
        CC_EXPECTS(
            holds<RasterPassTag>(passID, ctx.g) ||
            holds<RasterSubpassTag>(passID, ctx.g) ||
            holds<ComputeTag>(passID, ctx.g));

        // Build Phase
        const auto& queueLayout = get(LayoutGraphData::LayoutTag{}, ctx.lg, queueLayoutID);
        if (const auto iter = queueLayout.descriptorSets.find(UpdateFrequency::PER_PHASE);
            iter != queueLayout.descriptorSets.end()) {
            const auto& queueLayoutData = iter->second;
            const auto& resourceIndex = ctx.perPassResourceIndex.at(passID);
            buildPerPhaseDescriptorSet(
                queueID, queueLayoutData, queueLayoutID, resourceIndex);
        }

        // Try override pass layout
        if (queueData.passLayoutID == LayoutGraphData::null_vertex()) {
            return;
        }

        const auto passLayoutID = queueData.passLayoutID;
        const auto& passLayout = get(LayoutGraphData::LayoutTag{}, ctx.lg, passLayoutID);
        if (const auto iter = passLayout.descriptorSets.find(UpdateFrequency::PER_PASS);
            iter != passLayout.descriptorSets.end()) {
            const auto& passLayoutData = iter->second;
            const auto& resourceIndex = ctx.perPassResourceIndex.at(passID);
            buildPerPassDescriptorSet(
                passID, passLayoutData, passLayoutID, resourceIndex, queueID);
        }
    }

    void discover_vertex(
        RenderGraph::vertex_descriptor vertID, const AddressableView<RenderGraph>& gv) const {
        std::ignore = gv;
        if (holds<RasterPassTag>(vertID, ctx.g) || holds<ComputeTag>(vertID, ctx.g)) {
            buildRenderOrComputePassDescriptorSet(vertID);
        } else if (holds<RasterSubpassTag>(vertID, ctx.g)) {
            buildRenderSubpassDescriptorSet(vertID);
        } else if (holds<QueueTag>(vertID, ctx.g)) {
            buildQueueDescriptorSets(vertID);
        } else if (holds<SceneTag>(vertID, ctx.g)) {
            const auto& sceneData = get(SceneTag{}, vertID, ctx.g);
            if (sceneData.camera) {
                updateAndCreatePerPassDescriptorSet(vertID);
                ctx.currentProjMatrix = sceneData.camera->getMatProj();
            }
        } else if (holds<BlitTag>(vertID, ctx.g)) {
            const auto& blit = get(BlitTag{}, vertID, ctx.g);
            if (blit.camera) {
                updateAndCreatePerPassDescriptorSet(vertID);
                ctx.currentProjMatrix = blit.camera->getMatProj();
            }
            // get pass
            auto& pass = *blit.material->getPasses()->at(static_cast<size_t>(blit.passID));
            uploadBlitOrDispatchUniformBlokcs(vertID, pass);
        } else if (holds<DispatchTag>(vertID, ctx.g)) {
            const auto& dispatch = get(DispatchTag{}, vertID, ctx.g);
            auto& pass = *dispatch.material->getPasses()->at(static_cast<size_t>(dispatch.passID));
            uploadBlitOrDispatchUniformBlokcs(vertID, pass);
        }
    }

    RenderGraphVisitorContext& ctx;
};

void prepareStatisticsDescriptorSet(RenderGraphVisitorContext& ctx, RenderGraph::vertex_descriptor passID) {
    const auto* profiler = ctx.ppl->getProfiler();
    if (profiler && profiler->isEnabled()) {
        // current pass
        RenderData user(ctx.scratch);
        setMat4Impl(user, ctx.lg, "cc_matProj", ctx.currentProjMatrix);

        auto* renderPass = ctx.currentPass;
        auto* cmdBuff = ctx.cmdBuff;
        const auto& submodel = profiler->getSubModels()[0];
        auto* pass = submodel->getPass(0);
        auto& layout = get(LayoutGraphData::LayoutTag{}, ctx.lg, pass->getSubpassOrPassID());
        auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PASS);
        if (iter != layout.descriptorSets.end()) {
            auto& set = iter->second;
            auto& node = ctx.context.layoutGraphResources.at(pass->getSubpassOrPassID());
            PmrFlatMap<NameLocalID, ResourceGraph::vertex_descriptor> resourceIndex(ctx.scratch);
            auto* perPassSet = initDescriptorSet(
                ctx.resourceGraph,
                ctx.device, ctx.cmdBuff,
                *ctx.context.defaultResource, ctx.lg,
                resourceIndex, set, user, node);
            CC_ENSURES(perPassSet);
            ctx.profilerPerPassDescriptorSets[passID] = perPassSet;
        } else {
            CC_EXPECTS(false);
            // TODO(zhouzhenglong): set descriptor set to empty
        }
    }
}

} // namespace

void NativePipeline::prepareDescriptors(
    RenderGraphVisitorContext& ctx, RenderGraph::vertex_descriptor passID) {
#if CC_DEBUG
    ctx.cmdBuff->beginMarker(makeMarkerInfo("Upload", RASTER_UPLOAD_COLOR));
#endif
    auto colors = ctx.g.colors(ctx.scratch);
    RenderGraphUploadVisitor visitor{{}, ctx};
    AddressableView<RenderGraph> graphView(ctx.g);
    boost::depth_first_visit(graphView, passID, visitor, get(colors, ctx.g));

    if (holds<RasterPassTag>(passID, ctx.g)) {
        const auto& pass = get(RasterPassTag{}, passID, ctx.g);
        if (pass.showStatistics) {
            prepareStatisticsDescriptorSet(ctx, passID);
        }
    }
#if CC_DEBUG
    ctx.cmdBuff->endMarker();
#endif
}

} // namespace render

} // namespace cc
