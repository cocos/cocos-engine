#pragma once
#include "renderer/pipeline/custom/LayoutGraphNames.h"
#include "renderer/pipeline/custom/RenderExampleTypes.h"
#include "renderer/pipeline/custom/RenderGraphNames.h"

namespace cc {

namespace render {

namespace example {

inline const char* getName(DependencyType e) noexcept {
    switch (e) {
        case DependencyType::Order: return "Order";
        case DependencyType::Value: return "Value";
    }
    return "";
}
inline const char* getName(const RenderPassNode& /*v*/) noexcept { return "RenderPassNode"; }
inline const char* getName(const RenderPassTraits& /*v*/) noexcept { return "RenderPassTraits"; }
inline const char* getName(const RenderDependencyGraph& /*v*/) noexcept { return "RenderDependencyGraph"; }
inline const char* getName(const RenderValueNode& /*v*/) noexcept { return "RenderValueNode"; }
inline const char* getName(const RenderValueGraph& /*v*/) noexcept { return "RenderValueGraph"; }
inline const char* getName(const RenderCompiler& /*v*/) noexcept { return "RenderCompiler"; }

} // namespace example

} // namespace render

} // namespace cc
