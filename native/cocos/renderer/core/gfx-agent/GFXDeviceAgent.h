#pragma once

#include "../gfx/GFXDevice.h"
#include "threading/Semaphore.h"
#include "GFXAgent.h"

namespace cc {

class CommandEncoder;

namespace gfx {

class CommandBuffer;
constexpr uint MAX_CPU_FRAME_AHEAD = 1u;

// one per CPU core
struct SubmitContext final {
    CommandEncoder *encoder{nullptr};
    CommandBuffer *commandBuffer{nullptr};
};

class CC_DLL DeviceAgent final : public Agent<Device> {
public:
    using Agent::Agent;

    virtual bool initialize(const DeviceInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void acquire() override;
    virtual void present() override;

    virtual CommandBuffer *doCreateCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    virtual Fence *createFence() override;
    virtual Queue *createQueue() override;
    virtual Buffer *createBuffer() override;
    virtual Texture *createTexture() override;
    virtual Sampler *createSampler() override;
    virtual Shader *createShader() override;
    virtual InputAssembler *createInputAssembler() override;
    virtual RenderPass *createRenderPass() override;
    virtual Framebuffer *createFramebuffer() override;
    virtual DescriptorSet *createDescriptorSet() override;
    virtual DescriptorSetLayout *createDescriptorSetLayout() override;
    virtual PipelineLayout *createPipelineLayout() override;
    virtual PipelineState *createPipelineState() override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;


    virtual void setMultithreaded(bool multithreaded) override;
    virtual SurfaceTransform getSurfaceTransform() const override { return _actor->getSurfaceTransform(); }
    virtual uint getWidth() const override { return _actor->getWidth(); }
    virtual uint getHeight() const override { return _actor->getHeight(); }
    virtual uint getNativeWidth() const override { return _actor->getNativeWidth(); }
    virtual uint getNativeHeight() const override { return _actor->getNativeHeight(); }
    virtual MemoryStatus &getMemoryStatus() override { return _actor->getMemoryStatus(); }
    virtual uint getNumDrawCalls() const override { return _actor->getNumDrawCalls(); }
    virtual uint getNumInstances() const override { return _actor->getNumInstances(); }
    virtual uint getNumTris() const override { return _actor->getNumTris(); }

    CommandEncoder *getMainEncoder() const { return _mainEncoder; }
protected:

    bool _multithreaded{false};
    CommandEncoder *_mainEncoder{nullptr};

    Semaphore _frameBoundarySemaphore{MAX_CPU_FRAME_AHEAD + 1};
};

} // namespace gfx
} // namespace cc
