#ifndef CC_GFXGLES3_GLES3_SAMPLER_H_
#define CC_GFXGLES3_GLES3_SAMPLER_H_

namespace cc {

class GLES3GPUSampler;

class CC_GLES3_API GLES3Sampler : public GFXSampler {
public:
    GLES3Sampler(GFXDevice *device);
    ~GLES3Sampler();

public:
    virtual bool initialize(const GFXSamplerInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUSampler *gpuSampler() const { return _gpuSampler; }

private:
    GLES3GPUSampler *_gpuSampler = nullptr;
};

}

#endif
