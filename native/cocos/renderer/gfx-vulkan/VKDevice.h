#ifndef CC_GFXVULKAN_CCVK_DEVICE_H_
#define CC_GFXVULKAN_CCVK_DEVICE_H_

namespace cc {
namespace gfx {

class CCVKBuffer;
class CCVKTexture;
class CCVKRenderPass;

class CCVKGPUDevice;
class CCVKGPUContext;
class CCVKGPUSwapchain;

class CCVKGPUFencePool;
class CCVKGPURecycleBin;
class CCVKGPUTransportHub;
class CCVKGPUDescriptorHub;
class CCVKGPUSemaphorePool;
class CCVKGPUDescriptorSetPool;
class CCVKGPUCommandBufferPool;
class CCVKGPUStagingBufferPool;

class CC_VULKAN_API CCVKDevice : public Device {
public:
    CCVKDevice();
    ~CCVKDevice();

public:
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

    CC_INLINE bool checkExtension(const String &extension) const {
        return std::find_if(_extensions.begin(), _extensions.end(),
                            [extension](const char *device_extension) {
                                return std::strcmp(device_extension, extension.c_str()) == 0;
                            }) != _extensions.end();
    }

    CCVKGPUContext *gpuContext() const;
    CC_INLINE CCVKGPUDevice *gpuDevice() const { return _gpuDevice; }
    CC_INLINE CCVKGPUSwapchain *gpuSwapchain() { return _gpuSwapchain; }

    CC_INLINE CCVKGPUFencePool *gpuFencePool() { return _gpuFencePool; }
    CC_INLINE CCVKGPURecycleBin *gpuRecycleBin() { return _gpuRecycleBin; }
    CC_INLINE CCVKGPUTransportHub *gpuTransportHub() { return _gpuTransportHub; }
    CC_INLINE CCVKGPUDescriptorHub *gpuDescriptorHub() { return _gpuDescriptorHub; }
    CC_INLINE CCVKGPUSemaphorePool *gpuSemaphorePool() { return _gpuSemaphorePool; }
    CC_INLINE CCVKGPUDescriptorSetPool *gpuDescriptorSetPool() { return _gpuDescriptorSetPool; }
    CC_INLINE CCVKGPUCommandBufferPool *gpuCommandBufferPool() { return _gpuCommandBufferPool; }
    CC_INLINE CCVKGPUStagingBufferPool *gpuStagingBufferPool() { return _gpuStagingBufferPool; }

private:
    void buildSwapchain();

    CCVKGPUDevice *_gpuDevice = nullptr;
    CCVKGPUSwapchain *_gpuSwapchain = nullptr;
    vector<CCVKTexture *> _depthStencilTextures;

    CCVKGPUFencePool *_gpuFencePool = nullptr;
    CCVKGPURecycleBin *_gpuRecycleBin = nullptr;
    CCVKGPUTransportHub *_gpuTransportHub = nullptr;
    CCVKGPUDescriptorHub *_gpuDescriptorHub = nullptr;
    CCVKGPUSemaphorePool *_gpuSemaphorePool = nullptr;
    CCVKGPUDescriptorSetPool *_gpuDescriptorSetPool = nullptr;
    CCVKGPUCommandBufferPool *_gpuCommandBufferPool = nullptr;
    CCVKGPUStagingBufferPool *_gpuStagingBufferPool = nullptr;

    vector<const char *> _layers;
    vector<const char *> _extensions;

    bool _swapchainReady = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_CCVK_DEVICE_H_
