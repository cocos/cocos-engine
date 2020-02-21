#ifndef CC_GFXGLES3_GLES3_DEVICE_H_
#define CC_GFXGLES3_GLES3_DEVICE_H_

NS_CC_BEGIN

class GLES3StateCache;

class CC_GLES3_API GLES3Device : public GFXDevice {
public:
  GLES3Device();
  ~GLES3Device();
  
  GLES3StateCache* stateCache = nullptr;
  
public:
  bool initialize(const GFXDeviceInfo& info);
  void destroy();
  void resize(uint width, uint height);
  void present();
  GFXWindow* createWindow(const GFXWindowInfo& info);
  GFXQueue* createQueue(const GFXQueueInfo& info);
  GFXCommandAllocator* createCommandAllocator(const GFXCommandAllocatorInfo& info);
  GFXCommandBuffer* createCommandBuffer(const GFXCommandBufferInfo& info);
  GFXBuffer* createBuffer(const GFXBufferInfo& info);
  GFXTexture* createTexture(const GFXTextureInfo& info);
  GFXTextureView* createTextureView(const GFXTextureViewInfo& info);
  GFXSampler* createSampler(const GFXSamplerInfo& info);
  GFXShader* createShader(const GFXShaderInfo& info);
  GFXInputAssembler* createInputAssembler(const GFXInputAssemblerInfo& info);
  GFXRenderPass* createRenderPass(const GFXRenderPassInfo& info);
  GFXFramebuffer* createFramebuffer(const GFXFramebufferInfo& info);
  GFXBindingLayout* createBindingLayout(const GFXBindingLayoutInfo& info);
  virtual GFXPipelineState* createPipelineState(const GFXPipelineStateInfo& info) override;
  virtual GFXPipelineLayout* createPipelineLayout(const GFXPipelineLayoutInfo& info) override;
    virtual void copyBuffersToTexture(GFXBuffer* src, GFXTexture* dst, const GFXBufferTextureCopyList& regions) override;
  
  CC_INLINE bool useVAO() const { return _useVAO; }

  CC_INLINE bool checkExtension(const String& extension) const {
    for (size_t i = 0; i < _extensions.size(); ++i) {
      if (_extensions[i].find(extension) != String::npos) {
        return true;
      }
    }
    return false;
  }
  
 private:
  StringArray _extensions;
  bool _useVAO = true;
};

NS_CC_END

#endif
