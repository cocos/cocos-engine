#ifndef CC_GFXVULKAN_CCVK_DEVICE_H_
#define CC_GFXVULKAN_CCVK_DEVICE_H_

NS_CC_BEGIN

class CCVKGPUContext;
class CCVKGPUDevice;
class CCVKGPUSwapchain;
class CCVKGPUSemaphorePool;
class CCVKGPUFencePool;
class CCVKTexture;
class CCVKTextureView;
class CCVKRenderPass;
class CCVKBuffer;

class CC_VULKAN_API CCVKDevice : public GFXDevice
{
public:
    CCVKDevice();
    ~CCVKDevice();

public:
    bool initialize(const GFXDeviceInfo& info) override;
    void destroy() override;
    void resize(uint width, uint height) override;
    void acquire() override;
    void present() override;
    GFXWindow* createWindow(const GFXWindowInfo& info) override;
    GFXQueue* createQueue(const GFXQueueInfo& info) override;
    GFXCommandAllocator* createCommandAllocator(const GFXCommandAllocatorInfo& info) override;
    GFXCommandBuffer* createCommandBuffer(const GFXCommandBufferInfo& info) override;
    GFXBuffer* createBuffer(const GFXBufferInfo& info) override;
    GFXTexture* createTexture(const GFXTextureInfo& info) override;
    GFXTextureView* createTextureView(const GFXTextureViewInfo& info) override;
    GFXSampler* createSampler(const GFXSamplerInfo& info) override;
    GFXShader* createShader(const GFXShaderInfo& info) override;
    GFXInputAssembler* createInputAssembler(const GFXInputAssemblerInfo& info) override;
    GFXRenderPass* createRenderPass(const GFXRenderPassInfo& info) override;
    GFXFramebuffer* createFramebuffer(const GFXFramebufferInfo& info) override;
    GFXBindingLayout* createBindingLayout(const GFXBindingLayoutInfo& info) override;
    virtual GFXPipelineState* createPipelineState(const GFXPipelineStateInfo& info) override;
    virtual GFXPipelineLayout* createPipelineLayout(const GFXPipelineLayoutInfo& info) override;
    virtual void copyBuffersToTexture(const GFXDataArray& buffers, GFXTexture* dst, const GFXBufferTextureCopyList& regions) override;

    CC_INLINE bool checkExtension(const String& extension) const {
        return std::find_if(_extensions.begin(), _extensions.end(),
            [extension](const char* device_extension) {
            return std::strcmp(device_extension, extension.c_str()) == 0;
        }) != _extensions.end();
    }

    CCVKGPUContext* gpuContext() const;
    CC_INLINE CCVKGPUDevice* gpuDevice() const { return _gpuDevice; }
    CC_INLINE CCVKGPUSwapchain* gpuSwapchain() { return _gpuSwapchain; }
    CC_INLINE CCVKGPUSemaphorePool* gpuSemaphorePool() { return _gpuSemaphorePool; }
    CC_INLINE CCVKGPUFencePool* gpuFencePool() { return _gpuFencePool; }
    CC_INLINE CCVKBuffer* stagingBuffer() { return _stagingBuffer; }
    CC_INLINE const std::vector<const char *>& getLayers() const { return _layers; }
    CC_INLINE const std::vector<const char *>& getExtensions() const { return _extensions; }

private:
    void buildSwapchain();

    CCVKGPUDevice* _gpuDevice = nullptr;
    CCVKGPUSemaphorePool* _gpuSemaphorePool = nullptr;
    CCVKGPUFencePool* _gpuFencePool = nullptr;
    CCVKGPUSwapchain* _gpuSwapchain = nullptr;
    std::vector<CCVKTextureView*> _depthStencilTextureViews;
    std::vector<CCVKTexture*> _depthStencilTextures;
    CCVKRenderPass* _renderPass = nullptr;
    CCVKBuffer* _stagingBuffer = nullptr;

    uint32_t _defaultStagingBufferSize = 1024;

    std::vector<const char *> _layers;
    std::vector<const char *> _extensions;
};

NS_CC_END

#endif // CC_GFXVULKAN_CCVK_DEVICE_H_
