/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#import <Foundation/Foundation.h>
#import <Metal/Metal.h>

#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLDevice.h"
#include "MTLQueue.h"
#include "MTLRenderCommandEncoder.h"
#include "MTLUtils.h"
#include "MTLGPUObjects.h"
#import "profiler/Profiler.h"
#import "base/Log.h"

namespace cc {
namespace gfx {

CCMTLBuffer::CCMTLBuffer() : Buffer() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLBuffer::~CCMTLBuffer() {
    destroy();
}

void CCMTLBuffer::doInit(const BufferInfo &info) {
    _gpuBuffer = ccnew CCMTLGPUBuffer;
    _gpuBuffer->count = _count;
    _gpuBuffer->mappedData = nullptr;
    _gpuBuffer->instanceSize = _size;
    _gpuBuffer->startOffset = _offset;
    _gpuBuffer->stride = _stride;

    _isIndirectDrawSupported = CCMTLDevice::getInstance()->isIndirectDrawSupported();
    if (hasFlag(_usage, BufferUsage::INDEX)) {
        switch (_stride) {
            case 4: _indexType = MTLIndexTypeUInt32; break;
            case 2: _indexType = MTLIndexTypeUInt16; break;
            default:
                CC_LOG_ERROR("CCMTLBuffer:: Illegal index buffer stride.");
                break;
        }
    }

    if (hasFlag(_usage, BufferUsageBit::VERTEX) ||
        hasFlag(_usage, BufferUsageBit::UNIFORM) ||
        hasFlag(_usage, BufferUsageBit::INDEX) ||
        hasFlag(_usage, BufferUsageBit::STORAGE)) {
        createMTLBuffer(_size, _memUsage);
    } else if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        if (_isIndirectDrawSupported) {
            createMTLBuffer(_size, _memUsage);
            _primitiveIndirectArguments.resize(_count);
            _indexedPrimitivesIndirectArguments.resize(_count);
        } else {
            _drawInfos.resize(_count);
        }
    }
    CCMTLDevice::getInstance()->getMemoryStatus().bufferSize += _size;
    CC_PROFILE_MEMORY_INC(Buffer, _size);
}

void CCMTLBuffer::doInit(const BufferViewInfo &info) {
    auto *ccBuffer = static_cast<CCMTLBuffer *>(info.buffer);
    _gpuBuffer = ccBuffer->gpuBuffer();
    _indexType = ccBuffer->getIndexType();
    _mtlResourceOptions = ccBuffer->_mtlResourceOptions;
    _isIndirectDrawSupported = ccBuffer->_isIndirectDrawSupported;
    _isDrawIndirectByIndex = ccBuffer->_isDrawIndirectByIndex;
    _indexedPrimitivesIndirectArguments = ccBuffer->_indexedPrimitivesIndirectArguments;
    _primitiveIndirectArguments = ccBuffer->_primitiveIndirectArguments;
    _drawInfos = ccBuffer->_drawInfos;
    _bufferViewOffset = info.offset;
    _isBufferView = true;
}

bool CCMTLBuffer::createMTLBuffer(uint32_t size, MemoryUsage usage) {
    if (!size) {
        return false;
    }

    _mtlResourceOptions = mu::toMTLResourceOption(usage);

    if (_gpuBuffer->mtlBuffer) {
        id<MTLBuffer> mtlBuffer = _gpuBuffer->mtlBuffer;

        std::function<void(void)> destroyFunc = [=]() {
            if (mtlBuffer) {
                //TODO_Zeqiang: [mac12 | ios15, ...) validate here
                //                [mtlBuffer setPurgeableState:MTLPurgeableStateEmpty];
                [mtlBuffer release];
            }
        };
        //gpu object only
        CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
    }

    auto allocatedSize = size;
    if(hasFlag(_memUsage, MemoryUsageBit::HOST)) {
        constexpr uint8_t backBufferCount = MAX_FRAMES_IN_FLIGHT;
        auto alignedSize = utils::alignTo(size, CCMTLDevice::getInstance()->getCapabilities().uboOffsetAlignment);
        allocatedSize = alignedSize * backBufferCount;
        _gpuBuffer->instanceSize = alignedSize;
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    _gpuBuffer->mtlBuffer = [mtlDevice newBufferWithLength:allocatedSize options:_mtlResourceOptions];
    if (_gpuBuffer->mtlBuffer == nil) {
        return false;
    }
    return true;
}

void CCMTLBuffer::doDestroy() {
    if (_isBufferView) {
        return;
    }

    CCMTLDevice::getInstance()->getMemoryStatus().bufferSize -= _size;
    CC_PROFILE_MEMORY_DEC(Buffer, _size);

    if (!_indexedPrimitivesIndirectArguments.empty()) {
        _indexedPrimitivesIndirectArguments.clear();
    }

    if (!_primitiveIndirectArguments.empty()) {
        _primitiveIndirectArguments.clear();
    }

    if (!_drawInfos.empty()) {
        _drawInfos.clear();
    }

    if (_gpuBuffer) {
        id<MTLBuffer> mtlBuffer = _gpuBuffer->mtlBuffer;
        _gpuBuffer->mtlBuffer = nil;

        std::function<void(void)> destroyFunc = [=]() {
            if (mtlBuffer) {
                //TODO_Zeqiang: [mac12 | ios15, ...) validate here
                //                [mtlBuffer setPurgeableState:MTLPurgeableStateEmpty];
                [mtlBuffer release];
            }
        };
        //gpu object only
        CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
    }

    CC_SAFE_DELETE(_gpuBuffer);
}

void CCMTLBuffer::doResize(uint32_t size, uint32_t count) {
    if (hasFlag(_usage, BufferUsageBit::VERTEX) ||
        hasFlag(_usage, BufferUsageBit::INDEX) ||
        hasFlag(_usage, BufferUsageBit::UNIFORM)) {
        createMTLBuffer(size, _memUsage);
    }

    CCMTLDevice::getInstance()->getMemoryStatus().bufferSize -= _size;
    CCMTLDevice::getInstance()->getMemoryStatus().bufferSize += size;
    CC_PROFILE_MEMORY_DEC(Buffer, _size);
    CC_PROFILE_MEMORY_INC(Buffer, size);

    _size = size;
    _count = count;
    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        if (_isIndirectDrawSupported) {
            createMTLBuffer(size, _memUsage);
            _primitiveIndirectArguments.resize(_count);
            _indexedPrimitivesIndirectArguments.resize(_count);
        } else {
            _drawInfos.resize(_count);
        }
    }
}

void CCMTLBuffer::update(const void *buffer, uint32_t size) {
    CC_PROFILE(CCMTLBufferUpdate);
    if (_isBufferView) {
        CC_LOG_WARNING("Cannot update a buffer view.");
        return;
    }

    _isDrawIndirectByIndex = false;

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        uint32_t drawInfoCount = size / _stride;
        const auto *drawInfo = static_cast<const DrawInfo *>(buffer);
        if (drawInfoCount > 0) {
            if (drawInfo->indexCount) {
                _isDrawIndirectByIndex = true;
            }
        }

        if (_isIndirectDrawSupported) {
            if (drawInfoCount > 0) {
                if (_isDrawIndirectByIndex) {
                    uint32_t stride = sizeof(MTLDrawIndexedPrimitivesIndirectArguments);

                    for (uint32_t i = 0; i < drawInfoCount; ++i) {
                        auto &arguments = _indexedPrimitivesIndirectArguments[i];
                        arguments.indexCount = drawInfo->indexCount;
                        arguments.instanceCount = std::max(drawInfo->instanceCount, 1U);
                        arguments.indexStart = drawInfo->firstIndex;
                        arguments.baseVertex = drawInfo->firstVertex;
                        arguments.baseInstance = drawInfo->firstInstance;
                        ++drawInfo;
                    }
                    updateMTLBuffer(_indexedPrimitivesIndirectArguments.data(), 0, drawInfoCount * stride);
                } else {
                    uint32_t stride = sizeof(MTLDrawPrimitivesIndirectArguments);

                    for (uint32_t i = 0; i < drawInfoCount; ++i) {
                        auto &arguments = _primitiveIndirectArguments[i];
                        arguments.vertexCount = drawInfo->vertexCount;
                        arguments.instanceCount = std::max(drawInfo->instanceCount, 1U);
                        arguments.vertexStart = drawInfo->firstVertex;
                        arguments.baseInstance = drawInfo->firstInstance;
                        ++drawInfo;
                    }
                    updateMTLBuffer(_primitiveIndirectArguments.data(), 0, drawInfoCount * stride);
                }
            }
        } else {
            memcpy(_drawInfos.data(), buffer, size);
        }
    } else {
        updateMTLBuffer(buffer, 0, size);
    }
}

