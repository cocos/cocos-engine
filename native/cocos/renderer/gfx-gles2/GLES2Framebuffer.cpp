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
#include "GLES2Framebuffer.h"
#include "GLES2RenderPass.h"
#include "GLES2Texture.h"

namespace cc {
namespace gfx {

GLES2Framebuffer::GLES2Framebuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES2Framebuffer::~GLES2Framebuffer() {
    destroy();
}

void GLES2Framebuffer::doInit(const FramebufferInfo & /*info*/) {
    _gpuFBO = ccnew GLES2GPUFramebuffer;
    _gpuFBO->gpuRenderPass = static_cast<GLES2RenderPass *>(_renderPass)->gpuRenderPass();

    _gpuFBO->gpuColorTextures.resize(_colorTextures.size());
    for (size_t i = 0; i < _colorTextures.size(); ++i) {
        auto *colorTexture = static_cast<GLES2Texture *>(_colorTextures.at(i));
        _gpuFBO->gpuColorTextures[i] = colorTexture->gpuTexture();
        _gpuFBO->lodLevel = colorTexture->getViewInfo().baseLevel;
        GLES2Device::getInstance()->framebufferHub()->connect(colorTexture->gpuTexture(), _gpuFBO);
    }

    if (_depthStencilTexture) {
        auto *depthTexture = static_cast<GLES2Texture *>(_depthStencilTexture);
        _gpuFBO->gpuDepthStencilTexture = depthTexture->gpuTexture();
        _gpuFBO->lodLevel = depthTexture->getViewInfo().baseLevel;
        GLES2Device::getInstance()->framebufferHub()->connect(depthTexture->gpuTexture(), _gpuFBO);
    }

    cmdFuncGLES2CreateFramebuffer(GLES2Device::getInstance(), _gpuFBO);
}

void GLES2Framebuffer::doDestroy() {
    if (_gpuFBO) {
        cmdFuncGLES2DestroyFramebuffer(GLES2Device::getInstance(), _gpuFBO);

        for (auto &texture : _colorTextures) {
            auto *colorTexture = static_cast<GLES2Texture *>(texture);
            GLES2Device::getInstance()->framebufferHub()->disengage(colorTexture->gpuTexture(), _gpuFBO);
        }
        if (_depthStencilTexture) {
            auto *depthTexture = static_cast<GLES2Texture *>(_depthStencilTexture);
            GLES2Device::getInstance()->framebufferHub()->disengage(depthTexture->gpuTexture(), _gpuFBO);
        }

        delete _gpuFBO;
        _gpuFBO = nullptr;
    }
}

} // namespace gfx
} // namespace cc
