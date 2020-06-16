#include "GLES3Std.h"
#include "GLES3Texture.h"
#include "GLES3Commands.h"

namespace cc {

GLES3Texture::GLES3Texture(GFXDevice *device)
: GFXTexture(device) {
}

GLES3Texture::~GLES3Texture() {
}

bool GLES3Texture::initialize(const GFXTextureInfo &info) {

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
        _buffer = (uint8_t *)CC_MALLOC(_size);
        if (!_buffer) {
            _status = GFXStatus::FAILED;
            CC_LOG_ERROR("GLES3Texture: CC_MALLOC backup buffer failed.");
            return false;
        }
        _device->getMemoryStatus().textureSize += _size;
    }

    _gpuTexture = CC_NEW(GLES3GPUTexture);
    if (!_gpuTexture) {
        _status = GFXStatus::FAILED;
        CC_LOG_ERROR("GLES3Texture: CC_NEW GLES3GPUTexture failed.");
        return false;
    }
    _gpuTexture->type = _type;
    _gpuTexture->format = _format;
    _gpuTexture->usage = _usage;
    _gpuTexture->width = _width;
    _gpuTexture->height = _height;
    _gpuTexture->depth = _depth;
    _gpuTexture->size = _size;
    _gpuTexture->arrayLayer = _arrayLayer;
    _gpuTexture->mipLevel = _mipLevel;
    _gpuTexture->samples = _samples;
    _gpuTexture->flags = _flags;
    _gpuTexture->isPowerOf2 = math::IsPowerOfTwo(_width) && math::IsPowerOfTwo(_height);

    GLES3CmdFuncCreateTexture((GLES3Device *)_device, _gpuTexture);
    _device->getMemoryStatus().textureSize += _size;
    _status = GFXStatus::SUCCESS;

    return true;
}

bool GLES3Texture::initialize(const GFXTextureViewInfo &info) {
    CC_LOG_ERROR("GLES3 doesn't support texture view.");
    _status = GFXStatus::FAILED;
    return false;
}

void GLES3Texture::destroy() {
    if (_gpuTexture) {
        GLES3CmdFuncDestroyTexture((GLES3Device *)_device, _gpuTexture);
        _device->getMemoryStatus().textureSize -= _size;
        CC_DELETE(_gpuTexture);
        _gpuTexture = nullptr;
    }

    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().textureSize -= _size;
        _buffer = nullptr;
    }

    _status = GFXStatus::UNREADY;
}

void GLES3Texture::resize(uint width, uint height) {
    uint size = GFXFormatSize(_format, width, height, _depth);
    if (_size != size) {
        const uint oldSize = _size;
        _width = width;
        _height = height;
        _size = size;

        GFXMemoryStatus &status = _device->getMemoryStatus();
        _gpuTexture->width = _width;
        _gpuTexture->height = _height;
        _gpuTexture->size = _size;
        GLES3CmdFuncResizeTexture((GLES3Device *)_device, _gpuTexture);
        status.bufferSize -= oldSize;
        status.bufferSize += _size;

        if (_buffer) {
            const uint8_t *oldBuffer = _buffer;
            uint8_t *buffer = (uint8_t *)CC_MALLOC(_size);
            if (!buffer) {
                _status = GFXStatus::FAILED;
                CC_LOG_ERROR("GLES3Texture: CC_MALLOC backup buffer failed when resize the texture.");
                return;
            }
            memcpy(buffer, oldBuffer, std::min(oldSize, size));
            _buffer = buffer;
            CC_FREE(oldBuffer);
            status.bufferSize -= oldSize;
            status.bufferSize += _size;
        }
        _status = GFXStatus::SUCCESS;
    }
}

}
