#include "MTLStd.h"
#include "MTLSampler.h"
#include "MTLUtils.h"
#include "MTLDevice.h"

#import <Metal/MTLDevice.h>

NS_CC_BEGIN

CCMTLSampler::CCMTLSampler(GFXDevice* device) : GFXSampler(device) {}
CCMTLSampler::~CCMTLSampler() { destroy(); }

bool CCMTLSampler::initialize(const GFXSamplerInfo& info)
{
    _name = info.name;
    _minFilter = info.min_filter;
    _magFilter = info.mag_filter;
    _mipFilter = info.mip_filter;
    _addressU = info.address_u;
    _addressV = info.address_v;
    _addressW = info.address_w;
    _maxAnisotropy = info.max_anisotropy;
    _cmpFunc = info.cmp_func;
    _borderColor = info.border_color;
    _minLod = info.min_lod;
    _maxLod = info.max_lod;
    _mipLodBias = info.mip_lod_bias;
    
    MTLSamplerDescriptor* descriptor = [[MTLSamplerDescriptor alloc] init];
    descriptor.borderColor = mu::toMTLSamplerBorderColor(_borderColor);
    descriptor.sAddressMode = mu::toMTLSamplerAddressMode(_addressU);
    descriptor.tAddressMode = mu::toMTLSamplerAddressMode(_addressV);
    descriptor.rAddressMode = mu::toMTLSamplerAddressMode(_addressW);
    descriptor.minFilter = mu::toMTLSamplerMinMagFilter(_minFilter);
    descriptor.magFilter = mu::toMTLSamplerMinMagFilter(_magFilter);
    descriptor.mipFilter = mu::toMTLSamplerMipFilter(_mipFilter);
    descriptor.maxAnisotropy = _maxAnisotropy;
    descriptor.compareFunction = mu::toMTLCompareFunction(_cmpFunc);
    descriptor.lodMinClamp = _minLod;
    descriptor.lodMaxClamp = _maxLod;
    
    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice*>(_device)->getMTLDevice() );
    _mtlSamplerState = [mtlDevice newSamplerStateWithDescriptor:descriptor];
    
    [descriptor release];
    
    return _mtlSamplerState != nil;
}

void CCMTLSampler::destroy()
{
    if (_mtlSamplerState)
    {
        [_mtlSamplerState release];
        _mtlSamplerState = nil;
    }
}

NS_CC_END
