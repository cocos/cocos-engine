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
#include "FGDispatcherGraphs.h"
#include "LayoutGraphGraphs.h"
#include "LayoutGraphTypes.h"
#include "LayoutGraphUtils.h"
#include "NativeBuiltinUtils.h"
#include "NativePipelineFwd.h"
#include "NativePipelineTypes.h"
#include "NativeRenderGraphUtils.h"
#include "NativeUtils.h"
#include "PrivateTypes.h"
#include "RenderGraphGraphs.h"
#include "RenderGraphTypes.h"
#include "RenderingModule.h"
#include "cocos/renderer/gfx-base/GFXBarrier.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/gfx-base/GFXDescriptorSetLayout.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/InstancedBuffer.h"
#include "cocos/renderer/pipeline/PipelineStateManager.h"
#include "cocos/scene/Model.h"
#include "cocos/scene/Octree.h"
#include "cocos/scene/Pass.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/Skybox.h"
#include "details/GraphView.h"
#include "details/GslUtils.h"
#include "details/Range.h"

namespace cc {

namespace render {

namespace {

constexpr uint32_t INVALID_ID = 0xFFFFFFFF;
constexpr gfx::Color RASTER_COLOR{0.0, 1.0, 0.0, 1.0};
constexpr gfx::Color RASTER_UPLOAD_COLOR{1.0, 1.0, 0.0, 1.0};
constexpr gfx::Color RENDER_QUEUE_COLOR{0.0, 0.5, 0.5, 1.0};
constexpr gfx::Color COMPUTE_COLOR{0.0, 0.0, 1.0, 1.0};

gfx::MarkerInfo makeMarkerInfo(const char* str, const gfx::Color& color) {
    return gfx::MarkerInfo{str, color};
}

struct RenderGraphVisitorContext {
    RenderGraphVisitorContext(RenderGraphVisitorContext&&) = delete;
    RenderGraphVisitorContext(RenderGraphVisitorContext const&) = delete;
    RenderGraphVisitorContext& operator=(RenderGraphVisitorContext&&) = delete;
    RenderGraphVisitorContext& operator=(RenderGraphVisitorContext const&) = delete;

