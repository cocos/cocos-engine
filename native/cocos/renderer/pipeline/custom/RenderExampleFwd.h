#pragma once
#include <cocos/renderer/pipeline/custom/LayoutGraphFwd.h>
#include <cocos/renderer/pipeline/custom/RenderGraphFwd.h>
#include <boost/variant2/variant.hpp>
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
