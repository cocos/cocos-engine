#pragma once

#import <Metal/MTLSampler.h>

NS_CC_BEGIN

class CCMTLSampler : public GFXSampler
{
public:
    CCMTLSampler(GFXDevice* device);
    ~CCMTLSampler();
    
    bool Initialize(const GFXSamplerInfo& info) override;
    void destroy() override;
    
    CC_INLINE id<MTLSamplerState> getMTLSamplerState() const { return _mtlSamplerState; }
    
private:
    id<MTLSamplerState> _mtlSamplerState = nil;
};

NS_CC_END
