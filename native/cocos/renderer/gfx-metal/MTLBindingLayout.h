#pragma once

namespace cc {

class CCMTLBindingLayout : public GFXBindingLayout {
public:
    CCMTLBindingLayout(GFXDevice *device);
    virtual ~CCMTLBindingLayout();

    virtual bool initialize(const GFXBindingLayoutInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;
};

}
