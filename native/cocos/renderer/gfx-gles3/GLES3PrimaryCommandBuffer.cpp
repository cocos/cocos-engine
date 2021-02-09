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
#include "GLES3DescriptorSet.h"
#include "GLES3Device.h"
#include "GLES3Framebuffer.h"
#include "GLES3GlobalBarrier.h"
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

void GLES3PrimaryCommandBuffer::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    _curGPUPipelineState = nullptr;
    _curGPUInputAssember = nullptr;
    _curGPUDescriptorSets.assign(_curGPUDescriptorSets.size(), nullptr);

    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;
}

void GLES3PrimaryCommandBuffer::end() {
    if (_isStateInvalid) {
        BindStates();
    }
    _isInRenderPass = false;
}

void GLES3PrimaryCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const *secondaryCBs, uint secondaryCBCount) {
    _isInRenderPass                     = true;
    GLES3GPURenderPass * gpuRenderPass  = ((GLES3RenderPass *)renderPass)->gpuRenderPass();
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
            BindStates();
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

void GLES3PrimaryCommandBuffer::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint count, Filter filter) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        GLES3GPUTexture *gpuTextureSrc = nullptr;
        GLES3GPUTexture *gpuTextureDst = nullptr;
        if (srcTexture) gpuTextureSrc = ((GLES3Texture *)srcTexture)->gpuTexture();
        if (dstTexture) gpuTextureDst = ((GLES3Texture *)dstTexture)->gpuTexture();

        GLES3CmdFuncBlitTexture((GLES3Device *)_device, gpuTextureSrc, gpuTextureDst, regions, count, filter);
    } else {
        CC_LOG_ERROR("Command 'blitTexture' must be recorded outside a render pass.");
    }
}

void GLES3PrimaryCommandBuffer::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        GLES3PrimaryCommandBuffer *cmdBuff = (GLES3PrimaryCommandBuffer *)cmdBuffs[i];

        if (!cmdBuff->_pendingPackages.empty()) {
            GLES3CmdPackage *cmdPackage = cmdBuff->_pendingPackages.front();

            GLES3CmdFuncExecuteCmds((GLES3Device *)_device, cmdPackage);

            cmdBuff->_pendingPackages.pop();
            cmdBuff->_freePackages.push(cmdPackage);
            cmdBuff->_cmdAllocator->clearCmds(cmdPackage);
            cmdBuff->_cmdAllocator->reset();
        }

        _numDrawCalls += cmdBuff->_numDrawCalls;
        _numInstances += cmdBuff->_numInstances;
        _numTriangles += cmdBuff->_numTriangles;
    }
}

void GLES3PrimaryCommandBuffer::BindStates() {
    vector<uint> &dynamicOffsetOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsetOffsets;
    vector<uint> &dynamicOffsets       = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsets;
    for (size_t i = 0u; i < _curDynamicOffsets.size(); i++) {
        size_t count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
        //CCASSERT(_curDynamicOffsets[i].size() >= count, "missing dynamic offsets?");
        count = std::min(count, _curDynamicOffsets[i].size());
        if (count) memcpy(&dynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsets[i].data(), count * sizeof(uint));
    }
    GLES3CmdFuncBindState((GLES3Device *)_device, _curGPUPipelineState, _curGPUInputAssember, _curGPUDescriptorSets, dynamicOffsets,
                          _curViewport, _curScissor, _curLineWidth, false, _curDepthBias, _curBlendConstants, _curDepthBounds, _curStencilWriteMask, _curStencilCompareMask);

    _isStateInvalid = false;
}

void GLES3PrimaryCommandBuffer::dispatch(const DispatchInfo &info) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {

        if (_isStateInvalid) {
            BindStates();
        }

        GLES3GPUDispatchInfo gpuInfo;
        if (info.indirectBuffer) {
            gpuInfo.indirectBuffer = ((GLES3Buffer *)info.indirectBuffer)->gpuBuffer();
            gpuInfo.indirectOffset = info.indirectOffset;
        } else {
            gpuInfo.groupCountX = info.groupCountX;
            gpuInfo.groupCountY = info.groupCountY;
            gpuInfo.groupCountZ = info.groupCountZ;
        }
        GLES3CmdFuncDispatch((GLES3Device *)_device, gpuInfo);
    } else {
        CC_LOG_ERROR("Command 'dispatch' must be recorded outside a render pass.");
    }
}

void GLES3PrimaryCommandBuffer::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint textureBarrierCount) {
    if ((_type == CommandBufferType::PRIMARY && !_isInRenderPass) ||
        (_type == CommandBufferType::SECONDARY)) {
        if (!barrier) return;

        const GLES3GPUGlobalBarrier *gpuBarrier = ((GLES3GlobalBarrier *)barrier)->gpuBarrier();
        GLES3CmdFuncMemoryBarrier((GLES3Device *)_device, gpuBarrier->glBarriers, gpuBarrier->glBarriersByRegion);
    } else {
        CC_LOG_ERROR("Command 'pipelineBarrier' must be recorded outside a render pass.");
    }
}

} // namespace gfx
} // namespace cc
