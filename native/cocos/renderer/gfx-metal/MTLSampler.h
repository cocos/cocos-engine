#pragma once

#import <Metal/MTLSampler.h>

namespace cc {
namespace gfx {

class CCMTLSampler : public GFXSampler {
public:
    CCMTLSampler(GFXDevice *device);
    ~CCMTLSampler();

    bool initialize(const GFXSamplerInfo &info) override;
    void destroy() override;

    CC_INLINE id<MTLSamplerState> getMTLSamplerState() const { return _mtlSamplerState; }

private:
    id<MTLSamplerState> _mtlSamplerState = nil;
};

} // namespace gfx
} // namespace cc
