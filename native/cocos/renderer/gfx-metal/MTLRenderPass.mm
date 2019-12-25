#include "MTLStd.h"
#include "MTLRenderPass.h"
#include "MTLDevice.h"
#include "MTLUtils.h"

NS_CC_BEGIN

CCMTLRenderPass::CCMTLRenderPass(GFXDevice* device) : GFXRenderPass(device) {}
CCMTLRenderPass::~CCMTLRenderPass() { Destroy(); }

bool CCMTLRenderPass::Initialize(const GFXRenderPassInfo& info)
{
    color_attachments_ = info.color_attachments;
    depth_stencil_attachment_ = info.depth_stencil_attachment;
    
    _mtlRenderPassDescriptor = [[MTLRenderPassDescriptor alloc] init];
    
    int i = 0;
    for (const auto& colorAttachment: color_attachments_)
    {
        _mtlRenderPassDescriptor.colorAttachments[i].loadAction = mu::toMTLLoadAction(colorAttachment.load_op);
        _mtlRenderPassDescriptor.colorAttachments[i].storeAction = mu::toMTLStoreAction(colorAttachment.store_op);
        
        ++i;
    }
    _mtlRenderPassDescriptor.depthAttachment.loadAction =  mu::toMTLLoadAction(depth_stencil_attachment_.depth_load_op);
    _mtlRenderPassDescriptor.depthAttachment.storeAction = mu::toMTLStoreAction(depth_stencil_attachment_.depth_store_op);
    _mtlRenderPassDescriptor.stencilAttachment.loadAction = mu::toMTLLoadAction(depth_stencil_attachment_.depth_load_op);
    _mtlRenderPassDescriptor.stencilAttachment.storeAction = mu::toMTLStoreAction(depth_stencil_attachment_.depth_store_op);
    
    return true;
}

void CCMTLRenderPass::Destroy()
{
    if (_mtlRenderPassDescriptor)
    {
        [_mtlRenderPassDescriptor release];
        _mtlRenderPassDescriptor = nil;
    }
}

NS_CC_END
