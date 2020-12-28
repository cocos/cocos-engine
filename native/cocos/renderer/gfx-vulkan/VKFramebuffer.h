#ifndef CC_GFXVULKAN_FRAMEBUFFER_H_
#define CC_GFXVULKAN_FRAMEBUFFER_H_

namespace cc {
namespace gfx {

class CCVKGPUFramebuffer;

class CC_VULKAN_API CCVKFramebuffer final : public Framebuffer {
public:
    CCVKFramebuffer(Device *device);
    ~CCVKFramebuffer();

public:
    bool initialize(const FramebufferInfo &info);
    void destroy();

    CC_INLINE CCVKGPUFramebuffer *gpuFBO() const { return _gpuFBO; }

private:
    CCVKGPUFramebuffer *_gpuFBO = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
