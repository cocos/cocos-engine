#ifndef CC_GFXGLES3_GLES3_PIPELINE_STATE_H_
#define CC_GFXGLES3_GLES3_PIPELINE_STATE_H_

namespace cc {
namespace gfx {

class GLES3GPUPipelineState;

class CC_GLES3_API GLES3PipelineState : public GFXPipelineState {
public:
    GLES3PipelineState(GFXDevice *device);
    ~GLES3PipelineState();

public:
    virtual bool initialize(const GFXPipelineStateInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUPipelineState *gpuPipelineState() const { return _gpuPipelineState; }

private:
    GLES3GPUPipelineState *_gpuPipelineState = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
