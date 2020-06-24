#ifndef CC_GFXGLES3_GLES3_BINDING_LAYOUT_H_
#define CC_GFXGLES3_GLES3_BINDING_LAYOUT_H_

namespace cc {
namespace gfx {

class GLES3GPUBindingLayout;

class CC_GLES3_API GLES3BindingLayout : public BindingLayout {
public:
    GLES3BindingLayout(Device *device);
    ~GLES3BindingLayout();

public:
    virtual bool initialize(const BindingLayoutInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;

    CC_INLINE GLES3GPUBindingLayout *gpuBindingLayout() const { return _gpuBindingLayout; }

private:
    GLES3GPUBindingLayout *_gpuBindingLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
