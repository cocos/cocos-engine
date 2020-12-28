#ifndef CC_GFXVULKAN_DESCRIPTOR_SET_LAYOUT_H_
#define CC_GFXVULKAN_DESCRIPTOR_SET_LAYOUT_H_

namespace cc {
namespace gfx {

class CCVKGPUDescriptorSetLayout;

class CC_VULKAN_API CCVKDescriptorSetLayout final : public DescriptorSetLayout {
public:
    CCVKDescriptorSetLayout(Device *device);
    ~CCVKDescriptorSetLayout();

public:
    virtual bool initialize(const DescriptorSetLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout() const { return _gpuDescriptorSetLayout; }

private:
    CCVKGPUDescriptorSetLayout *_gpuDescriptorSetLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_DESCRIPTOR_SET_LAYOUT_H_
