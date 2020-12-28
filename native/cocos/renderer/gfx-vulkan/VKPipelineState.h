#ifndef CC_GFXVULKAN_PIPELINE_STATE_H_
#define CC_GFXVULKAN_PIPELINE_STATE_H_

namespace cc {
namespace gfx {

class CCVKGPUPipelineState;

class CC_VULKAN_API CCVKPipelineState final : public PipelineState {
public:
    CCVKPipelineState(Device *device);
    ~CCVKPipelineState();

public:
    bool initialize(const PipelineStateInfo &info);
    void destroy();

    CC_INLINE CCVKGPUPipelineState *gpuPipelineState() const { return _gpuPipelineState; }

private:
    CCVKGPUPipelineState *_gpuPipelineState = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
