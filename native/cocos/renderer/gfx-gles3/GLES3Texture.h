#ifndef CC_GFXGLES3_GLES3_TEXTURE_H_
#define CC_GFXGLES3_GLES3_TEXTURE_H_

namespace cc {

class GLES3GPUTexture;

class CC_GLES3_API GLES3Texture : public GFXTexture {
public:
    GLES3Texture(GFXDevice *device);
    ~GLES3Texture();

public:
    virtual bool initialize(const GFXTextureInfo &info) override;
    virtual bool initialize(const GFXTextureViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;

    CC_INLINE GLES3GPUTexture *gpuTexture() const { return _gpuTexture; }

private:
    GLES3GPUTexture *_gpuTexture = nullptr;
};

}

#endif
