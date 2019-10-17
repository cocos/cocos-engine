#ifndef CC_CORE_GFX_WINDOW_H_
#define CC_CORE_GFX_WINDOW_H_

#include "GFXDef.h"

CC_NAMESPACE_BEGIN

class CC_CORE_API GFXWindow : public Object {
 public:
  GFXWindow(GFXDevice* device);
  virtual ~GFXWindow();
  
 public:
  virtual bool Initialize(const GFXWindowInfo& info) = 0;
  virtual void Destroy() = 0;
  virtual void Resize(uint width, uint height) = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE const String& title() const { return title_; }
  CC_INLINE int left() const { return left_; }
  CC_INLINE int top() const { return top_; }
  CC_INLINE uint width() const { return width_; }
  CC_INLINE uint height() const { return height_; }
  CC_INLINE uint native_width() const { return native_width_; }
  CC_INLINE uint native_height() const { return native_height_; }
  CC_INLINE GFXFormat color_fmt() const { return color_fmt_; }
  CC_INLINE GFXFormat depth_stencil_fmt() const { return depth_stencil_fmt_; }
  CC_INLINE bool is_offscreen() const { return is_offscreen_; }
  CC_INLINE GFXRenderPass* render_pass() const { return render_pass_; }
  CC_INLINE GFXTexture* color_texture() const { return color_texture_; }
  CC_INLINE GFXTextureView* color_tex_view() const { return color_tex_view_; }
  CC_INLINE GFXTexture* depth_stencil_texture() const { return depth_stencil_texture_; }
  CC_INLINE GFXTextureView* depth_stencil_tex_view() const { return depth_stencil_tex_view_; }
  CC_INLINE GFXFramebuffer* framebuffer() const { return framebuffer_; }
  
 protected:
  GFXDevice* device_;
  String title_;
  int left_;
  int top_;
  uint width_;
  uint height_;
  uint native_width_;
  uint native_height_;
  GFXFormat color_fmt_;
  GFXFormat depth_stencil_fmt_;
  bool is_offscreen_;
  bool is_fullscreen_;
  GFXRenderPass* render_pass_;
  GFXTexture* color_texture_;
  GFXTextureView* color_tex_view_;
  GFXTexture* depth_stencil_texture_;
  GFXTextureView* depth_stencil_tex_view_;
  GFXFramebuffer* framebuffer_;
};

CC_NAMESPACE_END

#endif // CC_CORE_GFX_TEXTURE_VIEW_H_
