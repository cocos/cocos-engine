#pragma once

namespace cc {
namespace gfx {

class CCMTLPipelineLayout : public PipelineLayout {
public:
    CCMTLPipelineLayout(Device *device);
    ~CCMTLPipelineLayout();

    virtual bool initialize(const PipelineLayoutInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
