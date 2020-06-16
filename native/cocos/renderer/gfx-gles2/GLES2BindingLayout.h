#ifndef CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_
#define CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_

namespace cc {

class GLES2GPUBindingLayout;

class CC_GLES2_API GLES2BindingLayout : public GFXBindingLayout {
public:
    GLES2BindingLayout(GFXDevice *device);
    ~GLES2BindingLayout();

public:
    virtual bool initialize(const GFXBindingLayoutInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;

    CC_INLINE GLES2GPUBindingLayout *gpuBindingLayout() const { return _gpuBindingLayout; }

private:
    GLES2GPUBindingLayout *_gpuBindingLayout = nullptr;
};

}

#endif
