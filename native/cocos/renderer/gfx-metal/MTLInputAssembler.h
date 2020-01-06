#pragma once

NS_CC_BEGIN

class CCMTLCmdDraw;

class CCMTLInputAssembler : public GFXInputAssembler
{
public:
    CCMTLInputAssembler(GFXDevice* device);
    ~CCMTLInputAssembler();
    
    virtual bool Initialize(const GFXInputAssemblerInfo& info) override;
    virtual void Destroy() override;
    
    void extractDrawInfo(CCMTLCmdDraw*) const;
};

NS_CC_END
