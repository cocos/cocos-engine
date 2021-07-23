/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "MTLStd.h"

#import <Foundation/Foundation.h>
#import <Metal/Metal.h>

#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLDevice.h"
#include "MTLRenderCommandEncoder.h"
#include "MTLUtils.h"

namespace cc {
namespace gfx {

CCMTLBuffer::CCMTLBuffer() : Buffer() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLBuffer::~CCMTLBuffer() {
    destroy();
}

void CCMTLBuffer::doInit(const BufferInfo &info) {
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
        hasFlag(_usage, BufferUsageBit::INDEX)) {
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
}

void CCMTLBuffer::doInit(const BufferViewInfo &info) {
    *this = *static_cast<CCMTLBuffer *>(info.buffer);
    _bufferViewOffset = info.offset;
    _isBufferView = true;
}

bool CCMTLBuffer::createMTLBuffer(uint size, MemoryUsage usage) {
    _mtlResourceOptions = mu::toMTLResourceOption(usage);

    if (_mtlBuffer) {
        id<MTLBuffer> mtlBuffer = _mtlBuffer;

        std::function<void(void)> destroyFunc = [=]() {
            if (mtlBuffer) {
                [mtlBuffer setPurgeableState:MTLPurgeableStateEmpty];
                [mtlBuffer release];
            }
        };
        //gpu object only
        CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    _mtlBuffer = [mtlDevice newBufferWithLength:size options:_mtlResourceOptions];
    if (_mtlBuffer == nil) {
        return false;
    }
    return true;
}

void CCMTLBuffer::doDestroy() {
    if (_isBufferView) {
        return;
    }

    CCMTLDevice::getInstance()->getMemoryStatus().bufferSize -= _size;

    if (!_indexedPrimitivesIndirectArguments.empty()) {
        _indexedPrimitivesIndirectArguments.clear();
    }

    if (!_primitiveIndirectArguments.empty()) {
        _primitiveIndirectArguments.clear();
    }

    if (!_drawInfos.empty()) {
        _drawInfos.clear();
    }

    id<MTLBuffer> mtlBuffer = _mtlBuffer;
    _mtlBuffer = nil;

    std::function<void(void)> destroyFunc = [=]() {
        if (mtlBuffer) {
            [mtlBuffer setPurgeableState:MTLPurgeableStateEmpty];
            [mtlBuffer release];
        }
    };
    //gpu object only
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

void CCMTLBuffer::doResize(uint size, uint count) {
    if (hasFlag(_usage, BufferUsageBit::VERTEX) ||
        hasFlag(_usage, BufferUsageBit::INDEX) ||
        hasFlag(_usage, BufferUsageBit::UNIFORM)) {
        createMTLBuffer(size, _memUsage);
    }

    CCMTLDevice::getInstance()->getMemoryStatus().bufferSize -= _size;
    CCMTLDevice::getInstance()->getMemoryStatus().bufferSize += size;

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

void CCMTLBuffer::update(const void *buffer, uint size) {
    if (_isBufferView) {
        CC_LOG_WARNING("Cannot update a buffer view.");
        return;
    }

    uint drawInfoCount = size / _stride;
    const auto *drawInfo = static_cast<const DrawInfo *>(buffer);
    if (drawInfoCount > 0) {
        if (drawInfo->indexCount) {
            _isDrawIndirectByIndex = true;
        } else {
            _isDrawIndirectByIndex = false;
        }
    }

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        if (_isIndirectDrawSupported) {
            if (drawInfoCount > 0) {
                if (_isDrawIndirectByIndex) {
                    uint stride = sizeof(MTLDrawIndexedPrimitivesIndirectArguments);

                    for (uint i = 0; i < drawInfoCount; ++i) {
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
                    uint stride = sizeof(MTLDrawIndexedPrimitivesIndirectArguments);

                    for (uint i = 0; i < drawInfoCount; ++i) {
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

void CCMTLBuffer::updateMTLBuffer(const void *buffer, uint /*offset*/, uint size) {
    if (_mtlBuffer) {
        CommandBuffer *cmdBuffer = CCMTLDevice::getInstance()->getCommandBuffer();
        cmdBuffer->begin();
        static_cast<CCMTLCommandBuffer *>(cmdBuffer)->updateBuffer(this, buffer, size);
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
        if (_mtlResourceOptions == MTLResourceStorageModeManaged) {
            [_mtlBuffer didModifyRange:NSMakeRange(0, _size)]; // Synchronize the managed buffer.
        }
#endif
    }
}

void CCMTLBuffer::encodeBuffer(CCMTLCommandEncoder &encoder, uint offset, uint binding, ShaderStageFlags stages) {
    if (_isBufferView) {
        offset += _bufferViewOffset;
    }

    if (hasFlag(stages, ShaderStageFlagBit::VERTEX)) {
        CCMTLRenderCommandEncoder* renderEncoder = static_cast<CCMTLRenderCommandEncoder*>(&encoder);
        renderEncoder->setVertexBuffer(_mtlBuffer, offset, binding);
    }

    if (hasFlag(stages, ShaderStageFlagBit::FRAGMENT)) {
        CCMTLRenderCommandEncoder* renderEncoder = static_cast<CCMTLRenderCommandEncoder*>(&encoder);
        renderEncoder->setFragmentBuffer(_mtlBuffer, offset, binding);
    }

    if(hasFlag(stages, ShaderStageFlagBit::COMPUTE)) {
        CCMTLComputeCommandEncoder* computeEncoder = static_cast<CCMTLComputeCommandEncoder*>(&encoder);
        computeEncoder->setBuffer(_mtlBuffer, offset, binding);
    }
}

} // namespace gfx
} // namespace cc