    NativeRenderContext& context;
    LayoutGraphData& lg;
    const RenderGraph& g;
    ResourceGraph& resourceGraph;
    const FrameGraphDispatcher& fgd;
    const ccstd::pmr::vector<bool>& validPasses;
    gfx::Device* device = nullptr;
    gfx::CommandBuffer* cmdBuff = nullptr;
    NativePipeline* ppl = nullptr;
    ccstd::pmr::unordered_map<
        RenderGraph::vertex_descriptor,
        gfx::DescriptorSet*>& renderGraphDescriptorSet;
    ccstd::pmr::unordered_map<
        RenderGraph::vertex_descriptor,
        gfx::DescriptorSet*>& profilerPerPassDescriptorSets;
    ccstd::pmr::unordered_map<
        RenderGraph::vertex_descriptor,
        gfx::DescriptorSet*>& perInstanceDescriptorSets;
    ProgramLibrary* programLib = nullptr;
    CustomRenderGraphContext customContext;
    boost::container::pmr::memory_resource* scratch = nullptr;
    gfx::RenderPass* currentPass = nullptr;
    uint32_t subpassIndex = 0;
    LayoutGraphData::vertex_descriptor currentPassLayoutID = LayoutGraphData::null_vertex();
    RenderGraph::vertex_descriptor currentInFlightPassID = RenderGraph::null_vertex();
    Mat4 currentProjMatrix{};
};

void clear(gfx::RenderPassInfo& info) {
    info.colorAttachments.clear();
    info.depthStencilAttachment = {};
    info.depthStencilResolveAttachment = {};
    info.subpasses.clear();
    info.dependencies.clear();
}

uint8_t getRasterViewPassInputSlot(const RasterView& view) {
    std::ignore = view;
    CC_EXPECTS(false); // not implemented yet
    return 0;
}

uint8_t getRasterViewPassOutputSlot(const RasterView& view) {
    std::ignore = view;
    CC_EXPECTS(false); // not implemented yet
    return 0;
}

uint32_t getRasterPassInputCount(const RasterPass& pass) {
    uint32_t numInputs = 0;
    for (const auto& [name, view] : pass.rasterViews) {
        if (view.accessType == AccessType::READ || view.accessType == AccessType::READ_WRITE) {
            ++numInputs;
        }
    }
    return numInputs;
}

uint32_t getRasterPassOutputCount(const RasterPass& pass) {
    uint32_t numOutputs = 0;
    for (const auto& [name, view] : pass.rasterViews) {
        if (view.attachmentType != AttachmentType::RENDER_TARGET) {
            continue;
        }
        if (view.accessType == AccessType::READ_WRITE || view.accessType == AccessType::WRITE) {
            ++numOutputs;
        }
    }
    return numOutputs;
}

uint32_t getRasterPassResolveCount(const RasterPass& pass) {
    std::ignore = pass;
    return 0;
}

uint32_t getRasterPassPreserveCount(const RasterPass& pass) {
    std::ignore = pass;
    return 0;
}

gfx::GeneralBarrier* getGeneralBarrier(gfx::Device* device, const RasterView& view) {
    if (view.accessType != AccessType::WRITE) { // Input
        return device->getGeneralBarrier({
            gfx::AccessFlagBit::COLOR_ATTACHMENT_READ,
            gfx::AccessFlagBit::COLOR_ATTACHMENT_READ,
        });
    }

    if (view.accessType != AccessType::READ) { // Output
        auto accessFlagBit = view.attachmentType == AttachmentType::RENDER_TARGET
                                 ? gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE
                                 : gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE;
        return device->getGeneralBarrier({accessFlagBit, accessFlagBit});
    }
    return nullptr;
}

ResourceGraph::vertex_descriptor getResourceID(const ccstd::pmr::string& name, const FrameGraphDispatcher& fgd) {
    return fgd.realResourceID(name);
}

PersistentRenderPassAndFramebuffer createPersistentRenderPassAndFramebuffer(
    RenderGraphVisitorContext& ctx, const RasterPass& pass,
    boost::container::pmr::memory_resource* /*scratch*/) {
    auto& resg = ctx.resourceGraph;

    PersistentRenderPassAndFramebuffer data(pass.get_allocator());
    auto [rpInfo, fbInfo, clearColors, clearDepth, clearStencil] = ctx.fgd.getRenderPassAndFrameBuffer(ctx.currentInFlightPassID, resg);

    // CC_ENSURES(rpInfo.colorAttachments.size() == data.clearColors.size());
    CC_ENSURES(rpInfo.colorAttachments.size() == fbInfo.colorTextures.size());

    data.clearColors = std::move(clearColors);
    data.clearDepth = clearDepth;
    data.clearStencil = clearStencil;
    data.renderPass = ctx.device->createRenderPass(rpInfo);
    fbInfo.renderPass = data.renderPass;
    data.framebuffer = ctx.device->createFramebuffer(fbInfo);

    return data;
}

PersistentRenderPassAndFramebuffer& fetchOrCreateFramebuffer(
    RenderGraphVisitorContext& ctx, const RasterPass& pass,
    boost::container::pmr::memory_resource* scratch) {
    auto iter = ctx.resourceGraph.renderPasses.find(pass);
    if (iter == ctx.resourceGraph.renderPasses.end()) {
        bool added = false;
        std::tie(iter, added) = ctx.resourceGraph.renderPasses.emplace(
            pass, createPersistentRenderPassAndFramebuffer(ctx, pass, scratch));
        CC_ENSURES(added);
    }
    return iter->second;
}

struct RenderGraphFilter {
    bool operator()(RenderGraph::vertex_descriptor u) const {
        return validPasses->operator[](u);
    }
    const ccstd::pmr::vector<bool>* validPasses = nullptr;
};

void bindDescValue(gfx::DescriptorSet& desc, uint32_t binding, gfx::Buffer* value) {
    desc.bindBuffer(binding, value);
}

void bindDescValue(gfx::DescriptorSet& desc, uint32_t binding, gfx::Texture* value) {
    desc.bindTexture(binding, value);
}

void bindDescValue(gfx::DescriptorSet& desc, uint32_t binding, gfx::Sampler* value) {
    desc.bindSampler(binding, value);
}

template <class T>
void bindGlobalDesc(gfx::DescriptorSet& desc, uint32_t binding, T* value) {
    bindDescValue(desc, binding, value);
}

uint32_t getDescBinding(uint32_t descId, const DescriptorSetData& descData) {
    const auto& layoutData = descData;
    // find descriptor binding
    for (const auto& block : layoutData.descriptorSetLayoutData.descriptorBlocks) {
        for (uint32_t i = 0; i != block.descriptors.size(); ++i) {
            if (descId == block.descriptors[i].descriptorID.value) {
                return block.offset + i;
            }
        }
    }
    return 0xFFFFFFFF;
}

void updateGlobal(
    RenderGraphVisitorContext& ctx,
    DescriptorSetData& descriptorSetData,
    const RenderData& data,
    bool isUpdate = false) {
    const auto& constants = data.constants;
    const auto& samplers = data.samplers;
    const auto& textures = data.textures;
    auto& device = *ctx.device;
    auto& descriptorSet = *descriptorSetData.descriptorSet;
    for (const auto& [key, value] : constants) {
        const auto bindId = getDescBinding(key, descriptorSetData);
        if (bindId == INVALID_ID) {
            continue;
        }
        auto* buffer = descriptorSet.getBuffer(bindId);
        bool haveBuff = true;
        if (!buffer && !isUpdate) {
            gfx::BufferInfo info{
                gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
                gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
                static_cast<uint32_t>(value.size()),
                static_cast<uint32_t>(value.size())};
            buffer = device.createBuffer(info);
            haveBuff = false;
        }
        CC_ENSURES(buffer);
        if (isUpdate) {
            buffer->update(value.data());
        }
        if (!haveBuff) {
            bindGlobalDesc(descriptorSet, bindId, buffer);
        }
    }
    for (const auto& [key, value] : textures) {
        const auto bindId = getDescBinding(key, descriptorSetData);
        if (bindId == INVALID_ID) {
            continue;
        }
        auto* tex = descriptorSet.getTexture(bindId);
        if (!tex || isUpdate) {
            bindGlobalDesc(descriptorSet, bindId, value.get());
        }
    }
    for (const auto& [key, value] : samplers) {
        const auto bindId = getDescBinding(key, descriptorSetData);
        if (bindId == INVALID_ID) {
            continue;
        }
        auto* sampler = descriptorSet.getSampler(bindId);
        if (!sampler || isUpdate) {
            bindGlobalDesc(descriptorSet, bindId, value);
        }
    }
}

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
                        memcpy(buffer.data() + offset + i * typeSize, id.m, typeSize);
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
                    auto name = lg.valueNames[d.descriptorID.value];
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
    RenderGraphVisitorContext& ctx, RenderGraph::vertex_descriptor sceneID) {
    gfx::DescriptorSet* perPassSet = nullptr;
    // update states
    CC_EXPECTS(ctx.currentPassLayoutID != LayoutGraphData::null_vertex());
    const auto& passLayoutID = ctx.currentPassLayoutID;
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

void submitUICommands(
    gfx::RenderPass* renderPass,
    uint32_t subpassOrPassLayoutID,
    const scene::Camera* camera,
    gfx::CommandBuffer* cmdBuff) {
    const auto& batches = camera->getScene()->getBatches();
    for (auto* batch : batches) {
        if (!(camera->getVisibility() & batch->getVisFlags())) {
            continue;
        }
        const auto& passes = batch->getPasses();
        for (size_t i = 0; i < batch->getShaders().size(); ++i) {
            const scene::Pass* pass = passes[i];
            if (pass->getSubpassOrPassID() != subpassOrPassLayoutID) {
                continue;
            }
            auto* shader = batch->getShaders()[i];
            auto* inputAssembler = batch->getInputAssembler();
            auto* ds = batch->getDescriptorSet();
            auto* pso = pipeline::PipelineStateManager::getOrCreatePipelineState(
                pass, shader, inputAssembler, renderPass);
            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(
                static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
                pass->getDescriptorSet());
            cmdBuff->bindInputAssembler(inputAssembler);
            cmdBuff->bindDescriptorSet(
                static_cast<uint32_t>(pipeline::SetIndex::LOCAL), ds);
            cmdBuff->draw(batch->getDrawInfo());
        }
    }
}

void submitProfilerCommands(
    RenderGraphVisitorContext& ctx,
    RenderGraph::vertex_descriptor vertID,
    const RasterPass& rasterPass) {
    const auto* profiler = ctx.ppl->getProfiler();
    if (!profiler || !profiler->isEnabled()) {
        return;
    }
    auto* renderPass = ctx.currentPass;
    auto* cmdBuff = ctx.cmdBuff;
    const auto& submodel = profiler->getSubModels()[0];
    auto* pass = submodel->getPass(0);
    auto* ia = submodel->getInputAssembler();
    auto* pso = pipeline::PipelineStateManager::getOrCreatePipelineState(
        pass, submodel->getShader(0), ia, renderPass);

    // profiler pass
    gfx::Viewport profilerViewport{};
    gfx::Rect profilerScissor{};
    profilerViewport.width = profilerScissor.width = rasterPass.width;
    profilerViewport.height = profilerScissor.height = rasterPass.height;
    cmdBuff->setViewport(profilerViewport);
    cmdBuff->setScissor(profilerScissor);

    auto* passSet = ctx.profilerPerPassDescriptorSets.at(vertID);
    CC_ENSURES(passSet);

    cmdBuff->bindPipelineState(pso);
    cmdBuff->bindDescriptorSet(static_cast<uint32_t>(pipeline::SetIndex::GLOBAL), passSet);
    cmdBuff->bindDescriptorSet(static_cast<uint32_t>(pipeline::SetIndex::MATERIAL), pass->getDescriptorSet());
    cmdBuff->bindDescriptorSet(static_cast<uint32_t>(pipeline::SetIndex::LOCAL), submodel->getDescriptorSet());
    cmdBuff->bindInputAssembler(ia);
    cmdBuff->draw(ia);
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
    void updateAndCreatePerPassDescriptorSet(RenderGraph::vertex_descriptor vertID) const {
        auto* perPassSet = updateCameraUniformBufferAndDescriptorSet(ctx, vertID);
        if (perPassSet) {
            ctx.renderGraphDescriptorSet[vertID] = perPassSet;
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

    void discover_vertex(
        RenderGraph::vertex_descriptor vertID,
        const boost::filtered_graph<
            AddressableView<RenderGraph>, boost::keep_all, RenderGraphFilter>& gv) const {
        std::ignore = gv;
        CC_EXPECTS(ctx.currentPassLayoutID != LayoutGraphData::null_vertex());

        if (holds<RasterPassTag>(vertID, ctx.g) || holds<ComputeTag>(vertID, ctx.g)) {
            // const auto& pass = get(RasterPassTag{}, vertID, ctx.g);
            const auto& computeViews =
                holds<RasterPassTag>(vertID, ctx.g)
                    ? get(RasterPassTag{}, vertID, ctx.g).computeViews
                    : get(ComputeTag{}, vertID, ctx.g).computeViews;

            // render pass
            const auto& layoutName = get(RenderGraph::LayoutTag{}, ctx.g, vertID);
            const auto& layoutID = locate(LayoutGraphData::null_vertex(), layoutName, ctx.lg);
            CC_EXPECTS(layoutID == ctx.currentPassLayoutID);
            // get layout
            auto& layout = get(LayoutGraphData::LayoutTag{}, ctx.lg, layoutID);

            // update states
            auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PASS);
            if (iter == layout.descriptorSets.end()) {
                return;
            }

            // build pass resources
            const auto& resourceIndex = ctx.fgd.buildDescriptorIndex(computeViews, ctx.scratch);

            // populate set
            auto& set = iter->second;
            const auto& user = get(RenderGraph::DataTag{}, ctx.g, vertID);
            auto& node = ctx.context.layoutGraphResources.at(layoutID);
            const auto& accessNode = ctx.fgd.getAccessNode(vertID);
            auto* perPassSet = initDescriptorSet(
                ctx.resourceGraph,
                ctx.device, ctx.cmdBuff,
                *ctx.context.defaultResource, ctx.lg,
                resourceIndex, set, user, node, &accessNode);
            CC_ENSURES(perPassSet);
            ctx.renderGraphDescriptorSet[vertID] = perPassSet;
        } else if (holds<QueueTag>(vertID, ctx.g)) {
            const auto& queue = get(QueueTag{}, vertID, ctx.g);
            if (queue.phaseID == LayoutGraphData::null_vertex()) {
                return;
            }

            const auto layoutID = queue.phaseID;

            const auto passID = parent(vertID, ctx.g);
            const auto& computeViews = getComputeViews(passID, ctx.g);

            // get layout
            auto& layout = get(LayoutGraphData::LayoutTag{}, ctx.lg, layoutID);
            auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PHASE);
            if (iter == layout.descriptorSets.end()) {
                return;
            }

            // build pass resources
            const auto& resourceIndex = ctx.fgd.buildDescriptorIndex(computeViews, ctx.scratch);

            // find scene resource
            const auto* const sceneResource = getFirstSceneResource(vertID);

            // populate set
            auto& set = iter->second;
            const auto& user = get(RenderGraph::DataTag{}, ctx.g, vertID);
            auto& node = ctx.context.layoutGraphResources.at(layoutID);

            auto* perPhaseSet = initDescriptorSet(
                ctx.resourceGraph,
                ctx.device, ctx.cmdBuff,
                *ctx.context.defaultResource, ctx.lg,
                resourceIndex, set, user, node, nullptr, sceneResource);
            CC_ENSURES(perPhaseSet);

            ctx.renderGraphDescriptorSet[vertID] = perPhaseSet;
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
        } else if (holds<RasterSubpassTag>(vertID, ctx.g)) {
            const auto& subpass = get(RasterSubpassTag{}, vertID, ctx.g);
            // render pass
            const auto& layoutName = get(RenderGraph::LayoutTag{}, ctx.g, vertID);
            auto parentLayoutID = ctx.currentPassLayoutID;
            auto layoutID = parentLayoutID;
            if (!layoutName.empty()) {
                auto parentID = parent(ctx.currentPassLayoutID, ctx.lg);
                if (parentID != LayoutGraphData::null_vertex()) {
                    parentLayoutID = parentID;
                }
                layoutID = locate(parentLayoutID, layoutName, ctx.lg);
            }

            ctx.currentPassLayoutID = layoutID;
            // get layout
            auto& layout = get(LayoutGraphData::LayoutTag{}, ctx.lg, layoutID);

            // update states
            auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PASS);
            if (iter == layout.descriptorSets.end()) {
                return;
            }

            const auto& resourceIndex = ctx.fgd.buildDescriptorIndex(subpass.computeViews, subpass.rasterViews, ctx.scratch);
            // populate set
            auto& set = iter->second;
            const auto& user = get(RenderGraph::DataTag{}, ctx.g, vertID);
            auto& node = ctx.context.layoutGraphResources.at(layoutID);
            const auto& accessNode = ctx.fgd.getAccessNode(vertID);

            auto* perPassSet = initDescriptorSet(
                ctx.resourceGraph,
                ctx.device, ctx.cmdBuff,
                *ctx.context.defaultResource, ctx.lg,
                resourceIndex, set, user, node, &accessNode);
            CC_ENSURES(perPassSet);
            ctx.renderGraphDescriptorSet[vertID] = perPassSet;
        }
    }

    RenderGraphVisitorContext& ctx;
};

struct RenderGraphVisitor : boost::dfs_visitor<> {
    void submitBarriers(const std::vector<Barrier>& barriers) const {
        auto& resg = ctx.resourceGraph;
        auto sz = barriers.size();
        ccstd::pmr::vector<const gfx::Buffer*> buffers(ctx.scratch);
        ccstd::pmr::vector<const gfx::BufferBarrier*> bufferBarriers(ctx.scratch);
        ccstd::pmr::vector<const gfx::Texture*> textures(ctx.scratch);
        ccstd::pmr::vector<const gfx::TextureBarrier*> textureBarriers(ctx.scratch);
        buffers.reserve(sz);
        bufferBarriers.reserve(sz);
        textures.reserve(sz);
        textureBarriers.reserve(sz);
        for (const auto& barrier : barriers) {
            const auto resID = barrier.resourceID;
            const auto& desc = get(ResourceGraph::DescTag{}, resg, resID);
            const auto& resource = get(ResourceGraph::DescTag{}, resg, resID);
            switch (desc.dimension) {
                case ResourceDimension::BUFFER: {
                    auto* buffer = resg.getBuffer(resID);
                    const auto* bufferBarrier = static_cast<gfx::BufferBarrier*>(barrier.barrier);
                    buffers.emplace_back(buffer);
                    bufferBarriers.emplace_back(bufferBarrier);
                    break;
                }
                case ResourceDimension::TEXTURE1D:
                case ResourceDimension::TEXTURE2D:
                case ResourceDimension::TEXTURE3D:
                default: {
                    auto* texture = resg.getTexture(resID);
                    const auto* textureBarrier = static_cast<gfx::TextureBarrier*>(barrier.barrier);
                    textures.emplace_back(texture);
                    textureBarriers.emplace_back(textureBarrier);
                    break;
                }
            }
        }

        CC_EXPECTS(buffers.size() == bufferBarriers.size());
        CC_EXPECTS(textures.size() == textureBarriers.size());

        ctx.cmdBuff->pipelineBarrier(
            nullptr,
            bufferBarriers.data(), buffers.data(), static_cast<uint32_t>(bufferBarriers.size()),
            textureBarriers.data(), textures.data(), static_cast<uint32_t>(textureBarriers.size()));
    }
    void frontBarriers(RenderGraph::vertex_descriptor vertID) const {
        const auto& barrier = ctx.fgd.getBarrier(vertID);
        if (!barrier.frontBarriers.empty()) {
            submitBarriers(barrier.frontBarriers);
        }
    }
    void rearBarriers(RenderGraph::vertex_descriptor vertID) const {
        const auto& barrier = ctx.fgd.getBarrier(vertID);
        if (!barrier.rearBarriers.empty()) {
            submitBarriers(barrier.rearBarriers);
        }
    }
    void tryBindPerPassDescriptorSet(RenderGraph::vertex_descriptor vertID) const {
        auto iter = ctx.renderGraphDescriptorSet.find(vertID);
        if (iter != ctx.renderGraphDescriptorSet.end()) {
            CC_ENSURES(iter->second);
            ctx.cmdBuff->bindDescriptorSet(
                static_cast<uint32_t>(pipeline::SetIndex::GLOBAL),
                iter->second);
        }
    }
    void tryBindPerPhaseDescriptorSet(RenderGraph::vertex_descriptor vertID) const {
        auto iter = ctx.renderGraphDescriptorSet.find(vertID);
        if (iter != ctx.renderGraphDescriptorSet.end()) {
            CC_ENSURES(iter->second);
            static_assert(static_cast<uint32_t>(pipeline::SetIndex::COUNT) == 3);
            ctx.cmdBuff->bindDescriptorSet(
                static_cast<uint32_t>(pipeline::SetIndex::COUNT),
                iter->second);
        }
    }
    void begin(const RasterPass& pass, RenderGraph::vertex_descriptor vertID) const {
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& passes = ctx.ppl->custom.renderPasses;
            auto iter = passes.find(renderData.custom);
            if (iter != passes.end()) {
                iter->second->beginRenderPass(ctx.customContext, vertID);
                return;
            }
        }

