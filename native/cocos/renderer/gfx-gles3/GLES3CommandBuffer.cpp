/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3CommandBuffer.h"
#include "GLES3DescriptorSet.h"
#include "GLES3Device.h"
#include "GLES3Framebuffer.h"
#include "GLES3GlobalBarrier.h"
#include "GLES3InputAssembler.h"
#include "GLES3PipelineState.h"
#include "GLES3RenderPass.h"
#include "GLES3Texture.h"

namespace cc {
namespace gfx {

GLES3CommandBuffer::GLES3CommandBuffer(Device *device)
: CommandBuffer(device) {
}

GLES3CommandBuffer::~GLES3CommandBuffer() {
}

bool GLES3CommandBuffer::initialize(const CommandBufferInfo &info) {
    _type  = info.type;
    _queue = info.queue;

    _cmdAllocator  = CC_NEW(GLES3GPUCommandAllocator);
    _curCmdPackage = CC_NEW(GLES3CmdPackage);

    size_t setCount = ((GLES3Device *)_device)->bindingMappingInfo().bufferOffsets.size();
    _curGPUDescriptorSets.resize(setCount);
    _curDynamicOffsets.resize(setCount);

    return true;
}

void GLES3CommandBuffer::destroy() {
    _cmdAllocator->clearCmds(_curCmdPackage);
    CC_SAFE_DELETE(_curCmdPackage);

    while (!_pendingPackages.empty()) {
        GLES3CmdPackage *package = _pendingPackages.front();
        _cmdAllocator->clearCmds(package);
        CC_SAFE_DELETE(package);
        _pendingPackages.pop();
    }

    while (!_freePackages.empty()) {
        GLES3CmdPackage *package = _freePackages.front();
        _cmdAllocator->clearCmds(package);
        CC_SAFE_DELETE(package);
        _freePackages.pop();
    }

    _cmdAllocator->reset();
    CC_DELETE(_cmdAllocator);
}

void GLES3CommandBuffer::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    _curGPUPipelineState = nullptr;
    _curGPUInputAssember = nullptr;
    _curGPUDescriptorSets.assign(_curGPUDescriptorSets.size(), nullptr);

    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;

    _cmdAllocator->clearCmds(_curCmdPackage);
}

void GLES3CommandBuffer::end() {
    if (_isStateInvalid) {
        BindStates();
    }
    _isInRenderPass = false;

    _pendingPackages.push(_curCmdPackage);
    if (!_freePackages.empty()) {
        _curCmdPackage = _freePackages.front();
        _freePackages.pop();
    } else {
        _curCmdPackage = CC_NEW(GLES3CmdPackage);
    }
}

void GLES3CommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const *secondaryCBs, uint secondaryCBCount) {
    _isInRenderPass = true;

    GLES3CmdBeginRenderPass *cmd = _cmdAllocator->beginRenderPassCmdPool.alloc();
    cmd->gpuRenderPass           = ((GLES3RenderPass *)renderPass)->gpuRenderPass();
    cmd->gpuFBO                  = ((GLES3Framebuffer *)fbo)->gpuFBO();
    cmd->renderArea              = renderArea;
    cmd->numClearColors          = cmd->gpuRenderPass->colorAttachments.size();
    for (size_t i = 0; i < cmd->numClearColors; ++i) {
        cmd->clearColors[i] = colors[i];
    }
    cmd->clearDepth   = depth;
    cmd->clearStencil = stencil;
    _curCmdPackage->beginRenderPassCmds.push(cmd);
    _curCmdPackage->cmds.push(GLESCmdType::BEGIN_RENDER_PASS);
}

void GLES3CommandBuffer::endRenderPass() {
    _isInRenderPass = false;
    _curCmdPackage->cmds.push(GLESCmdType::END_RENDER_PASS);
}

void GLES3CommandBuffer::bindPipelineState(PipelineState *pso) {
    GLES3GPUPipelineState *gpuPipelineState = ((GLES3PipelineState *)pso)->gpuPipelineState();
    if (_curGPUPipelineState != gpuPipelineState) {
        _curGPUPipelineState = gpuPipelineState;
        _isStateInvalid      = true;
    }
}

