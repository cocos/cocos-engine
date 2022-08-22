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
#include "frame-graph/Resource.h"
#include "gfx-base/GFXDef-common.h"
#include "pipeline/custom/GslUtils.h"
#include "pipeline/custom/RenderCommonFwd.h"
#include "renderer/frame-graph/FrameGraph.h"

namespace cc {

namespace render {

namespace {

void setRenderTextureInfo(const ResourceDesc& desc, const RasterView& view, gfx::TextureInfo& info) {
    CC_EXPECTS(desc.depthOrArraySize == 1); // array not supported yet
    CC_EXPECTS(desc.mipLevels == 1); // render target with mipmap is not supported

    // type
    switch(desc.dimension) {
        case ResourceDimension::BUFFER: {
            CC_EXPECTS(false);
            break;
        }
        case ResourceDimension::TEXTURE1D: {
            info.type = gfx::TextureType::TEX1D;
            break;
        }
        case ResourceDimension::TEXTURE2D: {
            info.type = gfx::TextureType::TEX2D;
            break;
        }
        case ResourceDimension::TEXTURE3D: {
            info.type = gfx::TextureType::TEX3D;
            break;
        }
    }

    // usage
    if (any(desc.flags & ResourceFlags::SAMPLED)) {
        info.usage |= gfx::TextureUsageBit::SAMPLED;
    }
    if (any(desc.flags & ResourceFlags::INPUT_ATTACHMENT)) {
        CC_EXPECTS(view.attachmentType == AttachmentType::RENDER_TARGET);
        info.usage |= gfx::TextureUsageBit::INPUT_ATTACHMENT;
    }
    if (any(desc.flags & ResourceFlags::COLOR_ATTACHMENT)) {
        CC_EXPECTS(view.attachmentType == AttachmentType::RENDER_TARGET);
        info.usage |= gfx::TextureUsageBit::COLOR_ATTACHMENT;
    }
    if (any(desc.flags & ResourceFlags::DEPTH_STENCIL_ATTACHMENT)) {
        CC_EXPECTS(view.attachmentType == AttachmentType::DEPTH_STENCIL);
        info.usage |= gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT;
    }

    // format, width, height
    info.format = desc.format;
    info.width = desc.width;
    info.height = desc.height;

    // flags
    info.flags = desc.textureFlags;

    // layerCount
    if (info.type == gfx::TextureType::TEX3D) {
        info.layerCount = 1;
    } else {
        info.layerCount = desc.depthOrArraySize;
    }

    // levelCount
    info.levelCount = desc.mipLevels;

    // samples
    info.samples = desc.sampleCount;

    // depth
    if (info.type == gfx::TextureType::TEX3D) {
        info.depth = desc.depthOrArraySize;
    } else {
        info.depth = 1;
    }

    // externalRes
    info.externalRes = {};
}

} // namespace

struct RenderGraphFrameGraphBuilder : boost::dfs_visitor<> {
    void addRasterPass(
        const PmrTransparentMap<ccstd::pmr::string, RasterView>& rasterViews,
        const PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>>& computeViews,
        bool bSubpass, bool bSubpassEnd) {
        auto passSetup = [&](framegraph::PassNodeBuilder& builder, NativePassData& data) {
            if (bSubpass) {
                builder.subpass(bSubpassEnd);
            }
            for (const auto& pair : rasterViews) {
                const auto& name = pair.first;
                const auto& view = pair.second;
                auto viewID = vertex(name, resg);
                const auto& desc = get(ResourceGraph::DescTag{}, resg, viewID);
                visitObject(
                    viewID, resg,
                    [&](const ManagedResource&) {

                    },
                    [&](const IntrusivePtr<gfx::Buffer>&) {

                    },
                    [&](const IntrusivePtr<gfx::Texture>&) {

                    },
                    [&](const IntrusivePtr<gfx::Framebuffer>&) {

                    },
                    [&](const RenderSwapchain&) {

                    });

                const auto handle = framegraph::FrameGraph::stringToHandle(name.c_str());
                auto typedHandle = builder.readFromBlackboard(handle);
                data.outputViews.emplace_back();
                auto &lastTex = data.outputViews.back();
                framegraph::Texture::Descriptor colorTexInfo{};
                setRenderTextureInfo(desc, view, colorTexInfo);

                if (view.accessType == AccessType::READ) {
                    colorTexInfo.usage = gfx::TextureUsage::INPUT_ATTACHMENT | gfx::TextureUsage::COLOR_ATTACHMENT;
                }
                // lastTex.first = view.second.accessType;
                // lastTex.second = static_cast<framegraph::TextureHandle>(typedHandle);

                // if (framegraph::Handle::IndexType(typedHandle) == framegraph::Handle::UNINITIALIZED) {
                //     colorTexInfo.width = 960;
                //     colorTexInfo.height = 640;

                //     lastTex.second = builder.create(handle, colorTexInfo);
                // }

                // framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
                // colorAttachmentInfo.usage = view.second.attachmentType == AttachmentType::RENDER_TARGET ? framegraph::RenderTargetAttachment::Usage::COLOR : framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
                // colorAttachmentInfo.clearColor = view.second.clearColor;
                // colorAttachmentInfo.loadOp = view.second.loadOp;
                // if (view.second.accessType == AccessType::WRITE) {
                //     lastTex.second = builder.write(lastTex.second, colorAttachmentInfo);
                //     builder.writeToBlackboard(handle, lastTex.second);
                //     colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE;
                // } else {
                //     colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::COLOR_ATTACHMENT_READ;
                //     auto res = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(handle)));
                //     builder.writeToBlackboard(handle, res);
                // }
            }
        };
    }

    void discover_vertex(
        RenderGraph::vertex_descriptor vertID,
        const AddressableView<RenderGraph>& gv) const {
        visitObject(
            vertID, g,
            [&](const RasterPass& pass) {

            },
            [&](const ComputePass& pass) {

            },
            [&](const CopyPass& pass) {

            },
            [&](const MovePass& pass) {

            },
            [&](const PresentPass& pass) {

            },
            [&](const RaytracePass& pass) {

            },
            [&](const RenderQueue& pass) {

            },
            [&](const SceneData& pass) {

            },
            [&](const Blit& pass) {

            },
            [&](const Dispatch& pass) {

            },
            [&](const ccstd::pmr::vector<ClearView>& pass) {

            },
            [&](const gfx::Viewport& pass) {

            });
    }

    const RenderGraph& g;
    const ResourceGraph& resg;
    framegraph::FrameGraph& fg;
    const FrameGraphDispatcher& fgd;
    const FrameGraphDispatcher::BarrierMap& barrierMap;
    boost::container::pmr::memory_resource* scratch = nullptr;
};

} // namespace render

} // namespace cc
