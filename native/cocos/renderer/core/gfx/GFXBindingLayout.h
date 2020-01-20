#ifndef CC_CORE_GFX_BINDING_LAYOUT_H_
#define CC_CORE_GFX_BINDING_LAYOUT_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXBindingLayout : public Object {
 public:
  GFXBindingLayout(GFXDevice* device);
  virtual ~GFXBindingLayout();
  
 public:
  virtual bool Initialize(const GFXBindingLayoutInfo& info) = 0;
  virtual void destroy() = 0;
  virtual void Update() = 0;
  
  void BindBuffer(uint binding, GFXBuffer* buffer);
  void BindTextureView(uint binding, GFXTextureView* tex_view);
  void BindSampler(uint binding, GFXSampler* sampler);
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE const GFXBindingUnitList& binding_units() const { return binding_units_; }
  
 protected:
  GFXDevice* device_;
  GFXBindingUnitList binding_units_;
  bool is_dirty_;
};

NS_CC_END

#endif // CC_CORE_GFX_BINDING_LAYOUT_H_
