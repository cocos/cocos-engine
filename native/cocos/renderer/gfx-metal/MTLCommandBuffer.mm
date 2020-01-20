#include "MTLStd.h"
#include "MTLCommandBuffer.h"
#include "MTLCommandAllocator.h"
#include "MTLCommands.h"
#include "MTLUtils.h"
#include "MTLPipelineState.h"
#include "MTLInputAssembler.h"
#include "MTLBindingLayout.h"

#import <Metal/MTLRenderCommandEncoder.h>

NS_CC_BEGIN

CCMTLCommandBuffer::CCMTLCommandBuffer(GFXDevice* device) : GFXCommandBuffer(device) {}
CCMTLCommandBuffer::~CCMTLCommandBuffer() { destroy(); }

bool CCMTLCommandBuffer::Initialize(const GFXCommandBufferInfo& info)
{
    if (!info.allocator)
        return false;
    
    allocator_ = info.allocator;
    _MTLCommandAllocator = static_cast<CCMTLCommandAllocator*>(allocator_);
    type_ = info.type;
    
    _currentDepthBias = CC_NEW(CCMTLDepthBias);
    if (_currentDepthBias == nullptr)
        return false;
    
    _commandPackage = CC_NEW(CCMTLCommandPackage);
    if (_commandPackage == nullptr)
    {
        CC_SAFE_DELETE(_currentDepthBias);
        return false;
    }
    
    return true;
}

void CCMTLCommandBuffer::destroy()
{
    if (_MTLCommandAllocator)
    {
        _MTLCommandAllocator->clearCommands(_commandPackage);
        _MTLCommandAllocator = nullptr;
    }
    allocator_ = nullptr;
    
    CC_SAFE_DELETE(_commandPackage);
    CC_SAFE_DELETE(_currentDepthBias);
}

void CCMTLCommandBuffer::Begin()
{
    _MTLCommandAllocator->clearCommands(_commandPackage);
    _numTriangles = 0;
    _numDrawCalls = 0;
}

void CCMTLCommandBuffer::End()
{
    if (_isStateInValid) bindStates();
    _isInRenderPass = false;
}

void CCMTLCommandBuffer::BeginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, GFXColor* colors, uint count, float depth, int stencil)
{
    _isInRenderPass = true;
    
    CCMTLCmdBeginRenderPass* cmd = _MTLCommandAllocator->_beginRenderPassCmdPool.alloc();
    cmd->frameBuffer = (CCMTLFrameBuffer*)fbo;
    cmd->clearFlags = clear_flags;
    cmd->renderArea = render_area;
    cmd->clearStencil = stencil;
    cmd->clearDepth = depth;
    for (uint i = 0; i < count; ++i)
        cmd->clearColors[i] = colors[i];
    
    _commandPackage->beginRenderPassCmds.push(cmd);
    _commandPackage->commandTypes.push(GFXCmdType::BEGIN_RENDER_PASS);
}

void CCMTLCommandBuffer::EndRenderPass()
{
    _isInRenderPass = false;
    _commandPackage->commandTypes.push(GFXCmdType::END_RENDER_PASS);
    
    // In metal, every render pass will create a new encoder, so should bind state again.
    _isStateInValid = true;
    _currentGPUPipelineState = nullptr;
    _currentPipelineState = nullptr;
    _currentInputAssembler = nullptr;
    _currentBindingLayout = nullptr;
    _isViewportDirty = false;
    _isScissorDirty = false;
}

void CCMTLCommandBuffer::BindPipelineState(GFXPipelineState* pso)
{
    if (pso)
    {
        _currentPipelineState = static_cast<CCMTLPipelineState*>(pso);
        if (_currentPipelineState)
            _currentGPUPipelineState = _currentPipelineState->getGPUPipelineState();
    }
    else
    {
        _currentPipelineState = nullptr;
        _currentGPUPipelineState = nullptr;
    }
    
    _isStateInValid = true;
}

void CCMTLCommandBuffer::BindBindingLayout(GFXBindingLayout* layout)
{
    _currentBindingLayout = static_cast<CCMTLBindingLayout*>(layout);
    _isStateInValid = true;
}

