#include "MTLStd.h"
#include "MTLFrameBuffer.h"
#include "MTLRenderPass.h"
#include "MTLTextureView.h"

NS_CC_BEGIN

CCMTLFramebuffer::CCMTLFramebuffer(GFXDevice* device) : GFXFramebuffer(device) {}
CCMTLFramebuffer::~CCMTLFramebuffer() { destroy(); }

bool CCMTLFramebuffer::initialize(const GFXFramebufferInfo& info)
{
    _renderPass = info.renderPass;
    _colorViews = info.colorViews;
    _depthStencilView = info.depthStencilView;
    _isOffscreen = info.isOffscreen;
    
    if(_isOffscreen)
    {
        auto* mtlRenderPass = static_cast<CCMTLRenderPass*>(_renderPass);
        size_t slot = 0;
        for (const auto& colorView : info.colorViews) {
            id<MTLTexture> texture = static_cast<CCMTLTextureView*>(colorView)->getMTLTexture();
            mtlRenderPass->setColorAttachment(texture, slot);
        }

        if(_depthStencilView)
        {
            id<MTLTexture> texture = static_cast<CCMTLTextureView*>(_depthStencilView)->getMTLTexture();
            mtlRenderPass->setDepthStencilAttachment(texture);
        }
    }
    
    _status = GFXStatus::SUCCESS;
    
    return true;
}

void CCMTLFramebuffer::destroy()
{
    _status = GFXStatus::UNREADY;
}

NS_CC_END
