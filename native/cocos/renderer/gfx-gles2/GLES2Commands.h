#ifndef CC_GFXGLES2_COMMANDS_H_
#define CC_GFXGLES2_COMMANDS_H_

#include "GLES2GPUObjects.h"

namespace cc {
namespace gfx {

class GLES2Device;

struct GLES2ObjectCache {
    GLES2GPUPipelineState *gpuPipelineState = nullptr;
    GLES2GPUInputAssembler *gpuInputAssembler = nullptr;
    bool reverseCW = false;
    GLenum glPrimitive = 0;
};

struct GLES2DepthBias {
    float constant = 0.0f;
    float clamp = 0.0f;
    float slope = 0.0f;
};

struct GLES2DepthBounds {
    float minBounds = 0.0f;
    float maxBounds = 0.0f;
};

struct GLES2StencilWriteMask {
    StencilFace face = StencilFace::FRONT;
    uint writeMask = 0;
};

struct GLES2StencilCompareMask {
    StencilFace face = StencilFace::FRONT;
    int refrence = 0;
    uint compareMask = 0;
};

struct GLES2TextureSubres {
    uint baseMipLevel = 0;
    uint levelCount = 1;
    uint baseArrayLayer = 0;
    uint layerCount = 1;
};

struct GLES2BufferTextureCopy {
    uint buffOffset = 0;
    uint buffStride = 0;
    uint buffTexHeight = 0;
    uint texOffset[3] = {0};
    uint texExtent[3] = {0};
    GLES2TextureSubres texSubres;
};

class GLES2CmdBeginRenderPass : public GFXCmd {
public:
    GLES2GPURenderPass *gpuRenderPass = nullptr;
    GLES2GPUFramebuffer *gpuFBO = nullptr;
    Rect renderArea;
    size_t numClearColors = 0;
    Color clearColors[GFX_MAX_ATTACHMENTS];
    float clearDepth = 1.0f;
    int clearStencil = 0;

    GLES2CmdBeginRenderPass() : GFXCmd(GFXCmdType::BEGIN_RENDER_PASS) {}

    virtual void clear() override {
        gpuFBO = nullptr;
        numClearColors = 0;
    }
};

enum class GLES2State : uint8_t {
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

class GLES2CmdBindStates : public GFXCmd {
public:
    GLES2GPUPipelineState *gpuPipelineState = nullptr;
    GLES2GPUInputAssembler *gpuInputAssembler = nullptr;
    vector<GLES2GPUDescriptorSet *> gpuDescriptorSets;
    vector<uint> dynamicOffsets;
    uint8_t stateFlags[(int)GLES2State::COUNT] = {0};
    Viewport viewport;
    Rect scissor;
    float lineWidth = 1.0f;
    bool depthBiasEnabled = false;
    GLES2DepthBias depthBias;
    Color blendConstants;
    GLES2DepthBounds depthBounds;
    GLES2StencilWriteMask stencilWriteMask;
    GLES2StencilCompareMask stencilCompareMask;

    GLES2CmdBindStates() : GFXCmd(GFXCmdType::BIND_STATES) {}

    virtual void clear() override {
        gpuPipelineState = nullptr;
        gpuInputAssembler = nullptr;
        gpuDescriptorSets.clear();
        dynamicOffsets.clear();
        memset(stateFlags, 0, sizeof(stateFlags));
    }
};

class GLES2CmdDraw : public GFXCmd {
public:
    DrawInfo drawInfo;

    GLES2CmdDraw() : GFXCmd(GFXCmdType::DRAW) {}
    virtual void clear() override {}
};

class GLES2CmdUpdateBuffer : public GFXCmd {
public:
    GLES2GPUBuffer *gpuBuffer = nullptr;
    uint8_t *buffer = nullptr;
    uint size = 0;
    uint offset = 0;

    GLES2CmdUpdateBuffer() : GFXCmd(GFXCmdType::UPDATE_BUFFER) {}

    virtual void clear() override {
        gpuBuffer = nullptr;
        buffer = nullptr;
    }
};

class GLES2CmdCopyBufferToTexture : public GFXCmd {
public:
    GLES2GPUTexture *gpuTexture = nullptr;
    const BufferTextureCopy *regions = nullptr;
    uint count = 0u;
    vector<const uint8_t *> buffers;

