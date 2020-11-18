#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXFramebuffer.h"

namespace cc {
namespace gfx {

class CC_DLL FramebufferProxy : public Proxy<Framebuffer> {
public:
    using Proxy::Proxy;
    FramebufferProxy(Device *device) = delete;

    virtual bool initialize(const FramebufferInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
