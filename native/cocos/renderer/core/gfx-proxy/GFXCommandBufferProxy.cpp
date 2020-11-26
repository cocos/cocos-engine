#include "CoreStd.h"

#include "../thread/CommandEncoder.h"
#include "GFXBufferProxy.h"
#include "GFXCommandBufferProxy.h"
#include "GFXDescriptorSetProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXFramebufferProxy.h"
#include "GFXInputAssemblerProxy.h"
#include "GFXPipelineStateProxy.h"
#include "GFXQueueProxy.h"
#include "GFXTextureProxy.h"

namespace cc {
namespace gfx {

bool CommandBufferProxy::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    CommandBufferInfo remoteInfo = info;
    remoteInfo.queue = ((QueueProxy *)info.queue)->getRemote();

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferInit,
        remote, getRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void CommandBufferProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            CommandBufferDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

void CommandBufferProxy::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    ENCODE_COMMAND_4(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferBegin,
        remote, getRemote(),
        renderPass, renderPass,
        subpass, subpass,
        frameBuffer, frameBuffer ? ((FramebufferProxy *)frameBuffer)->getRemote() : nullptr,
        {
            remote->begin(renderPass, subpass, frameBuffer);
        });
}

void CommandBufferProxy::end() {
    ENCODE_COMMAND_1(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferEnd,
        remote, getRemote(),
        {
            remote->end();
        });
}

void CommandBufferProxy::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) {
    CommandEncoder *encoder = ((DeviceProxy *)_device)->getMainEncoder();

    uint attachmentCount = (uint)renderPass->getColorAttachments().size();
    Color *remoteColors = encoder->Allocate<Color>(attachmentCount);
    memcpy(remoteColors, colors, sizeof(Color) * attachmentCount);

    ENCODE_COMMAND_7(
        encoder,
        CommandBufferBeginRenderPass,
        remote, getRemote(),
        renderPass, renderPass,
        fbo, ((FramebufferProxy *)fbo)->getRemote(),
        renderArea, renderArea,
        colors, remoteColors,
        depth, depth,
        stencil, stencil,
        {
            remote->beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil);
        });
}

void CommandBufferProxy::endRenderPass() {
    ENCODE_COMMAND_1(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferEndRenderPass,
        remote, getRemote(),
        {
            remote->endRenderPass();
        });
}

void CommandBufferProxy::bindPipelineState(PipelineState *pso) {
    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferBindPipelineState,
        remote, getRemote(),
        pso, ((PipelineStateProxy *)pso)->getRemote(),
        {
            remote->bindPipelineState(pso);
        });
}

void CommandBufferProxy::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    CommandEncoder *encoder = ((DeviceProxy *)_device)->getMainEncoder();

    uint *remoteDynamicOffsets = nullptr;
    if (dynamicOffsetCount) {
        remoteDynamicOffsets = encoder->Allocate<uint>(dynamicOffsetCount);
        memcpy(remoteDynamicOffsets, dynamicOffsets, dynamicOffsetCount * sizeof(uint));
    }

    ENCODE_COMMAND_5(
        encoder,
        CommandBufferBindDescriptorSet,
        remote, getRemote(),
        set, set,
        descriptorSet, ((DescriptorSetProxy *)descriptorSet)->getRemote(),
        dynamicOffsetCount, dynamicOffsetCount,
        dynamicOffsets, remoteDynamicOffsets,
        {
            remote->bindDescriptorSet(set, descriptorSet, dynamicOffsetCount, dynamicOffsets);
        });
}

void CommandBufferProxy::bindInputAssembler(InputAssembler *ia) {
    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferBindInputAssembler,
        remote, getRemote(),
        ia, ((InputAssemblerProxy *)ia)->getRemote(),
        {
            remote->bindInputAssembler(ia);
        });
}

void CommandBufferProxy::setViewport(const Viewport &vp) {
    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferSetViewport,
        remote, getRemote(),
        vp, vp,
        {
            remote->setViewport(vp);
        });
}

void CommandBufferProxy::setScissor(const Rect &rect) {
    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferSetScissor,
        remote, getRemote(),
        rect, rect,
        {
            remote->setScissor(rect);
        });
}

void CommandBufferProxy::setLineWidth(const float width) {
    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferSetLineWidth,
        remote, getRemote(),
        width, width,
        {
            remote->setLineWidth(width);
        });
}

