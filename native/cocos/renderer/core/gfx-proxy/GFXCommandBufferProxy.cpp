#include "CoreStd.h"
#include "GFXCommandBufferProxy.h"
#include "GFXDescriptorSetProxy.h"
#include "GFXBufferProxy.h"
#include "GFXTextureProxy.h"

namespace cc {
namespace gfx {

bool CommandBufferProxy::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    bool res = _remote->initialize(info);

    return res;
}

void CommandBufferProxy::destroy() {
    _remote->destroy();
}

void CommandBufferProxy::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    _remote->begin(renderPass, subpass, frameBuffer);
}

void CommandBufferProxy::end() {
    _remote->end();
}

void CommandBufferProxy::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) {
    _remote->beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil);
}

void CommandBufferProxy::endRenderPass() {
    _remote->endRenderPass();
}

void CommandBufferProxy::bindPipelineState(PipelineState *pso) {
    _remote->bindPipelineState(pso);
}

void CommandBufferProxy::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    _remote->bindDescriptorSet(set, ((DescriptorSetProxy*)descriptorSet)->GetRemote(), dynamicOffsetCount, dynamicOffsets);
}

void CommandBufferProxy::bindInputAssembler(InputAssembler *ia) {
    _remote->bindInputAssembler(ia);
}

void CommandBufferProxy::setViewport(const Viewport &vp) {
    _remote->setViewport(vp);
}

void CommandBufferProxy::setScissor(const Rect &rect) {
    _remote->setScissor(rect);
}

void CommandBufferProxy::setLineWidth(const float width) {
    _remote->setLineWidth(width);
}

void CommandBufferProxy::setDepthBias(float constant, float clamp, float slope) {
    _remote->setDepthBias(constant, clamp, slope);
}

void CommandBufferProxy::setBlendConstants(const Color &constants) {
    _remote->setBlendConstants(constants);
}

void CommandBufferProxy::setDepthBound(float minBounds, float maxBounds) {
    _remote->setDepthBound(minBounds, maxBounds);
}

void CommandBufferProxy::setStencilWriteMask(StencilFace face, uint mask) {
    _remote->setStencilWriteMask(face, mask);
}

void CommandBufferProxy::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    _remote->setStencilCompareMask(face, ref, mask);
}

void CommandBufferProxy::draw(InputAssembler *ia) {
    _remote->draw(ia);
}

void CommandBufferProxy::updateBuffer(Buffer *buff, const void *data, uint size, uint offset) {
    _remote->updateBuffer(((BufferProxy*)buff)->GetRemote(), data, size, offset);
}

void CommandBufferProxy::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    _remote->copyBuffersToTexture(buffers, ((TextureProxy*)texture)->GetRemote(), regions, count);
}

void CommandBufferProxy::execute(const CommandBuffer *const *cmdBuffs, uint32_t count) {
    _cmdBuffs.reserve(count);
    for (uint i = 0u; i < count; i++) {
        _cmdBuffs[i] = ((CommandBufferProxy*)cmdBuffs[i])->GetRemote();
    }
    _remote->execute(_cmdBuffs.data(), count);
}

} // namespace gfx
} // namespace cc
