#ifndef CC_GFXGLES3_GLES3_DEVICE_H_
#define CC_GFXGLES3_GLES3_DEVICE_H_

CC_NAMESPACE_BEGIN

class GLES3StateCache;

class CC_GLES3_API GLES3Device : public GFXDevice {
public:
  GLES3Device();
  ~GLES3Device();
  
  GLES3StateCache* state_cache;
  
public:
  bool Initialize(const GFXDeviceInfo& info);
  void Destroy();
  void Resize(uint width, uint height);
  void Present();
  GFXWindow* CreateGFXWindow(const GFXWindowInfo& info);
  GFXQueue* CreateGFXQueue(const GFXQueueInfo& info);
  GFXCommandAllocator* CreateGFXCommandAllocator(const GFXCommandAllocatorInfo& info);
  GFXCommandBuffer* CreateGFXCommandBuffer(const GFXCommandBufferInfo& info);
  GFXBuffer* CreateGFXBuffer(const GFXBufferInfo& info);
  GFXTexture* CreateGFXTexture(const GFXTextureInfo& info);
  GFXTextureView* CreateGFXTextureView(const GFXTextureViewInfo& info);
  GFXSampler* CreateGFXSampler(const GFXSamplerInfo& info);
  GFXShader* CreateGFXShader(const GFXShaderInfo& info);
  GFXInputAssembler* CreateGFXInputAssembler(const GFXInputAssemblerInfo& info);
  GFXRenderPass* CreateGFXRenderPass(const GFXRenderPassInfo& info);
  GFXFramebuffer* CreateGFXFramebuffer(const GFXFramebufferInfo& info);
  GFXBindingLayout* CreateGFXBindingLayout(const GFXBindingLayoutInfo& info);
  
  CC_INLINE bool use_vao() const { return use_vao_; }

  CC_INLINE bool CheckExtension(const String& extension) const {
    for (size_t i = 0; i < extensions_.size(); ++i) {
      if (extensions_[i].find(extension) != String::npos) {
        return true;
      }
    }
    return false;
  }
  
 private:
  StringArray extensions_;
  bool use_vao_;
};

CC_NAMESPACE_END

#endif