void GLES3CommandBuffer::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    CCASSERT(_curGPUDescriptorSets.size() > set, "Invalid set index");

    GLES3GPUDescriptorSet *gpuDescriptorSet = ((GLES3DescriptorSet *)descriptorSet)->gpuDescriptorSet();
    if (_curGPUDescriptorSets[set] != gpuDescriptorSet) {
        _curGPUDescriptorSets[set] = gpuDescriptorSet;
        _isStateInvalid            = true;
    }
    if (dynamicOffsetCount) {
        _curDynamicOffsets[set].assign(dynamicOffsets, dynamicOffsets + dynamicOffsetCount);
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::bindInputAssembler(InputAssembler *ia) {
    _curGPUInputAssember = ((GLES3InputAssembler *)ia)->gpuInputAssembler();
    _isStateInvalid      = true;
}

void GLES3CommandBuffer::setViewport(const Viewport &vp) {

    if ((_curViewport.left != vp.left) ||
        (_curViewport.top != vp.top) ||
        (_curViewport.width != vp.width) ||
        (_curViewport.height != vp.height) ||
        math::IsNotEqualF(_curViewport.minDepth, vp.minDepth) ||
        math::IsNotEqualF(_curViewport.maxDepth, vp.maxDepth)) {

        _curViewport    = vp;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setScissor(const Rect &rect) {
    if ((_curScissor.x != rect.x) ||
        (_curScissor.y != rect.y) ||
        (_curScissor.width != rect.width) ||
        (_curScissor.height != rect.height)) {

        _curScissor     = rect;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setLineWidth(float width) {
    if (math::IsNotEqualF(_curLineWidth, width)) {
        _curLineWidth   = width;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    if (math::IsNotEqualF(_curDepthBias.constant, constant) ||
        math::IsNotEqualF(_curDepthBias.clamp, clamp) ||
        math::IsNotEqualF(_curDepthBias.slope, slope)) {

        _curDepthBias.constant = constant;
        _curDepthBias.clamp    = clamp;
        _curDepthBias.slope    = slope;
        _isStateInvalid        = true;
    }
}

void GLES3CommandBuffer::setBlendConstants(const Color &constants) {
    if (math::IsNotEqualF(_curBlendConstants.x, constants.x) ||
        math::IsNotEqualF(_curBlendConstants.y, constants.y) ||
        math::IsNotEqualF(_curBlendConstants.z, constants.z) ||
        math::IsNotEqualF(_curBlendConstants.w, constants.w)) {

        _curBlendConstants.x = constants.x;
        _curBlendConstants.y = constants.y;
        _curBlendConstants.z = constants.z;
        _curBlendConstants.w = constants.w;
        _isStateInvalid      = true;
    }
}

void GLES3CommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    if (math::IsNotEqualF(_curDepthBounds.minBounds, minBounds) ||
        math::IsNotEqualF(_curDepthBounds.maxBounds, maxBounds)) {

        _curDepthBounds.minBounds = minBounds;
        _curDepthBounds.maxBounds = maxBounds;
        _isStateInvalid           = true;
    }
}

void GLES3CommandBuffer::setStencilWriteMask(StencilFace face, uint mask) {
    if ((_curStencilWriteMask.face != face) ||
        (_curStencilWriteMask.writeMask != mask)) {

        _curStencilWriteMask.face      = face;
        _curStencilWriteMask.writeMask = mask;
        _isStateInvalid                = true;
    }
}

void GLES3CommandBuffer::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    if ((_curStencilCompareMask.face != face) ||
        (_curStencilCompareMask.refrence != ref) ||
        (_curStencilCompareMask.compareMask != mask)) {

        _curStencilCompareMask.face        = face;
        _curStencilCompareMask.refrence    = ref;
        _curStencilCompareMask.compareMask = mask;
        _isStateInvalid                    = true;
    }
}

void GLES3CommandBuffer::draw(InputAssembler *ia) {
    if ((_type == CommandBufferType::PRIMARY && _isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        if (_isStateInvalid) {
            BindStates();
        }

        GLES3CmdDraw *cmd = _cmdAllocator->drawCmdPool.alloc();
        ((GLES3InputAssembler *)ia)->ExtractCmdDraw(cmd);
        _curCmdPackage->drawCmds.push(cmd);
        _curCmdPackage->cmds.push(GLESCmdType::DRAW);

        ++_numDrawCalls;
        _numInstances += ia->getInstanceCount();
        if (_curGPUPipelineState) {
            switch (_curGPUPipelineState->glPrimitive) {
                case GL_TRIANGLES: {
                    _numTriangles += ia->getIndexCount() / 3 * std::max(ia->getInstanceCount(), 1U);
                    break;
                }
                case GL_TRIANGLE_STRIP:
                case GL_TRIANGLE_FAN: {
                    _numTriangles += (ia->getIndexCount() - 2) * std::max(ia->getInstanceCount(), 1U);
                    break;
                }
                default:
                    break;
            }
        }
    } else {
        CC_LOG_ERROR("Command 'draw' must be recorded inside a render pass.");
    }
}

void GLES3CommandBuffer::updateBuffer(Buffer *buff, const void *data, uint size) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES3GPUBuffer *gpuBuffer = ((GLES3Buffer *)buff)->gpuBuffer();
        if (gpuBuffer) {
            GLES3CmdUpdateBuffer *cmd = _cmdAllocator->updateBufferCmdPool.alloc();
            cmd->gpuBuffer            = gpuBuffer;
            cmd->size                 = size;
            cmd->buffer               = (uint8_t *)data;

            _curCmdPackage->updateBufferCmds.push(cmd);
            _curCmdPackage->cmds.push(GLESCmdType::UPDATE_BUFFER);
        }
    } else {
        CC_LOG_ERROR("Command 'updateBuffer' must be recorded outside a render pass.");
    }
}

void GLES3CommandBuffer::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint count, Filter filter) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES3CmdBlitTexture *cmd = _cmdAllocator->blitTextureCmdPool.alloc();
        if (srcTexture) cmd->gpuTextureSrc = ((GLES3Texture *)srcTexture)->gpuTexture();
        if (dstTexture) cmd->gpuTextureDst = ((GLES3Texture *)dstTexture)->gpuTexture();
        cmd->regions = regions;
        cmd->count   = count;
        cmd->filter  = filter;

        _curCmdPackage->blitTextureCmds.push(cmd);
        _curCmdPackage->cmds.push(GLESCmdType::BLIT_TEXTURE);
    } else {
        CC_LOG_ERROR("Command 'blitTexture' must be recorded outside a render pass.");
    }
}

