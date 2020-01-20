#ifndef CC_GFXGLES2_GLES2_FRAMEBUFFER_H_
#define CC_GFXGLES2_GLES2_FRAMEBUFFER_H_

NS_CC_BEGIN

class GLES2GPUFramebuffer;

class CC_GLES2_API GLES2Framebuffer : public GFXFramebuffer {
 public:
  GLES2Framebuffer(GFXDevice* device);
  ~GLES2Framebuffer();
  
 public:
  bool Initialize(const GFXFramebufferInfo& info);
  void destroy();
  
  CC_INLINE GLES2GPUFramebuffer* gpu_fbo() const { return gpu_fbo_; }
  
 private:
  GLES2GPUFramebuffer* gpu_fbo_;
};

NS_CC_END

#endif
