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
#include "NativePipelineTypes.h"

namespace cc {

namespace render {

RenderInstancingQueue::RenderInstancingQueue(const allocator_type& alloc) noexcept
: batches(alloc),
  sortedBatches(alloc) {}

RenderInstancingQueue::RenderInstancingQueue(RenderInstancingQueue&& rhs, const allocator_type& alloc)
: batches(std::move(rhs.batches), alloc),
  sortedBatches(std::move(rhs.sortedBatches), alloc) {}

RenderInstancingQueue::RenderInstancingQueue(RenderInstancingQueue const& rhs, const allocator_type& alloc)
: batches(rhs.batches, alloc),
  sortedBatches(rhs.sortedBatches, alloc) {}

RenderDrawQueue::RenderDrawQueue(const allocator_type& alloc) noexcept
: instances(alloc) {}

RenderDrawQueue::RenderDrawQueue(RenderDrawQueue&& rhs, const allocator_type& alloc)
: instances(std::move(rhs.instances), alloc) {}

RenderDrawQueue::RenderDrawQueue(RenderDrawQueue const& rhs, const allocator_type& alloc)
: instances(rhs.instances, alloc) {}

NativeRenderQueue::NativeRenderQueue(const allocator_type& alloc) noexcept
: opaqueQueue(alloc),
  transparentQueue(alloc),
  opaqueInstancingQueue(alloc),
  transparentInstancingQueue(alloc) {}

NativeRenderQueue::NativeRenderQueue(SceneFlags sceneFlagsIn, uint32_t layoutPassIDIn, const allocator_type& alloc) noexcept
: opaqueQueue(alloc),
  transparentQueue(alloc),
  opaqueInstancingQueue(alloc),
  transparentInstancingQueue(alloc),
  sceneFlags(sceneFlagsIn),
  layoutPassID(layoutPassIDIn) {}

NativeRenderQueue::NativeRenderQueue(NativeRenderQueue&& rhs, const allocator_type& alloc)
: opaqueQueue(std::move(rhs.opaqueQueue), alloc),
  transparentQueue(std::move(rhs.transparentQueue), alloc),
  opaqueInstancingQueue(std::move(rhs.opaqueInstancingQueue), alloc),
  transparentInstancingQueue(std::move(rhs.transparentInstancingQueue), alloc),
  sceneFlags(rhs.sceneFlags),
  layoutPassID(rhs.layoutPassID) {}

DefaultSceneVisitor::DefaultSceneVisitor(const allocator_type& alloc) noexcept
: name(alloc) {}

DefaultForwardLightingTransversal::DefaultForwardLightingTransversal(const allocator_type& alloc) noexcept
: name(alloc) {}

ResourceGroup::ResourceGroup(const allocator_type& alloc) noexcept
: instancingBuffers(alloc) {}

BufferPool::BufferPool(const allocator_type& alloc) noexcept
: currentBuffers(alloc),
  currentBufferViews(alloc),
  freeBuffers(alloc),
  freeBufferViews(alloc) {}

BufferPool::BufferPool(gfx::Device* deviceIn, uint32_t bufferSizeIn, bool dynamicIn, const allocator_type& alloc) noexcept // NOLINT
: device(deviceIn),
  bufferSize(bufferSizeIn),
  dynamic(dynamicIn),
  currentBuffers(alloc),
  currentBufferViews(alloc),
  freeBuffers(alloc),
  freeBufferViews(alloc) {}

BufferPool::BufferPool(BufferPool&& rhs, const allocator_type& alloc)
: device(rhs.device),
  bufferSize(rhs.bufferSize),
  dynamic(rhs.dynamic),
  currentBuffers(std::move(rhs.currentBuffers), alloc),
  currentBufferViews(std::move(rhs.currentBufferViews), alloc),
  freeBuffers(std::move(rhs.freeBuffers), alloc),
  freeBufferViews(std::move(rhs.freeBufferViews), alloc) {}

DescriptorSetPool::DescriptorSetPool(const allocator_type& alloc) noexcept
: currentDescriptorSets(alloc),
  freeDescriptorSets(alloc) {}

DescriptorSetPool::DescriptorSetPool(gfx::Device* deviceIn, IntrusivePtr<gfx::DescriptorSetLayout> setLayoutIn, const allocator_type& alloc) noexcept // NOLINT
: device(deviceIn),
  setLayout(std::move(setLayoutIn)),
  currentDescriptorSets(alloc),
  freeDescriptorSets(alloc) {}

DescriptorSetPool::DescriptorSetPool(DescriptorSetPool&& rhs, const allocator_type& alloc)
: device(rhs.device),
  setLayout(std::move(rhs.setLayout)),
  currentDescriptorSets(std::move(rhs.currentDescriptorSets), alloc),
  freeDescriptorSets(std::move(rhs.freeDescriptorSets), alloc) {}

UniformBlockResource::UniformBlockResource(const allocator_type& alloc) noexcept
: cpuBuffer(alloc),
  bufferPool(alloc) {}

UniformBlockResource::UniformBlockResource(UniformBlockResource&& rhs, const allocator_type& alloc)
: cpuBuffer(std::move(rhs.cpuBuffer), alloc),
  bufferPool(std::move(rhs.bufferPool), alloc) {}

ProgramResource::ProgramResource(const allocator_type& alloc) noexcept
: uniformBuffers(alloc),
  descriptorSetPool(alloc) {}

ProgramResource::ProgramResource(ProgramResource&& rhs, const allocator_type& alloc)
: uniformBuffers(std::move(rhs.uniformBuffers), alloc),
  descriptorSetPool(std::move(rhs.descriptorSetPool), alloc) {}

LayoutGraphNodeResource::LayoutGraphNodeResource(const allocator_type& alloc) noexcept
: uniformBuffers(alloc),
  descriptorSetPool(alloc),
  programResources(alloc) {}

LayoutGraphNodeResource::LayoutGraphNodeResource(LayoutGraphNodeResource&& rhs, const allocator_type& alloc)
: uniformBuffers(std::move(rhs.uniformBuffers), alloc),
  descriptorSetPool(std::move(rhs.descriptorSetPool), alloc),
  programResources(std::move(rhs.programResources), alloc) {}

NativeRenderContext::NativeRenderContext(std::unique_ptr<gfx::DefaultResource> defaultResourceIn, const allocator_type& alloc) noexcept
: defaultResource(std::move(defaultResourceIn)),
  resourceGroups(alloc),
  layoutGraphResources(alloc) {}

NativeProgramLibrary::NativeProgramLibrary(const allocator_type& alloc) noexcept
: layoutGraph(alloc),
  phases(alloc),
  localLayoutData(alloc) {}

} // namespace render

} // namespace cc

// clang-format on
