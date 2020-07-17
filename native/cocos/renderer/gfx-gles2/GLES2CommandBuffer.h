#ifndef CC_GFXGLES2_GLES2_COMMAND_BUFFER_H_
#define CC_GFXGLES2_GLES2_COMMAND_BUFFER_H_

#include "GLES2Commands.h"

namespace cc {
namespace gfx {

class GLES2CommandAllocator;

class CC_GLES2_API GLES2CommandBuffer : public CommandBuffer {
public:
    GLES2CommandBuffer(Device *device);
    ~GLES2CommandBuffer();

    friend class GLES2Queue;

public:
    virtual bool initialize(const CommandBufferInfo &info) override;
    virtual void destroy() override;

    virtual void begin(RenderPass *renderPass = nullptr, uint subpass = 0, Framebuffer *frameBuffer = nullptr) override;
    virtual void end() override;
    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const vector<Color> &colors, float depth, int stencil) override;
    virtual void endRenderPass() override;
    virtual void bindPipelineState(PipelineState *pso) override;
    virtual void bindBindingLayout(BindingLayout *layout) override;
    virtual void bindInputAssembler(InputAssembler *ia) override;
    virtual void setViewport(const Viewport &vp) override;
    virtual void setScissor(const Rect &rect) override;
    virtual void setLineWidth(const float width) override;
    virtual void setDepthBias(float constant, float clamp, float slope) override;
    virtual void setBlendConstants(const Color &constants) override;
    virtual void setDepthBound(float min_bounds, float max_bounds) override;
    virtual void setStencilWriteMask(StencilFace face, uint mask) override;
    virtual void setStencilCompareMask(StencilFace face, int ref, uint mask) override;
    virtual void draw(InputAssembler *ia) override;
    virtual void updateBuffer(Buffer *buff, void *data, uint size, uint offset) override;
    virtual void copyBuffersToTexture(const BufferDataList &buffers, Texture *texture, const BufferTextureCopyList &regions) override;
    virtual void execute(const CommandBufferList &cmd_buffs, uint32_t count) override;

private:
    void BindStates();

private:
    GLES2CmdPackage *_cmdPackage = nullptr;
    GLES2CommandAllocator *_gles2Allocator = nullptr;
    bool _isInRenderPass = false;
    GLES2GPUPipelineState *_curGPUPipelineState = nullptr;
    GLES2GPUBindingLayout *_curGPUBlendLayout = nullptr;
    GLES2GPUInputAssembler *_curGPUInputAssember = nullptr;
    Viewport _curViewport;
    Rect _curScissor;
    float _curLineWidth = 1.0f;
    GLES2DepthBias _curDepthBias;
    Color _curBlendConstants;
    GLES2DepthBounds _curDepthBounds;
    GLES2StencilWriteMask _curStencilWriteMask;
    GLES2StencilCompareMask _curStencilCompareMask;
    bool _isStateInvalid = false;
};

} // namespace gfx
} // namespace cc

#endif