void GLES3CommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES3GPUTexture *gpuTexture = ((GLES3Texture *)texture)->gpuTexture();
        if (gpuTexture) {
            GLES3CmdCopyBufferToTexture *cmd = _cmdAllocator->copyBufferToTextureCmdPool.alloc();
            cmd->gpuTexture                  = gpuTexture;
            cmd->gpuTexture                  = gpuTexture;
            cmd->regions                     = regions;
            cmd->count                       = count;
            cmd->buffers                     = buffers;

            _curCmdPackage->copyBufferToTextureCmds.push(cmd);
            _curCmdPackage->cmds.push(GLESCmdType::COPY_BUFFER_TO_TEXTURE);
        }
    } else {
        CC_LOG_ERROR("Command 'copyBuffersToTexture' must be recorded outside a render pass.");
    }
}

void GLES3CommandBuffer::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    CCASSERT(false, "Command 'execute' must be recorded in primary command buffers.");

    for (uint i = 0; i < count; ++i) {
        GLES3CommandBuffer *cmdBuff    = (GLES3CommandBuffer *)cmdBuffs[i];
        GLES3CmdPackage *   cmdPackage = cmdBuff->_pendingPackages.front();

        for (uint j = 0; j < cmdPackage->beginRenderPassCmds.size(); ++j) {
            GLES3CmdBeginRenderPass *cmd = cmdPackage->beginRenderPassCmds[j];
            ++cmd->refCount;
            _curCmdPackage->beginRenderPassCmds.push(cmd);
        }
        for (uint j = 0; j < cmdPackage->bindStatesCmds.size(); ++j) {
            GLES3CmdBindStates *cmd = cmdPackage->bindStatesCmds[j];
            ++cmd->refCount;
            _curCmdPackage->bindStatesCmds.push(cmd);
        }
        for (uint j = 0; j < cmdPackage->drawCmds.size(); ++j) {
            GLES3CmdDraw *cmd = cmdPackage->drawCmds[j];
            ++cmd->refCount;
            _curCmdPackage->drawCmds.push(cmd);
        }
        for (uint j = 0; j < cmdPackage->dispatchCmds.size(); ++j) {
            GLES3CmdDispatch *cmd = cmdPackage->dispatchCmds[j];
            ++cmd->refCount;
            _curCmdPackage->dispatchCmds.push(cmd);
        }
        for (uint j = 0; j < cmdPackage->barrierCmds.size(); ++j) {
            GLES3CmdBarrier *cmd = cmdPackage->barrierCmds[j];
            ++cmd->refCount;
            _curCmdPackage->barrierCmds.push(cmd);
        }
        for (uint j = 0; j < cmdPackage->updateBufferCmds.size(); ++j) {
            GLES3CmdUpdateBuffer *cmd = cmdPackage->updateBufferCmds[j];
            ++cmd->refCount;
            _curCmdPackage->updateBufferCmds.push(cmd);
        }
        for (uint j = 0; j < cmdPackage->copyBufferToTextureCmds.size(); ++j) {
            GLES3CmdCopyBufferToTexture *cmd = cmdPackage->copyBufferToTextureCmds[j];
            ++cmd->refCount;
            _curCmdPackage->copyBufferToTextureCmds.push(cmd);
        }
        for (uint j = 0; j < cmdPackage->blitTextureCmds.size(); ++j) {
            GLES3CmdBlitTexture *cmd = cmdPackage->blitTextureCmds[j];
            ++cmd->refCount;
            _curCmdPackage->blitTextureCmds.push(cmd);
        }
        _curCmdPackage->cmds.concat(cmdPackage->cmds);

        _numDrawCalls += cmdBuff->_numDrawCalls;
        _numInstances += cmdBuff->_numInstances;
        _numTriangles += cmdBuff->_numTriangles;

        cmdBuff->_pendingPackages.pop();
        cmdBuff->_freePackages.push(cmdPackage);

        // current cmd allocator strategy will not work here: (but it doesn't matter anyways)
        // allocators are designed to only free the cmds they allocated
        // but here we are essentially 'transfering' the owner ship
        //cmdBuff->_cmdAllocator->clearCmds(cmdPackage);
    }
}

