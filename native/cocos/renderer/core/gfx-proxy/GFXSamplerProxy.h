#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXSampler.h"

namespace cc {
namespace gfx {

class CC_DLL SamplerProxy : public Proxy<Sampler> {
public:
    using Proxy::Proxy;
    SamplerProxy(Device *device) = delete;

    virtual bool initialize(const SamplerInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
