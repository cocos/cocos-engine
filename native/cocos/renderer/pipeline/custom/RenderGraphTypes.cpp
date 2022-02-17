// clang-format off
#include "RenderGraphTypes.h"

namespace cc {

namespace render {

ResourceGraph::ResourceGraph(const allocator_type& alloc) noexcept
: vertices(alloc),
  names(alloc),
  descs(alloc),
  traits(alloc),
  valueIndex(alloc) {}

ResourceGraph::ResourceGraph(ResourceGraph&& rhs, const allocator_type& alloc)
: vertices(std::move(rhs.vertices), alloc),
  names(std::move(rhs.names), alloc),
  descs(std::move(rhs.descs), alloc),
  traits(std::move(rhs.traits), alloc),
  valueIndex(std::move(rhs.valueIndex), alloc) {}

ResourceGraph::ResourceGraph(ResourceGraph const& rhs, const allocator_type& alloc)
: vertices(rhs.vertices, alloc),
  names(rhs.names, alloc),
  descs(rhs.descs, alloc),
  traits(rhs.traits, alloc),
  valueIndex(rhs.valueIndex, alloc) {}

// ContinuousContainer
void ResourceGraph::reserve(vertices_size_type sz) {
    this->vertices.reserve(sz);
    names.reserve(sz);
    descs.reserve(sz);
    traits.reserve(sz);
}

ResourceGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

ResourceGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc) {}

ResourceGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc) {}

RasterView::RasterView(const allocator_type& alloc) noexcept
: slotName(alloc) {}

RasterView::RasterView(PmrString slotNameIn, AccessType accessTypeIn, AttachmentType attachmentTypeIn, gfx::LoadOp loadOpIn, gfx::StoreOp storeOpIn, gfx::ClearFlagBit clearFlagsIn, gfx::Color clearColorIn, const allocator_type& alloc) noexcept
: slotName(std::move(slotNameIn), alloc),
  accessType(accessTypeIn),
  attachmentType(attachmentTypeIn),
  loadOp(loadOpIn),
  storeOp(storeOpIn),
  clearFlags(clearFlagsIn),
  clearColor(clearColorIn) {}

RasterView::RasterView(RasterView&& rhs, const allocator_type& alloc)
: slotName(std::move(rhs.slotName), alloc),
  accessType(rhs.accessType),
  attachmentType(rhs.attachmentType),
  loadOp(rhs.loadOp),
  storeOp(rhs.storeOp),
  clearFlags(rhs.clearFlags),
  clearColor(rhs.clearColor) {}

RasterView::RasterView(RasterView const& rhs, const allocator_type& alloc)
: slotName(rhs.slotName, alloc),
  accessType(rhs.accessType),
  attachmentType(rhs.attachmentType),
  loadOp(rhs.loadOp),
  storeOp(rhs.storeOp),
  clearFlags(rhs.clearFlags),
  clearColor(rhs.clearColor) {}

ComputeView::ComputeView(const allocator_type& alloc) noexcept
: name(alloc) {}

ComputeView::ComputeView(ComputeView&& rhs, const allocator_type& alloc)
: name(std::move(rhs.name), alloc),
  accessType(rhs.accessType),
  clearFlags(rhs.clearFlags),
  clearColor(rhs.clearColor),
  clearValueType(rhs.clearValueType) {}

ComputeView::ComputeView(ComputeView const& rhs, const allocator_type& alloc)
: name(rhs.name, alloc),
  accessType(rhs.accessType),
  clearFlags(rhs.clearFlags),
  clearColor(rhs.clearColor),
  clearValueType(rhs.clearValueType) {}

RasterSubpass::RasterSubpass(const allocator_type& alloc) noexcept
: rasterViews(alloc),
  computeViews(alloc) {}

RasterSubpass::RasterSubpass(RasterSubpass&& rhs, const allocator_type& alloc)
: rasterViews(std::move(rhs.rasterViews), alloc),
  computeViews(std::move(rhs.computeViews), alloc) {}

RasterSubpass::RasterSubpass(RasterSubpass const& rhs, const allocator_type& alloc)
: rasterViews(rhs.rasterViews, alloc),
  computeViews(rhs.computeViews, alloc) {}

SubpassGraph::SubpassGraph(const allocator_type& alloc) noexcept
: vertices(alloc),
  names(alloc),
  subpasses(alloc) {}

SubpassGraph::SubpassGraph(SubpassGraph&& rhs, const allocator_type& alloc)
: vertices(std::move(rhs.vertices), alloc),
  names(std::move(rhs.names), alloc),
  subpasses(std::move(rhs.subpasses), alloc) {}

