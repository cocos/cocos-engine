#include "GLES2Std.h"
#include "GLES2CommandBuffer.h"
#include "GLES2CommandAllocator.h"
#include "GLES2Framebuffer.h"
#include "GLES2PipelineState.h"
#include "GLES2BindingLayout.h"
#include "GLES2InputAssembler.h"
#include "GLES2Buffer.h"
#include "GLES2Texture.h"

namespace cc {

GLES2CommandBuffer::GLES2CommandBuffer(GFXDevice *device)
: GFXCommandBuffer(device) {
}

GLES2CommandBuffer::~GLES2CommandBuffer() {
}

bool GLES2CommandBuffer::initialize(const GFXCommandBufferInfo &info) {

    if (!info.allocator) {
        return false;
    }

    _allocator = info.allocator;
    _gles2Allocator = (GLES2CommandAllocator *)info.allocator;
    _type = info.type;

    _cmdPackage = CC_NEW(GLES2CmdPackage);
    _status = GFXStatus::SUCCESS;

    return true;
}

void GLES2CommandBuffer::destroy() {
    if (_gles2Allocator) {
        _gles2Allocator->clearCmds(_cmdPackage);
        _gles2Allocator = nullptr;
    }
    _allocator = nullptr;
    _status = GFXStatus::UNREADY;

    CC_SAFE_DELETE(_cmdPackage);
}

void GLES2CommandBuffer::begin(GFXRenderPass *renderPass, uint subpass, GFXFramebuffer *frameBuffer) {
    _gles2Allocator->clearCmds(_cmdPackage);
    _curGPUPipelineState = nullptr;
    _curGPUBlendLayout = nullptr;
    _curGPUInputAssember = nullptr;
    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;
}

void GLES2CommandBuffer::end() {
    if (_isStateInvalid) {
        BindStates();
    }
    _isInRenderPass = false;
}

void GLES2CommandBuffer::beginRenderPass(GFXFramebuffer *fbo, const GFXRect &render_area, GFXClearFlags clear_flags, const std::vector<GFXColor> &colors, float depth, int stencil) {
    _isInRenderPass = true;

    GLES2CmdBeginRenderPass *cmd = _gles2Allocator->beginRenderPassCmdPool.alloc();
    cmd->gpuFBO = ((GLES2Framebuffer *)fbo)->gpuFBO();
    cmd->render_area = render_area;
    cmd->clear_flags = clear_flags;
    cmd->num_clear_colors = (uint32_t)colors.size();
    for (uint i = 0; i < colors.size(); ++i) {
        cmd->clear_colors[i] = colors[i];
    }
    cmd->clear_depth = depth;
    cmd->clear_stencil = stencil;
    _cmdPackage->beginRenderPassCmds.push(cmd);
    _cmdPackage->cmds.push(GFXCmdType::BEGIN_RENDER_PASS);
}

void GLES2CommandBuffer::endRenderPass() {
    _isInRenderPass = false;
    _cmdPackage->cmds.push(GFXCmdType::END_RENDER_PASS);
}

void GLES2CommandBuffer::bindPipelineState(GFXPipelineState *pso) {
    _curGPUPipelineState = ((GLES2PipelineState *)pso)->gpuPipelineState();
    _isStateInvalid = true;
}

void GLES2CommandBuffer::bindBindingLayout(GFXBindingLayout *layout) {
    _curGPUBlendLayout = ((GLES2BindingLayout *)layout)->gpuBindingLayout();
    _isStateInvalid = true;
}

void GLES2CommandBuffer::bindInputAssembler(GFXInputAssembler *ia) {
    _curGPUInputAssember = ((GLES2InputAssembler *)ia)->gpuInputAssembler();
    _isStateInvalid = true;
}

void GLES2CommandBuffer::setViewport(const GFXViewport &vp) {

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

void GLES2CommandBuffer::setScissor(const GFXRect &rect) {
    if ((_curScissor.x != rect.x) ||
        (_curScissor.y != rect.y) ||
        (_curScissor.width != rect.width) ||
        (_curScissor.height != rect.height)) {
        _curScissor = rect;
        _isStateInvalid = true;
    }
}

void GLES2CommandBuffer::setLineWidth(const float width) {
    if (math::IsNotEqualF(_curLineWidth, width)) {
        _curLineWidth = width;
        _isStateInvalid = true;
    }
}

void GLES2CommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    if (math::IsNotEqualF(_curDepthBias.constant, constant) ||
        math::IsNotEqualF(_curDepthBias.clamp, clamp) ||
        math::IsNotEqualF(_curDepthBias.slope, slope)) {
        _curDepthBias.constant = constant;
        _curDepthBias.clamp = clamp;
        _curDepthBias.slope = slope;
        _isStateInvalid = true;
    }
}

void GLES2CommandBuffer::setBlendConstants(const GFXColor &constants) {
    if (math::IsNotEqualF(_curBlendConstants.r, constants.r) ||
        math::IsNotEqualF(_curBlendConstants.g, constants.g) ||
        math::IsNotEqualF(_curBlendConstants.b, constants.b) ||
        math::IsNotEqualF(_curBlendConstants.a, constants.a)) {
        _curBlendConstants.r = constants.r;
        _curBlendConstants.g = constants.g;
        _curBlendConstants.b = constants.b;
        _curBlendConstants.a = constants.a;
        _isStateInvalid = true;
    }
}

void GLES2CommandBuffer::setDepthBound(float min_bounds, float max_bounds) {
    if (math::IsNotEqualF(_curDepthBounds.min_bounds, min_bounds) ||
        math::IsNotEqualF(_curDepthBounds.max_bounds, max_bounds)) {
        _curDepthBounds.min_bounds = min_bounds;
        _curDepthBounds.max_bounds = max_bounds;
        _isStateInvalid = true;
    }
}

void GLES2CommandBuffer::setStencilWriteMask(GFXStencilFace face, uint mask) {
    if ((_curStencilWriteMask.face != face) ||
        (_curStencilWriteMask.write_mask != mask)) {
        _curStencilWriteMask.face = face;
        _curStencilWriteMask.write_mask = mask;
        _isStateInvalid = true;
    }
}

void GLES2CommandBuffer::setStencilCompareMask(GFXStencilFace face, int ref, uint mask) {
    if ((_curStencilCompareMask.face != face) ||
        (_curStencilCompareMask.refrence != ref) ||
        (_curStencilCompareMask.compare_mask != mask)) {
        _curStencilCompareMask.face = face;
        _curStencilCompareMask.refrence = ref;
        _curStencilCompareMask.compare_mask = mask;
        _isStateInvalid = true;
    }
}

void GLES2CommandBuffer::draw(GFXInputAssembler *ia) {
    if ((_type == GFXCommandBufferType::PRIMARY && _isInRenderPass) ||
        (_type == GFXCommandBufferType::SECONDARY)) {
        if (_isStateInvalid) {
            BindStates();
        }

        GLES2CmdDraw *cmd = _gles2Allocator->drawCmdPool.alloc();
        ((GLES2InputAssembler *)ia)->ExtractCmdDraw(cmd);
        _cmdPackage->drawCmds.push(cmd);
        _cmdPackage->cmds.push(GFXCmdType::DRAW);

        ++_numDrawCalls;
        _numInstances += ia->getInstanceCount();
        if (_curGPUPipelineState) {
            switch (_curGPUPipelineState->glPrimitive) {
                case GL_TRIANGLES: {
                    if (ia->getIndexBuffer() == nullptr) {
                        _numTriangles += ia->getVertexCount() / 3 * std::max(ia->getInstanceCount(), 1U);
                    } else {
                        _numTriangles += ia->getIndexCount() / 3 * std::max(ia->getInstanceCount(), 1U);
                    }
                    break;
                }
                case GL_TRIANGLE_STRIP:
                case GL_TRIANGLE_FAN: {
                    _numTriangles += (ia->getVertexCount() - 2) * std::max(ia->getInstanceCount(), 1U);
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

void GLES2CommandBuffer::updateBuffer(GFXBuffer *buff, void *data, uint size, uint offset) {
    if ((_type == GFXCommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == GFXCommandBufferType::SECONDARY)) {
        GLES2GPUBuffer *gpuBuffer = ((GLES2Buffer *)buff)->gpuBuffer();
        if (gpuBuffer) {
            GLES2CmdUpdateBuffer *cmd = _gles2Allocator->updateBufferCmdPool.alloc();
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

void GLES2CommandBuffer::copyBufferToTexture(GFXBuffer *src, GFXTexture *dst, GFXTextureLayout layout, const GFXBufferTextureCopyList &regions) {
    if ((_type == GFXCommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == GFXCommandBufferType::SECONDARY)) {
        GLES2GPUBuffer *gpuBuffer = ((GLES2Buffer *)src)->gpuBuffer();
        GLES2GPUTexture *gpuTexture = ((GLES2Texture *)dst)->gpuTexture();
        if (gpuBuffer && gpuTexture) {
            GLES2CmdCopyBufferToTexture *cmd = _gles2Allocator->copyBufferToTextureCmdPool.alloc();
            cmd->gpuBuffer = gpuBuffer;
            cmd->gpuTexture = gpuTexture;
            cmd->dst_layout = layout;
            cmd->regions.resize(regions.size());
            for (uint i = 0; i < static_cast<uint>(regions.size()); ++i) {
                cmd->regions[i] = regions[i];
            }

            _cmdPackage->copyBufferToTextureCmds.push(cmd);
            _cmdPackage->cmds.push(GFXCmdType::COPY_BUFFER_TO_TEXTURE);
        }
    } else {
        CC_LOG_ERROR("Command 'copyBufferToTexture' must be recorded outside a render pass.");
    }
}

void GLES2CommandBuffer::execute(const std::vector<GFXCommandBuffer *> &cmd_buffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        GLES2CommandBuffer *cmd_buff = (GLES2CommandBuffer *)cmd_buffs[i];

        for (uint j = 0; j < cmd_buff->_cmdPackage->beginRenderPassCmds.size(); ++j) {
            GLES2CmdBeginRenderPass *cmd = cmd_buff->_cmdPackage->beginRenderPassCmds[j];
            ++cmd->ref_count;
            _cmdPackage->beginRenderPassCmds.push(cmd);
        }
        for (uint j = 0; j < cmd_buff->_cmdPackage->bindStatesCmds.size(); ++j) {
            GLES2CmdBindStates *cmd = cmd_buff->_cmdPackage->bindStatesCmds[j];
            ++cmd->ref_count;
            _cmdPackage->bindStatesCmds.push(cmd);
        }
        for (uint j = 0; j < cmd_buff->_cmdPackage->drawCmds.size(); ++j) {
            GLES2CmdDraw *cmd = cmd_buff->_cmdPackage->drawCmds[j];
            ++cmd->ref_count;
            _cmdPackage->drawCmds.push(cmd);
        }
        for (uint j = 0; j < cmd_buff->_cmdPackage->updateBufferCmds.size(); ++j) {
            GLES2CmdUpdateBuffer *cmd = cmd_buff->_cmdPackage->updateBufferCmds[j];
            ++cmd->ref_count;
            _cmdPackage->updateBufferCmds.push(cmd);
        }
        for (uint j = 0; j < cmd_buff->_cmdPackage->copyBufferToTextureCmds.size(); ++j) {
            GLES2CmdCopyBufferToTexture *cmd = cmd_buff->_cmdPackage->copyBufferToTextureCmds[j];
            ++cmd->ref_count;
            _cmdPackage->copyBufferToTextureCmds.push(cmd);
        }
        _cmdPackage->cmds.concat(cmd_buff->_cmdPackage->cmds);

        _numDrawCalls += cmd_buff->getNumDrawCalls();
        _numInstances += cmd_buff->getNumInstances();
        _numTriangles += cmd_buff->getNumTris();
    }
}

void GLES2CommandBuffer::BindStates() {
    GLES2CmdBindStates *cmd = _gles2Allocator->bindStatesCmdPool.alloc();
    cmd->gpuPipelineState = _curGPUPipelineState;
    cmd->gpuBindingLayout = _curGPUBlendLayout;
    cmd->gpuInputAssembler = _curGPUInputAssember;
    cmd->viewport = _curViewport;
    cmd->scissor = _curScissor;
    cmd->lineWidth = _curLineWidth;
    cmd->depthBias = _curDepthBias;
    cmd->blendConstants.r = _curBlendConstants.r;
    cmd->blendConstants.g = _curBlendConstants.g;
    cmd->blendConstants.b = _curBlendConstants.b;
    cmd->blendConstants.a = _curBlendConstants.a;
    cmd->depthBounds = _curDepthBounds;
    cmd->stencilWriteMask = _curStencilWriteMask;
    cmd->stencilCompareMask = _curStencilCompareMask;

    _cmdPackage->bindStatesCmds.push(cmd);
    _cmdPackage->cmds.push(GFXCmdType::BIND_STATES);
    _isStateInvalid = false;
}

}
