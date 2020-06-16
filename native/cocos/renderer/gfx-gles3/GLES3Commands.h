#ifndef CC_GFXGLES3_COMMANDS_H_
#define CC_GFXGLES3_COMMANDS_H_

#include "GLES3GPUObjects.h"

namespace cc {

class GLES3Device;

struct GLES3DepthBias {
    float constant = 0.0f;
    float clamp = 0.0f;
    float slope = 0.0f;
};

struct GLES3DepthBounds {
    float min_bounds = 0.0f;
    float max_bounds = 0.0f;
};

struct GLES3StencilWriteMask {
    GFXStencilFace face = GFXStencilFace::FRONT;
    uint write_mask = 0;
};

struct GLES3StencilCompareMask {
    GFXStencilFace face = GFXStencilFace::FRONT;
    int refrence = 0;
    uint compare_mask = 0;
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
    GLES3GPUFramebuffer *gpuFBO = nullptr;
    GFXRect render_area;
    GFXClearFlags clear_flags = GFXClearFlagBit::NONE;
    uint num_clear_colors = 0;
    GFXColor clear_colors[GFX_MAX_ATTACHMENTS];
    float clear_depth = 1.0f;
    int clear_stencil = 0;

    GLES3CmdBeginRenderPass() : GFXCmd(GFXCmdType::BEGIN_RENDER_PASS) {}

    virtual void clear() override {
        gpuFBO = nullptr;
        num_clear_colors = 0;
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
    GLES3GPUBindingLayout *gpuBindingLayout = nullptr;
    GLES3GPUInputAssembler *gpuInputAssembler = nullptr;
    uint8_t state_flags[(int)GLES3State::COUNT] = {0};
    GFXViewport viewport;
    GFXRect scissor;
    float lineWidth = 1.0f;
    bool depthBiasEnabled = false;
    GLES3DepthBias depthBias;
    GFXColor blendConstants;
    GLES3DepthBounds depthBounds;
    GLES3StencilWriteMask stencilWriteMask;
    GLES3StencilCompareMask stencilCompareMask;

    GLES3CmdBindStates() : GFXCmd(GFXCmdType::BIND_STATES) {}

    virtual void clear() override {
        gpuPipelineState = nullptr;
        gpuBindingLayout = nullptr;
        gpuInputAssembler = nullptr;
        memset(state_flags, 0, sizeof(state_flags));
    }
};

class GLES3CmdDraw : public GFXCmd {
public:
    GFXDrawInfo draw_info;

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
    GLES3GPUBuffer *gpuBuffer = nullptr;
    GLES3GPUTexture *gpuTexture = nullptr;
    GFXTextureLayout dst_layout;
    GFXBufferTextureCopyList regions;

    GLES3CmdCopyBufferToTexture() : GFXCmd(GFXCmdType::COPY_BUFFER_TO_TEXTURE) {}

    virtual void clear() override {
        gpuBuffer = nullptr;
        gpuTexture = nullptr;
        regions.clear();
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
CC_GLES3_API void GLES3CmdFuncCopyBuffersToTexture(GLES3Device *device, uint8_t *const *buffers, GLES3GPUTexture *gpuTexture, const GFXBufferTextureCopyList &regions);

}

#endif
