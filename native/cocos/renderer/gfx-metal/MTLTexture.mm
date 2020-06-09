#include "MTLStd.h"
#include "MTLTexture.h"
#include "MTLUtils.h"
#include "MTLDevice.h"
#include <platform/mac/CCView.h>

NS_CC_BEGIN

namespace {
uint8_t *convertData(uint8_t *source, uint length, GFXFormat type) {
    switch (type) {
        case GFXFormat::RGB8:   return mu::convertRGB8ToRGBA8(source, length);
        case GFXFormat::RGB32F: return mu::convertRGB32FToRGBA32F(source, length);
        default: return source;
    }
}
} // end of namespace

CCMTLTexture::CCMTLTexture(GFXDevice *device) : GFXTexture(device) {}
CCMTLTexture::~CCMTLTexture() { destroy(); }

bool CCMTLTexture::initialize(const GFXTextureInfo &info) {
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
    
    if (_flags & GFXTextureFlags::BAKUP_BUFFER) {
        _buffer = (uint8_t*)CC_MALLOC(_size);
        if (!_buffer) {
            _status = GFXStatus::FAILED;
            CC_LOG_ERROR("CCMTLTexture: CC_MALLOC backup buffer failed.");
            return false;
        }
        _device->getMemoryStatus().textureSize += _size;
    }
    
    if (!createMTLTexture()) {
        _status = GFXStatus::FAILED;
        CC_LOG_ERROR("CCMTLTexture: create MTLTexture failed.");
        return false;
    }
    
    _device->getMemoryStatus().textureSize += _size;
    _status = GFXStatus::SUCCESS;
    return true;
}

bool CCMTLTexture::initialize(const GFXTextureViewInfo &info) {
    if (!info.texture) {
        _status = GFXStatus::FAILED;
        return false;
    }
    
    _type = info.type;
    _usage = info.texture->getUsage();
    _format = info.format;
    _width = info.texture->getWidth();
    _height = info.texture->getHeight();
    _depth = info.texture->getDepth();
    _arrayLayer = info.texture->getArrayLayer();
    _mipLevel = info.texture->getMipLevel();
    _samples = info.texture->getSamples();
    _flags = info.texture->getFlags();
    _size = info.texture->getSize();
    
    _convertedFormat = mu::convertGFXPixelFormat(_format);
    auto mtlTextureType = mu::toMTLTextureType(_type);
    _mtlTexture = [id<MTLTexture>(info.texture) newTextureViewWithPixelFormat:mu::toMTLPixelFormat(_convertedFormat)
                                                                  textureType:mtlTextureType
                                                                       levels:NSMakeRange(info.baseLevel, info.levelCount)
                                                                       slices:NSMakeRange(info.baseLayer, info.layerCount)];
    if (!_mtlTexture) {
        _status = GFXStatus::FAILED;
        return false;
    }
    
    _status = GFXStatus::SUCCESS;
    return true;
}

bool CCMTLTexture::createMTLTexture() {
    if (_width == 0 || _height == 0) {
        
        CC_LOG_ERROR("CCMTLTexture: width or height should not be zero.");
        return false;
    }
    _convertedFormat = mu::convertGFXPixelFormat(_format);
    MTLPixelFormat mtlFormat = mu::toMTLPixelFormat(_convertedFormat);
    if (mtlFormat == MTLPixelFormatInvalid)
        return false;
    
    MTLTextureDescriptor* descriptor = nullptr;
    auto mtlTextureType = mu::toMTLTextureType(_type);
    switch (mtlTextureType) {
        case MTLTextureType2D:
        case MTLTextureType2DArray:
            //No need to set mipmapped flag since mipmapLevelCount was explicty set via `_mipLevel`.
            descriptor = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:mtlFormat
                                                                            width:_width
                                                                           height:_height
                                                                        mipmapped:NO];
            break;
        case MTLTextureTypeCube:
            descriptor = [MTLTextureDescriptor textureCubeDescriptorWithPixelFormat:mtlFormat
                                                                               size:_width
                                                                          mipmapped:NO];
            break;
        default:
            CCASSERT(false, "Unsupported MTLTextureType, create MTLTextureDescriptor failed.");
            break;
    }
    
    if(descriptor == nullptr)
        return false;
    
    descriptor.usage = mu::toMTLTextureUsage(_usage);
    descriptor.textureType = mu::toMTLTextureType(_type);
    descriptor.sampleCount = mu::toMTLSampleCount(_samples);
    descriptor.mipmapLevelCount = _mipLevel;
    descriptor.arrayLength = _flags & GFXTextureFlagBit::CUBEMAP ? 1 : _arrayLayer;
    
    //FIXME: should change to MTLStorageModeManaged if texture usage is GFXTextureFlags::BAKUP_BUFFER?
    if (_usage & GFXTextureUsage::COLOR_ATTACHMENT ||
        _usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT ||
        _usage & GFXTextureUsage::INPUT_ATTACHMENT ||
        _usage & GFXTextureUsage::TRANSIENT_ATTACHMENT) {
        descriptor.resourceOptions = MTLResourceStorageModePrivate;
    }
    
    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice*>(_device)->getMTLDevice() );
    _mtlTexture = [mtlDevice newTextureWithDescriptor:descriptor];
    
    return _mtlTexture != nil;
}

