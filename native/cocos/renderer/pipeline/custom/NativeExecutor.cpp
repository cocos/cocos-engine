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
#include "NativePipelineFwd.h"
#include "NativePipelineTypes.h"
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
    const FrameGraphDispatcher::BarrierMap& barrierMap;
    const ccstd::pmr::vector<bool>& validPasses;
    gfx::Device* device = nullptr;
    cc::gfx::CommandBuffer* cmdBuff = nullptr;
    ccstd::pmr::unordered_map<
        const scene::RenderScene*,
        ccstd::pmr::unordered_map<scene::Camera*, NativeRenderQueue>>& sceneQueues;
    PipelineRuntime* ppl = nullptr;
    ProgramLibrary* programLib = nullptr;
    boost::container::pmr::memory_resource* scratch = nullptr;
    gfx::RenderPass* currentPass = nullptr;
    LayoutGraphData::vertex_descriptor currentPassLayoutID = LayoutGraphData::null_vertex();
};

void clear(gfx::RenderPassInfo& info) {
    info.colorAttachments.clear();
    info.depthStencilAttachment = {};
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

PersistentRenderPassAndFramebuffer createPersistentRenderPassAndFramebuffer(
    RenderGraphVisitorContext& ctx, const RasterPass& pass) {
    auto& resg = ctx.resourceGraph;

    PersistentRenderPassAndFramebuffer data(pass.get_allocator());
    gfx::RenderPassInfo rpInfo{};

    gfx::FramebufferInfo fbInfo{
        data.renderPass,
    };
    fbInfo.colorTextures.reserve(pass.rasterViews.size());

    if (pass.subpassGraph.subpasses.empty()) {
        const auto numInputs = getRasterPassInputCount(pass);
        const auto numColors = getRasterPassOutputCount(pass);

        // persistent cache
        data.clearColors.reserve(numColors);

        // render pass
        rpInfo.colorAttachments.reserve(numColors);

        auto& subpass = rpInfo.subpasses.emplace_back();
        subpass.inputs.reserve(numInputs);
        subpass.colors.reserve(numColors);
        subpass.resolves.reserve(getRasterPassResolveCount(pass));
        subpass.preserves.reserve(getRasterPassPreserveCount(pass));
        auto numTotalAttachments = static_cast<uint32_t>(pass.rasterViews.size());
        uint32_t dsvCount = 0;
        for (const auto& pair : pass.rasterViews) {
            const auto& name = pair.first;
            const auto& view = pair.second;
            const auto resID = vertex(name, ctx.resourceGraph);
            const auto& desc = get(ResourceGraph::DescTag{}, ctx.resourceGraph, resID);

            if (view.attachmentType == AttachmentType::RENDER_TARGET) { // RenderTarget
                auto slot = static_cast<uint32_t>(rpInfo.colorAttachments.size());
                auto& rtv = rpInfo.colorAttachments.emplace_back(
                    gfx::ColorAttachment{
                        desc.format,
                        desc.sampleCount,
                        view.loadOp,
                        view.storeOp,
                        nullptr,
                        hasFlag(desc.textureFlags, gfx::TextureFlags::GENERAL_LAYOUT),
                    });
                if (view.accessType != AccessType::WRITE) { // Input
                    auto inputSlot = getRasterViewPassInputSlot(view);
                    subpass.inputs.emplace_back(slot);
                }
                if (view.accessType != AccessType::READ) { // Output
                    subpass.colors.emplace_back(slot);
                }
                data.clearColors.emplace_back(view.clearColor);

                auto resID = findVertex(name, resg);
                visitObject(
                    resID, resg,
                    [&](const ManagedResource& res) {
                        std::ignore = res;
                        CC_EXPECTS(false);
                    },
                    [&](const ManagedBuffer& res) {
                        std::ignore = res;
                        CC_EXPECTS(false);
                    },
                    [&](const ManagedTexture& tex) {
                        CC_EXPECTS(tex.texture);
                        fbInfo.colorTextures.emplace_back(tex.texture);
                    },
                    [&](const IntrusivePtr<gfx::Buffer>& res) {
                        std::ignore = res;
                        CC_EXPECTS(false);
                    },
                    [&](const IntrusivePtr<gfx::Texture>& tex) {
                        fbInfo.colorTextures.emplace_back(tex);
                    },
                    [&](const IntrusivePtr<gfx::Framebuffer>& fb) {
                        CC_EXPECTS(false);
                        data.framebuffer = fb;
                    },
                    [&](const RenderSwapchain& sc) {
                        fbInfo.colorTextures.emplace_back(sc.swapchain->getColorTexture());
                    });
                CC_ENSURES(rpInfo.colorAttachments.size() == subpass.colors.size());
                CC_ENSURES(rpInfo.colorAttachments.size() == data.clearColors.size());
                CC_ENSURES(rpInfo.colorAttachments.size() == fbInfo.colorTextures.size());
            } else { // DepthStencil
                auto& dsv = rpInfo.depthStencilAttachment;
                CC_EXPECTS(desc.format != gfx::Format::UNKNOWN);
                dsv.format = desc.format;
                dsv.sampleCount = desc.sampleCount;
                dsv.depthLoadOp = view.loadOp;
                dsv.depthStoreOp = view.storeOp;
                dsv.stencilLoadOp = view.loadOp;
                dsv.stencilStoreOp = view.storeOp;
                dsv.barrier = nullptr;
                dsv.isGeneralLayout = hasFlag(desc.textureFlags, gfx::TextureFlags::GENERAL_LAYOUT);

                CC_EXPECTS(numTotalAttachments > 0);
                subpass.depthStencil = numTotalAttachments - 1;

                data.clearDepth = view.clearColor.x;
                data.clearStencil = static_cast<uint8_t>(view.clearColor.y);

                auto resID = findVertex(name, resg);
                visitObject(
                    resID, resg,
                    [&](const ManagedTexture& tex) {
                        CC_EXPECTS(tex.texture);
                        CC_EXPECTS(!fbInfo.depthStencilTexture);
                        fbInfo.depthStencilTexture = tex.texture.get();
                    },
                    [&](const IntrusivePtr<gfx::Texture>& tex) {
                        CC_EXPECTS(!fbInfo.depthStencilTexture);
                        fbInfo.depthStencilTexture = tex.get();
                    },
                    [](const auto& /*unused*/) {
                        CC_EXPECTS(false);
                    });
            }
        }
    } else {
        CC_EXPECTS(false);
    }

    data.renderPass = ctx.device->createRenderPass(rpInfo);
    fbInfo.renderPass = data.renderPass;
    data.framebuffer = ctx.device->createFramebuffer(fbInfo);
    data.hash = gfx::Framebuffer::computeHash(fbInfo);

    return data;
}

PersistentRenderPassAndFramebuffer& fetchOrCreateFramebuffer(RenderGraphVisitorContext& ctx, const RasterPass& pass) {
    auto iter = ctx.context.renderPasses.find(pass);
    if (iter == ctx.context.renderPasses.end()) {
        bool added = false;
        std::tie(iter, added) = ctx.context.renderPasses.emplace(
            pass, createPersistentRenderPassAndFramebuffer(ctx, pass));
        CC_ENSURES(added);
        return iter->second;
    }

    gfx::FramebufferInfo fbInfo{};
    fbInfo.renderPass = iter->second.renderPass;
    fbInfo.colorTextures = iter->second.framebuffer->getColorTextures();
    fbInfo.depthStencilTexture = iter->second.framebuffer->getDepthStencilTexture();
    auto hash = gfx::Framebuffer::computeHash(fbInfo);
    if (iter->second.hash != hash) {
        iter->second.framebuffer = ctx.device->createFramebuffer(fbInfo);
        iter->second.hash = hash;
    }
    return iter->second;
}

gfx::BufferBarrierInfo getBufferBarrier(const cc::render::Barrier& barrier) {
    gfx::MemoryUsage memUsage = gfx::MemoryUsage::DEVICE;

    const auto& beginUsage = get<gfx::BufferUsage>(barrier.beginStatus.usage);
    const auto& endUsage = get<gfx::BufferUsage>(barrier.endStatus.usage);

    const auto& bufferRange = get<BufferRange>(barrier.beginStatus.range);
    CC_EXPECTS(bufferRange.size);

    return {
        gfx::getAccessFlags(
            beginUsage, memUsage,
            barrier.beginStatus.access,
            barrier.beginStatus.visibility),
        gfx::getAccessFlags(
            endUsage, memUsage,
            barrier.endStatus.access,
            barrier.endStatus.visibility),
        barrier.type,
        bufferRange.offset, bufferRange.size};
}

std::pair<gfx::TextureBarrierInfo, gfx::Texture*> getTextureBarrier(
    ResourceGraph& resg, ResourceGraph::vertex_descriptor resID,
    const cc::render::Barrier& barrier) {
    gfx::Texture* texture = nullptr;
    visitObject(
        resID, resg,
        [&](const ManagedTexture& res) {
            texture = res.texture.get();
        },
        [&](const IntrusivePtr<gfx::Texture>& tex) {
            texture = tex.get();
        },
        [&](const IntrusivePtr<gfx::Framebuffer>& fb) {
            std::ignore = fb;
            CC_EXPECTS(false);
        },
        [&](const RenderSwapchain& sc) {
            texture = sc.swapchain->getColorTexture();
        },
        [&](const auto& buffer) {
            std::ignore = buffer;
            CC_EXPECTS(false);
        });
    CC_ENSURES(texture);

    const auto& desc = get(ResourceGraph::DescTag{}, resg, resID);

    const bool isExternal = barrier.endStatus.vertID == ResourceAccessGraph::null_vertex();

    const auto barrierType = isExternal ? gfx::BarrierType::FULL : barrier.type;
    const auto beginUsage = get<gfx::TextureUsage>(barrier.beginStatus.usage);
    const auto endUsage = [&]() {
        if (!isExternal) {
            return get<gfx::TextureUsage>(barrier.endStatus.usage);
        }
        return gfx::TextureUsage::NONE;
    }();

    auto beginAccesFlags = gfx::getAccessFlags(
        beginUsage,
        barrier.beginStatus.access,
        barrier.beginStatus.visibility);

    auto endAccessFlags = [&]() {
        if (!isExternal) {
            return gfx::getAccessFlags(
                endUsage,
                barrier.endStatus.access,
                barrier.endStatus.visibility);
        }
        auto& states = get(ResourceGraph::States, resg, resID);
        if (holds<SwapchainTag>(resID, resg)) {
            states.states = gfx::AccessFlagBit::PRESENT;
            return states.states;
        }
        states.states =
            gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE |
            gfx::AccessFlagBit::VERTEX_SHADER_READ_TEXTURE |
            gfx::AccessFlagBit::COMPUTE_SHADER_READ_TEXTURE;

        return states.states;
    }();

    CC_ENSURES(beginAccesFlags != gfx::INVALID_ACCESS_FLAGS);
    CC_ENSURES(endAccessFlags != gfx::INVALID_ACCESS_FLAGS);

    const auto& textureRange = get<TextureRange>(barrier.beginStatus.range);
    CC_EXPECTS(textureRange.levelCount);
    CC_EXPECTS(textureRange.numSlices);

    return {
        gfx::TextureBarrierInfo{
            beginAccesFlags,
            endAccessFlags,
            barrierType,
            textureRange.mipLevel,
            textureRange.levelCount,
            textureRange.firstSlice,
            textureRange.numSlices,
            0,
            nullptr,
            nullptr},
        texture};
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
            bindGlobalDesc(descriptorSet, bindId, value.get());
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
    UniformBlockResource& resource) {
    auto* buffer = resource.bufferPool.allocateBuffer();
    CC_ENSURES(buffer);
    buffer->update(resource.cpuBuffer.data(),
                   static_cast<uint32_t>(resource.cpuBuffer.size()));

    CC_EXPECTS(passSet);
    passSet->bindBuffer(bindID, buffer);
}

void initPerPassDescriptorSet(
    gfx::Device* device,
    cc::gfx::CommandBuffer* cmdBuff,
    const gfx::DefaultResource& defaultResource,
    const LayoutGraphData& lg,
    const DescriptorSetData& set,
    const RenderData& user,
    LayoutGraphNodeResource& node) {
    // update per pass resources
    const auto& data = set.descriptorSetLayoutData;

    gfx::DescriptorSet* passSet = node.descriptorSetPool.allocateDescriptorSet();
    for (const auto& block : data.descriptorBlocks) {
        CC_EXPECTS(block.descriptors.size() == block.capacity);
        auto bindID = block.offset;
        switch (block.type) {
            case DescriptorTypeOrder::UNIFORM_BUFFER: {
                for (const auto& d : block.descriptors) {
                    // get uniform block
                    const auto& uniformBlock = data.uniformBlocks.at(d.descriptorID);

                    auto& resource = node.uniformBuffers.at(d.descriptorID);
                    updateCpuUniformBuffer(lg, user, uniformBlock, true, resource.cpuBuffer);
                    CC_ENSURES(resource.bufferPool.bufferSize == resource.cpuBuffer.size());

                    // upload gfx buffer
                    uploadUniformBuffer(passSet, bindID, resource);

                    // increase slot
                    // TODO(zhouzhenglong): here binding will be refactored in the future
                    // current implementation is incorrect, and we assume d.count == 1
                    CC_EXPECTS(d.count == 1);
                    bindID += d.count;
                }
                break;
            }
            case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::SAMPLER_TEXTURE: {
                CC_EXPECTS(passSet);
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    CC_EXPECTS(d.type >= gfx::Type::SAMPLER1D &&
                               d.type <= gfx::Type::SAMPLER_CUBE);
                    auto iter = user.textures.find(d.descriptorID.value);
                    if (iter != user.textures.end()) {
                        passSet->bindTexture(bindID, iter->second.get());
                    } else {
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
                        passSet->bindTexture(bindID, defaultResource.getTexture(type));
                    }
                    bindID += d.count;
                }
                break;
            }
            case DescriptorTypeOrder::SAMPLER:
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    auto iter = user.samplers.find(d.descriptorID.value);
                    if (iter != user.samplers.end()) {
                        passSet->bindSampler(bindID, iter->second.get());
                    } else {
                        gfx::SamplerInfo info{};
                        auto* sampler = device->getSampler(info);
                        passSet->bindSampler(bindID, sampler);
                    }
                    bindID += d.count;
                }
                break;
            case DescriptorTypeOrder::TEXTURE:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::STORAGE_BUFFER:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::STORAGE_IMAGE:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::INPUT_ATTACHMENT:
                // not supported yet
                CC_EXPECTS(false);
                break;
            default:
                CC_EXPECTS(false);
                break;
        }
    }
    passSet->update();
    cmdBuff->bindDescriptorSet(static_cast<uint32_t>(pipeline::SetIndex::GLOBAL), passSet);
}

