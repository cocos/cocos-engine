#include "MTLStd.h"

#include "MTLFrameBuffer.h"
#include "MTLRenderPass.h"
#include "MTLTexture.h"

NS_CC_BEGIN

CCMTLFramebuffer::CCMTLFramebuffer(GFXDevice *device) : GFXFramebuffer(device) {}
CCMTLFramebuffer::~CCMTLFramebuffer() { destroy(); }

bool CCMTLFramebuffer::initialize(const GFXFramebufferInfo &info) {
    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;
    _isOffscreen = info.isOffscreen;

    if (_isOffscreen) {
        auto *mtlRenderPass = static_cast<CCMTLRenderPass *>(_renderPass);
        size_t slot = 0;
        size_t levelCount = info.colorMipmapLevels.size();
        int i = 0;
        for (const auto &colorTexture : info.colorTextures) {
            int level = 0;
            if (levelCount > i) {
                level = info.colorMipmapLevels[i];
            }
            id<MTLTexture> texture = static_cast<CCMTLTexture *>(colorTexture)->getMTLTexture();
            mtlRenderPass->setColorAttachment(slot, texture, level);

            ++i;
        }

        if (_depthStencilTexture) {
            id<MTLTexture> texture = static_cast<CCMTLTexture *>(_depthStencilTexture)->getMTLTexture();
            mtlRenderPass->setDepthStencilAttachment(texture, info.depthStencilMipmapLevel);
        }
    }

    _status = GFXStatus::SUCCESS;

    return true;
}

void CCMTLFramebuffer::destroy() {
    _status = GFXStatus::UNREADY;
}

NS_CC_END
