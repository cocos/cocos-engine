#ifndef CC_GFXGLES3_GLES3_FRAMEBUFFER_H_
#define CC_GFXGLES3_GLES3_FRAMEBUFFER_H_

NS_CC_BEGIN

class GLES3GPUFramebuffer;

class CC_GLES3_API GLES3Framebuffer : public GFXFramebuffer {
 public:
  GLES3Framebuffer(GFXDevice* device);
  ~GLES3Framebuffer();
  
 public:
  bool initialize(const GFXFramebufferInfo& info);
  void destroy();
  
  CC_INLINE GLES3GPUFramebuffer* gpuFBO() const { return _gpuFBO; }
  
 private:
  GLES3GPUFramebuffer* _gpuFBO = nullptr;
};

NS_CC_END

#endif
