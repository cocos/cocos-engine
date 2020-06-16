#ifndef CC_GFXGLES3_GLES3_PIPELINE_LAYOUT_H_
#define CC_GFXGLES3_GLES3_PIPELINE_LAYOUT_H_

namespace cc {

class GLES3GPUPipelineLayout;

class CC_GLES3_API GLES3PipelineLayout : public GFXPipelineLayout {
public:
    GLES3PipelineLayout(GFXDevice *device);
    ~GLES3PipelineLayout();

public:
    virtual bool initialize(const GFXPipelineLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUPipelineLayout *gpuPipelineLayout() const { return _gpuPipelineLayout; }

private:
    GLES3GPUPipelineLayout *_gpuPipelineLayout = nullptr;
};

}

#endif
