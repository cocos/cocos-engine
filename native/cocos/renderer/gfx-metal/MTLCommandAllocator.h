#pragma once

NS_CC_BEGIN

class CCMTLCommandAllocator : public GFXCommandAllocator
{
public:
    CCMTLCommandAllocator(GFXDevice* device);
    ~CCMTLCommandAllocator();
    
    virtual bool Initialize(const GFXCommandAllocatorInfo& info) override;
    virtual void Destroy() override;
};

NS_CC_END
