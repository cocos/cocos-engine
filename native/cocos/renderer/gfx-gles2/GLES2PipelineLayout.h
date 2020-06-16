#ifndef CC_GFXGLES2_GLES2_PIPELINE_LAYOUT_H_
#define CC_GFXGLES2_GLES2_PIPELINE_LAYOUT_H_

namespace cc {

class GLES2GPUPipelineLayout;

class CC_GLES2_API GLES2PipelineLayout : public GFXPipelineLayout {
public:
    GLES2PipelineLayout(GFXDevice *device);
    ~GLES2PipelineLayout();

public:
    virtual bool initialize(const GFXPipelineLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUPipelineLayout *gpuPipelineLayout() const { return _gpuPipelineLayout; }

private:
    GLES2GPUPipelineLayout *_gpuPipelineLayout = nullptr;
};

}

#endif
