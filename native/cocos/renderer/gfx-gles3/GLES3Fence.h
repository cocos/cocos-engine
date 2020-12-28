#ifndef CC_GFXGLES3_FENCE_H_
#define CC_GFXGLES3_FENCE_H_

namespace cc {
namespace gfx {

class GLES3GPUFence;

class CC_GLES3_API GLES3Fence final : public Fence {
public:
    GLES3Fence(Device *device);
    ~GLES3Fence();

public:
    virtual bool initialize(const FenceInfo &info) override;
    virtual void destroy() override;
    virtual void wait() override;
    virtual void reset() override;

private:
    GLES3GPUFence *_gpuFence = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
