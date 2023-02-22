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

TEST(simpleClosedBarrierTest, test11) {
    // simple graph
    TEST_CASE_2;

    boost::container::pmr::memory_resource* resource = boost::container::pmr::get_default_resource();
    RenderGraph renderGraph(resource);
    ResourceGraph rescGraph(resource);
    LayoutGraphData layoutGraphData(resource);

    fillTestGraph(rasterData, resources, layoutInfo, renderGraph, rescGraph, layoutGraphData);

    FrameGraphDispatcher fgDispatcher(rescGraph, renderGraph, layoutGraphData, resource, resource);
    fgDispatcher.run();

    const auto& barrierMap = fgDispatcher.getBarriers();
    const auto& rag = fgDispatcher.resourceAccessGraph;
    ExpectEq(rag._vertices.size() == 10, true);

    // head
    const auto& head = barrierMap.at(0);
    ExpectEq(head.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(head.blockBarrier.rearBarriers.empty(), true);
    ExpectEq(head.subpassBarriers.empty(), true);

    // 1st node
    const auto& node1 = barrierMap.at(1);
    ExpectEq(node1.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(node1.blockBarrier.rearBarriers.size() == 2, true);
    ExpectEq(node1.subpassBarriers.empty(), true);

    ExpectEq(node1.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node1.blockBarrier.rearBarriers[0].endStatus.vertID == 1, true);
    ExpectEq(node1.blockBarrier.rearBarriers[1].type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq(node1.blockBarrier.rearBarriers[1].endStatus.vertID == 3, true);

    const auto& node2 = barrierMap.at(2);
    ExpectEq(node2.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(node2.blockBarrier.rearBarriers.size() == 2, true);
    ExpectEq(node2.subpassBarriers.empty(), true);

    // res3
    ExpectEq(node2.blockBarrier.rearBarriers[1].type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq(node2.blockBarrier.rearBarriers[1].beginStatus.vertID == 2, true);
    ExpectEq(node2.blockBarrier.rearBarriers[1].endStatus.vertID == 5, true);
    // res2
    ExpectEq(node2.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq(node2.blockBarrier.rearBarriers[0].beginStatus.vertID == 2, true);
    ExpectEq(node2.blockBarrier.rearBarriers[0].endStatus.vertID == 4, true);

    const auto& node3 = barrierMap.at(3);
    ExpectEq(node3.blockBarrier.frontBarriers.size() == 1, true);
    ExpectEq(node3.blockBarrier.rearBarriers.size() == 2, true);
    ExpectEq(node3.subpassBarriers.empty(), true);

    ExpectEq(node3.blockBarrier.frontBarriers[0].type == cc::gfx::BarrierType::SPLIT_END, true);
    ExpectEq(node3.blockBarrier.frontBarriers[0].beginStatus.vertID == 1, true);
    ExpectEq(node3.blockBarrier.frontBarriers[0].endStatus.vertID == 3, true);
    // res 5
    ExpectEq(node3.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node3.blockBarrier.rearBarriers[0].beginStatus.vertID == 3, true);
    ExpectEq(node3.blockBarrier.rearBarriers[0].endStatus.vertID == 3, true);
    // res 4
    ExpectEq(node3.blockBarrier.rearBarriers[1].type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq(node3.blockBarrier.rearBarriers[1].beginStatus.vertID == 3, true);
    ExpectEq(node3.blockBarrier.rearBarriers[1].endStatus.vertID == 5, true);

    const auto& node4 = barrierMap.at(4);
    ExpectEq(node4.blockBarrier.frontBarriers.size() == 1, true);
    ExpectEq(node4.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node4.subpassBarriers.empty(), true);

    ExpectEq(node4.blockBarrier.frontBarriers[0].resourceID == 3, true);
    ExpectEq(node4.blockBarrier.frontBarriers[0].type == cc::gfx::BarrierType::SPLIT_END, true);
    ExpectEq(node4.blockBarrier.frontBarriers[0].beginStatus.vertID == 2, true);
    ExpectEq(node4.blockBarrier.frontBarriers[0].endStatus.vertID == 4, true);

    ExpectEq(node4.blockBarrier.rearBarriers[0].resourceID == 6, true);
    ExpectEq(node4.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node4.blockBarrier.rearBarriers[0].beginStatus.vertID == 4, true);
    ExpectEq(node4.blockBarrier.rearBarriers[0].endStatus.vertID == 4, true);

    const auto& node5 = barrierMap.at(5);
    ExpectEq(node5.blockBarrier.frontBarriers.size() == 2, true);
    ExpectEq(node5.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node5.subpassBarriers.empty(), true);

    ExpectEq(node5.blockBarrier.frontBarriers[0].resourceID == 2, true);
    ExpectEq(node5.blockBarrier.frontBarriers[0].type == cc::gfx::BarrierType::SPLIT_END, true);
    ExpectEq(node5.blockBarrier.frontBarriers[0].beginStatus.vertID == 2, true);
    ExpectEq(node5.blockBarrier.frontBarriers[0].endStatus.vertID == 5, true);
    ExpectEq(node5.blockBarrier.frontBarriers[1].resourceID == 4, true);
    ExpectEq(node5.blockBarrier.frontBarriers[1].type == cc::gfx::BarrierType::SPLIT_END, true);
    ExpectEq(node5.blockBarrier.frontBarriers[1].beginStatus.vertID == 3, true);
    ExpectEq(node5.blockBarrier.frontBarriers[1].endStatus.vertID == 5, true);

    ExpectEq(node5.blockBarrier.rearBarriers[0].resourceID == 7, true);
    ExpectEq(node5.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq(node5.blockBarrier.rearBarriers[0].beginStatus.vertID == 5, true);
    ExpectEq(node5.blockBarrier.rearBarriers[0].endStatus.vertID == 8, true);

    const auto& node6 = barrierMap.at(6);
    ExpectEq(node6.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(node6.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node6.subpassBarriers.empty(), true);

    ExpectEq(node6.blockBarrier.rearBarriers[0].resourceID == 8, true);
    ExpectEq(node6.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node6.blockBarrier.rearBarriers[0].beginStatus.vertID == 6, true);
    ExpectEq(node6.blockBarrier.rearBarriers[0].endStatus.vertID == 6, true);

    const auto& node7 = barrierMap.at(7);
    ExpectEq(node7.subpassBarriers.empty(), true);
    ExpectEq(node7.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(node7.blockBarrier.rearBarriers.size() == 1, true);

    ExpectEq(node7.blockBarrier.rearBarriers[0].resourceID == 9, true);
    ExpectEq(node7.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node7.blockBarrier.rearBarriers[0].beginStatus.vertID == 7, true);
    ExpectEq(node7.blockBarrier.rearBarriers[0].endStatus.vertID == 7, true);

    const auto& node8 = barrierMap.at(8);
    ExpectEq(node8.subpassBarriers.empty(), true);
    ExpectEq(node8.blockBarrier.frontBarriers.empty(), false); // size == 1
    ExpectEq(node8.blockBarrier.rearBarriers.size() == 1, true);

    ExpectEq(node8.blockBarrier.frontBarriers[0].resourceID == 7, true);
    ExpectEq(node8.blockBarrier.frontBarriers[0].type == cc::gfx::BarrierType::SPLIT_END, true);
    ExpectEq(node8.blockBarrier.frontBarriers[0].beginStatus.vertID == 5, true);
    ExpectEq(node8.blockBarrier.frontBarriers[0].endStatus.vertID == 8, true);

    ExpectEq(node8.blockBarrier.rearBarriers[0].resourceID == 10, true);
    ExpectEq(node8.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node8.blockBarrier.rearBarriers[0].beginStatus.vertID == 8, true);
    ExpectEq(node8.blockBarrier.rearBarriers[0].endStatus.vertID == 8, true);

    const auto& node9 = barrierMap.at(9);
    ExpectEq(node9.subpassBarriers.empty(), true);
    ExpectEq(node9.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(node9.blockBarrier.rearBarriers.empty(), true);
    // const auto& node2RearBarrier0 = node2.blockBarrier.rearBarriers.back();
    // ExpectEq(node2RearBarrier0.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    // ExpectEq(node2RearBarrier0.beginStatus.visibility == ShaderStageFlagBit::VERTEX, true);
    // ExpectEq(node2RearBarrier0.endStatus.access == MemoryAccessBit::READ_ONLY, true);
    //endstatus: whatever it was, it's COLOR_ATTACHMENT_OPTIMAL

    //runTestGraph(renderGraph, rescGraph, layoutGraphData, fgDispatcher);
}
