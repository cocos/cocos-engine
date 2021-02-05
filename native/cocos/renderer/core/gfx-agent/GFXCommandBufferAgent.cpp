/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

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
#include "base/job-system/JobSystem.h"
#include "base/threading/MessageQueue.h"

namespace cc {
namespace gfx {

void CommandBufferAgent::flushCommands(uint count, CommandBufferAgent *const *cmdBuffs, bool multiThreaded) {
    uint jobThreadCount    = JobSystem::getInstance()->threadCount();
    uint workForThisThread = (count - 1) / jobThreadCount + 1; // ceil(count / jobThreadCount)

    if (count > workForThisThread + 1 && multiThreaded) { // more than one job to dispatch
        JobGraph g(JobSystem::getInstance());
        g.createForEachIndexJob(workForThisThread, count, 1u, [cmdBuffs](uint i) {
            cmdBuffs[i]->getMessageQueue()->flushMessages();
        });
        g.run();

        for (uint i = 0u; i < workForThisThread; ++i) {
            cmdBuffs[i]->getMessageQueue()->flushMessages();
        }
        g.waitForAll();
    } else {
        for (uint i = 0u; i < count; ++i) {
            cmdBuffs[i]->getMessageQueue()->flushMessages();
        }
    }
}

CommandBufferAgent::~CommandBufferAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(), CommandBufferDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

void CommandBufferAgent::initMessageQueue() {
    _allocatorPools.resize(MAX_CPU_FRAME_AHEAD + 1);

    for (uint i = 0u; i < MAX_CPU_FRAME_AHEAD + 1; ++i) {
        _allocatorPools[i] = CC_NEW(LinearAllocatorPool);
    }
    DeviceAgent *device = (DeviceAgent *)_device;
    device->_cmdBuffRefs.insert(this);

    _messageQueue = CC_NEW(MessageQueue);
    if (device->_multithreaded) _messageQueue->setImmediateMode(false);
}

void CommandBufferAgent::destroyMessageQueue() {
    ((DeviceAgent *)_device)->getMessageQueue()->kickAndWait();
    CC_SAFE_DELETE(_messageQueue);

    ((DeviceAgent *)_device)->_cmdBuffRefs.erase(this);
    for (LinearAllocatorPool *pool : _allocatorPools) {
        CC_SAFE_DELETE(pool);
    }
    _allocatorPools.clear();
}

LinearAllocatorPool *CommandBufferAgent::getAllocator() {
    return _allocatorPools[((DeviceAgent *)_device)->_currentIndex];
}

bool CommandBufferAgent::initialize(const CommandBufferInfo &info) {
    _type  = info.type;
    _queue = info.queue;

    initMessageQueue();

    CommandBufferInfo actorInfo = info;
    actorInfo.queue             = ((QueueAgent *)info.queue)->getActor();

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(), CommandBufferInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void CommandBufferAgent::destroy() {
    destroyMessageQueue();

    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(), CommandBufferDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void CommandBufferAgent::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    ENQUEUE_MESSAGE_4(
        _messageQueue,
        CommandBufferBegin,
        actor, getActor(),
        renderPass, renderPass ? ((RenderPassAgent *)renderPass)->getActor() : nullptr,
        subpass, subpass,
        frameBuffer, frameBuffer ? ((FramebufferAgent *)frameBuffer)->getActor() : nullptr,
        {
            actor->begin(renderPass, subpass, frameBuffer);
        });
}

void CommandBufferAgent::end() {
    ENQUEUE_MESSAGE_1(
        _messageQueue, CommandBufferEnd,
        actor, getActor(),
        {
            actor->end();
        });
}

void CommandBufferAgent::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const *secondaryCBs, uint secondaryCBCount) {
    uint   attachmentCount = (uint)renderPass->getColorAttachments().size();
    Color *actorColors     = nullptr;
    if (attachmentCount) {
        actorColors = getAllocator()->allocate<Color>(attachmentCount);
        memcpy(actorColors, colors, sizeof(Color) * attachmentCount);
    }

    CommandBuffer **actorSecondaryCBs = nullptr;
    if (secondaryCBCount) {
        actorSecondaryCBs = getAllocator()->allocate<CommandBuffer *>(secondaryCBCount);
        for (uint i = 0; i < secondaryCBCount; ++i) {
            actorSecondaryCBs[i] = ((CommandBufferAgent *)secondaryCBs[i])->getActor();
        }
    }

    ENQUEUE_MESSAGE_9(
        _messageQueue, CommandBufferBeginRenderPass,
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
            actor->beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil, secondaryCBs, secondaryCBCount);
        });
}

