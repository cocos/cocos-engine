#ifndef CC_GFXGLES2_GLES2_DEVICE_H_
#define CC_GFXGLES2_GLES2_DEVICE_H_

CC_NAMESPACE_BEGIN

class GLES2StateCache;

class CC_GLES2_API GLES2Device : public GFXDevice {
public:
  GLES2Device();
  ~GLES2Device();
  
  GLES2StateCache* state_cache;
  
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
  CC_INLINE bool use_draw_instanced() const { return use_draw_instanced_; }
  CC_INLINE bool use_instanced_arrays() const { return use_instanced_arrays_; }
  CC_INLINE bool use_discard_framebuffer() const { return use_discard_framebuffer_; }

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
  bool use_draw_instanced_;
  bool use_instanced_arrays_;
  bool use_discard_framebuffer_;
};

CC_NAMESPACE_END

#endif
