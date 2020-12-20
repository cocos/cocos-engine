#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXSampler.h"

namespace cc {
namespace gfx {

class CC_DLL SamplerAgent final : public Agent<Sampler> {
public:
    using Agent::Agent;
    SamplerAgent(Device *device) = delete;

    virtual bool initialize(const SamplerInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
