#ifndef CC_GFXGLES3_GLES3_TEXTURE_VIEW_H_
#define CC_GFXGLES3_GLES3_TEXTURE_VIEW_H_

NS_CC_BEGIN

class GLES3GPUTextureView;

class CC_GLES3_API GLES3TextureView : public GFXTextureView {
public:
    GLES3TextureView(GFXDevice *device);
    ~GLES3TextureView();

public:
    virtual bool initialize(const GFXTextureViewInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUTextureView *gpuTexView() const { return _gpuTexView; }

private:
    GLES3GPUTextureView *_gpuTexView = nullptr;
};

NS_CC_END

#endif
