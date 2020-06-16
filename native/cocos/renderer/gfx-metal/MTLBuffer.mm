#include "MTLStd.h"
#include "MTLBuffer.h"
#include "MTLDevice.h"
#include "MTLUtils.h"
#import <Metal/Metal.h>

#define MINIMUMR_REQUIRED_SIZE_4KB 4096

namespace cc {

CCMTLBuffer::CCMTLBuffer(GFXDevice *device) : GFXBuffer(device) {}

CCMTLBuffer::~CCMTLBuffer() {
    destroy();
}

bool CCMTLBuffer::initialize(const GFXBufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _stride = std::max(info.stride, 1U);
    _count = _size / _stride;
    _flags = info.flags;
    
    if (_usage & GFXBufferUsage::INDEX) {
        switch (_stride) {
            case 4: _indexType = MTLIndexTypeUInt32; break;
            case 2: _indexType = MTLIndexTypeUInt16; break;
            default:
                CC_LOG_ERROR("CCMTLBuffer:: Illegal index buffer stride.");
                break;
        }
    }
    
    if ((_flags & GFXBufferFlagBit::BAKUP_BUFFER) && _size > 0) {
        _buffer = (uint8_t*)CC_MALLOC(_size);
        if (_buffer)
            _device->getMemoryStatus().bufferSize += _size;
        else {
            _status = GFXStatus::FAILED;
            CC_LOG_ERROR("CCMTLBuffer: Failed to create backup buffer.");
            return false;
        }
    }
    
    if (_usage & GFXBufferUsage::VERTEX ||
        _usage & GFXBufferUsage::UNIFORM) {
        //for single-use data smaller than 4 KB, use setVertexBytes:length:atIndex: instead
        //see more detail at https://developer.apple.com/documentation/metal/mtlrendercommandencoder/1515846-setvertexbytes?language=objc
        if (_size < MINIMUMR_REQUIRED_SIZE_4KB) {
            _useOptimizedBufferEncoder = true;
            _bufferBytes = static_cast<uint8_t*>(CC_MALLOC(_size));
            _device->getMemoryStatus().bufferSize += _size;
        }
        else {
            createMTLBuffer(_size, _memUsage);
        }
    }
    else if(_usage & GFXBufferUsage::INDEX) {
        createMTLBuffer(_size, _memUsage);
    }
    else if (_usage & GFXBufferUsageBit::INDIRECT) {
        _indirects.resize(_count);
    }
    else if (_usage & GFXBufferUsageBit::TRANSFER_SRC ||
             _usage & GFXBufferUsageBit::TRANSFER_DST) {
        _transferBuffer = (uint8_t*)CC_MALLOC(_size);
        if (!_transferBuffer) {
            _status = GFXStatus::FAILED;
            CCASSERT(false, "CCMTLBuffer: failed to create memory for transfer buffer.");
            return false;
        }
        _device->getMemoryStatus().bufferSize += _size;
    }
    else {
        _status = GFXStatus::FAILED;
        CCASSERT(false, "Unsupported GFXBufferType, create buffer failed.");
        return false;
    }
    
    _status = GFXStatus::SUCCESS;
    return true;
}

bool CCMTLBuffer::createMTLBuffer(uint size, GFXMemoryUsage usage) {
    if (_mtlBuffer)
        [_mtlBuffer release];
    
    _mtlResourceOptions = mu::toMTLResourseOption(usage);
    _mtlBuffer = [id<MTLDevice>(((CCMTLDevice*)_device)->getMTLDevice() ) newBufferWithLength:size
                                                                                      options:_mtlResourceOptions];
    if (_mtlBuffer == nil) {
        _status = GFXStatus::FAILED;
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
    
    if(_bufferBytes) {
        CC_FREE(_bufferBytes);
        _device->getMemoryStatus().bufferSize -= _size;
        _bufferBytes = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

void CCMTLBuffer::resize(uint size) {
    if (_size == size)
        return;
    
    if (_usage & GFXBufferUsage::VERTEX ||
        _usage & GFXBufferUsage::INDEX ||
        _usage & GFXBufferUsage::UNIFORM) {
        if (_useOptimizedBufferEncoder) {
            if(size < MINIMUMR_REQUIRED_SIZE_4KB)
                resizeBuffer(&_bufferBytes, size, _size);
            else {
                if(_bufferBytes)
                    CC_SAFE_FREE(_bufferBytes);
                
                _useOptimizedBufferEncoder = false;
                createMTLBuffer(size, _memUsage);
            }   
        }
        else {
            createMTLBuffer(size, _memUsage);
        }
    }
    
    const uint oldSize = _size;
    _size = size;
    _count = _size / _stride;
    resizeBuffer(&_transferBuffer, _size, oldSize);
    resizeBuffer(&_buffer, _size, oldSize);
    _indirects.resize(_count);
    _status = GFXStatus::SUCCESS;
}

void CCMTLBuffer::resizeBuffer(uint8_t **buffer, uint size, uint oldSize) {
    if (!(*buffer))
        return;
    
    GFXMemoryStatus &status = _device->getMemoryStatus();
    const uint8_t *oldBuffer = *buffer;
    uint8_t *temp = (uint8_t*)CC_MALLOC(size);
    if (temp) {
        memcpy(temp, oldBuffer, std::min(oldSize, size) );
        *buffer = temp;
        status.bufferSize += size;
    }
    else
    {
        _status = GFXStatus::FAILED;
        CC_LOG_ERROR("Failed to resize buffer.");
        return;
    }
    
    CC_FREE(oldBuffer);
    status.bufferSize -= oldSize;
    _status = GFXStatus::SUCCESS;
}

void CCMTLBuffer::update(void *buffer, uint offset, uint size) {
    if (_buffer)
        memcpy(_buffer + offset, buffer, size);

    if (_usage & GFXBufferUsageBit::INDIRECT) {
        memcpy((uint8_t*)_indirects.data() + offset, buffer, size);
        return;
    }
   
    if(_bufferBytes)
        memcpy(_bufferBytes + offset, buffer, size);

    if(_mtlBuffer) {
        if(_mtlResourceOptions == MTLResourceStorageModePrivate) {
            static_cast<CCMTLDevice*>(_device)->blitBuffer(buffer, offset, size, _mtlBuffer);
        }
        else {
            uint8_t* dst = (uint8_t*)(_mtlBuffer.contents) + offset;
            memcpy(dst, buffer, size);
            if(_mtlResourceOptions == MTLResourceStorageModeManaged)
                [_mtlBuffer didModifyRange:NSMakeRange(0, _size)]; // Synchronize the managed buffer.
        }
        return;
    }
    
    if(_transferBuffer) {
        memcpy(_transferBuffer + offset, buffer, size);
        return;
    }
}

void CCMTLBuffer::encodeBuffer(id<MTLRenderCommandEncoder> encoder, uint offset, uint binding, GFXShaderType stages) {
    if(encoder == nil) {
        CC_LOG_ERROR("CCMTLBuffer::encodeBuffer: MTLRenderCommandEncoder should not be nil.");
        return;
    }
    
    if(stages & GFXShaderType::VERTEX) {
        if(_useOptimizedBufferEncoder) {
            [encoder setVertexBytes:_bufferBytes
                             length:_size
                            atIndex:binding];
        }
        else {
            [encoder setVertexBuffer:_mtlBuffer
                              offset:offset
                             atIndex:binding];
        }
    }
    
    if(stages & GFXShaderType::FRAGMENT) {
        if(_useOptimizedBufferEncoder) {
            [encoder setFragmentBytes:_bufferBytes
                               length:_size
                              atIndex:binding];
        }
        else {
            [encoder setFragmentBuffer:_mtlBuffer
                                offset:offset
                               atIndex:binding];
        }
    }
    
}

}
