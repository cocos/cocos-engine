#ifndef CC_GFXVULKAN_BINDING_LAYOUT_H_
#define CC_GFXVULKAN_BINDING_LAYOUT_H_

namespace cc {
namespace gfx {

class CCVKGPUDescriptorSet;

class CC_VULKAN_API CCVKDescriptorSet final : public DescriptorSet {
public:
    CCVKDescriptorSet(Device *device);
    ~CCVKDescriptorSet();

public:
    virtual bool initialize(const DescriptorSetInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;

    CC_INLINE CCVKGPUDescriptorSet *gpuDescriptorSet() const { return _gpuDescriptorSet; }

private:
    CCVKGPUDescriptorSet *_gpuDescriptorSet = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