void CommandBufferAgent::endRenderPass() {
    ENQUEUE_MESSAGE_1(
        _messageQueue, CommandBufferEndRenderPass,
        actor, getActor(),
        {
            actor->endRenderPass();
        });
}

void CommandBufferAgent::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    if (!count) return;

    CommandBuffer **actorCmdBuffs = getAllocator()->allocate<CommandBuffer *>(count);
    for (uint i = 0; i < count; ++i) {
        actorCmdBuffs[i] = ((CommandBufferAgent *)cmdBuffs[i])->getActor();
    }

    ENQUEUE_MESSAGE_3(
        _messageQueue, CommandBufferExecute,
        actor, getActor(),
        cmdBuffs, actorCmdBuffs,
        count, count,
        {
            actor->execute(cmdBuffs, count);
        });
}

void CommandBufferAgent::bindPipelineState(PipelineState *pso) {
    ENQUEUE_MESSAGE_2(
        _messageQueue, CommandBufferBindPipelineState,
        actor, getActor(),
        pso, ((PipelineStateAgent *)pso)->getActor(),
        {
            actor->bindPipelineState(pso);
        });
}

void CommandBufferAgent::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    uint *actorDynamicOffsets = nullptr;
    if (dynamicOffsetCount) {
        actorDynamicOffsets = getAllocator()->allocate<uint>(dynamicOffsetCount);
        memcpy(actorDynamicOffsets, dynamicOffsets, dynamicOffsetCount * sizeof(uint));
    }

    ENQUEUE_MESSAGE_5(
        _messageQueue, CommandBufferBindDescriptorSet,
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
    ENQUEUE_MESSAGE_2(
        _messageQueue, CommandBufferBindInputAssembler,
        actor, getActor(),
        ia, ((InputAssemblerAgent *)ia)->getActor(),
        {
            actor->bindInputAssembler(ia);
        });
}

void CommandBufferAgent::setViewport(const Viewport &vp) {
    ENQUEUE_MESSAGE_2(
        _messageQueue, CommandBufferSetViewport,
        actor, getActor(),
        vp, vp,
        {
            actor->setViewport(vp);
        });
}

void CommandBufferAgent::setScissor(const Rect &rect) {
    ENQUEUE_MESSAGE_2(
        _messageQueue, CommandBufferSetScissor,
        actor, getActor(),
        rect, rect,
        {
            actor->setScissor(rect);
        });
}

void CommandBufferAgent::setLineWidth(float width) {
    ENQUEUE_MESSAGE_2(
        _messageQueue, CommandBufferSetLineWidth,
        actor, getActor(),
        width, width,
        {
            actor->setLineWidth(width);
        });
}

void CommandBufferAgent::setDepthBias(float constant, float clamp, float slope) {
    ENQUEUE_MESSAGE_4(
        _messageQueue, CommandBufferSetDepthBias,
        actor, getActor(),
        constant, constant,
        clamp, clamp,
        slope, slope,
        {
            actor->setDepthBias(constant, clamp, slope);
        });
}

void CommandBufferAgent::setBlendConstants(const Color &constants) {
    ENQUEUE_MESSAGE_2(
        _messageQueue, CommandBufferSetBlendConstants,
        actor, getActor(),
        constants, constants,
        {
            actor->setBlendConstants(constants);
        });
}

void CommandBufferAgent::setDepthBound(float minBounds, float maxBounds) {
    ENQUEUE_MESSAGE_3(
        _messageQueue, CommandBufferSetDepthBound,
        actor, getActor(),
        minBounds, minBounds,
        maxBounds, maxBounds,
        {
            actor->setDepthBound(minBounds, maxBounds);
        });
}

void CommandBufferAgent::setStencilWriteMask(StencilFace face, uint mask) {
    ENQUEUE_MESSAGE_3(
        _messageQueue, CommandBufferSetStencilWriteMask,
        actor, getActor(),
        face, face,
        mask, mask,
        {
            actor->setStencilWriteMask(face, mask);
        });
}

void CommandBufferAgent::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    ENQUEUE_MESSAGE_4(
        _messageQueue, CommandBufferSetStencilCompareMask,
        actor, getActor(),
        face, face,
        ref, ref,
        mask, mask,
        {
            actor->setStencilCompareMask(face, ref, mask);
        });
}

