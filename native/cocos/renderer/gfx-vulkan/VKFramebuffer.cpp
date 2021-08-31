/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKFramebuffer.h"
#include "VKRenderPass.h"
#include "VKTexture.h"

namespace cc {
namespace gfx {

CCVKFramebuffer::CCVKFramebuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKFramebuffer::~CCVKFramebuffer() {
    destroy();
}

void CCVKFramebuffer::doInit(const FramebufferInfo & /*info*/) {
    _gpuFBO                = CC_NEW(CCVKGPUFramebuffer);
    _gpuFBO->gpuRenderPass = static_cast<CCVKRenderPass *>(_renderPass)->gpuRenderPass();

    _gpuFBO->gpuColorViews.resize(_colorTextures.size());
    for (size_t i = 0; i < _colorTextures.size(); ++i) {
        auto *colorTex = static_cast<CCVKTexture *>(_colorTextures[i]);
        if (colorTex) {
            _gpuFBO->gpuColorViews[i] = colorTex->gpuTextureView();
        }
    }

    if (_depthStencilTexture) {
        _gpuFBO->gpuDepthStencilView = static_cast<CCVKTexture *>(_depthStencilTexture)->gpuTextureView();
    }

    cmdFuncCCVKCreateFramebuffer(CCVKDevice::getInstance(), _gpuFBO);
}

void CCVKFramebuffer::doDestroy() {
    if (_gpuFBO) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuFBO);
        _gpuFBO = nullptr;
    }
}

} // namespace gfx
} // namespace cc
