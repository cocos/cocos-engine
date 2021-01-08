#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXCommandBuffer.h"

namespace cc {

class MessageQueue;

namespace gfx {

class LinearAllocatorPool;

class CC_DLL CommandBufferAgent final : public Agent<CommandBuffer> {
public:
    using Agent::Agent;
    CommandBufferAgent(Device *device) = delete;
    ~CommandBufferAgent() override;

    static void flushCommands(uint count, CommandBufferAgent *const *cmdBuffs, bool multiThreaded);

    bool initialize(const CommandBufferInfo &info) override;
    void destroy() override;
    void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) override;
    void end() override;
    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) override;
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
    void execute(CommandBuffer *const *cmdBuffs, uint32_t count) override;

    uint getNumDrawCalls() const override { return _actor->getNumDrawCalls(); }
    uint getNumInstances() const override { return _actor->getNumInstances(); }
    uint getNumTris() const override { return _actor->getNumTris(); }

    CC_INLINE MessageQueue *getMessageQueue() { return _messageQueue; }
    LinearAllocatorPool *getAllocator();

private:
    friend class DeviceAgent;

    void initMessageQueue();
    void destroyMessageQueue();
    MessageQueue *_messageQueue = nullptr;
    vector<LinearAllocatorPool *> _allocatorPools;
};

} // namespace gfx
} // namespace cc
