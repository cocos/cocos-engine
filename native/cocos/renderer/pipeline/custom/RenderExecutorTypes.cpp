/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#include "RenderExecutorTypes.h"

namespace cc {

namespace render {

DeviceResourceGraph::DeviceResourceGraph(const allocator_type& alloc) noexcept
: vertices(alloc),
  names(alloc),
  refCounts(alloc),
  buffers(alloc),
  textures(alloc) {}

// ContinuousContainer
void DeviceResourceGraph::reserve(vertices_size_type sz) {
    vertices.reserve(sz);
    names.reserve(sz);
    refCounts.reserve(sz);
}

DeviceResourceGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

DeviceResourceGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc),
  handle(std::move(rhs.handle)) {}

DeviceResourceGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc),
  handle(rhs.handle) {}

} // namespace render

} // namespace cc

// clang-format on
