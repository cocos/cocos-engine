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

#pragma once

#include "GLES2GPUObjects.h"

namespace cc {
namespace gfx {

class GLES2Device;

class GLES2CmdBeginRenderPass final : public GLESCmd {
public:
    GLES2GPURenderPass *gpuRenderPass = nullptr;
    GLES2GPUFramebuffer *gpuFBO = nullptr;
    Rect renderArea;
    Color clearColors[MAX_ATTACHMENTS];
    float clearDepth = 1.0F;
    uint32_t clearStencil = 0;
    uint32_t subpassIdx = 0U;

    GLES2CmdBeginRenderPass() : GLESCmd(GLESCmdType::BEGIN_RENDER_PASS) {}

    void clear() override {
        gpuFBO = nullptr;
        gpuRenderPass = nullptr;
    }
};

class GLES2CmdBindStates final : public GLESCmd {
public:
    GLES2GPUPipelineState *gpuPipelineState = nullptr;
    GLES2GPUInputAssembler *gpuInputAssembler = nullptr;
    ccstd::vector<GLES2GPUDescriptorSet *> gpuDescriptorSets;
    ccstd::vector<uint32_t> dynamicOffsets;
    DynamicStates dynamicStates;

    GLES2CmdBindStates() : GLESCmd(GLESCmdType::BIND_STATES) {}

    void clear() override {
        gpuPipelineState = nullptr;
        gpuInputAssembler = nullptr;
        gpuDescriptorSets.clear();
        dynamicOffsets.clear();
    }
};

class GLES2CmdDraw final : public GLESCmd {
public:
    DrawInfo drawInfo;

    GLES2CmdDraw() : GLESCmd(GLESCmdType::DRAW) {}
    void clear() override {}
};

class GLES2CmdUpdateBuffer final : public GLESCmd {
public:
    GLES2GPUBuffer *gpuBuffer = nullptr;
    const uint8_t *buffer = nullptr;
    uint32_t size = 0;
    uint32_t offset = 0;

    GLES2CmdUpdateBuffer() : GLESCmd(GLESCmdType::UPDATE_BUFFER) {}

    void clear() override {
        gpuBuffer = nullptr;
        buffer = nullptr;
    }
};

class GLES2CmdCopyBufferToTexture final : public GLESCmd {
public:
    GLES2GPUTexture *gpuTexture = nullptr;
    const BufferTextureCopy *regions = nullptr;
    uint32_t count = 0U;
    const uint8_t *const *buffers = nullptr;

    GLES2CmdCopyBufferToTexture() : GLESCmd(GLESCmdType::COPY_BUFFER_TO_TEXTURE) {}

    void clear() override {
        gpuTexture = nullptr;
        regions = nullptr;
        count = 0U;
        buffers = nullptr;
    }
};

class GLES2CmdBlitTexture final : public GLESCmd {
public:
    GLES2GPUTexture *gpuTextureSrc = nullptr;
    GLES2GPUTexture *gpuTextureDst = nullptr;
    const TextureBlit *regions = nullptr;
    uint32_t count = 0U;
    Filter filter = Filter::POINT;

    GLES2CmdBlitTexture() : GLESCmd(GLESCmdType::BLIT_TEXTURE) {}

    void clear() override {
        gpuTextureSrc = nullptr;
        gpuTextureDst = nullptr;
        regions = nullptr;
        count = 0U;
    }
};

struct GLES2CmdPackage {
    CachedArray<GLESCmdType> cmds;
    CachedArray<GLES2CmdBeginRenderPass *> beginRenderPassCmds;
    CachedArray<GLES2CmdBindStates *> bindStatesCmds;
    CachedArray<GLES2CmdDraw *> drawCmds;
    CachedArray<GLES2CmdUpdateBuffer *> updateBufferCmds;
    CachedArray<GLES2CmdCopyBufferToTexture *> copyBufferToTextureCmds;
    CachedArray<GLES2CmdBlitTexture *> blitTextureCmds;
};

class GLES2GPUCommandAllocator final {
public:
    CommandPool<GLES2CmdBeginRenderPass> beginRenderPassCmdPool;
    CommandPool<GLES2CmdBindStates> bindStatesCmdPool;
    CommandPool<GLES2CmdDraw> drawCmdPool;
    CommandPool<GLES2CmdUpdateBuffer> updateBufferCmdPool;
    CommandPool<GLES2CmdCopyBufferToTexture> copyBufferToTextureCmdPool;
    CommandPool<GLES2CmdBlitTexture> blitTextureCmdPool;

