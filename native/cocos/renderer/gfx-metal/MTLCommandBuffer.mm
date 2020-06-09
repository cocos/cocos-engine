#include "MTLStd.h"
#include "MTLCommandBuffer.h"
#include "MTLCommandAllocator.h"
#include "MTLCommands.h"
#include "MTLUtils.h"
#include "MTLPipelineState.h"
#include "MTLInputAssembler.h"
#include "MTLBindingLayout.h"
#include "MTLBuffer.h"
#include "MTLTexture.h"

#import <Metal/MTLRenderCommandEncoder.h>

NS_CC_BEGIN

CCMTLCommandBuffer::CCMTLCommandBuffer(GFXDevice *device) : GFXCommandBuffer(device) {}
CCMTLCommandBuffer::~CCMTLCommandBuffer() { destroy(); }

bool CCMTLCommandBuffer::initialize(const GFXCommandBufferInfo &info) {
    if (!info.allocator)
        return false;
    
    _allocator = info.allocator;
    _MTLCommandAllocator = static_cast<CCMTLCommandAllocator*>(_allocator);
    _type = info.type;
    
    _currentDepthBias = CC_NEW(CCMTLDepthBias);
    if (_currentDepthBias == nullptr) {
        destroy();
        return false;
    }
    
    _currentDepthBounds = CC_NEW(CCMTLDepthBounds);
    if (_currentDepthBounds == nullptr) {
        destroy();
        return false;
    }
    
    _commandPackage = CC_NEW(CCMTLCommandPackage);
    if (_commandPackage == nullptr) {
        destroy();
        return false;
    }
    
    _status = GFXStatus::SUCCESS;
    
    return true;
}

void CCMTLCommandBuffer::destroy() {
    if (_MTLCommandAllocator) {
        _MTLCommandAllocator->clearCommands(_commandPackage);
        _MTLCommandAllocator = nullptr;
    }
    _allocator = nullptr;
    _status = GFXStatus::UNREADY;
    
    CC_SAFE_DELETE(_commandPackage);
    CC_SAFE_DELETE(_currentDepthBias);
    CC_SAFE_DELETE(_currentDepthBounds);
}

void CCMTLCommandBuffer::begin(GFXRenderPass *renderPass, uint subpass, GFXFramebuffer *frameBuffer) {
    _MTLCommandAllocator->clearCommands(_commandPackage);
    _numTriangles = 0;
    _numDrawCalls = 0;
}

void CCMTLCommandBuffer::end() {
    _isInRenderPass = false;
}

void CCMTLCommandBuffer::beginRenderPass(GFXFramebuffer *fbo, const GFXRect &render_area, GFXClearFlags clear_flags, const std::vector<GFXColor> &colors, float depth, int stencil) {
    _isInRenderPass = true;
    
    CCMTLCmdBeginRenderPass *cmd = _MTLCommandAllocator->_beginRenderPassCmdPool.alloc();
    cmd->frameBuffer = (CCMTLFramebuffer*)fbo;
    cmd->clearFlags = clear_flags;
    cmd->renderArea = render_area;
    cmd->clearStencil = stencil;
    cmd->clearDepth = depth;
    cmd->clearColors = colors;
    
    _commandPackage->beginRenderPassCmds.push(cmd);
    _commandPackage->commandTypes.push(GFXCmdType::BEGIN_RENDER_PASS);
}

void CCMTLCommandBuffer::endRenderPass() {
    _isInRenderPass = false;
    _commandPackage->commandTypes.push(GFXCmdType::END_RENDER_PASS);
}

void CCMTLCommandBuffer::bindPipelineState(GFXPipelineState *pso) {
    _isStateInValid = true;
    _currentPipelineState = static_cast<CCMTLPipelineState*>(pso);
}

void CCMTLCommandBuffer::bindBindingLayout(GFXBindingLayout *layout) {
    _currentBindingLayout = static_cast<CCMTLBindingLayout*>(layout);
    _isStateInValid = true;
}

void CCMTLCommandBuffer::bindInputAssembler(GFXInputAssembler *ia) {
    _currentInputAssembler = static_cast<CCMTLInputAssembler*>(ia);
    _isStateInValid = true;
}

