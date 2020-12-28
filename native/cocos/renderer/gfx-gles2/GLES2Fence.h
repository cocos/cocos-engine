#ifndef CC_GFXGLES2_FENCE_H_
#define CC_GFXGLES2_FENCE_H_

namespace cc {
namespace gfx {

class GLES2GPUFence;

class CC_GLES2_API GLES2Fence final : public Fence {
public:
    GLES2Fence(Device *device);
    ~GLES2Fence();

public:
    virtual bool initialize(const FenceInfo &info) override;
    virtual void destroy() override;
    virtual void wait() override;
    virtual void reset() override;

private:
    GLES2GPUFence *_gpuFence = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
