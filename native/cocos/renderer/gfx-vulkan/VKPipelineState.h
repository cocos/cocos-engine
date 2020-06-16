#ifndef CC_GFXVULKAN_CCVK_PIPELINE_STATE_H_
#define CC_GFXVULKAN_CCVK_PIPELINE_STATE_H_

namespace cc {

class CCVKGPUPipelineState;

class CC_VULKAN_API CCVKPipelineState : public GFXPipelineState {
public:
    CCVKPipelineState(GFXDevice *device);
    ~CCVKPipelineState();

public:
    bool initialize(const GFXPipelineStateInfo &info);
    void destroy();

    CC_INLINE CCVKGPUPipelineState *gpuPipelineState() const { return _gpuPipelineState; }

private:
    CCVKGPUPipelineState *_gpuPipelineState = nullptr;
};

}

#endif
