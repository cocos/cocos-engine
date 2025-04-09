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

#include <boost/graph/depth_first_search.hpp>
#include <boost/container/static_vector.hpp>
// #include <boost/graph/filtered_graph.hpp>
// #include "LayoutGraphGraphs.h"
// #include "LayoutGraphUtils.h"
// #include "NativeExecutorRenderGraph.h"
#include "NativePipelineTypes.h"
// #include "NativeUtils.h"
// #include "RenderGraphGraphs.h"
#include "details/GraphView.h"
// #include "details/GslUtils.h"
// #include "details/Range.h"

namespace cc {

namespace render {

namespace {

struct DescriptorSetVisitorContext {
    NativePipeline& pipeline;
    LayoutGraphData& layoutGraph;
    const RenderGraph& renderGraph;
    LayoutGraphData::vertex_descriptor defaultPassLayoutID = LayoutGraphData::null_vertex();
    RenderGraph::vertex_descriptor passID = RenderGraph::null_vertex();
    LayoutGraphData::vertex_descriptor passLayoutID = LayoutGraphData::null_vertex();
    RenderGraph::vertex_descriptor queueID = RenderGraph::null_vertex();
    LayoutGraphData::vertex_descriptor queueLayoutID = LayoutGraphData::null_vertex();

    boost::container::static_vector<const RenderData*, 6> mRenderDataStack;
    // boost::container::static_vector<DeviceRenderData*, 5> mPerPassDeviceRenderDataStack;
    // boost::container::static_vector<DeviceRenderData*, 4> mPerQueueDeviceRenderDataStack;
};

struct DescriptorSetVisitor : boost::dfs_visitor<> {
    void discover_vertex(
        RenderGraph::vertex_descriptor vertID,
        const AddressableView<RenderGraph>& gv) const {
        const auto&g = ctx.renderGraph;

    }

    DescriptorSetVisitorContext& ctx;
};

} // namespace

void NativePipeline::prepareDescriptorSets(RenderGraph::vertex_descriptor passID) {
    //#if CC_DEBUG
//    ctx.cmdBuff->beginMarker(makeMarkerInfo("Upload", RASTER_UPLOAD_COLOR));
//#endif
    // auto colors = ctx.g.colors(ctx.scratch);
    // RenderGraphUploadVisitor visitor{{}, ctx};
    // AddressableView<RenderGraph> graphView(ctx.g);
    // boost::depth_first_visit(graphView, passID, visitor, get(colors, ctx.g));

    // if (holds<RasterPassTag>(passID, ctx.g)) {
    //     const auto& pass = get(RasterPassTag{}, passID, ctx.g);
    //     if (pass.showStatistics) {
    //         prepareStatisticsDescriptorSet(ctx, passID);
    //     }
    // }
//#if CC_DEBUG
//    ctx.cmdBuff->endMarker();
//#endif
}

} // namespace render

} // namespace cc
