#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXPipelineState.h"

namespace cc {
namespace gfx {

class CC_DLL PipelineStateAgent final : public Agent<PipelineState> {
public:
    using Agent::Agent;
    PipelineStateAgent(Device *device) = delete;

    virtual bool initialize(const PipelineStateInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
