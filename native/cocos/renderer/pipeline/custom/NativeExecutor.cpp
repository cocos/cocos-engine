#include <boost/graph/depth_first_search.hpp>
#include <boost/graph/filtered_graph.hpp>
#include <variant>
#include "FGDispatcherGraphs.h"
#include "GraphTypes.h"
#include "GraphView.h"
#include "GslUtils.h"
#include "NativePipelineFwd.h"
#include "NativePipelineTypes.h"
#include "Pmr.h"
#include "Range.h"
#include "RenderCommonFwd.h"
#include "RenderGraphGraphs.h"
#include "RenderGraphTypes.h"
#include "Set.h"
#include "cocos/renderer/gfx-base/GFXBarrier.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "cocos/renderer/pipeline/LODModelsUtil.h"
#include "cocos/scene/Model.h"
#include "cocos/scene/Octree.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/Skybox.h"

namespace cc {

namespace render {

namespace {

struct RenderGraphVisitorContext {
    RenderGraphVisitorContext(
        NativeRenderContext& contextIn,
        const RenderGraph& gIn,
        ResourceGraph& resgIn,
        const FrameGraphDispatcher& fgdIn,
        const FrameGraphDispatcher::BarrierMap& barrierMapIn,
        const ccstd::pmr::vector<bool>& validPassesIn,
        gfx::Device* deviceIn,
        cc::gfx::CommandBuffer* cmdBuffIn,
        ccstd::pmr::unordered_map<
            const scene::RenderScene*,
            ccstd::pmr::unordered_map<scene::Camera*, NativeRenderQueue>>& sceneQueuesIn,
        boost::container::pmr::memory_resource* scratchIn)
    : context(contextIn),
      g(gIn),
      resourceGraph(resgIn),
      fgd(fgdIn),
      barrierMap(barrierMapIn),
      validPasses(validPassesIn),
      device(deviceIn),
      cmdBuff(cmdBuffIn),
      sceneQueues(sceneQueuesIn),
      scratch(scratchIn) {}

    NativeRenderContext& context;
    const RenderGraph& g;
    ResourceGraph& resourceGraph;
    const FrameGraphDispatcher& fgd;
    const FrameGraphDispatcher::BarrierMap& barrierMap;
    const ccstd::pmr::vector<bool>& validPasses;
    gfx::Device* device = nullptr;
    cc::gfx::CommandBuffer* cmdBuff = nullptr;
    boost::container::pmr::memory_resource* scratch = nullptr;
    gfx::RenderPass* currentPass = nullptr;
    ccstd::pmr::unordered_map<
        const scene::RenderScene*,
        ccstd::pmr::unordered_map<scene::Camera*, NativeRenderQueue>>& sceneQueues;
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
    gfx::RenderPassInfo rpInfo;
    uint32_t numDepthStencil = 0;
    rpInfo.colorAttachments.resize(pass.rasterViews.size());
    data.clearColors.resize(pass.rasterViews.size());
    gfx::FramebufferInfo fbInfo{
        data.renderPass,
    };
    fbInfo.colorTextures.reserve(pass.rasterViews.size());

