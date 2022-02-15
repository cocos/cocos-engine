#pragma once
#include <boost/variant2/variant.hpp>
#include "renderer/pipeline/custom/LayoutGraphFwd.h"
#include "renderer/pipeline/custom/RenderGraphFwd.h"
#include <functional>

namespace cc {

namespace render {

namespace example {

enum class DependencyType;

struct RenderPassNode;
struct RenderPassTraits;
struct RenderDependencyGraph;
struct RenderValueNode;
struct RenderValueGraph;
struct RenderCompiler;

} // namespace example

} // namespace render

} // namespace cc

namespace std {

template <>
struct hash<cc::render::example::RenderValueNode> {
    size_t operator()(const cc::render::example::RenderValueNode& v) const noexcept;
};

}