void CCMTLCommandBuffer::setViewport(const GFXViewport &vp) {
    if (_currentViewport != vp) {
        _currentViewport = vp;
        _dynamicStateDirty[static_cast<uint>(GFXDynamicState::VIEWPORT)] = true;
        _isStateInValid = true;
    }
}

void CCMTLCommandBuffer::setScissor(const GFXRect &rect) {
    if ( _currentScissor != rect) {
        _currentScissor = rect;
        _dynamicStateDirty[static_cast<uint>(GFXDynamicState::SCISSOR)] = true;
        _isStateInValid = true;
    }
}

void CCMTLCommandBuffer::setLineWidth(const float width) {
    CC_LOG_WARNING("Metal doesn't support setting line width.");
}

void CCMTLCommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    if (math::IsNotEqualF(constant, _currentDepthBias->depthBias) ||
        math::IsNotEqualF(clamp, _currentDepthBias->clamp) ||
        math::IsNotEqualF(slope, _currentDepthBias->slopeScale)) {
        _currentDepthBias->depthBias = constant;
        _currentDepthBias->slopeScale = slope;
        _currentDepthBias->clamp = clamp;
        _isStateInValid = true;
        _dynamicStateDirty[static_cast<uint>(GFXDynamicState::DEPTH_BIAS)] = true;
    }
}

void CCMTLCommandBuffer::setBlendConstants(const GFXColor &constants) {
    if (math::IsNotEqualF(constants.r, _currentBlendConstants.r) ||
        math::IsNotEqualF(constants.g, _currentBlendConstants.g) ||
        math::IsNotEqualF(constants.b, _currentBlendConstants.b) ||
        math::IsNotEqualF(constants.a, _currentBlendConstants.a)) {
        _currentBlendConstants.r = constants.r;
        _currentBlendConstants.g = constants.g;
        _currentBlendConstants.b = constants.b;
        _currentBlendConstants.a = constants.a;
        _isStateInValid = true;
        _dynamicStateDirty[static_cast<uint>(GFXDynamicState::BLEND_CONSTANTS)] = true;
    }
}

void CCMTLCommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    CC_LOG_ERROR("Metal doesn't support setting depth bound.");
}

void CCMTLCommandBuffer::setStencilWriteMask(GFXStencilFace face, uint mask) {
    CC_LOG_ERROR("Don't support change stencil write mask here.");
}

void CCMTLCommandBuffer::setStencilCompareMask(GFXStencilFace face, int ref, uint mask) {
    CC_LOG_ERROR("Don't support change stencil compare mask here.");
}

