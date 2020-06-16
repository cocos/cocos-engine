#ifndef CC_GFXVULKAN_CCVK_INPUT_ASSEMBLER_H_
#define CC_GFXVULKAN_CCVK_INPUT_ASSEMBLER_H_

namespace cc {
namespace gfx {

class CCVKGPUInputAssembler;

class CC_VULKAN_API CCVKInputAssembler : public GFXInputAssembler {
public:
    CCVKInputAssembler(GFXDevice *device);
    ~CCVKInputAssembler();

public:
    bool initialize(const GFXInputAssemblerInfo &info);
    void destroy();

    CC_INLINE CCVKGPUInputAssembler *gpuInputAssembler() const { return _gpuInputAssembler; }

private:
    CCVKGPUInputAssembler *_gpuInputAssembler = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
