#import "MTLStd.h"
#import "MTLBuffer.h"

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
    Destroy();
}

bool CCMTLBuffer::Initialize(const GFXBufferInfo& info)
{
    size_ = info.size;
    switch (info.usage) {
        case GFXBufferUsage::VERTEX:
        case GFXBufferUsage::INDEX:
        case GFXBufferUsage::UNIFORM:
            _metalBuffer = [id<MTLDevice>(device_) newBufferWithLength:size_ options:toMTLResourseOption(info.mem_usage)];
            if (_metalBuffer == nil)
            {
                CCASSERT(false, "Failed to create MTLBuffer.");
                return false;
            }
            break;
        case GFXBufferUsage::TRANSFER_DST:
        case GFXBufferUsage::TRANSFER_SRC:
        case GFXBufferUsage::STORAGE:
        case GFXBufferUsage::INDIRECT:
            //FIXME: allocate system memory for these types?
            _systemMemory = (uint8_t*)CC_MALLOC(size_);
            if (!_systemMemory)
            {
                CCASSERT(false, "CCMTLBuffer: failed to create memory.")
                return false;
            }
            device_->mem_status().buffer_size += size_;
            _shareMemory = true;
            break;
            
        default:
            CCASSERT(false, "CCMTLBuffer: unsurpported GFXBuffer type.");
            return false;
    }
    
    if (info.flags == GFXBufferFlagBit::BAKUP_BUFFER)
    {
        if (_shareMemory)
            buffer_ = _systemMemory;
        else
        {
            buffer_ = (uint8_t*)CC_MALLOC(size_);
            if (!buffer_)
                CCLOG("CCMTLBuffer: failed to create backup memory.");
            else
                device_->mem_status().buffer_size += size_;
        }
    }
    
    return true;
}

void CCMTLBuffer::Destroy()
{
    if (_metalBuffer)
    {
        [id<MTLBuffer>(_metalBuffer) release];
        _metalBuffer = nullptr;
    }
    
    if (_systemMemory)
    {
        CC_FREE(_systemMemory);
        _systemMemory = nullptr;
        device_->mem_status().buffer_size -= size_;
    }
    
    if (buffer_ && !_shareMemory)
    {
        CC_FREE(buffer_);
        buffer_ = nullptr;
        device_->mem_status().buffer_size -= size_;
    }
}

void CCMTLBuffer::Resize(uint size)
{
    //TODO
}

void CCMTLBuffer::Update(void* buffer, uint offset, uint size)
{
    if (_metalBuffer)
    {
        uint8_t* dst = (uint8_t*)(id<MTLBuffer>(_metalBuffer).contents) + offset;
        memcpy(dst, buffer, size);
    }
    else if (_systemMemory)
    {
        memcpy(_systemMemory + offset, buffer, size);
    }
    else
        CCASSERT(false, "CCMTLBuffer: failed to buffer. Unsupported GFXBuffer type.");
    
    if (buffer_ && !_shareMemory)
        memcpy(buffer_ + offset, buffer, size);
}

NS_CC_END
