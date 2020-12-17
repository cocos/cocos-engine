#ifndef CC_GFXGLES3_PRIMARY_COMMAND_BUFFER_H_
#define CC_GFXGLES3_PRIMARY_COMMAND_BUFFER_H_

#include "GLES3CommandBuffer.h"

namespace cc {
namespace gfx {

class CC_GLES3_API GLES3PrimaryCommandBuffer final : public GLES3CommandBuffer {
    friend class GLES3Queue;

public:
    GLES3PrimaryCommandBuffer(Device *device);
    ~GLES3PrimaryCommandBuffer();

    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, bool fromSecondaryCB) override;
    virtual void endRenderPass() override;
    virtual void draw(InputAssembler *ia) override;
    virtual void updateBuffer(Buffer *buff, const void *data, uint size) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    virtual void execute(const CommandBuffer *const *cmdBuffs, uint32_t count) override;
};

} // namespace gfx
} // namespace cc

#endif
