#pragma once

namespace cc {
namespace gfx {

class CCMTLBindingLayout : public BindingLayout {
public:
    CCMTLBindingLayout(Device *device);
    virtual ~CCMTLBindingLayout();

    virtual bool initialize(const BindingLayoutInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;
};

} // namespace gfx
} // namespace cc
