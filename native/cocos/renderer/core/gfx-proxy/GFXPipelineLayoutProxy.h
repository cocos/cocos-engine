#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXPipelineLayout.h"

namespace cc {
namespace gfx {

class CC_DLL PipelineLayoutProxy final : public Proxy<PipelineLayout> {
public:
    using Proxy::Proxy;
    PipelineLayoutProxy(Device *device) = delete;

    virtual bool initialize(const PipelineLayoutInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
