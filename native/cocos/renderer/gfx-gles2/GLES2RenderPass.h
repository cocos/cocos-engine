#ifndef CC_GFXGLES2_RENDER_PASS_H_
#define CC_GFXGLES2_RENDER_PASS_H_

namespace cc {
namespace gfx {

class GLES2GPURenderPass;

class CC_GLES2_API GLES2RenderPass final : public RenderPass {
public:
    GLES2RenderPass(Device *device);
    ~GLES2RenderPass();

public:
    virtual bool initialize(const RenderPassInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPURenderPass *gpuRenderPass() const { return _gpuRenderPass; }

private:
    GLES2GPURenderPass *_gpuRenderPass = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
