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

DescriptorDB::DescriptorDB(const allocator_type& alloc) noexcept
: blocks(alloc) {}

DescriptorDB::DescriptorDB(DescriptorDB&& rhs, const allocator_type& alloc)
: blocks(std::move(rhs.blocks), alloc) {}

DescriptorDB::DescriptorDB(DescriptorDB const& rhs, const allocator_type& alloc)
: blocks(rhs.blocks, alloc) {}

RenderPhase::RenderPhase(const allocator_type& alloc) noexcept
: shaders(alloc) {}

RenderPhase::RenderPhase(RenderPhase&& rhs, const allocator_type& alloc)
: shaders(std::move(rhs.shaders), alloc) {}

RenderPhase::RenderPhase(RenderPhase const& rhs, const allocator_type& alloc)
: shaders(rhs.shaders, alloc) {}

LayoutGraph::LayoutGraph(const allocator_type& alloc) noexcept
: vertices(alloc),
  names(alloc),
  descriptors(alloc),
  stages(alloc),
  phases(alloc),
  pathIndex(alloc) {}

LayoutGraph::LayoutGraph(LayoutGraph&& rhs, const allocator_type& alloc)
: vertices(std::move(rhs.vertices), alloc),
  names(std::move(rhs.names), alloc),
  descriptors(std::move(rhs.descriptors), alloc),
  stages(std::move(rhs.stages), alloc),
  phases(std::move(rhs.phases), alloc),
  pathIndex(std::move(rhs.pathIndex), alloc) {}

LayoutGraph::LayoutGraph(LayoutGraph const& rhs, const allocator_type& alloc)
: vertices(rhs.vertices, alloc),
  names(rhs.names, alloc),
  descriptors(rhs.descriptors, alloc),
  stages(rhs.stages, alloc),
  phases(rhs.phases, alloc),
  pathIndex(rhs.pathIndex, alloc) {}

// ContinuousContainer
void LayoutGraph::reserve(vertices_size_type sz) {
    vertices.reserve(sz);
    names.reserve(sz);
    descriptors.reserve(sz);
}

