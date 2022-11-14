#pragma once
#include "GFXDef-common.h"

namespace cc {

namespace gfx {

AccessFlags getAccessFlags(
    BufferUsage usage, MemoryUsage memUsage,
    MemoryAccess access,
    ShaderStageFlags visibility) noexcept;

AccessFlags getAccessFlags(
    TextureUsage usage,
    MemoryAccess access,
    ShaderStageFlags visibility) noexcept;

constexpr AccessFlags INVALID_ACCESS_FLAGS = static_cast<AccessFlags>(0xFFFFFFFF);

AccessFlags getDeviceAccessFlags(
    TextureUsage usage,
    MemoryAccess access,
    ShaderStageFlags visibility);

} // namespace gfx

} // namespace cc
