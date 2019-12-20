#include "MTLStd.h"
#include "MTLCommandBuffer.h"

NS_CC_BEGIN

CCMTLCommandBuffer::CCMTLCommandBuffer(GFXDevice* device) : GFXCommandBuffer(device) {}
CCMTLCommandBuffer::~CCMTLCommandBuffer() { Destroy(); }

bool CCMTLCommandBuffer::Initialize(const GFXCommandBufferInfo& info)
{
    
}

void CCMTLCommandBuffer::Destroy()
{
    
}

void CCMTLCommandBuffer::Begin()
{
    
}

void CCMTLCommandBuffer::End()
{
    
}

void CCMTLCommandBuffer::BeginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, GFXColor* colors, uint count, float depth, int stencil)
{
    
}

void CCMTLCommandBuffer::EndRenderPass()
{
    
}

void CCMTLCommandBuffer::BindPipelineState(GFXPipelineState* pso)
{
    
}

void CCMTLCommandBuffer::BindBindingLayout(GFXBindingLayout* layout)
{
    
}

void CCMTLCommandBuffer::BindInputAssembler(GFXInputAssembler* ia)
{
    
}

void CCMTLCommandBuffer::SetViewport(const GFXViewport& vp)
{
    
}

void CCMTLCommandBuffer::SetScissor(const GFXRect& rect)
{
    
}

void CCMTLCommandBuffer::SetLineWidth(const float width)
{
    
}

void CCMTLCommandBuffer::SetDepthBias(float constant, float clamp, float slope)
{
    
}

void CCMTLCommandBuffer::SetBlendConstants(const GFXColor& constants)
{
    
}

void CCMTLCommandBuffer::SetDepthBounds(float min_bounds, float max_bounds)
{
    
}

void CCMTLCommandBuffer::SetStencilWriteMask(GFXStencilFace face, uint mask)
{
    
}

void CCMTLCommandBuffer::SetStencilCompareMask(GFXStencilFace face, int ref, uint mask)
{
    
}

void CCMTLCommandBuffer::Draw(GFXInputAssembler* ia)
{
    
}

void CCMTLCommandBuffer::UpdateBuffer(GFXBuffer* buff, void* data, uint size, uint offset)
{
    
}

void CCMTLCommandBuffer::CopyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, GFXBufferTextureCopy* regions, uint count)
{
    
}

void CCMTLCommandBuffer::Execute(GFXCommandBuffer** cmd_buffs, uint count)
{
    
}

NS_CC_END
