#include "CoreStd.h"

#include "job-system/JobSystem.h"
#include "threading/CommandEncoder.h"
#include "GFXBufferAgent.h"
#include "GFXCommandBufferAgent.h"
#include "GFXDescriptorSetAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXFramebufferAgent.h"
#include "GFXInputAssemblerAgent.h"
#include "GFXPipelineStateAgent.h"
#include "GFXQueueAgent.h"
#include "GFXRenderPassAgent.h"
#include "GFXTextureAgent.h"

namespace cc {
namespace gfx {

void CommandBufferAgent::initEncoder() {
    _encoder = CC_NEW(CommandEncoder);
    _encoder->setImmediateMode(false);
}

void CommandBufferAgent::destroyEncoder() {
    ((DeviceAgent *)_device)->getMainEncoder()->kickAndWait();
    CC_SAFE_DELETE(_encoder);
}

bool CommandBufferAgent::initialize(const CommandBufferInfo &info) {
    initEncoder();

    _type = info.type;
    _queue = info.queue;

    CommandBufferInfo actorInfo = info;
    actorInfo.queue = ((QueueAgent *)info.queue)->getActor();

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        CommandBufferInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void CommandBufferAgent::destroy() {
    destroyEncoder();
    if (_actor) {
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
            CommandBufferDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

void CommandBufferAgent::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer, bool parallelPass, int submitIndex) {
    ENCODE_COMMAND_6(
        _encoder,
        CommandBufferBegin,
        actor, getActor(),
        renderPass, renderPass ? ((RenderPassAgent *)renderPass)->getActor() : nullptr,
        subpass, subpass,
        frameBuffer, frameBuffer ? ((FramebufferAgent *)frameBuffer)->getActor() : nullptr,
        parallelPass, parallelPass,
        submitIndex, submitIndex,
        {
            actor->begin(renderPass, subpass, frameBuffer, parallelPass, submitIndex);
        });
}

void CommandBufferAgent::end() {
    ENCODE_COMMAND_1(
        _encoder,
        CommandBufferEnd,
        actor, getActor(),
        {
            actor->end();
        });
    CommandEncoder::freeChunksInFreeQueue(_encoder);
    _encoder->finishWriting();
}

void CommandBufferAgent::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, bool fromSecondaryCB) {

    uint attachmentCount = (uint)renderPass->getColorAttachments().size();
    Color *actorColors = nullptr;
    if (attachmentCount) {
        actorColors = _encoder->allocate<Color>(attachmentCount);
        memcpy(actorColors, colors, sizeof(Color) * attachmentCount);
    }

    ENCODE_COMMAND_8(
        _encoder,
        CommandBufferBeginRenderPass,
        actor, getActor(),
        renderPass, ((RenderPassAgent *)renderPass)->getActor(),
        fbo, ((FramebufferAgent *)fbo)->getActor(),
        renderArea, renderArea,
        colors, actorColors,
        depth, depth,
        stencil, stencil,
        fromSecondaryCB, fromSecondaryCB,
        {
            actor->beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil, fromSecondaryCB);
        });
}

void CommandBufferAgent::endRenderPass() {
    ENCODE_COMMAND_1(
        _encoder,
        CommandBufferEndRenderPass,
        actor, getActor(),
        {
            actor->endRenderPass();
        });
}

void CommandBufferAgent::bindPipelineState(PipelineState *pso) {
    ENCODE_COMMAND_2(
        _encoder,
        CommandBufferBindPipelineState,
        actor, getActor(),
        pso, ((PipelineStateAgent *)pso)->getActor(),
        {
            actor->bindPipelineState(pso);
        });
}

void CommandBufferAgent::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    uint *actorDynamicOffsets = nullptr;
    if (dynamicOffsetCount) {
        actorDynamicOffsets = _encoder->allocate<uint>(dynamicOffsetCount);
        memcpy(actorDynamicOffsets, dynamicOffsets, dynamicOffsetCount * sizeof(uint));
    }

