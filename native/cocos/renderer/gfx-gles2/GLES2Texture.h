#ifndef CC_GFXGLES2_GLES2_TEXTURE_H_
#define CC_GFXGLES2_GLES2_TEXTURE_H_

CC_NAMESPACE_BEGIN

class GLES2GPUTexture;

class CC_GLES2_API GLES2Texture : public GFXTexture {
 public:
  GLES2Texture(GFXDevice* device);
  ~GLES2Texture();
  
 public:
  bool Initialize(const GFXTextureInfo& info);
  void Destroy();
  void Resize(uint width, uint height);
  
  CC_INLINE GLES2GPUTexture* gpu_texture() const { return gpu_texture_; }

 private:
  GLES2GPUTexture* gpu_texture_;
};

CC_NAMESPACE_END

#endif
