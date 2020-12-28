#ifndef CC_GFXGLES2_INPUT_ASSEMBLER_H_
#define CC_GFXGLES2_INPUT_ASSEMBLER_H_

namespace cc {
namespace gfx {

class GLES2GPUInputAssembler;
class GLES2CmdDraw;

class CC_GLES2_API GLES2InputAssembler final : public InputAssembler {
public:
    GLES2InputAssembler(Device *device);
    ~GLES2InputAssembler();

public:
    virtual bool initialize(const InputAssemblerInfo &info) override;
    virtual void destroy() override;

    void ExtractCmdDraw(GLES2CmdDraw *cmd);

    CC_INLINE GLES2GPUInputAssembler *gpuInputAssembler() const { return _gpuInputAssembler; }

private:
    GLES2GPUInputAssembler *_gpuInputAssembler = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
