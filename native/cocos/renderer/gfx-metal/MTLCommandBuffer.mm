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

bool CCMTLCommandBuffer::initialize(const GFXCommandBufferInfo& info)
{
    if (!info.allocator)
        return false;
    
    _allocator = info.allocator;
    _MTLCommandAllocator = static_cast<CCMTLCommandAllocator*>(_allocator);
    _type = info.type;
    
    _currentDepthBias = CC_NEW(CCMTLDepthBias);
    if (_currentDepthBias == nullptr)
        return false;
    
    _commandPackage = CC_NEW(CCMTLCommandPackage);
    if (_commandPackage == nullptr)
    {
        CC_SAFE_DELETE(_currentDepthBias);
        return false;
    }
    
    _status = GFXStatus::SUCCESS;
    
    return true;
}

void CCMTLCommandBuffer::destroy()
{
    if (_MTLCommandAllocator)
    {
        _MTLCommandAllocator->clearCommands(_commandPackage);
        _MTLCommandAllocator = nullptr;
    }
    _allocator = nullptr;
    _status = GFXStatus::UNREADY;
    
    CC_SAFE_DELETE(_commandPackage);
    CC_SAFE_DELETE(_currentDepthBias);
}

void CCMTLCommandBuffer::begin()
{
    _MTLCommandAllocator->clearCommands(_commandPackage);
    _numTriangles = 0;
    _numDrawCalls = 0;
}

void CCMTLCommandBuffer::end()
{
    _isInRenderPass = false;
}

void CCMTLCommandBuffer::beginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, const std::vector<GFXColor>& colors, float depth, int stencil)
{
    _isInRenderPass = true;
    
    CCMTLCmdBeginRenderPass* cmd = _MTLCommandAllocator->_beginRenderPassCmdPool.alloc();
    cmd->frameBuffer = (CCMTLFrameBuffer*)fbo;
    cmd->clearFlags = clear_flags;
    cmd->renderArea = render_area;
    cmd->clearStencil = stencil;
    cmd->clearDepth = depth;
    for (uint i = 0; i < colors.size(); ++i)
        cmd->clearColors[i] = colors[i];
    
    _commandPackage->beginRenderPassCmds.push(cmd);
    _commandPackage->commandTypes.push(GFXCmdType::BEGIN_RENDER_PASS);
}

void CCMTLCommandBuffer::endRenderPass()
{
    _isInRenderPass = false;
    _commandPackage->commandTypes.push(GFXCmdType::END_RENDER_PASS);
}

void CCMTLCommandBuffer::bindPipelineState(GFXPipelineState* pso)
{
    _isPipelineStateDirty = pso != _currentPipelineState;
    _isStateInValid = _isPipelineStateDirty;
    
    _currentPipelineState = static_cast<CCMTLPipelineState*>(pso);
}

void CCMTLCommandBuffer::bindBindingLayout(GFXBindingLayout* layout)
{
    _currentBindingLayout = static_cast<CCMTLBindingLayout*>(layout);
    _isStateInValid = true;
}

void CCMTLCommandBuffer::bindInputAssembler(GFXInputAssembler* ia)
{
    _currentInputAssembler = static_cast<CCMTLInputAssembler*>(ia);
    _isStateInValid = true;
}

void CCMTLCommandBuffer::setViewport(const GFXViewport& vp)
{
    if (_currentViewport != vp)
    {
        _currentViewport = vp;
        _isViewportDirty = true;
        _isStateInValid = true;
    }
}

void CCMTLCommandBuffer::setScissor(const GFXRect& rect)
{
    if ( _currentScissor != rect)
    {
        _currentScissor = rect;
        _isScissorDirty = true;
        _isStateInValid = true;
    }
}

void CCMTLCommandBuffer::setLineWidth(const float width)
{
    CC_LOG_WARNING("Metal doesn't support setting line width.");
}

void CCMTLCommandBuffer::setDepthBias(float constant, float clamp, float slope)
{
    if (math::IsNotEqualF(constant, _currentDepthBias->depthBias) ||
        math::IsNotEqualF(clamp, _currentDepthBias->clamp) ||
        math::IsNotEqualF(slope, _currentDepthBias->slopeScale))
    {
        _currentDepthBias->depthBias = constant;
        _isStateInValid = true;
    }
}

void CCMTLCommandBuffer::setBlendConstants(const GFXColor& constants)
{
    
}

void CCMTLCommandBuffer::setDepthBound(float min_bounds, float max_bounds)
{
    
}

void CCMTLCommandBuffer::setStencilWriteMask(GFXStencilFace face, uint mask)
{
    
}

void CCMTLCommandBuffer::setStencilCompareMask(GFXStencilFace face, int ref, uint mask)
{
    
}

