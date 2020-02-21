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
CCMTLTexture::~CCMTLTexture() { destroy(); }

bool CCMTLTexture::initialize(const GFXTextureInfo& info)
{
    _type = info.type;
    _usage = info.usage;
    _format = info.format;
    _width = info.width;
    _height = info.height;
    _depth = info.depth;
    _arrayLayer = info.arrayLayer;
    _mipLevel = info.mipLevel;
    _samples = info.samples;
    _flags = info.flags;
    _size = GFXFormatSize(_format, _width, _height, _depth);
    
    if (_flags & GFXTextureFlags::BAKUP_BUFFER)
    {
        _buffer = (uint8_t*)CC_MALLOC(_size);
        _device->memoryStatus().textureSize += _size;
    }
    
    _convertedFormat = mu::convertGFXPixelFormat(_format);
    MTLPixelFormat mtlFormat = mu::toMTLPixelFormat(_convertedFormat);
    if (mtlFormat == MTLPixelFormatInvalid)
        return false;
    
    MTLTextureDescriptor* descriptor = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:mtlFormat
                                                                                          width:_width
                                                                                         height:_height
                                                                                      mipmapped:_flags & GFXTextureFlags::GEN_MIPMAP];
    descriptor.usage = mu::toMTLTextureUsage(_usage);
    descriptor.textureType = mu::toMTLTextureType(_type, _arrayLayer, _flags & GFXTextureFlags::CUBEMAP);
    descriptor.sampleCount = mu::toMTLSampleCount(_samples);
    descriptor.mipmapLevelCount = _mipLevel;
    descriptor.arrayLength = _arrayLayer;
    
    //FIXME: should change to MTLStorageModeManaged if texture usage is GFXTextureFlags::BAKUP_BUFFER?
    if (_usage & GFXTextureUsage::COLOR_ATTACHMENT ||
        _usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT ||
        _usage & GFXTextureUsage::INPUT_ATTACHMENT ||
        _usage & GFXTextureUsage::TRANSIENT_ATTACHMENT)
    {
        descriptor.resourceOptions = MTLResourceStorageModePrivate;
    }
    
    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice*>(_device)->getMTLDevice() );
    _mtlTexture = [mtlDevice newTextureWithDescriptor:descriptor];
    
    if (_mtlTexture)
        _device->memoryStatus().textureSize += _size;
    
    return _mtlTexture != nil;
}

void CCMTLTexture::destroy()
{
    if (_buffer)
    {
        CC_FREE(_buffer);
        _device->memoryStatus().textureSize -= _size;
        _buffer = nullptr;
    }
    
    if (_mtlTexture)
    {
        [_mtlTexture release];
        _mtlTexture = nil;
    }
}

void CCMTLTexture::resize(uint width, uint height)
{
    //TODO
}

void CCMTLTexture::update(uint8_t* data, const GFXBufferTextureCopy& region)
{
    if (!_mtlTexture)
        return;
    
    uint8_t* convertedData = convertData(data,
                                         region.texExtent.width * region.texExtent.height,
                                         _format);
    
    MTLRegion mtlRegion =
    {
        {(uint)region.texOffset.x, (uint)region.texOffset.y, (uint)region.texOffset.z},
        {region.texExtent.width, region.texExtent.height, region.texExtent.depth}
    };
    
    [_mtlTexture replaceRegion:mtlRegion
                   mipmapLevel:region.texSubres.baseMipLevel
                     withBytes:convertedData
                   bytesPerRow:GFX_FORMAT_INFOS[(uint)_convertedFormat].size * region.texExtent.width];
    
    if (convertedData != data)
        CC_FREE(convertedData);
}

NS_CC_END