    ENCODE_COMMAND_5(
        _encoder,
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

void CommandBufferAgent::bindInputAssembler(InputAssembler *ia) {
    ENCODE_COMMAND_2(
        _encoder,
        CommandBufferBindInputAssembler,
        actor, getActor(),
        ia, ((InputAssemblerAgent *)ia)->getActor(),
        {
            actor->bindInputAssembler(ia);
        });
}

void CommandBufferAgent::setViewport(const Viewport &vp) {
    ENCODE_COMMAND_2(
        _encoder,
        CommandBufferSetViewport,
        actor, getActor(),
        vp, vp,
        {
            actor->setViewport(vp);
        });
}

void CommandBufferAgent::setScissor(const Rect &rect) {
    ENCODE_COMMAND_2(
        _encoder,
        CommandBufferSetScissor,
        actor, getActor(),
        rect, rect,
        {
            actor->setScissor(rect);
        });
}

void CommandBufferAgent::setLineWidth(const float width) {
    ENCODE_COMMAND_2(
        _encoder,
        CommandBufferSetLineWidth,
        actor, getActor(),
        width, width,
        {
            actor->setLineWidth(width);
        });
}

void CommandBufferAgent::setDepthBias(float constant, float clamp, float slope) {
    ENCODE_COMMAND_4(
        _encoder,
        CommandBufferSetDepthBias,
        actor, getActor(),
        constant, constant,
        clamp, clamp,
        slope, slope,
        {
            actor->setDepthBias(constant, clamp, slope);
        });
}

void CommandBufferAgent::setBlendConstants(const Color &constants) {
    ENCODE_COMMAND_2(
        _encoder,
        CommandBufferSetBlendConstants,
        actor, getActor(),
        constants, constants,
        {
            actor->setBlendConstants(constants);
        });
}

void CommandBufferAgent::setDepthBound(float minBounds, float maxBounds) {
    ENCODE_COMMAND_3(
        _encoder,
        CommandBufferSetDepthBound,
        actor, getActor(),
        minBounds, minBounds,
        maxBounds, maxBounds,
        {
            actor->setDepthBound(minBounds, maxBounds);
        });
}

void CommandBufferAgent::setStencilWriteMask(StencilFace face, uint mask) {
    ENCODE_COMMAND_3(
        _encoder,
        CommandBufferSetStencilWriteMask,
        actor, getActor(),
        face, face,
        mask, mask,
        {
            actor->setStencilWriteMask(face, mask);
        });
}

void CommandBufferAgent::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    ENCODE_COMMAND_4(
        _encoder,
        CommandBufferSetStencilCompareMask,
        actor, getActor(),
        face, face,
        ref, ref,
        mask, mask,
        {
            actor->setStencilCompareMask(face, ref, mask);
        });
}

void CommandBufferAgent::draw(InputAssembler *ia) {
    ENCODE_COMMAND_2(
        _encoder,
        CommandBufferDraw,
        actor, getActor(),
        ia, ((InputAssemblerAgent *)ia)->getActor(),
        {
            actor->draw(ia);
        });
}

void CommandBufferAgent::updateBuffer(Buffer *buff, const void *data, uint size) {
    CommandEncoder *encoder = _encoder;

    uint8_t *actorData = encoder->allocate<uint8_t>(size);
    memcpy(actorData, data, size);

    ENCODE_COMMAND_4(
        encoder,
        CommandBufferUpdateBuffer,
        actor, getActor(),
        buff, ((BufferAgent *)buff)->getActor(),
        data, actorData,
        size, size,
        {
            actor->updateBuffer(buff, data, size);
        });
}

void CommandBufferAgent::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    BufferTextureCopy *actorRegions = _encoder->allocate<BufferTextureCopy>(count);
    memcpy(actorRegions, regions, count * sizeof(BufferTextureCopy));

    uint bufferCount = 0u;
    for (uint i = 0u; i < count; i++) {
        bufferCount += regions[i].texSubres.layerCount;
    }
    const uint8_t **actorBuffers = _encoder->allocate<const uint8_t *>(bufferCount);
    for (uint i = 0u, n = 0u; i < count; i++) {
        const BufferTextureCopy &region = regions[i];
        uint size = FormatSize(texture->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        for (uint l = 0; l < region.texSubres.layerCount; l++) {
            uint8_t *buffer = _encoder->allocate<uint8_t>(size);
            memcpy(buffer, buffers[n], size);
            actorBuffers[n++] = buffer;
        }
    }

    ENCODE_COMMAND_5(
        _encoder,
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

void CommandBufferAgent::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    if (!count) return;

    const CommandBuffer **actorCmdBuffs = _encoder->allocate<const CommandBuffer *>(count);
    for (uint i = 0; i < count; ++i) {
        actorCmdBuffs[i] = ((CommandBufferAgent *)cmdBuffs[i])->getActor();
    }

    bool multiThreaded = _device->hasFeature(Feature::MULTITHREADED_SUBMISSION);

    ENCODE_COMMAND_5(
        _encoder,
        CommandBufferExecute,
        actor, getActor(),
        cmdBuffs, cmdBuffs,
        actorCmdBuffs, actorCmdBuffs,
        count, count,
        multiThreaded, multiThreaded,
        {
            if (count > 1) {
                if (multiThreaded) {
                    JobGraph g(JobSystem::getInstance());
                    uint job = g.createForEachIndexJob(1u, count, 1u, [this](uint i) {
                        ((CommandBufferAgent *)cmdBuffs[i])->getEncoder()->flushCommands();
                    });
                    g.run(job);
                    ((CommandBufferAgent *)cmdBuffs[0])->getEncoder()->flushCommands();
                    g.waitForAll();
                } else {
                    for (uint i = 0u; i < count; ++i) {
                        ((CommandBufferAgent *)cmdBuffs[i])->getEncoder()->flushCommands();
                    }
                }
            } else {
                ((CommandBufferAgent *)cmdBuffs[0])->getEncoder()->flushCommands();
            }
            actor->execute(actorCmdBuffs, count);
        });
}

} // namespace gfx
} // namespace cc
