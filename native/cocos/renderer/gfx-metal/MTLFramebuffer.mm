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
#include "MTLStd.h"

#include "MTLFramebuffer.h"
#include "MTLRenderPass.h"
#include "MTLTexture.h"

namespace cc {
namespace gfx {

CCMTLFramebuffer::CCMTLFramebuffer(Device *device) : Framebuffer(device) {}

bool CCMTLFramebuffer::initialize(const FramebufferInfo &info) {
    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;

    auto *mtlRenderPass = static_cast<CCMTLRenderPass *>(_renderPass);
    size_t slot = 0;
    size_t levelCount = info.colorMipmapLevels.size();
    size_t i = 0;
    size_t attachmentIndices = 0;
    for (const auto *colorTexture : info.colorTextures) {
        int level = 0;
        if (levelCount > i) {
            level = info.colorMipmapLevels[i];
        }
        const auto *texture = static_cast<const CCMTLTexture *>(colorTexture);
        if (texture) {
            attachmentIndices |= (1 << i);
            mtlRenderPass->setColorAttachment(slot++, texture->getMTLTexture(), level);
        }
        ++i;
    }

    if (_depthStencilTexture) {
        id<MTLTexture> texture = static_cast<CCMTLTexture *>(_depthStencilTexture)->getMTLTexture();
        mtlRenderPass->setDepthStencilAttachment(texture, info.depthStencilMipmapLevel);
        attachmentIndices |= (1 << i);
    }

    _isOffscreen = (attachmentIndices != 0);

    return true;
}

void CCMTLFramebuffer::destroy() {
}

} // namespace gfx
} // namespace cc
