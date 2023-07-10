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
#include "GLES3Framebuffer.h"
#include "GLES3RenderPass.h"
#include "GLES3Texture.h"

namespace cc {
namespace gfx {

GLES3Framebuffer::GLES3Framebuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3Framebuffer::~GLES3Framebuffer() {
    destroy();
}

void GLES3Framebuffer::updateExtent() {
    if (!_colorTextures.empty()) {
        const auto *tex = _colorTextures[0];
        _gpuFBO->width = tex->getWidth();
        _gpuFBO->height = tex->getHeight();
        return;
    }
    if (_depthStencilTexture != nullptr) {
        _gpuFBO->width = _depthStencilTexture->getWidth();
        _gpuFBO->height = _depthStencilTexture->getHeight();
        return;
    }
}

void GLES3Framebuffer::doInit(const FramebufferInfo & /*info*/) {
    _gpuFBO = ccnew GLES3GPUFramebuffer;
    updateExtent();

    _gpuFBO->gpuRenderPass = static_cast<GLES3RenderPass *>(_renderPass)->gpuRenderPass();
    _gpuFBO->gpuColorViews.resize(_colorTextures.size());
    for (size_t i = 0; i < _colorTextures.size(); ++i) {
        auto *colorTexture = static_cast<GLES3Texture *>(_colorTextures.at(i));
        _gpuFBO->gpuColorViews[i] = colorTexture->gpuTextureView();
        GLES3Device::getInstance()->framebufferHub()->connect(colorTexture->gpuTexture(), _gpuFBO);
    }

    if (_depthStencilTexture) {
        auto *depthTexture = static_cast<GLES3Texture *>(_depthStencilTexture);
        _gpuFBO->gpuDepthStencilView = depthTexture->gpuTextureView();
        GLES3Device::getInstance()->framebufferHub()->connect(depthTexture->gpuTexture(), _gpuFBO);
    }

    if (_depthStencilResolveTexture) {
        auto *depthTexture = static_cast<GLES3Texture *>(_depthStencilResolveTexture);
        _gpuFBO->gpuDepthStencilResolveView = depthTexture->gpuTextureView();
        GLES3Device::getInstance()->framebufferHub()->connect(depthTexture->gpuTexture(), _gpuFBO);
    }

    cmdFuncGLES3CreateFramebuffer(GLES3Device::getInstance(), _gpuFBO);
}

void GLES3Framebuffer::doDestroy() {
    if (_gpuFBO) {
        cmdFuncGLES3DestroyFramebuffer(GLES3Device::getInstance(), _gpuFBO);

        for (auto &texture : _colorTextures) {
            auto *colorTexture = static_cast<GLES3Texture *>(texture);
            GLES3Device::getInstance()->framebufferHub()->disengage(colorTexture->gpuTexture(), _gpuFBO);
        }
        if (_depthStencilTexture) {
            auto *depthTexture = static_cast<GLES3Texture *>(_depthStencilTexture);
            GLES3Device::getInstance()->framebufferHub()->disengage(depthTexture->gpuTexture(), _gpuFBO);
        }
        if (_depthStencilResolveTexture) {
            auto *depthTexture = static_cast<GLES3Texture *>(_depthStencilResolveTexture);
            GLES3Device::getInstance()->framebufferHub()->disengage(depthTexture->gpuTexture(), _gpuFBO);
        }

        delete _gpuFBO;
        _gpuFBO = nullptr;
    }
}

} // namespace gfx
} // namespace cc
