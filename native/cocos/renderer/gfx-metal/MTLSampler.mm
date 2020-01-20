#include "MTLStd.h"
#include "MTLSampler.h"
#include "MTLUtils.h"
#include "MTLDevice.h"

#import <Metal/MTLDevice.h>

NS_CC_BEGIN

CCMTLSampler::CCMTLSampler(GFXDevice* device) : GFXSampler(device) {}
CCMTLSampler::~CCMTLSampler() { destroy(); }

bool CCMTLSampler::Initialize(const GFXSamplerInfo& info)
{
    name_ = info.name;
    min_filter_ = info.min_filter;
    mag_filter_ = info.mag_filter;
    mip_filter_ = info.mip_filter;
    address_u_ = info.address_u;
    address_v_ = info.address_v;
    address_w_ = info.address_w;
    max_anisotropy_ = info.max_anisotropy;
    cmp_func_ = info.cmp_func;
    border_color_ = info.border_color;
    min_lod_ = info.min_lod;
    max_lod_ = info.max_lod;
    mip_lod_bias_ = info.mip_lod_bias;
    
    MTLSamplerDescriptor* descriptor = [[MTLSamplerDescriptor alloc] init];
    descriptor.borderColor = mu::toMTLSamplerBorderColor(border_color_);
    descriptor.sAddressMode = mu::toMTLSamplerAddressMode(address_u_);
    descriptor.tAddressMode = mu::toMTLSamplerAddressMode(address_v_);
    descriptor.rAddressMode = mu::toMTLSamplerAddressMode(address_w_);
    descriptor.minFilter = mu::toMTLSamplerMinMagFilter(min_filter_);
    descriptor.magFilter = mu::toMTLSamplerMinMagFilter(mag_filter_);
    descriptor.mipFilter = mu::toMTLSamplerMipFilter(mip_filter_);
    descriptor.maxAnisotropy = max_anisotropy_;
    descriptor.compareFunction = mu::toMTLCompareFunction(cmp_func_);
    descriptor.lodMinClamp = min_lod_;
    descriptor.lodMaxClamp = max_lod_;
    
    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice*>(device_)->getMTLDevice() );
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
