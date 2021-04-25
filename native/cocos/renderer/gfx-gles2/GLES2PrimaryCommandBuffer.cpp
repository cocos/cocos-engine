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

GLES2PrimaryCommandBuffer::~GLES2PrimaryCommandBuffer() {
    destroy();
}

void GLES2PrimaryCommandBuffer::begin(RenderPass * /*renderPass*/, uint /*subpass*/, Framebuffer * /*frameBuffer*/) {
    _curGPUPipelineState = nullptr;
    _curGPUInputAssember = nullptr;
    _curGPUDescriptorSets.assign(_curGPUDescriptorSets.size(), nullptr);

    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;
}

void GLES2PrimaryCommandBuffer::end() {
    if (_isStateInvalid) {
        bindStates();
    }
    _isInRenderPass = false;
}

void GLES2PrimaryCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const * /*secondaryCBs*/, uint /*secondaryCBCount*/) {
    _isInRenderPass                     = true;
    GLES2GPURenderPass * gpuRenderPass  = static_cast<GLES2RenderPass *>(renderPass)->gpuRenderPass();
    GLES2GPUFramebuffer *gpuFramebuffer = static_cast<GLES2Framebuffer *>(fbo)->gpuFBO();

    cmdFuncGLES2BeginRenderPass(GLES2Device::getInstance(), gpuRenderPass, gpuFramebuffer,
                                renderArea, gpuRenderPass->colorAttachments.size(), colors, depth, stencil);
}

void GLES2PrimaryCommandBuffer::endRenderPass() {
    cmdFuncGLES2EndRenderPass(GLES2Device::getInstance());
    _isInRenderPass = false;
}

void GLES2PrimaryCommandBuffer::draw(const DrawInfo &info) {
    if (_isStateInvalid) {
        vector<uint> &dynamicOffsetOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsetOffsets;
        vector<uint> &dynamicOffsets       = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsets;
        for (size_t i = 0U; i < _curDynamicOffsets.size(); i++) {
            size_t count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
            //CCASSERT(_curDynamicOffsets[i].size() >= count, "missing dynamic offsets?");
            count = std::min(count, _curDynamicOffsets[i].size());
            if (count) memcpy(&dynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsets[i].data(), count * sizeof(uint));
        }
        cmdFuncGLES2BindState(GLES2Device::getInstance(), _curGPUPipelineState, _curGPUInputAssember, _curGPUDescriptorSets, dynamicOffsets,
                              _curViewport, _curScissor, _curLineWidth, false, _curDepthBias, _curBlendConstants, _curDepthBounds, _curStencilWriteMask, _curStencilCompareMask);

        _isStateInvalid = false;
    }

    cmdFuncGLES2Draw(GLES2Device::getInstance(), info);

    ++_numDrawCalls;
    _numInstances += info.instanceCount;
    uint indexCount = info.indexCount ? info.indexCount : info.vertexCount;
    if (_curGPUPipelineState) {
        switch (_curGPUPipelineState->glPrimitive) {
            case GL_TRIANGLES: {
                _numTriangles += indexCount / 3 * std::max(info.instanceCount, 1U);
                break;
            }
            case GL_TRIANGLE_STRIP:
            case GL_TRIANGLE_FAN: {
                _numTriangles += (indexCount - 2) * std::max(info.instanceCount, 1U);
                break;
            }
            default:
                break;
        }
    }
}

void GLES2PrimaryCommandBuffer::updateBuffer(Buffer *buff, const void *data, uint size) {
    GLES2GPUBuffer *gpuBuffer = static_cast<GLES2Buffer *>(buff)->gpuBuffer();
    if (gpuBuffer) {
        cmdFuncGLES2UpdateBuffer(GLES2Device::getInstance(), gpuBuffer, data, 0U, size);
    }
}

void GLES2PrimaryCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    GLES2GPUTexture *gpuTexture = static_cast<GLES2Texture *>(texture)->gpuTexture();
    if (gpuTexture) {
        cmdFuncGLES2CopyBuffersToTexture(GLES2Device::getInstance(), buffers, gpuTexture, regions, count);
    }
}

void GLES2PrimaryCommandBuffer::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        auto *cmdBuff = static_cast<GLES2PrimaryCommandBuffer *>(cmdBuffs[i]);

        if (!cmdBuff->_pendingPackages.empty()) {
            GLES2CmdPackage *cmdPackage = cmdBuff->_pendingPackages.front();

            cmdFuncGLES2ExecuteCmds(GLES2Device::getInstance(), cmdPackage);

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

void GLES2PrimaryCommandBuffer::bindStates() {
    if (_curGPUPipelineState) {
        vector<uint> &dynamicOffsetOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsetOffsets;
        vector<uint> &dynamicOffsets       = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsets;
        for (size_t i = 0U; i < _curDynamicOffsets.size(); i++) {
            size_t count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
            //CCASSERT(_curDynamicOffsets[i].size() >= count, "missing dynamic offsets?");
            count = std::min(count, _curDynamicOffsets[i].size());
            if (count) memcpy(&dynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsets[i].data(), count * sizeof(uint));
        }
        cmdFuncGLES2BindState(GLES2Device::getInstance(), _curGPUPipelineState, _curGPUInputAssember, _curGPUDescriptorSets, dynamicOffsets,
                              _curViewport, _curScissor, _curLineWidth, false, _curDepthBias, _curBlendConstants, _curDepthBounds, _curStencilWriteMask, _curStencilCompareMask);
    }
    _isStateInvalid = false;
}

} // namespace gfx
} // namespace cc
