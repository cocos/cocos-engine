#include "NativePipelineTypes.h"
#include "details/GslUtils.h"

namespace cc {

namespace render {

void BufferPool::init(gfx::Device* deviceIn, uint32_t sz) {
    CC_EXPECTS(deviceIn);
    CC_EXPECTS(sz);
    CC_EXPECTS(!device);
    CC_EXPECTS(bufferSize == 0);

    device = deviceIn;
    bufferSize = sz;
}

void BufferPool::syncResources() {
    for (auto& buffer : currentBuffers) {
        freeBuffers.emplace_back(std::move(buffer));
    }
    currentBuffers.clear();
}

gfx::Buffer* BufferPool::allocateBuffer() {
    CC_EXPECTS(device);
    CC_EXPECTS(bufferSize);

    gfx::Buffer* ptr = nullptr;

    if (freeBuffers.empty()) {
        gfx::BufferInfo info{
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            bufferSize,
            bufferSize};
        freeBuffers.emplace_back(device->createBuffer(info));
    }
    {
        CC_ENSURES(!freeBuffers.empty());
        auto& buffer = freeBuffers.back();
        ptr = buffer.get();
        CC_EXPECTS(buffer->getSize() == bufferSize);
        currentBuffers.emplace_back(std::move(buffer));
        freeBuffers.pop_back();
    }
    CC_ENSURES(ptr);
    return ptr;
}

void UniformBlockResource::init(gfx::Device* deviceIn, uint32_t sz) {
    CC_EXPECTS(cpuBuffer.empty());
    cpuBuffer.resize(sz);
    bufferPool.init(deviceIn, sz);
}

void DescriptorSetPool::init(gfx::Device* deviceIn,
                             IntrusivePtr<gfx::DescriptorSetLayout> layout) {
    CC_EXPECTS(deviceIn);
    CC_EXPECTS(layout);
    CC_EXPECTS(!device);
    CC_EXPECTS(!setLayout);
    device = deviceIn;
    setLayout = std::move(layout);
}

void DescriptorSetPool::syncDescriptorSets() noexcept {
    for (auto& set : currentDescriptorSets) {
        freeDescriptorSets.emplace_back(std::move(set));
    }
    currentDescriptorSets.clear();
}

gfx::DescriptorSet& DescriptorSetPool::getCurrentDescriptorSet() {
    CC_EXPECTS(!currentDescriptorSets.empty());
    return *currentDescriptorSets.back();
}

const gfx::DescriptorSet& DescriptorSetPool::getCurrentDescriptorSet() const {
    CC_EXPECTS(!currentDescriptorSets.empty());
    return *currentDescriptorSets.back();
}

gfx::DescriptorSet* DescriptorSetPool::allocateDescriptorSet() {
    CC_EXPECTS(device);
    CC_EXPECTS(setLayout);

    gfx::DescriptorSet* ptr = nullptr;

    if (freeDescriptorSets.empty()) {
        freeDescriptorSets.emplace_back(
            device->createDescriptorSet(gfx::DescriptorSetInfo{setLayout.get()}));
    }

    {
        CC_ENSURES(!freeDescriptorSets.empty());
        auto& set = freeDescriptorSets.back();
        ptr = set.get();
        CC_EXPECTS(set->getLayout() == setLayout);
        currentDescriptorSets.emplace_back(std::move(set));
        freeDescriptorSets.pop_back();
    }
    CC_ENSURES(ptr);
    return ptr;
}

} // namespace render

} // namespace cc
