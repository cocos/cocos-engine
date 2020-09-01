#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLSampler.h"
#include "MTLUtils.h"

#import <Metal/MTLDevice.h>

namespace cc {
namespace gfx {

CCMTLSampler::CCMTLSampler(Device *device) : Sampler(device) {}
CCMTLSampler::~CCMTLSampler() { destroy(); }

bool CCMTLSampler::initialize(const SamplerInfo &info) {
    _name = info.name;
    _minFilter = info.minFilter;
    _magFilter = info.magFilter;
    _mipFilter = info.mipFilter;
    _addressU = info.addressU;
    _addressV = info.addressV;
    _addressW = info.addressW;
    _maxAnisotropy = info.maxAnisotropy;
    _cmpFunc = info.cmpFunc;
    _borderColor = info.borderColor;
    _minLOD = info.minLOD;
    _maxLOD = info.maxLOD;
    _mipLODBias = info.mipLODBias;

    MTLSamplerDescriptor *descriptor = [[MTLSamplerDescriptor alloc] init];
    descriptor.borderColor = mu::toMTLSamplerBorderColor(_borderColor);
    descriptor.sAddressMode = mu::toMTLSamplerAddressMode(_addressU);
    descriptor.tAddressMode = mu::toMTLSamplerAddressMode(_addressV);
    descriptor.rAddressMode = mu::toMTLSamplerAddressMode(_addressW);
    descriptor.minFilter = mu::toMTLSamplerMinMagFilter(_minFilter);
    descriptor.magFilter = mu::toMTLSamplerMinMagFilter(_magFilter);
    descriptor.mipFilter = mu::toMTLSamplerMipFilter(_mipFilter);
    descriptor.maxAnisotropy = _maxAnisotropy == 0 ? 1 : _maxAnisotropy;
    descriptor.compareFunction = mu::toMTLCompareFunction(_cmpFunc);
    descriptor.lodMinClamp = _minLOD;
    descriptor.lodMaxClamp = _maxLOD;

    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice *>(_device)->getMTLDevice());
    _mtlSamplerState = [mtlDevice newSamplerStateWithDescriptor:descriptor];

    [descriptor release];

    return _mtlSamplerState != nil;
}

void CCMTLSampler::destroy() {
    if (_mtlSamplerState) {
        [_mtlSamplerState release];
        _mtlSamplerState = nil;
    }
}

} // namespace gfx
} // namespace cc
