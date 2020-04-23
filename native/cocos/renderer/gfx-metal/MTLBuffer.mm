#include "MTLStd.h"
#include "MTLBuffer.h"
#include "MTLDevice.h"
#import <Metal/Metal.h>

NS_CC_BEGIN

namespace
{
    //FIXME: not sure if it is correct to map like this
    MTLResourceOptions toMTLResourseOption(GFXMemoryUsage usage)
    {
        if (usage == GFXMemoryUsage::DEVICE)
            return MTLResourceStorageModePrivate;
        else
            return MTLResourceStorageModeShared;
    }
}

CCMTLBuffer::CCMTLBuffer(GFXDevice* device) : GFXBuffer(device) {}

CCMTLBuffer::~CCMTLBuffer()
{
    destroy();
}

bool CCMTLBuffer::initialize(const GFXBufferInfo& info)
{
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _stride = std::max(info.stride, 1U);
    _count = _size / _stride;
    _flags = info.flags;
    
    if (_usage & GFXBufferUsage::INDEX)
    {
        switch (_stride) {
            case 4: _indexType = MTLIndexTypeUInt32; break;
            case 2: _indexType = MTLIndexTypeUInt16; break;
            default:
                CC_LOG_ERROR("Illegal index buffer stride.");
                break;
        }
    }
    
    if ((_flags & GFXBufferFlagBit::BAKUP_BUFFER) && _size > 0)
    {
        _buffer = (uint8_t*)CC_MALLOC(_size);
        if (_buffer)
            _device->getMemoryStatus().bufferSize += _size;
        else
            CCLOG("Failed to create backup buffer.");
    }
    
    if (_usage & GFXBufferUsage::VERTEX ||
        _usage & GFXBufferUsage::INDEX ||
        _usage & GFXBufferUsage::UNIFORM)
    {
        _mtlResourceOptions = toMTLResourseOption(info.memUsage);
        if (_size > 0)
        {
            _mtlBuffer = [id<MTLDevice>(((CCMTLDevice*)_device)->getMTLDevice() ) newBufferWithLength:_size
                                                                                              options:_mtlResourceOptions];
            if (_mtlBuffer == nil)
            {
                CCASSERT(false, "Failed to create MTLBuffer.");
                return false;
            }
        }
    }
    else if (_usage & GFXBufferUsageBit::INDIRECT)
    {
        _indirects.resize(_count);
    }
    else if (_usage & GFXBufferUsageBit::TRANSFER_DST ||
             _usage & GFXBufferUsageBit::TRANSFER_SRC)
    {
        _transferBuffer = (uint8_t*)CC_MALLOC(_size);
        if (!_transferBuffer)
        {
            CCASSERT(false, "CCMTLBuffer: failed to create memory for transfer buffer.");
            return false;
        }
        _device->getMemoryStatus().bufferSize += _size;
    }
    else
    {
        CCASSERT(false, "Unsupported GFXBufferType, create buffer failed.");
        return false;
    }
    
    _status = GFXStatus::SUCCESS;
    return true;
}

void CCMTLBuffer::destroy()
{
    if (_mtlBuffer)
    {
        [_mtlBuffer release];
        _mtlBuffer = nil;
    }
    
    if (_transferBuffer)
    {
        CC_FREE(_transferBuffer);
        _transferBuffer = nullptr;
        _device->getMemoryStatus().bufferSize -= _size;
    }
    
    if (_buffer)
    {
        CC_FREE(_buffer);
        _device->getMemoryStatus().bufferSize -= _size;
        _buffer = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

void CCMTLBuffer::resize(uint size)
{
    if (_size == size)
        return;
    
    if (_usage & GFXBufferUsage::VERTEX ||
        _usage & GFXBufferUsage::INDEX ||
        _usage & GFXBufferUsage::UNIFORM)
    {
        if (_mtlBuffer) [_mtlBuffer release];
        
        _mtlBuffer = [id<MTLDevice>(((CCMTLDevice*)_device)->getMTLDevice() ) newBufferWithLength:size
                                                                                          options:_mtlResourceOptions];
        if (!_mtlBuffer)
        {
            CC_LOG_ERROR("Failed to resize buffer for metal buffer.");
            return;
        }
    }
    
    const uint oldSize = _size;
    _size = size;
    _count = _size / _stride;
    resizeBuffer(&_transferBuffer, _size, oldSize);
    resizeBuffer(&_buffer, _size, oldSize);
    _indirects.resize(_count);
}

void CCMTLBuffer::resizeBuffer(uint8_t** buffer, uint size, uint oldSize)
{
    if (!(*buffer) )
        return;
    
    GFXMemoryStatus& status = _device->getMemoryStatus();
    const uint8_t* oldBuff = *buffer;
    *buffer = (uint8_t*)CC_MALLOC(size);
    if (*buffer)
    {
        memcpy(*buffer, oldBuff, std::min(oldSize, size) );
        status.bufferSize += size;
    }
    else
    {
        CC_LOG_ERROR("Failed to resize buffer.");
    }
    
    CC_FREE(oldBuff);
    status.bufferSize -= oldSize;
}

void CCMTLBuffer::update(void* buffer, uint offset, uint size)
{
    if (_mtlBuffer)
    {
        uint8_t* dst = (uint8_t*)(_mtlBuffer.contents) + offset;
        memcpy(dst, buffer, size);
    }
    if (_transferBuffer)
        memcpy(_transferBuffer + offset, buffer, size);
    if (_buffer)
        memcpy(_buffer + offset, buffer, size);
    
    if(_usage & GFXBufferUsageBit::INDIRECT)
        memcpy((uint8_t*)_indirects.data() + offset, buffer, size);
}

NS_CC_END
