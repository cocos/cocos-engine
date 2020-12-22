/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
#include "MTLStd.h"

#import <Metal/Metal.h>
#import <Foundation/Foundation.h>

#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLDevice.h"
#include "MTLUtils.h"

namespace cc {
namespace gfx {

CCMTLBuffer::CCMTLBuffer(Device *device) : Buffer(device)
{
    _mtlDevice = id<MTLDevice>(((CCMTLDevice *)_device)->getMTLDevice());
}

bool CCMTLBuffer::initialize(const BufferInfo &info)
{
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _stride = std::max(info.stride, 1U);
    _count = _size / _stride;
    _flags = info.flags;
    _indirectDrawSupported = static_cast<CCMTLDevice *>(_device)->isIndirectDrawSupported();
    if (_usage & BufferUsage::INDEX)
    {
        switch (_stride)
        {
            case 4: _indexType = MTLIndexTypeUInt32; break;
            case 2: _indexType = MTLIndexTypeUInt16; break;
            default:
                CC_LOG_ERROR("CCMTLBuffer:: Illegal index buffer stride.");
                break;
        }
    }

    if ((_flags & BufferFlagBit::BAKUP_BUFFER) && _size > 0)
    {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        if (_buffer)
        {
            _device->getMemoryStatus().bufferSize += _size;
        }
        else
        {
            CC_LOG_ERROR("CCMTLBuffer: Failed to create backup buffer.");
            return false;
        }
    }

    if (_usage & BufferUsageBit::VERTEX ||
        _usage & BufferUsageBit::UNIFORM ||
        _usage & BufferUsageBit::INDEX)
    {
        createMTLBuffer(_size, _memUsage);
    }
    else if (_usage & BufferUsageBit::INDIRECT)
    {
        _drawInfos.resize(_count);
        if (_indirectDrawSupported)
        {
            createMTLBuffer(_size, _memUsage);
            _primitiveIndirectArguments.resize(_count);
            _indexedPrimitivesIndirectArguments.resize(_count);
        } else {
            _drawInfos.resize(_count);
        }
    }

    return true;
}

bool CCMTLBuffer::initialize(const BufferViewInfo &info)
{
    *this = *static_cast<CCMTLBuffer *>(info.buffer);
    _bufferViewOffset = info.offset;
    _isBufferView = true;
    return true;
}

bool CCMTLBuffer::createMTLBuffer(uint size, MemoryUsage usage)
{
    _mtlResourceOptions = mu::toMTLResourseOption(usage);

    if (_mtlBuffer)
    {
        [_mtlBuffer release];
    }
    _mtlBuffer = [_mtlDevice newBufferWithLength:size options:_mtlResourceOptions];
    if (_mtlBuffer == nil)
    {
        CCASSERT(false, "Failed to create MTLBuffer.");
        return false;
    }

    _device->getMemoryStatus().bufferSize += size;

    return true;
}

void CCMTLBuffer::destroy()
{
    if (_isBufferView)
    {
        return;
    }

    if (_mtlBuffer)
    {
        [_mtlBuffer release];
        _mtlBuffer = nil;
    }

    if (_buffer)
    {
        CC_FREE(_buffer);
        _device->getMemoryStatus().bufferSize -= _size;
        _buffer = nullptr;
    }
    _indexedPrimitivesIndirectArguments.clear();
    _primitiveIndirectArguments.clear();
    _drawInfos.clear();

    _device->getMemoryStatus().bufferSize -= _size;
}

void CCMTLBuffer::resize(uint size)
{
    if (_isBufferView)
    {
        CC_LOG_WARNING("Cannot resize a buffer view.");
        return;
    }

    if (_size == size)
        return;

    if (_usage & BufferUsageBit::VERTEX ||
        _usage & BufferUsageBit::INDEX ||
        _usage & BufferUsageBit::UNIFORM)
    {
        createMTLBuffer(size, _memUsage);
    }

    const uint oldSize = _size;
    _size = size;
    _count = _size / _stride;
    resizeBuffer(&_buffer, _size, oldSize);
    if (_usage & BufferUsageBit::INDIRECT)
    {
        _drawInfos.resize(_count);
        if (_indirectDrawSupported)
        {
            createMTLBuffer(size, _memUsage);
            _primitiveIndirectArguments.resize(_count);
            _indexedPrimitivesIndirectArguments.resize(_count);
        } else {
            _drawInfos.resize(_count);
        }
    }
}

void CCMTLBuffer::resizeBuffer(uint8_t **buffer, uint size, uint oldSize) {
    if (!(*buffer))
        return;

    MemoryStatus &status = _device->getMemoryStatus();
    const uint8_t *oldBuffer = *buffer;
    uint8_t *temp = (uint8_t *)CC_MALLOC(size);
    if (temp)
    {
        memcpy(temp, oldBuffer, std::min(oldSize, size));
        *buffer = temp;
        status.bufferSize += size;
    }
    else
    {
        CC_LOG_ERROR("Failed to resize buffer.");
        return;
    }

    CC_FREE(oldBuffer);
    status.bufferSize -= oldSize;
}

void CCMTLBuffer::update(void *buffer, uint size)
{
    if (_isBufferView)
    {
        CC_LOG_WARNING("Cannot update a buffer view.");
        return;
    }

    if (_buffer)
        memcpy(_buffer, buffer, size);

    if (_usage & BufferUsageBit::INDIRECT)
    {
        auto drawInfoCount = size / _stride;
        for (uint i = 0; i < drawInfoCount; ++i)
        {
            memcpy(&_drawInfos[i], static_cast<uint8_t *>(buffer) + i * _stride, _stride);
        }

        if (!_indirectDrawSupported)
        {
            return;
        }

        if (drawInfoCount > 0)
        {
            if (_drawInfos[0].indexCount)
            {
                vector<MTLDrawIndexedPrimitivesIndirectArguments> arguments(drawInfoCount);
                int i = 0;
                for (auto &argument : arguments)
                {
                    const auto &drawInfo = _drawInfos[i++];
                    argument.indexCount = drawInfo.indexCount;
                    argument.instanceCount = drawInfo.instanceCount == 0 ? 1 : drawInfo.instanceCount;
                    argument.indexStart = drawInfo.firstIndex;
                    argument.baseVertex = drawInfo.firstVertex;
                    argument.baseInstance = drawInfo.firstInstance;
                }
                memcpy(static_cast<uint8_t *>(_mtlBuffer.contents), arguments.data(), drawInfoCount * sizeof(MTLDrawIndexedPrimitivesIndirectArguments));
            }
            else if (_drawInfos[0].vertexCount)
            {
                vector<MTLDrawPrimitivesIndirectArguments> arguments(drawInfoCount);
                int i = 0;
                for (auto &argument : arguments)
                {
                    const auto &drawInfo = _drawInfos[i++];
                    argument.vertexCount = drawInfo.vertexCount;
                    argument.instanceCount = drawInfo.instanceCount == 0 ? 1 : drawInfo.instanceCount;
                    argument.vertexStart = drawInfo.firstVertex;
                    argument.baseInstance = drawInfo.firstInstance;
                }
                memcpy(static_cast<uint8_t *>(_mtlBuffer.contents), arguments.data(), drawInfoCount * sizeof(MTLDrawPrimitivesIndirectArguments));
            }
        } else {
            memcpy(_drawInfos.data(), buffer, size);
        }
    } else {
        updateMTLBuffer(buffer, 0, size);
    }
}

    if (_mtlBuffer)
    {
        CommandBuffer *cmdBuffer = _device->getCommandBuffer();
        cmdBuffer->begin();
        static_cast<CCMTLCommandBuffer *>(cmdBuffer)->updateBuffer(this, buffer, size);
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
        if (_mtlResourceOptions == MTLResourceStorageModeManaged)
            [_mtlBuffer didModifyRange:NSMakeRange(0, _size)]; // Synchronize the managed buffer.
#endif
    }
}

void CCMTLBuffer::encodeBuffer(CCMTLRenderCommandEncoder &encoder, uint offset, uint binding, ShaderStageFlags stages)
{
    if (_isBufferView)
    {
        offset += _bufferViewOffset;
    }

    if (stages & ShaderStageFlagBit::VERTEX)
    {
        encoder.setVertexBuffer(_mtlBuffer, offset, binding);
    }

    if (stages & ShaderStageFlagBit::FRAGMENT)
    {
        encoder.setFragmentBuffer(_mtlBuffer, offset, binding);
    }
}

} // namespace gfx
} // namespace cc
