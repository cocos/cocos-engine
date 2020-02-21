#ifndef CC_GFXGLES3_GLES3_RENDER_PASS_H_
#define CC_GFXGLES3_GLES3_RENDER_PASS_H_

NS_CC_BEGIN

class GLES3GPURenderPass;

class CC_GLES3_API GLES3RenderPass : public GFXRenderPass {
 public:
  GLES3RenderPass(GFXDevice* device);
  ~GLES3RenderPass();
  
 public:
  bool initialize(const GFXRenderPassInfo& info);
  void destroy();
  
  CC_INLINE GLES3GPURenderPass* gpuRenderPass() const { return _gpuRenderPass; }
  
 private:
  GLES3GPURenderPass* _gpuRenderPass = nullptr;
};

NS_CC_END

#endif
