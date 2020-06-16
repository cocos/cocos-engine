#ifndef CC_CORE_GFX_SAMPLER_H_
#define CC_CORE_GFX_SAMPLER_H_

#include "GFXDef.h"

namespace cc {

class CC_CORE_API GFXSampler : public GFXObject {
public:
    GFXSampler(GFXDevice *device);
    virtual ~GFXSampler();

public:
    virtual bool initialize(const GFXSamplerInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE GFXDevice *getDevice() const { return _device; }
    CC_INLINE const String &getName() const { return _name; }
    CC_INLINE GFXFilter getMinFilter() const { return _minFilter; }
    CC_INLINE GFXFilter getMagFilter() const { return _magFilter; }
    CC_INLINE GFXFilter getMipFilter() const { return _mipFilter; }
    CC_INLINE GFXAddress getAddressU() const { return _addressU; }
    CC_INLINE GFXAddress getAddressV() const { return _addressV; }
    CC_INLINE GFXAddress getAddressW() const { return _addressW; }
    CC_INLINE uint getMaxAnisotropy() const { return _maxAnisotropy; }
    CC_INLINE GFXComparisonFunc getCmpFunc() const { return _cmpFunc; }
    CC_INLINE const GFXColor &getBorderColor() const { return _borderColor; }
    CC_INLINE uint getMinLOD() const { return _minLOD; }
    CC_INLINE uint getMaxLOD() const { return _maxLOD; }
    CC_INLINE float getMipLODBias() const { return _mipLODBias; }

protected:
    GFXDevice *_device = nullptr;
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

}

#endif // CC_CORE_GFX_SAMPLER_H_
