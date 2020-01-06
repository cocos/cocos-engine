#pragma once

NS_CC_BEGIN

class CCMTLBindingLayout : public GFXBindingLayout
{
public:
    CCMTLBindingLayout(GFXDevice* device);
    virtual ~CCMTLBindingLayout();
    
    virtual bool Initialize(const GFXBindingLayoutInfo& info) override;
    virtual void Destroy() override;
    virtual void Update() override;
};

NS_CC_END
