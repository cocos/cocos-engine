#ifndef CC_GFXGLES3_SAMPLER_H_
#define CC_GFXGLES3_SAMPLER_H_

namespace cc {
namespace gfx {

class GLES3GPUSampler;

class CC_GLES3_API GLES3Sampler final : public Sampler {
public:
    GLES3Sampler(Device *device);
    ~GLES3Sampler();

public:
    virtual bool initialize(const SamplerInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUSampler *gpuSampler() const { return _gpuSampler; }

private:
    GLES3GPUSampler *_gpuSampler = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
