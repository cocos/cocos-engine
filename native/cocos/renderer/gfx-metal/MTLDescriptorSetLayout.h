#pragma once
namespace cc {
namespace gfx {
class CCMTLGPUDescriptorSetLayout;
class CCMTLDescriptorSetLayout : public DescriptorSetLayout {
public:
    CCMTLDescriptorSetLayout(Device *device);
    virtual ~CCMTLDescriptorSetLayout() = default;

    virtual bool initialize(const DescriptorSetLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE CCMTLGPUDescriptorSetLayout *gpuDescriptorSetLayout() const { return _gpuDescriptorSetLayout; }

private:
    CCMTLGPUDescriptorSetLayout *_gpuDescriptorSetLayout = nullptr;
};

} // namespace gfx
} // namespace cc
