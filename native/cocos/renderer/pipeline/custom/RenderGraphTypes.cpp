#include "RenderGraphTypes.h"

namespace cc {

namespace render {

ResourceGraph::ResourceGraph(const allocator_type& alloc) noexcept
: mVertices(alloc),
  mNames(alloc),
  mDescs(alloc),
  mTraits(alloc),
  mValueIndex(alloc) {}

ResourceGraph::ResourceGraph(ResourceGraph&& rhs, const allocator_type& alloc)
: mVertices(std::move(rhs.mVertices), alloc),
  mNames(std::move(rhs.mNames), alloc),
  mDescs(std::move(rhs.mDescs), alloc),
  mTraits(std::move(rhs.mTraits), alloc),
  mValueIndex(std::move(rhs.mValueIndex), alloc) {}

ResourceGraph::ResourceGraph(ResourceGraph const& rhs, const allocator_type& alloc)
: mVertices(rhs.mVertices, alloc),
  mNames(rhs.mNames, alloc),
  mDescs(rhs.mDescs, alloc),
  mTraits(rhs.mTraits, alloc),
  mValueIndex(rhs.mValueIndex, alloc) {}

// ContinuousContainer
void ResourceGraph::reserve(vertices_size_type sz) {
    mVertices.reserve(sz);
    mNames.reserve(sz);
    mDescs.reserve(sz);
    mTraits.reserve(sz);
}

ResourceGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: mOutEdges(alloc),
  mInEdges(alloc) {}

ResourceGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: mOutEdges(std::move(rhs.mOutEdges), alloc),
  mInEdges(std::move(rhs.mInEdges), alloc) {}

ResourceGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: mOutEdges(rhs.mOutEdges, alloc),
  mInEdges(rhs.mInEdges, alloc) {}

RasterView::RasterView(const allocator_type& alloc) noexcept
: mSlotName(alloc) {}

RasterView::RasterView(PmrString slotName, AccessType accessType, AttachmentType attachmentType, gfx::LoadOp loadOp, gfx::StoreOp storeOp, gfx::ClearFlagBit clearFlags, gfx::Color clearColor, const allocator_type& alloc) noexcept
: mSlotName(std::move(slotName), alloc),
  mAccessType(accessType),
  mAttachmentType(attachmentType),
  mLoadOp(loadOp),
  mStoreOp(storeOp),
  mClearFlags(clearFlags),
  mClearColor(clearColor) {}

RasterView::RasterView(RasterView&& rhs, const allocator_type& alloc)
: mSlotName(std::move(rhs.mSlotName), alloc),
  mAccessType(rhs.mAccessType),
  mAttachmentType(rhs.mAttachmentType),
  mLoadOp(rhs.mLoadOp),
  mStoreOp(rhs.mStoreOp),
  mClearFlags(rhs.mClearFlags),
  mClearColor(rhs.mClearColor) {}

RasterView::RasterView(RasterView const& rhs, const allocator_type& alloc)
: mSlotName(rhs.mSlotName, alloc),
  mAccessType(rhs.mAccessType),
  mAttachmentType(rhs.mAttachmentType),
  mLoadOp(rhs.mLoadOp),
  mStoreOp(rhs.mStoreOp),
  mClearFlags(rhs.mClearFlags),
  mClearColor(rhs.mClearColor) {}

ComputeView::ComputeView(const allocator_type& alloc) noexcept
: mName(alloc) {}

ComputeView::ComputeView(ComputeView&& rhs, const allocator_type& alloc)
: mName(std::move(rhs.mName), alloc),
  mAccessType(rhs.mAccessType),
  mClearFlags(rhs.mClearFlags),
  mClearColor(rhs.mClearColor),
  mClearValueType(rhs.mClearValueType) {}

ComputeView::ComputeView(ComputeView const& rhs, const allocator_type& alloc)
: mName(rhs.mName, alloc),
  mAccessType(rhs.mAccessType),
  mClearFlags(rhs.mClearFlags),
  mClearColor(rhs.mClearColor),
  mClearValueType(rhs.mClearValueType) {}

RasterSubpass::RasterSubpass(const allocator_type& alloc) noexcept
: mRasterViews(alloc),
  mComputeViews(alloc) {}

RasterSubpass::RasterSubpass(RasterSubpass&& rhs, const allocator_type& alloc)
: mRasterViews(std::move(rhs.mRasterViews), alloc),
  mComputeViews(std::move(rhs.mComputeViews), alloc) {}

RasterSubpass::RasterSubpass(RasterSubpass const& rhs, const allocator_type& alloc)
: mRasterViews(rhs.mRasterViews, alloc),
  mComputeViews(rhs.mComputeViews, alloc) {}

SubpassGraph::SubpassGraph(const allocator_type& alloc) noexcept
: mVertices(alloc),
  mNames(alloc),
  mSubpasses(alloc) {}

SubpassGraph::SubpassGraph(SubpassGraph&& rhs, const allocator_type& alloc)
: mVertices(std::move(rhs.mVertices), alloc),
  mNames(std::move(rhs.mNames), alloc),
  mSubpasses(std::move(rhs.mSubpasses), alloc) {}

SubpassGraph::SubpassGraph(SubpassGraph const& rhs, const allocator_type& alloc)
: mVertices(rhs.mVertices, alloc),
  mNames(rhs.mNames, alloc),
  mSubpasses(rhs.mSubpasses, alloc) {}

// ContinuousContainer
void SubpassGraph::reserve(vertices_size_type sz) {
    mVertices.reserve(sz);
    mNames.reserve(sz);
    mSubpasses.reserve(sz);
}

SubpassGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: mOutEdges(alloc),
  mInEdges(alloc) {}

SubpassGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: mOutEdges(std::move(rhs.mOutEdges), alloc),
  mInEdges(std::move(rhs.mInEdges), alloc) {}

SubpassGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: mOutEdges(rhs.mOutEdges, alloc),
  mInEdges(rhs.mInEdges, alloc) {}

RasterPassData::RasterPassData(const allocator_type& alloc) noexcept
: mRasterViews(alloc),
  mComputeViews(alloc),
  mSubpassGraph(alloc) {}

RasterPassData::RasterPassData(RasterPassData&& rhs, const allocator_type& alloc)
: mRasterViews(std::move(rhs.mRasterViews), alloc),
  mComputeViews(std::move(rhs.mComputeViews), alloc),
  mSubpassGraph(std::move(rhs.mSubpassGraph), alloc) {}

RasterPassData::RasterPassData(RasterPassData const& rhs, const allocator_type& alloc)
: mRasterViews(rhs.mRasterViews, alloc),
  mComputeViews(rhs.mComputeViews, alloc),
  mSubpassGraph(rhs.mSubpassGraph, alloc) {}

ComputePassData::ComputePassData(const allocator_type& alloc) noexcept
: mComputeViews(alloc) {}

ComputePassData::ComputePassData(ComputePassData&& rhs, const allocator_type& alloc)
: mComputeViews(std::move(rhs.mComputeViews), alloc) {}

ComputePassData::ComputePassData(ComputePassData const& rhs, const allocator_type& alloc)
: mComputeViews(rhs.mComputeViews, alloc) {}

CopyPair::CopyPair(const allocator_type& alloc) noexcept
: mSource(alloc),
  mTarget(alloc) {}

CopyPair::CopyPair(PmrString source, PmrString target, uint32_t mipLevels, uint32_t numSlices, uint32_t sourceMostDetailedMip, uint32_t sourceFirstSlice, uint32_t sourcePlaneSlice, uint32_t targetMostDetailedMip, uint32_t targetFirstSlice, uint32_t targetPlaneSlice, const allocator_type& alloc) noexcept // NOLINT
: mSource(std::move(source), alloc),
  mTarget(std::move(target), alloc),
  mMipLevels(mipLevels),
  mNumSlices(numSlices),
  mSourceMostDetailedMip(sourceMostDetailedMip),
  mSourceFirstSlice(sourceFirstSlice),
  mSourcePlaneSlice(sourcePlaneSlice),
  mTargetMostDetailedMip(targetMostDetailedMip),
  mTargetFirstSlice(targetFirstSlice),
  mTargetPlaneSlice(targetPlaneSlice) {}

CopyPair::CopyPair(CopyPair&& rhs, const allocator_type& alloc)
: mSource(std::move(rhs.mSource), alloc),
  mTarget(std::move(rhs.mTarget), alloc),
  mMipLevels(rhs.mMipLevels),
  mNumSlices(rhs.mNumSlices),
  mSourceMostDetailedMip(rhs.mSourceMostDetailedMip),
  mSourceFirstSlice(rhs.mSourceFirstSlice),
  mSourcePlaneSlice(rhs.mSourcePlaneSlice),
  mTargetMostDetailedMip(rhs.mTargetMostDetailedMip),
  mTargetFirstSlice(rhs.mTargetFirstSlice),
  mTargetPlaneSlice(rhs.mTargetPlaneSlice) {}

CopyPair::CopyPair(CopyPair const& rhs, const allocator_type& alloc)
: mSource(rhs.mSource, alloc),
  mTarget(rhs.mTarget, alloc),
  mMipLevels(rhs.mMipLevels),
  mNumSlices(rhs.mNumSlices),
  mSourceMostDetailedMip(rhs.mSourceMostDetailedMip),
  mSourceFirstSlice(rhs.mSourceFirstSlice),
  mSourcePlaneSlice(rhs.mSourcePlaneSlice),
  mTargetMostDetailedMip(rhs.mTargetMostDetailedMip),
  mTargetFirstSlice(rhs.mTargetFirstSlice),
  mTargetPlaneSlice(rhs.mTargetPlaneSlice) {}

CopyPassData::CopyPassData(const allocator_type& alloc) noexcept
: mCopyPairs(alloc) {}

CopyPassData::CopyPassData(CopyPassData&& rhs, const allocator_type& alloc)
: mCopyPairs(std::move(rhs.mCopyPairs), alloc) {}

CopyPassData::CopyPassData(CopyPassData const& rhs, const allocator_type& alloc)
: mCopyPairs(rhs.mCopyPairs, alloc) {}

MovePair::MovePair(const allocator_type& alloc) noexcept
: mSource(alloc),
  mTarget(alloc) {}

MovePair::MovePair(PmrString source, PmrString target, uint32_t mipLevels, uint32_t numSlices, uint32_t targetMostDetailedMip, uint32_t targetFirstSlice, uint32_t targetPlaneSlice, const allocator_type& alloc) noexcept // NOLINT
: mSource(std::move(source), alloc),
  mTarget(std::move(target), alloc),
  mMipLevels(mipLevels),
  mNumSlices(numSlices),
  mTargetMostDetailedMip(targetMostDetailedMip),
  mTargetFirstSlice(targetFirstSlice),
  mTargetPlaneSlice(targetPlaneSlice) {}

MovePair::MovePair(MovePair&& rhs, const allocator_type& alloc)
: mSource(std::move(rhs.mSource), alloc),
  mTarget(std::move(rhs.mTarget), alloc),
  mMipLevels(rhs.mMipLevels),
  mNumSlices(rhs.mNumSlices),
  mTargetMostDetailedMip(rhs.mTargetMostDetailedMip),
  mTargetFirstSlice(rhs.mTargetFirstSlice),
  mTargetPlaneSlice(rhs.mTargetPlaneSlice) {}

MovePair::MovePair(MovePair const& rhs, const allocator_type& alloc)
: mSource(rhs.mSource, alloc),
  mTarget(rhs.mTarget, alloc),
  mMipLevels(rhs.mMipLevels),
  mNumSlices(rhs.mNumSlices),
  mTargetMostDetailedMip(rhs.mTargetMostDetailedMip),
  mTargetFirstSlice(rhs.mTargetFirstSlice),
  mTargetPlaneSlice(rhs.mTargetPlaneSlice) {}

MovePassData::MovePassData(const allocator_type& alloc) noexcept
: mMovePairs(alloc) {}

MovePassData::MovePassData(MovePassData&& rhs, const allocator_type& alloc)
: mMovePairs(std::move(rhs.mMovePairs), alloc) {}

MovePassData::MovePassData(MovePassData const& rhs, const allocator_type& alloc)
: mMovePairs(rhs.mMovePairs, alloc) {}

RaytracePassData::RaytracePassData(const allocator_type& alloc) noexcept
: mComputeViews(alloc) {}

RaytracePassData::RaytracePassData(RaytracePassData&& rhs, const allocator_type& alloc)
: mComputeViews(std::move(rhs.mComputeViews), alloc) {}

RaytracePassData::RaytracePassData(RaytracePassData const& rhs, const allocator_type& alloc)
: mComputeViews(rhs.mComputeViews, alloc) {}

SceneData::SceneData(const allocator_type& alloc) noexcept
: mName(alloc),
  mScenes(alloc) {}

SceneData::SceneData(PmrString name, const allocator_type& alloc) noexcept
: mName(std::move(name), alloc),
  mScenes(alloc) {}

SceneData::SceneData(SceneData&& rhs, const allocator_type& alloc)
: mName(std::move(rhs.mName), alloc),
  mCamera(rhs.mCamera),
  mScenes(std::move(rhs.mScenes), alloc) {}

SceneData::SceneData(SceneData const& rhs, const allocator_type& alloc)
: mName(rhs.mName, alloc),
  mCamera(rhs.mCamera),
  mScenes(rhs.mScenes, alloc) {}

Dispatch::Dispatch(const allocator_type& alloc) noexcept
: mShader(alloc) {}

Dispatch::Dispatch(PmrString shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const allocator_type& alloc) noexcept // NOLINT
: mShader(std::move(shader), alloc),
  mThreadGroupCountX(threadGroupCountX),
  mThreadGroupCountY(threadGroupCountY),
  mThreadGroupCountZ(threadGroupCountZ) {}

Dispatch::Dispatch(Dispatch&& rhs, const allocator_type& alloc)
: mShader(std::move(rhs.mShader), alloc),
  mThreadGroupCountX(rhs.mThreadGroupCountX),
  mThreadGroupCountY(rhs.mThreadGroupCountY),
  mThreadGroupCountZ(rhs.mThreadGroupCountZ) {}

Dispatch::Dispatch(Dispatch const& rhs, const allocator_type& alloc)
: mShader(rhs.mShader, alloc),
  mThreadGroupCountX(rhs.mThreadGroupCountX),
  mThreadGroupCountY(rhs.mThreadGroupCountY),
  mThreadGroupCountZ(rhs.mThreadGroupCountZ) {}

Blit::Blit(const allocator_type& alloc) noexcept
: mShader(alloc) {}

Blit::Blit(PmrString shader, const allocator_type& alloc) noexcept
: mShader(std::move(shader), alloc) {}

Blit::Blit(Blit&& rhs, const allocator_type& alloc)
: mShader(std::move(rhs.mShader), alloc) {}

Blit::Blit(Blit const& rhs, const allocator_type& alloc)
: mShader(rhs.mShader, alloc) {}

PresentPassData::PresentPassData(const allocator_type& alloc) noexcept
: mResourceName(alloc) {}

PresentPassData::PresentPassData(PmrString resourceName, uint32_t syncInterval, uint32_t flags, const allocator_type& alloc) noexcept // NOLINT
: mResourceName(std::move(resourceName), alloc),
  mSyncInterval(syncInterval),
  mFlags(flags) {}

PresentPassData::PresentPassData(PresentPassData&& rhs, const allocator_type& alloc)
: mResourceName(std::move(rhs.mResourceName), alloc),
  mSyncInterval(rhs.mSyncInterval),
  mFlags(rhs.mFlags) {}

PresentPassData::PresentPassData(PresentPassData const& rhs, const allocator_type& alloc)
: mResourceName(rhs.mResourceName, alloc),
  mSyncInterval(rhs.mSyncInterval),
  mFlags(rhs.mFlags) {}

RenderData::RenderData(const allocator_type& alloc) noexcept
: mConstants(alloc),
  mBuffers(alloc),
  mTextures(alloc),
  mSamplers(alloc) {}

RenderData::RenderData(RenderData&& rhs, const allocator_type& alloc)
: mConstants(std::move(rhs.mConstants), alloc),
  mBuffers(std::move(rhs.mBuffers), alloc),
  mTextures(std::move(rhs.mTextures), alloc),
  mSamplers(std::move(rhs.mSamplers), alloc) {}

RenderGraph::RenderGraph(const allocator_type& alloc) noexcept
: mObjects(alloc),
  mVertices(alloc),
  mNames(alloc),
  mLayoutNodes(alloc),
  mData(alloc),
  mRasterPasses(alloc),
  mComputePasses(alloc),
  mCopyPasses(alloc),
  mMovePasses(alloc),
  mPresentPasses(alloc),
  mRaytracePasses(alloc),
  mRenderQueues(alloc),
  mScenes(alloc),
  mBlits(alloc),
  mDispatches(alloc),
  mIndex(alloc) {}

RenderGraph::RenderGraph(RenderGraph&& rhs, const allocator_type& alloc)
: mObjects(std::move(rhs.mObjects), alloc),
  mVertices(std::move(rhs.mVertices), alloc),
  mNames(std::move(rhs.mNames), alloc),
  mLayoutNodes(std::move(rhs.mLayoutNodes), alloc),
  mData(std::move(rhs.mData), alloc),
  mRasterPasses(std::move(rhs.mRasterPasses), alloc),
  mComputePasses(std::move(rhs.mComputePasses), alloc),
  mCopyPasses(std::move(rhs.mCopyPasses), alloc),
  mMovePasses(std::move(rhs.mMovePasses), alloc),
  mPresentPasses(std::move(rhs.mPresentPasses), alloc),
  mRaytracePasses(std::move(rhs.mRaytracePasses), alloc),
  mRenderQueues(std::move(rhs.mRenderQueues), alloc),
  mScenes(std::move(rhs.mScenes), alloc),
  mBlits(std::move(rhs.mBlits), alloc),
  mDispatches(std::move(rhs.mDispatches), alloc),
  mIndex(std::move(rhs.mIndex), alloc) {}

// ContinuousContainer
void RenderGraph::reserve(vertices_size_type sz) {
    mObjects.reserve(sz);
    mVertices.reserve(sz);
    mNames.reserve(sz);
    mLayoutNodes.reserve(sz);
    mData.reserve(sz);
}

RenderGraph::object_type::object_type(const allocator_type& alloc) noexcept
: mChildren(alloc),
  mParents(alloc) {}

RenderGraph::object_type::object_type(object_type&& rhs, const allocator_type& alloc)
: mChildren(std::move(rhs.mChildren), alloc),
  mParents(std::move(rhs.mParents), alloc) {}

RenderGraph::object_type::object_type(object_type const& rhs, const allocator_type& alloc)
: mChildren(rhs.mChildren, alloc),
  mParents(rhs.mParents, alloc) {}

RenderGraph::vertex_type::vertex_type(const allocator_type& alloc) noexcept
: mOutEdges(alloc),
  mInEdges(alloc) {}

RenderGraph::vertex_type::vertex_type(vertex_type&& rhs, const allocator_type& alloc)
: mOutEdges(std::move(rhs.mOutEdges), alloc),
  mInEdges(std::move(rhs.mInEdges), alloc),
  mHandle(std::move(rhs.mHandle)) {}

RenderGraph::vertex_type::vertex_type(vertex_type const& rhs, const allocator_type& alloc)
: mOutEdges(rhs.mOutEdges, alloc),
  mInEdges(rhs.mInEdges, alloc),
  mHandle(rhs.mHandle) {}

} // namespace render

} // namespace cc
