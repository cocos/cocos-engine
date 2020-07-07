#ifndef CC_GFXVULKAN_CCVK_COMMAND_BUFFER_H_
#define CC_GFXVULKAN_CCVK_COMMAND_BUFFER_H_

#include "VKCommands.h"

namespace cc {
namespace gfx {

class CC_VULKAN_API CCVKCommandBuffer : public CommandBuffer {
public:
    CCVKCommandBuffer(Device *device);
    ~CCVKCommandBuffer();

    friend class CCVKQueue;

public:
    bool initialize(const CommandBufferInfo &info);
    void destroy();

    void begin(RenderPass *renderPass = nullptr, uint subpass = 0, Framebuffer *frameBuffer = nullptr);
    void end();
    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const vector<Color> &colors, float depth, int stencil);
    void endRenderPass();
    void bindPipelineState(PipelineState *pso);
    void bindBindingLayout(BindingLayout *layout);
    void bindInputAssembler(InputAssembler *ia);
    void setViewport(const Viewport &vp);
    void setScissor(const Rect &rect);
    void setLineWidth(const float width);
    void setDepthBias(float constant, float clamp, float slope);
    void setBlendConstants(const Color &constants);
    void setDepthBound(float min_bounds, float max_bounds);
    void setStencilWriteMask(StencilFace face, uint mask);
    void setStencilCompareMask(StencilFace face, int reference, uint mask);
    void draw(InputAssembler *ia);
    void updateBuffer(Buffer *buff, void *data, uint size, uint offset);
    void copyBufferToTexture(Buffer *src, Texture *dst, TextureLayout layout, const BufferTextureCopyList &regions);
    void execute(const vector<CommandBuffer *> &cmd_buffs, uint count);

    CCVKGPUCommandBuffer *gpuCommandBuffer() const { return _gpuCommandBuffer; }

private:
    CCVKGPUCommandBuffer *_gpuCommandBuffer = nullptr;

    CCVKGPUPipelineState *_curGPUPipelineState = nullptr;
    CCVKGPUBindingLayout *_curGPUBindingLayout = nullptr;
    CCVKGPUInputAssembler *_curGPUInputAssember = nullptr;
    CCVKGPUFramebuffer *_curGPUFBO = nullptr;

    Viewport _curViewport;
    Rect _curScissor;
    float _curLineWidth = 1.0f;
    CCVKDepthBias _curDepthBias;
    Color _curBlendConstants;
    CCVKDepthBounds _curDepthBounds;
    CCVKStencilWriteMask _curStencilWriteMask;
    CCVKStencilCompareMask _curStencilCompareMask;
};

} // namespace gfx
} // namespace cc

#endif
