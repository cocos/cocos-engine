#pragma once
#include <cocos/renderer/pipeline/custom/LayoutGraphNames.h>
#include <cocos/renderer/pipeline/custom/RenderCompilerTypes.h>
#include <cocos/renderer/pipeline/custom/RenderGraphNames.h>

namespace cc {

namespace render {

inline const char* getName(const RenderCompiler& /*v*/) noexcept { return "RenderCompiler"; }

} // namespace render

} // namespace cc
