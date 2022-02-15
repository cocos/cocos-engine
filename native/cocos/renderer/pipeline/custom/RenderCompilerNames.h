// clang-format off
#pragma once
#include "renderer/pipeline/custom/LayoutGraphNames.h"
#include "renderer/pipeline/custom/RenderCompilerTypes.h"
#include "renderer/pipeline/custom/RenderGraphNames.h"

namespace cc {

namespace render {

inline const char* getName(const RenderCompiler& /*v*/) noexcept { return "RenderCompiler"; }

} // namespace render

} // namespace cc