void CCMTLBuffer::updateMTLBuffer(const void *buffer, uint32_t /*offset*/, uint32_t size) {
    id<MTLBuffer> mtlBuffer = _gpuBuffer->mtlBuffer;
    auto* ccDevice = CCMTLDevice::getInstance();
    if(mtlBuffer.storageMode != MTLStorageModePrivate) {
        auto& lastUpdateCycle = _gpuBuffer->lastUpdateCycle;
        lastUpdateCycle = ccDevice->currentFrameIndex();
        bool backBuffer = hasFlag(_memUsage, MemoryUsageBit::HOST);
        uint32_t offset = backBuffer ? lastUpdateCycle * _gpuBuffer->instanceSize : 0;
        uint8_t* mappedData = static_cast<uint8_t*>(mtlBuffer.contents) + offset;
        memcpy(mappedData, buffer, size);
#if (CC_PLATFORM == CC_PLATFORM_MACOS)
        if (mtlBuffer.storageMode == MTLStorageModeManaged) {
            [mtlBuffer didModifyRange:NSMakeRange(offset, size)]; // Synchronize the managed buffer.
        }
#endif
    } else {
        auto* cmdBuffer = ccDevice->getCommandBuffer();
        cmdBuffer->updateBuffer(this, buffer, size);
    }
}

