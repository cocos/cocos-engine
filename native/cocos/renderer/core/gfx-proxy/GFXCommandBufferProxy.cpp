#include "CoreStd.h"
#include "GFXCommandBufferProxy.h"
#include "GFXDescriptorSetProxy.h"
#include "GFXInputAssemblerProxy.h"
#include "GFXPipelineStateProxy.h"
#include "GFXFramebufferProxy.h"
#include "GFXBufferProxy.h"
#include "GFXTextureProxy.h"
#include "GFXQueueProxy.h"
#include "GFXDeviceProxy.h"

namespace cc {
namespace gfx {

bool CommandBufferProxy::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    CommandBufferInfo remoteInfo = info;
    remoteInfo.queue = ((QueueProxy*)info.queue)->GetRemote();

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferInit,
        remote, GetRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void CommandBufferProxy::destroy() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferDestroy,
        remote, GetRemote(),
        {
            remote->destroy();
        });
}

void CommandBufferProxy::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    ENCODE_COMMAND_4(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferBegin,
        remote, GetRemote(),
        renderPass, renderPass,
        subpass, subpass,
        frameBuffer, frameBuffer ? ((FramebufferProxy*)frameBuffer)->GetRemote() : nullptr,
        {
            remote->begin(renderPass, subpass, frameBuffer);
        });
}

void CommandBufferProxy::end() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferEnd,
        remote, GetRemote(),
        {
            remote->end();
        });
}

void CommandBufferProxy::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) {
    ENCODE_COMMAND_7(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferBeginRenderPass,
        remote, GetRemote(),
        renderPass, renderPass,
        fbo, ((FramebufferProxy*)fbo)->GetRemote(),
        renderArea, renderArea,
        colors, colors,
        depth, depth,
        stencil, stencil,
        {
            remote->beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil);
        });
}

void CommandBufferProxy::endRenderPass() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferEndRenderPass,
        remote, GetRemote(),
        {
            remote->endRenderPass();
        });
}

void CommandBufferProxy::bindPipelineState(PipelineState *pso) {
    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferBindPipelineState,
        remote, GetRemote(),
        pso, ((PipelineStateProxy*)pso)->GetRemote(),
        {
            remote->bindPipelineState(pso);
        });
}

void CommandBufferProxy::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    ENCODE_COMMAND_5(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferBindDescriptorSet,
        remote, GetRemote(),
        set, set,
        descriptorSet, ((DescriptorSetProxy*)descriptorSet)->GetRemote(),
        dynamicOffsetCount, dynamicOffsetCount,
        dynamicOffsets, dynamicOffsets,
        {
            remote->bindDescriptorSet(set, descriptorSet, dynamicOffsetCount, dynamicOffsets);
        });
}

void CommandBufferProxy::bindInputAssembler(InputAssembler *ia) {
    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferBindInputAssembler,
        remote, GetRemote(),
        ia, ((InputAssemblerProxy*)ia)->GetRemote(),
        {
            remote->bindInputAssembler(ia);
        });
}

void CommandBufferProxy::setViewport(const Viewport &vp) {
    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferSetViewport,
        remote, GetRemote(),
        vp, vp,
        {
            remote->setViewport(vp);
        });
}

void CommandBufferProxy::setScissor(const Rect &rect) {
    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferSetScissor,
        remote, GetRemote(),
        rect, rect,
        {
            remote->setScissor(rect);
        });
}

void CommandBufferProxy::setLineWidth(const float width) {
    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferSetLineWidth,
        remote, GetRemote(),
        width, width,
        {
            remote->setLineWidth(width);
        });
}

void CommandBufferProxy::setDepthBias(float constant, float clamp, float slope) {
    ENCODE_COMMAND_4(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferSetDepthBias,
        remote, GetRemote(),
        constant, constant,
        clamp, clamp,
        slope, slope,
        {
            remote->setDepthBias(constant, clamp, slope);
        });
}

void CommandBufferProxy::setBlendConstants(const Color &constants) {
    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferSetBlendConstants,
        remote, GetRemote(),
        constants, constants,
        {
            remote->setBlendConstants(constants);
        });
}

void CommandBufferProxy::setDepthBound(float minBounds, float maxBounds) {
    ENCODE_COMMAND_3(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferSetDepthBound,
        remote, GetRemote(),
        minBounds, minBounds,
        maxBounds, maxBounds,
        {
            remote->setDepthBound(minBounds, maxBounds);
        });
}

void CommandBufferProxy::setStencilWriteMask(StencilFace face, uint mask) {
    ENCODE_COMMAND_3(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferSetStencilWriteMask,
        remote, GetRemote(),
        face, face,
        mask, mask,
        {
            remote->setStencilWriteMask(face, mask);
        });
}

void CommandBufferProxy::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    ENCODE_COMMAND_4(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferSetStencilCompareMask,
        remote, GetRemote(),
        face, face,
        ref, ref,
        mask, mask,
        {
            remote->setStencilCompareMask(face, ref, mask);
        });
}

void CommandBufferProxy::draw(InputAssembler *ia) {
    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferDraw,
        remote, GetRemote(),
        ia, ((InputAssemblerProxy*)ia)->GetRemote(),
        {
            remote->draw(ia);
        });
}

void CommandBufferProxy::updateBuffer(Buffer *buff, const void *data, uint size, uint offset) {
    ENCODE_COMMAND_5(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferUpdateBuffer,
        remote, GetRemote(),
        buff, ((BufferProxy*)buff)->GetRemote(),
        data, data,
        size, size,
        offset, offset,
        {
            remote->updateBuffer(buff, data, size, offset);
        });
}

void CommandBufferProxy::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    ENCODE_COMMAND_5(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        CommandBufferCopyBuffersToTexture,
        remote, GetRemote(),
        buffers, buffers,
        texture, ((TextureProxy*)texture)->GetRemote(),
        regions, regions,
        count, count,
        {
            remote->copyBuffersToTexture(buffers, texture, regions, count);
        });
}

void CommandBufferProxy::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    CommandEncoder *encoder = ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder();

    const CommandBuffer **remoteCmdBuffs = encoder->Allocate<const CommandBuffer *>(count);
    for (uint i = 0; i < count; ++i) {
        remoteCmdBuffs[i] = ((CommandBufferProxy*)cmdBuffs[i])->GetRemote();
    }

    ENCODE_COMMAND_3(
        encoder,
        CommandBufferExecute,
        remote, GetRemote(),
        cmdBuffs, remoteCmdBuffs,
        count, count,
        {
            remote->execute(cmdBuffs, count);
        });
}

} // namespace gfx
} // namespace cc
