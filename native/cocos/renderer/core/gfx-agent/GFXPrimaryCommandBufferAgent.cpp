#include "CoreStd.h"

#include "GFXBufferAgent.h"
#include "GFXDescriptorSetAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXFramebufferAgent.h"
#include "GFXInputAssemblerAgent.h"
#include "GFXLinearAllocatorPool.h"
#include "GFXPipelineStateAgent.h"
#include "GFXPrimaryCommandBufferAgent.h"
#include "GFXQueueAgent.h"
#include "GFXRenderPassAgent.h"
#include "GFXTextureAgent.h"
#include "base/threading/MessageQueue.h"

namespace cc {
namespace gfx {

PrimaryCommandBufferAgent::~PrimaryCommandBufferAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool PrimaryCommandBufferAgent::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    CommandBufferInfo actorInfo = info;
    actorInfo.queue = ((QueueAgent *)info.queue)->getActor();

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void PrimaryCommandBufferAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void PrimaryCommandBufferAgent::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferBegin,
        actor, getActor(),
        renderPass, renderPass ? ((RenderPassAgent *)renderPass)->getActor() : nullptr,
        subpass, subpass,
        frameBuffer, frameBuffer ? ((FramebufferAgent *)frameBuffer)->getActor() : nullptr,
        {
            actor->begin(renderPass, subpass, frameBuffer);
        });
}

void PrimaryCommandBufferAgent::end() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferEnd,
        actor, getActor(),
        {
            actor->end();
        });
}

void PrimaryCommandBufferAgent::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, uint32_t secondaryCBCount, const CommandBuffer *const *secondaryCBs) {
    uint attachmentCount = (uint)renderPass->getColorAttachments().size();
    Color *actorColors = nullptr;
    if (attachmentCount) {
        actorColors = ((DeviceAgent *)_device)->getMainAllocator()->allocate<Color>(attachmentCount);
        memcpy(actorColors, colors, sizeof(Color) * attachmentCount);
    }

    const CommandBuffer **actorSecondaryCBs = nullptr;
    if (secondaryCBCount) {
        actorSecondaryCBs = ((DeviceAgent *)_device)->getMainAllocator()->allocate<const CommandBuffer *>(secondaryCBCount);
        for (uint i = 0; i < secondaryCBCount; ++i) {
            actorSecondaryCBs[i] = ((PrimaryCommandBufferAgent *)secondaryCBs[i])->getActor();
        }
    }

    ENQUEUE_MESSAGE_9(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferBeginRenderPass,
        actor, getActor(),
        renderPass, ((RenderPassAgent *)renderPass)->getActor(),
        fbo, ((FramebufferAgent *)fbo)->getActor(),
        renderArea, renderArea,
        colors, actorColors,
        depth, depth,
        stencil, stencil,
        secondaryCBCount, secondaryCBCount,
        secondaryCBs, actorSecondaryCBs,
        {
            actor->beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil, secondaryCBCount, secondaryCBs);
        });
}

void PrimaryCommandBufferAgent::endRenderPass() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferEndRenderPass,
        actor, getActor(),
        {
            actor->endRenderPass();
        });
}

void PrimaryCommandBufferAgent::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    if (!count) return;

    const CommandBuffer **actorCmdBuffs = ((DeviceAgent *)_device)->getMainAllocator()->allocate<const CommandBuffer *>(count);
    for (uint i = 0; i < count; ++i) {
        actorCmdBuffs[i] = ((PrimaryCommandBufferAgent *)cmdBuffs[i])->getActor();
    }

    ENQUEUE_MESSAGE_3(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferExecute,
        actor, getActor(),
        cmdBuffs, actorCmdBuffs,
        count, count,
        {
            actor->execute(cmdBuffs, count);
        });
}

void PrimaryCommandBufferAgent::bindPipelineState(PipelineState *pso) {
    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferBindPipelineState,
        actor, getActor(),
        pso, ((PipelineStateAgent *)pso)->getActor(),
        {
            actor->bindPipelineState(pso);
        });
}

void PrimaryCommandBufferAgent::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    uint *actorDynamicOffsets = nullptr;
    if (dynamicOffsetCount) {
        actorDynamicOffsets = ((DeviceAgent *)_device)->getMainAllocator()->allocate<uint>(dynamicOffsetCount);
        memcpy(actorDynamicOffsets, dynamicOffsets, dynamicOffsetCount * sizeof(uint));
    }

    ENQUEUE_MESSAGE_5(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferBindDescriptorSet,
        actor, getActor(),
        set, set,
        descriptorSet, ((DescriptorSetAgent *)descriptorSet)->getActor(),
        dynamicOffsetCount, dynamicOffsetCount,
        dynamicOffsets, actorDynamicOffsets,
        {
            actor->bindDescriptorSet(set, descriptorSet, dynamicOffsetCount, dynamicOffsets);
        });
}

