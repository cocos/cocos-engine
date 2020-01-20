#ifndef CC_CORE_GFX_PIPELINE_LAYOUT_H_
#define CC_CORE_GFX_PIPELINE_LAYOUT_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXPipelineLayout : public Object {
 public:
  GFXPipelineLayout(GFXDevice* device);
  virtual ~GFXPipelineLayout();
  
public:
  virtual bool Initialize(const GFXPipelineLayoutInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE const GFXPushConstantRangeList& push_constant_ranges() const { return push_constant_ranges_; }
  CC_INLINE const GFXBindingLayoutList& layouts() const { return layouts_; }
  
protected:
  GFXDevice* device_;
  GFXPushConstantRangeList push_constant_ranges_;
  GFXBindingLayoutList layouts_;
};

NS_CC_END

#endif // CC_CORE_GFX_PIPELINE_LAYOUT_H_
