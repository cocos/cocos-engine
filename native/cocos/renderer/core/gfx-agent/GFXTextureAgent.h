#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXTexture.h"

namespace cc {
namespace gfx {

class CC_DLL TextureAgent final : public Agent<Texture> {
public:
    using Agent::Agent;
    TextureAgent(Device *device) = delete;
    ~TextureAgent() override;

    bool initialize(const TextureInfo &info) override;
    bool initialize(const TextureViewInfo &info) override;
    void destroy() override;
    void resize(uint width, uint height) override;
};

} // namespace gfx
} // namespace cc
