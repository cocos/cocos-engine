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

#include "MTLStd.h"

#include "MTLFramebuffer.h"
#include "MTLRenderPass.h"
#include "MTLTexture.h"

namespace cc {
namespace gfx {

CCMTLFramebuffer::CCMTLFramebuffer() : Framebuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

void CCMTLFramebuffer::doInit(const FramebufferInfo &info) {
    auto *mtlRenderPass = static_cast<CCMTLRenderPass *>(_renderPass);
    size_t slot = 0;
    size_t i = 0;
    size_t attachmentIndices = 0;
    for (const auto *colorTexture : info.colorTextures) {
        int level = 0;
        const auto *texture = static_cast<const CCMTLTexture *>(colorTexture);
        if (texture) {
            attachmentIndices |= (1 << i);
            mtlRenderPass->setColorAttachment(slot++, texture->getMTLTexture(), level);
        }
        ++i;
    }

    if (_depthStencilTexture) {
        id<MTLTexture> texture = static_cast<CCMTLTexture *>(_depthStencilTexture)->getMTLTexture();
        mtlRenderPass->setDepthStencilAttachment(texture, 0);
        attachmentIndices |= (1 << i);
    }

    _isOffscreen = (attachmentIndices != 0);
}

void CCMTLFramebuffer::doDestroy() {
}

} // namespace gfx
} // namespace cc
