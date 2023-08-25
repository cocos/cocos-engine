/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
#include "GLES2Commands.h"
#include "GLES2DescriptorSet.h"
#include "GLES2Device.h"
#include "GLES2Framebuffer.h"
#include "GLES2InputAssembler.h"
#include "GLES2PipelineState.h"
#include "GLES2PrimaryCommandBuffer.h"
#include "GLES2RenderPass.h"
#include "GLES2Texture.h"
#include "profiler/Profiler.h"

namespace cc {
namespace gfx {

GLES2PrimaryCommandBuffer::~GLES2PrimaryCommandBuffer() {
    destroy();
}

void GLES2PrimaryCommandBuffer::begin(RenderPass * /*renderPass*/, uint32_t /*subpass*/, Framebuffer * /*frameBuffer*/) {
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
}

void GLES2PrimaryCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil, CommandBuffer *const * /*secondaryCBs*/, uint32_t /*secondaryCBCount*/) {
    _curSubpassIdx = 0U;

    GLES2GPURenderPass *gpuRenderPass = static_cast<GLES2RenderPass *>(renderPass)->gpuRenderPass();
    GLES2GPUFramebuffer *gpuFramebuffer = static_cast<GLES2Framebuffer *>(fbo)->gpuFBO();

    cmdFuncGLES2BeginRenderPass(GLES2Device::getInstance(), _curSubpassIdx, gpuRenderPass, gpuFramebuffer,
                                &renderArea, colors, depth, stencil);
    _curDynamicStates.viewport = {renderArea.x, renderArea.y, renderArea.width, renderArea.height};
    _curDynamicStates.scissor = renderArea;
}

void GLES2PrimaryCommandBuffer::endRenderPass() {
    cmdFuncGLES2EndRenderPass(GLES2Device::getInstance());
}

void GLES2PrimaryCommandBuffer::nextSubpass() {
    cmdFuncGLES2EndRenderPass(GLES2Device::getInstance());
    cmdFuncGLES2BeginRenderPass(GLES2Device::getInstance(), ++_curSubpassIdx);
}

void GLES2PrimaryCommandBuffer::insertMarker(const MarkerInfo &marker) {
    cmdFuncGLES2InsertMarker(GLES2Device::getInstance(), marker.name.size(), marker.name.data());
}

void GLES2PrimaryCommandBuffer::beginMarker(const MarkerInfo &marker) {
    cmdFuncGLES2PushGroupMarker(GLES2Device::getInstance(), marker.name.size(), marker.name.data());
}

void GLES2PrimaryCommandBuffer::endMarker() {
    cmdFuncGLES2PopGroupMarker(GLES2Device::getInstance());
}

void GLES2PrimaryCommandBuffer::draw(const DrawInfo &info) {
    CC_PROFILE(GLES2PrimaryCommandBufferDraw);
    if (_isStateInvalid) {
        ccstd::vector<uint32_t> &dynamicOffsetOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsetOffsets;
        ccstd::vector<uint32_t> &dynamicOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsets;
        for (size_t i = 0U; i < _curDynamicOffsets.size(); i++) {
            size_t count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
            // CC_ASSERT(_curDynamicOffsets[i].size() >= count);
            count = std::min(count, _curDynamicOffsets[i].size());
            if (count) memcpy(&dynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsets[i].data(), count * sizeof(uint32_t));
        }
        cmdFuncGLES2BindState(GLES2Device::getInstance(), _curGPUPipelineState, _curGPUInputAssember,
                              _curGPUDescriptorSets.data(), dynamicOffsets.data(), &_curDynamicStates);

        _isStateInvalid = false;
    }

    cmdFuncGLES2Draw(GLES2Device::getInstance(), info);

    ++_numDrawCalls;
    _numInstances += info.instanceCount;
    uint32_t indexCount = info.indexCount ? info.indexCount : info.vertexCount;
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

void GLES2PrimaryCommandBuffer::setViewport(const Viewport &vp) {
    auto *cache = GLES2Device::getInstance()->stateCache();
    if (cache->viewport != vp) {
        cache->viewport = vp;
        GL_CHECK(glViewport(vp.left, vp.top, vp.width, vp.height));
    }
}

void GLES2PrimaryCommandBuffer::setScissor(const Rect &rect) {
    auto *cache = GLES2Device::getInstance()->stateCache();
    if (cache->scissor != rect) {
        cache->scissor = rect;
        GL_CHECK(glScissor(rect.x, rect.y, rect.width, rect.height));
    }
}

void GLES2PrimaryCommandBuffer::updateBuffer(Buffer *buff, const void *data, uint32_t size) {
    GLES2GPUBuffer *gpuBuffer = static_cast<GLES2Buffer *>(buff)->gpuBuffer();
    if (gpuBuffer) {
        cmdFuncGLES2UpdateBuffer(GLES2Device::getInstance(), gpuBuffer, data, 0U, size);
    }
}

void GLES2PrimaryCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) {
    GLES2GPUTexture *gpuTexture = static_cast<GLES2Texture *>(texture)->gpuTexture();
    if (gpuTexture) {
        cmdFuncGLES2CopyBuffersToTexture(GLES2Device::getInstance(), buffers, gpuTexture, regions, count);
    }
}

void GLES2PrimaryCommandBuffer::resolveTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) {
    copyTexture(srcTexture, dstTexture, regions, count);
}

