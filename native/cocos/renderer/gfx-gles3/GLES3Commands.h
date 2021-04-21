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

#include "GLES3GPUObjects.h"
#include "gfx-gles-common/GLESCommandPool.h"

namespace cc {
namespace gfx {

class GLES3Device;

struct GLES3DepthBias final {
    float constant = 0.0F;
    float clamp    = 0.0F;
    float slope    = 0.0F;
};

struct GLES3DepthBounds final {
    float minBounds = 0.0F;
    float maxBounds = 0.0F;
};

struct GLES3StencilWriteMask final {
    StencilFace face      = StencilFace::FRONT;
    uint        writeMask = 0;
};

struct GLES3StencilCompareMask final {
    StencilFace face        = StencilFace::FRONT;
    int         refrence    = 0;
    uint        compareMask = 0;
};

struct GLES3TextureSubres final {
    uint baseMipLevel   = 0;
    uint levelCount     = 1;
    uint baseArrayLayer = 0;
    uint layerCount     = 1;
};

struct GLES3BufferTextureCopy final {
    uint               buffOffset    = 0;
    uint               buffStride    = 0;
    uint               buffTexHeight = 0;
    uint               texOffset[3]  = {0};
    uint               texExtent[3]  = {0};
    GLES3TextureSubres texSubres;
};

class GLES3CmdBeginRenderPass final : public GLESCmd {
public:
    GLES3GPURenderPass * gpuRenderPass = nullptr;
    GLES3GPUFramebuffer *gpuFBO        = nullptr;
    Rect                 renderArea;
    size_t               numClearColors = 0;
    Color                clearColors[MAX_ATTACHMENTS];
    float                clearDepth   = 1.0F;
    int                  clearStencil = 0;

    GLES3CmdBeginRenderPass() : GLESCmd(GLESCmdType::BEGIN_RENDER_PASS) {}

    void clear() override {
        gpuFBO         = nullptr;
        numClearColors = 0;
    }
};

enum class GLES3State {
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

class GLES3CmdBindStates final : public GLESCmd {
public:
    GLES3GPUPipelineState *         gpuPipelineState  = nullptr;
    GLES3GPUInputAssembler *        gpuInputAssembler = nullptr;
    vector<GLES3GPUDescriptorSet *> gpuDescriptorSets;
    vector<uint>                    dynamicOffsets;
    Viewport                        viewport;
    Rect                            scissor;
    float                           lineWidth        = 1.0F;
    bool                            depthBiasEnabled = false;
    GLES3DepthBias                  depthBias;
    Color                           blendConstants;
    GLES3DepthBounds                depthBounds;
    GLES3StencilWriteMask           stencilWriteMask;
    GLES3StencilCompareMask         stencilCompareMask;

    GLES3CmdBindStates() : GLESCmd(GLESCmdType::BIND_STATES) {}

    void clear() override {
        gpuPipelineState  = nullptr;
        gpuInputAssembler = nullptr;
        gpuDescriptorSets.clear();
        dynamicOffsets.clear();
    }
};

class GLES3CmdDraw final : public GLESCmd {
public:
    DrawInfo drawInfo;

    GLES3CmdDraw() : GLESCmd(GLESCmdType::DRAW) {}
    void clear() override {}
};

class GLES3CmdDispatch final : public GLESCmd {
public:
    GLES3GPUDispatchInfo dispatchInfo;

    GLES3CmdDispatch() : GLESCmd(GLESCmdType::DISPATCH) {}
    void clear() override {
        dispatchInfo.indirectBuffer = nullptr;
        dispatchInfo.indirectOffset = 0;
    }
};

class GLES3CmdBarrier final : public GLESCmd {
public:
    GLbitfield barriers         = 0U;
    GLbitfield barriersByRegion = 0U;

    GLES3CmdBarrier() : GLESCmd(GLESCmdType::BARRIER) {}
    void clear() override {
        barriers         = 0U;
        barriersByRegion = 0U;
    }
};

class GLES3CmdUpdateBuffer final : public GLESCmd {
public:
    GLES3GPUBuffer *gpuBuffer = nullptr;
    const uint8_t * buffer    = nullptr;
    uint            size      = 0;
    uint            offset    = 0;