void updatePerPassDescriptorSet(
    cc::gfx::CommandBuffer* cmdBuff,
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
            case DescriptorTypeOrder::UNIFORM_BUFFER: {
                for (const auto& d : block.descriptors) {
                    // get uniform block
                    const auto& uniformBlock = data.uniformBlocks.at(d.descriptorID);

                    auto& resource = node.uniformBuffers.at(d.descriptorID);
                    updateCpuUniformBuffer(lg, user, uniformBlock, false, resource.cpuBuffer);

                    // upload gfx buffer
                    uploadUniformBuffer(newSet, bindID, resource);

                    // increase slot
                    // TODO(zhouzhenglong): here binding will be refactored in the future
                    // current implementation is incorrect, and we assume d.count == 1
                    CC_EXPECTS(d.count == 1);
                    bindID += d.count;
                }
                break;
            }
            case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::SAMPLER_TEXTURE: {
                CC_EXPECTS(newSet);
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    CC_EXPECTS(d.type >= gfx::Type::SAMPLER1D &&
                               d.type <= gfx::Type::SAMPLER_CUBE);
                    auto iter = user.textures.find(d.descriptorID.value);
                    if (iter != user.textures.end()) {
                        newSet->bindTexture(bindID, iter->second.get());
                    } else {
                        auto* prevTexture = prevSet.getTexture(bindID);
                        CC_ENSURES(prevTexture);
                        newSet->bindTexture(bindID, prevTexture);
                    }
                    bindID += d.count;
                }
                break;
            }
            case DescriptorTypeOrder::SAMPLER:
                for (const auto& d : block.descriptors) {
                    CC_EXPECTS(d.count == 1);
                    auto iter = user.samplers.find(d.descriptorID.value);
                    if (iter != user.samplers.end()) {
                        newSet->bindSampler(bindID, iter->second.get());
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
            case DescriptorTypeOrder::STORAGE_BUFFER:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::STORAGE_IMAGE:
                // not supported yet
                CC_EXPECTS(false);
                break;
            case DescriptorTypeOrder::INPUT_ATTACHMENT:
                // not supported yet
                CC_EXPECTS(false);
                break;
            default:
                CC_EXPECTS(false);
                break;
        }
    }
    newSet->update();
    cmdBuff->bindDescriptorSet(static_cast<uint32_t>(pipeline::SetIndex::GLOBAL), newSet);
}