        // viewport
        auto vp = pass.viewport;
        if (vp.width == 0 && vp.height == 0) {
            vp.width = pass.width;
            vp.height = pass.height;
        }
        // scissor
        gfx::Rect scissor{0, 0, vp.width, vp.height};

        // render pass
        {
            ctx.currentInFlightPassID = vertID;
            auto& res = fetchOrCreateFramebuffer(ctx, pass, ctx.scratch);
            const auto& data = res;
            auto* cmdBuff = ctx.cmdBuff;
            cmdBuff->beginRenderPass(
                data.renderPass.get(),
                data.framebuffer.get(),
                scissor, data.clearColors.data(),
                data.clearDepth, data.clearStencil);
            ctx.currentPass = data.renderPass.get();
        }

        // PerPass DescriptorSet
        tryBindPerPassDescriptorSet(vertID);
    }
    void begin(const RasterSubpass& subpass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
#if CC_DEBUG
        ctx.cmdBuff->insertMarker(makeMarkerInfo(get(RenderGraph::NameTag{}, ctx.g, vertID).c_str(), RASTER_COLOR));
#endif

        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& subpasses = ctx.ppl->custom.renderSubpasses;
            auto iter = subpasses.find(renderData.custom);
            if (iter != subpasses.end()) {
                iter->second->beginRenderSubpass(ctx.customContext, vertID);
                return;
            }
        }