    GLES3CmdUpdateBuffer() : GLESCmd(GLESCmdType::UPDATE_BUFFER) {}

    void clear() override {
        gpuBuffer = nullptr;
        buffer    = nullptr;
    }
};

class GLES3CmdCopyBufferToTexture final : public GLESCmd {
public:
    GLES3GPUTexture *        gpuTexture = nullptr;
    const BufferTextureCopy *regions    = nullptr;
    uint                     count      = 0U;
    const uint8_t *const *   buffers;

    GLES3CmdCopyBufferToTexture() : GLESCmd(GLESCmdType::COPY_BUFFER_TO_TEXTURE) {}

    void clear() override {
        gpuTexture = nullptr;
        regions    = nullptr;
        count      = 0U;
        buffers    = nullptr;
    }
};

class GLES3CmdBlitTexture final : public GLESCmd {
public:
    GLES3GPUTexture *  gpuTextureSrc = nullptr;
    GLES3GPUTexture *  gpuTextureDst = nullptr;
    const TextureBlit *regions       = nullptr;
    uint               count         = 0U;
    Filter             filter        = Filter::POINT;

    GLES3CmdBlitTexture() : GLESCmd(GLESCmdType::BLIT_TEXTURE) {}

    void clear() override {
        gpuTextureSrc = nullptr;
        gpuTextureDst = nullptr;
        regions       = nullptr;
        count         = 0U;
    }
};

class GLES3CmdPackage final : public Object {
public:
    CachedArray<GLESCmdType>                   cmds;
    CachedArray<GLES3CmdBeginRenderPass *>     beginRenderPassCmds;
    CachedArray<GLES3CmdBindStates *>          bindStatesCmds;
    CachedArray<GLES3CmdDraw *>                drawCmds;
    CachedArray<GLES3CmdDispatch *>            dispatchCmds;
    CachedArray<GLES3CmdBarrier *>             barrierCmds;
    CachedArray<GLES3CmdUpdateBuffer *>        updateBufferCmds;
    CachedArray<GLES3CmdCopyBufferToTexture *> copyBufferToTextureCmds;
    CachedArray<GLES3CmdBlitTexture *>         blitTextureCmds;
};

class GLES3GPUCommandAllocator final : public Object {
public:
    CommandPool<GLES3CmdBeginRenderPass>     beginRenderPassCmdPool;
    CommandPool<GLES3CmdBindStates>          bindStatesCmdPool;
    CommandPool<GLES3CmdDraw>                drawCmdPool;
    CommandPool<GLES3CmdDispatch>            dispatchCmdPool;
    CommandPool<GLES3CmdBarrier>             barrierCmdPool;
    CommandPool<GLES3CmdUpdateBuffer>        updateBufferCmdPool;
    CommandPool<GLES3CmdCopyBufferToTexture> copyBufferToTextureCmdPool;
    CommandPool<GLES3CmdBlitTexture>         blitTextureCmdPool;

