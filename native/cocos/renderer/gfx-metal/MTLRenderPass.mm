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
    _colorRenderTargetNums = i;
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

void CCMTLRenderPass::setColorAttachment(id<MTLTexture> texture, size_t slot)
{
    if (! _mtlRenderPassDescriptor)
    {
        CC_LOG_ERROR("CCMTLRenderPass: MTLRenderPassDescriptor should not be nullptr.");
        _status = GFXStatus::FAILED;
        return;
    }
    
    if(_colorRenderTargetNums < slot)
    {
        CC_LOG_ERROR("CCMTLRenderPass: invalid color attachment slot %d.", slot);
        _status = GFXStatus::FAILED;
        return;
    }
    
    _mtlRenderPassDescriptor.colorAttachments[slot].texture = texture;
    _status = GFXStatus::SUCCESS;
}

void CCMTLRenderPass::setDepthStencilAttachment(id<MTLTexture> texture)
{
    if (! _mtlRenderPassDescriptor)
    {
        CC_LOG_ERROR("CCMTLRenderPass: MTLRenderPassDescriptor should not be nullptr.");
        _status = GFXStatus::FAILED;
        return;
    }
    
    _mtlRenderPassDescriptor.depthAttachment.texture = texture;
    _mtlRenderPassDescriptor.stencilAttachment.texture = texture;
    _status = GFXStatus::SUCCESS;
}

NS_CC_END
