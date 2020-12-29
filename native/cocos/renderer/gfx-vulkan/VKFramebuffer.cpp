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
#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKFramebuffer.h"
#include "VKRenderPass.h"
#include "VKTexture.h"

namespace cc {
namespace gfx {

CCVKFramebuffer::CCVKFramebuffer(Device *device)
: Framebuffer(device) {
}

CCVKFramebuffer::~CCVKFramebuffer() {
}

bool CCVKFramebuffer::initialize(const FramebufferInfo &info) {
    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;

    _gpuFBO = CC_NEW(CCVKGPUFramebuffer);
    _gpuFBO->gpuRenderPass = ((CCVKRenderPass *)_renderPass)->gpuRenderPass();

    _gpuFBO->gpuColorViews.resize(_colorTextures.size());
    for (size_t i = 0; i < _colorTextures.size(); ++i) {
        CCVKTexture *colorTex = (CCVKTexture *)_colorTextures[i];
        if (colorTex) {
            _gpuFBO->gpuColorViews[i] = colorTex->gpuTextureView();
        }
    }

    if (_depthStencilTexture) {
        _gpuFBO->gpuDepthStencilView = ((CCVKTexture *)_depthStencilTexture)->gpuTextureView();
    }

    CCVKCmdFuncCreateFramebuffer((CCVKDevice *)_device, _gpuFBO);

    return true;
}

void CCVKFramebuffer::destroy() {
    if (_gpuFBO) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuFBO);
        _gpuFBO = nullptr;
    }
}

} // namespace gfx
} // namespace cc