        // PerPass DescriptorSet
        if (subpass.subpassID) {
            ctx.cmdBuff->nextSubpass();
        }
        // ctx.cmdBuff->setViewport(subpass);
        tryBindPerPassDescriptorSet(vertID);
        ctx.subpassIndex = subpass.subpassID;
        // noop
    }
    void begin(const ComputeSubpass& subpass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& subpasses = ctx.ppl->custom.computeSubpasses;
            auto iter = subpasses.find(renderData.custom);
            if (iter != subpasses.end()) {
                iter->second->beginComputeSubpass(ctx.customContext, vertID);
                return;
            }
        }

        std::ignore = subpass;
        std::ignore = vertID;
        // noop
    }
    void begin(const ComputePass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
#if CC_DEBUG
        ctx.cmdBuff->beginMarker(makeMarkerInfo(get(RenderGraph::NameTag{}, ctx.g, vertID).c_str(), COMPUTE_COLOR));
#endif

        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& passes = ctx.ppl->custom.computePasses;
            auto iter = passes.find(renderData.custom);
            if (iter != passes.end()) {
                iter->second->beginComputePass(ctx.customContext, vertID);
                return;
            }
        }

        std::ignore = pass;
        std::ignore = vertID;
        for (const auto& [name, views] : pass.computeViews) {
            for (const auto& view : views) {
                if (view.clearFlags != gfx::ClearFlags::NONE) {
                    // clear resources
                }
            }
        }
        tryBindPerPassDescriptorSet(vertID);
    }
    void begin(const ResolvePass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        std::ignore = vertID;
        for (const auto& copy : pass.resolvePairs) {
            // TODO(zhenglong.zhou): resolve
        }
    }
    void copyTexture(
        const CopyPair& copy,
        ResourceGraph::vertex_descriptor srcID,
        ResourceGraph::vertex_descriptor dstID) const {
        auto& resg = ctx.resourceGraph;
        std::vector<gfx::TextureCopy> copyInfos(copy.mipLevels, gfx::TextureCopy{});

        gfx::Texture* srcTexture = resg.getTexture(srcID);
        gfx::Texture* dstTexture = resg.getTexture(dstID);
        CC_ENSURES(srcTexture);
        CC_ENSURES(dstTexture);
        if (!srcTexture || !dstTexture) {
            return;
        }
        const auto& srcInfo = srcTexture->getInfo();
        const auto& dstInfo = dstTexture->getInfo();
        CC_ENSURES(srcInfo.width == dstInfo.width);
        CC_ENSURES(srcInfo.height == dstInfo.height);
        CC_ENSURES(srcInfo.depth == dstInfo.depth);

        for (uint32_t i = 0; i < copy.mipLevels; ++i) {
            auto& copyInfo = copyInfos[i];
            copyInfo.srcSubres.mipLevel = copy.sourceMostDetailedMip + i;
            copyInfo.srcSubres.baseArrayLayer = copy.sourceFirstSlice;
            copyInfo.srcSubres.layerCount = copy.numSlices;

            copyInfo.dstSubres.mipLevel = copy.targetMostDetailedMip + i;
            copyInfo.dstSubres.baseArrayLayer = copy.targetFirstSlice;
            copyInfo.dstSubres.layerCount = copy.numSlices;

            copyInfo.srcOffset = {0, 0, 0};
            copyInfo.dstOffset = {0, 0, 0};
            copyInfo.extent = {srcInfo.width, srcInfo.height, srcInfo.depth};
        }

        ctx.cmdBuff->copyTexture(srcTexture, dstTexture, copyInfos.data(), static_cast<uint32_t>(copyInfos.size()));
    }
    void copyBuffer( // NOLINT(readability-convert-member-functions-to-static)
        const CopyPair& copy,
        ResourceGraph::vertex_descriptor srcID,
        ResourceGraph::vertex_descriptor dstID) const {
        // TODO(zhouzhenglong): add impl
        std::ignore = copy;
        std::ignore = srcID;
        std::ignore = dstID;
    }
    void uploadTexture( // NOLINT(readability-convert-member-functions-to-static)
        const UploadPair& upload,
        ResourceGraph::vertex_descriptor dstID) const {
        // TODO(zhouzhenglong): add impl
        std::ignore = upload;
        std::ignore = dstID;
    }
    void uploadBuffer(
        const UploadPair& upload,
        ResourceGraph::vertex_descriptor dstID) const {
        auto& resg = ctx.resourceGraph;
        gfx::Buffer* dstBuffer = resg.getBuffer(dstID);
        CC_ENSURES(dstBuffer);
        if (!dstBuffer) {
            return;
        }
        ctx.cmdBuff->updateBuffer(dstBuffer, upload.source.data(), static_cast<uint32_t>(upload.source.size()));
    }
    void begin(const CopyPass& pass, RenderGraph::vertex_descriptor vertID) const {
        std::ignore = pass;
        std::ignore = vertID;
        auto& resg = ctx.resourceGraph;

        // currently, only texture to texture supported.
        for (const auto& copy : pass.copyPairs) {
            auto srcID = findVertex(copy.source, resg);
            auto dstID = findVertex(copy.target, resg);
            CC_ENSURES(srcID != RenderGraph::null_vertex());
            CC_ENSURES(dstID != RenderGraph::null_vertex());
            if (srcID == RenderGraph::null_vertex() || dstID == RenderGraph::null_vertex()) {
                continue;
            }
            const bool sourceIsTexture = resg.isTexture(srcID);
            const bool targetIsTexture = resg.isTexture(dstID);
            CC_ENSURES(sourceIsTexture == targetIsTexture);
            if (sourceIsTexture != targetIsTexture) {
                continue;
            }
            if (targetIsTexture) {
                copyTexture(copy, srcID, dstID);
            } else {
                copyBuffer(copy, srcID, dstID);
            }
        }
        // copy from cpu
        for (const auto& upload : pass.uploadPairs) {
            auto dstID = findVertex(upload.target, resg);
            CC_ENSURES(dstID != RenderGraph::null_vertex());
            if (dstID == RenderGraph::null_vertex()) {
                continue;
            }
            const bool targetIsTexture = resg.isTexture(dstID);
            if (targetIsTexture) {
                uploadTexture(upload, dstID);
            } else {
                uploadBuffer(upload, dstID);
            }
        }
    }
    void begin(const MovePass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        std::ignore = vertID;
        // if fully optimized, move pass should have been removed from graph
        // here we just do copy
        for (const auto& copy : pass.movePairs) {
        }
    }
    void begin(const RaytracePass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        std::ignore = vertID;
        // not implemented yet
        CC_EXPECTS(false);
    }
    void begin(const RenderQueue& queue, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
#if CC_DEBUG
        ctx.cmdBuff->beginMarker(makeMarkerInfo(get(RenderGraph::NameTag{}, ctx.g, vertID).c_str(), RENDER_QUEUE_COLOR));
#endif

        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& queues = ctx.ppl->custom.renderQueues;
            auto iter = queues.find(renderData.custom);
            if (iter != queues.end()) {
                iter->second->beginRenderQueue(ctx.customContext, vertID);
                return;
            }
        }
        if (queue.viewport.width != 0 && queue.viewport.height != 0) {
            ctx.cmdBuff->setViewport(queue.viewport);
        }

        // PerPhase DescriptorSet
        tryBindPerPhaseDescriptorSet(vertID);
    }
    void begin(const SceneData& sceneData, RenderGraph::vertex_descriptor sceneID) const { // NOLINT(readability-convert-member-functions-to-static)
        const auto* const camera = sceneData.camera;
        CC_EXPECTS(camera);
        if (camera) { // update camera data
            tryBindPerPassDescriptorSet(sceneID);
        }
        const auto* scene = camera->getScene();
        const auto& queueDesc = ctx.context.sceneCulling.renderQueueIndex.at(sceneID);
        const auto& queue = ctx.context.sceneCulling.renderQueues[queueDesc.renderQueueTarget.value];

        queue.recordCommands(ctx.cmdBuff, ctx.currentPass, 0);

        if (any(sceneData.flags & SceneFlags::REFLECTION_PROBE)) {
            queue.probeQueue.removeMacro();
        }
        if (any(sceneData.flags & SceneFlags::UI)) {
            submitUICommands(ctx.currentPass,
                             ctx.currentPassLayoutID, camera, ctx.cmdBuff);
        }
    }
    void begin(const Blit& blit, RenderGraph::vertex_descriptor vertID) const {
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& commands = ctx.ppl->custom.renderCommands;
            auto iter = commands.find(renderData.custom);
            if (iter != commands.end()) {
                iter->second->beginRenderCommand(ctx.customContext, vertID);
                return;
            }
        }

        const auto& programLib = *dynamic_cast<const NativeProgramLibrary*>(ctx.programLib);
        CC_EXPECTS(blit.material);
        CC_EXPECTS(blit.material->getPasses());
        if (blit.camera) {
            tryBindPerPassDescriptorSet(vertID);
        }
        // get pass
        auto& pass = *blit.material->getPasses()->at(static_cast<size_t>(blit.passID));
        // get shader
        auto& shader = *pass.getShaderVariant();
        // get pso
        auto* pso = pipeline::PipelineStateManager::getOrCreatePipelineState(
            &pass, &shader, ctx.context.fullscreenQuad.quadIA.get(), ctx.currentPass, ctx.subpassIndex);
        if (!pso) {
            return;
        }
        // auto* perInstanceSet = ctx.perInstanceDescriptorSets.at(vertID);
        // execution
        ctx.cmdBuff->bindPipelineState(pso);
        ctx.cmdBuff->bindDescriptorSet(
            static_cast<uint32_t>(pipeline::SetIndex::MATERIAL), pass.getDescriptorSet());
        // ctx.cmdBuff->bindDescriptorSet(
        //     static_cast<uint32_t>(pipeline::SetIndex::LOCAL), perInstanceSet);
        ctx.cmdBuff->bindInputAssembler(ctx.context.fullscreenQuad.quadIA.get());
        ctx.cmdBuff->draw(ctx.context.fullscreenQuad.quadIA.get());
    }
    void begin(const Dispatch& dispatch, RenderGraph::vertex_descriptor vertID) const {
        std::ignore = vertID;
        auto& programLib = *ctx.programLib;
        CC_EXPECTS(dispatch.material);
        CC_EXPECTS(dispatch.material->getPasses());
        // get pass
        auto& pass = *dispatch.material->getPasses()->at(static_cast<size_t>(dispatch.passID));
        // get shader
        auto& shader = *pass.getShaderVariant();
        // get pso
        auto* pso = programLib.getComputePipelineState(
            pass.getDevice(), pass.getPhaseID(), pass.getProgram(), pass.getDefines(), nullptr);
        CC_EXPECTS(pso);
        //        auto* perInstanceSet = ctx.perInstanceDescriptorSets.at(vertID);
        // execution
        ctx.cmdBuff->bindPipelineState(pso);
        ctx.cmdBuff->bindDescriptorSet(
            static_cast<uint32_t>(pipeline::SetIndex::MATERIAL), pass.getDescriptorSet());
        //        ctx.cmdBuff->bindDescriptorSet(
        //            static_cast<uint32_t>(pipeline::SetIndex::LOCAL), perInstanceSet);
        ctx.cmdBuff->dispatch(gfx::DispatchInfo{
            dispatch.threadGroupCountX,
            dispatch.threadGroupCountY,
            dispatch.threadGroupCountZ,
        });
    }
    void begin(const ccstd::pmr::vector<ClearView>& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void begin(const gfx::Viewport& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void end(const RasterPass& pass, RenderGraph::vertex_descriptor vertID) const {
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& passes = ctx.ppl->custom.renderPasses;
            auto iter = passes.find(renderData.custom);
            if (iter != passes.end()) {
                iter->second->endRenderPass(ctx.customContext, vertID);
                return;
            }
        }

        if (pass.showStatistics) {
            submitProfilerCommands(ctx, vertID, pass);
        }
        ctx.cmdBuff->endRenderPass();
        ctx.currentPass = nullptr;
        ctx.currentPassLayoutID = LayoutGraphData::null_vertex();
    }
    void end(const RasterSubpass& subpass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& subpasses = ctx.ppl->custom.renderSubpasses;
            auto iter = subpasses.find(renderData.custom);
            if (iter != subpasses.end()) {
                iter->second->endRenderSubpass(ctx.customContext, vertID);
                return;
            }
        }

        std::ignore = subpass;
        std::ignore = vertID;
        ctx.subpassIndex = 0;
        // noop
    }
    void end(const ComputeSubpass& subpass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& subpasses = ctx.ppl->custom.computeSubpasses;
            auto iter = subpasses.find(renderData.custom);
            if (iter != subpasses.end()) {
                iter->second->endComputeSubpass(ctx.customContext, vertID);
                return;
            }
        }

        std::ignore = subpass;
        std::ignore = vertID;
        // noop
    }
    void end(const ComputePass& pass, RenderGraph::vertex_descriptor vertID) const {
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& passes = ctx.ppl->custom.computePasses;
            auto iter = passes.find(renderData.custom);
            if (iter != passes.end()) {
                iter->second->endComputePass(ctx.customContext, vertID);
                return;
            }
        }