void CCMTLCommandBuffer::BindInputAssembler(GFXInputAssembler* ia)
{
    _currentInputAssembler = static_cast<CCMTLInputAssembler*>(ia);
    _isStateInValid = true;
}

void CCMTLCommandBuffer::SetViewport(const GFXViewport& vp)
{
    if (_currentViewport != vp)
    {
        _currentViewport = vp;
        _isViewportDirty = true;
        _isStateInValid = true;
    }
}

void CCMTLCommandBuffer::SetScissor(const GFXRect& rect)
{
    if ( _currentScissor != rect)
    {
        _currentScissor = rect;
        _isScissorDirty = true;
        _isStateInValid = true;
    }
}

void CCMTLCommandBuffer::SetLineWidth(const float width)
{
    CC_LOG_WARNING("Metal doesn't support setting line width.");
}

void CCMTLCommandBuffer::SetDepthBias(float constant, float clamp, float slope)
{
    if (math::IsNotEqualF(constant, _currentDepthBias->depthBias) ||
        math::IsNotEqualF(clamp, _currentDepthBias->clamp) ||
        math::IsNotEqualF(slope, _currentDepthBias->slopeScale))
    {
        _currentDepthBias->depthBias = constant;
        _isStateInValid = true;
    }
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
    if ( (type_ == GFXCommandBufferType::PRIMARY && _isInRenderPass) ||
        type_ ==  GFXCommandBufferType::SECONDARY)
    {
        CCMTLCmdDraw* cmd = _MTLCommandAllocator->_drawCmdPool.alloc();
        if (!cmd)
            return;
        
        if (_isStateInValid)
            bindStates();
        
        static_cast<CCMTLInputAssembler*>(ia)->extractDrawInfo(cmd);
        _commandPackage->drawCmds.push(cmd);
        _commandPackage->commandTypes.push(GFXCmdType::DRAW);
        
        ++_numDrawCalls;
        if (_currentGPUPipelineState)
        {
            switch (_currentGPUPipelineState->primitiveType) {
                case MTLPrimitiveTypeTriangle:
                    _numTriangles += ia->index_count() / 3 * std::max(ia->index_count(), 1U);
                    break;
                case MTLPrimitiveTypeTriangleStrip:
                    _numTriangles += (ia->index_count() - 2) * std::max(ia->instance_count(), 1U);
                    break;
                default:
                    break;
            }
        }
    }
    else
        CC_LOG_ERROR("Command 'Draw' must be recorded inside a render pass.");
}

void CCMTLCommandBuffer::UpdateBuffer(GFXBuffer* buff, void* data, uint size, uint offset)
{
    
}

void CCMTLCommandBuffer::CopyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, GFXBufferTextureCopy* regions, uint count)
{
    if ( (type_ == GFXCommandBufferType::PRIMARY && _isInRenderPass) ||
         (type_ == GFXCommandBufferType::SECONDARY) )
    {
        
    }
}

void CCMTLCommandBuffer::Execute(GFXCommandBuffer** cmd_buffs, uint count)
{
    
}

void CCMTLCommandBuffer::bindStates()
{
    auto commandBindState = _MTLCommandAllocator->_bindStatesCmdPool.alloc();
    commandBindState->inputAssembler = _currentInputAssembler;
    commandBindState->gpuPipelineState = _currentGPUPipelineState;
    commandBindState->depthBias = *_currentDepthBias;
    
    if ( (commandBindState->viewportDirty = _isViewportDirty) )
        commandBindState->viewport = mu::toMTLViewport(_currentViewport);
    if ( (commandBindState->scissorDirty = _isScissorDirty) )
        commandBindState->scissorRect = mu::toMTLScissorRect(_currentScissor);
    if (_currentPipelineState)
        _currentPipelineState->bindBuffer(_currentBindingLayout);
    
    _commandPackage->bindStatesCmds.push(commandBindState);
    _commandPackage->commandTypes.push(GFXCmdType::BIND_STATES);
    
    _isStateInValid = false;
}

NS_CC_END