void PrimaryCommandBufferAgent::bindInputAssembler(InputAssembler *ia) {
    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferBindInputAssembler,
        actor, getActor(),
        ia, ((InputAssemblerAgent *)ia)->getActor(),
        {
            actor->bindInputAssembler(ia);
        });
}

void PrimaryCommandBufferAgent::setViewport(const Viewport &vp) {
    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferSetViewport,
        actor, getActor(),
        vp, vp,
        {
            actor->setViewport(vp);
        });
}

void PrimaryCommandBufferAgent::setScissor(const Rect &rect) {
    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferSetScissor,
        actor, getActor(),
        rect, rect,
        {
            actor->setScissor(rect);
        });
}

void PrimaryCommandBufferAgent::setLineWidth(const float width) {
    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferSetLineWidth,
        actor, getActor(),
        width, width,
        {
            actor->setLineWidth(width);
        });
}

void PrimaryCommandBufferAgent::setDepthBias(float constant, float clamp, float slope) {
    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferSetDepthBias,
        actor, getActor(),
        constant, constant,
        clamp, clamp,
        slope, slope,
        {
            actor->setDepthBias(constant, clamp, slope);
        });
}

void PrimaryCommandBufferAgent::setBlendConstants(const Color &constants) {
    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferSetBlendConstants,
        actor, getActor(),
        constants, constants,
        {
            actor->setBlendConstants(constants);
        });
}

void PrimaryCommandBufferAgent::setDepthBound(float minBounds, float maxBounds) {
    ENQUEUE_MESSAGE_3(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferSetDepthBound,
        actor, getActor(),
        minBounds, minBounds,
        maxBounds, maxBounds,
        {
            actor->setDepthBound(minBounds, maxBounds);
        });
}

void PrimaryCommandBufferAgent::setStencilWriteMask(StencilFace face, uint mask) {
    ENQUEUE_MESSAGE_3(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferSetStencilWriteMask,
        actor, getActor(),
        face, face,
        mask, mask,
        {
            actor->setStencilWriteMask(face, mask);
        });
}

void PrimaryCommandBufferAgent::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferSetStencilCompareMask,
        actor, getActor(),
        face, face,
        ref, ref,
        mask, mask,
        {
            actor->setStencilCompareMask(face, ref, mask);
        });
}

void PrimaryCommandBufferAgent::draw(InputAssembler *ia) {
    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferDraw,
        actor, getActor(),
        ia, ((InputAssemblerAgent *)ia)->getActor(),
        {
            actor->draw(ia);
        });
}

void PrimaryCommandBufferAgent::updateBuffer(Buffer *buff, const void *data, uint size) {
    MessageQueue *queue = ((DeviceAgent *)_device)->getMessageQueue();

    uint8_t *actorData = ((DeviceAgent *)_device)->getMainAllocator()->allocate<uint8_t>(size);
    memcpy(actorData, data, size);

    ENQUEUE_MESSAGE_4(
        queue,
        CommandBufferUpdateBuffer,
        actor, getActor(),
        buff, ((BufferAgent *)buff)->getActor(),
        data, actorData,
        size, size,
        {
            actor->updateBuffer(buff, data, size);
        });
}

void PrimaryCommandBufferAgent::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    LinearAllocatorPool *allocator = ((DeviceAgent *)_device)->getMainAllocator();

    BufferTextureCopy *actorRegions = allocator->allocate<BufferTextureCopy>(count);
    memcpy(actorRegions, regions, count * sizeof(BufferTextureCopy));

    uint bufferCount = 0u;
    for (uint i = 0u; i < count; i++) {
        bufferCount += regions[i].texSubres.layerCount;
    }
    const uint8_t **actorBuffers = allocator->allocate<const uint8_t *>(bufferCount);
    for (uint i = 0u, n = 0u; i < count; i++) {
        const BufferTextureCopy &region = regions[i];
        uint size = FormatSize(texture->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        for (uint l = 0; l < region.texSubres.layerCount; l++) {
            uint8_t *buffer = allocator->allocate<uint8_t>(size);
            memcpy(buffer, buffers[n], size);
            actorBuffers[n++] = buffer;
        }
    }

    ENQUEUE_MESSAGE_5(
        ((DeviceAgent *)_device)->getMessageQueue(),
        CommandBufferCopyBuffersToTexture,
        actor, getActor(),
        buffers, actorBuffers,
        texture, ((TextureAgent *)texture)->getActor(),
        regions, actorRegions,
        count, count,
        {
            actor->copyBuffersToTexture(buffers, texture, regions, count);
        });
}

} // namespace gfx
} // namespace cc
