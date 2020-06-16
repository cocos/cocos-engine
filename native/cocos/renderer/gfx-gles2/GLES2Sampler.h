#ifndef CC_GFXGLES2_GLES2_SAMPLER_H_
#define CC_GFXGLES2_GLES2_SAMPLER_H_

namespace cc {
namespace gfx {

class GLES2GPUSampler;

class CC_GLES2_API GLES2Sampler : public GFXSampler {
public:
    GLES2Sampler(GFXDevice *device);
    ~GLES2Sampler();

public:
    virtual bool initialize(const GFXSamplerInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUSampler *gpuSampler() const { return _gpuSampler; }

private:
    GLES2GPUSampler *_gpuSampler = nullptr;
    String _name;
    GFXFilter _minFilter = GFXFilter::LINEAR;
    GFXFilter _magFilter = GFXFilter::LINEAR;
    GFXFilter _mipFilter = GFXFilter::NONE;
    GFXAddress _addressU = GFXAddress::WRAP;
    GFXAddress _addressV = GFXAddress::WRAP;
    GFXAddress _addressW = GFXAddress::WRAP;
    uint _maxAnisotropy = 16;
    GFXComparisonFunc _cmpFunc = GFXComparisonFunc::NEVER;
    GFXColor _borderColor;
    uint _minLOD = 0;
    uint _maxLOD = 1000;
    float _mipLODBias = 0.0f;
};

} // namespace gfx
} // namespace cc

#endif