SubpassGraph::SubpassGraph(SubpassGraph const& rhs, const allocator_type& alloc)
: vertices(rhs.vertices, alloc),
  names(rhs.names, alloc),
  subpasses(rhs.subpasses, alloc) {}

// ContinuousContainer
void SubpassGraph::reserve(vertices_size_type sz) {
    this->vertices.reserve(sz);
    names.reserve(sz);
    subpasses.reserve(sz);
}

SubpassGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

SubpassGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc) {}

SubpassGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc) {}

RasterPassData::RasterPassData(const allocator_type& alloc) noexcept
: rasterViews(alloc),
  computeViews(alloc),
  subpassGraph(alloc) {}

RasterPassData::RasterPassData(RasterPassData&& rhs, const allocator_type& alloc)
: rasterViews(std::move(rhs.rasterViews), alloc),
  computeViews(std::move(rhs.computeViews), alloc),
  subpassGraph(std::move(rhs.subpassGraph), alloc) {}

RasterPassData::RasterPassData(RasterPassData const& rhs, const allocator_type& alloc)
: rasterViews(rhs.rasterViews, alloc),
  computeViews(rhs.computeViews, alloc),
  subpassGraph(rhs.subpassGraph, alloc) {}

ComputePassData::ComputePassData(const allocator_type& alloc) noexcept
: computeViews(alloc) {}

ComputePassData::ComputePassData(ComputePassData&& rhs, const allocator_type& alloc)
: computeViews(std::move(rhs.computeViews), alloc) {}

ComputePassData::ComputePassData(ComputePassData const& rhs, const allocator_type& alloc)
: computeViews(rhs.computeViews, alloc) {}

CopyPair::CopyPair(const allocator_type& alloc) noexcept
: source(alloc),
  target(alloc) {}

CopyPair::CopyPair(PmrString sourceIn, PmrString targetIn, uint32_t mipLevelsIn, uint32_t numSlicesIn, uint32_t sourceMostDetailedMipIn, uint32_t sourceFirstSliceIn, uint32_t sourcePlaneSliceIn, uint32_t targetMostDetailedMipIn, uint32_t targetFirstSliceIn, uint32_t targetPlaneSliceIn, const allocator_type& alloc) noexcept // NOLINT
: source(std::move(sourceIn), alloc),
  target(std::move(targetIn), alloc),
  mipLevels(mipLevelsIn),
  numSlices(numSlicesIn),
  sourceMostDetailedMip(sourceMostDetailedMipIn),
  sourceFirstSlice(sourceFirstSliceIn),
  sourcePlaneSlice(sourcePlaneSliceIn),
  targetMostDetailedMip(targetMostDetailedMipIn),
  targetFirstSlice(targetFirstSliceIn),
  targetPlaneSlice(targetPlaneSliceIn) {}

CopyPair::CopyPair(CopyPair&& rhs, const allocator_type& alloc)
: source(std::move(rhs.source), alloc),
  target(std::move(rhs.target), alloc),
  mipLevels(rhs.mipLevels),
  numSlices(rhs.numSlices),
  sourceMostDetailedMip(rhs.sourceMostDetailedMip),
  sourceFirstSlice(rhs.sourceFirstSlice),
  sourcePlaneSlice(rhs.sourcePlaneSlice),
  targetMostDetailedMip(rhs.targetMostDetailedMip),
  targetFirstSlice(rhs.targetFirstSlice),
  targetPlaneSlice(rhs.targetPlaneSlice) {}

CopyPair::CopyPair(CopyPair const& rhs, const allocator_type& alloc)
: source(rhs.source, alloc),
  target(rhs.target, alloc),
  mipLevels(rhs.mipLevels),
  numSlices(rhs.numSlices),
  sourceMostDetailedMip(rhs.sourceMostDetailedMip),
  sourceFirstSlice(rhs.sourceFirstSlice),
  sourcePlaneSlice(rhs.sourcePlaneSlice),
  targetMostDetailedMip(rhs.targetMostDetailedMip),
  targetFirstSlice(rhs.targetFirstSlice),
  targetPlaneSlice(rhs.targetPlaneSlice) {}

CopyPassData::CopyPassData(const allocator_type& alloc) noexcept
: copyPairs(alloc) {}

CopyPassData::CopyPassData(CopyPassData&& rhs, const allocator_type& alloc)
: copyPairs(std::move(rhs.copyPairs), alloc) {}

