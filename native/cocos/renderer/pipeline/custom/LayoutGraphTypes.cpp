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
#include "LayoutGraphTypes.h"

namespace cc {

namespace render {

ConstantBufferData::ConstantBufferData(const allocator_type& alloc) noexcept
: constants(alloc) {}

ConstantBufferData::ConstantBufferData(ConstantBufferData&& rhs, const allocator_type& alloc)
: size(rhs.size),
  constants(std::move(rhs.constants), alloc) {}

ConstantBufferData::ConstantBufferData(ConstantBufferData const& rhs, const allocator_type& alloc)
: size(rhs.size),
  constants(rhs.constants, alloc) {}

DescriptorBlockData::DescriptorBlockData(const allocator_type& alloc) noexcept
: attributeIDs(alloc) {}

DescriptorBlockData::DescriptorBlockData(DescriptorBlockData&& rhs, const allocator_type& alloc)
: type(rhs.type),
  capacity(rhs.capacity),
  attributeIDs(std::move(rhs.attributeIDs), alloc) {}

DescriptorBlockData::DescriptorBlockData(DescriptorBlockData const& rhs, const allocator_type& alloc)
: type(rhs.type),
  capacity(rhs.capacity),
  attributeIDs(rhs.attributeIDs, alloc) {}

UnboundedDescriptorData::UnboundedDescriptorData(const allocator_type& alloc) noexcept
: descriptors(alloc) {}

UnboundedDescriptorData::UnboundedDescriptorData(UnboundedDescriptorData&& rhs, const allocator_type& alloc)
: type(rhs.type),
  descriptors(std::move(rhs.descriptors), alloc) {}

UnboundedDescriptorData::UnboundedDescriptorData(UnboundedDescriptorData const& rhs, const allocator_type& alloc)
: type(rhs.type),
  descriptors(rhs.descriptors, alloc) {}

DescriptorTableData::DescriptorTableData(const allocator_type& alloc) noexcept
: blocks(alloc) {}

DescriptorTableData::DescriptorTableData(DescriptorTableData&& rhs, const allocator_type& alloc)
: slot(rhs.slot),
  capacity(rhs.capacity),
  blocks(std::move(rhs.blocks), alloc) {}

DescriptorTableData::DescriptorTableData(DescriptorTableData const& rhs, const allocator_type& alloc)
: slot(rhs.slot),
  capacity(rhs.capacity),
  blocks(rhs.blocks, alloc) {}

DescriptorSetData::DescriptorSetData(const allocator_type& alloc) noexcept
: tables(alloc),
  unbounded(alloc) {}

DescriptorSetData::DescriptorSetData(DescriptorSetData&& rhs, const allocator_type& alloc)
: tables(std::move(rhs.tables), alloc),
  unbounded(std::move(rhs.unbounded), alloc) {}

DescriptorSetData::DescriptorSetData(DescriptorSetData const& rhs, const allocator_type& alloc)
: tables(rhs.tables, alloc),
  unbounded(rhs.unbounded, alloc) {}

LayoutData::LayoutData(const allocator_type& alloc) noexcept
: constantBuffers(alloc),
  descriptorSets(alloc) {}

LayoutData::LayoutData(LayoutData&& rhs, const allocator_type& alloc)
: constantBuffers(std::move(rhs.constantBuffers), alloc),
  descriptorSets(std::move(rhs.descriptorSets), alloc) {}

LayoutData::LayoutData(LayoutData const& rhs, const allocator_type& alloc)
: constantBuffers(rhs.constantBuffers, alloc),
  descriptorSets(rhs.descriptorSets, alloc) {}

ShaderProgramData::ShaderProgramData(const allocator_type& alloc) noexcept
: layouts(alloc) {}

ShaderProgramData::ShaderProgramData(ShaderProgramData&& rhs, const allocator_type& alloc)
: layouts(std::move(rhs.layouts), alloc) {}

ShaderProgramData::ShaderProgramData(ShaderProgramData const& rhs, const allocator_type& alloc)
: layouts(rhs.layouts, alloc) {}

ShaderNodeData::ShaderNodeData(const allocator_type& alloc) noexcept
: shaderPrograms(alloc),
  shaderIndex(alloc) {}

ShaderNodeData::ShaderNodeData(ShaderNodeData&& rhs, const allocator_type& alloc)
: rootSignature(std::move(rhs.rootSignature)),
  shaderPrograms(std::move(rhs.shaderPrograms), alloc),
  shaderIndex(std::move(rhs.shaderIndex), alloc) {}

ShaderNodeData::ShaderNodeData(ShaderNodeData const& rhs, const allocator_type& alloc)
: rootSignature(rhs.rootSignature),
  shaderPrograms(rhs.shaderPrograms, alloc),
  shaderIndex(rhs.shaderIndex, alloc) {}

LayoutGraphData::LayoutGraphData(const allocator_type& alloc) noexcept
: vertices(alloc),
  names(alloc),
  updateFrequencies(alloc),
  layouts(alloc),
  groupNodes(alloc),
  shaderNodes(alloc),
  pathIndex(alloc) {}

LayoutGraphData::LayoutGraphData(LayoutGraphData&& rhs, const allocator_type& alloc)
: vertices(std::move(rhs.vertices), alloc),
  names(std::move(rhs.names), alloc),
  updateFrequencies(std::move(rhs.updateFrequencies), alloc),
  layouts(std::move(rhs.layouts), alloc),
  groupNodes(std::move(rhs.groupNodes), alloc),
  shaderNodes(std::move(rhs.shaderNodes), alloc),
  pathIndex(std::move(rhs.pathIndex), alloc) {}

LayoutGraphData::LayoutGraphData(LayoutGraphData const& rhs, const allocator_type& alloc)
: vertices(rhs.vertices, alloc),
  names(rhs.names, alloc),
  updateFrequencies(rhs.updateFrequencies, alloc),
  layouts(rhs.layouts, alloc),
  groupNodes(rhs.groupNodes, alloc),
  shaderNodes(rhs.shaderNodes, alloc),
  pathIndex(rhs.pathIndex, alloc) {}

// ContinuousContainer
void LayoutGraphData::reserve(vertices_size_type sz) {
    vertices.reserve(sz);
    names.reserve(sz);
    updateFrequencies.reserve(sz);
    layouts.reserve(sz);
}

LayoutGraphData::Vertex::Vertex(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

LayoutGraphData::Vertex::Vertex(Vertex&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc),
  handle(std::move(rhs.handle)) {}

LayoutGraphData::Vertex::Vertex(Vertex const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc),
  handle(rhs.handle) {}

} // namespace render

} // namespace cc

// clang-format on
