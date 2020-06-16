#ifndef CC_GFXGLES3_GLES3_RENDER_PASS_H_
#define CC_GFXGLES3_GLES3_RENDER_PASS_H_

namespace cc {
namespace gfx {

class GLES3GPURenderPass;

class CC_GLES3_API GLES3RenderPass : public GFXRenderPass {
public:
    GLES3RenderPass(GFXDevice *device);
    ~GLES3RenderPass();

public:
    virtual bool initialize(const GFXRenderPassInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPURenderPass *gpuRenderPass() const { return _gpuRenderPass; }

private:
    GLES3GPURenderPass *_gpuRenderPass = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
