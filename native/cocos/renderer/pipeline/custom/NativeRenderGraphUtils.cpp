#include <boost/graph/depth_first_search.hpp>
#include <boost/graph/filtered_graph.hpp>
#include "cocos/renderer/pipeline/custom/RenderCommonNames.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/details/DebugUtils.h"
#include "cocos/renderer/pipeline/custom/details/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/details/GraphView.h"

namespace cc {

namespace render {

namespace {

const char *getName(const gfx::LoadOp &op) {
    switch (op) {
        case gfx::LoadOp::LOAD:
            return "LOAD";
        case gfx::LoadOp::CLEAR:
            return "CLEAR";
        case gfx::LoadOp::DISCARD:
            return "DISCARD";
        default:
            return "UNKNOWN";
    }
    return "UNKNOWN";
}

const char *getName(const gfx::StoreOp &op) {
    switch (op) {
        case gfx::StoreOp::STORE:
            return "STORE";
        case gfx::StoreOp::DISCARD:
            return "DISCARD";
        default:
            return "UNKNOWN";
    }
    return "UNKNOWN";
}

std::string getName(const gfx::ClearFlagBit &flags) {
    std::ostringstream oss;
    int count = 0;
    if (hasAnyFlags(flags, gfx::ClearFlagBit::COLOR)) {
        if (count++) {
            oss << "|";
        }
        oss << "COLOR";
    }
    if (hasAnyFlags(flags, gfx::ClearFlagBit::DEPTH)) {
        if (count++) {
            oss << "|";
        }
        oss << "DEPTH";
    }
    if (hasAnyFlags(flags, gfx::ClearFlagBit::STENCIL)) {
        if (count++) {
            oss << "|";
        }
        oss << "STENCIL";
    }
    if (flags == gfx::ClearFlagBit::NONE) {
        oss << "NONE";
    }
    return oss.str();
}

struct RenderGraphPrintVisitor : boost::dfs_visitor<> {
    void discover_vertex(
        RenderGraph::vertex_descriptor vertID,
        const AddressableView<RenderGraph> &gv) const {
        const auto &g = gv.mGraph;
        const auto &name = get(RenderGraph::NameTag{}, g, vertID);
        visitObject(
            vertID, gv.mGraph,
            [&](const RasterPass &pass) {
                OSS << "RasterPass \"" << name << "\" {\n";
                indent(space);
                for (const auto &[name, rasterView] : pass.rasterViews) {
                    OSS << "RasterView \"" << name << "\" {\n";
                    {
                        INDENT();
                        OSS << "slotName: \"" << rasterView.slotName << "\";\n";
                        OSS << "accessType: " << getName(rasterView.accessType) << ";\n";
                        OSS << "attachmentType: " << getName(rasterView.attachmentType) << ";\n";
                        OSS << "loadOp: " << getName(rasterView.loadOp) << ";\n";
                        OSS << "storeOp: " << getName(rasterView.storeOp) << ";\n";
                        OSS << "clearFlags: " << getName(rasterView.clearFlags) << ";\n";
                        const auto &c = rasterView.clearColor;
                        if (hasAnyFlags(rasterView.clearFlags, gfx::ClearFlagBit::COLOR)) {
                            OSS << "clearColor: [" << c.x << ", " << c.y << ", " << c.z << ", " << c.z << "];\n";
                        } else if (hasAnyFlags(rasterView.clearFlags, gfx::ClearFlagBit::DEPTH_STENCIL)) {
                            OSS << "clearColor: [" << c.x << ", " << c.y << "];\n";
                        }
                    }
                    OSS << "}\n";
                }
                for (const auto &[name, computeViews] : pass.computeViews) {
                    OSS << "ComputeViews \"" << name << "\" {\n";
                    {
                        INDENT();
                        for (const auto &computeView : computeViews) {
                            OSS << "ComputeView \"" << computeView.name << "\" {\n";
                            {
                                INDENT();
                                OSS << "accessType: " << getName(computeView.accessType) << ";\n";
                                OSS << "clearFlags: " << getName(computeView.clearFlags) << ";\n";
                                const auto &c = computeView.clearValue;
                                if (hasAnyFlags(computeView.clearFlags, gfx::ClearFlagBit::COLOR)) {
                                    OSS << "clearColor: [" << c.x << ", " << c.y << ", " << c.z << ", " << c.z << "];\n";
                                } else if (hasAnyFlags(computeView.clearFlags, gfx::ClearFlagBit::DEPTH_STENCIL)) {
                                    OSS << "clearColor: [" << c.x << ", " << c.y << "];\n";
                                }
                            }
                            OSS << "}\n";
                        }
                    }
                    OSS << "}\n";
                }
            },
            [&](const RasterSubpass &subpass) {
                std::ignore = subpass;
            },
            [&](const ComputeSubpass &subpass) {
                std::ignore = subpass;
            },
            [&](const ComputePass &pass) {
                OSS << "ComputePass \"" << name << "\" {\n";
                indent(space);
                for (const auto &[name, computeViews] : pass.computeViews) {
                    OSS << "ComputeViews \"" << name << "\" {\n";
                    {
                        INDENT();
                        for (const auto &computeView : computeViews) {
                            OSS << "ComputeView \"" << computeView.name << "\" {\n";
                            {
                                INDENT();
                                OSS << "accessType: " << getName(computeView.accessType) << ";\n";
                                OSS << "clearFlags: " << getName(computeView.clearFlags) << ";\n";
                                const auto &c = computeView.clearValue;
                                if (hasAnyFlags(computeView.clearFlags, gfx::ClearFlagBit::COLOR)) {
                                    OSS << "clearColor: [" << c.x << ", " << c.y << ", " << c.z << ", " << c.z << "];\n";
                                } else if (hasAnyFlags(computeView.clearFlags, gfx::ClearFlagBit::DEPTH_STENCIL)) {
                                    OSS << "clearColor: [" << c.x << ", " << c.y << "];\n";
                                }
                            }
                            OSS << "}\n";
                        }
                    }
                    OSS << "}\n";
                }
            },
            [&](const ResolvePass &pass) {
                OSS << "ResolvePass \"" << name << "\" {\n";
                for (const auto &pair : pass.resolvePairs) {
                    INDENT();
                    OSS << "source: \"" << pair.source << "\", target: \"" << pair.target << "\"\n";
                }
                indent(space);
            },
            [&](const CopyPass &pass) {
                OSS << "CopyPass \"" << name << "\" {\n";
                for (const auto &pair : pass.copyPairs) {
                    INDENT();
                    OSS << "source: \"" << pair.source << "\", target: \"" << pair.target << "\"\n";
                }
                indent(space);
            },
            [&](const MovePass &pass) {
                OSS << "MovePass \"" << name << "\" {\n";
                for (const auto &pair : pass.movePairs) {
                    INDENT();
                    OSS << "source: \"" << pair.source << "\", target: \"" << pair.target << "\"\n";
                }
                indent(space);
            },
            [&](const RaytracePass &pass) {
                std::ignore = pass;
                OSS << "RaytracePass \"" << name << "\" {\n";
                indent(space);
            },
            [&](const RenderQueue &queue) {
                OSS << "Queue \"" << name << "\" {\n";
                {
                    INDENT();
                    OSS << "hint: " << getName(queue.hint) << ";\n";
                }
                indent(space);
            },
            [&](const SceneData &scene) {
                std::ignore = scene;
                OSS << "Scene \"" << name << "\" {\n";
                indent(space);
            },
            [&](const Blit &blit) {
                std::ignore = blit;
                OSS << "Blit \"" << name << "\";\n";
            },
            [&](const Dispatch &dispatch) {
                OSS << "Dispatch \"" << name << "\", ["
                    << dispatch.threadGroupCountX << ", "
                    << dispatch.threadGroupCountY << ", "
                    << dispatch.threadGroupCountZ << "];\n";
            },
            [&](const ccstd::pmr::vector<ClearView> &clearViews) {
                OSS << "Clear \"" << name << "\" {\n";
                indent(space);
                for (const auto &view : clearViews) {
                    INDENT();
                    OSS << "\"" << view.slotName << "\" {\n";
                    {
                        INDENT();
                        OSS << "clearFlags: " << getName(view.clearFlags) << ";\n";
                        const auto &c = view.clearColor;
                        if (hasAnyFlags(view.clearFlags, gfx::ClearFlagBit::COLOR)) {
                            OSS << "clearColor: [" << c.x << ", " << c.y << ", " << c.z << ", " << c.z << "];\n";
                        } else if (hasAnyFlags(view.clearFlags, gfx::ClearFlagBit::DEPTH_STENCIL)) {
                            OSS << "clearColor: [" << c.x << ", " << c.y << "];\n";
                        }
                    }
                    OSS << "}\n";
                }
            },
            [&](const gfx::Viewport &vp) {
                OSS << "Viewport \"" << name << "\" ["
                    << "left: " << vp.left << ", "
                    << "top: " << vp.top << ", "
                    << "width: " << vp.width << ", "
                    << "height: " << vp.height << ", "
                    << "minDepth: " << vp.minDepth << ", "
                    << "maxDepth: " << vp.maxDepth << "]\n";
            });
    }

