#ifndef CC_GFXVULKAN_CCVK_TEXTURE_H_
#define CC_GFXVULKAN_CCVK_TEXTURE_H_

NS_CC_BEGIN

class CCVKGPUTexture;

class CC_VULKAN_API CCVKTexture : public GFXTexture {
 public:
  CCVKTexture(GFXDevice* device);
  ~CCVKTexture();
  
 public:
  bool initialize(const GFXTextureInfo& info);
  void destroy();
  void resize(uint width, uint height);
  
  CC_INLINE CCVKGPUTexture* gpuTexture() const { return _gpuTexture; }

 private:
  CCVKGPUTexture* _gpuTexture = nullptr;
};

NS_CC_END

#endif
