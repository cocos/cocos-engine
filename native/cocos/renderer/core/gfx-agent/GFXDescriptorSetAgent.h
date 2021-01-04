#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXDescriptorSet.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetAgent final : public Agent<DescriptorSet> {
public:
    using Agent::Agent;
    DescriptorSetAgent(Device *device) = delete;
    ~DescriptorSetAgent() override;

    bool initialize(const DescriptorSetInfo &info) override;
    void destroy() override;
    void update() override;

    void bindBuffer(uint binding, Buffer *buffer, uint index) override;
    void bindTexture(uint binding, Texture *texture, uint index) override;
    void bindSampler(uint binding, Sampler *sampler, uint index) override;
};

} // namespace gfx
} // namespace cc
