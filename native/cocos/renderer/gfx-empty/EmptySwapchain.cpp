/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "EmptySwapchain.h"
#include "EmptyTexture.h"

namespace cc {
namespace gfx {

void EmptySwapchain::doInit(const SwapchainInfo &info) {
    _colorTexture = ccnew EmptyTexture;
    _depthStencilTexture = ccnew EmptyTexture;

    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format = Format::RGBA8;
    textureInfo.width = info.width;
    textureInfo.height = info.height;
    initTexture(textureInfo, _colorTexture);

    textureInfo.format = Format::DEPTH_STENCIL;
    initTexture(textureInfo, _depthStencilTexture);
}

void EmptySwapchain::doDestroy() {
    CC_SAFE_DESTROY_NULL(_depthStencilTexture);
    CC_SAFE_DESTROY_NULL(_colorTexture);
}

void EmptySwapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform /*transform*/) {
    _colorTexture->resize(width, height);
    _depthStencilTexture->resize(width, height);
}

void EmptySwapchain::doDestroySurface() {
}

void EmptySwapchain::doCreateSurface(void *windowHandle) {
}

} // namespace gfx
} // namespace cc
