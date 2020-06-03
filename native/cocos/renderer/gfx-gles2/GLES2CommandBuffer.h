#ifndef CC_GFXGLES2_GLES2_COMMAND_BUFFER_H_
#define CC_GFXGLES2_GLES2_COMMAND_BUFFER_H_

#include "GLES2Commands.h"

NS_CC_BEGIN

class GLES2CommandAllocator;

class CC_GLES2_API GLES2CommandBuffer : public GFXCommandBuffer {
public:
    GLES2CommandBuffer(GFXDevice *device);
    ~GLES2CommandBuffer();

    friend class GLES2Queue;

public:
    virtual bool initialize(const GFXCommandBufferInfo &info) override;
    virtual void destroy() override;

    virtual void begin(GFXRenderPass *renderPass = nullptr, uint subpass = 0, GFXFramebuffer *frameBuffer = nullptr) override;
    virtual void end() override;
    virtual void beginRenderPass(GFXFramebuffer *fbo, const GFXRect &render_area, GFXClearFlags clear_flags, const std::vector<GFXColor> &colors, float depth, int stencil) override;
    virtual void endRenderPass() override;
    virtual void bindPipelineState(GFXPipelineState *pso) override;
    virtual void bindBindingLayout(GFXBindingLayout *layout) override;
    virtual void bindInputAssembler(GFXInputAssembler *ia) override;
    virtual void setViewport(const GFXViewport &vp) override;
    virtual void setScissor(const GFXRect &rect) override;
    virtual void setLineWidth(const float width) override;
    virtual void setDepthBias(float constant, float clamp, float slope) override;
    virtual void setBlendConstants(const GFXColor &constants) override;
    virtual void setDepthBound(float min_bounds, float max_bounds) override;
    virtual void setStencilWriteMask(GFXStencilFace face, uint mask) override;
    virtual void setStencilCompareMask(GFXStencilFace face, int ref, uint mask) override;
    virtual void draw(GFXInputAssembler *ia) override;
    virtual void updateBuffer(GFXBuffer *buff, void *data, uint size, uint offset) override;
    virtual void copyBufferToTexture(GFXBuffer *src, GFXTexture *dst, GFXTextureLayout layout, const GFXBufferTextureCopyList &regions) override;
    virtual void execute(const std::vector<GFXCommandBuffer *> &cmd_buffs, uint32_t count) override;

private:
    void BindStates();

private:
    GLES2CmdPackage *_cmdPackage = nullptr;
    GLES2CommandAllocator *_gles2Allocator = nullptr;
    bool _isInRenderPass = false;
    GLES2GPUPipelineState *_curGPUPipelineState = nullptr;
    GLES2GPUBindingLayout *_curGPUBlendLayout = nullptr;
    GLES2GPUInputAssembler *_curGPUInputAssember = nullptr;
    GFXViewport _curViewport;
    GFXRect _curScissor;
    float _curLineWidth = 1.0f;
    GLES2DepthBias _curDepthBias;
    GFXColor _curBlendConstants;
    GLES2DepthBounds _curDepthBounds;
    GLES2StencilWriteMask _curStencilWriteMask;
    GLES2StencilCompareMask _curStencilCompareMask;
    bool _isStateInvalid = false;
};

NS_CC_END

#endif
