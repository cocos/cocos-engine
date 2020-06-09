#pragma once

NS_CC_BEGIN

class CCMTLPipelineLayout : public GFXPipelineLayout {
public:
    CCMTLPipelineLayout(GFXDevice *device);
    ~CCMTLPipelineLayout();

    virtual bool initialize(const GFXPipelineLayoutInfo &info) override;
    virtual void destroy() override;
};

NS_CC_END
