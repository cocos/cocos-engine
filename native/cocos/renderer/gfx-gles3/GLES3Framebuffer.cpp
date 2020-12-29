/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "GLES3Framebuffer.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"
#include "GLES3Texture.h"

namespace cc {
namespace gfx {

GLES3Framebuffer::GLES3Framebuffer(Device *device)
: Framebuffer(device) {
}

GLES3Framebuffer::~GLES3Framebuffer() {
}

bool GLES3Framebuffer::initialize(const FramebufferInfo &info) {

    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;

    _gpuFBO = CC_NEW(GLES3GPUFramebuffer);
    _gpuFBO->gpuRenderPass = ((GLES3RenderPass *)_renderPass)->gpuRenderPass();
    _gpuFBO->depthStencilMipmapLevel = info.depthStencilMipmapLevel;
    for (uint mipLevel : info.colorMipmapLevels) {
        _gpuFBO->colorMipmapLevels.push_back(mipLevel);
    }

    _gpuFBO->gpuColorTextures.resize(_colorTextures.size());
    for (size_t i = 0; i < _colorTextures.size(); ++i) {
        GLES3Texture *colorTexture = (GLES3Texture *)_colorTextures[i];
        if (colorTexture) {
            _gpuFBO->gpuColorTextures[i] = colorTexture->gpuTexture();
        }
    }

    if (_depthStencilTexture) {
        _gpuFBO->gpuDepthStencilTexture = ((GLES3Texture *)_depthStencilTexture)->gpuTexture();
    }

    GLES3CmdFuncCreateFramebuffer((GLES3Device *)_device, _gpuFBO);

    return true;
}

void GLES3Framebuffer::destroy() {
    if (_gpuFBO) {
        GLES3CmdFuncDestroyFramebuffer((GLES3Device *)_device, _gpuFBO);
        CC_DELETE(_gpuFBO);
        _gpuFBO = nullptr;
    }
}

} // namespace gfx
} // namespace cc