CopyPassData::CopyPassData(CopyPassData const& rhs, const allocator_type& alloc)
: copyPairs(rhs.copyPairs, alloc) {}

MovePair::MovePair(const allocator_type& alloc) noexcept
: source(alloc),
  target(alloc) {}

MovePair::MovePair(PmrString sourceIn, PmrString targetIn, uint32_t mipLevelsIn, uint32_t numSlicesIn, uint32_t targetMostDetailedMipIn, uint32_t targetFirstSliceIn, uint32_t targetPlaneSliceIn, const allocator_type& alloc) noexcept // NOLINT
: source(std::move(sourceIn), alloc),
  target(std::move(targetIn), alloc),
  mipLevels(mipLevelsIn),
  numSlices(numSlicesIn),
  targetMostDetailedMip(targetMostDetailedMipIn),
  targetFirstSlice(targetFirstSliceIn),
  targetPlaneSlice(targetPlaneSliceIn) {}

MovePair::MovePair(MovePair&& rhs, const allocator_type& alloc)
: source(std::move(rhs.source), alloc),
  target(std::move(rhs.target), alloc),
  mipLevels(rhs.mipLevels),
  numSlices(rhs.numSlices),
  targetMostDetailedMip(rhs.targetMostDetailedMip),
  targetFirstSlice(rhs.targetFirstSlice),
  targetPlaneSlice(rhs.targetPlaneSlice) {}

MovePair::MovePair(MovePair const& rhs, const allocator_type& alloc)
: source(rhs.source, alloc),
  target(rhs.target, alloc),
  mipLevels(rhs.mipLevels),
  numSlices(rhs.numSlices),
  targetMostDetailedMip(rhs.targetMostDetailedMip),
  targetFirstSlice(rhs.targetFirstSlice),
  targetPlaneSlice(rhs.targetPlaneSlice) {}

MovePassData::MovePassData(const allocator_type& alloc) noexcept
: movePairs(alloc) {}

MovePassData::MovePassData(MovePassData&& rhs, const allocator_type& alloc)
: movePairs(std::move(rhs.movePairs), alloc) {}

MovePassData::MovePassData(MovePassData const& rhs, const allocator_type& alloc)
: movePairs(rhs.movePairs, alloc) {}

RaytracePassData::RaytracePassData(const allocator_type& alloc) noexcept
: computeViews(alloc) {}

RaytracePassData::RaytracePassData(RaytracePassData&& rhs, const allocator_type& alloc)
: computeViews(std::move(rhs.computeViews), alloc) {}

RaytracePassData::RaytracePassData(RaytracePassData const& rhs, const allocator_type& alloc)
: computeViews(rhs.computeViews, alloc) {}

SceneData::SceneData(const allocator_type& alloc) noexcept
: name(alloc),
  scenes(alloc) {}

SceneData::SceneData(PmrString nameIn, const allocator_type& alloc) noexcept
: name(std::move(nameIn), alloc),
  scenes(alloc) {}

SceneData::SceneData(SceneData&& rhs, const allocator_type& alloc)
: name(std::move(rhs.name), alloc),
  camera(rhs.camera),
  scenes(std::move(rhs.scenes), alloc) {}

SceneData::SceneData(SceneData const& rhs, const allocator_type& alloc)
: name(rhs.name, alloc),
  camera(rhs.camera),
  scenes(rhs.scenes, alloc) {}

Dispatch::Dispatch(const allocator_type& alloc) noexcept
: shader(alloc) {}

Dispatch::Dispatch(PmrString shaderIn, uint32_t threadGroupCountXIn, uint32_t threadGroupCountYIn, uint32_t threadGroupCountZIn, const allocator_type& alloc) noexcept // NOLINT
: shader(std::move(shaderIn), alloc),
  threadGroupCountX(threadGroupCountXIn),
  threadGroupCountY(threadGroupCountYIn),
  threadGroupCountZ(threadGroupCountZIn) {}

Dispatch::Dispatch(Dispatch&& rhs, const allocator_type& alloc)
: shader(std::move(rhs.shader), alloc),
  threadGroupCountX(rhs.threadGroupCountX),
  threadGroupCountY(rhs.threadGroupCountY),
  threadGroupCountZ(rhs.threadGroupCountZ) {}

Dispatch::Dispatch(Dispatch const& rhs, const allocator_type& alloc)
: shader(rhs.shader, alloc),
  threadGroupCountX(rhs.threadGroupCountX),
  threadGroupCountY(rhs.threadGroupCountY),
  threadGroupCountZ(rhs.threadGroupCountZ) {}

