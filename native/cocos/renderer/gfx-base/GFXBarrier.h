#pragma once
#include "GFXDef-common.h"

namespace cc {

namespace gfx {

AccessFlags getAccessFlags(BufferUsage usage, MemoryUsage memUsage,
    ShaderStageFlagBit visibility,
    MemoryAccessBit access,
    PassType passType) noexcept;

AccessFlags getAccessFlags(TextureUsage usage,
    ShaderStageFlagBit visibility,
    MemoryAccessBit access,
    PassType passType) noexcept;

} // namespace gfx

} // namespace cc
