#ifndef CC_GFXGLES3_INPUT_ASSEMBLER_H_
#define CC_GFXGLES3_INPUT_ASSEMBLER_H_

namespace cc {
namespace gfx {

class GLES3GPUInputAssembler;
class GLES3CmdDraw;

class CC_GLES3_API GLES3InputAssembler final : public InputAssembler {
public:
    GLES3InputAssembler(Device *device);
    ~GLES3InputAssembler();

public:
    virtual bool initialize(const InputAssemblerInfo &info) override;
    virtual void destroy() override;

    void ExtractCmdDraw(GLES3CmdDraw *cmd);

    CC_INLINE GLES3GPUInputAssembler *gpuInputAssembler() const { return _gpuInputAssembler; }

private:
    GLES3GPUInputAssembler *_gpuInputAssembler = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