#if CC_DEBUG
        ctx.cmdBuff->endMarker();
#endif
        std::ignore = pass;
    }
    void end(const ResolvePass& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void end(const CopyPass& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void end(const MovePass& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void end(const RaytracePass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        std::ignore = vertID;
        // not implemented yet
        CC_EXPECTS(false);
    }
    void end(const RenderQueue& pass, RenderGraph::vertex_descriptor vertID) const {
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& queues = ctx.ppl->custom.renderQueues;
            auto iter = queues.find(renderData.custom);
            if (iter != queues.end()) {
                iter->second->endRenderQueue(ctx.customContext, vertID);
                return;
            }
        }
#if CC_DEBUG
        ctx.cmdBuff->endMarker();
#endif
        std::ignore = pass;
    }
    void end(const SceneData& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void end(const Blit& pass, RenderGraph::vertex_descriptor vertID) const {
        const auto& renderData = get(RenderGraph::DataTag{}, ctx.g, vertID);
        if (!renderData.custom.empty()) {
            const auto& commands = ctx.ppl->custom.renderCommands;
            auto iter = commands.find(renderData.custom);
            if (iter != commands.end()) {
                iter->second->endRenderCommand(ctx.customContext, vertID);
                return;
            }
        }
        std::ignore = pass;
    }
    void end(const Dispatch& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void end(const ccstd::pmr::vector<ClearView>& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void end(const gfx::Viewport& pass, RenderGraph::vertex_descriptor vertID) const {
    }

    void mountResource(const ccstd::pmr::string& name) const { // NOLINT(misc-no-recursion)
        auto resIter = ctx.fgd.resourceAccessGraph.resourceIndex.find(name);
        if (resIter != ctx.fgd.resourceAccessGraph.resourceIndex.end()) {
            auto resID = resIter->second;
            auto& resg = ctx.resourceGraph;
            resg.mount(ctx.device, resID);
            for (const auto& subres : makeRange(children(resID, resg))) {
                const auto& subresName = get(ResourceGraph::NameTag{}, resg, subres.target);
                mountResource(subresName);
            }
        }
    }

    void mountResources(const Subpass& pass) const {
        // mount managed resources
        for (const auto& [name, view] : pass.rasterViews) {
            mountResource(name);
        }
        for (const auto& [name, views] : pass.computeViews) {
            mountResource(name);
        }
        for (const auto& resolve : pass.resolvePairs) {
            mountResource(resolve.target);
        }
    }

    void mountResources(const RasterPass& pass) const {
        // mount managed resources
        for (const auto& [name, view] : pass.rasterViews) {
            mountResource(name);
        }
        for (const auto& [name, views] : pass.computeViews) {
            mountResource(name);
        }
        for (const auto& subpass : pass.subpassGraph.subpasses) {
            mountResources(subpass);
        }
    }

    void mountResources(const ComputePass& pass) const {
        auto& resg = ctx.resourceGraph;
        PmrFlatSet<ResourceGraph::vertex_descriptor> mounted(ctx.scratch);
        for (const auto& [name, views] : pass.computeViews) {
            mountResource(name);
        }
    }

    void mountResources(const ComputeSubpass& pass) const {
        auto& resg = ctx.resourceGraph;
        PmrFlatSet<ResourceGraph::vertex_descriptor> mounted(ctx.scratch);
        for (const auto& [name, views] : pass.computeViews) {
            mountResource(name);
        }
    }

    void mountResources(const RaytracePass& pass) const {
        auto& resg = ctx.resourceGraph;
        PmrFlatSet<ResourceGraph::vertex_descriptor> mounted(ctx.scratch);
        for (const auto& [name, views] : pass.computeViews) {
            mountResource(name);
        }
    }

    void mountResources(const ResolvePass& pass) const {
        auto& resg = ctx.resourceGraph;
        PmrFlatSet<ResourceGraph::vertex_descriptor> mounted(ctx.scratch);
        for (const auto& pair : pass.resolvePairs) {
            mountResource(pair.source);
            mountResource(pair.target);
        }
    }

    void mountResources(const CopyPass& pass) const {
        auto& resg = ctx.resourceGraph;
        PmrFlatSet<ResourceGraph::vertex_descriptor> mounted(ctx.scratch);
        for (const auto& pair : pass.copyPairs) {
            mountResource(pair.source);
            mountResource(pair.target);
        }
        for (const auto& pair : pass.uploadPairs) {
            mountResource(pair.target);
        }
    }

    void mountResources(const MovePass& pass) const {
        // not supported yet
    }

    void discover_vertex(
        RenderGraph::vertex_descriptor vertID,
        const boost::filtered_graph<AddressableView<RenderGraph>, boost::keep_all, RenderGraphFilter>& gv) const {
        std::ignore = gv;

        visitObject(
            vertID, ctx.g,
            [&](const RasterPass& pass) {
#if CC_DEBUG
                ctx.cmdBuff->beginMarker(makeMarkerInfo(get(RenderGraph::NameTag{}, ctx.g, vertID).c_str(), RASTER_COLOR));
#endif
                mountResources(pass);
                {
                    const auto& layoutName = get(RenderGraph::LayoutTag{}, ctx.g, vertID);
                    const auto& layoutID = locate(LayoutGraphData::null_vertex(), layoutName, ctx.lg);
                    ctx.currentPassLayoutID = layoutID;
                }
                // update UniformBuffers and DescriptorSets in all children
                {
#if CC_DEBUG
                    ctx.cmdBuff->beginMarker(makeMarkerInfo("Upload", RASTER_UPLOAD_COLOR));
#endif
                    auto colors = ctx.g.colors(ctx.scratch);
                    RenderGraphUploadVisitor visitor{{}, ctx};
                    boost::depth_first_visit(gv, vertID, visitor, get(colors, ctx.g));
#if CC_DEBUG
                    ctx.cmdBuff->endMarker();
#endif
                }
                if (pass.showStatistics) {
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
                            ctx.profilerPerPassDescriptorSets[vertID] = perPassSet;
                        } else {
                            CC_EXPECTS(false);
                            // TODO(zhouzhenglong): set descriptor set to empty
                        }
                    }
                }

                // execute render pass
                frontBarriers(vertID);
                begin(pass, vertID);
            },
            [&](const RasterSubpass& subpass) {
                // mountResources(subpass);
                {
                    const auto& layoutName = get(RenderGraph::LayoutTag{}, ctx.g, vertID);
                    const auto& layoutID = locate(LayoutGraphData::null_vertex(), layoutName, ctx.lg);
                    ctx.currentPassLayoutID = layoutID;
                }
                begin(subpass, vertID);
            },
            [&](const ComputeSubpass& subpass) {
                // mountResources(subpass);
                {
                    const auto& layoutName = get(RenderGraph::LayoutTag{}, ctx.g, vertID);
                    const auto& layoutID = locate(LayoutGraphData::null_vertex(), layoutName, ctx.lg);
                    ctx.currentPassLayoutID = layoutID;
                }
                begin(subpass, vertID);
            },
            [&](const ComputePass& pass) {
                mountResources(pass);

                {
                    const auto& layoutName = get(RenderGraph::LayoutTag{}, ctx.g, vertID);
                    const auto& layoutID = locate(LayoutGraphData::null_vertex(), layoutName, ctx.lg);
                    ctx.currentPassLayoutID = layoutID;
                }
                {
                    auto colors = ctx.g.colors(ctx.scratch);
                    RenderGraphUploadVisitor visitor{{}, ctx};
                    boost::depth_first_visit(gv, vertID, visitor, get(colors, ctx.g));
                }

                frontBarriers(vertID);
                begin(pass, vertID);
            },
            [&](const ResolvePass& pass) {
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass, vertID);
            },
            [&](const CopyPass& pass) {
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass, vertID);
            },
            [&](const MovePass& pass) {
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass, vertID);
            },
            [&](const RaytracePass& pass) {
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass, vertID);
            },
            [&](const auto& queue) {
                begin(queue, vertID);
            });
    }

    void finish_vertex(
        RenderGraph::vertex_descriptor vertID,
        const boost::filtered_graph<AddressableView<RenderGraph>, boost::keep_all, RenderGraphFilter>& gv) const {
        std::ignore = gv;
        visitObject(
            vertID, ctx.g,
            [&](const RasterPass& pass) {
                end(pass, vertID);
                rearBarriers(vertID);
#if CC_DEBUG
                ctx.cmdBuff->endMarker();
#endif
            },
            [&](const RasterSubpass& subpass) {
                end(subpass, vertID);
            },
            [&](const ComputeSubpass& subpass) {
                end(subpass, vertID);
            },
            [&](const ComputePass& pass) {
                end(pass, vertID);
                rearBarriers(vertID);
            },
            [&](const ResolvePass& pass) {
                end(pass, vertID);
                rearBarriers(vertID);
            },
            [&](const CopyPass& pass) {
                end(pass, vertID);
                rearBarriers(vertID);
            },
            [&](const MovePass& pass) {
                end(pass, vertID);
                rearBarriers(vertID);
            },
            [&](const RaytracePass& pass) {
                end(pass, vertID);
                rearBarriers(vertID);
            },
            [&](const auto& queue) {
                end(queue, vertID);
            });
    }

    RenderGraphVisitorContext& ctx;
};