void CommandBufferProxy::setDepthBias(float constant, float clamp, float slope) {
    ENCODE_COMMAND_4(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferSetDepthBias,
        remote, getRemote(),
        constant, constant,
        clamp, clamp,
        slope, slope,
        {
            remote->setDepthBias(constant, clamp, slope);
        });
}

void CommandBufferProxy::setBlendConstants(const Color &constants) {
    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferSetBlendConstants,
        remote, getRemote(),
        constants, constants,
        {
            remote->setBlendConstants(constants);
        });
}

void CommandBufferProxy::setDepthBound(float minBounds, float maxBounds) {
    ENCODE_COMMAND_3(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferSetDepthBound,
        remote, getRemote(),
        minBounds, minBounds,
        maxBounds, maxBounds,
        {
            remote->setDepthBound(minBounds, maxBounds);
        });
}

void CommandBufferProxy::setStencilWriteMask(StencilFace face, uint mask) {
    ENCODE_COMMAND_3(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferSetStencilWriteMask,
        remote, getRemote(),
        face, face,
        mask, mask,
        {
            remote->setStencilWriteMask(face, mask);
        });
}

void CommandBufferProxy::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    ENCODE_COMMAND_4(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferSetStencilCompareMask,
        remote, getRemote(),
        face, face,
        ref, ref,
        mask, mask,
        {
            remote->setStencilCompareMask(face, ref, mask);
        });
}

void CommandBufferProxy::draw(InputAssembler *ia) {
    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        CommandBufferDraw,
        remote, getRemote(),
        ia, ((InputAssemblerProxy *)ia)->getRemote(),
        {
            remote->draw(ia);
        });
}

void CommandBufferProxy::updateBuffer(Buffer *buff, const void *data, uint size, uint offset) {
    CommandEncoder *encoder = ((DeviceProxy *)_device)->getMainEncoder();

    uint8_t *remoteData = encoder->Allocate<uint8_t>(size);
    memcpy(remoteData, data, size);

    ENCODE_COMMAND_5(
        encoder,
        CommandBufferUpdateBuffer,
        remote, getRemote(),
        buff, ((BufferProxy *)buff)->getRemote(),
        data, remoteData,
        size, size,
        offset, offset,
        {
            remote->updateBuffer(buff, data, size, offset);
        });
}

void CommandBufferProxy::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    CommandEncoder *encoder = ((DeviceProxy *)_device)->getMainEncoder();

    BufferTextureCopy *remoteRegions = encoder->Allocate<BufferTextureCopy>(count);
    memcpy(remoteRegions, regions, count * sizeof(BufferTextureCopy));

    uint bufferCount = 0u;
    for (uint i = 0u; i < count; i++) {
        bufferCount += regions[i].texSubres.layerCount;
    }
    const uint8_t **remoteBuffers = encoder->Allocate<const uint8_t *>(bufferCount);
    for (uint i = 0u, n = 0u; i < count; i++) {
        const BufferTextureCopy &region = regions[i];
        uint size = FormatSize(texture->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        for (uint l = 0; l < region.texSubres.layerCount; l++) {
            uint8_t *buffer = encoder->Allocate<uint8_t>(size);
            memcpy(buffer, buffers[n], size);
            remoteBuffers[n++] = buffer;
        }
    }

    ENCODE_COMMAND_5(
        encoder,
        CommandBufferCopyBuffersToTexture,
        remote, getRemote(),
        buffers, remoteBuffers,
        texture, ((TextureProxy *)texture)->getRemote(),
        regions, remoteRegions,
        count, count,
        {
            remote->copyBuffersToTexture(buffers, texture, regions, count);
        });
}

void CommandBufferProxy::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    CommandEncoder *encoder = ((DeviceProxy *)_device)->getMainEncoder();

    const CommandBuffer **remoteCmdBuffs = encoder->Allocate<const CommandBuffer *>(count);
    for (uint i = 0; i < count; ++i) {
        remoteCmdBuffs[i] = ((CommandBufferProxy *)cmdBuffs[i])->getRemote();
    }

    ENCODE_COMMAND_3(
        encoder,
        CommandBufferExecute,
        remote, getRemote(),
        cmdBuffs, remoteCmdBuffs,
        count, count,
        {
            remote->execute(cmdBuffs, count);
        });
}

} // namespace gfx
} // namespace cc
