// clang-format off
#include "LayoutGraphTypes.h"

namespace cc {

namespace render {

ConstantBuffer::ConstantBuffer(const allocator_type& alloc) noexcept
: constants(alloc) {}

ConstantBuffer::ConstantBuffer(ConstantBuffer&& rhs, const allocator_type& alloc)
: size(rhs.size),
  constants(std::move(rhs.constants), alloc) {}

ConstantBuffer::ConstantBuffer(ConstantBuffer const& rhs, const allocator_type& alloc)
: size(rhs.size),
  constants(rhs.constants, alloc) {}

DescriptorBlock::DescriptorBlock(const allocator_type& alloc) noexcept
: attributeIDs(alloc) {}

DescriptorBlock::DescriptorBlock(DescriptorBlock&& rhs, const allocator_type& alloc)
: type(rhs.type),
  capacity(rhs.capacity),
  attributeIDs(std::move(rhs.attributeIDs), alloc) {}

DescriptorBlock::DescriptorBlock(DescriptorBlock const& rhs, const allocator_type& alloc)
: type(rhs.type),
  capacity(rhs.capacity),
  attributeIDs(rhs.attributeIDs, alloc) {}

UnboundedDescriptor::UnboundedDescriptor(const allocator_type& alloc) noexcept
: descriptors(alloc) {}

UnboundedDescriptor::UnboundedDescriptor(UnboundedDescriptor&& rhs, const allocator_type& alloc)
: type(rhs.type),
  descriptors(std::move(rhs.descriptors), alloc) {}

UnboundedDescriptor::UnboundedDescriptor(UnboundedDescriptor const& rhs, const allocator_type& alloc)
: type(rhs.type),
  descriptors(rhs.descriptors, alloc) {}

DescriptorTable::DescriptorTable(const allocator_type& alloc) noexcept
: blocks(alloc) {}

DescriptorTable::DescriptorTable(DescriptorTable&& rhs, const allocator_type& alloc)
: slot(rhs.slot),
  capacity(rhs.capacity),
  blocks(std::move(rhs.blocks), alloc) {}

DescriptorTable::DescriptorTable(DescriptorTable const& rhs, const allocator_type& alloc)
: slot(rhs.slot),
  capacity(rhs.capacity),
  blocks(rhs.blocks, alloc) {}

DescriptorSet::DescriptorSet(const allocator_type& alloc) noexcept
: tables(alloc),
  unbounded(alloc) {}

DescriptorSet::DescriptorSet(DescriptorSet&& rhs, const allocator_type& alloc)
: tables(std::move(rhs.tables), alloc),
  unbounded(std::move(rhs.unbounded), alloc) {}

DescriptorSet::DescriptorSet(DescriptorSet const& rhs, const allocator_type& alloc)
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

LayoutGraph::LayoutGraph(const allocator_type& alloc) noexcept
: vertices(alloc),
  names(alloc),
  updateFrequencies(alloc),
  layouts(alloc),
  groupNodes(alloc),
  shaderNodes(alloc),
  pathIndex(alloc) {}

LayoutGraph::LayoutGraph(LayoutGraph&& rhs, const allocator_type& alloc)
: vertices(std::move(rhs.vertices), alloc),
  names(std::move(rhs.names), alloc),
  updateFrequencies(std::move(rhs.updateFrequencies), alloc),
  layouts(std::move(rhs.layouts), alloc),
  groupNodes(std::move(rhs.groupNodes), alloc),
  shaderNodes(std::move(rhs.shaderNodes), alloc),
  pathIndex(std::move(rhs.pathIndex), alloc) {}

LayoutGraph::LayoutGraph(LayoutGraph const& rhs, const allocator_type& alloc)
: vertices(rhs.vertices, alloc),
  names(rhs.names, alloc),
  updateFrequencies(rhs.updateFrequencies, alloc),
  layouts(rhs.layouts, alloc),
  groupNodes(rhs.groupNodes, alloc),
  shaderNodes(rhs.shaderNodes, alloc),
  pathIndex(rhs.pathIndex, alloc) {}

// ContinuousContainer
void LayoutGraph::reserve(vertices_size_type sz) {
    this->vertices.reserve(sz);
    names.reserve(sz);
    updateFrequencies.reserve(sz);
    layouts.reserve(sz);
}

LayoutGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

LayoutGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc),
  handle(std::move(rhs.handle)) {}

LayoutGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc),
  handle(rhs.handle) {}

} // namespace render

} // namespace cc
