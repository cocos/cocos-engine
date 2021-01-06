#include "CoreStd.h"

#include "GFXBufferAgent.h"
#include "GFXCommandBufferAgent.h"
#include "GFXDescriptorSetAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXFramebufferAgent.h"
#include "GFXInputAssemblerAgent.h"
#include "GFXLinearAllocatorPool.h"
#include "GFXPipelineStateAgent.h"
#include "GFXQueueAgent.h"
#include "GFXRenderPassAgent.h"
#include "GFXTextureAgent.h"
#include "base/threading/MessageQueue.h"

namespace cc {
namespace gfx {

CommandBufferAgent::~CommandBufferAgent() {
    CC_SAFE_DELETE(_actor);
}

bool CommandBufferAgent::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    CommandBufferInfo actorInfo = info;
    actorInfo.queue = ((QueueAgent *)info.queue)->getActor();

    _actor->initialize(actorInfo);

    return true;
}

void CommandBufferAgent::destroy() {
    _actor->destroy();
}

void CommandBufferAgent::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    if (renderPass) renderPass = ((RenderPassAgent *)renderPass)->getActor();
    if (frameBuffer) frameBuffer = ((FramebufferAgent *)frameBuffer)->getActor();
    _actor->begin(renderPass, subpass, frameBuffer);
}

void CommandBufferAgent::end() {
    _actor->end();
}

void CommandBufferAgent::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, uint32_t secondaryCBCount, const CommandBuffer *const *secondaryCBs) {
    CCASSERT(0, "Secondary command buffers cannot call beginRenderPass");

    if (renderPass) renderPass = ((RenderPassAgent *)renderPass)->getActor();
    if (fbo) fbo = ((FramebufferAgent *)fbo)->getActor();

    const CommandBuffer **actorSecondaryCBs = nullptr;
    if (secondaryCBCount) {
        actorSecondaryCBs = ((DeviceAgent *)_device)->getMainAllocator()->allocate<const CommandBuffer *>(secondaryCBCount);
        for (uint i = 0; i < secondaryCBCount; ++i) {
            actorSecondaryCBs[i] = ((CommandBufferAgent *)secondaryCBs[i])->getActor();
        }
    }

    _actor->beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil, secondaryCBCount, actorSecondaryCBs);
}

void CommandBufferAgent::endRenderPass() {
    CCASSERT(0, "Secondary command buffers cannot call endRenderPass");

    _actor->endRenderPass();
}

void CommandBufferAgent::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    CCASSERT(0, "Secondary command buffers cannot call execute");

    if (!count) return;

    const CommandBuffer **actorCmdBuffs = ((DeviceAgent *)_device)->getMainAllocator()->allocate<const CommandBuffer *>(count);
    for (uint i = 0; i < count; ++i) {
        actorCmdBuffs[i] = ((CommandBufferAgent *)cmdBuffs[i])->getActor();
    }

    _actor->execute(actorCmdBuffs, count);
}

void CommandBufferAgent::bindPipelineState(PipelineState *pso) {
    if (pso) pso = ((PipelineStateAgent *)pso)->getActor();
    _actor->bindPipelineState(pso);
}

void CommandBufferAgent::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    if (descriptorSet) descriptorSet = ((DescriptorSetAgent *)descriptorSet)->getActor();
    _actor->bindDescriptorSet(set, descriptorSet, dynamicOffsetCount, dynamicOffsets);
}

void CommandBufferAgent::bindInputAssembler(InputAssembler *ia) {
    if (ia) ia = ((InputAssemblerAgent *)ia)->getActor();
    _actor->bindInputAssembler(ia);
}

void CommandBufferAgent::setViewport(const Viewport &vp) {
    _actor->setViewport(vp);
}

void CommandBufferAgent::setScissor(const Rect &rect) {
    _actor->setScissor(rect);
}

void CommandBufferAgent::setLineWidth(const float width) {
    _actor->setLineWidth(width);
}

void CommandBufferAgent::setDepthBias(float constant, float clamp, float slope) {
    _actor->setDepthBias(constant, clamp, slope);
}

void CommandBufferAgent::setBlendConstants(const Color &constants) {
    _actor->setBlendConstants(constants);
}

void CommandBufferAgent::setDepthBound(float minBounds, float maxBounds) {
    _actor->setDepthBound(minBounds, maxBounds);
}

void CommandBufferAgent::setStencilWriteMask(StencilFace face, uint mask) {
    _actor->setStencilWriteMask(face, mask);
}

void CommandBufferAgent::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    _actor->setStencilCompareMask(face, ref, mask);
}

void CommandBufferAgent::draw(InputAssembler *ia) {
    if (ia) ia = ((InputAssemblerAgent *)ia)->getActor();
    _actor->draw(ia);
}

void CommandBufferAgent::updateBuffer(Buffer *buff, const void *data, uint size) {
    if (buff) buff = ((BufferAgent *)buff)->getActor();
    _actor->updateBuffer(buff, data, size);
}

void CommandBufferAgent::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    if (texture) texture = ((TextureAgent *)texture)->getActor();
    _actor->copyBuffersToTexture(buffers, texture, regions, count);
}

} // namespace gfx
} // namespace cc
