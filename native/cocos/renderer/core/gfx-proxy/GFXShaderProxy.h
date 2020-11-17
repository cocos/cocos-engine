#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXShader.h"

namespace cc {
namespace gfx {

class CC_DLL ShaderProxy : public Proxy<Shader> {
public:
    using Proxy::Proxy;
    ShaderProxy(Device *device) = delete;

    virtual bool initialize(const ShaderInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
