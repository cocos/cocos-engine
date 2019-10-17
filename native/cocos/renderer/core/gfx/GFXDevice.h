#ifndef CC_CORE_GFX_DEVICE_H_
#define CC_CORE_GFX_DEVICE_H_

#include "GFXDef.h"

CC_NAMESPACE_BEGIN

class CC_CORE_API GFXDevice : public Object {
 public:
  GFXDevice();
  virtual ~GFXDevice();
  
 public:
  virtual bool Initialize(const GFXDeviceInfo& info) = 0;
  virtual void Destroy() = 0;
  virtual void Resize(uint width, uint height) = 0;
  virtual void Present() = 0;
  virtual GFXWindow* CreateGFXWindow(const GFXWindowInfo& info) = 0;
  virtual GFXQueue* CreateGFXQueue(const GFXQueueInfo& info) = 0;
  virtual GFXCommandAllocator* CreateGFXCommandAllocator(const GFXCommandAllocatorInfo& info) = 0;
  virtual GFXCommandBuffer* CreateGFXCommandBuffer(const GFXCommandBufferInfo& info) = 0;
  virtual GFXBuffer* CreateGFXBuffer(const GFXBufferInfo& info) = 0;
  virtual GFXTexture* CreateGFXTexture(const GFXTextureInfo& info) = 0;
  virtual GFXTextureView* CreateGFXTextureView(const GFXTextureViewInfo& info) = 0;
  virtual GFXSampler* CreateGFXSampler(const GFXSamplerInfo& info) = 0;
  virtual GFXShader* CreateGFXShader(const GFXShaderInfo& info) = 0;
  virtual GFXInputAssembler* CreateGFXInputAssembler(const GFXInputAssemblerInfo& info) = 0;
  virtual GFXRenderPass* CreateGFXRenderPass(const GFXRenderPassInfo& info) = 0;
  virtual GFXFramebuffer* CreateGFXFramebuffer(const GFXFramebufferInfo& info) = 0;
  virtual GFXBindingLayout* CreateGFXBindingLayout(const GFXBindingLayoutInfo& info) = 0;
  
  CC_INLINE GFXAPI api() const { return api_; }
  CC_INLINE GFXMemoryStatus& mem_status() { return mem_status_; }
  CC_INLINE uint width() { return width_; }
  CC_INLINE uint height() { return height_; }
  CC_INLINE const GFXMemoryStatus& mem_status() const { return mem_status_; }
  CC_INLINE GFXContext* context() const { return context_; }
  CC_INLINE GFXWindow* window() const { return window_; }
  CC_INLINE GFXQueue* queue() const { return queue_; }
  CC_INLINE GFXCommandAllocator* cmd_allocator() const { return cmd_allocator_; }
  
  CC_INLINE bool HasFeature(GFXFeature feature) const { return features_[(int)feature]; }
  
 protected:
  GFXAPI api_;
  String device_name_;
  String renderer_;
  String vendor_;
  String version_;
  bool features_[(int)GFXFeature::COUNT];
  uint width_;
  uint height_;
  uint native_width_;
  uint native_height_;
  GFXMemoryStatus mem_status_;
  intptr_t window_handle_;
  GFXContext* context_;
  GFXWindow* window_;
  GFXQueue* queue_;
  GFXCommandAllocator* cmd_allocator_;
  uint num_draw_calls_;
  uint num_tris_;
};

CC_NAMESPACE_END

#endif // CC_CORE_GFX_DEVICE_H_
