#pragma once

#include "gfx-base/states/GFXSampler.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESSampler final : public Sampler {
public:
    explicit GLESSampler(const SamplerInfo& info);
    ~GLESSampler() override = default;

    GLESGPUSampler *gpuSampler() const { return _gpuSampler.get(); }
private:
    IntrusivePtr<GLESGPUSampler> _gpuSampler;
};

} // namespace cc::gfx
