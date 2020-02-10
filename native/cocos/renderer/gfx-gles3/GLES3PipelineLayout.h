#ifndef CC_GFXGLES3_GLES3_PIPELINE_LAYOUT_H_
#define CC_GFXGLES3_GLES3_PIPELINE_LAYOUT_H_

NS_CC_BEGIN

class GLES3GPUPipelineLayout;

class CC_GLES3_API GLES3PipelineLayout : public GFXPipelineLayout {
 public:
  GLES3PipelineLayout(GFXDevice* device);
  ~GLES3PipelineLayout();
  
 public:
  bool initialize(const GFXPipelineLayoutInfo& info);
  void destroy();
  
  CC_INLINE GLES3GPUPipelineLayout* gpu_pipeline_layout() const { return gpu_pipeline_layout_; }
 private:
  GLES3GPUPipelineLayout* gpu_pipeline_layout_;
};

NS_CC_END

#endif
