#pragma once

#include "../gfx/GFXRenderPass.h"
#include "GFXProxy.h"

namespace cc {
namespace gfx {

class CC_DLL RenderPassProxy : public Proxy<RenderPass> {
public:
    using Proxy::Proxy;
    RenderPassProxy(Device *device) = delete;

    virtual bool initialize(const RenderPassInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
