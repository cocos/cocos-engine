/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "WGPUBuffer.h"
#include <webgpu/webgpu.h>
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUUtils.h"
#include <boost/align/align_up.hpp>

namespace cc {
namespace gfx {

namespace {
CCWGPUBuffer *dftUniformBuffer = nullptr;
CCWGPUBuffer *dftStorageBuffer = nullptr;
static uint32_t BUFFER_ALIGNMENT = 16;
} // namespace

using namespace emscripten;

CCWGPUBuffer::CCWGPUBuffer() : Buffer() {
}

CCWGPUBuffer::~CCWGPUBuffer() {
    doDestroy();
}

void CCWGPUBuffer::doInit(const BufferInfo &info) {
    _gpuBufferObject = ccnew CCWGPUBufferObject;

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        size_t drawInfoCount = _size / sizeof(DrawInfo);
        _gpuBufferObject->indexedIndirectObjs.resize(drawInfoCount);
        _gpuBufferObject->indirectObjs.resize(drawInfoCount);
    }

    _size = boost::alignment::align_up(_size, BUFFER_ALIGNMENT);

    WGPUBufferDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = nullptr,
        .usage = toWGPUBufferUsage(info.usage),
        .size = _size,
        .mappedAtCreation = false, // hasFlag(info.memUsage, MemoryUsageBit::DEVICE),
    };

    _gpuBufferObject->mapped = descriptor.mappedAtCreation;

    if (info.memUsage == MemoryUsage::DEVICE) {
        descriptor.usage |= WGPUBufferUsage_CopyDst;
    } else if (info.memUsage == MemoryUsage::HOST) {
        descriptor.usage |= WGPUBufferUsage_CopySrc;
    } else if (info.memUsage == (MemoryUsage::HOST | MemoryUsage::DEVICE)) {
        descriptor.usage |= WGPUBufferUsage_CopySrc | WGPUBufferUsage_CopyDst;
    }

    _gpuBufferObject->wgpuBuffer = wgpuDeviceCreateBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    CCWGPUDevice::getInstance()->getMemoryStatus().bufferSize += _size;
    _internalChanged = true;
} // namespace gfx

void CCWGPUBuffer::doInit(const BufferViewInfo &info) {
    _gpuBufferObject = ccnew CCWGPUBufferObject;
    _gpuBufferObject->wgpuBuffer = static_cast<CCWGPUBuffer *>(info.buffer)->gpuBufferObject()->wgpuBuffer;
    _internalChanged = true;
}

void CCWGPUBuffer::doDestroy() {
    if (_gpuBufferObject) {
        if (_gpuBufferObject->wgpuBuffer && !_isBufferView) {
            CCWGPUDevice::getInstance()->moveToTrash(_gpuBufferObject->wgpuBuffer);
            CCWGPUDevice::getInstance()->getMemoryStatus().bufferSize -= _size;
        }
        delete _gpuBufferObject;
        _gpuBufferObject = nullptr;
    }
    _internalChanged = true;
}

void CCWGPUBuffer::doResize(uint32_t size, uint32_t count) {
    if (_isBufferView) {
        printf("Resize is not support on buffer view!");
        return;
    }
    if (_gpuBufferObject->wgpuBuffer) {
        CCWGPUDevice::getInstance()->moveToTrash(_gpuBufferObject->wgpuBuffer);
    }
    CCWGPUDevice::getInstance()->getMemoryStatus().bufferSize -= _size;

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        const size_t drawInfoCount = _size / sizeof(DrawInfo);
        _gpuBufferObject->indexedIndirectObjs.resize(drawInfoCount);
        _gpuBufferObject->indirectObjs.resize(drawInfoCount);
    }

    _size = boost::alignment::align_up(size, BUFFER_ALIGNMENT);

    WGPUBufferDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = nullptr,
        .usage = toWGPUBufferUsage(_usage),
        .size = _size,
        .mappedAtCreation = false, // hasFlag(_memUsage, MemoryUsageBit::DEVICE),
    };
    _gpuBufferObject->wgpuBuffer = wgpuDeviceCreateBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    CCWGPUDevice::getInstance()->getMemoryStatus().bufferSize += _size;

    _internalChanged = true;
} // namespace gfx

void bufferUpdateCallback(WGPUBufferMapAsyncStatus status, void *userdata) {
    if (status == WGPUBufferMapAsyncStatus_Success) {
        wgpuBufferUnmap(static_cast<WGPUBuffer>(userdata));
    }
}

