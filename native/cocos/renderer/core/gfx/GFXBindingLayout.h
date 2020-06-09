#ifndef CC_CORE_GFX_BINDING_LAYOUT_H_
#define CC_CORE_GFX_BINDING_LAYOUT_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXBindingLayout : public GFXObject {
 public:
  GFXBindingLayout(GFXDevice* device);
  virtual ~GFXBindingLayout();
  
 public:
  virtual bool initialize(const GFXBindingLayoutInfo& info) = 0;
  virtual void destroy() = 0;
  virtual void update() = 0;
  
  void bindBuffer(uint binding, GFXBuffer* buffer);
  void bindTexture(uint binding, GFXTexture* texView);
  void bindSampler(uint binding, GFXSampler* sampler);
  
  CC_INLINE GFXDevice* getDevice() const { return _device; }
  CC_INLINE const GFXBindingUnitList& getBindingUnits() const { return _bindingUnits; }
  
 protected:
  GFXDevice* _device = nullptr;
  GFXBindingUnitList _bindingUnits;
  bool _isDirty = false;
};

NS_CC_END

#endif // CC_CORE_GFX_BINDING_LAYOUT_H_
