#pragma once

#import <Metal/MTLRenderCommandEncoder.h>

NS_CC_BEGIN

class CCMTLFrameBuffer;
struct CCMTLGPUPipelineState;
class CCMTLInputAssembler;

struct CCMTLDepthBias
{
    float depthBias = 0.0f;
    float slopeScale = 0.0f;
    float clamp = 0.0f;
};

class CCMTLCmdBeginRenderPass : public GFXCmd
{
public:
    GFXRect renderArea;
    GFXClearFlags clearFlags = GFXClearFlags::NONE;
    CCMTLFrameBuffer* frameBuffer = nullptr;
    uint numOfClearColor = 0;
    GFXColor clearColors[GFX_MAX_ATTACHMENTS];
    float clearDepth = 1.f;
    int clearStencil = 0;
    
    CCMTLCmdBeginRenderPass() : GFXCmd(GFXCmdType::BEGIN_RENDER_PASS) {}
    
    virtual void Clear() override
    {
        numOfClearColor = 0;
    }
};

class CCMTLCmdBindStates : public GFXCmd
{
public:
    CCMTLGPUPipelineState* gpuPipelineState = nullptr;
    CCMTLInputAssembler* inputAssembler = nullptr;
    bool viewportDirty = false;
    bool scissorDirty = false;
    MTLViewport viewport;
    MTLScissorRect scissorRect;
    CCMTLDepthBias depthBias;
    
    CCMTLCmdBindStates() : GFXCmd(GFXCmdType::BIND_STATES) {}
    
    virtual void Clear() override {}
};

class CCMTLCmdDraw : public GFXCmd
{
public:
    GFXDrawInfo drawInfo;
    
    CCMTLCmdDraw() : GFXCmd(GFXCmdType::DRAW) {}
    virtual void Clear() override {}
};

class CCMTLCommandPackage : public Object
{
public:
    CachedArray<GFXCmdType> commandTypes;
    CachedArray<CCMTLCmdBeginRenderPass*> beginRenderPassCmds;
    CachedArray<CCMTLCmdBindStates*> bindStatesCmds;
    CachedArray<CCMTLCmdDraw*> drawCmds;
    //TODO: support other commands
};

NS_CC_END
