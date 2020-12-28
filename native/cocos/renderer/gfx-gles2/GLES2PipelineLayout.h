#ifndef CC_GFXGLES2_PIPELINE_LAYOUT_H_
#define CC_GFXGLES2_PIPELINE_LAYOUT_H_

namespace cc {
namespace gfx {

class GLES2GPUPipelineLayout;

class CC_GLES2_API GLES2PipelineLayout final : public PipelineLayout {
public:
    GLES2PipelineLayout(Device *device);
    ~GLES2PipelineLayout();

public:
    virtual bool initialize(const PipelineLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUPipelineLayout *gpuPipelineLayout() const { return _gpuPipelineLayout; }

private:
    GLES2GPUPipelineLayout *_gpuPipelineLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXGLES2_PIPELINE_LAYOUT_H_
