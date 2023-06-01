/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#include "FGDispatcherTypes.h"

namespace cc {

namespace render {

ResourceAccessGraph::ResourceAccessGraph(const allocator_type& alloc) noexcept
: _vertices(alloc),
  passID(alloc),
  access(alloc),
  passIndex(alloc),
  resourceNames(alloc),
  resourceIndex(alloc),
  leafPasses(alloc),
  culledPasses(alloc),
  accessRecord(alloc),
  resourceLifeRecord(alloc),
  topologicalOrder(alloc),
  rpInfos(alloc),
  subpassIndex(alloc) {}

// ContinuousContainer
void ResourceAccessGraph::reserve(vertices_size_type sz) {
    _vertices.reserve(sz);
    passID.reserve(sz);
    access.reserve(sz);
}

ResourceAccessGraph::Vertex::Vertex(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

ResourceAccessGraph::Vertex::Vertex(Vertex&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc) {}

ResourceAccessGraph::Vertex::Vertex(Vertex const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc) {}

RelationGraph::RelationGraph(const allocator_type& alloc) noexcept
: _vertices(alloc),
  descID(alloc),
  vertexMap(alloc) {}

// ContinuousContainer
void RelationGraph::reserve(vertices_size_type sz) {
    _vertices.reserve(sz);
    descID.reserve(sz);
}

RelationGraph::Vertex::Vertex(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

RelationGraph::Vertex::Vertex(Vertex&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc) {}

RelationGraph::Vertex::Vertex(Vertex const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc) {}

FrameGraphDispatcher::FrameGraphDispatcher(ResourceGraph& resourceGraphIn, const RenderGraph& graphIn, const LayoutGraphData& layoutGraphIn, boost::container::pmr::memory_resource* scratchIn, const allocator_type& alloc) noexcept
: resourceAccessGraph(alloc),
  resourceGraph(resourceGraphIn),
  graph(graphIn),
  layoutGraph(layoutGraphIn),
  scratch(scratchIn),
  externalResMap(alloc),
  relationGraph(alloc) {}

} // namespace render

} // namespace cc

// clang-format on