void updateCameraUniformBufferAndDescriptorSet(
    RenderGraphVisitorContext& ctx, RenderGraph::vertex_descriptor sceneID) {
    // update states
    CC_EXPECTS(ctx.currentPassLayoutID != LayoutGraphData::null_vertex());
    const auto& passLayoutID = ctx.currentPassLayoutID;
    auto& layout = get(LayoutGraphData::Layout, ctx.lg, passLayoutID);
    auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PASS);
    if (iter != layout.descriptorSets.end()) {
        auto& set = iter->second;
        auto& node = ctx.context.layoutGraphResources.at(passLayoutID);
        const auto& user = get(RenderGraph::Data, ctx.g, sceneID); // notice: sceneID
        updatePerPassDescriptorSet(ctx.cmdBuff, ctx.lg, set, user, node);
    }
}

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
                    const auto* bufferBarrier = static_cast<gfx::BufferBarrier*>(barrier.barrier);
                    buffers.emplace_back(nullptr);
                    bufferBarriers.emplace_back(bufferBarrier);
                    break;
                }
                case ResourceDimension::TEXTURE1D:
                case ResourceDimension::TEXTURE2D:
                case ResourceDimension::TEXTURE3D:
                default: {
                    auto [info, texture] = getTextureBarrier(resg, resID, barrier);
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
        auto iter = ctx.fgd.resourceAccessGraph.passIndex.find(vertID);
        if (iter == ctx.fgd.resourceAccessGraph.passIndex.end()) {
            return;
        }
        const auto& nodeID = iter->second;
        auto iter2 = ctx.barrierMap.find(nodeID);
        if (iter2 != ctx.barrierMap.end()) {
            submitBarriers(iter2->second.blockBarrier.frontBarriers);
        }
    }
    void rearBarriers(RenderGraph::vertex_descriptor vertID) const {
        auto iter = ctx.fgd.resourceAccessGraph.passIndex.find(vertID);
        if (iter == ctx.fgd.resourceAccessGraph.passIndex.end()) {
            return;
        }
        const auto& nodeID = iter->second;
        auto iter2 = ctx.barrierMap.find(nodeID);
        if (iter2 != ctx.barrierMap.end()) {
            submitBarriers(iter2->second.blockBarrier.rearBarriers);
        }
    }
    void begin(const RasterPass& pass, RenderGraph::vertex_descriptor vertID) const {
        // viewport
        auto vp = pass.viewport;
        if (vp.width == 0 && vp.height == 0) {
            vp.width = pass.width;
            vp.height = pass.height;
        }
        // scissor
        gfx::Rect scissor{0, 0, vp.width, vp.height};

        // render pass
        const auto& layoutName = get(RenderGraph::Layout, ctx.g, vertID);
        const auto& layoutID = locate(LayoutGraphData::null_vertex(), layoutName, ctx.lg);
        {
            auto& res = fetchOrCreateFramebuffer(ctx, pass);
            ++res.refCount;
            const auto& data = res;
            auto* cmdBuff = ctx.cmdBuff;

            cmdBuff->beginRenderPass(
                data.renderPass.get(),
                data.framebuffer.get(),
                scissor, data.clearColors.data(),
                data.clearDepth, data.clearStencil);

            ctx.currentPass = data.renderPass.get();
            ctx.currentPassLayoutID = layoutID;
        }

        // update states
        auto& layout = get(LayoutGraphData::Layout, ctx.lg, layoutID);
        auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PASS);
        if (iter == layout.descriptorSets.end()) {
            return;
        }
        auto& set = iter->second;
        const auto& user = get(RenderGraph::Data, ctx.g, vertID);
        auto& node = ctx.context.layoutGraphResources.at(layoutID);
        initPerPassDescriptorSet(
            ctx.device, ctx.cmdBuff,
            *ctx.context.defaultResource, ctx.lg,
            set, user, node);
    }
    void begin(const ComputePass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        std::ignore = vertID;
        for (const auto& [name, views] : pass.computeViews) {
            for (const auto& view : views) {
                if (view.clearFlags != gfx::ClearFlags::NONE) {
                    // clear resources
                }
            }
        }
    }
    void begin(const CopyPass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        std::ignore = vertID;
        for (const auto& copy : pass.copyPairs) {
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
    void begin(const PresentPass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        std::ignore = vertID;
        for (const auto& [name, present] : pass.presents) {
            // do presents
        }
    }
    void begin(const RaytracePass& pass, RenderGraph::vertex_descriptor vertID) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        std::ignore = vertID;
        // not implemented yet
        CC_EXPECTS(false);
    }
    void begin(const RenderQueue& pass, RenderGraph::vertex_descriptor vertID) const {
        // update uniform buffers and descriptor sets
    }
    void begin(const SceneData& sceneData, RenderGraph::vertex_descriptor sceneID) const {
        auto* camera = sceneData.camera;
        CC_EXPECTS(camera);
        if (camera) { // update camera data
            updateCameraUniformBufferAndDescriptorSet(ctx, sceneID);
        }
        const auto* scene = camera->getScene();
        const auto& queues = ctx.sceneQueues.at(scene);
        const auto& queue = queues.at(camera);
        bool bDraw = any(sceneData.flags & SceneFlags::DRAW_NON_INSTANCING);
        bool bDrawInstancing = any(sceneData.flags & SceneFlags::DRAW_INSTANCING);
        if (!bDraw && !bDrawInstancing) {
            bDraw = true;
            bDrawInstancing = true;
        }
        if (any(sceneData.flags & (SceneFlags::OPAQUE_OBJECT | SceneFlags::CUTOUT_OBJECT))) {
            queue.opaqueQueue.recordCommandBuffer(
                ctx.device, camera, ctx.currentPass, ctx.cmdBuff, 0);
            if (bDrawInstancing) {
                queue.opaqueInstancingQueue.recordCommandBuffer(
                    ctx.currentPass, ctx.cmdBuff);
            }
        }
        if (any(sceneData.flags & SceneFlags::TRANSPARENT_OBJECT)) {
            queue.transparentQueue.recordCommandBuffer(
                ctx.device, camera, ctx.currentPass, ctx.cmdBuff, 0);
            if (bDrawInstancing) {
                queue.transparentInstancingQueue.recordCommandBuffer(
                    ctx.currentPass, ctx.cmdBuff);
            }
        }
    }
    void begin(const Blit& blit, RenderGraph::vertex_descriptor vertID) const {
        const auto& programLib = *dynamic_cast<const NativeProgramLibrary*>(ctx.programLib);
        CC_EXPECTS(blit.material);
        CC_EXPECTS(blit.material->getPasses());
        if (blit.camera) {
            updateCameraUniformBufferAndDescriptorSet(ctx, vertID);
        }
        // get pass
        auto& pass = *blit.material->getPasses()->at(static_cast<size_t>(blit.passID));
        // get shader
        auto& shader = *pass.getShaderVariant();
        // get pso
        auto* pso = pipeline::PipelineStateManager::getOrCreatePipelineState(
            &pass, &shader, ctx.context.fullscreenQuad.quadIA.get(), ctx.currentPass);
        if (!pso) {
            return;
        }
        // update material ubo and descriptor set
        pass.update();

        // get or create program per-instance descriptor set
        const auto localID = ctx.lg.attributeIndex.at("CCLocal");

        auto& node = ctx.context.layoutGraphResources.at(vertID);
        auto iter = node.programResources.find(std::string_view{shader.getName()});
        if (iter == node.programResources.end()) {
            auto res = node.programResources.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(shader.getName()),
                std::forward_as_tuple());
            CC_ENSURES(res.second);
            pass.getPhase();
            IntrusivePtr<gfx::DescriptorSetLayout> instanceSetLayout =
                &const_cast<gfx::DescriptorSetLayout&>(
                    ctx.programLib->getLocalDescriptorSetLayout(
                        ctx.device, pass.getPhaseID(), shader.getName()));
            iter = res.first;

            auto& instance = res.first->second;
            instance.uniformBuffers[localID].init(ctx.device, pipeline::UBOLocal::SIZE);
            instance.descriptorSetPool.init(ctx.device, std::move(instanceSetLayout));
        }
        auto& instance = iter->second;
        auto* set = instance.descriptorSetPool.allocateDescriptorSet();
        CC_ENSURES(set);

        // update per-instance descriptor set
        {
            const auto& data = programLib.localLayoutData;
            const auto binding = data.bindingMap.at(localID);
            auto& bufferResource = instance.uniformBuffers.at(localID);
            auto& cpuData = bufferResource.cpuBuffer;
            // fill cpu data
            auto* buffer = bufferResource.bufferPool.allocateBuffer();
            CC_ENSURES(buffer);
            set->bindBuffer(binding, buffer);
        }

        // execution
        ctx.cmdBuff->bindPipelineState(pso);
        ctx.cmdBuff->bindDescriptorSet(
            static_cast<uint32_t>(pipeline::SetIndex::MATERIAL), pass.getDescriptorSet());
        ctx.cmdBuff->bindDescriptorSet(
            static_cast<uint32_t>(pipeline::SetIndex::LOCAL), set);
        ctx.cmdBuff->bindInputAssembler(ctx.context.fullscreenQuad.quadIA.get());
        ctx.cmdBuff->draw(ctx.context.fullscreenQuad.quadIA.get());
    }
    void begin(const Dispatch& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void begin(const ccstd::pmr::vector<ClearView>& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void begin(const gfx::Viewport& pass, RenderGraph::vertex_descriptor vertID) const {
    }
    void end(const RasterPass& pass) const {
        std::ignore = pass;
        auto* cmdBuff = ctx.cmdBuff;
        cmdBuff->endRenderPass();
        ctx.currentPass = nullptr;
        ctx.currentPassLayoutID = LayoutGraphData::null_vertex();
    }
    void end(const ComputePass& pass) const {
    }
    void end(const CopyPass& pass) const {
    }
    void end(const MovePass& pass) const {
    }
    void end(const PresentPass& pass) const {
    }
    void end(const RaytracePass& pass) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        // not implemented yet
        CC_EXPECTS(false);
    }
    void end(const RenderQueue& pass) const {
    }
    void end(const SceneData& pass) const {
    }
    void end(const Blit& pass) const {
    }
    void end(const Dispatch& pass) const {
    }
    void end(const ccstd::pmr::vector<ClearView>& pass) const {
    }
    void end(const gfx::Viewport& pass) const {
    }

    void mountResources(const RasterPass& pass) const {
        auto& resg = ctx.resourceGraph;
        // mount managed resources
        for (const auto& [name, view] : pass.rasterViews) {
            auto resID = findVertex(name, resg);
            CC_EXPECTS(resID != ResourceGraph::null_vertex());
            resg.mount(ctx.device, resID);
        }
        for (const auto& [name, views] : pass.computeViews) {
            auto resID = findVertex(name, resg);
            CC_EXPECTS(resID != ResourceGraph::null_vertex());
            resg.mount(ctx.device, resID);
        }
    }

    void mountResources(const ComputePass& pass) const {
        auto& resg = ctx.resourceGraph;
        PmrFlatSet<ResourceGraph::vertex_descriptor> mounted(ctx.scratch);
        for (const auto& [name, views] : pass.computeViews) {
            auto resID = findVertex(name, resg);
            CC_EXPECTS(resID != ResourceGraph::null_vertex());
            resg.mount(ctx.device, resID);
        }
    }

    void mountResources(const RaytracePass& pass) const {
        auto& resg = ctx.resourceGraph;
        PmrFlatSet<ResourceGraph::vertex_descriptor> mounted(ctx.scratch);
        for (const auto& [name, views] : pass.computeViews) {
            auto resID = findVertex(name, resg);
            CC_EXPECTS(resID != ResourceGraph::null_vertex());
            resg.mount(ctx.device, resID);
        }
    }

    void mountResources(const CopyPass& pass) const {
        auto& resg = ctx.resourceGraph;
        PmrFlatSet<ResourceGraph::vertex_descriptor> mounted(ctx.scratch);
        for (const auto& pair : pass.copyPairs) {
            const auto& srcID = findVertex(pair.source, resg);
            CC_EXPECTS(srcID != ResourceGraph::null_vertex());
            resg.mount(ctx.device, srcID);
            const auto& dstID = findVertex(pair.target, resg);
            CC_EXPECTS(dstID != ResourceGraph::null_vertex());
            resg.mount(ctx.device, dstID);
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
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass, vertID);
            },
            [&](const ComputePass& pass) {
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
            [&](const PresentPass& pass) {
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
                end(pass);
                rearBarriers(vertID);
            },
            [&](const ComputePass& pass) {
                end(pass);
                rearBarriers(vertID);
            },
            [&](const CopyPass& pass) {
                end(pass);
                rearBarriers(vertID);
            },
            [&](const MovePass& pass) {
                end(pass);
                rearBarriers(vertID);
            },
            [&](const PresentPass& pass) {
                end(pass);
                rearBarriers(vertID);
            },
            [&](const RaytracePass& pass) {
                end(pass);
                rearBarriers(vertID);
            },
            [&](const auto& queue) {
                end(queue);
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
    }
    RenderGraphContextCleaner(const RenderGraphContextCleaner&) = delete;
    RenderGraphContextCleaner& operator=(const RenderGraphContextCleaner&) = delete;
    ~RenderGraphContextCleaner() noexcept {
        for (auto iter = context.renderPasses.begin(); iter != context.renderPasses.end();) {
            if (--iter->second.refCount == 0) {
                iter = context.renderPasses.erase(iter);
            } else {
                ++iter;
            }
        }
    }
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

bool isNodeVisible(const scene::Model& model, const uint32_t visibility) {
    const auto* const node = model.getNode();
    CC_EXPECTS(node);
    return model.getNode() && ((visibility & node->getLayer()) == node->getLayer());
}

bool isInstanceVisible(const scene::Model& model, const uint32_t visibility) {
    return isNodeVisible(model, visibility) ||
           (visibility & static_cast<uint32_t>(model.getVisFlags()));
}

bool isPointInstanceAndNotSkybox(const scene::Model& model, const scene::Skybox* skyBox) {
    const auto* modelWorldBounds = model.getWorldBounds();
    return !modelWorldBounds && (skyBox == nullptr || skyBox->getModel() != &model);
}

bool isPointInstance(const scene::Model& model) {
    return !model.getWorldBounds();
}

void addShadowCastObject() {
    // csmLayers->addCastShadowObject(genRenderObject(model, camera));
    // csmLayers->addLayerObject(genRenderObject(model, camera));
}

bool isTransparent(const scene::Pass& pass) {
    bool bBlend = false;
    for (const auto& target : pass.getBlendState()->targets) {
        if (target.blend) {
            bBlend = true;
        }
    }
    return bBlend;
}

float computeSortingDepth(const scene::Camera& camera, const scene::Model& model) {
    float depth = 0;
    if (model.getNode()) {
        const auto* node = model.getTransform();
        cc::Vec3 position;
        cc::Vec3::subtract(node->getWorldPosition(), camera.getPosition(), &position);
        depth = position.dot(camera.getForward());
    }
    return depth;
}

void addRenderObject(
    const scene::Camera& camera, const scene::Model& model, NativeRenderQueue& queue) {
    const bool bDrawTransparent = any(queue.sceneFlags & SceneFlags::TRANSPARENT_OBJECT);
    bool bDrawOpaqueOrCutout = any(queue.sceneFlags & (SceneFlags::OPAQUE_OBJECT | SceneFlags::CUTOUT_OBJECT));
    if (!bDrawTransparent && !bDrawOpaqueOrCutout) {
        bDrawOpaqueOrCutout = true;
    }

    const auto& subModels = model.getSubModels();
    const auto subModelCount = subModels.size();
    for (uint32_t subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
        const auto& subModel = subModels[subModelIdx];
        const auto& passes = subModel->getPasses();
        const auto passCount = passes.size();
        for (uint32_t passIdx = 0; passIdx < passCount; ++passIdx) {
            auto& pass = *passes[passIdx];
            const bool bTransparent = isTransparent(pass);
            const bool bOpaqueOrCutout = !bTransparent;

            if (!bDrawTransparent && bTransparent) {
                // skip transparent object
                continue;
            }

            if (!bDrawOpaqueOrCutout && bOpaqueOrCutout) {
                // skip opaque object
                continue;
            }

            if (pass.getBatchingScheme() == scene::BatchingSchemes::INSTANCING) {
                auto& instancedBuffer = *pass.getInstancedBuffer();
                instancedBuffer.merge(subModel, passIdx);
                if (bTransparent) {
                    queue.transparentInstancingQueue.add(instancedBuffer);
                } else {
                    queue.opaqueInstancingQueue.add(instancedBuffer);
                }
            } else {
                const float depth = computeSortingDepth(camera, model);
                if (bTransparent) {
                    queue.transparentQueue.add(model, depth, subModelIdx, passIdx);
                } else {
                    queue.opaqueQueue.add(model, depth, subModelIdx, passIdx);
                }
            }
        }
    }
}

void octreeCulling(
    const scene::Octree* octree,
    const scene::RenderScene* scene,
    const scene::Skybox* skyBox,
    const scene::Camera& camera,
    NativeRenderQueue& queue) {
    // add special instances
    for (const auto& pModel : scene->getModels()) {
        CC_EXPECTS(pModel);
        const auto& model = *pModel;
        // filter model by view visibility
        if (!model.isEnabled()) {
            continue;
        }
        if (scene->isCulledByLod(&camera, &model)) {
            continue;
        }
        if (any(queue.sceneFlags & SceneFlags::SHADOW_CASTER) && model.isCastShadow()) {
            addShadowCastObject();
        }
        const auto visibility = camera.getVisibility();
        if (isInstanceVisible(model, visibility) && isPointInstanceAndNotSkybox(model, skyBox)) {
            addRenderObject(camera, model, queue);
        }
    }

    // add plain instances
    ccstd::vector<scene::Model*> models;
    models.reserve(scene->getModels().size() / 4);
    octree->queryVisibility(&camera, camera.getFrustum(), false, models);
    for (const auto& pModel : models) {
        const auto& model = *pModel;
        CC_EXPECTS(!isPointInstance(model));
        if (scene->isCulledByLod(&camera, &model)) {
            continue;
        }
        addRenderObject(camera, model, queue);
    }
}

void frustumCulling(
    const scene::RenderScene* scene,
    const scene::Camera& camera,
    NativeRenderQueue& queue) {
    const auto& models = scene->getModels();
    for (const auto& pModel : models) {
        CC_EXPECTS(pModel);
        const auto& model = *pModel;
        if (!model.isEnabled()) {
            continue;
        }
        // filter model by view visibility
        if (scene->isCulledByLod(&camera, &model)) {
            continue;
        }
        const auto visibility = camera.getVisibility();
        const auto* const node = model.getNode();

        // cast shadow render Object
        if (any(queue.sceneFlags & SceneFlags::SHADOW_CASTER) && model.isCastShadow()) {
            addShadowCastObject();
        }

        // add render objects
        if (isInstanceVisible(model, visibility)) {
            const auto* modelWorldBounds = model.getWorldBounds();
            // object has no volume
            if (!modelWorldBounds) {
                addRenderObject(camera, model, queue);
                continue;
            }
            // frustum culling
            if (modelWorldBounds->aabbFrustum(camera.getFrustum())) {
                addRenderObject(camera, model, queue);
            }
        }
    }
}

void mergeSceneFlags(
    const RenderGraph& rg,
    ccstd::pmr::unordered_map<
        const scene::RenderScene*,
        ccstd::pmr::unordered_map<scene::Camera*, NativeRenderQueue>>&
        sceneQueues) {
    for (const auto vertID : makeRange(vertices(rg))) {
        if (!holds<SceneTag>(vertID, rg)) {
            continue;
        }
        const auto& sceneData = get(SceneTag{}, vertID, rg);
        const auto* scene = sceneData.camera->getScene();
        if (scene) {
            sceneQueues[scene][sceneData.camera].sceneFlags |= sceneData.flags;
        }
    }
}

void extendResourceLifetime(const NativeRenderQueue& queue, ResourceGroup& group) {
    // keep instanceBuffers
    for (const auto& batch : queue.opaqueInstancingQueue.batches) {
        group.instancingBuffers.emplace(batch);
    }
    for (const auto& batch : queue.transparentInstancingQueue.batches) {
        group.instancingBuffers.emplace(batch);
    }
}

void buildRenderQueues(
    const pipeline::PipelineSceneData& sceneData,
    NativeRenderContext& context,
    ccstd::pmr::unordered_map<
        const scene::RenderScene*,
        ccstd::pmr::unordered_map<scene::Camera*, NativeRenderQueue>>& sceneQueues) {
    const scene::Skybox* skybox = sceneData.getSkybox();

    auto& group = context.resourceGroups[context.nextFenceValue];

    for (auto&& [scene, queues] : sceneQueues) {
        const scene::Octree* octree = scene->getOctree();
        for (auto&& [camera, queue] : queues) {
            CC_EXPECTS(camera);
            if (!camera->isCullingEnabled()) {
                continue;
            }

            // skybox
            if (skybox && skybox->isEnabled() &&
                (static_cast<int32_t>(camera->getClearFlag()) & scene::Camera::SKYBOX_FLAG)) {
                CC_EXPECTS(skybox->getModel());
                const auto& model = *skybox->getModel();
                const auto* node = model.getNode();
                float depth = 0;
                if (node) {
                    Vec3 tempVec3{};
                    tempVec3 = node->getWorldPosition() - camera->getPosition();
                    depth = tempVec3.dot(camera->getForward());
                }
                queue.opaqueQueue.add(model, depth, 0, 0);
            }

            // culling
            if (octree && octree->isEnabled()) {
                octreeCulling(octree, scene, skybox, *camera, queue);
            } else {
                frustumCulling(scene, *camera, queue);
            }

            queue.sort();

            extendResourceLifetime(queue, group);
        }
    }
}

} // namespace

void NativePipeline::executeRenderGraph(const RenderGraph& rg) {
    auto& ppl = *this;
    auto* scratch = &ppl.unsyncPool;

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
            const auto passID = get(ResourceAccessGraph::PassID, fgd.resourceAccessGraph, vertID);
            if (passID == RenderGraph::null_vertex()) {
                continue;
            }
            boost::depth_first_visit(graphView, passID, visitor, get(colors, rg));
        }
        colors.clear();
        colors.resize(num_vertices(rg), boost::white_color);
    }

    // scene culling
    ccstd::pmr::unordered_map<
        const scene::RenderScene*,
        ccstd::pmr::unordered_map<scene::Camera*, NativeRenderQueue>>
        sceneQueues(scratch);
    {
        mergeSceneFlags(rg, sceneQueues);
        buildRenderQueues(*ppl.getPipelineSceneData(), ppl.nativeContext, sceneQueues);
    }

    // Execute all valid passes
    {
        boost::filtered_graph<
            AddressableView<RenderGraph>,
            boost::keep_all, RenderGraphFilter>
            fg(graphView, boost::keep_all{}, RenderGraphFilter{&validPasses});

        CommandSubmitter submit(ppl.device, ppl.getCommandBuffers());

        // upload buffers
        for (const auto& [scene, queues] : sceneQueues) {
            for (const auto& [camera, queue] : queues) {
                queue.opaqueInstancingQueue.uploadBuffers(submit.primaryCommandBuffer);
                queue.transparentInstancingQueue.uploadBuffers(submit.primaryCommandBuffer);
            }
        }

        // submit commands
        RenderGraphVisitorContext ctx{
            ppl.nativeContext,
            lg, rg, ppl.resourceGraph,
            fgd, fgd.barrierMap,
            validPasses,
            ppl.device, submit.primaryCommandBuffer,
            sceneQueues,
            &ppl,
            programLibrary,
            scratch};

        RenderGraphVisitor visitor{{}, ctx};
        boost::depth_first_search(fg, visitor, get(colors, rg));
    }
}

} // namespace render

} // namespace cc
