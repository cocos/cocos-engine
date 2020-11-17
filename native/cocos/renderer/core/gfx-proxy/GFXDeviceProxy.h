#pragma once

#include "GFXProxy.h"
#include "GFXDeviceThread.h"
#include "../gfx/GFXDevice.h"

namespace cc {
namespace gfx {

class CC_DLL DeviceProxy : public Proxy<Device> {
public:
    using Proxy::Proxy;

    virtual bool initialize(const DeviceInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void acquire() override;
    virtual void present() override;
    virtual CommandBuffer *createCommandBuffer(const CommandBufferInfo &info) override;
    virtual Fence *createFence(const FenceInfo &info) override;
    virtual Queue *createQueue(const QueueInfo &info) override;
    virtual Buffer *createBuffer(const BufferInfo &info) override;
    virtual Buffer *createBuffer(const BufferViewInfo &info) override;
    virtual Texture *createTexture(const TextureInfo &info) override;
    virtual Texture *createTexture(const TextureViewInfo &info) override;
    virtual Sampler *createSampler(const SamplerInfo &info) override;
    virtual Shader *createShader(const ShaderInfo &info) override;
    virtual InputAssembler *createInputAssembler(const InputAssemblerInfo &info) override;
    virtual RenderPass *createRenderPass(const RenderPassInfo &info) override;
    virtual Framebuffer *createFramebuffer(const FramebufferInfo &info) override;
    virtual DescriptorSet *createDescriptorSet(const DescriptorSetInfo &info) override;
    virtual DescriptorSetLayout *createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) override;
    virtual PipelineLayout *createPipelineLayout(const PipelineLayoutInfo &info) override;
    virtual PipelineState *createPipelineState(const PipelineStateInfo &info) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;

    virtual SurfaceTransform getSurfaceTransform() const override { return _remote->getSurfaceTransform(); }
    virtual uint getWidth() const override { return _remote->getWidth(); }
    virtual uint getHeight() const override { return _remote->getHeight(); }
    virtual uint getNativeWidth() const override { return _remote->getNativeWidth(); }
    virtual uint getNativeHeight() const override { return _remote->getNativeHeight(); }
    virtual MemoryStatus &getMemoryStatus() override { return _remote->getMemoryStatus(); }
    virtual uint getNumDrawCalls() const override { return _remote->getNumDrawCalls(); }
    virtual uint getNumInstances() const override { return _remote->getNumInstances(); }
    virtual uint getNumTris() const override { return _remote->getNumTris(); }

protected:

    friend class DeviceThread;

    std::unique_ptr<DeviceThread> _thread{};
};

} // namespace gfx
} // namespace cc
