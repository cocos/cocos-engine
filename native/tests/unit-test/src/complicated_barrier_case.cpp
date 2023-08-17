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
#include "cocos/renderer/pipeline/custom/test/test.h"
#include "gfx-base/GFXDef-common.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(complicatedBarrierTest, test12) {
    // simple graph
    TEST_CASE_3;

    boost::container::pmr::memory_resource* resource = boost::container::pmr::get_default_resource();
    RenderGraph renderGraph(resource);
    ResourceGraph rescGraph(resource);
    LayoutGraphData layoutGraphData(resource);

    fillTestGraph(rasterData, resources, layoutInfo, renderGraph, rescGraph, layoutGraphData);

    FrameGraphDispatcher fgDispatcher(rescGraph, renderGraph, layoutGraphData, resource, resource);
    fgDispatcher.run();

    auto findBarrierByResID = [](const std::vector<Barrier>& barriers, uint32_t resID) {
        return std::find_if(std::begin(barriers), std::end(barriers), [resID](const Barrier& barrier) {
            return barrier.resourceID == resID;
        });
    };

    const auto& barrierMap = fgDispatcher.resourceAccessGraph.barrier;
    const auto& rag = fgDispatcher.resourceAccessGraph;
    ExpectEq(rag._vertices.size() == 23, true);

    // head
    const auto& head = barrierMap.at(0);
    ExpectEq(head.frontBarriers.empty(), true);
    ExpectEq(head.rearBarriers.empty(), true);

    // 1st node
    const auto& node1 = barrierMap.at(1);
    // block barrier: replace by rnderpass info, same below
    //ExpectEq(node1.blockBarrier.frontBarriers.size() == 2, true);
    //ExpectEq(node1.blockBarrier.rearBarriers.size() == 1, true);

    //node3
    // renderpass info layout instead
    const auto& node3 = barrierMap.at(7);
    ExpectEq(node3.frontBarriers.empty(), true);
    ExpectEq(node3.rearBarriers.empty(), true);

    const auto& node11 = barrierMap.at(11);
    ExpectEq(node11.frontBarriers.size() == 1, true);
    ExpectEq(node11.rearBarriers.size() == 1, true);

    auto iter7in11 = findBarrierByResID(node11.rearBarriers, 7);
    const auto& res7in11 = (*iter7in11);
    ExpectEq(res7in11.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(res7in11.resourceID == 7, true);
    ExpectEq(res7in11.beginStatus.accessFlag == AccessFlagBit::TRANSFER_WRITE, true);
    ExpectEq(res7in11.endStatus.accessFlag == AccessFlagBit::TRANSFER_READ, true);

    const auto& node12 = barrierMap.at(12);
    ExpectEq(node12.frontBarriers.size() == 1, true);
    // resource later used by raster pass, so that layout can be transferred automatically.
    ExpectEq(node12.rearBarriers.empty(), true);

    // node7
    const auto& node13 = barrierMap.at(13);
    // undefined layout already in initial layout
    ExpectEq(node13.frontBarriers.empty(), true);
    ExpectEq(node13.rearBarriers.empty(), true);

    //node13
    const auto& node19 = barrierMap.at(19);
    ExpectEq(node19.frontBarriers.size(), 0);
    ExpectEq(node19.rearBarriers.size(), 0);

    //node14: almost the same as 13

    //node15: ditto
    const auto& node21 = barrierMap.at(21);
    const auto& theone = node21.rearBarriers.front();
    ExpectEq(theone.resourceID == 22, true);
    ExpectEq(theone.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(theone.endStatus.accessFlag == AccessFlagBit::PRESENT, true);

    //node16
    const auto& node16 = barrierMap.at(16);
    ExpectEq(node16.frontBarriers.empty(), true);
    ExpectEq(node16.rearBarriers.empty(), true);

    //runTestGraph(renderGraph, rescGraph, layoutGraphData, fgDispatcher);
}
