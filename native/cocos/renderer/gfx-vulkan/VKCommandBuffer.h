#ifndef CC_GFXVULKAN_CCVK_COMMAND_BUFFER_H_
#define CC_GFXVULKAN_CCVK_COMMAND_BUFFER_H_

#include "VKCommands.h"

namespace cc {

class CC_VULKAN_API CCVKCommandBuffer : public GFXCommandBuffer {
public:
    CCVKCommandBuffer(GFXDevice *device);
    ~CCVKCommandBuffer();

    friend class CCVKQueue;

public:
    bool initialize(const GFXCommandBufferInfo &info);
    void destroy();

    void begin(GFXRenderPass *renderPass = nullptr, uint subpass = 0, GFXFramebuffer *frameBuffer = nullptr);
    void end();
    void beginRenderPass(GFXFramebuffer *fbo, const GFXRect &render_area, GFXClearFlags clear_flags, const std::vector<GFXColor> &colors, float depth, int stencil);
    void endRenderPass();
    void bindPipelineState(GFXPipelineState *pso);
    void bindBindingLayout(GFXBindingLayout *layout);
    void bindInputAssembler(GFXInputAssembler *ia);
    void setViewport(const GFXViewport &vp);
    void setScissor(const GFXRect &rect);
    void setLineWidth(const float width);
    void setDepthBias(float constant, float clamp, float slope);
    void setBlendConstants(const GFXColor &constants);
    void setDepthBound(float min_bounds, float max_bounds);
    void setStencilWriteMask(GFXStencilFace face, uint mask);
    void setStencilCompareMask(GFXStencilFace face, int reference, uint mask);
    void draw(GFXInputAssembler *ia);
    void updateBuffer(GFXBuffer *buff, void *data, uint size, uint offset);
    void copyBufferToTexture(GFXBuffer *src, GFXTexture *dst, GFXTextureLayout layout, const GFXBufferTextureCopyList &regions);
    void execute(const std::vector<GFXCommandBuffer *> &cmd_buffs, uint count);

    CCVKGPUCommandBuffer *gpuCommandBuffer() const { return _gpuCommandBuffer; }

private:
    CCVKGPUCommandBuffer *_gpuCommandBuffer = nullptr;

    CCVKGPUPipelineState *_curGPUPipelineState = nullptr;
    CCVKGPUBindingLayout *_curGPUBindingLayout = nullptr;
    CCVKGPUInputAssembler *_curGPUInputAssember = nullptr;
    CCVKGPUFramebuffer *_curGPUFBO = nullptr;

    GFXViewport _curViewport;
    GFXRect _curScissor;
    float _curLineWidth = 1.0f;
    CCVKDepthBias _curDepthBias;
    GFXColor _curBlendConstants;
    CCVKDepthBounds _curDepthBounds;
    CCVKStencilWriteMask _curStencilWriteMask;
    CCVKStencilCompareMask _curStencilCompareMask;
};

}

#endif