struct RenderGraphCullVisitor : boost::dfs_visitor<> {
    void discover_vertex(
        // NOLINTNEXTLINE(misc-unused-parameters)
        RenderGraph::vertex_descriptor vertID, const AddressableView<RenderGraph>& gv) const {
        validPasses[vertID] = false;
    }
    ccstd::pmr::vector<bool>& validPasses;
};

struct ResourceCleaner {
    explicit ResourceCleaner(ResourceGraph& resourceGraphIn) noexcept
    : resourceGraph(resourceGraphIn),
      prevFenceValue(resourceGraph.nextFenceValue) {
        ++resourceGraph.nextFenceValue;
    }
    ResourceCleaner(const ResourceCleaner&) = delete;
    ResourceCleaner& operator=(const ResourceCleaner&) = delete;
    ~ResourceCleaner() noexcept {
        resourceGraph.unmount(prevFenceValue);
    }

    ResourceGraph& resourceGraph;
    uint64_t prevFenceValue = 0;
};

struct RenderGraphContextCleaner {
    explicit RenderGraphContextCleaner(NativeRenderContext& contextIn) noexcept
    : context(contextIn),
      prevFenceValue(context.nextFenceValue) {
        ++context.nextFenceValue;
        context.clearPreviousResources(prevFenceValue);
        context.renderSceneResources.clear();
        context.sceneCulling.clear();
    }
    RenderGraphContextCleaner(const RenderGraphContextCleaner&) = delete;
    RenderGraphContextCleaner& operator=(const RenderGraphContextCleaner&) = delete;
    ~RenderGraphContextCleaner() noexcept = default;
    NativeRenderContext& context;
    uint64_t prevFenceValue = 0;
};

