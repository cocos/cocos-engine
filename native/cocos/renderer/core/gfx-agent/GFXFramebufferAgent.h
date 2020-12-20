#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXFramebuffer.h"

namespace cc {
namespace gfx {

class CC_DLL FramebufferAgent final : public Agent<Framebuffer> {
public:
    using Agent::Agent;
    FramebufferAgent(Device *device) = delete;

    virtual bool initialize(const FramebufferInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
