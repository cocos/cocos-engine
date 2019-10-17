#ifndef CC_GFXGLES3_GLES3_RENDER_PASS_H_
#define CC_GFXGLES3_GLES3_RENDER_PASS_H_

CC_NAMESPACE_BEGIN

class GLES3GPURenderPass;

class CC_GLES3_API GLES3RenderPass : public GFXRenderPass {
 public:
  GLES3RenderPass(GFXDevice* device);
  ~GLES3RenderPass();
  
 public:
  bool Initialize(const GFXRenderPassInfo& info);
  void Destroy();
  
  CC_INLINE GLES3GPURenderPass* gpu_render_pass() const { return gpu_render_pass_; }
  
 private:
  GLES3GPURenderPass* gpu_render_pass_;
};

CC_NAMESPACE_END

#endif
