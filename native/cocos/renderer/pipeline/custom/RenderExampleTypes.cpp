/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
    vertices.reserve(sz);
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
    vertices.reserve(sz);
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
