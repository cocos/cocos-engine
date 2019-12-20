#pragma once

NS_CC_BEGIN

class CCMTLCmdBeginRenderPass : public GFXCmd
{
public:
    GFXRect renderRect;
    GFXClearFlags clearFlags = GFXClearFlags::NONE;
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

NS_CC_END
