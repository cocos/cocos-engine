#ifndef CC_GFXGLES3_COMMANDS_H_
#define CC_GFXGLES3_COMMANDS_H_

#include "GLES3GPUObjects.h"

namespace cc {
namespace gfx {

class GLES3Device;

struct GLES3GPUStateCache {
    GLES3GPUPipelineState *gpuPipelineState = nullptr;
    GLES3GPUInputAssembler *gpuInputAssembler = nullptr;
    bool reverseCW = false;
    GLenum glPrimitive = 0;
};

struct GLES3DepthBias {
    float constant = 0.0f;
    float clamp = 0.0f;
    float slope = 0.0f;
};

struct GLES3DepthBounds {
    float minBounds = 0.0f;
    float maxBounds = 0.0f;
};

struct GLES3StencilWriteMask {
    StencilFace face = StencilFace::FRONT;
    uint writeMask = 0;
};

struct GLES3StencilCompareMask {
    StencilFace face = StencilFace::FRONT;
    int refrence = 0;
    uint compareMask = 0;
};

struct GLES3TextureSubres {
    uint baseMipLevel = 0;
    uint levelCount = 1;
    uint baseArrayLayer = 0;
    uint layerCount = 1;
};

struct GLES3BufferTextureCopy {
    uint buffOffset = 0;
    uint buffStride = 0;
    uint buffTexHeight = 0;
    uint texOffset[3] = {0};
    uint texExtent[3] = {0};
    GLES3TextureSubres texSubres;
};

class GLES3CmdBeginRenderPass : public GFXCmd {
public:
    GLES3GPURenderPass *gpuRenderPass = nullptr;
    GLES3GPUFramebuffer *gpuFBO = nullptr;
    Rect renderArea;
    size_t numClearColors = 0;
    Color clearColors[GFX_MAX_ATTACHMENTS];
    float clearDepth = 1.0f;
    int clearStencil = 0;

    GLES3CmdBeginRenderPass() : GFXCmd(GFXCmdType::BEGIN_RENDER_PASS) {}

    virtual void clear() override {
        gpuFBO = nullptr;
        numClearColors = 0;
    }
};

enum class GLES3State : uint8_t {
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

class GLES3CmdBindStates : public GFXCmd {
public:
    GLES3GPUPipelineState *gpuPipelineState = nullptr;
    GLES3GPUInputAssembler *gpuInputAssembler = nullptr;
    vector<GLES3GPUDescriptorSet *> gpuDescriptorSets;
    vector<uint> dynamicOffsets;
    uint8_t stateFlags[(int)GLES3State::COUNT] = {0};
    Viewport viewport;
    Rect scissor;
    float lineWidth = 1.0f;
    bool depthBiasEnabled = false;
    GLES3DepthBias depthBias;
    Color blendConstants;
    GLES3DepthBounds depthBounds;
    GLES3StencilWriteMask stencilWriteMask;
    GLES3StencilCompareMask stencilCompareMask;

    GLES3CmdBindStates() : GFXCmd(GFXCmdType::BIND_STATES) {}

    virtual void clear() override {
        gpuPipelineState = nullptr;
        gpuInputAssembler = nullptr;
        gpuDescriptorSets.clear();
        dynamicOffsets.clear();
        memset(stateFlags, 0, sizeof(stateFlags));
    }
};

class GLES3CmdDraw : public GFXCmd {
public:
    DrawInfo drawInfo;

    GLES3CmdDraw() : GFXCmd(GFXCmdType::DRAW) {}
    virtual void clear() override {}
};

class GLES3CmdUpdateBuffer : public GFXCmd {
public:
    GLES3GPUBuffer *gpuBuffer = nullptr;
    uint8_t *buffer = nullptr;
    uint size = 0;
    uint offset = 0;

    GLES3CmdUpdateBuffer() : GFXCmd(GFXCmdType::UPDATE_BUFFER) {}

    virtual void clear() override {
        gpuBuffer = nullptr;
        buffer = nullptr;
    }
};

class GLES3CmdCopyBufferToTexture : public GFXCmd {
public:
    GLES3GPUTexture *gpuTexture = nullptr;
    const uint8_t *const *buffers = nullptr;
    const BufferTextureCopy *regions = nullptr;
    uint count = 0u;

    GLES3CmdCopyBufferToTexture() : GFXCmd(GFXCmdType::COPY_BUFFER_TO_TEXTURE) {}

    virtual void clear() override {
        gpuTexture = nullptr;
        buffers = nullptr;
        regions = nullptr;
        count = 0u;
    }
};

class GLES3CmdPackage : public Object {
public:
    CachedArray<GFXCmdType> cmds;
    CachedArray<GLES3CmdBeginRenderPass *> beginRenderPassCmds;
    CachedArray<GLES3CmdBindStates *> bindStatesCmds;
    CachedArray<GLES3CmdDraw *> drawCmds;
    CachedArray<GLES3CmdUpdateBuffer *> updateBufferCmds;
    CachedArray<GLES3CmdCopyBufferToTexture *> copyBufferToTextureCmds;
};

CC_GLES3_API void GLES3CmdFuncCreateBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer);
CC_GLES3_API void GLES3CmdFuncDestroyBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer);
CC_GLES3_API void GLES3CmdFuncResizeBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer);
CC_GLES3_API void GLES3CmdFuncUpdateBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer, void *buffer, uint offset, uint size);
CC_GLES3_API void GLES3CmdFuncCreateTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture);
CC_GLES3_API void GLES3CmdFuncDestroyTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture);
CC_GLES3_API void GLES3CmdFuncResizeTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture);
CC_GLES3_API void GLES3CmdFuncCreateSampler(GLES3Device *device, GLES3GPUSampler *gpuSampler);
CC_GLES3_API void GLES3CmdFuncDestroySampler(GLES3Device *device, GLES3GPUSampler *gpuSampler);
CC_GLES3_API void GLES3CmdFuncCreateShader(GLES3Device *device, GLES3GPUShader *gpuShader);
CC_GLES3_API void GLES3CmdFuncDestroyShader(GLES3Device *device, GLES3GPUShader *gpuShader);
CC_GLES3_API void GLES3CmdFuncCreateInputAssembler(GLES3Device *device, GLES3GPUInputAssembler *gpuInputAssembler);
CC_GLES3_API void GLES3CmdFuncDestroyInputAssembler(GLES3Device *device, GLES3GPUInputAssembler *gpuInputAssembler);
CC_GLES3_API void GLES3CmdFuncCreateFramebuffer(GLES3Device *device, GLES3GPUFramebuffer *gpuFBO);
CC_GLES3_API void GLES3CmdFuncDestroyFramebuffer(GLES3Device *device, GLES3GPUFramebuffer *gpuFBO);
CC_GLES3_API void GLES3CmdFuncExecuteCmds(GLES3Device *device, GLES3CmdPackage *cmd_package);
CC_GLES3_API void GLES3CmdFuncCopyBuffersToTexture(GLES3Device *device, const uint8_t *const *buffers, GLES3GPUTexture *gpuTexture, const BufferTextureCopy *regions, uint count);

} // namespace gfx
} // namespace cc

#endif
