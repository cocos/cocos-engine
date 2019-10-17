#ifndef CC_CORE_GFX_TEXTURE_VIEW_H_
#define CC_CORE_GFX_TEXTURE_VIEW_H_

#include "GFXDef.h"

CC_NAMESPACE_BEGIN

class CC_CORE_API GFXTextureView : public Object {
 public:
  GFXTextureView(GFXDevice* device);
  virtual ~GFXTextureView();
  
 public:
  virtual bool Initialize(const GFXTextureViewInfo& info) = 0;
  virtual void Destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE GFXTexture* texture() const { return texture_; }
  CC_INLINE GFXTextureViewType type() const { return type_; }
  CC_INLINE GFXFormat format() const { return format_; }
  CC_INLINE uint base_level() const { return base_level_; }
  CC_INLINE uint level_count() const { return level_count_; }
  CC_INLINE uint base_layer() const { return base_layer_; }
  CC_INLINE uint layer_count() const { return layer_count_; }
  
 protected:
  GFXDevice* device_;
  GFXTexture* texture_;
  GFXTextureViewType type_;
  GFXFormat format_;
  uint base_level_;
  uint level_count_;
  uint base_layer_;
  uint layer_count_;
};

CC_NAMESPACE_END

#endif // CC_CORE_GFX_TEXTURE_VIEW_H_
