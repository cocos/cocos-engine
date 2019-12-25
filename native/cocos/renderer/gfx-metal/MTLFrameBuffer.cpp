#include "MTLStd.h"
#include "MTLFrameBuffer.h"

NS_CC_BEGIN

CCMTLFrameBuffer::CCMTLFrameBuffer(GFXDevice* device) : GFXFramebuffer(device) {}
CCMTLFrameBuffer::~CCMTLFrameBuffer() { Destroy(); }

bool CCMTLFrameBuffer::Initialize(const GFXFramebufferInfo& info)
{
    render_pass_ = info.render_pass;
    color_views_ = info.color_views;
    depth_stencil_view_ = info.depth_stencil_view;
    is_offscreen_ = info.is_offscreen;
    
    return true;
}

void CCMTLFrameBuffer::Destroy()
{
    
}

NS_CC_END
