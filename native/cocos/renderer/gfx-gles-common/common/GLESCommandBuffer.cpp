#include "GLESCommandBuffer.h"
#include "GLESRenderPass.h"
#include "GLESFramebuffer.h"
#include "GLESQueue.h"
#include "GLESPipelineState.h"
#include "GLESDescriptorSet.h"
#include "GLESInputAssembler.h"
#include "GLESTexture.h"
#include "GLESBuffer.h"
#include "GLESCommands.h"
#include "GLESDevice.h"

namespace cc::gfx {
constexpr uint64_t FENCE_WAIT_TIMEOUT = 1 * 1000 * 1000 * 1000;

GLESCommandBuffer::GLESCommandBuffer() {
    _typedID = generateObjectID<decltype(this)>();
    _storage = std::make_unique<GLESCommandStorage>();
    _encoder.reset(createGLESCommandEncoder(GLESDevice::getInstance()->constantRegistry().majorVersion));

    auto *device = GLESDevice::getInstance();
    // default attach to main context.
    auto *mainContext = device->getMainContext();
    _encoder->attachContext(mainContext, device->getCacheState(mainContext->getContextID()));

    _fence = std::make_unique<GLESGPUFence>();
}

GLESCommandBuffer::~GLESCommandBuffer() {
    destroy();
}

void GLESCommandBuffer::begin(RenderPass * /*renderPass*/, uint32_t /*subPass*/, Framebuffer * /*frameBuffer*/) {
    _glesQueue->wait(_lastTaskHandle);
    _storage->reset();
    enqueueCmd(&GLESCommandEncoder::begin, _encoder.get(), _fence.get());
}

void GLESCommandBuffer::end() {
    enqueueCmd(&GLESCommandEncoder::end, _encoder.get(), _fence.get());
}

void GLESCommandBuffer::beginRenderPass(RenderPass *renderPass,
                                        Framebuffer *fbo,
                                        const Rect &renderArea,
                                        const Color *colors,
                                        float depth,
                                        uint32_t stencil,
                                        CommandBuffer *const * /*secondaryCBs*/,
                                        uint32_t  /*secondaryCBCount*/) {
    auto *pass = static_cast<GLESRenderPass *>(renderPass);
    enqueueCmd(&GLESCommandEncoder::beginRenderPass, _encoder.get(),
               PassBeginInfo {
                   static_cast<GLESFramebuffer *>(fbo)->gpuFramebuffer(),
                   reinterpret_cast<const Color *>(copyOrAssignData(colors, pass->getColorAttachments().size())),
                   depth,
                   stencil,
                   renderArea
               });
}

void GLESCommandBuffer::endRenderPass() {
    enqueueCmd(&GLESCommandEncoder::endRenderPass, _encoder.get());
}

void GLESCommandBuffer::nextSubpass() {
    enqueueCmd(&GLESCommandEncoder::nextSubPass, _encoder.get());
}

void GLESCommandBuffer::bindPipelineState(PipelineState *pso) {
    enqueueCmd(&GLESCommandEncoder::bindPipelineState, _encoder.get(), static_cast<GLESPipelineState*>(pso)->gpuPipelineState());
}

void GLESCommandBuffer::bindDescriptorSet(uint32_t set, DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) {
    enqueueCmd(&GLESCommandEncoder::bindDescriptorSet, _encoder.get(), set,
               DescriptorBindInfo{
                   static_cast<GLESDescriptorSet *>(descriptorSet)->gpuDescriptorSet(),
                   copyOrAssignData(dynamicOffsets, dynamicOffsetCount),
                   dynamicOffsetCount,
               });
}

void GLESCommandBuffer::bindInputAssembler(InputAssembler *ia) {
    enqueueCmd(&GLESCommandEncoder::bindInputAssembler, _encoder.get(), static_cast<GLESInputAssembler *>(ia)->gpuInputAssembler());
}

void GLESCommandBuffer::setViewport(const Viewport &vp) {
    enqueueCmd(&GLESCommandEncoder::setViewport, _encoder.get(), vp);
}

void GLESCommandBuffer::setScissor(const Rect &rect) {
    enqueueCmd(&GLESCommandEncoder::setScissor, _encoder.get(), rect);
}

void GLESCommandBuffer::setLineWidth(float width) {
    enqueueCmd(&GLESCommandEncoder::setLineWidth, _encoder.get(), width);
}

void GLESCommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    enqueueCmd(&GLESCommandEncoder::setDepthBias, _encoder.get(), constant, clamp, slope);
}

