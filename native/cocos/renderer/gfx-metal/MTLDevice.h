#pragma once

#include "MTLConfig.h"

namespace cc {
namespace gfx {

class CCMTLCommandAllocator;
class CCMTLGPUStagingBufferPool;
class CCMTLSemaphore;

class CCMTLDevice : public Device {
public:
    CCMTLDevice();
    ~CCMTLDevice() = default;

    using Device::createCommandBuffer;
    using Device::createFence;
    using Device::createQueue;
    using Device::createBuffer;
    using Device::createTexture;
    using Device::createSampler;
    using Device::createShader;
    using Device::createInputAssembler;
    using Device::createRenderPass;
    using Device::createFramebuffer;
    using Device::createDescriptorSet;
    using Device::createDescriptorSetLayout;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::copyBuffersToTexture;

    virtual bool initialize(const DeviceInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void acquire() override;
    virtual void present() override;

    CC_INLINE void *getMTLCommandQueue() const { return _mtlCommandQueue; }
    CC_INLINE void *getMTKView() const { return _mtkView; }
    CC_INLINE void *getMTLDevice() const { return _mtlDevice; }
    CC_INLINE uint getMaximumSamplerUnits() const { return _maxSamplerUnits; }
    CC_INLINE uint getMaximumColorRenderTargets() const { return _maxColorRenderTargets; }
    CC_INLINE uint getMaximumBufferBindingIndex() const { return _maxBufferBindingIndex; }
    CC_INLINE bool isIndirectCommandBufferSupported() const { return _icbSuppored; }
    CC_INLINE bool isIndirectDrawSupported() const { return _indirectDrawSupported; }
    CC_INLINE CCMTLGPUStagingBufferPool *gpuStagingBufferPool() const { return _gpuStagingBufferPools[_currentFrameIndex]; }
    CC_INLINE bool isSamplerDescriptorCompareFunctionSupported() const { return _isSamplerDescriptorCompareFunctionSupported; }

protected:
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

private:
    void onMemoryWarning();

private:
    void *_mtlCommandQueue = nullptr;
    void *_mtkView = nullptr;
    void *_mtlDevice = nullptr;
    unsigned long _mtlFeatureSet = 0;
    uint _maxSamplerUnits = 0;
    uint _maxColorRenderTargets = 0;
    uint _maxBufferBindingIndex = 0;
    bool _icbSuppored = false;
    bool _indirectDrawSupported = false;
    bool _isSamplerDescriptorCompareFunctionSupported = false;
    CCMTLGPUStagingBufferPool *_gpuStagingBufferPools[MAX_FRAMES_IN_FLIGHT] = {nullptr};
    CCMTLSemaphore *_inFlightSemaphore = nullptr;
    uint _currentFrameIndex = 0;
    uint32_t _memoryAlarmListenerId = 0;
};

} // namespace gfx
} // namespace cc
