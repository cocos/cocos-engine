/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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
#include "GLES3Swapchain.h"
#include "GLES3Texture.h"
#include "base/Macros.h"

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
    _gpuTexture->type       = _info.type;
    _gpuTexture->format     = _info.format;
    _gpuTexture->usage      = _info.usage;
    _gpuTexture->width      = _info.width;
    _gpuTexture->height     = _info.height;
    _gpuTexture->depth      = _info.depth;
    _gpuTexture->arrayLayer = _info.layerCount;
    _gpuTexture->mipLevel   = _info.levelCount;
    _gpuTexture->samples    = _info.samples;
    _gpuTexture->flags      = _info.flags;
    _gpuTexture->size       = _size;
    _gpuTexture->isPowerOf2 = math::IsPowerOfTwo(_info.width) && math::IsPowerOfTwo(_info.height);
    _gpuTexture->glTexture  = static_cast<GLuint>(reinterpret_cast<size_t>(_info.externalRes));

    cmdFuncGLES3CreateTexture(GLES3Device::getInstance(), _gpuTexture);

    if (!_gpuTexture->memoryless) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize += _size;
    }

    _gpuTextureView = CC_NEW(GLES3GPUTextureView);
    createTextureView();
}

void GLES3Texture::doInit(const TextureViewInfo& /*info*/) {
    _gpuTexture = static_cast<GLES3Texture*>(_viewInfo.texture)->gpuTexture();

    CCASSERT(_viewInfo.texture->getFormat() == _viewInfo.format, "Invalid TextureView fromat");

    _gpuTextureView = CC_NEW(GLES3GPUTextureView);
    createTextureView();
}

void GLES3Texture::createTextureView() {
    _gpuTextureView->gpuTexture = _gpuTexture;
    _gpuTextureView->type       = _viewInfo.type;
    _gpuTextureView->format     = _viewInfo.format;
    _gpuTextureView->baseLevel  = _viewInfo.baseLevel;
    _gpuTextureView->levelCount = _viewInfo.levelCount;

    cmdFuncGLES3CreateTextureView(GLES3Device::getInstance(), _gpuTextureView);
}

void GLES3Texture::doDestroy() {
    if (_gpuTextureView) {
        // dont forget to clean the descriptor set
        CC_DELETE(_gpuTextureView);
        _gpuTextureView = nullptr;
    }
    if (_gpuTexture) {
        if (!_isTextureView) {
            if (!_gpuTexture->memoryless) {
                GLES3Device::getInstance()->getMemoryStatus().textureSize -= _size;
            }

            cmdFuncGLES3DestroyTexture(GLES3Device::getInstance(), _gpuTexture);
            GLES3Device::getInstance()->framebufferHub()->disengage(_gpuTexture);
            CC_DELETE(_gpuTexture);
        }
        _gpuTexture = nullptr;
    }
}

void GLES3Texture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    if (!_gpuTexture->memoryless) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize -= _size;
    }

    _gpuTexture->width    = width;
    _gpuTexture->height   = height;
    _gpuTexture->size     = size;
    _gpuTexture->mipLevel = _info.levelCount;

    cmdFuncGLES3ResizeTexture(GLES3Device::getInstance(), _gpuTexture);

    GLES3Device::getInstance()->framebufferHub()->update(_gpuTexture);

    if (!_gpuTexture->memoryless) {
        GLES3Device::getInstance()->getMemoryStatus().textureSize += size;
    }
}

///////////////////////////// Swapchain Specific /////////////////////////////

void GLES3Texture::doInit(const SwapchainTextureInfo& /*info*/) {
    _gpuTexture             = CC_NEW(GLES3GPUTexture);
    _gpuTexture->type       = _info.type;
    _gpuTexture->format     = _info.format;
    _gpuTexture->usage      = _info.usage;
    _gpuTexture->width      = _info.width;
    _gpuTexture->height     = _info.height;
    _gpuTexture->depth      = _info.depth;
    _gpuTexture->arrayLayer = _info.layerCount;
    _gpuTexture->mipLevel   = _info.levelCount;
    _gpuTexture->samples    = _info.samples;
    _gpuTexture->flags      = _info.flags;
    _gpuTexture->size       = _size;
    _gpuTexture->memoryless = true;
    _gpuTexture->swapchain  = static_cast<GLES3Swapchain*>(_swapchain)->gpuSwapchain();

    _gpuTextureView = CC_NEW(GLES3GPUTextureView);
    createTextureView();
}

} // namespace gfx
} // namespace cc
