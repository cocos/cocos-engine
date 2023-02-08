#pragma once

#include "gfx-base/states/GFXSampler.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESCore.h"

namespace cc::gfx::gles {

struct GPUSampler : public GFXDeviceObject<DefaultDeleter> {
    GPUSampler() noexcept = default;
    ~GPUSampler() noexcept override;

    void initSampler();

    GLuint samplerId = 0;

    GLenum minFilter = 0;
    GLenum magFilter = 0;
    GLenum wrapS = 0;
    GLenum wrapT = 0;
    GLenum wrapR = 0;
};

class Sampler : public gfx::Sampler {
public:
    explicit Sampler(const SamplerInfo &info);
    ~Sampler() override = default;

    GPUSampler *getGPUSampler() const { return _gpuSampler; }

private:
    IntrusivePtr<GPUSampler> _gpuSampler;
};

} // namespace cc::gfx::gles
