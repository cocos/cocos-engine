#ifndef CC_GFXGLES3_DESCRIPTOR_SET_LAYOUT_H_
#define CC_GFXGLES3_DESCRIPTOR_SET_LAYOUT_H_

namespace cc {
namespace gfx {

class GLES3GPUDescriptorSetLayout;

class CC_GLES3_API GLES3DescriptorSetLayout final : public DescriptorSetLayout {
public:
    GLES3DescriptorSetLayout(Device *device);
    ~GLES3DescriptorSetLayout();

public:
    virtual bool initialize(const DescriptorSetLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUDescriptorSetLayout *gpuDescriptorSetLayout() const { return _gpuDescriptorSetLayout; }

private:
    GLES3GPUDescriptorSetLayout *_gpuDescriptorSetLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXGLES3_DESCRIPTOR_SET_LAYOUT_H_
