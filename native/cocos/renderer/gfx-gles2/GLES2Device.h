#ifndef CC_GFXGLES2_GLES2_DEVICE_H_
#define CC_GFXGLES2_GLES2_DEVICE_H_

NS_CC_BEGIN

class GLES2StateCache;

class CC_GLES2_API GLES2Device : public GFXDevice {
public:
  GLES2Device();
  ~GLES2Device();
  
  GLES2StateCache* stateCache = nullptr;
  
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
  CC_INLINE bool useDrawInstanced() const { return _useDrawInstanced; }
  CC_INLINE bool useInstancedArrays() const { return _useInstancedArrays; }
  CC_INLINE bool useDiscardFramebuffer() const { return _useDiscardFramebuffer; }

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
  bool _useVAO                    = false;
  bool _useDrawInstanced          = false;
  bool _useInstancedArrays        = false;
  bool _useDiscardFramebuffer     = false;
};

NS_CC_END

#endif
