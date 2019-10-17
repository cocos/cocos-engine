#ifndef CC_GFXGLES3_GLES3_TEXTURE_H_
#define CC_GFXGLES3_GLES3_TEXTURE_H_

CC_NAMESPACE_BEGIN

class GLES3GPUTexture;

class CC_GLES3_API GLES3Texture : public GFXTexture {
 public:
  GLES3Texture(GFXDevice* device);
  ~GLES3Texture();
  
 public:
  bool Initialize(const GFXTextureInfo& info);
  void Destroy();
  void Resize(uint width, uint height);
  
  CC_INLINE GLES3GPUTexture* gpu_texture() const { return gpu_texture_; }

 private:
  GLES3GPUTexture* gpu_texture_;
};

CC_NAMESPACE_END

#endif
