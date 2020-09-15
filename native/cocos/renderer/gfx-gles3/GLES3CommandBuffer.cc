#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3CommandAllocator.h"
#include "GLES3CommandBuffer.h"
#include "GLES3DescriptorSet.h"
#include "GLES3Device.h"
#include "GLES3Framebuffer.h"
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
    _type = info.type;
    _queue = info.queue;

    _gles3Allocator = ((GLES3Device *)_device)->cmdAllocator();

    size_t setCount = ((GLES3Device *)_device)->bindingMappingInfo().bufferOffsets.size();
    _curGPUDescriptorSets.resize(setCount);
    _curDynamicOffsets.resize(setCount);

    _cmdPackage = CC_NEW(GLES3CmdPackage);

    return true;
}

void GLES3CommandBuffer::destroy() {
    if (_gles3Allocator) {
        _gles3Allocator->clearCmds(_cmdPackage);
        _gles3Allocator = nullptr;
    }

    CC_SAFE_DELETE(_cmdPackage);
}

void GLES3CommandBuffer::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    _gles3Allocator->clearCmds(_cmdPackage);
    _curGPUPipelineState = nullptr;
    _curGPUInputAssember = nullptr;
    _curGPUDescriptorSets.assign(_curGPUDescriptorSets.size(), nullptr);
    for (vector<uint> &offsets : _curDynamicOffsets) offsets.clear();

    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;
}

void GLES3CommandBuffer::end() {
    if (_isStateInvalid) {
        BindStates();
    }
    _isInRenderPass = false;
}

void GLES3CommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) {
    _isInRenderPass = true;

    GLES3CmdBeginRenderPass *cmd = _gles3Allocator->beginRenderPassCmdPool.alloc();
    cmd->gpuRenderPass = ((GLES3RenderPass *)renderPass)->gpuRenderPass();
    cmd->gpuFBO = ((GLES3Framebuffer *)fbo)->gpuFBO();
    cmd->renderArea = renderArea;
    cmd->numClearColors = cmd->gpuRenderPass->colorAttachments.size();
    for (size_t i = 0; i < cmd->numClearColors; ++i) {
        cmd->clearColors[i] = colors[i];
    }
    cmd->clearDepth = depth;
    cmd->clearStencil = stencil;
    _cmdPackage->beginRenderPassCmds.push(cmd);
    _cmdPackage->cmds.push(GFXCmdType::BEGIN_RENDER_PASS);
}

void GLES3CommandBuffer::endRenderPass() {
    _isInRenderPass = false;
    _cmdPackage->cmds.push(GFXCmdType::END_RENDER_PASS);
}

