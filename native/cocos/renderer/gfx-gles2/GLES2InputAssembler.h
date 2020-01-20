#ifndef CC_GFXGLES2_GLES2_INPUT_ASSEMBLER_H_
#define CC_GFXGLES2_GLES2_INPUT_ASSEMBLER_H_

NS_CC_BEGIN

class GLES2GPUInputAssembler;
class GLES2CmdDraw;

class CC_GLES2_API GLES2InputAssembler : public GFXInputAssembler {
 public:
  GLES2InputAssembler(GFXDevice* device);
  ~GLES2InputAssembler();
  
 public:
  bool Initialize(const GFXInputAssemblerInfo& info);
  void destroy();
  
  void ExtractCmdDraw(GLES2CmdDraw* cmd);
  
  CC_INLINE GLES2GPUInputAssembler* gpu_input_assembler() const { return gpu_input_assembler_; }
  
 private:
  GLES2GPUInputAssembler* gpu_input_assembler_;
};

NS_CC_END

#endif
