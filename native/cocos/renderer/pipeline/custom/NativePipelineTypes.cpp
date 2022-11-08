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

RenderInstancingQueue::RenderInstancingQueue(const allocator_type& alloc) noexcept
: batches(alloc),
  sortedBatches(alloc) {}

RenderInstancingQueue::RenderInstancingQueue(RenderInstancingQueue&& rhs, const allocator_type& alloc)
: batches(std::move(rhs.batches), alloc),
  sortedBatches(std::move(rhs.sortedBatches), alloc) {}

RenderInstancingQueue::RenderInstancingQueue(RenderInstancingQueue const& rhs, const allocator_type& alloc)
: batches(rhs.batches, alloc),
  sortedBatches(rhs.sortedBatches, alloc) {}

NativeRenderQueue::NativeRenderQueue(const allocator_type& alloc) noexcept
: instancingQueue(alloc) {}

NativeRenderQueue::NativeRenderQueue(SceneFlags sceneFlagsIn, const allocator_type& alloc) noexcept
: sceneFlags(sceneFlagsIn),
  instancingQueue(alloc) {}

NativeRenderQueue::NativeRenderQueue(NativeRenderQueue&& rhs, const allocator_type& alloc)
: sceneFlags(rhs.sceneFlags),
  instancingQueue(std::move(rhs.instancingQueue), alloc) {}

DefaultSceneVisitor::DefaultSceneVisitor(const allocator_type& alloc) noexcept
: name(alloc) {}

DefaultForwardLightingTransversal::DefaultForwardLightingTransversal(const allocator_type& alloc) noexcept
: name(alloc) {}

ResourceGroup::ResourceGroup(const allocator_type& alloc) noexcept
: instancingBuffers(alloc) {}

NativeRenderContext::NativeRenderContext(const allocator_type& alloc) noexcept
: renderPasses(alloc),
  resourceGroups(alloc) {}

} // namespace render

} // namespace cc

// clang-format on
