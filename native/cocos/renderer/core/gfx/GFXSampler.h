#ifndef CC_CORE_GFX_SAMPLER_H_
#define CC_CORE_GFX_SAMPLER_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL Sampler : public GFXObject {
public:
    Sampler(Device *device);
    virtual ~Sampler();

public:
    virtual bool initialize(const SamplerInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE Filter getMinFilter() const { return _minFilter; }
    CC_INLINE Filter getMagFilter() const { return _magFilter; }
    CC_INLINE Filter getMipFilter() const { return _mipFilter; }
    CC_INLINE Address getAddressU() const { return _addressU; }
    CC_INLINE Address getAddressV() const { return _addressV; }
    CC_INLINE Address getAddressW() const { return _addressW; }
    CC_INLINE uint getMaxAnisotropy() const { return _maxAnisotropy; }
    CC_INLINE ComparisonFunc getCmpFunc() const { return _cmpFunc; }
    CC_INLINE const Color &getBorderColor() const { return _borderColor; }
    CC_INLINE uint getMinLOD() const { return _minLOD; }
    CC_INLINE uint getMaxLOD() const { return _maxLOD; }
    CC_INLINE float getMipLODBias() const { return _mipLODBias; }

protected:
    Device *_device = nullptr;
    Filter _minFilter = Filter::NONE;
    Filter _magFilter = Filter::NONE;
    Filter _mipFilter = Filter::NONE;
    Address _addressU = Address::WRAP;
    Address _addressV = Address::WRAP;
    Address _addressW = Address::WRAP;
    uint _maxAnisotropy = 0;
    ComparisonFunc _cmpFunc = ComparisonFunc::ALWAYS;
    Color _borderColor;
    uint _minLOD = 0;
    uint _maxLOD = 0;
    float _mipLODBias = 0.0f;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_SAMPLER_H_