void CCWGPUBuffer::update(const void *buffer, uint32_t size) {
    // uint32_t alignedSize = ceil(size / 4.0) * 4;
    // size_t   buffSize    = alignedSize;
    // // if (hasFlag(_memUsage, MemoryUsageBit::DEVICE)) {
    // //     auto *mappedBuffer = wgpuBufferGetMappedRange(_gpuBufferObject->wgpuBuffer, 0, alignedSize);
    // //     memcpy(mappedBuffer, buffer, alignedSize);
    // //     size_t offset = _isBufferView ? _offset : 0;
    // //     wgpuBufferMapAsync(_gpuBufferObject->wgpuBuffer, WGPUMapMode_Write, offset, alignedSize, bufferUpdateCallback, _gpuBufferObject->wgpuBuffer);
    // // } else {
    // WGPUBufferDescriptor descriptor = {
    //     .nextInChain      = nullptr,
    //     .label            = nullptr,
    //     .usage            = WGPUBufferUsage_MapWrite | WGPUBufferUsage_CopySrc,
    //     .size             = alignedSize,
    //     .mappedAtCreation = true,
    // };
    // WGPUBuffer stagingBuffer = wgpuDeviceCreateBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    // auto *     mappedBuffer  = wgpuBufferGetMappedRange(stagingBuffer, 0, alignedSize);
    // memcpy(mappedBuffer, buffer, size);
    // size_t offset = _isBufferView ? _offset : 0;
    // //}
    // wgpuBufferUnmap(static_cast<WGPUBuffer>(stagingBuffer));
    // //wgpuCommandEncoderCopyBufferToBuffer(WGPUCommandEncoder commandEncoder, WGPUBuffer source, uint64_t sourceOffset, WGPUBuffer destination, uint64_t destinationOffset, uint64_t size);
    // auto cmdEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);
    // wgpuCommandEncoderCopyBufferToBuffer(cmdEncoder, stagingBuffer, 0, _gpuBufferObject->wgpuBuffer, offset, alignedSize);
    // WGPUCommandBuffer commandBuffer = wgpuCommandEncoderFinish(cmdEncoder, nullptr);
    // wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &commandBuffer);
    // wgpuBufferRelease(stagingBuffer);
    // wgpuCommandEncoderRelease(cmdEncoder);
    // wgpuCommandBufferRelease(commandBuffer);

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        size_t drawInfoCount = size / sizeof(DrawInfo);
        const auto *drawInfo = static_cast<const DrawInfo *>(buffer);
        size_t offset = _isBufferView ? _offset : 0;
        update(drawInfo, drawInfoCount);
    } else {
        size_t offset = _isBufferView ? _offset : 0;
        uint32_t alignedSize = boost::alignment::align_up(size, BUFFER_ALIGNMENT);
        size_t buffSize = alignedSize;
        wgpuQueueWriteBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, _gpuBufferObject->wgpuBuffer, offset, buffer, buffSize);
    }
}

void CCWGPUBuffer::update(const DrawInfoList &drawInfos) {
    size_t drawInfoCount = drawInfos.size();
    if (drawInfoCount > 0) {
        void const *data = nullptr;
        size_t offset = _isBufferView ? _offset : 0;
        size_t buffSize = 0;
        // if (hasFlag(_usage, BufferUsageBit::INDIRECT))
        if (drawInfos[0].indexCount) {
            auto &indexedIndirectObjs = _gpuBufferObject->indexedIndirectObjs;
            for (size_t i = 0; i < drawInfoCount; i++) {
                indexedIndirectObjs[i].indexCount = drawInfos[i].indexCount;
                indexedIndirectObjs[i].instanceCount = drawInfos[i].instanceCount ? drawInfos[i].instanceCount : 1;
                indexedIndirectObjs[i].firstIndex = drawInfos[i].firstIndex;
                indexedIndirectObjs[i].baseVertex = drawInfos[i].vertexOffset;
                indexedIndirectObjs[i].firstInstance = 0; // check definition of indexedIndirectObj;
            }
            data = indexedIndirectObjs.data();
            buffSize = indexedIndirectObjs.size() * sizeof(CCWGPUDrawIndexedIndirectObject);
        } else {
            auto &indirectObjs = _gpuBufferObject->indirectObjs;
            for (size_t i = 0; i < drawInfoCount; i++) {
                indirectObjs[i].vertexCount = drawInfos[i].vertexCount;
                indirectObjs[i].instanceCount = drawInfos[i].instanceCount ? drawInfos[i].instanceCount : 1;
                indirectObjs[i].firstIndex = drawInfos[i].firstIndex;
                indirectObjs[i].firstInstance = 0; // check definition of indirectObj;
            }
            data = indirectObjs.data();
            buffSize = indirectObjs.size() * sizeof(CCWGPUDrawIndirectObject);
        }
        wgpuQueueWriteBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, _gpuBufferObject->wgpuBuffer, offset, data, buffSize);
    }
}

void CCWGPUBuffer::check() {
    if (_gpuBufferObject->mapped) {
        wgpuBufferUnmap(_gpuBufferObject->wgpuBuffer);
        _gpuBufferObject->mapped = false;
    }
}

void CCWGPUBuffer::stamp() {
    _internalChanged = false;
}

CCWGPUBuffer *CCWGPUBuffer::defaultUniformBuffer() {
    if (!dftUniformBuffer) {
        BufferInfo info = {
            .usage = BufferUsageBit::UNIFORM,
            .memUsage = MemoryUsageBit::DEVICE,
            .size = 256,
            .flags = BufferFlagBit::NONE,
        };
        dftUniformBuffer = ccnew CCWGPUBuffer;
        dftUniformBuffer->initialize(info);
    }
    return dftUniformBuffer;
}

CCWGPUBuffer *CCWGPUBuffer::defaultStorageBuffer() {
    if (!dftStorageBuffer) {
        BufferInfo info = {
            .usage = BufferUsageBit::STORAGE,
            .memUsage = MemoryUsageBit::DEVICE,
            .size = 256,
            .flags = BufferFlagBit::NONE,
        };
        dftStorageBuffer = ccnew CCWGPUBuffer;
        dftStorageBuffer->initialize(info);
    }
    return dftStorageBuffer;
}

} // namespace gfx
} // namespace cc