void CCMTLBuffer::encodeBuffer(CCMTLCommandEncoder &encoder, uint32_t offset, uint32_t binding, ShaderStageFlags stages) {
    if (hasFlag(stages, ShaderStageFlagBit::VERTEX)) {
        CCMTLRenderCommandEncoder *renderEncoder = static_cast<CCMTLRenderCommandEncoder *>(&encoder);
        renderEncoder->setVertexBuffer(_gpuBuffer->mtlBuffer, offset + currentOffset(), binding);
    }

    if (hasFlag(stages, ShaderStageFlagBit::FRAGMENT)) {
        CCMTLRenderCommandEncoder *renderEncoder = static_cast<CCMTLRenderCommandEncoder *>(&encoder);
        renderEncoder->setFragmentBuffer(_gpuBuffer->mtlBuffer, offset + currentOffset(), binding);
    }

    if (hasFlag(stages, ShaderStageFlagBit::COMPUTE)) {
        CCMTLComputeCommandEncoder *computeEncoder = static_cast<CCMTLComputeCommandEncoder *>(&encoder);
        computeEncoder->setBuffer(_gpuBuffer->mtlBuffer, offset + currentOffset(), binding);
    }
}

uint32_t CCMTLBuffer::currentOffset() const {
    bool backBuffer = hasFlag(_memUsage, MemoryUsageBit::HOST);
    uint32_t offset = backBuffer ? _gpuBuffer->lastUpdateCycle * _gpuBuffer->instanceSize : 0;
    if(_isBufferView) {
        offset += _offset; // buffer view offset
    }
    return offset;
}

id<MTLBuffer> CCMTLBuffer::mtlBuffer() const {
    return _gpuBuffer->mtlBuffer;
}

} // namespace gfx
} // namespace cc
