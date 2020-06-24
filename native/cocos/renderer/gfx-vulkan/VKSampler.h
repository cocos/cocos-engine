#ifndef CC_GFXVULKAN_CCVK_SAMPLER_H_
#define CC_GFXVULKAN_CCVK_SAMPLER_H_

namespace cc {
namespace gfx {

class CCVKGPUSampler;

class CC_VULKAN_API CCVKSampler : public Sampler {
public:
    CCVKSampler(Device *device);
    ~CCVKSampler();

public:
    bool initialize(const SamplerInfo &info);
    void destroy();

    CC_INLINE CCVKGPUSampler *gpuSampler() const { return _gpuSampler; }

private:
    CCVKGPUSampler *_gpuSampler = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
