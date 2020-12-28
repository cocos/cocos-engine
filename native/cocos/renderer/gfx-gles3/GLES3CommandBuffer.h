#ifndef CC_GFXGLES3_COMMAND_BUFFER_H_
#define CC_GFXGLES3_COMMAND_BUFFER_H_

#include "GLES3Commands.h"

namespace cc {
namespace gfx {

class GLES3GPUCommandAllocator;

class CC_GLES3_API GLES3CommandBuffer : public CommandBuffer {
    friend class GLES3Queue;

public:
    GLES3CommandBuffer(Device *device);
    ~GLES3CommandBuffer();

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
    virtual void BindStates();

    GLES3GPUCommandAllocator *_cmdAllocator = nullptr;
    GLES3CmdPackage *_curCmdPackage = nullptr;
    queue<GLES3CmdPackage *> _pendingPackages, _freePackages;

    bool _isInRenderPass = false;
    GLES3GPUPipelineState *_curGPUPipelineState = nullptr;
    GLES3GPUInputAssembler *_curGPUInputAssember = nullptr;
    vector<GLES3GPUDescriptorSet *> _curGPUDescriptorSets;
    vector<vector<uint>> _curDynamicOffsets;
    Viewport _curViewport;
    Rect _curScissor;
    float _curLineWidth = 1.0f;
    GLES3DepthBias _curDepthBias;
    Color _curBlendConstants;
    GLES3DepthBounds _curDepthBounds;
    GLES3StencilWriteMask _curStencilWriteMask;
    GLES3StencilCompareMask _curStencilCompareMask;
    bool _isStateInvalid = false;
};

} // namespace gfx
} // namespace cc

#endif
