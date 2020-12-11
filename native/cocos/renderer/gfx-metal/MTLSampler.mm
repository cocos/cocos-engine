#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLSampler.h"
#include "MTLUtils.h"

#import <Metal/MTLDevice.h>

namespace cc {
namespace gfx {

CCMTLSampler::CCMTLSampler(Device *device) : Sampler(device) {}

bool CCMTLSampler::initialize(const SamplerInfo &info) {
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
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    descriptor.borderColor = (MTLSamplerBorderColor)mu::toMTLSamplerBorderColor(_borderColor);
#endif
    descriptor.sAddressMode = mu::toMTLSamplerAddressMode(_addressU);
    descriptor.tAddressMode = mu::toMTLSamplerAddressMode(_addressV);
    descriptor.rAddressMode = mu::toMTLSamplerAddressMode(_addressW);
    descriptor.minFilter = mu::toMTLSamplerMinMagFilter(_minFilter);
    descriptor.magFilter = mu::toMTLSamplerMinMagFilter(_magFilter);
    descriptor.mipFilter = mu::toMTLSamplerMipFilter(_mipFilter);
    descriptor.maxAnisotropy = _maxAnisotropy == 0 ? 1 : _maxAnisotropy;
    descriptor.lodMinClamp = _minLOD;
    descriptor.lodMaxClamp = _maxLOD;
    if(static_cast<CCMTLDevice*>(_device)->isSamplerDescriptorCompareFunctionSupported()) {
        descriptor.compareFunction = mu::toMTLCompareFunction(_cmpFunc);
    }

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
