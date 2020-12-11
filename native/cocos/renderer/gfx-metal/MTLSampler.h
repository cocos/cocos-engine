#pragma once

#import <Metal/MTLSampler.h>

namespace cc {
namespace gfx {

class CCMTLSampler : public Sampler {
public:
    CCMTLSampler(Device *device);
    ~CCMTLSampler() = default;

    bool initialize(const SamplerInfo &info) override;
    void destroy() override;

    CC_INLINE id<MTLSamplerState> getMTLSamplerState() const { return _mtlSamplerState; }

private:
    id<MTLSamplerState> _mtlSamplerState = nil;
};

} // namespace gfx
} // namespace cc
