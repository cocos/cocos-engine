#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXPipelineState.h"

namespace cc {
namespace gfx {

class CC_DLL PipelineStateProxy : public Proxy<PipelineState> {
public:
    using Proxy::Proxy;
    PipelineStateProxy(Device *device) = delete;

    virtual bool initialize(const PipelineStateInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
