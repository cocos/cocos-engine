#ifndef CC_CORE_GFX_CONTEXT_H_
#define CC_CORE_GFX_CONTEXT_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXContext : public Object {
 public:
  GFXContext(GFXDevice* device);
  virtual ~GFXContext();
  
 public:
  virtual bool Initialize(const GFXContextInfo& info) = 0;
  virtual void Destroy() = 0;
  virtual void Present() = 0;

  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE GFXContext* shared_ctx() const { return shared_ctx_; }
  CC_INLINE GFXVsyncMode vsync_mode() const { return vsync_mode_; }
  CC_INLINE GFXFormat color_fmt() const { return color_fmt_; }
  CC_INLINE GFXFormat depth_stencil_fmt() const { return depth_stencil_fmt_; }
  
 protected:
  GFXDevice* device_;
  intptr_t window_handle_;
  GFXContext* shared_ctx_;
  GFXVsyncMode vsync_mode_;
  GFXFormat color_fmt_;
  GFXFormat depth_stencil_fmt_;
};

NS_CC_END

#endif // CC_CORE_GFX_CONTEXT_H_
