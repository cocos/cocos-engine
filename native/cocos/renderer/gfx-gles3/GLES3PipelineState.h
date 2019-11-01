#ifndef CC_GFXGLES3_GLES3_PIPELINE_STATE_H_
#define CC_GFXGLES3_GLES3_PIPELINE_STATE_H_

NS_CC_BEGIN

class GLES3GPUPipelineState;

class CC_GLES3_API GLES3PipelineState : public GFXPipelineState {
 public:
  GLES3PipelineState(GFXDevice* device);
  ~GLES3PipelineState();
  
 public:
  bool Initialize(const GFXPipelineStateInfo& info);
  void Destroy();

  CC_INLINE GLES3GPUPipelineState* gpu_pso() const { return gpu_pso_; }
  
 private:
  GLES3GPUPipelineState* gpu_pso_;
};

NS_CC_END

#endif
