#ifndef CC_GFXVULKAN_FENCE_H_
#define CC_GFXVULKAN_FENCE_H_

namespace cc {
namespace gfx {

class CCVKGPUFence;

class CC_VULKAN_API CCVKFence final : public Fence {
public:
    CCVKFence(Device *device);
    virtual ~CCVKFence() override;

public:
    virtual bool initialize(const FenceInfo &info) override;
    virtual void destroy() override;
    virtual void wait() override;
    virtual void reset() override;

    CC_INLINE CCVKGPUFence *gpuFence() { return _gpuFence; }

private:
    CCVKGPUFence *_gpuFence = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
