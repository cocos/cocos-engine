#pragma once

namespace cc {
namespace gfx {

class CCMTLPipelineLayout : public GFXPipelineLayout {
public:
    CCMTLPipelineLayout(GFXDevice *device);
    ~CCMTLPipelineLayout();

    virtual bool initialize(const GFXPipelineLayoutInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
