#pragma once

#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-gles-common/common/GLESCommandEncoder.h"
#include "gfx-gles-common/common/GLESCommandStorage.h"
#include "gfx-gles-common/common/GLESQueue.h"

namespace cc::gfx {
class GLESQueue;

class GLESCommandBuffer : public CommandBuffer {
public:
    GLESCommandBuffer();
    ~GLESCommandBuffer() override;

    void begin(RenderPass *renderPass, uint32_t subpass, Framebuffer *frameBuffer) override;
    void end() override;
    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil, CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) override;
    void endRenderPass() override;
    void bindPipelineState(PipelineState *pso) override;
    void bindDescriptorSet(uint32_t set, DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) override;
    void bindInputAssembler(InputAssembler *ia) override;
    void setViewport(const Viewport &vp) override;
    void setScissor(const Rect &rect) override;
    void setLineWidth(float width) override;
    void setDepthBias(float constant, float clamp, float slope) override;
    void setBlendConstants(const Color &constants) override;
    void setDepthBound(float minBounds, float maxBounds) override;
    void setStencilWriteMask(StencilFace face, uint32_t mask) override;
    void setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) override;
    void nextSubpass() override;
    void draw(const DrawInfo &info) override;
    void updateBuffer(Buffer *buff, const void *data, uint32_t size) override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) override;
    void blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) override;
    void copyTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) override;
    void resolveTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) override;
    void execute(CommandBuffer *const *cmdBuffs, uint32_t count) override;
    void dispatch(const DispatchInfo &info) override;
    void pipelineBarrier(const GeneralBarrier *barrier, const BufferBarrier *const *bufferBarriers, const Buffer *const * /*buffers*/, uint32_t bufferBarrierCount, const TextureBarrier *const *textureBarriers, const Texture *const * /*textures*/, uint32_t textureBarrierCount) override;
    void beginQuery(QueryPool *queryPool, uint32_t id) override;
    void endQuery(QueryPool *queryPool, uint32_t id) override;
    void resetQueryPool(QueryPool *queryPool) override;

    void attachContext(egl::Context *context);
    void setTaskHandle(GLESQueue::TaskHandle handle);
    void executeCommands();
private:
    friend class GLESDevice;

    void doInit(const CommandBufferInfo &info) override;
    void doDestroy() override;

    const void *copyOrAssignDataImpl(const void *ptr, uint32_t size);

    template <typename T, typename S>
    const T *copyOrAssignData(const T *ptr, S count) {
        return static_cast<const T*>(copyOrAssignDataImpl(ptr, count * sizeof(T)));
    }

    template <typename Func, typename ...Args>
    void enqueueCmd(Func &&func, Args &&...args) {
        if (!_isAsyncQueue) {
            std::invoke(std::forward<Func>(func), std::forward<Args>(args)...);
        } else {
            _storage->enqueueCmd(std::forward<Func>(func), std::forward<Args>(args)...);
        }
    }

    void waitFence();

    GLESQueue::TaskHandle _lastTaskHandle = 0;
    std::unique_ptr<GLESGPUFence> _fence;
    std::unique_ptr<GLESCommandEncoder> _encoder;
    std::unique_ptr<GLESCommandStorage> _storage;
    bool _isAsyncQueue = false;
    GLESQueue *_glesQueue = nullptr;
};

} // namespace cc::gfx
