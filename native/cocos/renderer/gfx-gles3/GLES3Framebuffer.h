#ifndef CC_GFXGLES3_FRAMEBUFFER_H_
#define CC_GFXGLES3_FRAMEBUFFER_H_

namespace cc {
namespace gfx {

class GLES3GPUFramebuffer;

class CC_GLES3_API GLES3Framebuffer final : public Framebuffer {
public:
    GLES3Framebuffer(Device *device);
    ~GLES3Framebuffer();

public:
    virtual bool initialize(const FramebufferInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUFramebuffer *gpuFBO() const { return _gpuFBO; }

private:
    GLES3GPUFramebuffer *_gpuFBO = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
