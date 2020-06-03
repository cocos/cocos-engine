#ifndef CC_GFXGLES2_GLES2_TEXTURE_VIEW_H_
#define CC_GFXGLES2_GLES2_TEXTURE_VIEW_H_

NS_CC_BEGIN

class GLES2GPUTextureView;

class CC_GLES2_API GLES2TextureView : public GFXTextureView {
public:
    GLES2TextureView(GFXDevice *device);
    ~GLES2TextureView();

public:
    virtual bool initialize(const GFXTextureViewInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUTextureView *gpuTexView() const { return _gpuTexView; }

private:
    GLES2GPUTextureView *_gpuTexView = nullptr;
};

NS_CC_END

#endif
