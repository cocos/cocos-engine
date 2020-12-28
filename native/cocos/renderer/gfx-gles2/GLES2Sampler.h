#ifndef CC_GFXGLES2_SAMPLER_H_
#define CC_GFXGLES2_SAMPLER_H_

namespace cc {
namespace gfx {

class GLES2GPUSampler;

class CC_GLES2_API GLES2Sampler final : public Sampler {
public:
    GLES2Sampler(Device *device);
    ~GLES2Sampler();

public:
    virtual bool initialize(const SamplerInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUSampler *gpuSampler() const { return _gpuSampler; }

private:
    GLES2GPUSampler *_gpuSampler = nullptr;
    String _name;
    Filter _minFilter = Filter::LINEAR;
    Filter _magFilter = Filter::LINEAR;
    Filter _mipFilter = Filter::NONE;
    Address _addressU = Address::WRAP;
    Address _addressV = Address::WRAP;
    Address _addressW = Address::WRAP;
    uint _maxAnisotropy = 16;
    ComparisonFunc _cmpFunc = ComparisonFunc::NEVER;
    Color _borderColor;
    uint _minLOD = 0;
    uint _maxLOD = 1000;
    float _mipLODBias = 0.0f;
};

} // namespace gfx
} // namespace cc

#endif
