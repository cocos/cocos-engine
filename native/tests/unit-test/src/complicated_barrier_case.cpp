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

    const auto& barrierMap = fgDispatcher.getBarriers();
    const auto& rag = fgDispatcher.resourceAccessGraph;
    ExpectEq(rag._vertices.size() == 17, true);

    // head
    const auto& head = barrierMap.at(0);
    ExpectEq(head.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(head.blockBarrier.rearBarriers.empty(), true);
    ExpectEq(head.subpassBarriers.empty(), true);

    // 1st node
    const auto& node1 = barrierMap.at(1);
    ExpectEq(node1.blockBarrier.frontBarriers.size() == 2, true);
    ExpectEq(node1.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node1.subpassBarriers.empty(), false);

    //block barrier: what comes in and what comes out, no matter how many subpasses inside.
    ExpectEq(node1.blockBarrier.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node1.blockBarrier.rearBarriers[0].resourceID == 1, true);
    ExpectEq(node1.blockBarrier.rearBarriers[0].beginStatus.vertID == 1, true);
    ExpectEq(node1.blockBarrier.rearBarriers[0].beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(node1.blockBarrier.rearBarriers[0].endStatus.vertID == 1, true);
    ExpectEq(node1.blockBarrier.rearBarriers[0].endStatus.access == MemoryAccessBit::READ_ONLY, true);

    //subpass barrier: like normal pass
    const auto& node1subpass = node1.subpassBarriers;
    ExpectEq(node1subpass[0].frontBarriers.empty(), true);
    ExpectEq(node1subpass[0].rearBarriers.size() == 1, true);
    const auto& node1subpassres0 = node1subpass[0].rearBarriers[0];
    ExpectEq(node1subpassres0.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node1subpassres0.resourceID == 0, true);
    ExpectEq(node1subpassres0.beginStatus.vertID == 1, true);
    ExpectEq(node1subpassres0.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(node1subpassres0.beginStatus.passType == PassType::RASTER, true);
    ExpectEq(node1subpassres0.endStatus.vertID == 1, true);
    ;
    ExpectEq(node1subpassres0.endStatus.access == MemoryAccessBit::READ_ONLY, true);
    ExpectEq(node1subpassres0.endStatus.passType == PassType::RASTER, true);

    ExpectEq(node1subpass[1].frontBarriers.empty(), true);
    const auto& node1subpassres1 = node1subpass[1].rearBarriers[0];
    ExpectEq(node1subpassres1.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node1subpassres1.resourceID == 1, true);
    ExpectEq(node1subpassres1.beginStatus.vertID == 1, true);
    ExpectEq(node1subpassres1.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(node1subpassres1.beginStatus.passType == PassType::RASTER, true);
    ExpectEq(node1subpassres1.endStatus.vertID == 1, true);
    ;
    ExpectEq(node1subpassres1.endStatus.access == MemoryAccessBit::READ_ONLY, true);
    ExpectEq(node1subpassres1.endStatus.passType == PassType::RASTER, true);

    //node2
    const auto& node2 = barrierMap.at(2);
    ExpectEq(node2.blockBarrier.frontBarriers.size() == 2, true);
    ExpectEq(node2.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node2.subpassBarriers.size() == 2, true);

    const auto& node2blockRear = node2.blockBarrier.rearBarriers;
    auto iter3in2 = findBarrierByResID(node2blockRear, 3);
    const auto& res3in2 = (*iter3in2);
    ExpectEq(res3in2.resourceID == 3, true);
    ExpectEq(res3in2.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(res3in2.beginStatus.vertID == 2, true);
    ExpectEq(res3in2.beginStatus.passType == PassType::RASTER, true);
    ExpectEq(res3in2.endStatus.vertID == 2, true);
    ExpectEq(res3in2.endStatus.passType == PassType::RASTER, true);

    const auto& node2subpass = node2.subpassBarriers;
    ExpectEq(node2subpass.empty(), false);
    ExpectEq(node2subpass[0].frontBarriers.empty(), true);
    ExpectEq(node2subpass[0].rearBarriers.empty(), false);

    const auto& node2subpassRes2 = node2subpass[0].rearBarriers[0];
    ExpectEq(node2subpassRes2.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node2subpassRes2.resourceID == 2, true);
    ExpectEq(node2subpassRes2.beginStatus.vertID == 2, true);
    ExpectEq(node2subpassRes2.beginStatus.passType == PassType::RASTER, true);
    ExpectEq(node2subpassRes2.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(node2subpassRes2.endStatus.vertID == 2, true);
    ExpectEq(node2subpassRes2.endStatus.access == MemoryAccessBit::READ_ONLY, true);

    //node3
    const auto& node3 = barrierMap.at(3);
    ExpectEq(node3.blockBarrier.frontBarriers.size() == 1, true);
    ExpectEq(node3.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node3.subpassBarriers.empty(), true);

    const auto& node3block = node3.blockBarrier;
    ExpectEq(node3block.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node3block.rearBarriers[0].resourceID == 4, true);
    ExpectEq(node3block.rearBarriers[0].beginStatus.vertID == 3, true);
    ExpectEq(node3block.rearBarriers[0].beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(node3block.rearBarriers[0].endStatus.vertID == 3, true);
    ExpectEq(node3block.rearBarriers[0].endStatus.access == MemoryAccessBit::READ_ONLY, true);

    //node4
    const auto& node4 = barrierMap.at(4);
    ExpectEq(node4.blockBarrier.frontBarriers.size() == 2, true);
    ExpectEq(node4.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node4.subpassBarriers.empty(), false);

    const auto& node4block = node4.blockBarrier;
    auto iter5in4 = findBarrierByResID(node4block.rearBarriers, 5);
    ExpectEq(iter5in4 == node4block.rearBarriers.end(), true);

    auto iter6in4 = findBarrierByResID(node4block.rearBarriers, 6);
    ExpectEq(iter6in4 != node4block.rearBarriers.end(), true);
    ExpectEq((*iter6in4).type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq((*iter6in4).resourceID == 6, true);
    ExpectEq((*iter6in4).beginStatus.vertID == 4, true);
    ExpectEq((*iter6in4).endStatus.vertID == 14, true);

    const auto& node4subpass0 = node4.subpassBarriers[0];
    ExpectEq(node4subpass0.frontBarriers.empty(), true);
    ExpectEq(node4subpass0.rearBarriers.size() == 1, true);
    ExpectEq(node4subpass0.rearBarriers[0].type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(node4subpass0.rearBarriers[0].resourceID == 5, true);
    ExpectEq(node4subpass0.rearBarriers[0].beginStatus.vertID == 4, true);
    ExpectEq(node4subpass0.rearBarriers[0].beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(node4subpass0.rearBarriers[0].endStatus.vertID == 4, true);
    ExpectEq(node4subpass0.rearBarriers[0].endStatus.access == MemoryAccessBit::READ_ONLY, true);

    const auto& node4subpass1 = node4.subpassBarriers[1];
    ExpectEq(node4subpass1.frontBarriers.empty(), true);
    ExpectEq(node4subpass1.rearBarriers.size() == 1, true);
    ExpectEq(node4subpass1.rearBarriers[0].type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq(node4subpass1.rearBarriers[0].resourceID == 6, true);
    ExpectEq(node4subpass1.rearBarriers[0].beginStatus.vertID == 4, true);
    ExpectEq(node4subpass1.rearBarriers[0].beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(node4subpass1.rearBarriers[0].endStatus.vertID == 14, true);
    ExpectEq(node4subpass1.rearBarriers[0].endStatus.access == MemoryAccessBit::READ_ONLY, true);

    const auto& node5 = barrierMap.at(5);
    ExpectEq(node5.blockBarrier.frontBarriers.size() == 1, true);
    ExpectEq(node5.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node5.subpassBarriers.empty(), true);

    auto iter7in5 = findBarrierByResID(node5.blockBarrier.rearBarriers, 7);
    const auto& res7in5 = (*iter7in5);
    ExpectEq(res7in5.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(res7in5.resourceID == 7, true);
    ExpectEq(res7in5.beginStatus.vertID == 5, true);
    ExpectEq(res7in5.endStatus.vertID == 5, true);
    ExpectEq(res7in5.beginStatus.passType == PassType::COMPUTE, true);
    ExpectEq(res7in5.endStatus.passType == PassType::COPY, true);
    ExpectEq(res7in5.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(res7in5.endStatus.access == MemoryAccessBit::READ_ONLY, true);

    const auto& node6 = barrierMap.at(6);
    ExpectEq(node6.blockBarrier.frontBarriers.size() == 1, true);
    ExpectEq(node6.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node6.subpassBarriers.empty(), true);

    auto iter8in6 = findBarrierByResID(node6.blockBarrier.rearBarriers, 8);
    const auto& res8in6 = (*iter8in6);
    ExpectEq(res8in6.type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq(res8in6.resourceID == 8, true);
    ExpectEq(res8in6.beginStatus.vertID == 6, true);
    ExpectEq(res8in6.endStatus.vertID == 13, true);
    ExpectEq(res8in6.beginStatus.passType == PassType::COPY, true);
    ExpectEq(res8in6.endStatus.passType == PassType::RASTER, true);
    ExpectEq(res8in6.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(res8in6.endStatus.access == MemoryAccessBit::READ_ONLY, true);

    // node7
    const auto& node7 = barrierMap.at(7);
    ExpectEq(node7.blockBarrier.frontBarriers.size() == 1, true);
    ExpectEq(node7.blockBarrier.rearBarriers.empty(), false);
    ExpectEq(node7.subpassBarriers.empty(), true);

    auto iter9in7 = findBarrierByResID(node7.blockBarrier.rearBarriers, 9);
    const auto& res9in7 = (*iter9in7);
    ExpectEq(res9in7.type == cc::gfx::BarrierType::SPLIT_BEGIN, true);
    ExpectEq(res9in7.resourceID == 9, true);
    ExpectEq(res9in7.beginStatus.vertID == 7, true);
    ExpectEq(res9in7.endStatus.vertID == 10, true);
    ExpectEq(res9in7.beginStatus.passType == PassType::COMPUTE, true);
    ExpectEq(res9in7.endStatus.passType == PassType::RASTER, true);

    //node8: almost the same as node7
    //node9: almost the same as node8
    //node10: ditto
    //node11: ditto
    //node12: ditto

    //node13
    const auto& node13 = barrierMap.at(13);
    ExpectEq(node13.blockBarrier.frontBarriers.size() == 3, true);
    ExpectEq(node13.blockBarrier.rearBarriers.size() == 1, true);
    ExpectEq(node13.subpassBarriers.empty(), true);

    auto iter8in13 = findBarrierByResID(node13.blockBarrier.frontBarriers, 8);
    const auto& res8in13 = (*iter8in13);
    ExpectEq(res8in13.type == cc::gfx::BarrierType::SPLIT_END, true);
    ExpectEq(res8in13.resourceID == 8, true);
    ExpectEq(res8in13.beginStatus.vertID == 6, true);
    ExpectEq(res8in13.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(res8in13.beginStatus.passType == PassType::COPY, true);
    ExpectEq(res8in13.endStatus.vertID == 13, true);
    ExpectEq(res8in13.endStatus.access == MemoryAccessBit::READ_ONLY, true);
    ExpectEq(res8in13.endStatus.passType == PassType::RASTER, true);

    auto iter10in13 = findBarrierByResID(node13.blockBarrier.frontBarriers, 10);
    const auto& res10in13 = (*iter10in13);
    ExpectEq(res10in13.type == cc::gfx::BarrierType::SPLIT_END, true);
    ExpectEq(res10in13.resourceID == 10, true);
    ExpectEq(res10in13.beginStatus.vertID == 10, true);
    ExpectEq(res10in13.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(res10in13.beginStatus.passType == PassType::RASTER, true);
    ExpectEq(res10in13.endStatus.vertID == 13, true);
    ExpectEq(res10in13.endStatus.access == MemoryAccessBit::READ_ONLY, true);
    ExpectEq(res10in13.endStatus.passType == PassType::RASTER, true);

    auto iter11in13 = findBarrierByResID(node13.blockBarrier.rearBarriers, 11);
    const auto& res11in13 = (*iter11in13);
    ExpectEq(res11in13.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(res11in13.resourceID == 11, true);
    ExpectEq(res11in13.beginStatus.vertID == 13, true);
    ExpectEq(res11in13.beginStatus.access == MemoryAccessBit::WRITE_ONLY, true);
    ExpectEq(res11in13.beginStatus.passType == PassType::RASTER, true);
    ExpectEq(res11in13.endStatus.vertID == 13, true);
    ExpectEq(res11in13.endStatus.access == MemoryAccessBit::READ_ONLY, true);
    ExpectEq(res11in13.endStatus.passType == PassType::RASTER, true);

    //node14: almost the same as 13

    //node15: ditto
    const auto& node15 = barrierMap.at(15);
    const auto& theone = node15.blockBarrier.rearBarriers.front();
    ExpectEq(theone.resourceID == 22, true);
    ExpectEq(theone.type == cc::gfx::BarrierType::FULL, true);
    ExpectEq(theone.endStatus.vertID == 0xFFFFFFFF, true);

    //node16
    const auto& node16 = barrierMap.at(16);
    ExpectEq(node16.blockBarrier.frontBarriers.empty(), true);
    ExpectEq(node16.blockBarrier.rearBarriers.empty(), true);
    ExpectEq(node16.subpassBarriers.empty(), true);

    //runTestGraph(renderGraph, rescGraph, layoutGraphData, fgDispatcher);
}
