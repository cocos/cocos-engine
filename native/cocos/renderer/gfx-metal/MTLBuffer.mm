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
    
    if (_size == 4)
        _indexType = MTLIndexTypeUInt32;
    
    if ((_flags & GFXBufferFlagBit::BAKUP_BUFFER) && _size > 0)
    {
        _buffer = (uint8_t*)CC_MALLOC(_size);
        _device->getMemoryStatus().bufferSize += _size;
    }
    
    switch (info.usage) {
        case GFXBufferUsage::VERTEX:
        case GFXBufferUsage::INDEX:
        case GFXBufferUsage::UNIFORM:
            _mtlBuffer = [id<MTLDevice>(((CCMTLDevice*)_device)->getMTLDevice() ) newBufferWithLength:_size options:toMTLResourseOption(info.memUsage)];
            if (_mtlBuffer == nil)
            {
                CCASSERT(false, "Failed to create MTLBuffer.");
                return false;
            }
            break;
        case GFXBufferUsage::TRANSFER_DST:
        case GFXBufferUsage::TRANSFER_SRC:
            _transferBuffer = (uint8_t*)CC_MALLOC(_size);
            if (!_transferBuffer)
            {
                CCASSERT(false, "CCMTLBuffer: failed to create memory for transfer buffer.");
                return false;
            }
            _device->getMemoryStatus().bufferSize += _size;
            break;
            
        case GFXBufferUsage::STORAGE:
        case GFXBufferUsage::INDIRECT:
            //TODO
            break;
        default:
            CCASSERT(false, "CCMTLBuffer: unsurpported GFXBuffer type.");
            return false;
    }
    
    if (info.flags == GFXBufferFlagBit::BAKUP_BUFFER)
    {
        _buffer = (uint8_t*)CC_MALLOC(_size);
        if (!_buffer)
            CCLOG("CCMTLBuffer: failed to create backup memory.");
        else
            _device->getMemoryStatus().bufferSize += _size;
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
    //TODO
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
}

NS_CC_END
