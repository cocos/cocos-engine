#ifndef CC_CORE_GFX_SAMPLER_H_
#define CC_CORE_GFX_SAMPLER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXSampler : public Object {
 public:
  GFXSampler(GFXDevice* device);
  virtual ~GFXSampler();
  
 public:
  virtual bool initialize(const GFXSamplerInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return _device; }
  CC_INLINE const String& name() const { return _name; }
  CC_INLINE GFXFilter minFilter() const { return _minFilter; }
  CC_INLINE GFXFilter magFilter() const { return _magFilter; }
  CC_INLINE GFXFilter mipFilter() const { return _mipFilter; }
  CC_INLINE GFXAddress addressU() const { return _addressU; }
  CC_INLINE GFXAddress addressV() const { return _addressV; }
  CC_INLINE GFXAddress addressW() const { return _addressW; }
  CC_INLINE uint maxAnisotropy() const { return _maxAnisotropy; }
  CC_INLINE GFXComparisonFunc cmpFunc() const { return _cmpFunc; }
  CC_INLINE const GFXColor& borderColor() const { return _borderColor; }
  CC_INLINE uint minLOD() const { return _minLOD; }
  CC_INLINE uint maxLOD() const { return _maxLOD; }
  CC_INLINE float mipLODBias() const { return _mipLODBias; }
  
 protected:
  GFXDevice* _device = nullptr;
  String _name;
  GFXFilter _minFilter = GFXFilter::NONE;
  GFXFilter _magFilter = GFXFilter::NONE;
  GFXFilter _mipFilter = GFXFilter::NONE;
  GFXAddress _addressU = GFXAddress::WRAP;
  GFXAddress _addressV = GFXAddress::WRAP;
  GFXAddress _addressW = GFXAddress::WRAP;
  uint _maxAnisotropy = 0;
  GFXComparisonFunc _cmpFunc = GFXComparisonFunc::ALWAYS;
  GFXColor _borderColor;
  uint _minLOD = 0;
  uint _maxLOD = 0;
  float _mipLODBias = 0.0f;
};

NS_CC_END

#endif // CC_CORE_GFX_SAMPLER_H_