    void clearCmds(GLES3CmdPackage *cmdPackage) {
        if (cmdPackage->beginRenderPassCmds.size()) {
            beginRenderPassCmdPool.freeCmds(cmdPackage->beginRenderPassCmds);
        }
        if (cmdPackage->bindStatesCmds.size()) {
            bindStatesCmdPool.freeCmds(cmdPackage->bindStatesCmds);
        }
        if (cmdPackage->drawCmds.size()) {
            drawCmdPool.freeCmds(cmdPackage->drawCmds);
        }
        if (cmdPackage->dispatchCmds.size()) {
            dispatchCmdPool.freeCmds(cmdPackage->dispatchCmds);
        }
        if (cmdPackage->barrierCmds.size()) {
            barrierCmdPool.freeCmds(cmdPackage->barrierCmds);
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

    CC_INLINE void reset() {
        beginRenderPassCmdPool.release();
        bindStatesCmdPool.release();
        drawCmdPool.release();
        dispatchCmdPool.release();
        barrierCmdPool.release();
        updateBufferCmdPool.release();
        copyBufferToTextureCmdPool.release();
        blitTextureCmdPool.release();
    }
};

CC_GLES3_API void cmdFuncGLES3CreateBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer);
CC_GLES3_API void cmdFuncGLES3DestroyBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer);
CC_GLES3_API void cmdFuncGLES3ResizeBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer);
CC_GLES3_API void cmdFuncGLES3CreateTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture);
CC_GLES3_API void cmdFuncGLES3DestroyTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture);
CC_GLES3_API void cmdFuncGLES3ResizeTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture);
CC_GLES3_API void cmdFuncGLES3CreateSampler(GLES3Device *device, GLES3GPUSampler *gpuSampler);
CC_GLES3_API void cmdFuncGLES3DestroySampler(GLES3Device *device, GLES3GPUSampler *gpuSampler);
CC_GLES3_API void cmdFuncGLES3CreateShader(GLES3Device *device, GLES3GPUShader *gpuShader);
CC_GLES3_API void cmdFuncGLES3DestroyShader(GLES3Device *device, GLES3GPUShader *gpuShader);
CC_GLES3_API void cmdFuncGLES3CreateInputAssembler(GLES3Device *device, GLES3GPUInputAssembler *gpuInputAssembler);
CC_GLES3_API void cmdFuncGLES3DestroyInputAssembler(GLES3Device *device, GLES3GPUInputAssembler *gpuInputAssembler);
CC_GLES3_API void cmdFuncGLES3CreateFramebuffer(GLES3Device *device, GLES3GPUFramebuffer *gpuFBO);
CC_GLES3_API void cmdFuncGLES3DestroyFramebuffer(GLES3Device *device, GLES3GPUFramebuffer *gpuFBO);

CC_GLES3_API void cmdFuncGLES3BeginRenderPass(GLES3Device *device, GLES3GPURenderPass *gpuRenderPass, GLES3GPUFramebuffer *gpuFramebuffer,
                                              const Rect &renderArea, size_t numClearColors, const Color *clearColors, float clearDepth, int clearStencil);
CC_GLES3_API void cmdFuncGLES3EndRenderPass(GLES3Device *device);
CC_GLES3_API void cmdFuncGLES3BindState(GLES3Device *device, GLES3GPUPipelineState *gpuPipelineState, GLES3GPUInputAssembler *gpuInputAssembler,
                                        const vector<GLES3GPUDescriptorSet *> &gpuDescriptorSets, const vector<uint> &dynamicOffsets,
                                        const Viewport &viewport, const Rect &scissor, float lineWidth, bool depthBiasEnabled, const GLES3DepthBias &depthBias, const Color &blendConstants,
                                        const GLES3DepthBounds &depthBounds, const GLES3StencilWriteMask &stencilWriteMask, const GLES3StencilCompareMask &stencilCompareMask);
CC_GLES3_API void cmdFuncGLES3Draw(GLES3Device *device, const DrawInfo &drawInfo);
CC_GLES3_API void cmdFuncGLES3UpdateBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer, const void *buffer, uint offset, uint size);
CC_GLES3_API void cmdFuncGLES3CopyBuffersToTexture(GLES3Device *device, const uint8_t *const *buffers,
                                                   GLES3GPUTexture *gpuTexture, const BufferTextureCopy *regions, uint count);
CC_GLES3_API void cmdFuncGLES3BlitTexture(GLES3Device *device, GLES3GPUTexture *gpuTextureSrc, GLES3GPUTexture *gpuTextureDst, const TextureBlit *regions, uint count, Filter filter);
CC_GLES3_API void cmdFuncGLES3ExecuteCmds(GLES3Device *device, GLES3CmdPackage *cmdPackage);
CC_GLES3_API void cmdFuncGLES3Dispatch(GLES3Device *device, const GLES3GPUDispatchInfo &info);
CC_GLES3_API void cmdFuncGLES3MemoryBarrier(GLES3Device *device, GLbitfield barriers, GLbitfield barriersByRegion);

} // namespace gfx
} // namespace cc
