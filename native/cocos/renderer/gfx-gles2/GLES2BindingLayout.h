#ifndef CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_
#define CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_

namespace cc {
namespace gfx {

class GLES2GPUBindingLayout;

class CC_GLES2_API GLES2BindingLayout : public BindingLayout {
public:
    GLES2BindingLayout(Device *device);
    ~GLES2BindingLayout();

public:
    virtual bool initialize(const BindingLayoutInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;

    CC_INLINE GLES2GPUBindingLayout *gpuBindingLayout() const { return _gpuBindingLayout; }

private:
    GLES2GPUBindingLayout *_gpuBindingLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
