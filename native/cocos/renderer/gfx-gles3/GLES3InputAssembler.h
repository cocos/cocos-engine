#ifndef CC_GFXGLES3_GLES3_INPUT_ASSEMBLER_H_
#define CC_GFXGLES3_GLES3_INPUT_ASSEMBLER_H_

NS_CC_BEGIN

class GLES3GPUInputAssembler;
class GLES3CmdDraw;

class CC_GLES3_API GLES3InputAssembler : public GFXInputAssembler {
 public:
  GLES3InputAssembler(GFXDevice* device);
  ~GLES3InputAssembler();
  
 public:
  bool initialize(const GFXInputAssemblerInfo& info);
  void destroy();
  
  void ExtractCmdDraw(GLES3CmdDraw* cmd);
  
  CC_INLINE GLES3GPUInputAssembler* gpuInputAssembler() const { return _gpuInputAssembler; }
  
 private:
  GLES3GPUInputAssembler* _gpuInputAssembler = nullptr;
};

NS_CC_END

#endif
