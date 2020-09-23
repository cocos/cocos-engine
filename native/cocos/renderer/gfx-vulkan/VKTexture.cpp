#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKTexture.h"

namespace cc {
namespace gfx {

CCVKTexture::CCVKTexture(Device *device)
: Texture(device) {
}

CCVKTexture::~CCVKTexture() {
}

bool CCVKTexture::initialize(const TextureInfo &info) {
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

#if CC_DEBUG > 0
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
        default: break;
    }
#endif

    if (_flags & TextureFlags::BAKUP_BUFFER) {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        _device->getMemoryStatus().textureSize += _size;
    }

    _gpuTexture = CC_NEW(CCVKGPUTexture);
    _gpuTexture->type = _type;
    _gpuTexture->format = _format;
    _gpuTexture->usage = _usage;
    _gpuTexture->width = _width;
    _gpuTexture->height = _height;
    _gpuTexture->depth = _depth;
    _gpuTexture->size = _size;
    _gpuTexture->arrayLayers = _layerCount;
    _gpuTexture->mipLevels = _levelCount;
    _gpuTexture->samples = _samples;
    _gpuTexture->flags = _flags;
    _gpuTexture->isPowerOf2 = math::IsPowerOfTwo(_width) && math::IsPowerOfTwo(_height);

    CCVKCmdFuncCreateTexture((CCVKDevice *)_device, _gpuTexture);
    _device->getMemoryStatus().textureSize += _size;

    _gpuTextureView = CC_NEW(CCVKGPUTextureView);
    createTextureView();

    return true;
}

bool CCVKTexture::initialize(const TextureViewInfo &info) {
    _isTextureView = true;

    if (!info.texture) {
        return false;
    }

    _type = info.texture->getType();
    _format = info.format;
    _baseLayer = info.baseLayer;
    _layerCount = info.layerCount;
    _baseLevel = info.baseLevel;
    _levelCount = info.levelCount;
    _usage = info.texture->getUsage();
    _width = info.texture->getWidth();
    _height = info.texture->getHeight();
    _depth = info.texture->getDepth();
    _samples = info.texture->getSamples();
    _flags = info.texture->getFlags();
    _size = FormatSize(_format, _width, _height, _depth);

    _gpuTexture = ((CCVKTexture *)info.texture)->gpuTexture();
    _gpuTextureView = CC_NEW(CCVKGPUTextureView);
    createTextureView();

    return true;
}

void CCVKTexture::createTextureView() {
    _gpuTextureView->gpuTexture = _gpuTexture;
    _gpuTextureView->type = _type;
    _gpuTextureView->format = _format;
    _gpuTextureView->baseLevel = _baseLevel;
    _gpuTextureView->levelCount = _levelCount;
    _gpuTextureView->baseLayer = _baseLayer;
    _gpuTextureView->layerCount = _layerCount;
    CCVKCmdFuncCreateTextureView((CCVKDevice *)_device, _gpuTextureView);
}

void CCVKTexture::destroy() {
    if (_gpuTextureView) {
        ((CCVKDevice *)_device)->gpuDescriptorHub()->disengage(_gpuTextureView);
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuTextureView);
        CC_DELETE(_gpuTextureView);
        _gpuTextureView = nullptr;
    }

    if (_gpuTexture) {
        if (!_isTextureView) {
            ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuTexture);
            _device->getMemoryStatus().textureSize -= _size;
            CC_DELETE(_gpuTexture);
        }
        _gpuTexture = nullptr;
    }

    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().textureSize -= _size;
        _buffer = nullptr;
    }
}

void CCVKTexture::resize(uint width, uint height) {
    CCASSERT(!_isTextureView, "Cannot resize texture views");
    
    uint size = FormatSize(_format, width, height, _depth);
    if (_size != size) {
        const uint old_size = _size;
        _width = width;
        _height = height;
        _size = size;

        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuTextureView);
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuTexture);

        MemoryStatus &status = _device->getMemoryStatus();
        _gpuTexture->width = _width;
        _gpuTexture->height = _height;
        _gpuTexture->size = _size;

        CCVKCmdFuncCreateTexture((CCVKDevice *)_device, _gpuTexture);
        status.bufferSize -= old_size;
        status.bufferSize += _size;

        CCVKCmdFuncCreateTextureView((CCVKDevice *)_device, _gpuTextureView);

        if (_buffer) {
            const uint8_t *old_buff = _buffer;
            _buffer = (uint8_t *)CC_MALLOC(_size);
            memcpy(_buffer, old_buff, old_size);
            CC_FREE(_buffer);
            status.bufferSize -= old_size;
            status.bufferSize += _size;
        }
    }
}

} // namespace gfx
} // namespace cc
