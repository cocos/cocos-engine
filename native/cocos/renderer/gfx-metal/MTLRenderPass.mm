#include "MTLStd.h"
#include "MTLRenderPass.h"
#include "MTLDevice.h"
#include "MTLUtils.h"

NS_CC_BEGIN

CCMTLRenderPass::CCMTLRenderPass(GFXDevice* device) : GFXRenderPass(device) {}
CCMTLRenderPass::~CCMTLRenderPass() { destroy(); }

bool CCMTLRenderPass::initialize(const GFXRenderPassInfo& info)
{
    _colorAttachments = info.color_attachments;
    _depthStencilAttachment = info.depth_stencil_attachment;
    
    _mtlRenderPassDescriptor = [[MTLRenderPassDescriptor alloc] init];
    
    int i = 0;
    for (const auto& colorAttachment: _colorAttachments)
    {
        _mtlRenderPassDescriptor.colorAttachments[i].loadAction = mu::toMTLLoadAction(colorAttachment.load_op);
        _mtlRenderPassDescriptor.colorAttachments[i].storeAction = mu::toMTLStoreAction(colorAttachment.store_op);
        
        ++i;
    }
    _mtlRenderPassDescriptor.depthAttachment.loadAction =  mu::toMTLLoadAction(_depthStencilAttachment.depth_load_op);
    _mtlRenderPassDescriptor.depthAttachment.storeAction = mu::toMTLStoreAction(_depthStencilAttachment.depth_store_op);
    _mtlRenderPassDescriptor.stencilAttachment.loadAction = mu::toMTLLoadAction(_depthStencilAttachment.depth_load_op);
    _mtlRenderPassDescriptor.stencilAttachment.storeAction = mu::toMTLStoreAction(_depthStencilAttachment.depth_store_op);
    
    return true;
}

void CCMTLRenderPass::destroy()
{
    if (_mtlRenderPassDescriptor)
    {
        [_mtlRenderPassDescriptor release];
        _mtlRenderPassDescriptor = nil;
    }
}

NS_CC_END
