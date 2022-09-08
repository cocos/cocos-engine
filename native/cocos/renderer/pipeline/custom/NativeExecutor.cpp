#include "NativeExecutor.h"
#include <boost/graph/depth_first_search.hpp>
#include <variant>
#include "FGDispatcherGraphs.h"
#include "GraphTypes.h"
#include "GraphView.h"
#include "NativePipelineTypes.h"
#include "Pmr.h"
#include "RenderGraphGraphs.h"
#include "RenderGraphTypes.h"
#include "gfx-base/GFXDef-common.h"
#include "pipeline/custom/GslUtils.h"
#include "pipeline/custom/NativePipelineFwd.h"
#include "pipeline/custom/RenderCommonFwd.h"

namespace cc {

namespace render {

struct RenderGraphVisitorContext {
    RenderGraphVisitorContext(
        NativeRenderContext& contextIn,
        const RenderGraph& gIn,
        const ResourceGraph& resgIn,
        const FrameGraphDispatcher& fgdIn,
        const FrameGraphDispatcher::BarrierMap& barrierMapIn,
        gfx::Device* deviceIn,
        cc::gfx::CommandBuffer* cmdBuffIn,
        boost::container::pmr::memory_resource* scratchIn)
    : context(contextIn),
      g(gIn),
      resg(resgIn),
      fgd(fgdIn),
      barrierMap(barrierMapIn),
      device(deviceIn),
      cmdBuff(cmdBuffIn),
      scratch(scratchIn) {}

    NativeRenderContext& context;
    const RenderGraph& g;
    const ResourceGraph& resg;
    const FrameGraphDispatcher& fgd;
    const FrameGraphDispatcher::BarrierMap& barrierMap;
    gfx::Device* device = nullptr;
    cc::gfx::CommandBuffer* cmdBuff = nullptr;
    boost::container::pmr::memory_resource* scratch = nullptr;
    gfx::RenderPass* currentPass = nullptr;
};

namespace {

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
    return 0;
}

uint32_t getRasterPassOutputCount(const RasterPass& pass) {
    return 0;
}

uint32_t getRasterPassResolveCount(const RasterPass& pass) {
    return 0;
}

uint32_t getRasterPassPreserveCount(const RasterPass& pass) {
    return 0;
}

PersistentRenderPassAndFramebuffer createPersistentRenderPassAndFramebuffer(
    RenderGraphVisitorContext& ctx, const RasterPass& pass) {
    PersistentRenderPassAndFramebuffer data(pass.get_allocator());
    gfx::RenderPassInfo rpInfo;
    uint32_t numDepthStencil = 0;
    rpInfo.colorAttachments.resize(pass.rasterViews.size());
    data.clearColors.resize(pass.rasterViews.size());

    if (pass.subpassGraph.subpasses.empty()) {
        auto& subpass = rpInfo.subpasses.emplace_back();
        subpass.inputs.resize(getRasterPassInputCount(pass));
        subpass.colors.resize(getRasterPassOutputCount(pass));
        // TODO(zhouzhenglong):
        // subpass.resolves.resize(getRasterPassResolveCount(pass));
        // subpass.preserves.resize(getRasterPassPreserveCount(pass));
        auto numTotalAttachments = static_cast<uint32_t>(pass.rasterViews.size());
        uint32_t slot = 0;
        for (const auto& pair : pass.rasterViews) {
            const auto& name = pair.first;
            const auto& view = pair.second;
            const auto resID = vertex(name, ctx.resg);
            const auto& desc = get(ResourceGraph::DescTag{}, ctx.resg, resID);

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
                    auto outputSlot = getRasterViewPassOutputSlot(view);
                    subpass.colors[outputSlot] = slot;
                }
                data.clearColors[slot] = view.clearColor;
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
    gfx::FramebufferInfo fbInfo{
        data.renderPass,
        // add textures
    };
    data.framebuffer = ctx.device->createFramebuffer(fbInfo);
    return data;
}

} // namespace

struct RenderGraphVisitor : boost::dfs_visitor<> {
    void preBarriers() const {

    }
    void postBarriers() const {

    }

    void begin(const RasterPass& pass) const {
        preBarriers();
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
    void begin(const ComputePass& pass) const {
        preBarriers();
        for (const auto& [name, views] : pass.computeViews) {
            for (const auto& view : views) {
                if (view.clearFlags != gfx::ClearFlags::NONE) {
                    // clear resources
                }
            }
        }
    }
    void begin(const CopyPass& pass) const {
        preBarriers();
        for (const auto& copy : pass.copyPairs) {
        }
    }
    void begin(const MovePass& pass) const {
        // if fully optimized, move pass should have been removed from graph
        // here we just do copy
        preBarriers();
        for (const auto& copy : pass.movePairs) {
        }
    }
    void begin(const PresentPass& pass) const {
        preBarriers();
        for (const auto& [name, present] : pass.presents) {
            // do presents
        }
    }
    void begin(const RaytracePass& pass) const {
        // not implemented yet
        CC_EXPECTS(false);
        preBarriers();
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
        auto* cmdBuff = ctx.cmdBuff;
        cmdBuff->endRenderPass();
        ctx.currentPass = nullptr;
        postBarriers();
    }
    void end(const ComputePass& pass) const {
        postBarriers();
    }
    void end(const CopyPass& pass) const {
        postBarriers();
    }
    void end(const MovePass& pass) const {
        postBarriers();
    }
    void end(const PresentPass& pass) const {
        postBarriers();
    }
    void end(const RaytracePass& pass) const {
        // not implemented yet
        CC_EXPECTS(false);
        postBarriers();
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

    void discover_vertex(
        RenderGraph::vertex_descriptor vertID,
        const AddressableView<RenderGraph>& gv) const {
        std::ignore = gv;
        visitObject(
            vertID, ctx.g,
            [&](const auto& pass) {
                begin(pass);
            });
    }

    void finish_vertex(
        RenderGraph::vertex_descriptor vertID,
        const AddressableView<RenderGraph>& gv) const {
        std::ignore = gv;
        visitObject(
            vertID, ctx.g,
            [&](const auto& pass) {
                end(pass);
            });
    }

    RenderGraphVisitorContext& ctx;
};

void executeRenderGraph(NativePipeline& ppl, const RenderGraph& rg) {
    FrameGraphDispatcher fgd(ppl.resourceGraph, rg,
        ppl.layoutGraph, &ppl.unsyncPool, &ppl.unsyncPool);
    fgd.enableMemoryAliasing(false);
    fgd.enablePassReorder(false);
    fgd.setParalellWeight(0);
    fgd.run();
}

} // namespace render

} // namespace cc
