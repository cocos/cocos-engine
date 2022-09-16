#pragma once
#include "GFXDef-common.h"

namespace cc {

namespace gfx {

AccessFlags getAccesFlags(BufferUsage usage, MemoryUsage memUsage,
    ShaderStageFlagBit visibility,
    MemoryAccessBit access,
    PassType passType) noexcept;

AccessFlags getAccesFlags(TextureUsage usage,
    ShaderStageFlagBit visibility,
    MemoryAccessBit access,
    PassType passType) noexcept;

} // namespace gfx

} // namespace cc
