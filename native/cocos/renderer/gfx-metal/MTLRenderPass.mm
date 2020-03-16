#include "MTLStd.h"
#include "MTLRenderPass.h"
#include "MTLDevice.h"
#include "MTLUtils.h"
#include "MTLTextureView.h"

NS_CC_BEGIN

CCMTLRenderPass::CCMTLRenderPass(GFXDevice* device) : GFXRenderPass(device) {}
CCMTLRenderPass::~CCMTLRenderPass() { destroy(); }

bool CCMTLRenderPass::initialize(const GFXRenderPassInfo& info)
{
    _colorAttachments = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    
    _mtlRenderPassDescriptor = [[MTLRenderPassDescriptor alloc] init];
    
    int i = 0;
    for (const auto& colorAttachment: _colorAttachments)
    {
        _mtlRenderPassDescriptor.colorAttachments[i].loadAction = mu::toMTLLoadAction(colorAttachment.loadOp);
        _mtlRenderPassDescriptor.colorAttachments[i].storeAction = mu::toMTLStoreAction(colorAttachment.storeOp);
        
        ++i;
    }
    _mtlRenderPassDescriptor.depthAttachment.loadAction =  mu::toMTLLoadAction(_depthStencilAttachment.depthLoadOp);
    _mtlRenderPassDescriptor.depthAttachment.storeAction = mu::toMTLStoreAction(_depthStencilAttachment.depthStoreOp);
    _mtlRenderPassDescriptor.stencilAttachment.loadAction = mu::toMTLLoadAction(_depthStencilAttachment.depthLoadOp);
    _mtlRenderPassDescriptor.stencilAttachment.storeAction = mu::toMTLStoreAction(_depthStencilAttachment.depthStoreOp);
    
    _status = GFXStatus::SUCCESS;
    
    return true;
}

void CCMTLRenderPass::destroy()
{
    if (_mtlRenderPassDescriptor)
    {
        [_mtlRenderPassDescriptor release];
        _mtlRenderPassDescriptor = nil;
    }
    
    _status = GFXStatus::UNREADY;
}

void CCMTLRenderPass::setColorAttachment(GFXTextureView* textureView)
{
    if (! _mtlRenderPassDescriptor)
        return;
    
    _mtlRenderPassDescriptor.colorAttachments[0].texture = static_cast<CCMTLTextureView*>(textureView)->getMTLTexture();
}

void CCMTLRenderPass::setDepthStencilAttachment(GFXTextureView* textureView)
{
    if (! _mtlRenderPassDescriptor)
        return;
    
    _mtlRenderPassDescriptor.depthAttachment.texture = static_cast<CCMTLTextureView*>(textureView)->getMTLTexture();
    _mtlRenderPassDescriptor.stencilAttachment.texture = static_cast<CCMTLTextureView*>(textureView)->getMTLTexture();
}

NS_CC_END