Blit::Blit(const allocator_type& alloc) noexcept
: shader(alloc) {}

Blit::Blit(PmrString shaderIn, const allocator_type& alloc) noexcept
: shader(std::move(shaderIn), alloc) {}

Blit::Blit(Blit&& rhs, const allocator_type& alloc)
: shader(std::move(rhs.shader), alloc) {}

Blit::Blit(Blit const& rhs, const allocator_type& alloc)
: shader(rhs.shader, alloc) {}

PresentPassData::PresentPassData(const allocator_type& alloc) noexcept
: resourceName(alloc) {}

PresentPassData::PresentPassData(PmrString resourceNameIn, uint32_t syncIntervalIn, uint32_t flagsIn, const allocator_type& alloc) noexcept // NOLINT
: resourceName(std::move(resourceNameIn), alloc),
  syncInterval(syncIntervalIn),
  flags(flagsIn) {}

PresentPassData::PresentPassData(PresentPassData&& rhs, const allocator_type& alloc)
: resourceName(std::move(rhs.resourceName), alloc),
  syncInterval(rhs.syncInterval),
  flags(rhs.flags) {}

PresentPassData::PresentPassData(PresentPassData const& rhs, const allocator_type& alloc)
: resourceName(rhs.resourceName, alloc),
  syncInterval(rhs.syncInterval),
  flags(rhs.flags) {}

RenderData::RenderData(const allocator_type& alloc) noexcept
: constants(alloc),
  buffers(alloc),
  textures(alloc),
  samplers(alloc) {}

RenderData::RenderData(RenderData&& rhs, const allocator_type& alloc)
: constants(std::move(rhs.constants), alloc),
  buffers(std::move(rhs.buffers), alloc),
  textures(std::move(rhs.textures), alloc),
  samplers(std::move(rhs.samplers), alloc) {}

RenderGraph::RenderGraph(const allocator_type& alloc) noexcept
: objects(alloc),
  vertices(alloc),
  names(alloc),
  layoutNodes(alloc),
  data(alloc),
  rasterPasses(alloc),
  computePasses(alloc),
  copyPasses(alloc),
  movePasses(alloc),
  presentPasses(alloc),
  raytracePasses(alloc),
  renderQueues(alloc),
  scenes(alloc),
  blits(alloc),
  dispatches(alloc),
  index(alloc) {}

RenderGraph::RenderGraph(RenderGraph&& rhs, const allocator_type& alloc)
: objects(std::move(rhs.objects), alloc),
  vertices(std::move(rhs.vertices), alloc),
  names(std::move(rhs.names), alloc),
  layoutNodes(std::move(rhs.layoutNodes), alloc),
  data(std::move(rhs.data), alloc),
  rasterPasses(std::move(rhs.rasterPasses), alloc),
  computePasses(std::move(rhs.computePasses), alloc),
  copyPasses(std::move(rhs.copyPasses), alloc),
  movePasses(std::move(rhs.movePasses), alloc),
  presentPasses(std::move(rhs.presentPasses), alloc),
  raytracePasses(std::move(rhs.raytracePasses), alloc),
  renderQueues(std::move(rhs.renderQueues), alloc),
  scenes(std::move(rhs.scenes), alloc),
  blits(std::move(rhs.blits), alloc),
  dispatches(std::move(rhs.dispatches), alloc),
  index(std::move(rhs.index), alloc) {}

// ContinuousContainer
void RenderGraph::reserve(vertices_size_type sz) {
    this->objects.reserve(sz);
    this->vertices.reserve(sz);
    names.reserve(sz);
    layoutNodes.reserve(sz);
    data.reserve(sz);
}

RenderGraph::object_type::object_type(const allocator_type& alloc) noexcept
: children(alloc),
  parents(alloc) {}

RenderGraph::object_type::object_type(object_type&& rhs, const allocator_type& alloc)
: children(std::move(rhs.children), alloc),
  parents(std::move(rhs.parents), alloc) {}

RenderGraph::object_type::object_type(object_type const& rhs, const allocator_type& alloc)
: children(rhs.children, alloc),
  parents(rhs.parents, alloc) {}

RenderGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: outEdges(alloc),
  inEdges(alloc) {}

RenderGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: outEdges(std::move(rhs.outEdges), alloc),
  inEdges(std::move(rhs.inEdges), alloc),
  handle(std::move(rhs.handle)) {}

RenderGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: outEdges(rhs.outEdges, alloc),
  inEdges(rhs.inEdges, alloc),
  handle(rhs.handle) {}

} // namespace render

} // namespace cc

// clang-format on
