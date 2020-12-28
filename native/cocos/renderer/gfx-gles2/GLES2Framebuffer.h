#ifndef CC_GFXGLES2_FRAMEBUFFER_H_
#define CC_GFXGLES2_FRAMEBUFFER_H_

namespace cc {
namespace gfx {

class GLES2GPUFramebuffer;

class CC_GLES2_API GLES2Framebuffer final : public Framebuffer {
public:
    GLES2Framebuffer(Device *device);
    ~GLES2Framebuffer();

public:
    virtual bool initialize(const FramebufferInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUFramebuffer *gpuFBO() const { return _gpuFBO; }

private:
    GLES2GPUFramebuffer *_gpuFBO = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
