#ifndef CC_GFXGLES3_GLES3_TEXTURE_VIEW_H_
#define CC_GFXGLES3_GLES3_TEXTURE_VIEW_H_

NS_CC_BEGIN

class GLES3GPUTextureView;

class CC_GLES3_API GLES3TextureView : public GFXTextureView {
public:
  GLES3TextureView(GFXDevice* device);
  ~GLES3TextureView();
  
public:
  bool initialize(const GFXTextureViewInfo& info);
  void destroy();
  
  CC_INLINE GLES3GPUTextureView* gpu_tex_view() const { return gpu_tex_view_; }
  
private:
  GLES3GPUTextureView* gpu_tex_view_;
};

NS_CC_END

#endif
