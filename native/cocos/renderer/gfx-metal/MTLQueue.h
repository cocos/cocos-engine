#pragma once

#import <Metal/MTLCommandQueue.h>

NS_CC_BEGIN

class CCMTLCommandPackage;

class CCMTLQueue : public GFXQueue
{
public:
    CCMTLQueue(GFXDevice* device);
    ~CCMTLQueue();
    
    virtual bool initialize(const GFXQueueInfo &info) override;
    virtual void destroy() override;
    virtual void submit(const std::vector<GFXCommandBuffer*>& cmd_buffs) override;
    
private:
    CC_INLINE void executeCommands(const CCMTLCommandPackage*, id<MTLCommandBuffer> mtlCommandBuffer);
};

NS_CC_END

