#ifndef CC_GFXVULKAN_PIPELINE_LAYOUT_H_
#define CC_GFXVULKAN_PIPELINE_LAYOUT_H_

namespace cc {
namespace gfx {

class CCVKGPUPipelineLayout;

class CC_VULKAN_API CCVKPipelineLayout final : public PipelineLayout {
public:
    CCVKPipelineLayout(Device *device);
    ~CCVKPipelineLayout();

public:
    virtual bool initialize(const PipelineLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE CCVKGPUPipelineLayout *gpuPipelineLayout() const { return _gpuPipelineLayout; }

private:
    CCVKGPUPipelineLayout *_gpuPipelineLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_PIPELINE_LAYOUT_H_
