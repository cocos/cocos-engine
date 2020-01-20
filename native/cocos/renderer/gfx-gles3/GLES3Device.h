#ifndef CC_GFXGLES3_GLES3_DEVICE_H_
#define CC_GFXGLES3_GLES3_DEVICE_H_

NS_CC_BEGIN

class GLES3StateCache;

class CC_GLES3_API GLES3Device : public GFXDevice {
public:
  GLES3Device();
  ~GLES3Device();
  
  GLES3StateCache* state_cache = nullptr;
  
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
  
  CC_INLINE bool use_vao() const { return use_vao_; }

  CC_INLINE bool checkExtension(const String& extension) const {
    for (size_t i = 0; i < extensions_.size(); ++i) {
      if (extensions_[i].find(extension) != String::npos) {
        return true;
      }
    }
    return false;
  }
  
 private:
  StringArray extensions_;
  bool use_vao_ = true;
};

NS_CC_END

#endif
