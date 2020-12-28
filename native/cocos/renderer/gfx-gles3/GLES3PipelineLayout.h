#ifndef CC_GFXGLES3_PIPELINE_LAYOUT_H_
#define CC_GFXGLES3_PIPELINE_LAYOUT_H_

namespace cc {
namespace gfx {

class GLES3GPUPipelineLayout;

class CC_GLES3_API GLES3PipelineLayout final : public PipelineLayout {
public:
    GLES3PipelineLayout(Device *device);
    ~GLES3PipelineLayout();

public:
    virtual bool initialize(const PipelineLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUPipelineLayout *gpuPipelineLayout() const { return _gpuPipelineLayout; }

private:
    GLES3GPUPipelineLayout *_gpuPipelineLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXGLES3_PIPELINE_LAYOUT_H_