    if (pass.subpassGraph.subpasses.empty()) {
        auto& subpass = rpInfo.subpasses.emplace_back();
        subpass.inputs.resize(getRasterPassInputCount(pass));
        subpass.colors.resize(getRasterPassOutputCount(pass));
        subpass.resolves.resize(getRasterPassResolveCount(pass));
        subpass.preserves.resize(getRasterPassPreserveCount(pass));
        auto numTotalAttachments = static_cast<uint32_t>(pass.rasterViews.size());
        uint32_t slot = 0;
        uint32_t rtvCount = 0;
        uint32_t dsvCount = 0;
        for (const auto& pair : pass.rasterViews) {
            const auto& name = pair.first;
            const auto& view = pair.second;
            const auto resID = vertex(name, ctx.resourceGraph);
            const auto& desc = get(ResourceGraph::DescTag{}, ctx.resourceGraph, resID);

            if (view.attachmentType == AttachmentType::RENDER_TARGET) { // RenderTarget
                auto& rtv = rpInfo.colorAttachments[slot];
                rtv.format = desc.format;
                rtv.sampleCount = desc.sampleCount;
                rtv.loadOp = view.loadOp;
                rtv.storeOp = view.storeOp;
                rtv.barrier = nullptr;
                rtv.isGeneralLayout = hasFlag(desc.textureFlags, gfx::TextureFlags::GENERAL_LAYOUT);
                if (view.accessType != AccessType::WRITE) { // Input
                    auto inputSlot = getRasterViewPassInputSlot(view);
                    subpass.inputs[inputSlot] = slot;
                }
                if (view.accessType != AccessType::READ) { // Output
                    auto outputSlot = rtvCount++;
                    subpass.colors[outputSlot] = slot;
                }
                data.clearColors[slot] = view.clearColor;

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

                ++slot;
            } else { // DepthStencil
                ++numDepthStencil;
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
        CC_EXPECTS(numDepthStencil <= 1);
        if (numDepthStencil) {
            CC_EXPECTS(rpInfo.colorAttachments.back().format == gfx::Format::UNKNOWN);
            rpInfo.colorAttachments.pop_back();
            data.clearColors.pop_back();
        }
    } else {
        CC_EXPECTS(false);
    }
    data.renderPass = ctx.device->createRenderPass(rpInfo);
    if (!data.framebuffer) {
        fbInfo.renderPass = data.renderPass;
        data.framebuffer = ctx.device->createFramebuffer(fbInfo);
    }
    return data;
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
            barrier.beginStatus.visibility,
            barrier.beginStatus.access,
            barrier.beginStatus.passType),
        gfx::getAccessFlags(
            endUsage, memUsage,
            barrier.endStatus.visibility,
            barrier.endStatus.access,
            barrier.endStatus.passType),
        barrier.type,
        bufferRange.offset, bufferRange.size};
}

std::pair<gfx::TextureBarrierInfo, gfx::Texture*> getTextureBarrier(
    const ResourceGraph& resg, ResourceGraph::vertex_descriptor resID,
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

    const auto& desc = get(ResourceGraph::DescTag{}, resg, resID);
    const auto& beginUsage = get<gfx::TextureUsage>(barrier.beginStatus.usage);
    const auto& endUsage = get<gfx::TextureUsage>(barrier.endStatus.usage);

    auto beginAccesFlags = gfx::getDeviceAccessFlags(
        beginUsage,
        barrier.beginStatus.access,
        barrier.beginStatus.visibility);

    auto endAccessFlags = gfx::getDeviceAccessFlags(
        endUsage,
        barrier.endStatus.access,
        barrier.endStatus.visibility);

    CC_ENSURES(beginAccesFlags != gfx::INVALID_ACCESS_FLAGS);
    CC_ENSURES(endAccessFlags != gfx::INVALID_ACCESS_FLAGS);

    const auto& textureRange = get<TextureRange>(barrier.beginStatus.range);
    CC_EXPECTS(textureRange.levelCount);
    CC_EXPECTS(textureRange.numSlices);

    return {
        gfx::TextureBarrierInfo{
            beginAccesFlags,
            endAccessFlags,
            barrier.type,
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

struct RenderGraphVisitor : boost::dfs_visitor<> {
    void submitBarriers(const std::vector<Barrier>& barriers) const {
        const auto& resg = ctx.resourceGraph;
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
                    gfx::BufferBarrierInfo info = getBufferBarrier(barrier);
                    const auto* bufferBarrier = ctx.device->getBufferBarrier(info);
                    buffers.emplace_back(nullptr);
                    bufferBarriers.emplace_back(bufferBarrier);
                    break;
                }
                case ResourceDimension::TEXTURE1D:
                case ResourceDimension::TEXTURE2D:
                case ResourceDimension::TEXTURE3D:
                default: {
                    auto [info, texture] = getTextureBarrier(resg, resID, barrier);
                    const auto* textureBarrier = ctx.device->getTextureBarrier(info);
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
        auto iter = ctx.barrierMap.find(vertID + 1);
        if (iter != ctx.barrierMap.end()) {
            submitBarriers(iter->second.blockBarrier.frontBarriers);
        }
    }
    void rearBarriers(RenderGraph::vertex_descriptor vertID) const {
        auto iter = ctx.barrierMap.find(vertID + 1);
        if (iter != ctx.barrierMap.end()) {
            submitBarriers(iter->second.blockBarrier.rearBarriers);
        }
    }
    void begin(const RasterPass& pass) const {
        // viewport
        auto vp = pass.viewport;
        if (vp.width == 0 && vp.height == 0) {
            vp.width = pass.width;
            vp.height = pass.height;
        }
        // scissor
        gfx::Rect scissor{0, 0, vp.width, vp.height};

        // render pass
        auto iter = ctx.context.renderPasses.find(pass);
        if (iter == ctx.context.renderPasses.end()) {
            bool added = false;
            std::tie(iter, added) = ctx.context.renderPasses.emplace(
                pass, createPersistentRenderPassAndFramebuffer(ctx, pass));
            CC_ENSURES(added);
        }
        ++iter->second.refCount;
        const auto& data = iter->second;
        auto* cmdBuff = ctx.cmdBuff;

        cmdBuff->beginRenderPass(
            data.renderPass.get(),
            data.framebuffer.get(),
            scissor, data.clearColors.data(),
            data.clearDepth, data.clearStencil);

        ctx.currentPass = data.renderPass.get();
    }
    void begin(const ComputePass& pass) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        for (const auto& [name, views] : pass.computeViews) {
            for (const auto& view : views) {
                if (view.clearFlags != gfx::ClearFlags::NONE) {
                    // clear resources
                }
            }
        }
    }
    void begin(const CopyPass& pass) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        for (const auto& copy : pass.copyPairs) {
        }
    }
    void begin(const MovePass& pass) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        // if fully optimized, move pass should have been removed from graph
        // here we just do copy
        for (const auto& copy : pass.movePairs) {
        }
    }
    void begin(const PresentPass& pass) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        for (const auto& [name, present] : pass.presents) {
            // do presents
        }
    }
    void begin(const RaytracePass& pass) const { // NOLINT(readability-convert-member-functions-to-static)
        std::ignore = pass;
        // not implemented yet
        CC_EXPECTS(false);
    }
    void begin(const RenderQueue& pass) const {
    }
    void begin(const SceneData& pass) const {
    }
    void begin(const Blit& pass) const {
    }
    void begin(const Dispatch& pass) const {
    }
    void begin(const ccstd::pmr::vector<ClearView>& pass) const {
    }
    void begin(const gfx::Viewport& pass) const {
    }
    void end(const RasterPass& pass) const {
        std::ignore = pass;
        auto* cmdBuff = ctx.cmdBuff;
        cmdBuff->endRenderPass();
        ctx.currentPass = nullptr;
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
                begin(pass);
            },
            [&](const ComputePass& pass) {
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass);
            },
            [&](const CopyPass& pass) {
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass);
            },
            [&](const MovePass& pass) {
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass);
            },
            [&](const PresentPass& pass) {
                frontBarriers(vertID);
                begin(pass);
            },
            [&](const RaytracePass& pass) {
                mountResources(pass);
                frontBarriers(vertID);
                begin(pass);
            },
            [&](const auto& queue) {
                begin(queue);
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
    : context(contextIn) {}
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

bool isNodeVisible(const scene::Model* model, const uint32_t visibility) {
    CC_EXPECTS(model);
    const auto* const node = model->getNode();
    CC_EXPECTS(node);
    return model->getNode() && ((visibility & node->getLayer()) == node->getLayer());
}

bool isInstanceVisible(const scene::Model* model, const uint32_t visibility) {
    return isNodeVisible(model, visibility) &&
           (visibility & static_cast<uint32_t>(model->getVisFlags()));
}

bool isPointInstanceAndNotSkybox(const scene::Model* model, const scene::Skybox* skyBox) {
    const auto* modelWorldBounds = model->getWorldBounds();
    return !modelWorldBounds && (skyBox == nullptr || skyBox->getModel() != model);
}

bool isPointInstance(const scene::Model* model) {
    return !model->getWorldBounds();
}

void addShadowCastObject() {
    // csmLayers->addCastShadowObject(genRenderObject(model, camera));
    // csmLayers->addLayerObject(genRenderObject(model, camera));
}

void addRenderObject(const scene::Camera* camera, const scene::Model* model) {
}

void octreeCulling(
    const scene::Octree* octree,
    const scene::RenderScene* scene,
    const scene::Skybox* skyBox,
    const scene::Camera* camera,
    SceneFlags mergedFlags) {
    // add special instances
    for (const auto& model : scene->getModels()) {
        // filter model by view visibility
        if (!model->isEnabled()) {
            continue;
        }
        if (pipeline::LODModelsCachedUtils::isLODModelCulled(model)) {
            continue;
        }
        if (any(mergedFlags & SceneFlags::SHADOW_CASTER) && model->isCastShadow()) {
            addShadowCastObject();
        }
        const auto visibility = camera->getVisibility();
        if (isInstanceVisible(model, visibility) && isPointInstanceAndNotSkybox(model, skyBox)) {
            addRenderObject(camera, model);
        }
    }

    // add plain instances
    ccstd::vector<scene::Model*> models;
    models.reserve(scene->getModels().size() / 4);
    octree->queryVisibility(camera, camera->getFrustum(), false, models);
    for (const auto& model : models) {
        CC_EXPECTS(!isPointInstance(model));
        if (pipeline::LODModelsCachedUtils::isLODModelCulled(model)) {
            continue;
        }
        addRenderObject(camera, model);
    }
}

void frustumCulling(
    const scene::RenderScene* scene,
    const scene::Camera* camera,
    SceneFlags mergedFlags) {
    for (const auto& model : scene->getModels()) {
        if (!model->isEnabled()) {
            continue;
        }
        // filter model by view visibility
        if (pipeline::LODModelsCachedUtils::isLODModelCulled(model)) {
            continue;
        }
        const auto visibility = camera->getVisibility();
        const auto* const node = model->getNode();

        // cast shadow render Object
        if (any(mergedFlags & SceneFlags::SHADOW_CASTER) && model->isCastShadow()) {
            addShadowCastObject();
        }

        // add render objects
        if (isInstanceVisible(model, visibility)) {
            const auto* modelWorldBounds = model->getWorldBounds();
            if (!modelWorldBounds) {
                addRenderObject(camera, model);
                continue;
            }
            // frustum culling
            if (modelWorldBounds->aabbFrustum(camera->getFrustum())) {
                addRenderObject(camera, model);
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

void sceneCulling(
    ccstd::pmr::unordered_map<
        const scene::RenderScene*,
        ccstd::pmr::unordered_map<scene::Camera*, NativeRenderQueue>>& sceneQueues) {
    const scene::Skybox* skyBox = nullptr;
    for (const auto& [scene, queues] : sceneQueues) {
        const scene::Octree* octree = scene->getOctree();
        for (const auto& [camera, queue] : queues) {
            pipeline::LODModelsCachedUtils::updateCachedLODModels(scene, camera);
            if (octree && octree->isEnabled()) {
                octreeCulling(octree, scene, skyBox, camera, queue.sceneFlags);
            } else {
                frustumCulling(scene, camera, queue.sceneFlags);
            }
        }
    }
}

} // namespace

void NativePipeline::executeRenderGraph(const RenderGraph& rg) {
    auto& ppl = *this;
    auto* scratch = &ppl.unsyncPool;
    CC_LOG_INFO(rg.print(scratch).c_str());

    RenderGraphContextCleaner contextCleaner(ppl.nativeContext);
    ResourceCleaner cleaner(ppl.resourceGraph);

    FrameGraphDispatcher fgd(
        ppl.resourceGraph, rg,
        ppl.layoutGraph, &ppl.unsyncPool, scratch);
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
    mergeSceneFlags(rg, sceneQueues);
    sceneCulling(sceneQueues);

    { // Execute all valid passes
        boost::filtered_graph<AddressableView<RenderGraph>, boost::keep_all, RenderGraphFilter>
            fg(graphView, boost::keep_all{}, RenderGraphFilter{&validPasses});

        CommandSubmitter submit(ppl.device, ppl.getCommandBuffers());
        RenderGraphVisitorContext ctx(
            ppl.nativeContext, rg, ppl.resourceGraph,
            fgd, fgd.barrierMap,
            validPasses,
            ppl.device, submit.primaryCommandBuffer,
            sceneQueues,
            scratch);

        RenderGraphVisitor visitor{{}, ctx};
        boost::depth_first_search(fg, visitor, get(colors, rg));
    }
}

} // namespace render

} // namespace cc
