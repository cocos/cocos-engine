#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXTexture.h"

namespace cc {
namespace gfx {

class CC_DLL TextureProxy : public Proxy<Texture> {
public:
    using Proxy::Proxy;
    TextureProxy(Device *device) = delete;

    virtual bool initialize(const TextureInfo &info) override;
    virtual bool initialize(const TextureViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
};

} // namespace gfx
} // namespace cc
