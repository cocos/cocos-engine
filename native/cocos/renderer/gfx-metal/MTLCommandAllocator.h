#pragma once

#include "gfx/GFXCommandPool.h"
#include "MTLCommands.h"

NS_CC_BEGIN

class CCMTLCommandPackage;

class CCMTLCommandAllocator : public GFXCommandAllocator
{
public:
    CCMTLCommandAllocator(GFXDevice* device);
    ~CCMTLCommandAllocator();
    
    virtual bool initialize(const GFXCommandAllocatorInfo& info) override;
    virtual void destroy() override;
    
    void clearCommands(CCMTLCommandPackage* commandPackage);
    
private:
    friend class CCMTLCommandBuffer;
    GFXCommandPool<CCMTLCmdBeginRenderPass> _beginRenderPassCmdPool;
    GFXCommandPool<CCMTLCmdBindStates> _bindStatesCmdPool;
    GFXCommandPool<CCMTLCmdDraw> _drawCmdPool;
    //TODO: add other pools.
};

NS_CC_END
