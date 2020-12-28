#ifndef CC_GFXGLES2_PIPELINE_STATE_H_
#define CC_GFXGLES2_PIPELINE_STATE_H_

namespace cc {
namespace gfx {

class GLES2GPUPipelineState;

class CC_GLES2_API GLES2PipelineState final : public PipelineState {
public:
    GLES2PipelineState(Device *device);
    ~GLES2PipelineState();

public:
    virtual bool initialize(const PipelineStateInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUPipelineState *gpuPipelineState() const { return _gpuPipelineState; }

private:
    GLES2GPUPipelineState *_gpuPipelineState = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
