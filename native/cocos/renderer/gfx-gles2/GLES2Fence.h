#ifndef CC_GFXGLES2_GLES2_FENCE_H_
#define CC_GFXGLES2_GLES2_FENCE_H_

NS_CC_BEGIN

class GLES2GPUFence;

class CC_GLES2_API GLES2Fence : public GFXFence {
public:
    GLES2Fence(GFXDevice* device);
    ~GLES2Fence();

public:
    virtual bool initialize(const GFXFenceInfo& info) override;
    virtual void destroy() override;
    virtual void wait() override;
    virtual void reset() override;

private:
    GLES2GPUFence* _gpuFence = nullptr;
};

NS_CC_END

#endif
