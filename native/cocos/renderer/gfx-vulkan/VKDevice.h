#ifndef CC_GFXVULKAN_DEVICE_H_
#define CC_GFXVULKAN_DEVICE_H_

namespace cc {
namespace gfx {

class CCVKTexture;

class CCVKGPUDevice;
class CCVKGPUContext;
class CCVKGPUSwapchain;

class CCVKGPUBufferHub;
class CCVKGPUTransportHub;
class CCVKGPUDescriptorHub;
class CCVKGPUSemaphorePool;
class CCVKGPUDescriptorSetHub;

class CCVKGPUFencePool;
class CCVKGPURecycleBin;
class CCVKGPUStagingBufferPool;

class CC_VULKAN_API CCVKDevice final : public Device {
public:
    CCVKDevice();
    ~CCVKDevice();

    friend class CCVKContext;
    using Device::copyBuffersToTexture;
    using Device::createBuffer;
    using Device::createCommandBuffer;
    using Device::createDescriptorSet;
    using Device::createDescriptorSetLayout;
    using Device::createFence;
    using Device::createFramebuffer;
    using Device::createInputAssembler;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::createQueue;
    using Device::createRenderPass;
    using Device::createSampler;
    using Device::createShader;
    using Device::createTexture;

    virtual bool initialize(const DeviceInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void acquire() override;
    virtual void present() override;
    CC_INLINE bool checkExtension(const String &extension) const {
        return std::find_if(_extensions.begin(), _extensions.end(),
                            [extension](const char *device_extension) {
                                return std::strcmp(device_extension, extension.c_str()) == 0;
                            }) != _extensions.end();
    }

    CCVKGPUContext *gpuContext() const;
    CC_INLINE CCVKGPUDevice *gpuDevice() const { return _gpuDevice; }
    CC_INLINE CCVKGPUSwapchain *gpuSwapchain() { return _gpuSwapchain; }

    CC_INLINE CCVKGPUBufferHub *gpuBufferHub() { return _gpuBufferHub; }
    CC_INLINE CCVKGPUTransportHub *gpuTransportHub() { return _gpuTransportHub; }
    CC_INLINE CCVKGPUDescriptorHub *gpuDescriptorHub() { return _gpuDescriptorHub; }
    CC_INLINE CCVKGPUSemaphorePool *gpuSemaphorePool() { return _gpuSemaphorePool; }
    CC_INLINE CCVKGPUDescriptorSetHub *gpuDescriptorSetHub() { return _gpuDescriptorSetHub; }

    CCVKGPUFencePool *gpuFencePool();
    CCVKGPURecycleBin *gpuRecycleBin();
    CCVKGPUStagingBufferPool *gpuStagingBufferPool();

private:
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

    void destroySwapchain();
    bool checkSwapchainStatus();

    CCVKGPUDevice *_gpuDevice = nullptr;
    CCVKGPUSwapchain *_gpuSwapchain = nullptr;
    vector<CCVKTexture *> _depthStencilTextures;

    vector<CCVKGPUFencePool *> _gpuFencePools;
    vector<CCVKGPURecycleBin *> _gpuRecycleBins;
    vector<CCVKGPUStagingBufferPool *> _gpuStagingBufferPools;

    CCVKGPUBufferHub *_gpuBufferHub = nullptr;
    CCVKGPUTransportHub *_gpuTransportHub = nullptr;
    CCVKGPUDescriptorHub *_gpuDescriptorHub = nullptr;
    CCVKGPUSemaphorePool *_gpuSemaphorePool = nullptr;
    CCVKGPUDescriptorSetHub *_gpuDescriptorSetHub = nullptr;

    vector<const char *> _layers;
    vector<const char *> _extensions;

    bool _swapchainReady = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_DEVICE_H_