struct CommandSubmitter {
    CommandSubmitter(gfx::Device* deviceIn, const std::vector<gfx::CommandBuffer*>& cmdBuffersIn)
    : device(deviceIn), cmdBuffers(cmdBuffersIn) {
        CC_EXPECTS(cmdBuffers.size() == 1);
        primaryCommandBuffer = cmdBuffers.at(0);
        primaryCommandBuffer->begin();
    }
    CommandSubmitter(const CommandSubmitter&) = delete;
    CommandSubmitter& operator=(const CommandSubmitter&) = delete;
    ~CommandSubmitter() noexcept {
        primaryCommandBuffer->end();
        device->flushCommands(cmdBuffers);
        device->getQueue()->submit(cmdBuffers);
    }
    gfx::Device* device = nullptr;
    const std::vector<gfx::CommandBuffer*>& cmdBuffers;
    gfx::CommandBuffer* primaryCommandBuffer = nullptr;
};

void extendResourceLifetime(const NativeRenderQueue& queue, ResourceGroup& group) {
    // keep instanceBuffers
    for (const auto& batch : queue.opaqueInstancingQueue.sortedBatches) {
        group.instancingBuffers.emplace(batch);
    }
    for (const auto& batch : queue.transparentInstancingQueue.sortedBatches) {
        group.instancingBuffers.emplace(batch);
    }
}