void GLESCommandBuffer::setBlendConstants(const Color &constants) {
    enqueueCmd(&GLESCommandEncoder::setBlendConstants, _encoder.get(), constants);
}

void GLESCommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    enqueueCmd(&GLESCommandEncoder::setDepthBound, _encoder.get(), minBounds, maxBounds);
}

void GLESCommandBuffer::setStencilWriteMask(StencilFace face, uint32_t mask) {
    enqueueCmd(&GLESCommandEncoder::setStencilWriteMask, _encoder.get(), face, mask);
}

void GLESCommandBuffer::setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) {
    enqueueCmd(&GLESCommandEncoder::setStencilCompareMask, _encoder.get(), face, ref, mask);
}

void GLESCommandBuffer::draw(const DrawInfo &info) {
    enqueueCmd(&GLESCommandEncoder::draw, _encoder.get(), info);
}

void GLESCommandBuffer::updateBuffer(Buffer *buff, const void *data, uint32_t size) {
    enqueueCmd(&GLESCommandEncoder::updateBuffer, _encoder.get(), static_cast<GLESBuffer *>(buff)->gpuBuffer(),
               copyOrAssignDataImpl(data, size), size);
}

void GLESCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) {
//    glesCopyBuffersToTexture(GLESDevice::getInstance(), buffers, static_cast<GLESTexture *>(texture)->gpuTexture(), regions, count);
}

void GLESCommandBuffer::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) {

}

void GLESCommandBuffer::copyTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) {

}

void GLESCommandBuffer::resolveTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) {

}

void GLESCommandBuffer::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    // do nothing
}

void GLESCommandBuffer::dispatch(const DispatchInfo &info) {
    if (info.indirectBuffer == nullptr) {
        enqueueCmd(&GLESCommandEncoder::dispatch, _encoder.get(), info.groupCountX, info.groupCountY, info.groupCountZ);
    }
}

void GLESCommandBuffer::pipelineBarrier(const GeneralBarrier *barrier, const BufferBarrier *const *bufferBarriers, const Buffer *const * /*buffers*/, uint32_t bufferBarrierCount, const TextureBarrier *const *textureBarriers, const Texture *const * /*textures*/, uint32_t textureBarrierCount) {

}

void GLESCommandBuffer::beginQuery(QueryPool *queryPool, uint32_t id) {

}

void GLESCommandBuffer::endQuery(QueryPool *queryPool, uint32_t id) {

}

void GLESCommandBuffer::resetQueryPool(QueryPool *queryPool) {

}

void GLESCommandBuffer::attachContext(egl::Context *context) {
    _encoder->attachContext(context, GLESDevice::getInstance()->getCacheState(context->getContextID()));
}

void GLESCommandBuffer::setTaskHandle(GLESQueue::TaskHandle handle) {
    _lastTaskHandle = handle;
}

void GLESCommandBuffer::executeCommands() {
    _storage->execute();
}

void GLESCommandBuffer::doInit(const CommandBufferInfo & /*info*/) {
    _glesQueue = static_cast<GLESQueue *>(_queue);
    _isAsyncQueue = _glesQueue->isAsyncQueue();
}

void GLESCommandBuffer::doDestroy() {
    waitFence();
}

void GLESCommandBuffer::waitFence() {
    if (_fence->sync != nullptr) {
        glesWaitFence(GLESDevice::getInstance(), _fence.get(), FENCE_WAIT_TIMEOUT, true);
        glesDestroyFence(GLESDevice::getInstance(), _fence.get());
        _fence->sync = nullptr;
    }
}

const void *GLESCommandBuffer::copyOrAssignDataImpl(const void* ptr, uint32_t size) {
    if (_isAsyncQueue && size > 0) {
        auto *res = _storage->allocate(size);
        memcpy(res, ptr, size);
        return res;
    }
    return ptr;
}

} // namespace cc::gfx
