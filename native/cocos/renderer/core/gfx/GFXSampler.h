#ifndef CC_CORE_GFX_SAMPLER_H_
#define CC_CORE_GFX_SAMPLER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXSampler : public Object {
 public:
  GFXSampler(GFXDevice* device);
  virtual ~GFXSampler();
  
 public:
  virtual bool Initialize(const GFXSamplerInfo& info) = 0;
  virtual void Destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE const String& name() const { return name_; }
  CC_INLINE GFXFilter min_filter() const { return min_filter_; }
  CC_INLINE GFXFilter mag_filter() const { return mag_filter_; }
  CC_INLINE GFXFilter mip_filter() const { return mip_filter_; }
  CC_INLINE GFXAddress address_u() const { return address_u_; }
  CC_INLINE GFXAddress address_v() const { return address_v_; }
  CC_INLINE GFXAddress address_w() const { return address_w_; }
  CC_INLINE uint max_anisotropy() const { return max_anisotropy_; }
  CC_INLINE GFXComparisonFunc cmp_func() const { return cmp_func_; }
  CC_INLINE const GFXColor& border_color() const { return border_color_; }
  CC_INLINE uint min_lod() const { return min_lod_; }
  CC_INLINE uint max_lod() const { return max_lod_; }
  CC_INLINE float mip_lod_bias() const { return mip_lod_bias_; }
  
 protected:
  GFXDevice* device_;
  String name_;
  GFXFilter min_filter_;
  GFXFilter mag_filter_;
  GFXFilter mip_filter_;
  GFXAddress address_u_;
  GFXAddress address_v_;
  GFXAddress address_w_;
  uint max_anisotropy_;
  GFXComparisonFunc cmp_func_;
  GFXColor border_color_;
  uint min_lod_;
  uint max_lod_;
  float mip_lod_bias_;
};

NS_CC_END

#endif // CC_CORE_GFX_SAMPLER_H_
