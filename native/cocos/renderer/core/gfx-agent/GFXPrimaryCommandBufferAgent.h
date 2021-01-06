#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXCommandBuffer.h"

namespace cc {
namespace gfx {

class CC_DLL PrimaryCommandBufferAgent final : public Agent<CommandBuffer> {
public:
    using Agent::Agent;
    PrimaryCommandBufferAgent(Device *device) = delete;
    ~PrimaryCommandBufferAgent() override;

    bool initialize(const CommandBufferInfo &info) override;
    void destroy() override;
    void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) override;
    void end() override;
    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, uint32_t secondaryCBCount, const CommandBuffer *const *secondaryCBs) override;
    void endRenderPass() override;
    void bindPipelineState(PipelineState *pso) override;
    void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) override;
    void bindInputAssembler(InputAssembler *ia) override;
    void setViewport(const Viewport &vp) override;
    void setScissor(const Rect &rect) override;
    void setLineWidth(const float width) override;
    void setDepthBias(float constant, float clamp, float slope) override;
    void setBlendConstants(const Color &constants) override;
    void setDepthBound(float minBounds, float maxBounds) override;
    void setStencilWriteMask(StencilFace face, uint mask) override;
    void setStencilCompareMask(StencilFace face, int ref, uint mask) override;
    void draw(InputAssembler *ia) override;
    void updateBuffer(Buffer *buff, const void *data, uint size) override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    void execute(const CommandBuffer *const *cmdBuffs, uint32_t count) override;

    uint getNumDrawCalls() const override { return _actor->getNumDrawCalls(); }
    uint getNumInstances() const override { return _actor->getNumInstances(); }
    uint getNumTris() const override { return _actor->getNumTris(); }

private:
    friend class DeviceAgent;
};

} // namespace gfx
} // namespace cc
