/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "GLES3Std.h"

#include "GLES3Commands.h"
#include "GLES3Device.h"
#include "GLES3Texture.h"

namespace cc {
namespace gfx {

GLES3Texture::GLES3Texture() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3Texture::~GLES3Texture() {
    destroy();
}

void GLES3Texture::doInit(const TextureInfo& /*info*/) {
    _gpuTexture             = CC_NEW(GLES3GPUTexture);
    _gpuTexture->type       = _type;
    _gpuTexture->format     = _format;
    _gpuTexture->usage      = _usage;
    _gpuTexture->width      = _width;
    _gpuTexture->height     = _height;
    _gpuTexture->depth      = _depth;
    _gpuTexture->size       = _size;
    _gpuTexture->arrayLayer = _layerCount;
    _gpuTexture->mipLevel   = _levelCount;
    _gpuTexture->samples    = _samples;
    _gpuTexture->flags      = _flags;
    _gpuTexture->isPowerOf2 = math::IsPowerOfTwo(_width) && math::IsPowerOfTwo(_height);

    cmdFuncGLES3CreateTexture(GLES3Device::getInstance(), _gpuTexture);

    if (!_gpuTexture->memoryless) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize += _size;
    }
}

void GLES3Texture::doInit(const TextureViewInfo& /*info*/) {
    CC_LOG_ERROR("GLES3 doesn't support texture view.");
}

void GLES3Texture::doDestroy() {
    if (_gpuTexture) {
        if (!_gpuTexture->memoryless) {
            GLES3Device::getInstance()->getMemoryStatus().textureSize -= _size;
        }
        cmdFuncGLES3DestroyTexture(GLES3Device::getInstance(), _gpuTexture);
        CC_DELETE(_gpuTexture);
        _gpuTexture = nullptr;
    }
}

void GLES3Texture::doResize(uint width, uint height, uint size) {
    if (!_gpuTexture->memoryless) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize -= _size;
    }

    _gpuTexture->width  = width;
    _gpuTexture->height = height;
    _gpuTexture->size   = size;
    cmdFuncGLES3ResizeTexture(GLES3Device::getInstance(), _gpuTexture);

    if (!_gpuTexture->memoryless) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize += size;
    }
}

} // namespace gfx
} // namespace cc
