#ifndef CC_GFXVULKAN_CCVK_PIPELINE_LAYOUT_H_
#define CC_GFXVULKAN_CCVK_PIPELINE_LAYOUT_H_

namespace cc {

class CCVKGPUPipelineLayout;

class CC_VULKAN_API CCVKPipelineLayout : public GFXPipelineLayout {
public:
    CCVKPipelineLayout(GFXDevice *device);
    ~CCVKPipelineLayout();

public:
    bool initialize(const GFXPipelineLayoutInfo &info);
    void destroy();

    CC_INLINE CCVKGPUPipelineLayout *gpuPipelineLayout() const { return _gpuPipelineLayout; }

private:
    CCVKGPUPipelineLayout *_gpuPipelineLayout = nullptr;
};

}

#endif
