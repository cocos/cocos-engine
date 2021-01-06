#pragma once

#include "../gfx/GFXDevice.h"
#include "base/threading/Semaphore.h"
#include "GFXAgent.h"

namespace cc {

class MessageQueue;

namespace gfx {

class LinearAllocatorPool;
class CommandBuffer;
constexpr uint MAX_CPU_FRAME_AHEAD = 1u;

// one per CPU core
struct SubmitContext final {
    MessageQueue *encoder{nullptr};
    CommandBuffer *commandBuffer{nullptr};
};

class CC_DLL DeviceAgent final : public Agent<Device> {
public:
    using Agent::Agent;
    DeviceAgent(Device *const actor) noexcept
    : Agent(actor, nullptr) {}
    ~DeviceAgent() override;

    bool initialize(const DeviceInfo &info) override;
    void destroy() override;
    void resize(uint width, uint height) override;
    void acquire() override;
    void present() override;

    CommandBuffer *doCreateCommandBuffer(const CommandBufferInfo &info) override;
    Fence *createFence() override;
    Queue *createQueue() override;
    Buffer *createBuffer() override;
    Texture *createTexture() override;
    Sampler *createSampler() override;
    Shader *createShader() override;
    InputAssembler *createInputAssembler() override;
    RenderPass *createRenderPass() override;
    Framebuffer *createFramebuffer() override;
    DescriptorSet *createDescriptorSet() override;
    DescriptorSetLayout *createDescriptorSetLayout() override;
    PipelineLayout *createPipelineLayout() override;
    PipelineState *createPipelineState() override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;

    void setMultithreaded(bool multithreaded) override;
    SurfaceTransform getSurfaceTransform() const override { return _actor->getSurfaceTransform(); }
    uint getWidth() const override { return _actor->getWidth(); }
    uint getHeight() const override { return _actor->getHeight(); }
    uint getNativeWidth() const override { return _actor->getNativeWidth(); }
    uint getNativeHeight() const override { return _actor->getNativeHeight(); }
    MemoryStatus &getMemoryStatus() override { return _actor->getMemoryStatus(); }
    uint getNumDrawCalls() const override { return _actor->getNumDrawCalls(); }
    uint getNumInstances() const override { return _actor->getNumInstances(); }
    uint getNumTris() const override { return _actor->getNumTris(); }

    MessageQueue *getMessageQueue() const { return _mainEncoder; }
    LinearAllocatorPool *getMainAllocator() const { return _allocatorPools[_currentIndex]; }

protected:
    friend class CommandBufferAgent;
    
    bool _multithreaded{false};
    MessageQueue *_mainEncoder{nullptr};
    
    uint _currentIndex = 0u;
    vector<LinearAllocatorPool *> _allocatorPools;
    Semaphore _frameBoundarySemaphore{MAX_CPU_FRAME_AHEAD};
    
    unordered_set<LinearAllocatorPool **> _allocatorPoolRefs;
};

} // namespace gfx
} // namespace cc
