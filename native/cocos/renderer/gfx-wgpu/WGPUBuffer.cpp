/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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

namespace cc {
namespace gfx {

namespace anoymous {
CCWGPUBuffer *defaultUniformBuffer = nullptr;
CCWGPUBuffer *defaultStorageBuffer = nullptr;
} // namespace anoymous

using namespace emscripten;

CCWGPUBuffer::CCWGPUBuffer() : wrapper<Buffer>(val::object()) {
}

void CCWGPUBuffer::doInit(const BufferInfo &info) {
    _gpuBufferObject = CC_NEW(CCWGPUBufferObject);

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        size_t drawInfoCount = _size / sizeof(DrawInfo);
        _gpuBufferObject->indexedIndirectObjs.resize(drawInfoCount);
        _gpuBufferObject->indirectObjs.resize(drawInfoCount);
    }

    _size = ceil(info.size / 4.0) * 4;

    WGPUBufferDescriptor descriptor = {
        .nextInChain      = nullptr,
        .label            = nullptr,
        .usage            = toWGPUBufferUsage(info.usage),
        .size             = _size,
        .mappedAtCreation = false, //hasFlag(info.memUsage, MemoryUsageBit::DEVICE),
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
    _internalChanged             = true;
} // namespace gfx

void CCWGPUBuffer::doInit(const BufferViewInfo &info) {
    _gpuBufferObject             = CC_NEW(CCWGPUBufferObject);
    _gpuBufferObject->wgpuBuffer = static_cast<CCWGPUBuffer *>(info.buffer)->gpuBufferObject()->wgpuBuffer;
    _internalChanged             = true;
}

void CCWGPUBuffer::doDestroy() {
    if (_gpuBufferObject) {
        if (_gpuBufferObject->wgpuBuffer) {
            wgpuBufferDestroy(_gpuBufferObject->wgpuBuffer);
        }
        CC_DELETE(_gpuBufferObject);
    }
    _internalChanged = true;
}

void CCWGPUBuffer::doResize(uint size, uint count) {
    if (_isBufferView) {
        printf("Resize is not support on buffer view!");
        return;
    }
    if (_gpuBufferObject->wgpuBuffer) {
        wgpuBufferDestroy(_gpuBufferObject->wgpuBuffer);
    }

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        const size_t drawInfoCount = _size / sizeof(DrawInfo);
        _gpuBufferObject->indexedIndirectObjs.resize(drawInfoCount);
        _gpuBufferObject->indirectObjs.resize(drawInfoCount);
    }

    _size = ceil(size / 4.0) * 4;

    WGPUBufferDescriptor descriptor = {
        .nextInChain      = nullptr,
        .label            = nullptr,
        .usage            = toWGPUBufferUsage(_usage),
        .size             = _size,
        .mappedAtCreation = false, //hasFlag(_memUsage, MemoryUsageBit::DEVICE),
    };
    _gpuBufferObject->wgpuBuffer = wgpuDeviceCreateBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);

    _internalChanged = true;
} // namespace gfx

void bufferUpdateCallback(WGPUBufferMapAsyncStatus status, void *userdata) {
    if (status == WGPUBufferMapAsyncStatus_Success) {
        wgpuBufferUnmap(static_cast<WGPUBuffer>(userdata));
    }
}

void CCWGPUBuffer::update(const void *buffer, uint size) {
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

    size_t   offset      = _isBufferView ? _offset : 0;
    uint32_t alignedSize = ceil(size / 4.0) * 4;
    size_t   buffSize    = alignedSize;
    wgpuQueueWriteBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, _gpuBufferObject->wgpuBuffer, offset, buffer, buffSize);
    //wgpuBufferUnmap(_gpuBufferObject->wgpuBuffer);
}

void CCWGPUBuffer::update(const DrawInfoList &drawInfos) {
    size_t drawInfoCount = drawInfos.size();
    if (drawInfoCount > 0) {
        void const *data     = nullptr;
        size_t      offset   = _isBufferView ? _offset : 0;
        size_t      buffSize = 0;
        //if (hasFlag(_usage, BufferUsageBit::INDIRECT))
        if (drawInfos[0].indexCount) {
            auto &indexedIndirectObjs = _gpuBufferObject->indexedIndirectObjs;
            for (size_t i = 0; i < drawInfoCount; i++) {
                indexedIndirectObjs[i].indexCount    = drawInfos[i].indexCount;
                indexedIndirectObjs[i].instanceCount = drawInfos[i].instanceCount /*  ? drawInfos[i]->instanceCoun : 1 */;
                indexedIndirectObjs[i].firstIndex    = drawInfos[i].firstIndex;
                indexedIndirectObjs[i].baseVertex    = drawInfos[i].vertexOffset;
                indexedIndirectObjs[i].firstInstance = 0; //check definition of indexedIndirectObj;
            }
            data     = indexedIndirectObjs.data();
            buffSize = indexedIndirectObjs.size() * sizeof(CCWGPUDrawIndexedIndirectObject);
        } else {
            auto &indirectObjs = _gpuBufferObject->indirectObjs;
            for (size_t i = 0; i < drawInfoCount; i++) {
                indirectObjs[i].vertexCount   = drawInfos[i].vertexCount;
                indirectObjs[i].instanceCount = drawInfos[i].instanceCount;
                indirectObjs[i].firstIndex    = drawInfos[i].firstIndex;
                indirectObjs[i].firstInstance = 0; // check definition of indirectObj;
            }
            data     = indirectObjs.data();
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
    if (!anoymous::defaultUniformBuffer) {
        BufferInfo info = {
            .usage    = BufferUsageBit::UNIFORM,
            .memUsage = MemoryUsageBit::DEVICE,
            .size     = 4,
            .flags    = BufferFlagBit::NONE,
        };
        anoymous::defaultUniformBuffer = CC_NEW(CCWGPUBuffer);
        anoymous::defaultUniformBuffer->initialize(info);
    }
    return anoymous::defaultUniformBuffer;
}

CCWGPUBuffer *CCWGPUBuffer::defaultStorageBuffer() {
    if (!anoymous::defaultStorageBuffer) {
        BufferInfo info = {
            .usage    = BufferUsageBit::STORAGE,
            .memUsage = MemoryUsageBit::DEVICE,
            .size     = 4,
            .flags    = BufferFlagBit::NONE,
        };
        anoymous::defaultStorageBuffer = CC_NEW(CCWGPUBuffer);
        anoymous::defaultStorageBuffer->initialize(info);
    }
    return anoymous::defaultStorageBuffer;
}

} // namespace gfx
} // namespace cc
