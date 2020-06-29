#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLDevice.h"
#include "MTLUtils.h"
#import <Metal/Metal.h>

#define MINIMUMR_REQUIRED_SIZE_4KB 4096

namespace cc {
namespace gfx {

CCMTLBuffer::CCMTLBuffer(Device *device) : Buffer(device) {}

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
            _status = Status::FAILED;
            CC_LOG_ERROR("CCMTLBuffer: Failed to create backup buffer.");
            return false;
        }
    }

    if (_usage & BufferUsageBit::VERTEX ||
        _usage & BufferUsageBit::UNIFORM) {
        //for single-use data smaller than 4 KB, use setVertexBytes:length:atIndex: instead
        //see more detail at https://developer.apple.com/documentation/metal/mtlrendercommandencoder/1515846-setvertexbytes?language=objc
        if (_size < MINIMUMR_REQUIRED_SIZE_4KB) {
            _useOptimizedBufferEncoder = true;
            _bufferBytes = static_cast<uint8_t *>(CC_MALLOC(_size));
            _device->getMemoryStatus().bufferSize += _size;
        } else {
            createMTLBuffer(_size, _memUsage);
        }
    } else if (_usage & BufferUsageBit::INDEX ||
               _usage & BufferUsageBit::INDIRECT) {
        createMTLBuffer(_size, _memUsage);
    } else if (_usage & BufferUsageBit::TRANSFER_SRC ||
               _usage & BufferUsageBit::TRANSFER_DST) {
        _transferBuffer = (uint8_t *)CC_MALLOC(_size);
        if (!_transferBuffer) {
            _status = Status::FAILED;
            CCASSERT(false, "CCMTLBuffer: failed to create memory for transfer buffer.");
            return false;
        }
        _device->getMemoryStatus().bufferSize += _size;
    } else {
        _status = Status::FAILED;
        CCASSERT(false, "Unsupported BufferType, create buffer failed.");
        return false;
    }

    _status = Status::SUCCESS;
    return true;
}

bool CCMTLBuffer::createMTLBuffer(uint size, MemoryUsage usage) {
    if (_mtlBuffer)
        [_mtlBuffer release];

    _mtlResourceOptions = mu::toMTLResourseOption(usage);
    _mtlBuffer = [id<MTLDevice>(((CCMTLDevice *)_device)->getMTLDevice()) newBufferWithLength:size
                                                                                      options:_mtlResourceOptions];
    if (_mtlBuffer == nil) {
        _status = Status::FAILED;
        CCASSERT(false, "Failed to create MTLBuffer.");
        return false;
    }
    return true;
}

void CCMTLBuffer::destroy() {
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

    if (_bufferBytes) {
        CC_FREE(_bufferBytes);
        _device->getMemoryStatus().bufferSize -= _size;
        _bufferBytes = nullptr;
    }
    _status = Status::UNREADY;
}

void CCMTLBuffer::resize(uint size) {
    if (_size == size)
        return;

    if (_usage & BufferUsageBit::VERTEX ||
        _usage & BufferUsageBit::INDEX ||
        _usage & BufferUsageBit::UNIFORM ||
        _usage & BufferUsageBit::INDIRECT) {
        if (_useOptimizedBufferEncoder) {
            if (size < MINIMUMR_REQUIRED_SIZE_4KB)
                resizeBuffer(&_bufferBytes, size, _size);
            else {
                if (_bufferBytes)
                    CC_SAFE_FREE(_bufferBytes);

                _useOptimizedBufferEncoder = false;
                createMTLBuffer(size, _memUsage);
            }
        } else {
            createMTLBuffer(size, _memUsage);
        }
    }

    const uint oldSize = _size;
    _size = size;
    _count = _size / _stride;
    resizeBuffer(&_transferBuffer, _size, oldSize);
    resizeBuffer(&_buffer, _size, oldSize);
    _status = Status::SUCCESS;
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
        _status = Status::FAILED;
        CC_LOG_ERROR("Failed to resize buffer.");
        return;
    }

    CC_FREE(oldBuffer);
    status.bufferSize -= oldSize;
    _status = Status::SUCCESS;
}

void CCMTLBuffer::update(void *buffer, uint offset, uint size) {
    if (_buffer)
        memcpy(_buffer + offset, buffer, size);

    if (_usage & BufferUsageBit::INDIRECT) {
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

    if (_bufferBytes)
        memcpy(_bufferBytes + offset, buffer, size);

    if (_mtlBuffer) {
        if (_mtlResourceOptions == MTLResourceStorageModePrivate) {
            static_cast<CCMTLDevice *>(_device)->blitBuffer(buffer, offset, size, _mtlBuffer);
        } else {
            uint8_t *dst = (uint8_t *)(_mtlBuffer.contents) + offset;
            memcpy(dst, buffer, size);
            if (_mtlResourceOptions == MTLResourceStorageModeManaged)
                [_mtlBuffer didModifyRange:NSMakeRange(0, _size)]; // Synchronize the managed buffer.
        }
        return;
    }

    if (_transferBuffer) {
        memcpy(_transferBuffer + offset, buffer, size);
        return;
    }
}

void CCMTLBuffer::encodeBuffer(id<MTLRenderCommandEncoder> encoder, uint offset, uint binding, ShaderType stages) {
    if (encoder == nil) {
        CC_LOG_ERROR("CCMTLBuffer::encodeBuffer: MTLRenderCommandEncoder should not be nil.");
        return;
    }

    if (stages & ShaderType::VERTEX) {
        if (_useOptimizedBufferEncoder) {
            [encoder setVertexBytes:_bufferBytes
                             length:_size
                            atIndex:binding];
        } else {
            [encoder setVertexBuffer:_mtlBuffer
                              offset:offset
                             atIndex:binding];
        }
    }

    if (stages & ShaderType::FRAGMENT) {
        if (_useOptimizedBufferEncoder) {
            [encoder setFragmentBytes:_bufferBytes
                               length:_size
                              atIndex:binding];
        } else {
            [encoder setFragmentBuffer:_mtlBuffer
                                offset:offset
                               atIndex:binding];
        }
    }
}

} // namespace gfx
} // namespace cc
