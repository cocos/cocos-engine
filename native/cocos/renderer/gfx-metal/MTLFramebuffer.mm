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
    for (const auto &colorTexture : info.colorTextures) {
        int level = 0;
        if (levelCount > i) {
            level = info.colorMipmapLevels[i];
        }
        const auto *texture = static_cast<CCMTLTexture *>(colorTexture);
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
