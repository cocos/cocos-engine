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

    static void flushCommands(CommandBufferAgent *const *cmdBuffs, uint count, bool multiThreaded);

    virtual bool initialize(const CommandBufferInfo &info) override;
    virtual void destroy() override;
    virtual void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer, int submitIndex) override;
    virtual void end() override;
    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, uint32_t secondaryCBCount, const CommandBuffer *const *secondaryCBs) override;
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
    virtual void setStencilCompareMask(StencilFace face, int ref, uint mask) override;
    virtual void draw(InputAssembler *ia) override;
    virtual void updateBuffer(Buffer *buff, const void *data, uint size) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    virtual void execute(const CommandBuffer *const *cmdBuffs, uint32_t count) override;

    virtual uint getNumDrawCalls() const override { return _actor->getNumDrawCalls(); }
    virtual uint getNumInstances() const override { return _actor->getNumInstances(); }
    virtual uint getNumTris() const override { return _actor->getNumTris(); }

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
