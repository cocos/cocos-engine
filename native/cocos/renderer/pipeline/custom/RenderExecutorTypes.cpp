// clang-format off
#include "RenderExecutorTypes.h"

namespace cc {

namespace render {

DeviceResourceGraph::DeviceResourceGraph(const allocator_type& alloc) noexcept
: mVertices(alloc),
  mName(alloc),
  mRefCounts(alloc),
  mBuffers(alloc),
  mTextures(alloc) {}

// ContinuousContainer
void DeviceResourceGraph::reserve(vertices_size_type sz) {
    mVertices.reserve(sz);
    mName.reserve(sz);
    mRefCounts.reserve(sz);
}

DeviceResourceGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: mOutEdges(alloc),
  mInEdges(alloc) {}

DeviceResourceGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: mOutEdges(std::move(rhs.mOutEdges), alloc),
  mInEdges(std::move(rhs.mInEdges), alloc),
  mHandle(std::move(rhs.mHandle)) {}

DeviceResourceGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: mOutEdges(rhs.mOutEdges, alloc),
  mInEdges(rhs.mInEdges, alloc),
  mHandle(rhs.mHandle) {}

} // namespace render

} // namespace cc
