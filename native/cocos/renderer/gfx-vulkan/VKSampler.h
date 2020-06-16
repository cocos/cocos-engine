#ifndef CC_GFXVULKAN_CCVK_SAMPLER_H_
#define CC_GFXVULKAN_CCVK_SAMPLER_H_

namespace cc {

class CCVKGPUSampler;

class CC_VULKAN_API CCVKSampler : public GFXSampler {
public:
    CCVKSampler(GFXDevice *device);
    ~CCVKSampler();

public:
    bool initialize(const GFXSamplerInfo &info);
    void destroy();

    CC_INLINE CCVKGPUSampler *gpuSampler() const { return _gpuSampler; }

private:
    CCVKGPUSampler *_gpuSampler = nullptr;
};

}

#endif
