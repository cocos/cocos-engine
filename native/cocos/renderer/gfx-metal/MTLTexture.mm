#include "MTLStd.h"
#include "MTLTexture.h"
#include "MTLUtils.h"
#include "MTLDevice.h"

NS_CC_BEGIN

namespace
{
    uint8_t* convertRGB8ToRGBA8(uint8_t* source, uint length)
    {
        uint finalLength = length * 4;
        uint8* out = (uint8*)CC_MALLOC(finalLength);
        if (!out)
        {
            CC_LOG_WARNING("Failed to alloc memory in convertRGB8ToRGBA8().");
            return source;
        }
        
        uint8_t* src = source;
        uint8_t* dst = out;
        for (uint i = 0; i < length; ++i)
        {
            *dst++ = *src++;
            *dst++ = *src++;
            *dst++ = *src++;
            *dst++ = 255;
        }
        
        return out;
    }
    
    uint8_t* convertData(uint8_t* source, uint length, GFXFormat type)
    {
        switch (type) {
            case GFXFormat::RGB8: return convertRGB8ToRGBA8(source, length);
            default: return source;
        }
    }
}

CCMTLTexture::CCMTLTexture(GFXDevice* device) : GFXTexture(device) {}
CCMTLTexture::~CCMTLTexture() { Destroy(); }

bool CCMTLTexture::Initialize(const GFXTextureInfo& info)
{
    type_ = info.type;
    usage_ = info.usage;
    format_ = info.format;
    width_ = info.width;
    height_ = info.height;
    depth_ = info.depth;
    array_layer_ = info.array_layer;
    mip_level_ = info.mip_level;
    samples_ = info.samples;
    flags_ = info.flags;
    size_ = GFXFormatSize(format_, width_, height_, depth_);
    
    if (flags_ & GFXTextureFlags::BAKUP_BUFFER)
    {
        buffer_ = (uint8_t*)CC_MALLOC(size_);
        device_->mem_status().texture_size += size_;
    }
    
    _convertedFormat = mu::convertGFXPixelFormat(format_);
    MTLPixelFormat mtlFormat = mu::toMTLPixelFormat(_convertedFormat);
    if (mtlFormat == MTLPixelFormatInvalid)
        return false;
    
    MTLTextureDescriptor* descriptor = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:mtlFormat
                                                                                          width:width_
                                                                                         height:height_
                                                                                      mipmapped:flags_ & GFXTextureFlags::GEN_MIPMAP];
    descriptor.usage = mu::toMTLTextureUsage(usage_);
    descriptor.textureType = mu::toMTLTextureType(type_, array_layer_, flags_ & GFXTextureFlags::CUBEMAP);
    descriptor.sampleCount = mu::toMTLSampleCount(samples_);
    descriptor.mipmapLevelCount = mip_level_;
    descriptor.arrayLength = array_layer_;
    
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX_OSX)
    //FIXME: is it correct here for performace optimization?
    // Should change to MTLStorageModeManaged if texture usage is GFXTextureFlags::BAKUP_BUFFER?
    if (usage_ == GFXTextureUsage::COLOR_ATTACHMENT ||
        usage_ == GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT ||
        usage_ == GFXTextureUsage::INPUT_ATTACHMENT ||
        usage_ == GFXTextureUsage::TRANSIENT_ATTACHMENT)
    {
        descriptor.storageMode = MTLStorageModePrivate;
    }
#endif
    
    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice*>(device_)->getMTLDevice() );
    _mtlTexture = [mtlDevice newTextureWithDescriptor:descriptor];
    
    if (_mtlTexture)
        device_->mem_status().texture_size += size_;
    
    return _mtlTexture != nil;
}

void CCMTLTexture::Destroy()
{
    if (buffer_)
    {
        CC_FREE(buffer_);
        device_->mem_status().texture_size -= size_;
        buffer_ = nullptr;
    }
    
    if (_mtlTexture)
    {
        [_mtlTexture release];
        _mtlTexture = nil;
    }
}

void CCMTLTexture::Resize(uint width, uint height)
{
    //TODO
}

void CCMTLTexture::update(uint8_t* data, const GFXBufferTextureCopy& region)
{
    if (!_mtlTexture)
        return;
    
    uint8_t* convertedData = convertData(data,
                                         region.tex_extent.width * region.tex_extent.height,
                                         format_);
    
    MTLRegion mtlRegion =
    {
        {(uint)region.tex_offset.x, (uint)region.tex_offset.y, (uint)region.tex_offset.z},
        {region.tex_extent.width, region.tex_extent.height, region.tex_extent.depth}
    };
    
    [_mtlTexture replaceRegion:mtlRegion
                   mipmapLevel:region.tex_subres.base_mip_level
                     withBytes:convertedData
                   bytesPerRow:GFX_FORMAT_INFOS[(uint)_convertedFormat].size * region.tex_extent.width];
    
    if (convertedData != data)
        CC_FREE(convertedData);
}

NS_CC_END
