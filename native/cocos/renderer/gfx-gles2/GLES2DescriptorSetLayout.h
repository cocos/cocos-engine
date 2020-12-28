#ifndef CC_GFXGLES2_DESCRIPTOR_SET_LAYOUT_H_
#define CC_GFXGLES2_DESCRIPTOR_SET_LAYOUT_H_

namespace cc {
namespace gfx {

class GLES2GPUDescriptorSetLayout;

class CC_GLES2_API GLES2DescriptorSetLayout final : public DescriptorSetLayout {
public:
    GLES2DescriptorSetLayout(Device *device);
    ~GLES2DescriptorSetLayout();

public:
    virtual bool initialize(const DescriptorSetLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUDescriptorSetLayout *gpuDescriptorSetLayout() const { return _gpuDescriptorSetLayout; }

private:
    GLES2GPUDescriptorSetLayout *_gpuDescriptorSetLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXGLES2_DESCRIPTOR_SET_LAYOUT_H_
