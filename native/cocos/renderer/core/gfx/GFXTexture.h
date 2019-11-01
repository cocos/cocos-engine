#ifndef CC_CORE_GFX_TEXTURE_H_
#define CC_CORE_GFX_TEXTURE_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXTexture : public Object {
 public:
  GFXTexture(GFXDevice* device);
  virtual ~GFXTexture();
  
 public:
  virtual bool Initialize(const GFXTextureInfo& info) = 0;
  virtual void Destroy() = 0;
  virtual void Resize(uint width, uint height) = 0;
  
  CC_INLINE GFXTextureType type() const { return type_; }
  CC_INLINE GFXTextureUsage usage() const { return usage_; }
  CC_INLINE GFXFormat format() const { return format_; }
  CC_INLINE uint width() const { return width_; }
  CC_INLINE uint height() const { return height_; }
  CC_INLINE uint depth() const { return depth_; }
  CC_INLINE uint array_layer() const { return array_layer_; }
  CC_INLINE uint mip_level() const { return mip_level_; }
  CC_INLINE uint size() const { return size_; }
  CC_INLINE GFXSampleCount samples() const { return samples_; }
  CC_INLINE GFXTextureFlags flags() const { return flags_; }
  CC_INLINE uint8_t* buffer() const { return buffer_; }
  
 protected:
  GFXDevice* device_;
  GFXTextureType type_;
  GFXTextureUsage usage_;
  GFXFormat format_;
  uint width_;
  uint height_;
  uint depth_;
  uint array_layer_;
  uint mip_level_;
  uint size_;
  GFXSampleCount samples_;
  GFXTextureFlags flags_;
  uint8_t* buffer_;
};

NS_CC_END

#endif // CC_CORE_GFX_TEXTURE_H_
