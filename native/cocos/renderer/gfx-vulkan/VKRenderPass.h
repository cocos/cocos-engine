#ifndef CC_GFXVULKAN_CCVK_RENDER_PASS_H_
#define CC_GFXVULKAN_CCVK_RENDER_PASS_H_

NS_CC_BEGIN

class CCVKGPURenderPass;

class CC_VULKAN_API CCVKRenderPass : public GFXRenderPass {
public:
    CCVKRenderPass(GFXDevice *device);
    ~CCVKRenderPass();

public:
    bool initialize(const GFXRenderPassInfo &info);
    void destroy();

    CC_INLINE CCVKGPURenderPass *gpuRenderPass() const { return _gpuRenderPass; }

private:
    CCVKGPURenderPass *_gpuRenderPass = nullptr;
};

NS_CC_END

#endif
