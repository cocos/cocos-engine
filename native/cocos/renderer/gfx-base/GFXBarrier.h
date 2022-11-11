#pragma once
#include "GFXDef-common.h"

namespace cc {

namespace gfx {

AccessFlags getAccessFlags(
    BufferUsage usage, MemoryUsage memUsage,
    ShaderStageFlagBit visibility,
    MemoryAccess access,
    PassType passType) noexcept;

AccessFlags getAccessFlags(
    TextureUsage usage,
    ShaderStageFlagBit visibility,
    MemoryAccess access,
    PassType passType) noexcept;

constexpr AccessFlags INVALID_ACCESS_FLAGS = static_cast<AccessFlags>(0xFFFFFFFF);

AccessFlags getDeviceAccessFlags(
    TextureUsage usage,
    MemoryAccess access,
    ShaderStageFlags visibility);

} // namespace gfx

} // namespace cc
