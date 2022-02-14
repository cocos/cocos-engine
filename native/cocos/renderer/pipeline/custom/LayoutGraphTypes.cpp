#include "LayoutGraphTypes.h"

namespace cc {

namespace render {

ConstantBuffer::ConstantBuffer(const allocator_type& alloc) noexcept
: mConstants(alloc) {}

ConstantBuffer::ConstantBuffer(ConstantBuffer&& rhs, const allocator_type& alloc)
: mSize(rhs.mSize),
  mConstants(std::move(rhs.mConstants), alloc) {}

ConstantBuffer::ConstantBuffer(ConstantBuffer const& rhs, const allocator_type& alloc)
: mSize(rhs.mSize),
  mConstants(rhs.mConstants, alloc) {}

DescriptorBlock::DescriptorBlock(const allocator_type& alloc) noexcept
: mAttributeIDs(alloc) {}

DescriptorBlock::DescriptorBlock(DescriptorBlock&& rhs, const allocator_type& alloc)
: mType(rhs.mType),
  mCapacity(rhs.mCapacity),
  mAttributeIDs(std::move(rhs.mAttributeIDs), alloc) {}

DescriptorBlock::DescriptorBlock(DescriptorBlock const& rhs, const allocator_type& alloc)
: mType(rhs.mType),
  mCapacity(rhs.mCapacity),
  mAttributeIDs(rhs.mAttributeIDs, alloc) {}

UnboundedDescriptor::UnboundedDescriptor(const allocator_type& alloc) noexcept
: mDescriptors(alloc) {}

UnboundedDescriptor::UnboundedDescriptor(UnboundedDescriptor&& rhs, const allocator_type& alloc)
: mType(rhs.mType),
  mDescriptors(std::move(rhs.mDescriptors), alloc) {}

UnboundedDescriptor::UnboundedDescriptor(UnboundedDescriptor const& rhs, const allocator_type& alloc)
: mType(rhs.mType),
  mDescriptors(rhs.mDescriptors, alloc) {}

DescriptorTable::DescriptorTable(const allocator_type& alloc) noexcept
: mBlocks(alloc) {}

DescriptorTable::DescriptorTable(DescriptorTable&& rhs, const allocator_type& alloc)
: mSlot(rhs.mSlot),
  mCapacity(rhs.mCapacity),
  mBlocks(std::move(rhs.mBlocks), alloc) {}

DescriptorTable::DescriptorTable(DescriptorTable const& rhs, const allocator_type& alloc)
: mSlot(rhs.mSlot),
  mCapacity(rhs.mCapacity),
  mBlocks(rhs.mBlocks, alloc) {}

DescriptorSet::DescriptorSet(const allocator_type& alloc) noexcept
: mTables(alloc),
  mUnbounded(alloc) {}

DescriptorSet::DescriptorSet(DescriptorSet&& rhs, const allocator_type& alloc)
: mTables(std::move(rhs.mTables), alloc),
  mUnbounded(std::move(rhs.mUnbounded), alloc) {}

DescriptorSet::DescriptorSet(DescriptorSet const& rhs, const allocator_type& alloc)
: mTables(rhs.mTables, alloc),
  mUnbounded(rhs.mUnbounded, alloc) {}

LayoutData::LayoutData(const allocator_type& alloc) noexcept
: mConstantBuffers(alloc),
  mDescriptorSets(alloc) {}

LayoutData::LayoutData(LayoutData&& rhs, const allocator_type& alloc)
: mConstantBuffers(std::move(rhs.mConstantBuffers), alloc),
  mDescriptorSets(std::move(rhs.mDescriptorSets), alloc) {}

LayoutData::LayoutData(LayoutData const& rhs, const allocator_type& alloc)
: mConstantBuffers(rhs.mConstantBuffers, alloc),
  mDescriptorSets(rhs.mDescriptorSets, alloc) {}

ShaderProgramData::ShaderProgramData(const allocator_type& alloc) noexcept
: mLayouts(alloc) {}

ShaderProgramData::ShaderProgramData(ShaderProgramData&& rhs, const allocator_type& alloc)
: mLayouts(std::move(rhs.mLayouts), alloc) {}

ShaderProgramData::ShaderProgramData(ShaderProgramData const& rhs, const allocator_type& alloc)
: mLayouts(rhs.mLayouts, alloc) {}

ShaderNodeData::ShaderNodeData(const allocator_type& alloc) noexcept
: mShaderPrograms(alloc),
  mShaderIndex(alloc) {}

ShaderNodeData::ShaderNodeData(ShaderNodeData&& rhs, const allocator_type& alloc)
: mRootSignature(std::move(rhs.mRootSignature)),
  mShaderPrograms(std::move(rhs.mShaderPrograms), alloc),
  mShaderIndex(std::move(rhs.mShaderIndex), alloc) {}

ShaderNodeData::ShaderNodeData(ShaderNodeData const& rhs, const allocator_type& alloc)
: mRootSignature(rhs.mRootSignature),
  mShaderPrograms(rhs.mShaderPrograms, alloc),
  mShaderIndex(rhs.mShaderIndex, alloc) {}

LayoutGraph::LayoutGraph(const allocator_type& alloc) noexcept
: mVertices(alloc),
  mName(alloc),
  mUpdateFrequencies(alloc),
  mLayouts(alloc),
  mGroupNodes(alloc),
  mShaderNodes(alloc),
  mPathIndex(alloc) {}

LayoutGraph::LayoutGraph(LayoutGraph&& rhs, const allocator_type& alloc)
: mVertices(std::move(rhs.mVertices), alloc),
  mName(std::move(rhs.mName), alloc),
  mUpdateFrequencies(std::move(rhs.mUpdateFrequencies), alloc),
  mLayouts(std::move(rhs.mLayouts), alloc),
  mGroupNodes(std::move(rhs.mGroupNodes), alloc),
  mShaderNodes(std::move(rhs.mShaderNodes), alloc),
  mPathIndex(std::move(rhs.mPathIndex), alloc) {}

LayoutGraph::LayoutGraph(LayoutGraph const& rhs, const allocator_type& alloc)
: mVertices(rhs.mVertices, alloc),
  mName(rhs.mName, alloc),
  mUpdateFrequencies(rhs.mUpdateFrequencies, alloc),
  mLayouts(rhs.mLayouts, alloc),
  mGroupNodes(rhs.mGroupNodes, alloc),
  mShaderNodes(rhs.mShaderNodes, alloc),
  mPathIndex(rhs.mPathIndex, alloc) {}

// ContinuousContainer
void LayoutGraph::reserve(vertices_size_type sz) {
    mVertices.reserve(sz);
    mName.reserve(sz);
    mUpdateFrequencies.reserve(sz);
    mLayouts.reserve(sz);
}

LayoutGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: mOutEdges(alloc),
  mInEdges(alloc) {}

LayoutGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: mOutEdges(std::move(rhs.mOutEdges), alloc),
  mInEdges(std::move(rhs.mInEdges), alloc),
  mHandle(std::move(rhs.mHandle)) {}

LayoutGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: mOutEdges(rhs.mOutEdges, alloc),
  mInEdges(rhs.mInEdges, alloc),
  mHandle(rhs.mHandle) {}

} // namespace render

} // namespace cc