    GLES2CmdCopyBufferToTexture() : GFXCmd(GFXCmdType::COPY_BUFFER_TO_TEXTURE) {}

    virtual void clear() override {
        gpuTexture = nullptr;
        regions = nullptr;
        count = 0u;
        buffers.clear();
    }
};

class GLES2CmdPackage : public Object {
public:
    CachedArray<GFXCmdType> cmds;
    CachedArray<GLES2CmdBeginRenderPass *> beginRenderPassCmds;
    CachedArray<GLES2CmdBindStates *> bindStatesCmds;
    CachedArray<GLES2CmdDraw *> drawCmds;
    CachedArray<GLES2CmdUpdateBuffer *> updateBufferCmds;
    CachedArray<GLES2CmdCopyBufferToTexture *> copyBufferToTextureCmds;
};

class GLES2GPUCommandAllocator : public Object {
public:
    CommandPool<GLES2CmdBeginRenderPass> beginRenderPassCmdPool;
    CommandPool<GLES2CmdBindStates> bindStatesCmdPool;
    CommandPool<GLES2CmdDraw> drawCmdPool;
    CommandPool<GLES2CmdUpdateBuffer> updateBufferCmdPool;
    CommandPool<GLES2CmdCopyBufferToTexture> copyBufferToTextureCmdPool;

    void clearCmds(GLES2CmdPackage *cmd_package) {
        if (cmd_package->beginRenderPassCmds.size()) {
            beginRenderPassCmdPool.freeCmds(cmd_package->beginRenderPassCmds);
        }
        if (cmd_package->bindStatesCmds.size()) {
            bindStatesCmdPool.freeCmds(cmd_package->bindStatesCmds);
        }
        if (cmd_package->drawCmds.size()) {
            drawCmdPool.freeCmds(cmd_package->drawCmds);
        }
        if (cmd_package->updateBufferCmds.size()) {
            updateBufferCmdPool.freeCmds(cmd_package->updateBufferCmds);
        }
        if (cmd_package->copyBufferToTextureCmds.size()) {
            copyBufferToTextureCmdPool.freeCmds(cmd_package->copyBufferToTextureCmds);
        }

        cmd_package->cmds.clear();
    }

    CC_INLINE void reset() {
        beginRenderPassCmdPool.release();
        bindStatesCmdPool.release();
        drawCmdPool.release();
        updateBufferCmdPool.release();
        copyBufferToTextureCmdPool.release();
    }
};

CC_GLES2_API void GLES2CmdFuncCreateBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
CC_GLES2_API void GLES2CmdFuncDestroyBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
CC_GLES2_API void GLES2CmdFuncResizeBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer);
CC_GLES2_API void GLES2CmdFuncUpdateBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer, void *buffer, uint offset, uint size);
CC_GLES2_API void GLES2CmdFuncCreateTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
CC_GLES2_API void GLES2CmdFuncDestroyTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
CC_GLES2_API void GLES2CmdFuncResizeTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture);
CC_GLES2_API void GLES2CmdFuncCreateSampler(GLES2Device *device, GLES2GPUSampler *gpuSampler);
CC_GLES2_API void GLES2CmdFuncDestroySampler(GLES2Device *device, GLES2GPUSampler *gpuSampler);
CC_GLES2_API void GLES2CmdFuncCreateShader(GLES2Device *device, GLES2GPUShader *gpuShader);
CC_GLES2_API void GLES2CmdFuncDestroyShader(GLES2Device *device, GLES2GPUShader *gpuShader);
CC_GLES2_API void GLES2CmdFuncCreateInputAssembler(GLES2Device *device, GLES2GPUInputAssembler *gpuInputAssembler);
CC_GLES2_API void GLES2CmdFuncDestroyInputAssembler(GLES2Device *device, GLES2GPUInputAssembler *gpuInputAssembler);
CC_GLES2_API void GLES2CmdFuncCreateFramebuffer(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO);
CC_GLES2_API void GLES2CmdFuncDestroyFramebuffer(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO);
CC_GLES2_API void GLES2CmdFuncExecuteCmds(GLES2Device *device, GLES2CmdPackage *cmd_package);
CC_GLES2_API void GLES2CmdFuncCopyBuffersToTexture(GLES2Device *device, const uint8_t *const *buffers, GLES2GPUTexture *gpuTexture, const BufferTextureCopy *regions, uint count);

} // namespace gfx
} // namespace cc

#endif