void collectStatistics(const NativePipeline& ppl, PipelineStatistics& stats) {
    // resources
    stats.numRenderPasses = static_cast<uint32_t>(ppl.resourceGraph.renderPasses.size());
    stats.totalManagedTextures = static_cast<uint32_t>(ppl.resourceGraph.managedTextures.size());
    stats.numManagedTextures = 0;
    for (const auto& tex : ppl.resourceGraph.managedTextures) {
        if (tex.texture) {
            ++stats.numManagedTextures;
        }
    }
    // layout graph
    stats.numUploadBuffers = 0;
    stats.numUploadBufferViews = 0;
    stats.numFreeUploadBuffers = 0;
    stats.numFreeUploadBufferViews = 0;
    stats.numDescriptorSets = 0;
    stats.numFreeDescriptorSets = 0;
    for (const auto& node : ppl.nativeContext.layoutGraphResources) {
        for (const auto& [nameID, buffer] : node.uniformBuffers) {
            stats.numUploadBuffers += static_cast<uint32_t>(buffer.bufferPool.currentBuffers.size());
            stats.numUploadBufferViews += static_cast<uint32_t>(buffer.bufferPool.currentBufferViews.size());
            stats.numFreeUploadBuffers += static_cast<uint32_t>(buffer.bufferPool.freeBuffers.size());
            stats.numFreeUploadBufferViews += static_cast<uint32_t>(buffer.bufferPool.freeBufferViews.size());
        }
        stats.numDescriptorSets += static_cast<uint32_t>(node.descriptorSetPool.currentDescriptorSets.size());
        stats.numFreeDescriptorSets += static_cast<uint32_t>(node.descriptorSetPool.freeDescriptorSets.size());
    }
    // scene
    stats.numInstancingBuffers = 0;
    stats.numInstancingUniformBlocks = 0;
    for (const auto& [key, group] : ppl.nativeContext.resourceGroups) {
        stats.numInstancingBuffers += group.instancingBuffers.size();
        for (const auto& buffer : group.instancingBuffers) {
            stats.numInstancingUniformBlocks += static_cast<uint32_t>(buffer->getInstances().size());
        }
    }
}

} // namespace

void NativePipeline::executeRenderGraph(const RenderGraph& rg) {
    auto& ppl = *this;
    auto* scratch = &ppl.unsyncPool;

    ppl.resourceGraph.validateSwapchains();

    RenderGraphContextCleaner contextCleaner(ppl.nativeContext);
    ResourceCleaner cleaner(ppl.resourceGraph);

    auto& lg = ppl.programLibrary->layoutGraph;
    FrameGraphDispatcher fgd(
        ppl.resourceGraph, rg,
        lg, &ppl.unsyncPool, scratch);
    fgd.enableMemoryAliasing(false);
    fgd.enablePassReorder(false);
    fgd.setParalellWeight(0);
    fgd.run();

    AddressableView<RenderGraph> graphView(rg);
    ccstd::pmr::vector<bool> validPasses(num_vertices(rg), true, scratch);
    auto colors = rg.colors(scratch);
    { // Mark all culled vertices
        RenderGraphCullVisitor visitor{{}, validPasses};
        for (const auto& vertID : fgd.resourceAccessGraph.culledPasses) {
            const auto nodeID = get(ResourceAccessGraph::PassIDTag{}, fgd.resourceAccessGraph, vertID);
            if (nodeID == RenderGraph::null_vertex()) {
                continue;
            }
            const auto passID = fgd.resourceAccessGraph.passIndex.at(nodeID);
            boost::depth_first_visit(graphView, passID, visitor, get(colors, rg));
        }
        colors.clear();
        colors.resize(num_vertices(rg), boost::white_color);
    }

    // scene culling
    {
        auto& context = ppl.nativeContext;
        auto& sceneCulling = context.sceneCulling;
        sceneCulling.buildRenderQueues(rg, lg, ppl);
        auto& group = ppl.nativeContext.resourceGroups[context.nextFenceValue];
        // notice: we cannot use ranged-for of sceneCulling.renderQueues
        CC_EXPECTS(sceneCulling.numRenderQueues <= sceneCulling.renderQueues.size());
        for (uint32_t queueID = 0; queueID != sceneCulling.numRenderQueues; ++queueID) {
            const auto& queue = sceneCulling.renderQueues[queueID];
            extendResourceLifetime(queue, group);
        }
    }

    // light manangement
    {
        auto& ctx = ppl.nativeContext;
        ctx.lightResources.clear();
        ctx.lightResources.buildLights(
            ctx.sceneCulling,
            ppl.pipelineSceneData->isHDR(),
            ppl.pipelineSceneData->getShadows());
    }

    // gpu driven
    if constexpr (ENABLE_GPU_DRIVEN) {
        // TODO(jilin): consider populating renderSceneResources here
        const scene::RenderScene* const ptr = nullptr;
        auto& sceneResource = ppl.nativeContext.renderSceneResources[ptr];
        const auto& nameID = lg.attributeIndex.find("cc_xxxDescriptor")->second;
        sceneResource.resourceIndex.emplace(nameID, ResourceType::STORAGE_BUFFER);
        sceneResource.storageBuffers.emplace(nameID, nullptr);
    }

    // Execute all valid passes
    {
        boost::filtered_graph<
            AddressableView<RenderGraph>,
            boost::keep_all, RenderGraphFilter>
            fg(graphView, boost::keep_all{}, RenderGraphFilter{&validPasses});

        CommandSubmitter submit(ppl.device, ppl.getCommandBuffers());

        // upload buffers
        {
            auto& ctx = ppl.nativeContext;
#if CC_DEBUG
            submit.primaryCommandBuffer->beginMarker(makeMarkerInfo("Internal Upload", RASTER_UPLOAD_COLOR));
#endif
            // scene
            const auto& sceneCulling = ppl.nativeContext.sceneCulling;
            for (uint32_t queueID = 0; queueID != sceneCulling.numRenderQueues; ++queueID) {
                // notice: we cannot use ranged-for of sceneCulling.renderQueues
                CC_EXPECTS(sceneCulling.numRenderQueues <= sceneCulling.renderQueues.size());
                const auto& queue = sceneCulling.renderQueues[queueID];
                queue.opaqueInstancingQueue.uploadBuffers(submit.primaryCommandBuffer);
                queue.transparentInstancingQueue.uploadBuffers(submit.primaryCommandBuffer);
            }

            // lights
            ctx.lightResources.buildLightBuffer(submit.primaryCommandBuffer);
            ctx.lightResources.tryUpdateRenderSceneLocalDescriptorSet(sceneCulling);
#if CC_DEBUG
            submit.primaryCommandBuffer->endMarker();
#endif
        }

        ccstd::pmr::unordered_map<
            RenderGraph::vertex_descriptor,
            gfx::DescriptorSet*>
            renderGraphDescriptorSet(scratch);

        ccstd::pmr::unordered_map<
            RenderGraph::vertex_descriptor,
            gfx::DescriptorSet*>
            profilerPerPassDescriptorSets(scratch);

        ccstd::pmr::unordered_map<
            RenderGraph::vertex_descriptor,
            gfx::DescriptorSet*>
            perInstanceDescriptorSets(scratch);

        // submit commands
        RenderGraphVisitorContext ctx{
            ppl.nativeContext,
            lg, rg, ppl.resourceGraph,
            fgd,
            validPasses,
            ppl.device, submit.primaryCommandBuffer,
            &ppl,
            renderGraphDescriptorSet,
            profilerPerPassDescriptorSets,
            perInstanceDescriptorSets,
            programLibrary,
            CustomRenderGraphContext{
                custom.currentContext,
                &rg,
                &ppl.resourceGraph,
                submit.primaryCommandBuffer,
            },
            scratch};

        RenderGraphVisitor visitor{{}, ctx};
        auto colors = rg.colors(scratch);
        for (const auto vertID : ctx.g.sortedVertices) {
            if (holds<RasterPassTag>(vertID, ctx.g) || holds<ComputeTag>(vertID, ctx.g) || holds<CopyTag>(vertID, ctx.g)) {
                boost::depth_first_visit(fg, vertID, visitor, get(colors, ctx.g));
            }
        }
    }

    // collect statistics
    collectStatistics(*this, statistics);
}

} // namespace render

} // namespace cc