void GLES3CommandBuffer::BindStates() {
    GLES3CmdBindStates *cmd = _cmdAllocator->bindStatesCmdPool.alloc();
    cmd->gpuPipelineState   = _curGPUPipelineState;
    cmd->gpuInputAssembler  = _curGPUInputAssember;
    cmd->gpuDescriptorSets  = _curGPUDescriptorSets;

    if (_curGPUPipelineState) {
        vector<uint> &dynamicOffsetOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsetOffsets;
        cmd->dynamicOffsets.resize(_curGPUPipelineState->gpuPipelineLayout->dynamicOffsetCount);
        for (size_t i = 0u; i < _curDynamicOffsets.size(); i++) {
            size_t count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
            //CCASSERT(_curDynamicOffsets[i].size() >= count, "missing dynamic offsets?");
            count = std::min(count, _curDynamicOffsets[i].size());
            if (count) memcpy(&cmd->dynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsets[i].data(), count * sizeof(uint));
        }
    }

    cmd->viewport           = _curViewport;
    cmd->scissor            = _curScissor;
    cmd->lineWidth          = _curLineWidth;
    cmd->depthBias          = _curDepthBias;
    cmd->blendConstants.x   = _curBlendConstants.x;
    cmd->blendConstants.y   = _curBlendConstants.y;
    cmd->blendConstants.z   = _curBlendConstants.z;
    cmd->blendConstants.w   = _curBlendConstants.w;
    cmd->depthBounds        = _curDepthBounds;
    cmd->stencilWriteMask   = _curStencilWriteMask;
    cmd->stencilCompareMask = _curStencilCompareMask;

    _curCmdPackage->bindStatesCmds.push(cmd);
    _curCmdPackage->cmds.push(GLESCmdType::BIND_STATES);
    _isStateInvalid = false;
}

void GLES3CommandBuffer::dispatch(const DispatchInfo &info) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        if (_isStateInvalid) {
            BindStates();
        }

        GLES3CmdDispatch *cmd = _cmdAllocator->dispatchCmdPool.alloc();
        if (info.indirectBuffer) {
            cmd->dispatchInfo.indirectBuffer = ((GLES3Buffer *)info.indirectBuffer)->gpuBuffer();
            cmd->dispatchInfo.indirectOffset = info.indirectOffset;
        } else {
            cmd->dispatchInfo.groupCountX = info.groupCountX;
            cmd->dispatchInfo.groupCountY = info.groupCountY;
            cmd->dispatchInfo.groupCountZ = info.groupCountZ;
        }
        _curCmdPackage->dispatchCmds.push(cmd);
        _curCmdPackage->cmds.push(GLESCmdType::DISPATCH);
    } else {
        CC_LOG_ERROR("Command 'dispatch' must be recorded outside a render pass.");
    }
}

void GLES3CommandBuffer::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint textureBarrierCount) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {
        if (!barrier) return;

        const GLES3GPUGlobalBarrier *gpuBarrier = ((GLES3GlobalBarrier *)barrier)->gpuBarrier();

        GLES3CmdBarrier *cmd  = _cmdAllocator->barrierCmdPool.alloc();
        cmd->barriers         = gpuBarrier->glBarriers;
        cmd->barriersByRegion = gpuBarrier->glBarriersByRegion;
        _curCmdPackage->barrierCmds.push(cmd);
        _curCmdPackage->cmds.push(GLESCmdType::BARRIER);
    } else {
        CC_LOG_ERROR("Command 'pipelineBarrier' must be recorded outside a render pass.");
    }
}

} // namespace gfx
} // namespace cc
