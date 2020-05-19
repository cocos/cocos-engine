#pragma once

NS_CC_BEGIN

class CCMTLStateCache;

class CCMTLDevice : public GFXDevice
{
public:
    CCMTLDevice();
    ~CCMTLDevice();
    
    virtual bool initialize(const GFXDeviceInfo& info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void begin() override {};
    virtual void present() override;
    virtual GFXWindow* createWindow(const GFXWindowInfo& info) override;
    virtual GFXQueue* createQueue(const GFXQueueInfo& info) override;
    virtual GFXCommandAllocator* createCommandAllocator(const GFXCommandAllocatorInfo& info) override;
    virtual GFXCommandBuffer* createCommandBuffer(const GFXCommandBufferInfo& info) override;
    virtual GFXBuffer* createBuffer(const GFXBufferInfo& info) override;
    virtual GFXTexture* createTexture(const GFXTextureInfo& info) override;
    virtual GFXTextureView* createTextureView(const GFXTextureViewInfo& info) override;
    virtual GFXSampler* createSampler(const GFXSamplerInfo& info) override;
    virtual GFXShader* createShader(const GFXShaderInfo& info) override;
    virtual GFXInputAssembler* createInputAssembler(const GFXInputAssemblerInfo& info) override;
    virtual GFXRenderPass* createRenderPass(const GFXRenderPassInfo& info) override;
    virtual GFXFramebuffer* createFramebuffer(const GFXFramebufferInfo& info) override;
    virtual GFXBindingLayout* createBindingLayout(const GFXBindingLayoutInfo& info) override;
    virtual GFXPipelineState* createPipelineState(const GFXPipelineStateInfo& info) override;
    virtual GFXPipelineLayout* createPipelineLayout(const GFXPipelineLayoutInfo& info) override;
    virtual void copyBuffersToTexture(const GFXDataArray& buffers, GFXTexture* dst, const GFXBufferTextureCopyList& regions) override;
    
    CC_INLINE void* getMTKView() const { return _mtkView; }
    CC_INLINE void* getMTLDevice() const { return _mtlDevice; }
    CC_INLINE CCMTLStateCache* getStateCache() const { return _stateCache; }
    CC_INLINE uint getMaximumSamplerUnits() const { return _maxSamplerUnits; }
    CC_INLINE uint getMaximumColorRenderTargets() const { return _maxColorRenderTargets; }
    CC_INLINE bool isIndirectCommandBufferSupported() const { return _icbSuppored; }
    
private:
    void* _mtkView= nullptr;
    void* _mtlDevice = nullptr;
    CCMTLStateCache* _stateCache = nullptr;
    unsigned long _mtlFeatureSet = 0;
    uint _maxSamplerUnits = 0;
    uint _maxColorRenderTargets = 0;
    bool _icbSuppored = false;
};

NS_CC_END
