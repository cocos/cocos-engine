#ifndef CC_GFXGLES2_GLES2_PIPELINE_LAYOUT_H_
#define CC_GFXGLES2_GLES2_PIPELINE_LAYOUT_H_

NS_CC_BEGIN

class GLES2GPUPipelineLayout;

class CC_GLES2_API GLES2PipelineLayout : public GFXPipelineLayout {
 public:
  GLES2PipelineLayout(GFXDevice* device);
  ~GLES2PipelineLayout();
  
 public:
  bool initialize(const GFXPipelineLayoutInfo& info);
  void destroy();
  
  CC_INLINE GLES2GPUPipelineLayout* gpu_pipeline_layout() const { return gpu_pipeline_layout_; }
 private:
  GLES2GPUPipelineLayout* gpu_pipeline_layout_;
};

NS_CC_END

#endif
