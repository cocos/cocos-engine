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

TEST(barrierTest, test10) {
    // simple graph
    TEST_CASE_1;

    boost::container::pmr::memory_resource* resource = boost::container::pmr::get_default_resource();
    RenderGraph renderGraph(resource);
    ResourceGraph rescGraph(resource);
    LayoutGraphData layoutGraphData(resource);

    fillTestGraph(rasterData, resources, layoutInfo, renderGraph, rescGraph, layoutGraphData);

    FrameGraphDispatcher fgDispatcher(rescGraph, renderGraph, layoutGraphData, resource, resource);
    fgDispatcher.run();

    const auto& barrierMap = fgDispatcher.getBarriers();
    const auto& rag = fgDispatcher.resourceAccessGraph;
    ExpectEq(rag._vertices.size() == 4, true);

    // head
    const auto& head = barrierMap.at(0);
    ExpectEq(head.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(head.blockBarrier.rearBarriers.empty(), true);

    // 1st node
    const auto& node1 = barrierMap.at(1);
    //ExpectEq(node1.blockBarrier.frontBarriers.size() == 4, true);
    //ExpectEq(node1.blockBarrier.rearBarriers.size() == 1, true);

    // undefined external
    ExpectEq(node1.subpassBarriers[0].frontBarriers.size() == 3, true);
    ExpectEq(node1.subpassBarriers[0].rearBarriers.size() == 3, true);

    // undefined external
    ExpectEq(node1.subpassBarriers[1].frontBarriers.size() == 1, true);
    ExpectEq(node1.subpassBarriers[1].rearBarriers.size() == 1, true);

    //const auto& barrier = node1.blockBarrier.rearBarriers[0];
    //ExpectEq(barrier.type == BarrierType::FULL, true);
    //ExpectEq(barrier.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ////resID 3
    //ExpectEq(barrier.beginStatus.visibility == std::get<2>(layoutInfo[0][3]), true);

    //// 2nd node
    const auto& node2 = barrierMap.at(2);
    ExpectEq(node2.blockBarrier.frontBarriers.size(), 0);
    ExpectEq(node2.blockBarrier.rearBarriers.size() == 1, true);

    const auto& node2RearBarrier0 = node2.blockBarrier.rearBarriers.back();
    ExpectEq(node2RearBarrier0.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(node2RearBarrier0.beginStatus.visibility == ShaderStageFlagBit::FRAGMENT, true);
    ExpectEq(node2RearBarrier0.endStatus.accessFlag == AccessFlagBit::PRESENT, true);
    //endstatus: whatever it was, it's COLOR_ATTACHMENT_OPTIMAL

    //runTestGraph(renderGraph, rescGraph, layoutGraphData, fgDispatcher);
}
