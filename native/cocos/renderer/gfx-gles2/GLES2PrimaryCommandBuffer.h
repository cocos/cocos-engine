#ifndef CC_GFXGLES2_PRIMARY_COMMAND_BUFFER_H_
#define CC_GFXGLES2_PRIMARY_COMMAND_BUFFER_H_

#include "GLES2CommandBuffer.h"

namespace cc {
namespace gfx {

class CC_GLES2_API GLES2PrimaryCommandBuffer : public GLES2CommandBuffer {
    friend class GLES2Queue;

public:
    GLES2PrimaryCommandBuffer(Device *device);
    ~GLES2PrimaryCommandBuffer();

    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) override;
    virtual void endRenderPass() override;
    virtual void draw(InputAssembler *ia) override;
    virtual void updateBuffer(Buffer *buff, const void *data, uint size, uint offset) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    virtual void execute(const CommandBuffer *const *cmdBuffs, uint32_t count) override;
};

} // namespace gfx
} // namespace cc

#endif
