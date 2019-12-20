#pragma once

NS_CC_BEGIN

class CCMTLQueue : public GFXQueue
{
public:
    CCMTLQueue(GFXDevice* device);
    ~CCMTLQueue();
    
    virtual bool Initialize(const GFXQueueInfo &info) override;
    virtual void Destroy() override;
    virtual void submit(GFXCommandBuffer** cmd_buffs, uint count) override;
    
private:
    void* _metalQueue = nullptr;
};

NS_CC_END

