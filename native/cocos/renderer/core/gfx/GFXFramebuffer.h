#ifndef CC_CORE_GFX_FRAME_BUFFER_H_
#define CC_CORE_GFX_FRAME_BUFFER_H_

#include "GFXDef.h"

CC_NAMESPACE_BEGIN

class CC_CORE_API GFXFramebuffer : public Object {
 public:
  GFXFramebuffer(GFXDevice* device);
  virtual ~GFXFramebuffer();
  
 public:
  virtual bool Initialize(const GFXFramebufferInfo& info) = 0;
  virtual void Destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE GFXRenderPass* render_pass() const { return render_pass_; }
  CC_INLINE const GFXTextureViewList& color_views() const { return color_views_; }
  CC_INLINE GFXTextureView* depth_stencil_view() const { return depth_stencil_view_; }
  CC_INLINE bool is_offscreen() const { return is_offscreen_; }
  
 protected:
  GFXDevice* device_;
  GFXRenderPass* render_pass_;
  GFXTextureViewList color_views_;
  GFXTextureView* depth_stencil_view_;
  bool is_offscreen_;
};

CC_NAMESPACE_END

#endif // CC_CORE_GFX_FRAME_BUFFER_H_
