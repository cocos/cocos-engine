#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLDevice.h"
#include "MTLUtils.h"
#include "MTLRenderCommandEncoder.h"
#import <Metal/Metal.h>

namespace cc {
namespace gfx {

CCMTLBuffer::CCMTLBuffer(Device *device) : Buffer(device) {
    _mtlDevice = id<MTLDevice>(((CCMTLDevice *)_device)->getMTLDevice());
}

CCMTLBuffer::~CCMTLBuffer() {
    destroy();
}

bool CCMTLBuffer::initialize(const BufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _stride = std::max(info.stride, 1U);
    _count = _size / _stride;
    _flags = info.flags;
    _indirectDrawSupported = static_cast<CCMTLDevice *>(_device)->isIndirectDrawSupported();
    if (_usage & BufferUsage::INDEX) {
        switch (_stride) {
            case 4: _indexType = MTLIndexTypeUInt32; break;
            case 2: _indexType = MTLIndexTypeUInt16; break;
            default:
                CC_LOG_ERROR("CCMTLBuffer:: Illegal index buffer stride.");
                break;
        }
    }

    if ((_flags & BufferFlagBit::BAKUP_BUFFER) && _size > 0) {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        if (_buffer)
            _device->getMemoryStatus().bufferSize += _size;
        else {
            CC_LOG_ERROR("CCMTLBuffer: Failed to create backup buffer.");
            return false;
        }
    }

    if (_usage & BufferUsageBit::VERTEX ||
        _usage & BufferUsageBit::UNIFORM ||
        _usage & BufferUsageBit::INDEX) {
        createMTLBuffer(_size, _memUsage);
    } else if (_usage & BufferUsageBit::INDIRECT) {
        if (_indirectDrawSupported) {
            createMTLBuffer(_size, _memUsage);
        } else {
            _indirects.resize(_count);
        }
    } else if (_usage & BufferUsageBit::TRANSFER_SRC ||
               _usage & BufferUsageBit::TRANSFER_DST) {
        _transferBuffer = (uint8_t *)CC_MALLOC(_size);
        if (!_transferBuffer) {
            CCASSERT(false, "CCMTLBuffer: failed to create memory for transfer buffer.");
            return false;
        }
        _device->getMemoryStatus().bufferSize += _size;
    } else {
        CCASSERT(false, "Unsupported BufferType, create buffer failed.");
        return false;
    }

    return true;
}

bool CCMTLBuffer::initialize(const BufferViewInfo &info) {
    *this = *static_cast<CCMTLBuffer *>(info.buffer);
    _bufferViewOffset = info.offset;
    _isBufferView = true;
    return true;
}

bool CCMTLBuffer::createMTLBuffer(uint size, MemoryUsage usage) {
    _mtlResourceOptions = mu::toMTLResourseOption(usage);

    if (_mtlBuffer) {
        [_mtlBuffer release];
    }
    _mtlBuffer = [_mtlDevice newBufferWithLength:size options:_mtlResourceOptions];
    if (_mtlBuffer == nil) {
        CCASSERT(false, "Failed to create MTLBuffer.");
        return false;
    }

    _device->getMemoryStatus().bufferSize += size;

    return true;
}

void CCMTLBuffer::destroy() {
    if (_isBufferView) {
        return;
    }

    if (_mtlBuffer) {
        [_mtlBuffer release];
        _mtlBuffer = nil;
    }

    if (_transferBuffer) {
        CC_FREE(_transferBuffer);
        _transferBuffer = nullptr;
        _device->getMemoryStatus().bufferSize -= _size;
    }

    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().bufferSize -= _size;
        _buffer = nullptr;
    }
    _indirects.clear();

