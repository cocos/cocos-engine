#ifndef CC_GFXVULKAN_CCVK_TEXTURE_VIEW_H_
#define CC_GFXVULKAN_CCVK_TEXTURE_VIEW_H_

NS_CC_BEGIN

class CCVKGPUTextureView;

class CC_VULKAN_API CCVKTextureView : public GFXTextureView {
public:
  CCVKTextureView(GFXDevice* device);
  ~CCVKTextureView();
  
public:
  bool initialize(const GFXTextureViewInfo& info);
  void destroy();
  
  CC_INLINE CCVKGPUTextureView* gpuTexView() const { return _gpuTexView; }
  
private:
  CCVKGPUTextureView* _gpuTexView = nullptr;
};

NS_CC_END

#endif
