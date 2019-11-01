#ifndef CC_GFXGLES2_GLES2_RENDER_PASS_H_
#define CC_GFXGLES2_GLES2_RENDER_PASS_H_

NS_CC_BEGIN

class GLES2GPURenderPass;

class CC_GLES2_API GLES2RenderPass : public GFXRenderPass {
 public:
  GLES2RenderPass(GFXDevice* device);
  ~GLES2RenderPass();
  
 public:
  bool Initialize(const GFXRenderPassInfo& info);
  void Destroy();
  
  CC_INLINE GLES2GPURenderPass* gpu_render_pass() const { return gpu_render_pass_; }
  
 private:
  GLES2GPURenderPass* gpu_render_pass_;
};

NS_CC_END

#endif
