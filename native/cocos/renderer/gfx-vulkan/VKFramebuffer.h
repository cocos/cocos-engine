#ifndef CC_GFXVULKAN_CCVK_FRAMEBUFFER_H_
#define CC_GFXVULKAN_CCVK_FRAMEBUFFER_H_

NS_CC_BEGIN

class CCVKGPUFramebuffer;

class CC_VULKAN_API CCVKFramebuffer : public GFXFramebuffer {
public:
    CCVKFramebuffer(GFXDevice *device);
    ~CCVKFramebuffer();

public:
    bool initialize(const GFXFramebufferInfo &info);
    void destroy();

    CC_INLINE CCVKGPUFramebuffer *gpuFBO() const { return _gpuFBO; }

private:
    CCVKGPUFramebuffer *_gpuFBO = nullptr;
};

NS_CC_END

#endif
