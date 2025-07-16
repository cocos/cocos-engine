/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "GLES2Std.h"

#include "GLES2Commands.h"
#include "GLES2Device.h"
#include "GLES2Swapchain.h"
#include "GLES2Texture.h"
#include "profiler/Profiler.h"

namespace cc {
namespace gfx {

GLES2Texture::GLES2Texture() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES2Texture::~GLES2Texture() {
    destroy();
}

void GLES2Texture::doInit(const TextureInfo & /*info*/) {
    _gpuTexture = ccnew GLES2GPUTexture;
    _gpuTexture->type = _info.type;
    _gpuTexture->format = _info.format;
    _gpuTexture->usage = _info.usage;
    _gpuTexture->width = _info.width;
    _gpuTexture->height = _info.height;
    _gpuTexture->depth = _info.depth;
    _gpuTexture->arrayLayer = _info.layerCount;
    _gpuTexture->mipLevel = _info.levelCount;
    _gpuTexture->samples = _info.samples;
    _gpuTexture->flags = _info.flags;
    _gpuTexture->size = _size;
    _gpuTexture->isPowerOf2 = math::isPowerOfTwo(_info.width) && math::isPowerOfTwo(_info.height);
    _gpuTexture->glTexture = static_cast<GLuint>(reinterpret_cast<size_t>(_info.externalRes));

    cmdFuncGLES2CreateTexture(GLES2Device::getInstance(), _gpuTexture);

    if (_gpuTexture->memoryAllocated) {
        GLES2Device::getInstance()->getMemoryStatus().textureSize += _size;
        CC_PROFILE_MEMORY_INC(Texture, _size);
    }
}

void GLES2Texture::doInit(const TextureViewInfo &info) {
    _gpuTexture = static_cast<GLES2Texture *>(info.texture)->gpuTexture();
}

void GLES2Texture::doDestroy() {
    if (_gpuTexture) {
        if (!_isTextureView) {
            if (_gpuTexture->memoryAllocated) {
                GLES2Device::getInstance()->getMemoryStatus().textureSize -= _size;
                CC_PROFILE_MEMORY_DEC(Texture, _size);
            }
            cmdFuncGLES2DestroyTexture(GLES2Device::getInstance(), _gpuTexture);
            GLES2Device::getInstance()->framebufferHub()->disengage(_gpuTexture);
            delete _gpuTexture;
        }
        _gpuTexture = nullptr;
    }
}

void GLES2Texture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    if (_gpuTexture->memoryAllocated) {
        GLES2Device::getInstance()->getMemoryStatus().textureSize -= _size;
        CC_PROFILE_MEMORY_DEC(Texture, _size);
    }
    _gpuTexture->width = width;
    _gpuTexture->height = height;
    _gpuTexture->size = size;
    _gpuTexture->mipLevel = _info.levelCount;
    cmdFuncGLES2ResizeTexture(GLES2Device::getInstance(), _gpuTexture);

    GLES2Device::getInstance()->framebufferHub()->update(_gpuTexture);

    if (_gpuTexture->memoryAllocated) {
        GLES2Device::getInstance()->getMemoryStatus().textureSize += size;
        CC_PROFILE_MEMORY_INC(Texture, size);
    }
}

uint32_t GLES2Texture::getGLTextureHandle() const noexcept {
    const auto *gpuTexture = _gpuTexture;
    if (!gpuTexture) {
        return 0;
    }

    if (gpuTexture->glTexture) {
        return gpuTexture->glTexture;
    }

    if (gpuTexture->glRenderbuffer) {
        return gpuTexture->glRenderbuffer;
    }

    return 0;
}

///////////////////////////// Swapchain Specific /////////////////////////////

void GLES2Texture::doInit(const SwapchainTextureInfo & /*info*/) {
    _gpuTexture = ccnew GLES2GPUTexture;
    _gpuTexture->type = _info.type;
    _gpuTexture->format = _info.format;
    _gpuTexture->usage = _info.usage;
    _gpuTexture->width = _info.width;
    _gpuTexture->height = _info.height;
    _gpuTexture->depth = _info.depth;
    _gpuTexture->arrayLayer = _info.layerCount;
    _gpuTexture->mipLevel = _info.levelCount;
    _gpuTexture->samples = _info.samples;
    _gpuTexture->flags = _info.flags;
    _gpuTexture->size = _size;
    _gpuTexture->memoryAllocated = false;
    _gpuTexture->swapchain = static_cast<GLES2Swapchain *>(_swapchain)->gpuSwapchain();
}

} // namespace gfx
} // namespace cc
