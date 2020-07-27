#include "GLES2Std.h"

#include "GLES2Texture.h"
#include "GLES2Commands.h"

namespace cc {
namespace gfx {

GLES2Texture::GLES2Texture(Device *device)
: Texture(device) {
}

GLES2Texture::~GLES2Texture() {
}

bool GLES2Texture::initialize(const TextureInfo &info) {

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
    }
#endif

    if (_flags & TextureFlags::BAKUP_BUFFER) {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        if (!_buffer) {
            _status = Status::FAILED;
            CC_LOG_ERROR("GLES2Texture: CC_MALLOC backup buffer failed.");
            return false;
        }
        _device->getMemoryStatus().textureSize += _size;
    }

    _gpuTexture = CC_NEW(GLES2GPUTexture);
    if (!_gpuTexture) {
        _status = Status::FAILED;
        CC_LOG_ERROR("GLES2Texture: CC_NEW GLES2GPUTexture failed.");
        return false;
    }
    _gpuTexture->type = _type;
    _gpuTexture->format = _format;
    _gpuTexture->usage = _usage;
    _gpuTexture->width = _width;
    _gpuTexture->height = _height;
    _gpuTexture->depth = _depth;
    _gpuTexture->size = _size;
    _gpuTexture->arrayLayer = _layerCount;
    _gpuTexture->mipLevel = _levelCount;
    _gpuTexture->samples = _samples;
    _gpuTexture->flags = _flags;
    _gpuTexture->isPowerOf2 = math::IsPowerOfTwo(_width) && math::IsPowerOfTwo(_height);

    GLES2CmdFuncCreateTexture((GLES2Device *)_device, _gpuTexture);
    _device->getMemoryStatus().textureSize += _size;
    _status = Status::SUCCESS;
    return true;
}

bool GLES2Texture::initialize(const TextureViewInfo &info) {
    _Type = ObjectType::TEXTURE_VIEW;

    CC_LOG_ERROR("GLES2 doesn't support texture view");
    _status = Status::FAILED;
    return false;
}

void GLES2Texture::destroy() {
    if (_gpuTexture) {
        GLES2CmdFuncDestroyTexture((GLES2Device *)_device, _gpuTexture);
        _device->getMemoryStatus().textureSize -= _size;
        CC_DELETE(_gpuTexture);
        _gpuTexture = nullptr;
    }

    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().textureSize -= _size;
        _buffer = nullptr;
    }

    _status = Status::UNREADY;
}

void GLES2Texture::resize(uint width, uint height) {
    uint size = FormatSize(_format, width, height, _depth);
    if (_size != size) {
        const uint oldSize = _size;
        _width = width;
        _height = height;
        _size = size;

        MemoryStatus &status = _device->getMemoryStatus();
        _gpuTexture->width = _width;
        _gpuTexture->height = _height;
        _gpuTexture->size = _size;
        GLES2CmdFuncResizeTexture((GLES2Device *)_device, _gpuTexture);
        status.bufferSize -= oldSize;
        status.bufferSize += _size;

        if (_buffer) {
            const uint8_t *oldBuffer = _buffer;
            uint8_t *buffer = (uint8_t *)CC_MALLOC(_size);
            if (!buffer) {
                _status = Status::FAILED;
                CC_LOG_ERROR("GLES2Texture: CC_MALLOC backup buffer failed when resize the texture.");
                return;
            }
            memcpy(buffer, oldBuffer, std::min(oldSize, size));
            _buffer = buffer;
            CC_FREE(oldBuffer);
            status.bufferSize -= oldSize;
            status.bufferSize += _size;
        }
        _status = Status::SUCCESS;
    }
}

} // namespace gfx
} // namespace cc
