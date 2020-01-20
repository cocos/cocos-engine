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
  bool Initialize(const GFXInputAssemblerInfo& info);
  void destroy();
  
  void ExtractCmdDraw(GLES3CmdDraw* cmd);
  
  CC_INLINE GLES3GPUInputAssembler* gpu_input_assembler() const { return gpu_input_assembler_; }
  
 private:
  GLES3GPUInputAssembler* gpu_input_assembler_;
};

NS_CC_END

#endif
