// clang-format off
#include "RenderExampleTypes.h"

namespace cc {

namespace render {

namespace example {

RenderPassNode::RenderPassNode(const allocator_type& alloc) noexcept
: outputs(alloc),
  inputs(alloc) {}

RenderPassNode::RenderPassNode(RenderPassNode&& rhs, const allocator_type& alloc)
: outputs(std::move(rhs.outputs), alloc),
  inputs(std::move(rhs.inputs), alloc) {}

RenderPassNode::RenderPassNode(RenderPassNode const& rhs, const allocator_type& alloc)
: outputs(rhs.outputs, alloc),
  inputs(rhs.inputs, alloc) {}

RenderDependencyGraph::RenderDependencyGraph(const allocator_type& alloc) noexcept
: vertices(alloc),
  passes(alloc),
  valueIDs(alloc),
  passIDs(alloc),
  traits(alloc),
  edges(alloc),
  passIndex(alloc),
  valueIndex(alloc),
  valueNames(alloc),
  resourceHandles(alloc) {}

// ContinuousContainer
void RenderDependencyGraph::reserve(vertices_size_type sz) {
    this->vertices.reserve(sz);
    passes.reserve(sz);
    valueIDs.reserve(sz);
    passIDs.reserve(sz);
    traits.reserve(sz);
}

RenderDependencyGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

RenderDependencyGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc) {}

RenderDependencyGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc) {}

RenderValueGraph::RenderValueGraph(const allocator_type& alloc) noexcept
: vertices(alloc),
  nodes(alloc),
  index(alloc) {}

// ContinuousContainer
void RenderValueGraph::reserve(vertices_size_type sz) {
    this->vertices.reserve(sz);
    nodes.reserve(sz);
}

RenderValueGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

RenderValueGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc) {}

RenderValueGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc) {}

} // namespace example

} // namespace render

} // namespace cc

// clang-format on
