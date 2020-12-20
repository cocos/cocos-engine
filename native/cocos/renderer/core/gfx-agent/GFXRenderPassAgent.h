#pragma once

#include "../gfx/GFXRenderPass.h"
#include "GFXAgent.h"

namespace cc {
namespace gfx {

class CC_DLL RenderPassAgent final : public Agent<RenderPass> {
public:
    using Agent::Agent;
    RenderPassAgent(Device *device) = delete;

    virtual bool initialize(const RenderPassInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
