#pragma once

#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESCommandStorage.h"
#include "gfx-gles-new/GLESCore.h"
#include "gfx-gles-new/GLESCommands.h"
#include "base/std/container/list.h"
#include "base/threading/Semaphore.h"

namespace cc::gfx::gles {

struct CmdBase {
    CmdBase() = default;
    virtual ~CmdBase() = default;
    virtual void execute() {};
    CmdBase* next = nullptr;
};

template <typename Func, typename ...Args>
struct Cmd : public CmdBase {
    using Parameters = std::tuple<std::remove_reference_t<Args>...>;
    using FuncType = Func;

    explicit Cmd(Func &&f, Args &&...args) : func(f), params(std::forward<Args>(args)...) {}

    FuncType   func;
    Parameters params;

    void execute() override {
        std::apply(func, params);
    }
};


class CommandBuffer : public gfx::CommandBuffer {
public:
    CommandBuffer();
    ~CommandBuffer() override;

    static constexpr uint32_t DEFAULT_ALIGNMENT = 4;

    // common commands
    void pipelineBarrier(const GeneralBarrier *barrier, const BufferBarrier *const *bufferBarriers, const gfx::Buffer *const * /*buffers*/, uint32_t bufferBarrierCount, const TextureBarrier *const *textureBarriers, const gfx::Texture *const * /*textures*/, uint32_t textureBarrierCount) override;
    void bindPipelineState(gfx::PipelineState *pso) override;
    void bindDescriptorSet(uint32_t set, gfx::DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) override;

    // graphics commands
    void begin(gfx::RenderPass *renderPass, uint32_t subpass, gfx::Framebuffer *frameBuffer) override;
    void end() override;
    void beginRenderPass(gfx::RenderPass *renderPass, gfx::Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil, gfx::CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) override;
    void endRenderPass() override;
    void bindInputAssembler(gfx::InputAssembler *ia) override;
    void draw(const DrawInfo &info) override;

    // graphics dynamic commands
    void setViewport(const Viewport &vp) override;
    void setScissor(const Rect &rect) override;
    void setLineWidth(float width) override;
    void setDepthBias(float constant, float clamp, float slope) override;
    void setBlendConstants(const Color &constants) override;
    void setDepthBound(float minBounds, float maxBounds) override;
    void setStencilWriteMask(StencilFace face, uint32_t mask) override;
    void setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) override;
    void nextSubpass() override;

    // compute commands
    void dispatch(const DispatchInfo &info) override;

    // execute commands
    void execute(gfx::CommandBuffer *const *cmdBuffs, uint32_t count) override;
    void execute();
    void signal();

    // blit commands
    void updateBuffer(gfx::Buffer *buff, const void *data, uint32_t size) override;
    void copyBuffersToTexture(const uint8_t *const *buffers, gfx::Texture *texture, const BufferTextureCopy *regions, uint32_t count) override;
    void blitTexture(gfx::Texture *srcTexture, gfx::Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) override;

    // query commands
    void beginQuery(gfx::QueryPool *queryPool, uint32_t id) override;
    void endQuery(gfx::QueryPool *queryPool, uint32_t id) override;
    void resetQueryPool(gfx::QueryPool *queryPool) override;

    // attach to queue context
    void attachContext(ContextState *context) { _commands->attachContext(context); }

    template <typename Func, typename ...Args>
    void enqueueCmd(Func &&func, Args &&...args)
    {
        using CmdType = Cmd<Func, Args...>;
        uint8_t *ptr = allocate(sizeof(CmdType));
        CmdType *cmd = new (ptr) CmdType(std::forward<Func>(func), std::forward<Args>(args)...);

        (*_current) = cmd;
        _current = &(cmd->next);
    }
private:
    void doInit(const CommandBufferInfo &info) override;
    void doDestroy() override;

    uint8_t* allocate(uint32_t size, uint32_t alignment = DEFAULT_ALIGNMENT);
    void allocateStorage();
    void resetStorage();

    using StoragePtr = std::unique_ptr<CommandStorage>;
    using Iterator = std::list<StoragePtr>::iterator;

    ccstd::list<StoragePtr> _storages;
    Iterator _iterator = _storages.end();
    CmdBase* _head = nullptr;
    CmdBase** _current = &_head;
    std::unique_ptr<Commands> _commands;

    Semaphore _semaphore{1};
};

} // namespace cc::gfx::gles
