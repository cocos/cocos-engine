#ifndef CC_GFXGLES3_DESCRIPTOR_SET_H_
#define CC_GFXGLES3_DESCRIPTOR_SET_H_

namespace cc {
namespace gfx {

class GLES3GPUDescriptorSet;

class CC_GLES3_API GLES3DescriptorSet final : public DescriptorSet {
public:
    GLES3DescriptorSet(Device *device);
    ~GLES3DescriptorSet();

public:
    virtual bool initialize(const DescriptorSetInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;

    CC_INLINE GLES3GPUDescriptorSet *gpuDescriptorSet() const { return _gpuDescriptorSet; }

private:
    GLES3GPUDescriptorSet *_gpuDescriptorSet = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXGLES3_DESCRIPTOR_SET_H_