LayoutGraph::Vertex::Vertex(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

LayoutGraph::Vertex::Vertex(Vertex&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc),
  handle(std::move(rhs.handle)) {}

LayoutGraph::Vertex::Vertex(Vertex const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc),
  handle(rhs.handle) {}

UniformBlockData::UniformBlockData(const allocator_type& alloc) noexcept
: uniforms(alloc) {}

UniformBlockData::UniformBlockData(UniformBlockData&& rhs, const allocator_type& alloc)
: bufferSize(rhs.bufferSize),
  uniforms(std::move(rhs.uniforms), alloc) {}

UniformBlockData::UniformBlockData(UniformBlockData const& rhs, const allocator_type& alloc)
: bufferSize(rhs.bufferSize),
  uniforms(rhs.uniforms, alloc) {}

DescriptorBlockData::DescriptorBlockData(const allocator_type& alloc) noexcept
: descriptors(alloc) {}

DescriptorBlockData::DescriptorBlockData(DescriptorTypeOrder typeIn, gfx::ShaderStageFlagBit visibilityIn, uint32_t capacityIn, const allocator_type& alloc) noexcept // NOLINT
: type(typeIn),
  visibility(visibilityIn),
  capacity(capacityIn),
  descriptors(alloc) {}

DescriptorBlockData::DescriptorBlockData(DescriptorBlockData&& rhs, const allocator_type& alloc)
: type(rhs.type),
  visibility(rhs.visibility),
  offset(rhs.offset),
  capacity(rhs.capacity),
  descriptors(std::move(rhs.descriptors), alloc) {}

DescriptorBlockData::DescriptorBlockData(DescriptorBlockData const& rhs, const allocator_type& alloc)
: type(rhs.type),
  visibility(rhs.visibility),
  offset(rhs.offset),
  capacity(rhs.capacity),
  descriptors(rhs.descriptors, alloc) {}

DescriptorSetLayoutData::DescriptorSetLayoutData(const allocator_type& alloc) noexcept
: descriptorBlocks(alloc),
  uniformBlocks(alloc) {}

DescriptorSetLayoutData::DescriptorSetLayoutData(uint32_t slotIn, uint32_t capacityIn, const allocator_type& alloc) noexcept // NOLINT
: slot(slotIn),
  capacity(capacityIn),
  descriptorBlocks(alloc),
  uniformBlocks(alloc) {}

DescriptorSetLayoutData::DescriptorSetLayoutData(DescriptorSetLayoutData&& rhs, const allocator_type& alloc)
: slot(rhs.slot),
  capacity(rhs.capacity),
  descriptorBlocks(std::move(rhs.descriptorBlocks), alloc),
  uniformBlocks(std::move(rhs.uniformBlocks), alloc) {}

DescriptorSetData::DescriptorSetData(const allocator_type& alloc) noexcept
: descriptorSetLayoutData(alloc) {}

DescriptorSetData::DescriptorSetData(DescriptorSetLayoutData descriptorSetLayoutDataIn, IntrusivePtr<gfx::DescriptorSetLayout> descriptorSetLayoutIn, IntrusivePtr<gfx::DescriptorSet> descriptorSetIn, const allocator_type& alloc) noexcept
: descriptorSetLayoutData(std::move(descriptorSetLayoutDataIn), alloc),
  descriptorSetLayout(std::move(descriptorSetLayoutIn)),
  descriptorSet(std::move(descriptorSetIn)) {}

DescriptorSetData::DescriptorSetData(DescriptorSetData&& rhs, const allocator_type& alloc)
: descriptorSetLayoutData(std::move(rhs.descriptorSetLayoutData), alloc),
  descriptorSetLayoutInfo(std::move(rhs.descriptorSetLayoutInfo)),
  descriptorSetLayout(std::move(rhs.descriptorSetLayout)),
  descriptorSet(std::move(rhs.descriptorSet)) {}

PipelineLayoutData::PipelineLayoutData(const allocator_type& alloc) noexcept
: descriptorSets(alloc) {}

PipelineLayoutData::PipelineLayoutData(PipelineLayoutData&& rhs, const allocator_type& alloc)
: descriptorSets(std::move(rhs.descriptorSets), alloc) {}

ShaderProgramData::ShaderProgramData(const allocator_type& alloc) noexcept
: layout(alloc) {}

ShaderProgramData::ShaderProgramData(ShaderProgramData&& rhs, const allocator_type& alloc)
: layout(std::move(rhs.layout), alloc) {}

RenderStageData::RenderStageData(const allocator_type& alloc) noexcept
: descriptorVisibility(alloc) {}

RenderStageData::RenderStageData(RenderStageData&& rhs, const allocator_type& alloc)
: descriptorVisibility(std::move(rhs.descriptorVisibility), alloc) {}

RenderPhaseData::RenderPhaseData(const allocator_type& alloc) noexcept
: rootSignature(alloc),
  shaderPrograms(alloc),
  shaderIndex(alloc) {}

RenderPhaseData::RenderPhaseData(RenderPhaseData&& rhs, const allocator_type& alloc)
: rootSignature(std::move(rhs.rootSignature), alloc),
  shaderPrograms(std::move(rhs.shaderPrograms), alloc),
  shaderIndex(std::move(rhs.shaderIndex), alloc) {}

LayoutGraphData::LayoutGraphData(const allocator_type& alloc) noexcept
: vertices(alloc),
  names(alloc),
  updateFrequencies(alloc),
  layouts(alloc),
  stages(alloc),
  phases(alloc),
  valueNames(alloc),
  attributeIndex(alloc),
  constantIndex(alloc),
  shaderLayoutIndex(alloc),
  pathIndex(alloc) {}

LayoutGraphData::LayoutGraphData(LayoutGraphData&& rhs, const allocator_type& alloc)
: vertices(std::move(rhs.vertices), alloc),
  names(std::move(rhs.names), alloc),
  updateFrequencies(std::move(rhs.updateFrequencies), alloc),
  layouts(std::move(rhs.layouts), alloc),
  stages(std::move(rhs.stages), alloc),
  phases(std::move(rhs.phases), alloc),
  valueNames(std::move(rhs.valueNames), alloc),
  attributeIndex(std::move(rhs.attributeIndex), alloc),
  constantIndex(std::move(rhs.constantIndex), alloc),
  shaderLayoutIndex(std::move(rhs.shaderLayoutIndex), alloc),
  pathIndex(std::move(rhs.pathIndex), alloc) {}

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
