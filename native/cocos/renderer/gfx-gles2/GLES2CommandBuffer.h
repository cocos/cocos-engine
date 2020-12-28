#ifndef CC_GFXGLES2_COMMAND_BUFFER_H_
#define CC_GFXGLES2_COMMAND_BUFFER_H_

#include "GLES2Commands.h"

namespace cc {
namespace gfx {

class GLES2GPUCommandAllocator;

class CC_GLES2_API GLES2CommandBuffer : public CommandBuffer {
public:
    GLES2CommandBuffer(Device *device);
    ~GLES2CommandBuffer();

    friend class GLES2Queue;

public:
    virtual bool initialize(const CommandBufferInfo &info) override;
    virtual void destroy() override;

    virtual void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer, int submitIndex) override;
    virtual void end() override;
    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, bool fromSecondaryCB) override;
    virtual void endRenderPass() override;
    virtual void bindPipelineState(PipelineState *pso) override;
    virtual void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) override;
    virtual void bindInputAssembler(InputAssembler *ia) override;
    virtual void setViewport(const Viewport &vp) override;
    virtual void setScissor(const Rect &rect) override;
    virtual void setLineWidth(const float width) override;
    virtual void setDepthBias(float constant, float clamp, float slope) override;
    virtual void setBlendConstants(const Color &constants) override;
    virtual void setDepthBound(float minBounds, float maxBounds) override;
    virtual void setStencilWriteMask(StencilFace face, uint mask) override;
    virtual void setStencilCompareMask(StencilFace face, int ref, uint mask) override;
    virtual void draw(InputAssembler *ia) override;
    virtual void updateBuffer(Buffer *buff, const void *data, uint size) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    virtual void execute(const CommandBuffer *const *cmdBuffs, uint32_t count) override;

protected:
    void BindStates();

    GLES2GPUCommandAllocator *_cmdAllocator = nullptr;
    GLES2CmdPackage *_curCmdPackage = nullptr;
    queue<GLES2CmdPackage *> _pendingPackages, _freePackages;

    bool _isInRenderPass = false;
    GLES2GPUPipelineState *_curGPUPipelineState = nullptr;
    vector<GLES2GPUDescriptorSet *> _curGPUDescriptorSets;
    vector<vector<uint>> _curDynamicOffsets;
    GLES2GPUInputAssembler *_curGPUInputAssember = nullptr;
    Viewport _curViewport;
    Rect _curScissor;
    float _curLineWidth = 1.0f;
    GLES2DepthBias _curDepthBias;
    Color _curBlendConstants;
    GLES2DepthBounds _curDepthBounds;
    GLES2StencilWriteMask _curStencilWriteMask;
    GLES2StencilCompareMask _curStencilCompareMask;
    bool _isStateInvalid = false;
};

} // namespace gfx
} // namespace cc

#endif
