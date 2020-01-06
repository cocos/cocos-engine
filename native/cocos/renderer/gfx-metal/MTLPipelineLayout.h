#pragma once

NS_CC_BEGIN

class CCMTLPipelineLayout : public GFXPipelineLayout
{
public:
    CCMTLPipelineLayout(GFXDevice* device);
    ~CCMTLPipelineLayout();
    
    virtual bool Initialize(const GFXPipelineLayoutInfo& info) override;
    virtual void Destroy() override;
};

NS_CC_END
