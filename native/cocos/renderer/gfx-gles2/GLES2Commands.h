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

#pragma once

#include "gfx-gles-common/GLESCommandPool.h"

#include "GLES2GPUObjects.h"
#include "GLES2Std.h"

namespace cc {
namespace gfx {

class GLES2Device;

struct GLES2DepthBias final {
    float constant = 0.0F;
    float clamp    = 0.0F;
    float slope    = 0.0F;
};

struct GLES2DepthBounds final {
    float minBounds = 0.0F;
    float maxBounds = 0.0F;
};

struct GLES2StencilWriteMask final {
    StencilFace face      = StencilFace::FRONT;
    uint        writeMask = 0;
};

struct GLES2StencilCompareMask final {
    StencilFace face        = StencilFace::FRONT;
    int         refrence    = 0;
    uint        compareMask = 0;
};

struct GLES2TextureSubres final {
    uint baseMipLevel   = 0;
    uint levelCount     = 1;
    uint baseArrayLayer = 0;
    uint layerCount     = 1;
};

struct GLES2BufferTextureCopy final {
    uint               buffOffset    = 0;
    uint               buffStride    = 0;
    uint               buffTexHeight = 0;
    uint               texOffset[3]  = {0};
    uint               texExtent[3]  = {0};
    GLES2TextureSubres texSubres;
};

class GLES2CmdBeginRenderPass final : public GLESCmd {
public:
    GLES2GPURenderPass * gpuRenderPass = nullptr;
    GLES2GPUFramebuffer *gpuFBO        = nullptr;
    Rect                 renderArea;
    size_t               numClearColors = 0;
    Color                clearColors[MAX_ATTACHMENTS];
    float                clearDepth   = 1.0F;
    int                  clearStencil = 0;

    GLES2CmdBeginRenderPass() : GLESCmd(GLESCmdType::BEGIN_RENDER_PASS) {}

    void clear() override {
        gpuFBO         = nullptr;
        numClearColors = 0;
    }
};

enum class GLES2State {
    VIEWPORT,
    SCISSOR,
    LINE_WIDTH,
    DEPTH_BIAS,
    BLEND_CONSTANTS,
    DEPTH_BOUNDS,
    STENCIL_WRITE_MASK,
    STENCIL_COMPARE_MASK,
    COUNT,
};

class GLES2CmdBindStates final : public GLESCmd {
public:
    GLES2GPUPipelineState *         gpuPipelineState  = nullptr;
    GLES2GPUInputAssembler *        gpuInputAssembler = nullptr;
    vector<GLES2GPUDescriptorSet *> gpuDescriptorSets;
    vector<uint>                    dynamicOffsets;
    Viewport                        viewport;
    Rect                            scissor;
    float                           lineWidth        = 1.0F;
    bool                            depthBiasEnabled = false;
    GLES2DepthBias                  depthBias;
    Color                           blendConstants;
    GLES2DepthBounds                depthBounds;
    GLES2StencilWriteMask           stencilWriteMask;
    GLES2StencilCompareMask         stencilCompareMask;

    GLES2CmdBindStates() : GLESCmd(GLESCmdType::BIND_STATES) {}

    void clear() override {
        gpuPipelineState  = nullptr;
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
    const uint8_t * buffer    = nullptr;
    uint            size      = 0;
    uint            offset    = 0;

    GLES2CmdUpdateBuffer() : GLESCmd(GLESCmdType::UPDATE_BUFFER) {}

    void clear() override {
        gpuBuffer = nullptr;
        buffer    = nullptr;
    }
};

class GLES2CmdCopyBufferToTexture final : public GLESCmd {
public:
    GLES2GPUTexture *        gpuTexture = nullptr;
    const BufferTextureCopy *regions    = nullptr;
    uint                     count      = 0U;
    const uint8_t *const *   buffers;

    GLES2CmdCopyBufferToTexture() : GLESCmd(GLESCmdType::COPY_BUFFER_TO_TEXTURE) {}

