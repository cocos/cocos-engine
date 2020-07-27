#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLTexture.h"
#include "MTLUtils.h"

namespace cc {
namespace gfx {

namespace {
const uint8_t *convertData(const uint8_t *source, uint length, Format type) {
    switch (type) {
        case Format::RGB8: return mu::convertRGB8ToRGBA8(source, length);
        case Format::RGB32F: return mu::convertRGB32FToRGBA32F(source, length);
        default: return source;
    }
}
} // end of namespace

CCMTLTexture::CCMTLTexture(Device *device) : Texture(device) {}
CCMTLTexture::~CCMTLTexture() { destroy(); }

bool CCMTLTexture::initialize(const TextureInfo &info) {
    _type = info.type;
    _usage = info.usage;
    _format = info.format;
    _width = info.width;
    _height = info.height;
    _depth = info.depth;
    _layerCount = info.layerCount;
    _levelCount = info.levelCount;
    _samples = info.samples;
    _flags = info.flags;
    _size = FormatSize(_format, _width, _height, _depth);

#if COCOS2D_DEBUG > 0
    switch (_format) { // device feature validation
        case Format::D16:
            if (_device->hasFeature(Feature::FORMAT_D16)) break;
            CC_LOG_ERROR("D16 texture format is not supported on this backend");
            return false;
        case Format::D16S8:
            if (_device->hasFeature(Feature::FORMAT_D16S8)) break;
            CC_LOG_WARNING("D16S8 texture format is not supported on this backend");
            return false;
        case Format::D24:
            if (_device->hasFeature(Feature::FORMAT_D24)) break;
            CC_LOG_WARNING("D24 texture format is not supported on this backend");
            return false;
        case Format::D24S8:
            if (_device->hasFeature(Feature::FORMAT_D24S8)) break;
            CC_LOG_WARNING("D24S8 texture format is not supported on this backend");
            return false;
        case Format::D32F:
            if (_device->hasFeature(Feature::FORMAT_D32F)) break;
            CC_LOG_WARNING("D32F texture format is not supported on this backend");
            return false;
        case Format::D32F_S8:
            if (_device->hasFeature(Feature::FORMAT_D32FS8)) break;
            CC_LOG_WARNING("D32FS8 texture format is not supported on this backend");
            return false;
        case Format::RGB8:
            if (_device->hasFeature(Feature::FORMAT_RGB8)) break;
            CC_LOG_WARNING("RGB8 texture format is not supported on this backend");
            return false;
        default:
            break;
    }
#endif

    if (_flags & TextureFlags::BAKUP_BUFFER) {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        if (!_buffer) {
            _status = Status::FAILED;
            CC_LOG_ERROR("CCMTLTexture: CC_MALLOC backup buffer failed.");
            return false;
        }
        _device->getMemoryStatus().textureSize += _size;
    }

    if (!createMTLTexture()) {
        _status = Status::FAILED;
        CC_LOG_ERROR("CCMTLTexture: create MTLTexture failed.");
        return false;
    }

    _device->getMemoryStatus().textureSize += _size;
    _status = Status::SUCCESS;
    return true;
}

bool CCMTLTexture::initialize(const TextureViewInfo &info) {
    _Type = ObjectType::TEXTURE_VIEW;

    if (!info.texture) {
        _status = Status::FAILED;
        return false;
    }

    _type = info.type;
    _usage = info.texture->getUsage();
    _format = info.format;
    _width = info.texture->getWidth();
    _height = info.texture->getHeight();
    _depth = info.texture->getDepth();
    _layerCount = info.texture->getLayerCount();
    _levelCount = info.texture->getLevelCount();
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
        _status = Status::FAILED;
        return false;
    }

    _status = Status::SUCCESS;
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

    MTLTextureDescriptor *descriptor = nullptr;
    auto mtlTextureType = mu::toMTLTextureType(_type);
    switch (mtlTextureType) {
        case MTLTextureType2D:
        case MTLTextureType2DArray:
            //No need to set mipmapped flag since mipmapLevelCount was explicty set via `_levelCount`.
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

    if (descriptor == nullptr)
        return false;

    descriptor.usage = mu::toMTLTextureUsage(_usage);
    descriptor.textureType = mu::toMTLTextureType(_type);
    descriptor.sampleCount = mu::toMTLSampleCount(_samples);
    descriptor.mipmapLevelCount = _levelCount;
    descriptor.arrayLength = _flags & TextureFlagBit::CUBEMAP ? 1 : _layerCount;

    //FIXME: should change to MTLStorageModeManaged if texture usage is TextureFlags::BAKUP_BUFFER?
    if (_usage & TextureUsage::COLOR_ATTACHMENT ||
        _usage & TextureUsage::DEPTH_STENCIL_ATTACHMENT ||
        _usage & TextureUsage::INPUT_ATTACHMENT ||
        _usage & TextureUsage::TRANSIENT_ATTACHMENT) {
        descriptor.resourceOptions = MTLResourceStorageModePrivate;
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice *>(_device)->getMTLDevice());
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

    _status = Status::UNREADY;
}

void CCMTLTexture::resize(uint width, uint height) {
    if (_width == width && _height == height)
        return;

    auto oldSize = _size;
    auto oldWidth = _width;
    auto oldHeight = _height;
    id<MTLTexture> oldMTLTexture = _mtlTexture;

    _width = width;
    _height = height;
    _size = FormatSize(_format, _width, _height, _depth);
    if (!createMTLTexture()) {
        _status = Status::FAILED;
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
    if (_flags & TextureFlags::BAKUP_BUFFER) {
        const uint8_t *oldBuffer = _buffer;
        uint8_t *buffer = (uint8_t *)CC_MALLOC(_size);
        if (!buffer) {
            _status = Status::FAILED;
            CC_LOG_ERROR("CCMTLTexture: CC_MALLOC backup buffer failed when try to resize the texture.");
            return;
        }
        CC_FREE(oldBuffer);
        _buffer = buffer;
        _device->getMemoryStatus().textureSize -= oldSize;
        _device->getMemoryStatus().textureSize += _size;
    }

    _device->getMemoryStatus().textureSize += _size;
    _status = Status::SUCCESS;
}

void CCMTLTexture::update(const uint8_t *const *datas, const BufferTextureCopyList &regions) {
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

                const uint8_t *buffer = datas[n];
                const uint8_t *convertedData = convertData(buffer, w * h, _format);
                MTLRegion mtlRegion = {{(uint)region.texOffset.x, (uint)region.texOffset.y, (uint)region.texOffset.z}, {w, h, 1}};
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
                    const uint8_t *buffer = datas[n];
                    const uint8_t *convertedData = convertData(buffer, w * h, _format);
                    MTLRegion mtlRegion = {{(uint)region.texOffset.x, (uint)region.texOffset.y, (uint)region.texOffset.z}, {w, h, 1}};
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
    if (_flags & TextureFlags::GEN_MIPMAP)
        generateMipmaps();
}

void CCMTLTexture::generateMipmaps() {
    id<MTLCommandQueue> mtlCommandQueue = id<MTLCommandQueue>(static_cast<CCMTLDevice *>(_device)->getMTLCommandQueue());
    id<MTLCommandBuffer> mtlCommandBuffer = [mtlCommandQueue commandBuffer];
    [mtlCommandBuffer enqueue];
    id<MTLBlitCommandEncoder> commandEncoder = [mtlCommandBuffer blitCommandEncoder];
    [commandEncoder generateMipmapsForTexture:_mtlTexture];
    [commandEncoder endEncoding];
    [mtlCommandBuffer commit];
}

} // namespace gfx
} // namespace cc