void GLES2PrimaryCommandBuffer::copyTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) {
    GLES2GPUTexture *gpuTextureSrc = nullptr;
    GLES2GPUTexture *gpuTextureDst = nullptr;
    if (srcTexture) gpuTextureSrc = static_cast<GLES2Texture *>(srcTexture)->gpuTexture();
    if (dstTexture) gpuTextureDst = static_cast<GLES2Texture *>(dstTexture)->gpuTexture();
    ccstd::vector<TextureBlit> blitRegions(count);
    for (uint32_t i = 0; i < count; ++i) {
        auto &blit = blitRegions[i];
        const auto &copy = regions[i];

        blit.srcSubres = copy.srcSubres;
        blit.dstSubres = copy.dstSubres;

        blit.srcOffset = copy.srcOffset;
        blit.dstOffset = copy.dstOffset;

        blit.srcExtent = copy.extent;
        blit.dstExtent = copy.extent;
    }
    cmdFuncGLES2BlitTexture(GLES2Device::getInstance(), gpuTextureSrc, gpuTextureDst, blitRegions.data(), count, Filter::POINT);
}

void GLES2PrimaryCommandBuffer::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) {
    GLES2GPUTexture *gpuTextureSrc = nullptr;
    GLES2GPUTexture *gpuTextureDst = nullptr;
    if (srcTexture) gpuTextureSrc = static_cast<GLES2Texture *>(srcTexture)->gpuTexture();
    if (dstTexture) gpuTextureDst = static_cast<GLES2Texture *>(dstTexture)->gpuTexture();

    cmdFuncGLES2BlitTexture(GLES2Device::getInstance(), gpuTextureSrc, gpuTextureDst, regions, count, filter);
}

void GLES2PrimaryCommandBuffer::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    for (uint32_t i = 0; i < count; ++i) {
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
        ccstd::vector<uint32_t> &dynamicOffsetOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsetOffsets;
        ccstd::vector<uint32_t> &dynamicOffsets = _curGPUPipelineState->gpuPipelineLayout->dynamicOffsets;
        for (size_t i = 0U; i < _curDynamicOffsets.size(); i++) {
            size_t count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
            // CC_ASSERT(_curDynamicOffsets[i].size() >= count);
            count = std::min(count, _curDynamicOffsets[i].size());
            if (count) memcpy(&dynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsets[i].data(), count * sizeof(uint32_t));
        }
        cmdFuncGLES2BindState(GLES2Device::getInstance(), _curGPUPipelineState, _curGPUInputAssember, _curGPUDescriptorSets.data(), dynamicOffsets.data(), &_curDynamicStates);
    }
    _isStateInvalid = false;
}

} // namespace gfx
} // namespace cc