    void clear() override {
        gpuTexture = nullptr;
        regions    = nullptr;
        count      = 0U;
        buffers    = nullptr;
    }
};

class GLES2CmdPackage final : public Object {
public:
    CachedArray<GLESCmdType>                   cmds;
    CachedArray<GLES2CmdBeginRenderPass *>     beginRenderPassCmds;
    CachedArray<GLES2CmdBindStates *>          bindStatesCmds;
    CachedArray<GLES2CmdDraw *>                drawCmds;
    CachedArray<GLES2CmdUpdateBuffer *>        updateBufferCmds;
    CachedArray<GLES2CmdCopyBufferToTexture *> copyBufferToTextureCmds;
};

class GLES2GPUCommandAllocator final : public Object {
public:
    CommandPool<GLES2CmdBeginRenderPass>     beginRenderPassCmdPool;
    CommandPool<GLES2CmdBindStates>          bindStatesCmdPool;
    CommandPool<GLES2CmdDraw>                drawCmdPool;
    CommandPool<GLES2CmdUpdateBuffer>        updateBufferCmdPool;
    CommandPool<GLES2CmdCopyBufferToTexture> copyBufferToTextureCmdPool;

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

        cmdPackage->cmds.clear();
    }

    CC_INLINE void reset() {
        beginRenderPassCmdPool.release();
        bindStatesCmdPool.release();
        drawCmdPool.release();
        updateBufferCmdPool.release();
        copyBufferToTextureCmdPool.release();
    }
};

CC_GLES2_API void cmdFuncGLES2CreateBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
CC_GLES2_API void cmdFuncGLES2DestroyBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
CC_GLES2_API void cmdFuncGLES2ResizeBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
CC_GLES2_API void cmdFuncGLES2CreateTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
CC_GLES2_API void cmdFuncGLES2DestroyTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
CC_GLES2_API void cmdFuncGLES2ResizeTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
CC_GLES2_API void cmdFuncGLES2CreateSampler(GLES2Device *device, GLES2GPUSampler *gpuSampler);
CC_GLES2_API void cmdFuncGLES2DestroySampler(GLES2Device *device, GLES2GPUSampler *gpuSampler);
CC_GLES2_API void cmdFuncGLES2CreateShader(GLES2Device *device, GLES2GPUShader *gpuShader);
CC_GLES2_API void cmdFuncGLES2DestroyShader(GLES2Device *device, GLES2GPUShader *gpuShader);
CC_GLES2_API void cmdFuncGLES2CreateInputAssembler(GLES2Device *device, GLES2GPUInputAssembler *gpuInputAssembler);
CC_GLES2_API void cmdFuncGLES2DestroyInputAssembler(GLES2Device *device, GLES2GPUInputAssembler *gpuInputAssembler);
CC_GLES2_API void cmdFuncGLES2CreateFramebuffer(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO);
CC_GLES2_API void cmdFuncGLES2DestroyFramebuffer(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO);

CC_GLES2_API void cmdFuncGLES2BeginRenderPass(GLES2Device *device, GLES2GPURenderPass *gpuRenderPass, GLES2GPUFramebuffer *gpuFramebuffer,
                                              const Rect &renderArea, size_t numClearColors, const Color *clearColors, float clearDepth, int clearStencil);
CC_GLES2_API void cmdFuncGLES2EndRenderPass(GLES2Device *device);
CC_GLES2_API void cmdFuncGLES2BindState(GLES2Device *device, GLES2GPUPipelineState *gpuPipelineState, GLES2GPUInputAssembler *gpuInputAssembler,
                                        const vector<GLES2GPUDescriptorSet *> &gpuDescriptorSets, const vector<uint> &dynamicOffsets,
                                        const Viewport &viewport, const Rect &scissor, float lineWidth, bool depthBiasEnabled, const GLES2DepthBias &depthBias, const Color &blendConstants,
                                        const GLES2DepthBounds &depthBounds, const GLES2StencilWriteMask &stencilWriteMask, const GLES2StencilCompareMask &stencilCompareMask);
CC_GLES2_API void cmdFuncGLES2Draw(GLES2Device *device, const DrawInfo &drawInfo);
CC_GLES2_API void cmdFuncGLES2UpdateBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer, const void *buffer, uint offset, uint size);
CC_GLES2_API void cmdFuncGLES2CopyBuffersToTexture(GLES2Device *device, const uint8_t *const *buffers,
                                                   GLES2GPUTexture *gpuTexture, const BufferTextureCopy *regions, uint count);
CC_GLES2_API void cmdFuncGLES2ExecuteCmds(GLES2Device *device, GLES2CmdPackage *cmdPackage);

} // namespace gfx
} // namespace cc
