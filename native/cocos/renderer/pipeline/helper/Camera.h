#pragma once
#include "SharedMemoryPool.h"
namespace cc {
namespace pipeline {

constexpr uint SKYBOX_FLAG = static_cast<uint>(gfx::ClearFlagBit::STENCIL) << 1;

struct CC_DLL Camera {
    gfx::Rect viewport;
    gfx::Color clearColor;
    SHARED_MEMORY_DATA_TYPE width = 0;
    SHARED_MEMORY_DATA_TYPE height = 0;
    SHARED_MEMORY_DATA_TYPE exposure = 0;
    SHARED_MEMORY_DATA_TYPE clearFlag = 0;
    SHARED_MEMORY_DATA_TYPE clearDepth = 0;
    SHARED_MEMORY_DATA_TYPE clearStencil = 0;
};

} // namespace pipeline
} // namespace cc
