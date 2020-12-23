#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3DescriptorSet.h"
#include "GLES3Device.h"
#include "GLES3Framebuffer.h"
#include "GLES3InputAssembler.h"
#include "GLES3PipelineState.h"
#include "GLES3PrimaryCommandBuffer.h"
#include "GLES3RenderPass.h"
#include "GLES3Texture.h"

namespace cc {
namespace gfx {

GLES3PrimaryCommandBuffer::GLES3PrimaryCommandBuffer(Device *device)
: GLES3CommandBuffer(device) {
}

GLES3PrimaryCommandBuffer::~GLES3PrimaryCommandBuffer() {
}

void GLES3PrimaryCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, bool fromSecondaryCB) {
    _isInRenderPass = true;
    GLES3GPURenderPass *gpuRenderPass = ((GLES3RenderPass *)renderPass)->gpuRenderPass();
    GLES3GPUFramebuffer *gpuFramebuffer = ((GLES3Framebuffer *)fbo)->gpuFBO();

    GLES3CmdFuncBeginRenderPass((GLES3Device *)_device, gpuRenderPass, gpuFramebuffer,
                                renderArea, gpuRenderPass->colorAttachments.size(), colors, depth, stencil);
}

void GLES3PrimaryCommandBuffer::endRenderPass() {
    GLES3CmdFuncEndRenderPass((GLES3Device *)_device);
    _isInRenderPass = false;
}

void GLES3PrimaryCommandBuffer::draw(InputAssembler *ia) {
    if ((_type == CommandBufferType::PRIMARY && _isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        if (_isStateInvalid) {
            vector<uint> &dynamicOffsetOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsetOffsets;
            vector<uint> &dynamicOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsets;
            for (size_t i = 0u; i < _curDynamicOffsets.size(); i++) {
                uint count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
                memcpy(&dynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsets[i].data(), count * sizeof(uint));
            }
            GLES3CmdFuncBindState((GLES3Device *)_device, _curGPUPipelineState, _curGPUInputAssember, _curGPUDescriptorSets, dynamicOffsets,
                                  _curViewport, _curScissor, _curLineWidth, false, _curDepthBias, _curBlendConstants, _curDepthBounds, _curStencilWriteMask, _curStencilCompareMask);

            _isStateInvalid = false;
        }

        DrawInfo drawInfo;
        ia->extractDrawInfo(drawInfo);
        GLES3CmdFuncDraw((GLES3Device *)_device, drawInfo);

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

void GLES3PrimaryCommandBuffer::updateBuffer(Buffer *buff, const void *data, uint size) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES3GPUBuffer *gpuBuffer = ((GLES3Buffer *)buff)->gpuBuffer();
        if (gpuBuffer) {
            GLES3CmdFuncUpdateBuffer((GLES3Device *)_device, gpuBuffer, data, 0u, size);
        }
    } else {
        CC_LOG_ERROR("Command 'updateBuffer' must be recorded outside a render pass.");
    }
}

void GLES3PrimaryCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES3GPUTexture *gpuTexture = ((GLES3Texture *)texture)->gpuTexture();
        if (gpuTexture) {
            GLES3CmdFuncCopyBuffersToTexture((GLES3Device *)_device, buffers, gpuTexture, regions, count);
        }
    } else {
        CC_LOG_ERROR("Command 'copyBuffersToTexture' must be recorded outside a render pass.");
    }
}

void GLES3PrimaryCommandBuffer::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        GLES3PrimaryCommandBuffer *cmdBuff = (GLES3PrimaryCommandBuffer *)cmdBuffs[i];
        GLES3CmdPackage *cmdPackage = cmdBuff->_pendingPackages.front();

        GLES3CmdFuncExecuteCmds((GLES3Device *)_device, cmdPackage);

        _numDrawCalls += cmdBuff->_numDrawCalls;
        _numInstances += cmdBuff->_numInstances;
        _numTriangles += cmdBuff->_numTriangles;

        cmdBuff->_pendingPackages.pop();
        cmdBuff->_freePackages.push(cmdPackage);
    }
}

} // namespace gfx
} // namespace cc
