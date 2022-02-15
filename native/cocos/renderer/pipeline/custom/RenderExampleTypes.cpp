// clang-format off
#include "RenderExampleTypes.h"

namespace cc {

namespace render {

namespace example {

RenderPassNode::RenderPassNode(const allocator_type& alloc) noexcept
: mOutputs(alloc),
  mInputs(alloc) {}

RenderPassNode::RenderPassNode(RenderPassNode&& rhs, const allocator_type& alloc)
: mOutputs(std::move(rhs.mOutputs), alloc),
  mInputs(std::move(rhs.mInputs), alloc) {}

RenderPassNode::RenderPassNode(RenderPassNode const& rhs, const allocator_type& alloc)
: mOutputs(rhs.mOutputs, alloc),
  mInputs(rhs.mInputs, alloc) {}

RenderDependencyGraph::RenderDependencyGraph(const allocator_type& alloc) noexcept
: mVertices(alloc),
  mPasses(alloc),
  mValueIDs(alloc),
  mPassIDs(alloc),
  mTraits(alloc),
  mEdges(alloc),
  mPassIndex(alloc),
  mValueIndex(alloc),
  mValueNames(alloc),
  mResourceHandles(alloc) {}

// ContinuousContainer
void RenderDependencyGraph::reserve(vertices_size_type sz) {
    mVertices.reserve(sz);
    mPasses.reserve(sz);
    mValueIDs.reserve(sz);
    mPassIDs.reserve(sz);
    mTraits.reserve(sz);
}

RenderDependencyGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: mOutEdges(alloc),
  mInEdges(alloc) {}

RenderDependencyGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: mOutEdges(std::move(rhs.mOutEdges), alloc),
  mInEdges(std::move(rhs.mInEdges), alloc) {}

RenderDependencyGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: mOutEdges(rhs.mOutEdges, alloc),
  mInEdges(rhs.mInEdges, alloc) {}

RenderValueGraph::RenderValueGraph(const allocator_type& alloc) noexcept
: mVertices(alloc),
  mNodes(alloc),
  mIndex(alloc) {}

// ContinuousContainer
void RenderValueGraph::reserve(vertices_size_type sz) {
    mVertices.reserve(sz);
    mNodes.reserve(sz);
}

RenderValueGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: mOutEdges(alloc),
  mInEdges(alloc) {}

RenderValueGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: mOutEdges(std::move(rhs.mOutEdges), alloc),
  mInEdges(std::move(rhs.mInEdges), alloc) {}

RenderValueGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: mOutEdges(rhs.mOutEdges, alloc),
  mInEdges(rhs.mInEdges, alloc) {}

} // namespace example

} // namespace render

} // namespace cc
