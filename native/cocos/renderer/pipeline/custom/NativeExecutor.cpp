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
#include "pipeline/custom/RenderCommonFwd.h"

namespace cc {

namespace render {

namespace {

void clear(gfx::RenderPassInfo& info) {
    info.colorAttachments.clear();
    info.depthStencilAttachment = {};
    info.subpasses.clear();
    info.dependencies.clear();
}

uint8_t getRasterViewSlot(const RasterView& view) {
    std::ignore = view;
    CC_EXPECTS(false); // not implemented yet
    return 0;
}

} // namespace

struct RenderGraphVisitorContext {
    RenderGraphVisitorContext(
        const RenderGraph& gIn,
        const ResourceGraph& resgIn,
        const FrameGraphDispatcher& fgdIn,
        const FrameGraphDispatcher::BarrierMap& barrierMapIn,
        gfx::Device* deviceIn,
        cc::gfx::CommandBuffer* cmdBuffIn,
        boost::container::pmr::memory_resource* scratchIn)
    : g(gIn),
      resg(resgIn),
      fgd(fgdIn),
      barrierMap(barrierMapIn),
      device(deviceIn),
      cmdBuff(cmdBuffIn),
      scratch(scratchIn) {}

    const RenderGraph& g;
    const ResourceGraph& resg;
    const FrameGraphDispatcher& fgd;
    const FrameGraphDispatcher::BarrierMap& barrierMap;
    gfx::Device* device = nullptr;
    cc::gfx::CommandBuffer* cmdBuff = nullptr;
    boost::container::pmr::memory_resource* scratch = nullptr;
    gfx::RenderPassInfo rpInfo;
};

struct RenderGraphVisitor : boost::dfs_visitor<> {
    void begin(const RasterPass& pass) const {
        auto& rpInfo = ctx.rpInfo;
        // viewport
        auto vp = pass.viewport;
        if (vp.width == 0 && vp.height == 0) {
            vp.width = pass.width;
            vp.height = pass.height;
        }
        // scissor
        gfx::Rect scissor{0, 0, vp.width, vp.height};

        // render pass
        clear(rpInfo);
        uint32_t numDepthStencil = 0;
        rpInfo.colorAttachments.resize(pass.rasterViews.size());
        for (const auto& pair : pass.rasterViews) {
            const auto& name = pair.first;
            const auto& view = pair.second;
            const auto resID = vertex(name, ctx.resg);
            const auto& desc = get(ResourceGraph::DescTag{}, ctx.resg, resID);

            if (view.attachmentType == AttachmentType::RENDER_TARGET) { // RenderTarget
                auto slot = getRasterViewSlot(view);
                auto& rt = rpInfo.colorAttachments[slot];
                rt.format = desc.format;
                rt.sampleCount = desc.sampleCount;
                rt.loadOp = view.loadOp;
                rt.storeOp = view.storeOp;
                rt.barrier = nullptr;
                rt.isGeneralLayout = hasFlag(desc.textureFlags, gfx::TextureFlags::GENERAL_LAYOUT);
            } else { // DepthStencil
                ++numDepthStencil;
                auto& ds = rpInfo.depthStencilAttachment;
                ds.format = desc.format;
                ds.sampleCount = desc.sampleCount;
                ds.depthLoadOp = view.loadOp;
                ds.depthStoreOp = view.storeOp;
                ds.stencilLoadOp = view.loadOp;
                ds.stencilStoreOp = view.storeOp;
                ds.barrier = nullptr;
                ds.isGeneralLayout = hasFlag(desc.textureFlags, gfx::TextureFlags::GENERAL_LAYOUT);
            }
        }
        CC_EXPECTS(numDepthStencil <= 1);
        if (numDepthStencil) {
            CC_EXPECTS(rpInfo.colorAttachments.back().format == gfx::Format::UNKNOWN);
            rpInfo.colorAttachments.pop_back();
        }
        auto* cmdBuffer = ctx.cmdBuff;

        // gfx::Resource<gfx::RenderPass, gfx::RenderPassInfo>
        // cmdBuff->beginRenderPass();

    }
    void begin(const ComputePass& pass) const {
    }
    void begin(const CopyPass& pass) const {
    }
    void begin(const MovePass& pass) const {
    }
    void begin(const PresentPass& pass) const {
    }
    void begin(const RaytracePass& pass) const {
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
    }
    void end(const ComputePass& pass) const {
    }
    void end(const CopyPass& pass) const {
    }
    void end(const MovePass& pass) const {
    }
    void end(const PresentPass& pass) const {
    }
    void end(const RaytracePass& pass) const {
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

void executeRenderGraph(const RenderGraph& renderGraph) {
    
}

} // namespace render

} // namespace cc
