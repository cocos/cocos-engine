#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXDescriptorSet.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetAgent final : public Agent<DescriptorSet> {
public:
    using Agent::Agent;
    DescriptorSetAgent(Device *device) = delete;

    virtual bool initialize(const DescriptorSetInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;

    virtual void bindBuffer(uint binding, Buffer *buffer, uint index) override;
    virtual void bindTexture(uint binding, Texture *texture, uint index) override;
    virtual void bindSampler(uint binding, Sampler *sampler, uint index) override;
};

} // namespace gfx
} // namespace cc
