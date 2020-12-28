#ifndef CC_GFXVULKAN_RENDER_PASS_H_
#define CC_GFXVULKAN_RENDER_PASS_H_

namespace cc {
namespace gfx {

class CCVKGPURenderPass;

class CC_VULKAN_API CCVKRenderPass final : public RenderPass {
public:
    CCVKRenderPass(Device *device);
    ~CCVKRenderPass();

public:
    bool initialize(const RenderPassInfo &info);
    void destroy();

    CC_INLINE CCVKGPURenderPass *gpuRenderPass() const { return _gpuRenderPass; }

private:
    CCVKGPURenderPass *_gpuRenderPass = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