void CCMTLCommandBuffer::draw(GFXInputAssembler* ia)
{
    if ( (_type == GFXCommandBufferType::PRIMARY && _isInRenderPass) ||
        _type ==  GFXCommandBufferType::SECONDARY)
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
        _numInstances += ia->getInstanceCount();
        
        if (_currentPipelineState)
        {
            switch (_currentPipelineState->getGPUPipelineState()->primitiveType) {
                case MTLPrimitiveTypeTriangle:
                    _numTriangles += ia->getIndexCount() / 3 * std::max(ia->getIndexCount(), 1U);
                    break;
                case MTLPrimitiveTypeTriangleStrip:
                    _numTriangles += (ia->getIndexCount() - 2) * std::max(ia->getInstanceCount(), 1U);
                    break;
                default:
                    break;
            }
        }
    }
    else
        CC_LOG_ERROR("Command 'draw' must be recorded inside a render pass.");
}

void CCMTLCommandBuffer::updateBuffer(GFXBuffer* buff, void* data, uint size, uint offset)
{
    
}

void CCMTLCommandBuffer::copyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, const GFXBufferTextureCopyList& regions)
{
    if ( (_type == GFXCommandBufferType::PRIMARY && _isInRenderPass) ||
         (_type == GFXCommandBufferType::SECONDARY) )
    {
        
    }
}

void CCMTLCommandBuffer::execute(const std::vector<GFXCommandBuffer*>& commandBuffs, uint32_t count)
{
    for (uint i = 0; i < count; ++i)
    {
        auto commandBuffer = static_cast<CCMTLCommandBuffer*>(commandBuffs[i]);
        for (uint j = 0; j < commandBuffer->_commandPackage->beginRenderPassCmds.size(); ++j)
        {
            CCMTLCmdBeginRenderPass* cmd = commandBuffer->_commandPackage->beginRenderPassCmds[j];
            ++cmd->ref_count;
            _commandPackage->beginRenderPassCmds.push(cmd);
        }
        for (uint j  = 0; j < commandBuffer->_commandPackage->bindStatesCmds.size(); ++j)
        {
            CCMTLCmdBindStates* cmd = commandBuffer->_commandPackage->bindStatesCmds[j];
            ++cmd->ref_count;
            _commandPackage->bindStatesCmds.push(cmd);
        }
        for (uint j = 0; j < commandBuffer->_commandPackage->drawCmds.size(); ++j)
        {
            CCMTLCmdDraw* cmd = commandBuffer->_commandPackage->drawCmds[j];
            ++cmd->ref_count;
            _commandPackage->drawCmds.push(cmd);
        }
        for (uint j = 0; j < commandBuffer->_commandPackage->updateBufferCmds.size(); ++j)
        {
            CCMTLCmdUpdateBuffer* cmd = commandBuffer->_commandPackage->updateBufferCmds[j];
            ++cmd->ref_count;
            _commandPackage->updateBufferCmds.push(cmd);
        }
        for (uint j = 0; j < commandBuffer->_commandPackage->copyBufferToTextureCmds.size(); ++j)
        {
            CCMTLCmdCopyBufferToTexture* cmd = commandBuffer->_commandPackage->copyBufferToTextureCmds[j];
            ++cmd->ref_count;
            _commandPackage->copyBufferToTextureCmds.push(cmd);
        }
        _commandPackage->commandTypes.concat(commandBuffer->_commandPackage->commandTypes);
        
        _numDrawCalls += commandBuffer->_numDrawCalls;
        _numInstances += commandBuffer->_numInstances;
        _numTriangles += commandBuffer->_numTriangles;
    }
}

void CCMTLCommandBuffer::bindStates()
{
    auto commandBindState = _MTLCommandAllocator->_bindStatesCmdPool.alloc();
    commandBindState->inputAssembler = _currentInputAssembler;

    commandBindState->depthBias = *_currentDepthBias;
    
    if ( (commandBindState->viewportDirty = _isViewportDirty) )
        commandBindState->viewport = mu::toMTLViewport(_currentViewport);
    
    if ( (commandBindState->scissorDirty = _isScissorDirty) )
        commandBindState->scissorRect = mu::toMTLScissorRect(_currentScissor);
    
    if ( (commandBindState->pipelineStateDirty = _isPipelineStateDirty) && _currentPipelineState)
    {
        _currentPipelineState->updateBindingBlocks(_currentBindingLayout);
        commandBindState->gpuPipelineState = _currentPipelineState->getGPUPipelineState();
    }
    
    _commandPackage->bindStatesCmds.push(commandBindState);
    _commandPackage->commandTypes.push(GFXCmdType::BIND_STATES);
    
    _isStateInValid = false;
    _isViewportDirty = false;
    _isPipelineStateDirty = false;
    _isScissorDirty = false;
}

NS_CC_END
