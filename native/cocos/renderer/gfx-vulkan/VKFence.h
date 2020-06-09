#ifndef CC_GFXVULKAN_CCVK_FENCE_H_
#define CC_GFXVULKAN_CCVK_FENCE_H_

NS_CC_BEGIN

class CCVKGPUFence;

class CC_VULKAN_API CCVKFence : public GFXFence {
public:
    CCVKFence(GFXDevice *device);
    virtual ~CCVKFence() override;

public:
    virtual bool initialize(const GFXFenceInfo &info) override;
    virtual void destroy() override;
    virtual void wait() override;
    virtual void reset() override;

    CC_INLINE CCVKGPUFence *gpuFence() { return _gpuFence; }

private:
    CCVKGPUFence *_gpuFence = nullptr;
};

NS_CC_END

#endif
