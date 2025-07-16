/****************************************************************************
Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include "cocos/renderer/pipeline/custom/FGDispatcherGraphs.h"
#include "cocos/renderer/pipeline/custom/test/test.h"
#include "gfx-base/GFXDef-common.h"
#include "gtest/gtest.h"
#include "utils.h"

#if BRANCH_CULLING
TEST(fgDispatherCulling, test13) {
    // simple graph
    TEST_CASE_4;

    boost::container::pmr::memory_resource* resource = boost::container::pmr::get_default_resource();
    RenderGraph renderGraph(resource);
    ResourceGraph rescGraph(resource);
    LayoutGraphData layoutGraphData(resource);

    fillTestGraph(rasterData, resources, layoutInfo, renderGraph, rescGraph, layoutGraphData);

    FrameGraphDispatcher fgDispatcher(rescGraph, renderGraph, layoutGraphData, resource, resource);
    fgDispatcher.run();

    const auto& barrierMap = fgDispatcher.getBarriers();
    const auto& rag = fgDispatcher.resourceAccessGraph;
    ExpectEq(rag.access.size() == 12, true);

    ExpectEq(rag.leafPasses.size() == 6, true);

    // 5, 7, 8, 9, 10 are leaf passes in real, logically they may attached to present pass
    // 5: writes to an externalRes, reserved;
    // 7: writes no externalRes, culled
    // 8: subpass with writing to externalRes, reserved;
    // 9: subpass with read on externalRes, no writes to any external, culled;
    // 10: writes to an backbuffer, reserved;
    //
    // 11: present pass, reserved.

    ExpectEq(rag.leafPasses.find(5) != rag.leafPasses.end(), true);
    ExpectEq(rag.leafPasses.find(7) != rag.leafPasses.end(), true);
    ExpectEq(rag.leafPasses.find(8) != rag.leafPasses.end(), true);
    ExpectEq(rag.leafPasses.find(9) != rag.leafPasses.end(), true);
    ExpectEq(rag.leafPasses.find(10) != rag.leafPasses.end(), true);

    // an empty vert as head so index offset + 1
    const auto& node5 = get(ResourceAccessGraph::AccessNodeTag{}, rag, static_cast<ResourceAccessGraph::vertex_descriptor>(5));
    const auto& node7 = get(ResourceAccessGraph::AccessNodeTag{}, rag, static_cast<ResourceAccessGraph::vertex_descriptor>(7));
    const auto& node8 = get(ResourceAccessGraph::AccessNodeTag{}, rag, static_cast<ResourceAccessGraph::vertex_descriptor>(8));
    const auto& node9 = get(ResourceAccessGraph::AccessNodeTag{}, rag, static_cast<ResourceAccessGraph::vertex_descriptor>(9));
    const auto& node10 = get(ResourceAccessGraph::AccessNodeTag{}, rag, static_cast<ResourceAccessGraph::vertex_descriptor>(10));
    ExpectEq(!node5.attachmentStatus.empty() && node5.nextSubpass == nullptr &&
                 node7.attachmentStatus.empty() && node7.nextSubpass == nullptr &&
                 !node8.attachmentStatus.empty() && node8.nextSubpass != nullptr &&
                 node9.attachmentStatus.empty() && node9.nextSubpass == nullptr &&
                 !node10.attachmentStatus.empty() && node10.nextSubpass == nullptr,
             true);

    ExpectEq(in_degree(5, rag) != 0 && out_degree(5, rag) != 0 &&
                 in_degree(7, rag) == 0 && out_degree(7, rag) == 0 &&
                 in_degree(8, rag) != 0 && out_degree(8, rag) != 0 &&
                 in_degree(9, rag) == 0 && out_degree(9, rag) == 0,
             true);

    // 6, 7, 9 were culled.
    // 6 was culled because after leaf 7 was culled, 6 itself becomes a non-writing-externalRes leaf.
    ExpectEq(rag.culledPasses.size() == 3, true);
    ExpectEq(rag.culledPasses.find(6) != rag.culledPasses.end() &&
                 rag.culledPasses.find(7) != rag.culledPasses.end() &&
                 rag.culledPasses.find(9) != rag.culledPasses.end(),
             true);

    // runTestGraph(renderGraph, rescGraph, layoutGraphData, fgDispatcher);
}
#endif
