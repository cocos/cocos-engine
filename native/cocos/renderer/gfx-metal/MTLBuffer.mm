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

bool CCMTLBuffer::Initialize(const GFXBufferInfo& info)
{
    usage_ = info.usage;
    mem_usage_ = info.mem_usage;
    size_ = info.size;
    stride_ = std::max(info.stride, 1U);
    count_ = size_ / stride_;
    flags_ = info.flags;
    
    if ((flags_ & GFXBufferFlagBit::BAKUP_BUFFER) && size_ > 0)
    {
        buffer_ = (uint8_t*)CC_MALLOC(size_);
        device_->memoryStatus().buffer_size += size_;
    }
    
    switch (info.usage) {
        case GFXBufferUsage::VERTEX:
        case GFXBufferUsage::INDEX:
        case GFXBufferUsage::UNIFORM:
            _mtlBuffer = [id<MTLDevice>(((CCMTLDevice*)device_)->getMTLDevice() ) newBufferWithLength:size_ options:toMTLResourseOption(info.mem_usage)];
            if (_mtlBuffer == nil)
            {
                CCASSERT(false, "Failed to create MTLBuffer.");
                return false;
            }
            break;
        case GFXBufferUsage::TRANSFER_DST:
        case GFXBufferUsage::TRANSFER_SRC:
            _transferBuffer = (uint8_t*)CC_MALLOC(size_);
            if (!_transferBuffer)
            {
                CCASSERT(false, "CCMTLBuffer: failed to create memory for transfer buffer.");
                return false;
            }
            device_->memoryStatus().buffer_size += size_;
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
        buffer_ = (uint8_t*)CC_MALLOC(size_);
        if (!buffer_)
            CCLOG("CCMTLBuffer: failed to create backup memory.");
        else
            device_->memoryStatus().buffer_size += size_;
    }
    
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
        device_->memoryStatus().buffer_size -= size_;
    }
    
    if (buffer_)
    {
        CC_FREE(buffer_);
        device_->memoryStatus().buffer_size -= size_;
        buffer_ = nullptr;
    }
}

void CCMTLBuffer::Resize(uint size)
{
    //TODO
}

void CCMTLBuffer::Update(void* buffer, uint offset, uint size)
{
    if (_mtlBuffer)
    {
        uint8_t* dst = (uint8_t*)(_mtlBuffer.contents) + offset;
        memcpy(dst, buffer, size);
    }
    if (_transferBuffer)
        memcpy(_transferBuffer + offset, buffer, size);
    if (buffer_)
        memcpy(buffer_ + offset, buffer, size);
}

NS_CC_END
