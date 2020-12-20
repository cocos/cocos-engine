#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXPipelineLayout.h"

namespace cc {
namespace gfx {

class CC_DLL PipelineLayoutAgent final : public Agent<PipelineLayout> {
public:
    using Agent::Agent;
    PipelineLayoutAgent(Device *device) = delete;

    virtual bool initialize(const PipelineLayoutInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