    _device->getMemoryStatus().bufferSize -= _size;
}

void CCMTLBuffer::resize(uint size) {
    if (_isBufferView) {
        CC_LOG_WARNING("Cannot resize a buffer view.");
        return;
    }

    if (_size == size)
        return;

    if (_usage & BufferUsageBit::VERTEX ||
        _usage & BufferUsageBit::INDEX ||
        _usage & BufferUsageBit::UNIFORM) {
        createMTLBuffer(size, _memUsage);
    }

    const uint oldSize = _size;
    _size = size;
    _count = _size / _stride;
    resizeBuffer(&_transferBuffer, _size, oldSize);
    resizeBuffer(&_buffer, _size, oldSize);
    if (_usage & BufferUsageBit::INDIRECT) {
        if (_indirectDrawSupported) {
            createMTLBuffer(size, _memUsage);
        } else {
            _indirects.resize(_count);
        }
    }
}

void CCMTLBuffer::resizeBuffer(uint8_t **buffer, uint size, uint oldSize) {
    if (!(*buffer))
        return;

    MemoryStatus &status = _device->getMemoryStatus();
    const uint8_t *oldBuffer = *buffer;
    uint8_t *temp = (uint8_t *)CC_MALLOC(size);
    if (temp) {
        memcpy(temp, oldBuffer, std::min(oldSize, size));
        *buffer = temp;
        status.bufferSize += size;
    } else {
        CC_LOG_ERROR("Failed to resize buffer.");
        return;
    }

    CC_FREE(oldBuffer);
    status.bufferSize -= oldSize;
}

void CCMTLBuffer::update(void *buffer, uint offset, uint size) {
    if (_isBufferView) {
        CC_LOG_WARNING("Cannot update a buffer view.");
        return;
    }

    if (_buffer)
        memcpy(_buffer + offset, buffer, size);

    if (_usage & BufferUsageBit::INDIRECT) {
        if (!_indirectDrawSupported) {
            memcpy(_indirects.data() + offset, buffer, size);
            return;
        }
        auto drawInfoCount = size / _stride;
        auto *drawInfo = static_cast<DrawInfo *>(buffer);
        if (drawInfoCount > 0) {
            if (drawInfo->indexCount) {
                vector<MTLDrawIndexedPrimitivesIndirectArguments> arguments(drawInfoCount);
                for (auto &argument : arguments) {
                    argument.indexCount = drawInfo->indexCount;
                    argument.instanceCount = drawInfo->instanceCount == 0 ? 1 : drawInfo->instanceCount;
                    argument.indexStart = drawInfo->firstIndex;
                    argument.baseVertex = drawInfo->firstVertex;
                    argument.baseInstance = drawInfo->firstInstance;
                    drawInfo++;
                }
                memcpy((uint8_t *)(_mtlBuffer.contents) + offset, arguments.data(), drawInfoCount * sizeof(MTLDrawIndexedPrimitivesIndirectArguments));
                _isDrawIndirectByIndex = true;
            } else {
                vector<MTLDrawPrimitivesIndirectArguments> arguments(drawInfoCount);
                for (auto &argument : arguments) {
                    argument.vertexCount = drawInfo->vertexCount;
                    argument.instanceCount = drawInfo->instanceCount == 0 ? 1 : drawInfo->instanceCount;
                    argument.vertexStart = drawInfo->firstVertex;
                    argument.baseInstance = drawInfo->firstInstance;
                    drawInfo++;
                }
                memcpy((uint8_t *)(_mtlBuffer.contents) + offset, arguments.data(), drawInfoCount * sizeof(MTLDrawPrimitivesIndirectArguments));
                _isDrawIndirectByIndex = false;
            }
        }
        return;
    }

    if (_mtlBuffer) {
        CommandBuffer *cmdBuffer = _device->getCommandBuffer();
        cmdBuffer->begin();
        static_cast<CCMTLCommandBuffer *>(cmdBuffer)->updateBuffer(this, buffer, size, offset);
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
        if (_mtlResourceOptions == MTLResourceStorageModeManaged)
            [_mtlBuffer didModifyRange:NSMakeRange(0, _size)]; // Synchronize the managed buffer.
#endif
        return;
    }

    if (_transferBuffer) {
        memcpy(_transferBuffer + offset, buffer, size);
        return;
    }
}

void CCMTLBuffer::encodeBuffer(CCMTLRenderCommandEncoder &encoder, uint offset, uint binding, ShaderStageFlags stages) {
    if (_isBufferView) {
        offset += _bufferViewOffset;
    }

    if (stages & ShaderStageFlagBit::VERTEX) {
        encoder.setVertexBuffer(_mtlBuffer, offset, binding);
    }

    if (stages & ShaderStageFlagBit::FRAGMENT) {
        encoder.setFragmentBuffer(_mtlBuffer, offset, binding);
    }
}

} // namespace gfx
} // namespace cc