    void finish_vertex(
        RenderGraph::vertex_descriptor vertID,
        const AddressableView<RenderGraph> &gv) const {
        std::ignore = gv;
        visitObject(
            vertID, gv.mGraph,
            [&](const RasterPass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const RasterSubpass &subpass) {
                std::ignore = subpass;
            },
            [&](const ComputeSubpass &subpass) {
                std::ignore = subpass;
            },
            [&](const ComputePass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const ResolvePass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const CopyPass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const MovePass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const RaytracePass &pass) {
                std::ignore = pass;
                unindent(space);
                OSS << "}\n";
            },
            [&](const RenderQueue &queue) {
                std::ignore = queue;
                unindent(space);
                OSS << "}\n";
            },
            [&](const SceneData &scene) {
                std::ignore = scene;
                unindent(space);
                OSS << "}\n";
            },
            [&](const Blit &blit) {
            },
            [&](const Dispatch &dispatch) {
            },
            [&](const ccstd::pmr::vector<ClearView> &clear) {
                std::ignore = clear;
                unindent(space);
                OSS << "}\n";
            },
            [&](const gfx::Viewport &clear) {
            });
    }

    std::ostringstream &oss;
    ccstd::pmr::string &space;
};

} // namespace

ccstd::string RenderGraph::print(
    boost::container::pmr::memory_resource *scratch) const {
    const auto &rg = *this;
    std::ostringstream oss;
    ccstd::pmr::string space(scratch);
    oss << "\n";
    OSS << "RenderGraph {\n";
    {
        INDENT();
        RenderGraphPrintVisitor visitor{
            {}, oss, space};
        AddressableView<RenderGraph> graphView(rg);
        auto colors = rg.colors(scratch);
        boost::depth_first_search(graphView, visitor, get(colors, rg));
    }
    OSS << "}\n";
    return oss.str();
}

} // namespace render

} // namespace cc
