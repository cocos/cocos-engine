#pragma once

NS_CC_BEGIN

class CCMTLFrameBuffer;

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

class CCMTLCommandPackage : public Object
{
public:
    CachedArray<GFXCmdType> commandTypes;
    CachedArray<CCMTLCmdBeginRenderPass*> beginRenderPassCmds;
    //TODO: support other commands
};

NS_CC_END
