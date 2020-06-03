#ifndef CC_GFXGLES2_GLES2_INPUT_ASSEMBLER_H_
#define CC_GFXGLES2_GLES2_INPUT_ASSEMBLER_H_

NS_CC_BEGIN

class GLES2GPUInputAssembler;
class GLES2CmdDraw;

class CC_GLES2_API GLES2InputAssembler : public GFXInputAssembler {
public:
    GLES2InputAssembler(GFXDevice *device);
    ~GLES2InputAssembler();

public:
    virtual bool initialize(const GFXInputAssemblerInfo &info) override;
    virtual void destroy() override;

    void ExtractCmdDraw(GLES2CmdDraw *cmd);

    CC_INLINE GLES2GPUInputAssembler *gpuInputAssembler() const { return _gpuInputAssembler; }

private:
    GLES2GPUInputAssembler *_gpuInputAssembler = nullptr;
};

NS_CC_END

#endif
