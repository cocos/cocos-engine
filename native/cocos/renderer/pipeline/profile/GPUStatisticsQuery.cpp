/****************************************************************************
 Copyright (c) 2023-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

#include "GPUStatisticsQuery.h"
#include "gfx-base/GFXDevice.h"
#include "base/TypeDef.h"

namespace cc::render {

static constexpr uint32_t MAX_FRAME_INFLIGHT = 2; // from device agent

namespace {

uint32_t getStatsCount(const gfx::PipelineStatisticFlags &flags) {
    uint32_t res = 0;
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::IA_VERTICES)) ++res;
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::IA_PRIMITIVES)) ++res;
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::VS_INVOCATIONS)) ++res;
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::CLIP_INVOCATIONS)) ++res;
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::CLIP_PRIMITIVES)) ++res;
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::FS_INVOCATIONS)) ++res;
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::CS_INVOCATIONS)) ++res;
    return res;
}

} // namespace

const uint64_t* GPUStatisticsQuery::getReadBuffer() const {
    const auto* ptr = reinterpret_cast<const uint8_t *>(_results.data());
    const uint64_t readIndex = (_frameIndex + MAX_FRAME_INFLIGHT - 1) % MAX_FRAME_INFLIGHT;
    return reinterpret_cast<const uint64_t *>(ptr + readIndex * _dataSize);
}

GPUPipelineStats GPUStatisticsQuery::resolveData(uint32_t id) const {
    GPUPipelineStats stats = {};

    const uint64_t *ptr = getReadBuffer() + id * _dataCount;
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::IA_VERTICES)) {
        stats.iaVertices = *ptr;
        ptr++;
    }
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::IA_PRIMITIVES)) {
        stats.iaPrimitives = *ptr;
        ptr++;
    }
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::VS_INVOCATIONS)) {
        stats.vsInvocations = *ptr;
        ptr++;
    }
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::CLIP_INVOCATIONS)) {
        stats.clipInvocations = *ptr;
        ptr++;
    }
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::CLIP_PRIMITIVES)) {
        stats.clipPrimitives = *ptr;
        ptr++;
    }
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::FS_INVOCATIONS)) {
        stats.fsInvocations = *ptr;
        ptr++;
    }
    if (hasFlag(flags, gfx::PipelineStatisticFlagBit::CS_INVOCATIONS)) {
        stats.csInvocations = *ptr;
    }
    return stats;
}

void GPUStatisticsQuery::resize(uint32_t size) {
    if (size <= _capacity) {
        return;
    }

    _capacity = size;

    auto *device = gfx::Device::getInstance();

    device->getSupportedPipelineStatisticFlags(gfx::PipelineStatisticFlagBit::ALL, flags);
    _dataCount = getStatsCount(flags);
    _dataSize = _capacity * _dataCount * sizeof(uint64_t);

    gfx::QueryPoolInfo poolInfo = {};
    poolInfo.type = gfx::QueryType::PIPELINE_STATISTICS;
    poolInfo.maxQueryObjects = _capacity;
    poolInfo.pipelineStatisticFlags = flags;

    _queryPool = device->createQueryPool(poolInfo);

    gfx::BufferInfo bufferInfo = {};
    bufferInfo.usage = gfx::BufferUsageBit::TRANSFER_DST;
    bufferInfo.memUsage = gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE;
    bufferInfo.stride = _dataCount * sizeof(uint64_t);
    bufferInfo.size = _dataSize;

    _results.resize(bufferInfo.size * MAX_FRAME_INFLIGHT);
    _readBackBuffer = device->createBuffer(bufferInfo);
}

void GPUStatisticsQuery::reset(gfx::CommandBuffer *cmdBuffer) {
    cmdBuffer->resetQueryPool(_queryPool, 0, _capacity);
    _count = 0;
    idMap.clear();
}

void GPUStatisticsQuery::begin(gfx::CommandBuffer *cmdBuffer, uint32_t key) {
    idMap[key] = _count;
    cmdBuffer->beginQuery(_queryPool, _count);
    ++_count;
}

void GPUStatisticsQuery::end(gfx::CommandBuffer *cmdBuffer, uint32_t key) {
    cmdBuffer->endQuery(_queryPool, idMap[key]);
}

void GPUStatisticsQuery::copyResult(gfx::CommandBuffer *cmdBuffer) {
    cmdBuffer->copyQueryResult(_queryPool, _readBackBuffer, 0, _dataCount * sizeof(uint64_t), 0, _count);
    _frameIndex = (_frameIndex + 1) % MAX_FRAME_INFLIGHT;

    auto* ptr = reinterpret_cast<uint8_t *>(_results.data());
    uint8_t* writeBuffer = ptr + static_cast<uint64_t>(_frameIndex) * _dataSize;
    _readBackBuffer->readBack(writeBuffer, 0, _dataSize);
}

} // namespace cc::render