    void clearCmds(GLES2CmdPackage *cmdPackage) {
        if (cmdPackage->beginRenderPassCmds.size()) {
            beginRenderPassCmdPool.freeCmds(cmdPackage->beginRenderPassCmds);
        }
        if (cmdPackage->bindStatesCmds.size()) {
            bindStatesCmdPool.freeCmds(cmdPackage->bindStatesCmds);
        }
        if (cmdPackage->drawCmds.size()) {
            drawCmdPool.freeCmds(cmdPackage->drawCmds);
        }
        if (cmdPackage->updateBufferCmds.size()) {
            updateBufferCmdPool.freeCmds(cmdPackage->updateBufferCmds);
        }
        if (cmdPackage->copyBufferToTextureCmds.size()) {
            copyBufferToTextureCmdPool.freeCmds(cmdPackage->copyBufferToTextureCmds);
        }
        if (cmdPackage->blitTextureCmds.size()) {
            blitTextureCmdPool.freeCmds(cmdPackage->blitTextureCmds);
        }

        cmdPackage->cmds.clear();
    }

    inline void reset() {
        beginRenderPassCmdPool.release();
        bindStatesCmdPool.release();
        drawCmdPool.release();
        updateBufferCmdPool.release();
        copyBufferToTextureCmdPool.release();
        blitTextureCmdPool.release();
    }
};

void cmdFuncGLES2CreateBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
void cmdFuncGLES2DestroyBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
void cmdFuncGLES2ResizeBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
void cmdFuncGLES2CreateTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
void cmdFuncGLES2DestroyTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
void cmdFuncGLES2ResizeTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
void cmdFuncGLES2CreateSampler(GLES2Device *device, GLES2GPUSampler *gpuSampler);
void cmdFuncGLES2DestroySampler(GLES2Device *device, GLES2GPUSampler *gpuSampler);
void cmdFuncGLES2CreateShader(GLES2Device *device, GLES2GPUShader *gpuShader);
void cmdFuncGLES2DestroyShader(GLES2Device *device, GLES2GPUShader *gpuShader);
void cmdFuncGLES2CreateRenderPass(GLES2Device *device, GLES2GPURenderPass *gpuRenderPass);
void cmdFuncGLES2DestroyRenderPass(GLES2Device *device, GLES2GPURenderPass *gpuRenderPass);
void cmdFuncGLES2CreateInputAssembler(GLES2Device *device, GLES2GPUInputAssembler *gpuInputAssembler);
void cmdFuncGLES2DestroyInputAssembler(GLES2Device *device, GLES2GPUInputAssembler *gpuInputAssembler);
void cmdFuncGLES2CreateFramebuffer(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO);
void cmdFuncGLES2DestroyFramebuffer(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO);

void cmdFuncGLES2BeginRenderPass(GLES2Device *device, uint32_t subpassIdx,
                                 GLES2GPURenderPass *gpuRenderPass = nullptr,
                                 GLES2GPUFramebuffer *gpuFramebuffer = nullptr,
                                 const Rect *renderArea = nullptr,
                                 const Color *clearColors = nullptr,
                                 float clearDepth = 1.F,
                                 uint32_t clearStencil = 0);

void cmdFuncGLES2EndRenderPass(GLES2Device *device);

void cmdFuncGLES2BindState(GLES2Device *device,
                           GLES2GPUPipelineState *gpuPipelineState,
                           GLES2GPUInputAssembler *gpuInputAssembler,
                           const GLES2GPUDescriptorSet *const *gpuDescriptorSets,
                           const uint32_t *dynamicOffsets = nullptr,
                           const DynamicStates *dynamicStates = nullptr);

void cmdFuncGLES2Draw(GLES2Device *device, const DrawInfo &drawInfo);

void cmdFuncGLES2UpdateBuffer(GLES2Device *device,
                              GLES2GPUBuffer *gpuBuffer,
                              const void *buffer,
                              uint32_t offset,
                              uint32_t size);

void cmdFuncGLES2CopyBuffersToTexture(GLES2Device *device,
                                      const uint8_t *const *buffers,
                                      GLES2GPUTexture *gpuTexture,
                                      const BufferTextureCopy *regions,
                                      uint32_t count);

void cmdFuncGLES2CopyTextureToBuffers(GLES2Device *device,
                                      GLES2GPUTexture *gpuTexture,
                                      uint8_t *const *buffers,
                                      const BufferTextureCopy *regions,
                                      uint32_t count);

void cmdFuncGLES2CopyTexture(GLES2Device *device,
                             GLES2GPUTexture *gpuTextureSrc,
                             GLES2GPUTexture *gpuTextureDst,
                             const TextureCopy *regions,
                             uint32_t count);

void cmdFuncGLES2BlitTexture(GLES2Device *device,
                             GLES2GPUTexture *gpuTextureSrc,
                             GLES2GPUTexture *gpuTextureDst,
                             const TextureBlit *regions,
                             uint32_t count,
                             Filter filter);

void cmdFuncGLES2ExecuteCmds(GLES2Device *device, GLES2CmdPackage *cmdPackage);

void cmdFuncGLES2InsertMarker(GLES2Device *device, GLsizei length, const char *marker);
void cmdFuncGLES2PushGroupMarker(GLES2Device *device, GLsizei length, const char *marker);
void cmdFuncGLES2PopGroupMarker(GLES2Device *device);

GLint cmdFuncGLES2GetMaxSampleCount();

} // namespace gfx
} // namespace cc
