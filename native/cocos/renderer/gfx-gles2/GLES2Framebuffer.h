#ifndef CC_GFXGLES2_GLES2_FRAMEBUFFER_H_
#define CC_GFXGLES2_GLES2_FRAMEBUFFER_H_

namespace cc {

class GLES2GPUFramebuffer;

class CC_GLES2_API GLES2Framebuffer : public GFXFramebuffer {
public:
    GLES2Framebuffer(GFXDevice *device);
    ~GLES2Framebuffer();

public:
    virtual bool initialize(const GFXFramebufferInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUFramebuffer *gpuFBO() const { return _gpuFBO; }

private:
    GLES2GPUFramebuffer *_gpuFBO = nullptr;
};

}

#endif
