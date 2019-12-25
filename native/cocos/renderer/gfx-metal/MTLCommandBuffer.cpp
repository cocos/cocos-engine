#include "MTLStd.h"
#include "MTLCommandBuffer.h"
#include "MTLCommandAllocator.h"
#include "MTLCommands.h"

NS_CC_BEGIN

CCMTLCommandBuffer::CCMTLCommandBuffer(GFXDevice* device) : GFXCommandBuffer(device) {}
CCMTLCommandBuffer::~CCMTLCommandBuffer() { Destroy(); }

bool CCMTLCommandBuffer::Initialize(const GFXCommandBufferInfo& info)
{
    if (!info.allocator)
        return false;
    
    allocator_ = info.allocator;
    _MTLCommandAllocator = static_cast<CCMTLCommandAllocator*>(allocator_);
    type_ = info.type;
    
    _commandPackage = CC_NEW(CCMTLCommandPackage);
    return _commandPackage != nullptr;
}

void CCMTLCommandBuffer::Destroy()
{
    if (_MTLCommandAllocator)
    {
        _MTLCommandAllocator->clearCommands(_commandPackage);
        _MTLCommandAllocator = nullptr;
    }
    allocator_ = nullptr;
    
    CC_SAFE_DELETE(_commandPackage);
}

void CCMTLCommandBuffer::Begin()
{
    _MTLCommandAllocator->clearCommands(_commandPackage);
    num_tris_ = 0;
    num_draw_calls_ = 0;
}

void CCMTLCommandBuffer::End()
{
    if (_isStateInvalid)
    {
        bindStates();
        _isStateInvalid = false;
    }
    
    _isInRenderPass = false;
}

void CCMTLCommandBuffer::BeginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, GFXColor* colors, uint count, float depth, int stencil)
{
    _isInRenderPass = true;
    
    CCMTLCmdBeginRenderPass* cmd = _MTLCommandAllocator->_beginRenderPassCmdPool.Alloc();
    cmd->frameBuffer = (CCMTLFrameBuffer*)fbo;
    cmd->clearFlags = clear_flags;
    cmd->renderArea = render_area;
    cmd->clearStencil = stencil;
    cmd->clearDepth = depth;
    for (uint i = 0; i < count; ++i)
        cmd->clearColors[i] = colors[i];
    
    _commandPackage->beginRenderPassCmds.Push(cmd);
    _commandPackage->commandTypes.Push(GFXCmdType::BEGIN_RENDER_PASS);
}

void CCMTLCommandBuffer::EndRenderPass()
{
    _isInRenderPass = false;
    _commandPackage->commandTypes.Push(GFXCmdType::END_RENDER_PASS);
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

void CCMTLCommandBuffer::bindStates()
{
    
}

NS_CC_END