void CCMTLTexture::destroy() {
    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().textureSize -= _size;
        _buffer = nullptr;
    }
    
    if (_mtlTexture) {
        [_mtlTexture release];
        _mtlTexture = nil;
    }
    
    _status = GFXStatus::UNREADY;
}

void CCMTLTexture::resize(uint width, uint height) {
    if(_width == width && _height == height)
        return;
    
    auto oldSize = _size;
    auto oldWidth = _width;
    auto oldHeight = _height;
    id<MTLTexture> oldMTLTexture = _mtlTexture;
    
    _width = width;
    _height = height;
    _size = GFXFormatSize(_format, _width, _height, _depth);
    if (!createMTLTexture()) {
        _status = GFXStatus::FAILED;
        _width = oldWidth;
        _height = oldHeight;
        _size = oldSize;
        _mtlTexture = oldMTLTexture;
        CC_LOG_ERROR("CCMTLTexture: create MTLTexture failed when try to resize the texture.");
        return;
    }
    
    if (oldMTLTexture) {
        [oldMTLTexture release];
    }
    
    _device->getMemoryStatus().textureSize -= oldSize;
    if (_flags & GFXTextureFlags::BAKUP_BUFFER) {
        const uint8_t* oldBuffer = _buffer;
        uint8_t* buffer = (uint8_t*)CC_MALLOC(_size);
        if(!buffer)
        {
            _status = GFXStatus::FAILED;
            CC_LOG_ERROR("CCMTLTexture: CC_MALLOC backup buffer failed when try to resize the texture.");
            return;
        }
        CC_FREE(oldBuffer);
        _buffer = buffer;
        _device->getMemoryStatus().textureSize -= oldSize;
        _device->getMemoryStatus().textureSize += _size;
    }
    
    _device->getMemoryStatus().textureSize += _size;
    _status = GFXStatus::SUCCESS;
}

void CCMTLTexture::update(uint8_t * const *datas, const GFXBufferTextureCopyList &regions) {
    if (!_mtlTexture)
        return;

    uint n = 0;
    uint w = 0;
    uint h = 0;
    auto mtlTextureType = mu::toMTLTextureType(_type);
    switch (mtlTextureType) {
        case MTLTextureType2D:
            for (size_t i = 0; i < regions.size(); i++) {
                const auto &region = regions[i];
                w = region.texExtent.width;
                h = region.texExtent.height;
               
                uint8_t *buffer = datas[n];
                uint8_t *convertedData = convertData(buffer, w * h, _format);
                MTLRegion mtlRegion = { {(uint)region.texOffset.x, (uint)region.texOffset.y, (uint)region.texOffset.z}, {w, h, 1} };
                [_mtlTexture replaceRegion:mtlRegion
                               mipmapLevel:region.texSubres.mipLevel
                                 withBytes:convertedData
                               bytesPerRow:GFX_FORMAT_INFOS[(uint)_convertedFormat].size * w];
                
                if (convertedData != datas[n])
                    CC_FREE(convertedData);
                n++;
            }
            break;
        case MTLTextureType2DArray:
        case MTLTextureTypeCube:
            for (size_t i = 0; i < regions.size(); i++) {
                const auto &region = regions[i];
                auto layer = region.texSubres.baseArrayLayer;
                auto layerCount = layer + region.texSubres.layerCount;
                for (; layer < layerCount; layer++) {
                    w = region.texExtent.width;
                    h = region.texExtent.height;
                    uint8_t *buffer = datas[n];
                    uint8_t *convertedData = convertData(buffer, w * h, _format);
                    MTLRegion mtlRegion = { {(uint)region.texOffset.x, (uint)region.texOffset.y, (uint)region.texOffset.z}, {w, h, 1} };
                    [_mtlTexture replaceRegion:mtlRegion
                                   mipmapLevel:region.texSubres.mipLevel
                                         slice:layer
                                     withBytes:convertedData
                                   bytesPerRow:GFX_FORMAT_INFOS[(uint)_convertedFormat].size * w
                                 bytesPerImage:0];
                    if (convertedData != datas[n++])
                        CC_FREE(convertedData);
                }
            }
            break;
        default:
            CCASSERT(false, "Unsupported MTLTextureType, metal texture update failed.");
            break;
    }
    if(_flags & GFXTextureFlags::GEN_MIPMAP)
        generateMipmaps();
}

void CCMTLTexture::generateMipmaps() {
    id<MTLCommandQueue> commandQueue = ((View*)(((CCMTLDevice*)_device)->getMTKView())).mtlCommandQueue;
    id<MTLCommandBuffer> mtlCommandBuffer = [commandQueue commandBuffer];
    [mtlCommandBuffer enqueue];
    id<MTLBlitCommandEncoder> commandEncoder = [mtlCommandBuffer blitCommandEncoder];
    [commandEncoder generateMipmapsForTexture:_mtlTexture];
    [commandEncoder endEncoding];
    [mtlCommandBuffer commit];
}

NS_CC_END
