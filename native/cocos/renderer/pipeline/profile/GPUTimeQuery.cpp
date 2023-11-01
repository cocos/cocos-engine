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

#include "GPUTimeQuery.h"
#include "gfx-base/GFXDevice.h"

namespace cc::render {

static constexpr uint32_t MAX_FRAME_INFLIGHT = 2; // from device agent

const uint64_t* GPUTimeQuery::getReadBuffer() const {
    const auto* ptr = reinterpret_cast<const uint8_t *>(_results.data());
    const uint64_t readIndex = (_frameIndex + MAX_FRAME_INFLIGHT - 1) % MAX_FRAME_INFLIGHT;
    return reinterpret_cast<const uint64_t *>(ptr + readIndex * _capacity * sizeof(uint64_t));
}

void GPUTimeQuery::resize(uint32_t size) {
    if (size <= _capacity) {
        return;
    }

    _capacity = size;
    _results.resize(static_cast<uint64_t>(_capacity) * MAX_FRAME_INFLIGHT);
    _keys.resize(_capacity);

    auto *device = gfx::Device::getInstance();
    gfx::QueryPoolInfo poolInfo = {};
    poolInfo.type = gfx::QueryType::TIMESTAMP;
    poolInfo.maxQueryObjects = _capacity;
    _queryPool = device->createQueryPool(poolInfo);

    gfx::BufferInfo bufferInfo = {};
    bufferInfo.usage = gfx::BufferUsageBit::TRANSFER_DST;
    bufferInfo.memUsage = gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE;
    bufferInfo.size = _capacity * sizeof(uint64_t);
    bufferInfo.stride = sizeof(uint64_t);
    _readBackBuffer = device->createBuffer(bufferInfo);
}

void GPUTimeQuery::reset(gfx::CommandBuffer *cmdBuffer) {
    cmdBuffer->resetQueryPool(_queryPool, 0, _capacity);
    _count = 0;
}

void GPUTimeQuery::writeTimestamp(gfx::CommandBuffer *cmdBuffer) {
    cmdBuffer->writeTimestamp(_queryPool, _count);
    ++_count;
}

void GPUTimeQuery::writeTimestampWithKey(gfx::CommandBuffer *cmdBuffer, const KeyType &key) {
    cmdBuffer->writeTimestamp(_queryPool, _count);
    _keys[_count] = key;
    ++_count;
}

void GPUTimeQuery::copyResult(gfx::CommandBuffer *cmdBuffer) {
    cmdBuffer->copyQueryResult(_queryPool, _readBackBuffer, 0, sizeof(uint64_t), 0, _count);
    _frameIndex = (_frameIndex + 1) % MAX_FRAME_INFLIGHT;

    auto* ptr = reinterpret_cast<uint8_t *>(_results.data());
    uint8_t* writeBuffer = ptr + static_cast<uint64_t>(_frameIndex) * _capacity * sizeof(uint64_t);
    _readBackBuffer->readBack(writeBuffer, 0, _capacity * sizeof(uint64_t));
}

} // namespace cc::render