void GLES3CommandBuffer::bindPipelineState(PipelineState *pso) {
    GLES3GPUPipelineState *gpuPipelineState = ((GLES3PipelineState *)pso)->gpuPipelineState();
    if (_curGPUPipelineState != gpuPipelineState) {
        _curGPUPipelineState = gpuPipelineState;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    CCASSERT(_curGPUDescriptorSets.size() > set, "Invalid set index");

    GLES3GPUDescriptorSet *gpuDescriptorSet = ((GLES3DescriptorSet *)descriptorSet)->gpuDescriptorSet();
    if (_curGPUDescriptorSets[set] != gpuDescriptorSet) {
        _curGPUDescriptorSets[set] = gpuDescriptorSet;
        _isStateInvalid = true;
    }
    if (dynamicOffsetCount) {
        _curDynamicOffsets[set].assign(dynamicOffsets, dynamicOffsets + dynamicOffsetCount);
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::bindInputAssembler(InputAssembler *ia) {
    _curGPUInputAssember = ((GLES3InputAssembler *)ia)->gpuInputAssembler();
    _isStateInvalid = true;
}

void GLES3CommandBuffer::setViewport(const Viewport &vp) {

    if ((_curViewport.left != vp.left) ||
        (_curViewport.top != vp.top) ||
        (_curViewport.width != vp.width) ||
        (_curViewport.height != vp.height) ||
        math::IsNotEqualF(_curViewport.minDepth, vp.minDepth) ||
        math::IsNotEqualF(_curViewport.maxDepth, vp.maxDepth)) {

        _curViewport = vp;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setScissor(const Rect &rect) {
    if ((_curScissor.x != rect.x) ||
        (_curScissor.y != rect.y) ||
        (_curScissor.width != rect.width) ||
        (_curScissor.height != rect.height)) {

        _curScissor = rect;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setLineWidth(const float width) {
    if (math::IsNotEqualF(_curLineWidth, width)) {
        _curLineWidth = width;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    if (math::IsNotEqualF(_curDepthBias.constant, constant) ||
        math::IsNotEqualF(_curDepthBias.clamp, clamp) ||
        math::IsNotEqualF(_curDepthBias.slope, slope)) {

        _curDepthBias.constant = constant;
        _curDepthBias.clamp = clamp;
        _curDepthBias.slope = slope;
        _isStateInvalid = true;
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
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    if (math::IsNotEqualF(_curDepthBounds.minBounds, minBounds) ||
        math::IsNotEqualF(_curDepthBounds.maxBounds, maxBounds)) {

        _curDepthBounds.minBounds = minBounds;
        _curDepthBounds.maxBounds = maxBounds;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setStencilWriteMask(StencilFace face, uint mask) {
    if ((_curStencilWriteMask.face != face) ||
        (_curStencilWriteMask.writeMask != mask)) {

        _curStencilWriteMask.face = face;
        _curStencilWriteMask.writeMask = mask;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    if ((_curStencilCompareMask.face != face) ||
        (_curStencilCompareMask.refrence != ref) ||
        (_curStencilCompareMask.compareMask != mask)) {

        _curStencilCompareMask.face = face;
        _curStencilCompareMask.refrence = ref;
        _curStencilCompareMask.compareMask = mask;
        _isStateInvalid = true;
    }
}

void GLES3CommandBuffer::draw(InputAssembler *ia) {
    if ((_type == CommandBufferType::PRIMARY && _isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        if (_isStateInvalid) {
            BindStates();
        }

        GLES3CmdDraw *cmd = _gles3Allocator->drawCmdPool.alloc();
        ((GLES3InputAssembler *)ia)->ExtractCmdDraw(cmd);
        _cmdPackage->drawCmds.push(cmd);
        _cmdPackage->cmds.push(GFXCmdType::DRAW);

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

void GLES3CommandBuffer::updateBuffer(Buffer *buff, void *data, uint size, uint offset) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES3GPUBuffer *gpuBuffer = ((GLES3Buffer *)buff)->gpuBuffer();
        if (gpuBuffer) {
            GLES3CmdUpdateBuffer *cmd = _gles3Allocator->updateBufferCmdPool.alloc();
            cmd->gpuBuffer = gpuBuffer;
            cmd->buffer = (uint8_t *)data;
            cmd->size = size;
            cmd->offset = offset;

            _cmdPackage->updateBufferCmds.push(cmd);
            _cmdPackage->cmds.push(GFXCmdType::UPDATE_BUFFER);
        }
    } else {
        CC_LOG_ERROR("Command 'updateBuffer' must be recorded outside a render pass.");
    }
}

void GLES3CommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES3GPUTexture *gpuTexture = ((GLES3Texture *)texture)->gpuTexture();
        if (gpuTexture) {
            GLES3CmdCopyBufferToTexture *cmd = _gles3Allocator->copyBufferToTextureCmdPool.alloc();
            cmd->gpuTexture = gpuTexture;
            cmd->gpuTexture = gpuTexture;
            cmd->buffers = buffers;
            cmd->regions = regions;
            cmd->count = count;

            _cmdPackage->copyBufferToTextureCmds.push(cmd);
            _cmdPackage->cmds.push(GFXCmdType::COPY_BUFFER_TO_TEXTURE);
        }
    } else {
        CC_LOG_ERROR("Command 'copyBuffersToTexture' must be recorded outside a render pass.");
    }
}

void GLES3CommandBuffer::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        GLES3CommandBuffer *cmdBuff = (GLES3CommandBuffer *)cmdBuffs[i];

        for (uint j = 0; j < cmdBuff->_cmdPackage->beginRenderPassCmds.size(); ++j) {
            GLES3CmdBeginRenderPass *cmd = cmdBuff->_cmdPackage->beginRenderPassCmds[j];
            ++cmd->refCount;
            _cmdPackage->beginRenderPassCmds.push(cmd);
        }
        for (uint j = 0; j < cmdBuff->_cmdPackage->bindStatesCmds.size(); ++j) {
            GLES3CmdBindStates *cmd = cmdBuff->_cmdPackage->bindStatesCmds[j];
            ++cmd->refCount;
            _cmdPackage->bindStatesCmds.push(cmd);
        }
        for (uint j = 0; j < cmdBuff->_cmdPackage->drawCmds.size(); ++j) {
            GLES3CmdDraw *cmd = cmdBuff->_cmdPackage->drawCmds[j];
            ++cmd->refCount;
            _cmdPackage->drawCmds.push(cmd);
        }
        for (uint j = 0; j < cmdBuff->_cmdPackage->updateBufferCmds.size(); ++j) {
            GLES3CmdUpdateBuffer *cmd = cmdBuff->_cmdPackage->updateBufferCmds[j];
            ++cmd->refCount;
            _cmdPackage->updateBufferCmds.push(cmd);
        }
        for (uint j = 0; j < cmdBuff->_cmdPackage->copyBufferToTextureCmds.size(); ++j) {
            GLES3CmdCopyBufferToTexture *cmd = cmdBuff->_cmdPackage->copyBufferToTextureCmds[j];
            ++cmd->refCount;
            _cmdPackage->copyBufferToTextureCmds.push(cmd);
        }
        _cmdPackage->cmds.concat(cmdBuff->_cmdPackage->cmds);

        _numDrawCalls += cmdBuff->getNumDrawCalls();
        _numInstances += cmdBuff->getNumInstances();
        _numTriangles += cmdBuff->getNumTris();
    }
}

void GLES3CommandBuffer::BindStates() {
    GLES3CmdBindStates *cmd = _gles3Allocator->bindStatesCmdPool.alloc();
    cmd->gpuPipelineState = _curGPUPipelineState;
    cmd->gpuInputAssembler = _curGPUInputAssember;
    cmd->gpuDescriptorSets = _curGPUDescriptorSets;
    for (size_t i = 0u; i < _curDynamicOffsets.size(); i++) {
        cmd->dynamicOffsets.insert(cmd->dynamicOffsets.end(), _curDynamicOffsets[i].begin(), _curDynamicOffsets[i].end());
    }
    cmd->viewport = _curViewport;
    cmd->scissor = _curScissor;
    cmd->lineWidth = _curLineWidth;
    cmd->depthBias = _curDepthBias;
    cmd->blendConstants.x = _curBlendConstants.x;
    cmd->blendConstants.y = _curBlendConstants.y;
    cmd->blendConstants.z = _curBlendConstants.z;
    cmd->blendConstants.w = _curBlendConstants.w;
    cmd->depthBounds = _curDepthBounds;
    cmd->stencilWriteMask = _curStencilWriteMask;
    cmd->stencilCompareMask = _curStencilCompareMask;

    _cmdPackage->bindStatesCmds.push(cmd);
    _cmdPackage->cmds.push(GFXCmdType::BIND_STATES);
    _isStateInvalid = false;
}

} // namespace gfx
} // namespace cc