void CommandBufferAgent::draw(InputAssembler *ia) {
    ENQUEUE_MESSAGE_2(
        _messageQueue, CommandBufferDraw,
        actor, getActor(),
        ia, ((InputAssemblerAgent *)ia)->getActor(),
        {
            actor->draw(ia);
        });
}

void CommandBufferAgent::updateBuffer(Buffer *buff, const void *data, uint size) {
    MessageQueue *queue = _messageQueue;

    uint8_t *actorData = getAllocator()->allocate<uint8_t>(size);
    memcpy(actorData, data, size);

    ENQUEUE_MESSAGE_4(
        queue, CommandBufferUpdateBuffer,
        actor, getActor(),
        buff, ((BufferAgent *)buff)->getActor(),
        data, actorData,
        size, size,
        {
            actor->updateBuffer(buff, data, size);
        });
}

void CommandBufferAgent::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    LinearAllocatorPool *allocator = getAllocator();

    BufferTextureCopy *actorRegions = allocator->allocate<BufferTextureCopy>(count);
    memcpy(actorRegions, regions, count * sizeof(BufferTextureCopy));

    uint bufferCount = 0u;
    for (uint i = 0u; i < count; i++) {
        bufferCount += regions[i].texSubres.layerCount;
    }
    const uint8_t **actorBuffers = allocator->allocate<const uint8_t *>(bufferCount);
    for (uint i = 0u, n = 0u; i < count; i++) {
        const BufferTextureCopy &region = regions[i];
        uint                     size   = FormatSize(texture->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        for (uint l = 0; l < region.texSubres.layerCount; l++) {
            uint8_t *buffer = allocator->allocate<uint8_t>(size);
            memcpy(buffer, buffers[n], size);
            actorBuffers[n++] = buffer;
        }
    }

    ENQUEUE_MESSAGE_5(
        _messageQueue, CommandBufferCopyBuffersToTexture,
        actor, getActor(),
        buffers, actorBuffers,
        texture, ((TextureAgent *)texture)->getActor(),
        regions, actorRegions,
        count, count,
        {
            actor->copyBuffersToTexture(buffers, texture, regions, count);
        });
}

void CommandBufferAgent::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint count, Filter filter) {
    Texture *actorSrcTexture = nullptr;
    Texture *actorDstTexture = nullptr;
    if (srcTexture) actorSrcTexture = ((TextureAgent *)srcTexture)->getActor();
    if (dstTexture) actorDstTexture = ((TextureAgent *)dstTexture)->getActor();

    TextureBlit *actorRegions = getAllocator()->allocate<TextureBlit>(count);
    memcpy(actorRegions, regions, count * sizeof(TextureBlit));

    ENQUEUE_MESSAGE_6(
        _messageQueue, CommandBufferBlitTexture,
        actor, getActor(),
        srcTexture, actorSrcTexture,
        dstTexture, actorDstTexture,
        regions, actorRegions,
        count, count,
        filter, filter,
        {
            actor->blitTexture(srcTexture, dstTexture, regions, count, filter);
        });
}

void CommandBufferAgent::dispatch(const DispatchInfo &info) {
    DispatchInfo actorInfo = info;
    if (info.indirectBuffer) actorInfo.indirectBuffer = ((BufferAgent *)info.indirectBuffer)->getActor();

    ENQUEUE_MESSAGE_2(
        _messageQueue, CommandBufferDispatch,
        actor, getActor(),
        info, actorInfo,
        {
            actor->dispatch(info);
        });
}

void CommandBufferAgent::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint textureBarrierCount) {
    TextureBarrier **actorTextureBarriers = nullptr;
    Texture **       actorTextures        = nullptr;

    if (textureBarrierCount) {
        actorTextureBarriers = getAllocator()->allocate<TextureBarrier *>(textureBarrierCount);
        memcpy(actorTextureBarriers, textureBarriers, textureBarrierCount * sizeof(TextureBarrier *));

        actorTextures = getAllocator()->allocate<Texture *>(textureBarrierCount);
        for (uint i = 0u; i < textureBarrierCount; ++i) {
            actorTextures[i] = textures[i] ? ((TextureAgent *)textures[i])->getActor() : nullptr;
        }
    }

    ENQUEUE_MESSAGE_5(
        _messageQueue, CommandBufferPipelineBarrier,
        actor, getActor(),
        barrier, barrier,
        textureBarriers, actorTextureBarriers,
        textures, actorTextures,
        textureBarrierCount, textureBarrierCount,
        {
            actor->pipelineBarrier(barrier, textureBarriers, textures, textureBarrierCount);
        });
}

} // namespace gfx
} // namespace cc
