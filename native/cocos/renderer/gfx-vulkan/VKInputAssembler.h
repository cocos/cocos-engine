#ifndef CC_GFXVULKAN_INPUT_ASSEMBLER_H_
#define CC_GFXVULKAN_INPUT_ASSEMBLER_H_

namespace cc {
namespace gfx {

class CCVKGPUInputAssembler;

class CC_VULKAN_API CCVKInputAssembler final : public InputAssembler {
public:
    CCVKInputAssembler(Device *device);
    ~CCVKInputAssembler();

public:
    bool initialize(const InputAssemblerInfo &info);
    void destroy();

    CC_INLINE CCVKGPUInputAssembler *gpuInputAssembler() const { return _gpuInputAssembler; }

private:
    CCVKGPUInputAssembler *_gpuInputAssembler = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
