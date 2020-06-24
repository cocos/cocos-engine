#pragma once

#import <Metal/MTLRenderCommandEncoder.h>

namespace cc {
namespace gfx {

class CCMTLFramebuffer;
struct CCMTLGPUPipelineState;
class CCMTLInputAssembler;
class CCMTLBindingLayout;
class CCMTLPipelineState;
class CCMTLBuffer;
class CCMTLTexture;

struct CCMTLDepthBias {
    float depthBias = 0.0f;
    float slopeScale = 0.0f;
    float clamp = 0.0f;
};

struct CCMTLDepthBounds {
    float minBounds = 0.0f;
    float maxBounds = 0.0f;
};

class CCMTLCmdBeginRenderPass : public GFXCmd {
public:
    Rect renderArea;
    ClearFlags clearFlags = ClearFlags::NONE;
    CCMTLFramebuffer *frameBuffer = nullptr;
    uint numOfClearColor = 0;
    vector<Color> clearColors;
    float clearDepth = 1.f;
    int clearStencil = 0;

    CCMTLCmdBeginRenderPass() : GFXCmd(GFXCmdType::BEGIN_RENDER_PASS) {}

    virtual void clear() override {
        numOfClearColor = 0;
    }
};

class CCMTLCmdBindStates : public GFXCmd {
public:
    BindingLayout *bindingLayout = nullptr;
    CCMTLPipelineState *pipelineState = nullptr;
    CCMTLInputAssembler *inputAssembler = nullptr;
    MTLViewport viewport = {};
    MTLScissorRect scissorRect = {};
    bool depthBiasEnabled = false;
    CCMTLDepthBias depthBias;
    CCMTLDepthBounds depthBounds;
    Color blendConstants;
    const static uint DYNAMIC_STATE_SIZE = 8;
    std::array<bool, DYNAMIC_STATE_SIZE> dynamicStateDirty = {false, false, false, false, false, false, false, false};

    CCMTLCmdBindStates() : GFXCmd(GFXCmdType::BIND_STATES) {}

    virtual void clear() override {}
};

class CCMTLCmdDraw : public GFXCmd {
public:
    DrawInfo drawInfo;

    CCMTLCmdDraw() : GFXCmd(GFXCmdType::DRAW) {}
    virtual void clear() override {}
};

class CCMTLCmdCopyBufferToTexture : public GFXCmd {
public:
    CCMTLBuffer *gpuBuffer = nullptr;
    CCMTLTexture *gpuTexture = nullptr;
    TextureLayout dstLayout;
    BufferTextureCopyList regions;

    CCMTLCmdCopyBufferToTexture() : GFXCmd(GFXCmdType::COPY_BUFFER_TO_TEXTURE) {}
    virtual void clear() override {
        gpuBuffer = nullptr;
        gpuTexture = nullptr;
        regions.clear();
    }
};

class CCMTLCmdUpdateBuffer : public GFXCmd {
public:
    CCMTLBuffer *gpuBuffer = nullptr;
    uint8_t *buffer = nullptr;
    uint size = 0;
    uint offset = 0;

    CCMTLCmdUpdateBuffer() : GFXCmd(GFXCmdType::UPDATE_BUFFER) {}

    void clear() {
        buffer = nullptr;
        gpuBuffer = nullptr;
    }
};

class CCMTLCommandPackage : public Object {
public:
    CachedArray<GFXCmdType> commandTypes;
    CachedArray<CCMTLCmdBeginRenderPass *> beginRenderPassCmds;
    CachedArray<CCMTLCmdBindStates *> bindStatesCmds;
    CachedArray<CCMTLCmdDraw *> drawCmds;
    CachedArray<CCMTLCmdUpdateBuffer *> updateBufferCmds;
    CachedArray<CCMTLCmdCopyBufferToTexture *> copyBufferToTextureCmds;
};

} // namespace gfx
} // namespace cc
