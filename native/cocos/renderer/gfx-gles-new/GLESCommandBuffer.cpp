#include "GLESCommandBuffer.h"

namespace cc::gfx::gles {
CommandBuffer::CommandBuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

CommandBuffer::~CommandBuffer() {
    destroy();
}

void CommandBuffer::doInit(const CommandBufferInfo &info) {
    std::ignore = info;
    _commands = std::make_unique<Commands>();
    allocateStorage();
}

void CommandBuffer::doDestroy() {
}

uint8_t* CommandBuffer::allocate(uint32_t size, uint32_t alignment) {
    uint8_t *ptr = (*_iterator)->allocate(size, alignment);
    if (ptr == nullptr) {
        _iterator++;
        if (_iterator == _storages.end()) {
            allocateStorage();
        }
        ptr = (*_iterator)->allocate(size, alignment);
    }
    return ptr;
}

void CommandBuffer::allocateStorage() {
    static const uint32_t DEFAULT_SIZE = 8 * 1024 * 1024; // 8M
    auto storage = std::make_unique<CommandStorage>(DEFAULT_SIZE);
    _iterator = _storages.emplace(_iterator, std::move(storage));
}

void CommandBuffer::resetStorage() {
    for (auto &storage : _storages) {
        storage->reset();
    }
    _iterator = _storages.begin();
    _head = nullptr;
    _current = &_head;
}


void CommandBuffer::begin(gfx::RenderPass *renderPass, uint32_t subpass, gfx::Framebuffer *frameBuffer) {
    std::ignore = renderPass;
    std::ignore = subpass;
    std::ignore = frameBuffer;

    _semaphore.wait();
    resetStorage();
}

void CommandBuffer::end() {

}

void CommandBuffer::beginRenderPass(gfx::RenderPass *renderPass, gfx::Framebuffer *fbo, const Rect &renderArea,
                     const Color *colors, float depth, uint32_t stencil,
                     gfx::CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) {
    std::ignore = secondaryCBs;
    std::ignore = secondaryCBCount;

    auto *pass = static_cast<RenderPass *>(renderPass);
    auto *fb = static_cast<Framebuffer *>(fbo);
    auto colorSize = pass->getColorAttachments().size() * sizeof(Color);
    auto *copyClearValues = allocate(colorSize);
    memcpy(copyClearValues, colors, colorSize);

    PassBeginInfo beginInfo = {};
    beginInfo.clearColors = reinterpret_cast<Color *>(copyClearValues);
    beginInfo.clearDepth = depth;
    beginInfo.clearStencil = stencil;
    beginInfo.renderArea = renderArea;
    beginInfo.framebuffer = fb->getGPUFramebuffer();

    enqueueCmd(&Commands::beginRenderPass, _commands.get(), beginInfo);
}

void CommandBuffer::endRenderPass() {
    enqueueCmd(&Commands::endRenderPass, _commands.get());
}

void CommandBuffer::bindPipelineState(gfx::PipelineState *pipelineState) {
    IntrusivePtr<GPUPipelineState> pso = static_cast<PipelineState*>(pipelineState)->getGPUPipelineState();
    enqueueCmd(&Commands::bindPipelineState, _commands.get(), pso);
}

void CommandBuffer::bindDescriptorSet(uint32_t set, gfx::DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) {
    DescriptorBindInfo bindInfo = {};
    bindInfo.descriptorSet = static_cast<DescriptorSet *>(descriptorSet)->getGPUDescriptorSet();
    if (dynamicOffsets != nullptr && dynamicOffsetCount != 0) {
        auto dynamicSize = dynamicOffsetCount * sizeof(uint32_t);
        auto *dynamicValues = allocate(dynamicSize);
        memcpy(dynamicValues, dynamicOffsets, dynamicSize);
        bindInfo.dynamicOffsets = reinterpret_cast<uint32_t*>(dynamicValues);
        bindInfo.dynamicCount = dynamicOffsetCount;
    }
    enqueueCmd(&Commands::bindDescriptorSet, _commands.get(), set, bindInfo);
}

void CommandBuffer::bindInputAssembler(gfx::InputAssembler *ia) {
    IntrusivePtr<GPUInputAssembler> gpuIa = static_cast<InputAssembler *>(ia)->getGPUInputAssembler();
    enqueueCmd(&Commands::bindInputAssembler, _commands.get(), gpuIa);
}

void CommandBuffer::setViewport(const Viewport &vp) {
    enqueueCmd(&Commands::setViewport, _commands.get(), vp);
}

void CommandBuffer::setScissor(const Rect &rect) {
    enqueueCmd(&Commands::setScissor, _commands.get(), rect);
}

void CommandBuffer::setLineWidth(float width) {
    enqueueCmd(&Commands::setLineWidth, _commands.get(), width);
}

void CommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    enqueueCmd(&Commands::setDepthBias, _commands.get(), constant, clamp, slope);
}

void CommandBuffer::setBlendConstants(const Color &constants) {
    enqueueCmd(&Commands::setBlendConstants, _commands.get(), constants);
}

void CommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    enqueueCmd(&Commands::setDepthBound, _commands.get(), minBounds, maxBounds);
}

void CommandBuffer::setStencilWriteMask(StencilFace face, uint32_t mask) {
    enqueueCmd(&Commands::setStencilWriteMask, _commands.get(), face, mask);
}

void CommandBuffer::setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) {
    enqueueCmd(&Commands::setStencilCompareMask, _commands.get(), face, ref, mask);
}

void CommandBuffer::nextSubpass() {
    enqueueCmd(&Commands::nextSubpass, _commands.get());
}

void CommandBuffer::draw(const DrawInfo &info) {
    enqueueCmd(&Commands::draw, _commands.get(), info);
}

void CommandBuffer::updateBuffer(gfx::Buffer *buff, const void *data, uint32_t size) {

}

void CommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, gfx::Texture *texture, const BufferTextureCopy *regions, uint32_t count) {

}

void CommandBuffer::blitTexture(gfx::Texture *srcTexture, gfx::Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) {

}

void CommandBuffer::execute(gfx::CommandBuffer *const *cmdBuffs, uint32_t count) {

}

void CommandBuffer::execute() {
    while (_head != nullptr) {
        auto ptr = _head->next;
        _head->execute();
        _head->~CmdBase();
        _head = ptr;
    }
}

void CommandBuffer::signal() {
    _semaphore.signal();
}


void CommandBuffer::dispatch(const DispatchInfo &info) {
    if (info.indirectBuffer == nullptr) {
        enqueueCmd(&Commands::dispatch, _commands.get(), info.groupCountX, info.groupCountY, info.groupCountZ);
    }
}

void CommandBuffer::pipelineBarrier(const GeneralBarrier *barrier, const BufferBarrier *const *bufferBarriers,
                                    const gfx::Buffer *const * /*buffers*/, uint32_t bufferBarrierCount,
                                    const TextureBarrier *const *textureBarriers, const gfx::Texture *const * /*textures*/, uint32_t textureBarrierCount) {

}

void CommandBuffer::beginQuery(gfx::QueryPool *queryPool, uint32_t id) {

}

void CommandBuffer::endQuery(gfx::QueryPool *queryPool, uint32_t id) {

}

void CommandBuffer::resetQueryPool(gfx::QueryPool *queryPool) {

}

} // namespace cc::gfx::gles