void CCMTLCommandBuffer::draw(GFXInputAssembler *ia) {
    if ( (_type == GFXCommandBufferType::PRIMARY && _isInRenderPass) ||
         _type ==  GFXCommandBufferType::SECONDARY) {
        CCMTLCmdDraw *cmd = _MTLCommandAllocator->_drawCmdPool.alloc();
        if (!cmd)
            return;
        
        if (_isStateInValid)
            bindStates();
        
        static_cast<CCMTLInputAssembler*>(ia)->extractDrawInfo(cmd);
        _commandPackage->drawCmds.push(cmd);
        _commandPackage->commandTypes.push(GFXCmdType::DRAW);
        
        ++_numDrawCalls;
        _numInstances += ia->getInstanceCount();
        
        if (_currentPipelineState) {
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

void CCMTLCommandBuffer::updateBuffer(GFXBuffer *buff, void *data, uint size, uint offset) {
    if ((_type == GFXCommandBufferType::PRIMARY && _isInRenderPass) ||
        (_type == GFXCommandBufferType::SECONDARY)) {
        if (buff) {
            CCMTLCmdUpdateBuffer* cmd = _MTLCommandAllocator->_updateBufferCmdPool.alloc();
            cmd->gpuBuffer = static_cast<CCMTLBuffer*>(buff);
            cmd->buffer = (uint8_t*)data;
            cmd->size = size;
            cmd->offset = offset;

            _commandPackage->updateBufferCmds.push(cmd);
            _commandPackage->commandTypes.push(GFXCmdType::UPDATE_BUFFER);
        }
    }
    else{
        CC_LOG_ERROR("Command 'updateBuffer' must be recorded inside a render pass.");
    }
}

void CCMTLCommandBuffer::copyBufferToTexture(GFXBuffer *src, GFXTexture *dst, GFXTextureLayout layout, const GFXBufferTextureCopyList &regions) {
    if ((_type == GFXCommandBufferType::PRIMARY && _isInRenderPass) ||
        (_type == GFXCommandBufferType::SECONDARY)) {
        if (src && dst) {
            CCMTLCmdCopyBufferToTexture* cmd = _MTLCommandAllocator->_copyBufferToTextureCmdPool.alloc();
            cmd->gpuBuffer = static_cast<CCMTLBuffer*>(src);
            cmd->gpuTexture = static_cast<CCMTLTexture*>(dst);
            cmd->dstLayout = layout;
            cmd->regions.resize(regions.size());
            std::copy(regions.begin(), regions.end(), cmd->regions.begin());

            _commandPackage->copyBufferToTextureCmds.push(cmd);
            _commandPackage->commandTypes.push(GFXCmdType::COPY_BUFFER_TO_TEXTURE);
        }
    } else {
        CC_LOG_ERROR("Command 'copyBufferToTexture' must be recorded inside a render pass.");
    }
}

void CCMTLCommandBuffer::execute(const std::vector<GFXCommandBuffer*> &commandBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        auto commandBuffer = static_cast<CCMTLCommandBuffer*>(commandBuffs[i]);
        for (uint j = 0; j < commandBuffer->_commandPackage->beginRenderPassCmds.size(); ++j) {
            CCMTLCmdBeginRenderPass* cmd = commandBuffer->_commandPackage->beginRenderPassCmds[j];
            ++cmd->ref_count;
            _commandPackage->beginRenderPassCmds.push(cmd);
        }
        for (uint j  = 0; j < commandBuffer->_commandPackage->bindStatesCmds.size(); ++j) {
            CCMTLCmdBindStates* cmd = commandBuffer->_commandPackage->bindStatesCmds[j];
            ++cmd->ref_count;
            _commandPackage->bindStatesCmds.push(cmd);
        }
        for (uint j = 0; j < commandBuffer->_commandPackage->drawCmds.size(); ++j) {
            CCMTLCmdDraw* cmd = commandBuffer->_commandPackage->drawCmds[j];
            ++cmd->ref_count;
            _commandPackage->drawCmds.push(cmd);
        }
        for (uint j = 0; j < commandBuffer->_commandPackage->updateBufferCmds.size(); ++j) {
            CCMTLCmdUpdateBuffer* cmd = commandBuffer->_commandPackage->updateBufferCmds[j];
            ++cmd->ref_count;
            _commandPackage->updateBufferCmds.push(cmd);
        }
        for (uint j = 0; j < commandBuffer->_commandPackage->copyBufferToTextureCmds.size(); ++j) {
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

void CCMTLCommandBuffer::bindStates() {
    auto commandBindState = _MTLCommandAllocator->_bindStatesCmdPool.alloc();
    commandBindState->inputAssembler = _currentInputAssembler;

    commandBindState->depthBias = *_currentDepthBias;
    commandBindState->blendConstants = _currentBlendConstants;
    commandBindState->depthBounds = *_currentDepthBounds;
    
    commandBindState->dynamicStateDirty = _dynamicStateDirty;
    commandBindState->viewport = mu::toMTLViewport(_currentViewport);
    commandBindState->scissorRect = mu::toMTLScissorRect(_currentScissor);
    
    commandBindState->pipelineState = _currentPipelineState;
    commandBindState->bindingLayout = _currentBindingLayout;
    
    _commandPackage->bindStatesCmds.push(commandBindState);
    _commandPackage->commandTypes.push(GFXCmdType::BIND_STATES);
    
    _isStateInValid = false;
    std::fill(_dynamicStateDirty.begin(), _dynamicStateDirty.end(), false);
}

NS_CC_END
