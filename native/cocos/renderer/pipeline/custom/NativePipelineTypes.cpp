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
#include "NativePipelineTypes.h"

namespace cc {

namespace render {

PersistentRenderPassAndFramebuffer::PersistentRenderPassAndFramebuffer(const allocator_type& alloc) noexcept
: clearColors(alloc) {}

PersistentRenderPassAndFramebuffer::PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer&& rhs, const allocator_type& alloc)
: renderPass(std::move(rhs.renderPass)),
  framebuffer(std::move(rhs.framebuffer)),
  clearColors(std::move(rhs.clearColors), alloc),
  clearDepth(rhs.clearDepth),
  clearStencil(rhs.clearStencil),
  refCount(rhs.refCount) {}

PersistentRenderPassAndFramebuffer::PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer const& rhs, const allocator_type& alloc)
: renderPass(rhs.renderPass),
  framebuffer(rhs.framebuffer),
  clearColors(rhs.clearColors, alloc),
  clearDepth(rhs.clearDepth),
  clearStencil(rhs.clearStencil),
  refCount(rhs.refCount) {}

ScenePassQueue::ScenePassQueue(const allocator_type& alloc) noexcept
: queue(alloc) {}

RenderInstancePack::RenderInstancePack(const allocator_type& alloc) noexcept
: instances(alloc) {}

RenderInstancePack::RenderInstancePack(RenderInstancePack&& rhs, const allocator_type& alloc)
: instances(std::move(rhs.instances), alloc) {}

RenderBatch::RenderBatch(const allocator_type& alloc) noexcept
: vertexBuffers(alloc),
  vertexBufferData(alloc),
  uniformBufferData(alloc) {}

RenderBatch::RenderBatch(RenderBatch&& rhs, const allocator_type& alloc)
: vertexBuffers(std::move(rhs.vertexBuffers), alloc),
  vertexBufferData(std::move(rhs.vertexBufferData), alloc),
  indexBuffer(rhs.indexBuffer),
  indexBufferData(rhs.indexBufferData),
  vertexBufferCount(rhs.vertexBufferCount),
  mergeCount(rhs.mergeCount),
  inputAssembler(rhs.inputAssembler),
  uniformBufferData(std::move(rhs.uniformBufferData), alloc),
  uniformBuffer(rhs.uniformBuffer),
  descriptorSet(rhs.descriptorSet),
  scenePass(rhs.scenePass),
  shader(rhs.shader) {}

RenderBatchPack::RenderBatchPack(const allocator_type& alloc) noexcept
: batches(alloc),
  bufferOffset(alloc) {}

RenderBatchPack::RenderBatchPack(RenderBatchPack&& rhs, const allocator_type& alloc)
: batches(std::move(rhs.batches), alloc),
  bufferOffset(std::move(rhs.bufferOffset), alloc) {}

NativeRenderQueue::NativeRenderQueue(const allocator_type& alloc) noexcept
: scenePassQueue(alloc),
  batchingQueue(alloc),
  instancingQueue(alloc),
  instancePacks(alloc) {}

NativeRenderQueue::NativeRenderQueue(SceneFlags sceneFlagsIn, const allocator_type& alloc) noexcept
: sceneFlags(sceneFlagsIn),
  scenePassQueue(alloc),
  batchingQueue(alloc),
  instancingQueue(alloc),
  instancePacks(alloc) {}

NativeRenderQueue::NativeRenderQueue(NativeRenderQueue&& rhs, const allocator_type& alloc)
: sceneFlags(rhs.sceneFlags),
  scenePassQueue(std::move(rhs.scenePassQueue), alloc),
  batchingQueue(std::move(rhs.batchingQueue), alloc),
  instancingQueue(std::move(rhs.instancingQueue), alloc),
  instancePacks(std::move(rhs.instancePacks), alloc) {}

DefaultSceneVisitor::DefaultSceneVisitor(const allocator_type& alloc) noexcept
: name(alloc) {}

DefaultForwardLightingTransversal::DefaultForwardLightingTransversal(const allocator_type& alloc) noexcept
: name(alloc) {}

NativeRenderContext::NativeRenderContext(const allocator_type& alloc) noexcept
: renderPasses(alloc),
  freeRenderQueues(alloc),
  freeInstancePacks(alloc) {}

} // namespace render

} // namespace cc

// clang-format on
