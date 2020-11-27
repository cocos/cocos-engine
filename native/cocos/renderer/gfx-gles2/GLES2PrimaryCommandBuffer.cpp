#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2DescriptorSet.h"
#include "GLES2Device.h"
#include "GLES2Framebuffer.h"
#include "GLES2InputAssembler.h"
#include "GLES2PipelineState.h"
#include "GLES2PrimaryCommandBuffer.h"
#include "GLES2RenderPass.h"
#include "GLES2Texture.h"

namespace cc {
namespace gfx {

GLES2PrimaryCommandBuffer::GLES2PrimaryCommandBuffer(Device *device)
: GLES2CommandBuffer(device) {
}

GLES2PrimaryCommandBuffer::~GLES2PrimaryCommandBuffer() {
}

void GLES2PrimaryCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) {
    _isInRenderPass = true;
    GLES2GPURenderPass *gpuRenderPass = ((GLES2RenderPass *)renderPass)->gpuRenderPass();
    GLES2GPUFramebuffer *gpuFramebuffer = ((GLES2Framebuffer *)fbo)->gpuFBO();

    GLES2CmdFuncBeginRenderPass((GLES2Device *)_device, gpuRenderPass, gpuFramebuffer,
                                renderArea, gpuRenderPass->colorAttachments.size(), colors, depth, stencil);
}

void GLES2PrimaryCommandBuffer::endRenderPass() {
    GLES2CmdFuncEndRenderPass((GLES2Device *)_device);
    _isInRenderPass = false;
}

void GLES2PrimaryCommandBuffer::draw(InputAssembler *ia) {
    if ((_type == CommandBufferType::PRIMARY && _isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        if (_isStateInvalid) {
            GLES2CmdFuncBindState((GLES2Device *)_device, _curGPUPipelineState, _curGPUInputAssember, _curGPUDescriptorSets, _curDynamicOffsets,
                                  _curViewport, _curScissor, _curLineWidth, false, _curDepthBias, _curBlendConstants, _curDepthBounds, _curStencilWriteMask, _curStencilCompareMask);

            _isStateInvalid = false;
        }

        DrawInfo drawInfo;
        ia->extractDrawInfo(drawInfo);
        GLES2CmdFuncDraw((GLES2Device *)_device, drawInfo);

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

void GLES2PrimaryCommandBuffer::updateBuffer(Buffer *buff, const void *data, uint size, uint offset) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES2GPUBuffer *gpuBuffer = ((GLES2Buffer *)buff)->gpuBuffer();
        if (gpuBuffer) {
            GLES2CmdFuncUpdateBuffer((GLES2Device *)_device, gpuBuffer, data, offset, size);
        }
    } else {
        CC_LOG_ERROR("Command 'updateBuffer' must be recorded outside a render pass.");
    }
}

void GLES2PrimaryCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES2GPUTexture *gpuTexture = ((GLES2Texture *)texture)->gpuTexture();
        if (gpuTexture) {
            GLES2CmdFuncCopyBuffersToTexture((GLES2Device *)_device, buffers, gpuTexture, regions, count);
        }
    } else {
        CC_LOG_ERROR("Command 'copyBuffersToTexture' must be recorded outside a render pass.");
    }
}

void GLES2PrimaryCommandBuffer::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        GLES2PrimaryCommandBuffer *cmdBuff = (GLES2PrimaryCommandBuffer *)cmdBuffs[i];
        GLES2CmdFuncExecuteCmds((GLES2Device *)_device, cmdBuff->_cmdPackage);

        _numDrawCalls += cmdBuff->getNumDrawCalls();
        _numInstances += cmdBuff->getNumInstances();
        _numTriangles += cmdBuff->getNumTris();
    }
}

} // namespace gfx
} // namespace cc
