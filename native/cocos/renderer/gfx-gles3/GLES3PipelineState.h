#ifndef CC_GFXGLES3_GLES3_PIPELINE_STATE_H_
#define CC_GFXGLES3_GLES3_PIPELINE_STATE_H_

NS_CC_BEGIN

class GLES3GPUPipelineState;

class CC_GLES3_API GLES3PipelineState : public GFXPipelineState {
 public:
  GLES3PipelineState(GFXDevice* device);
  ~GLES3PipelineState();
  
 public:
  bool initialize(const GFXPipelineStateInfo& info);
  void destroy();

  CC_INLINE GLES3GPUPipelineState* gpuPipelineState() const { return _gpuPipelineState; }
  
 private:
  GLES3GPUPipelineState* _gpuPipelineState = nullptr;
};

NS_CC_END

#endif
