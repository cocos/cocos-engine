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

#include "GLES3Std.h"

#include "GLES3Commands.h"
#include "GLES3Device.h"
#include "GLES3Swapchain.h"
#include "GLES3Texture.h"
#include "base/Macros.h"
#include "profiler/Profiler.h"

namespace cc {
namespace gfx {

GLES3Texture::GLES3Texture() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3Texture::~GLES3Texture() {
    destroy();
}

void GLES3Texture::doInit(const TextureInfo & /*info*/) {
    _gpuTexture = ccnew GLES3GPUTexture;
    _gpuTexture->type = _info.type;
    _gpuTexture->format = _info.format;
    _gpuTexture->usage = _info.usage;
    _gpuTexture->width = _info.width;
    _gpuTexture->height = _info.height;
    _gpuTexture->depth = _info.depth;
    _gpuTexture->arrayLayer = _info.layerCount;
    _gpuTexture->mipLevel = _info.levelCount;
    _gpuTexture->glSamples = static_cast<GLint>(_info.samples);
    _gpuTexture->flags = _info.flags;
    _gpuTexture->size = _size;
    _gpuTexture->isPowerOf2 = math::isPowerOfTwo(_info.width) && math::isPowerOfTwo(_info.height);

    bool hasExternalFlag = hasFlag(_gpuTexture->flags, TextureFlagBit::EXTERNAL_NORMAL) ||
                           hasFlag(_gpuTexture->flags, TextureFlagBit::EXTERNAL_OES);
    if (_info.externalRes && !hasExternalFlag) {
        // compatibility
        _gpuTexture->flags = _gpuTexture->flags | TextureFlagBit::EXTERNAL_OES;
        hasExternalFlag = true;
    }

    if (hasExternalFlag) {
        _gpuTexture->glTexture = static_cast<GLuint>(reinterpret_cast<size_t>(_info.externalRes));
    }

    cmdFuncGLES3CreateTexture(GLES3Device::getInstance(), _gpuTexture);

    if (_gpuTexture->memoryAllocated) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize += _size;
        CC_PROFILE_MEMORY_INC(Texture, _size);
    }

    _gpuTextureView = ccnew GLES3GPUTextureView;
    createTextureView();
}

void GLES3Texture::doInit(const TextureViewInfo & /*info*/) {
    _gpuTexture = static_cast<GLES3Texture *>(_viewInfo.texture)->gpuTexture();

    CC_ASSERT(_viewInfo.texture->getFormat() == _viewInfo.format);

    _gpuTextureView = ccnew GLES3GPUTextureView;
    createTextureView();
}

void GLES3Texture::createTextureView() {
    _gpuTextureView->gpuTexture = _gpuTexture;
    _gpuTextureView->type = _viewInfo.type;
    _gpuTextureView->format = _viewInfo.format;
    _gpuTextureView->baseLevel = _viewInfo.baseLevel;
    _gpuTextureView->levelCount = _viewInfo.levelCount;
    _gpuTextureView->baseLayer = _viewInfo.baseLayer;
    _gpuTextureView->layerCount = _viewInfo.layerCount;
    _gpuTextureView->basePlane = _viewInfo.basePlane;
    _gpuTextureView->planeCount = _viewInfo.planeCount;
    cmdFuncGLES3CreateTextureView(GLES3Device::getInstance(), _gpuTextureView);

}

void GLES3Texture::doDestroy() {
    CC_SAFE_DELETE(_gpuTextureView);
    if (_gpuTexture) {
        if (!_isTextureView) {
            if (_gpuTexture->memoryAllocated) {
                GLES3Device::getInstance()->getMemoryStatus().textureSize -= _size;
                CC_PROFILE_MEMORY_DEC(Texture, _size);
            }

            cmdFuncGLES3DestroyTexture(GLES3Device::getInstance(), _gpuTexture);
            GLES3Device::getInstance()->framebufferHub()->disengage(_gpuTexture);
            delete _gpuTexture;
        }
        _gpuTexture = nullptr;
    }
}

void GLES3Texture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    if (!_isTextureView && _gpuTexture->memoryAllocated) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize -= _size;
        CC_PROFILE_MEMORY_DEC(Texture, _size);
    }

    _gpuTexture->width = width;
    _gpuTexture->height = height;
    _gpuTexture->size = size;
    _gpuTexture->mipLevel = _info.levelCount;

    cmdFuncGLES3ResizeTexture(GLES3Device::getInstance(), _gpuTexture);

    GLES3Device::getInstance()->framebufferHub()->update(_gpuTexture);

    if (!_isTextureView && _gpuTexture->memoryAllocated) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize += size;
        CC_PROFILE_MEMORY_INC(Texture, size);
    }
}

uint32_t GLES3Texture::getGLTextureHandle() const noexcept {
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

void GLES3Texture::doInit(const SwapchainTextureInfo & /*info*/) {
    _gpuTexture = ccnew GLES3GPUTexture;
    _gpuTexture->type = _info.type;
    _gpuTexture->format = _info.format;
    _gpuTexture->usage = _info.usage;
    _gpuTexture->width = _info.width;
    _gpuTexture->height = _info.height;
    _gpuTexture->depth = _info.depth;
    _gpuTexture->arrayLayer = _info.layerCount;
    _gpuTexture->mipLevel = _info.levelCount;
    _gpuTexture->glSamples = static_cast<GLint>(_info.samples);
    _gpuTexture->flags = _info.flags;
    _gpuTexture->size = _size;
    _gpuTexture->memoryAllocated = false;
    _gpuTexture->swapchain = static_cast<GLES3Swapchain *>(_swapchain)->gpuSwapchain();
    _gpuTextureView = ccnew GLES3GPUTextureView;
    createTextureView();
}

} // namespace gfx
} // namespace cc
