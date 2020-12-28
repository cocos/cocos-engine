#ifndef CC_GFXVULKAN_COMMAND_BUFFER_H_
#define CC_GFXVULKAN_COMMAND_BUFFER_H_

#include "VKCommands.h"

namespace cc {
namespace gfx {

class CC_VULKAN_API CCVKCommandBuffer final : public CommandBuffer {
public:
    CCVKCommandBuffer(Device *device);
    ~CCVKCommandBuffer();

    friend class CCVKQueue;

public:
    virtual bool initialize(const CommandBufferInfo &info) override;
    virtual void destroy() override;

    virtual void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer, int submitIndex) override;
    virtual void end() override;
    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, bool fromSecondaryCB) override;
    virtual void endRenderPass() override;
    virtual void bindPipelineState(PipelineState *pso) override;
    virtual void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) override;
    virtual void bindInputAssembler(InputAssembler *ia) override;
    virtual void setViewport(const Viewport &vp) override;
    virtual void setScissor(const Rect &rect) override;
    virtual void setLineWidth(const float width) override;
    virtual void setDepthBias(float constant, float clamp, float slope) override;
    virtual void setBlendConstants(const Color &constants) override;
    virtual void setDepthBound(float minBounds, float maxBounds) override;
    virtual void setStencilWriteMask(StencilFace face, uint mask) override;
    virtual void setStencilCompareMask(StencilFace face, int reference, uint mask) override;
    virtual void draw(InputAssembler *ia) override;
    virtual void updateBuffer(Buffer *buffer, const void *data, uint size) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    virtual void execute(const CommandBuffer *const *cmdBuffs, uint count) override;

    CCVKGPUCommandBuffer *gpuCommandBuffer() const { return _gpuCommandBuffer; }

private:
    void bindDescriptorSets();

    CCVKGPUCommandBuffer *_gpuCommandBuffer = nullptr;

    CCVKGPUPipelineState *_curGPUPipelineState = nullptr;
    vector<CCVKGPUDescriptorSet *> _curGPUDescriptorSets;
    vector<VkDescriptorSet> _curVkDescriptorSets;
    vector<uint> _curDynamicOffsets;
    vector<const uint *> _curDynamicOffsetPtrs;
    vector<uint> _curDynamicOffsetCounts;
    uint _firstDirtyDescriptorSet = UINT_MAX;

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
    
    vector<VkCommandBuffer> _vkCommandBuffers;
    queue<VkCommandBuffer> _pendingQueue;
};

} // namespace gfx
} // namespace cc

#endif
