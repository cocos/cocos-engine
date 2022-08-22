#include "NativeExecutor.h"
#include <boost/graph/depth_first_search.hpp>
#include "GraphTypes.h"
#include "Pmr.h"
#include "RenderGraphGraphs.h"
#include "RenderGraphTypes.h"
#include "GraphView.h"
#include "renderer/frame-graph/FrameGraph.h"

namespace cc {

namespace render {

struct RenderGraphFrameGraphVisitor : boost::dfs_visitor<> {
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
    framegraph::FrameGraph& fg;
    boost::container::pmr::memory_resource* scratch = nullptr;
};

} // namespace render

} // namespace cc
