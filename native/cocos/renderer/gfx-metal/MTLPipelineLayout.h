#pragma once

namespace cc {

class CCMTLPipelineLayout : public GFXPipelineLayout {
public:
    CCMTLPipelineLayout(GFXDevice *device);
    ~CCMTLPipelineLayout();

    virtual bool initialize(const GFXPipelineLayoutInfo &info) override;
    virtual void destroy() override;
};

}
