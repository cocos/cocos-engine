#pragma once

namespace cc {
namespace gfx {

class CCMTLCommandPackage;
class CCMTLCommandAllocator;
struct CCMTLDepthBias;
struct CCMTLDepthBounds;
struct CCMTLGPUPipelineState;
class CCMTLInputAssembler;
class CCMTLPipelineState;
class CCMTLBindingLayout;

class CCMTLCommandBuffer : public CommandBuffer {
    friend class CCMTLQueue;

public:
    CCMTLCommandBuffer(Device *device);
    ~CCMTLCommandBuffer();

    virtual bool initialize(const CommandBufferInfo &info) override;
    virtual void destroy() override;
    virtual void begin(RenderPass *renderPass = nullptr, uint subpass = 0, Framebuffer *frameBuffer = nullptr) override;
    virtual void end() override;
    virtual void beginRenderPass(Framebuffer *fbo, const Rect &render_area, ClearFlags clear_flags, const std::vector<Color> &colors, float depth, int stencil) override;
    virtual void endRenderPass() override;
    virtual void bindPipelineState(PipelineState *pso) override;
    virtual void bindBindingLayout(BindingLayout *layout) override;
    virtual void bindInputAssembler(InputAssembler *ia) override;
    virtual void setViewport(const Viewport &vp) override;
    virtual void setScissor(const Rect &rect) override;
    virtual void setLineWidth(const float width) override;
    virtual void setDepthBias(float constant, float clamp, float slope) override;
    virtual void setBlendConstants(const Color &constants) override;
    virtual void setDepthBound(float min_bounds, float max_bounds) override;
    virtual void setStencilWriteMask(StencilFace face, uint mask) override;
    virtual void setStencilCompareMask(StencilFace face, int ref, uint mask) override;
    virtual void draw(InputAssembler *ia) override;
    virtual void updateBuffer(Buffer *buff, void *data, uint size, uint offset = 0) override;
    virtual void copyBufferToTexture(Buffer *src, Texture *dst, TextureLayout layout, const BufferTextureCopyList &regions) override;
    virtual void execute(const std::vector<CommandBuffer *> &cmd_buffs, uint32_t count) override;

    CC_INLINE const CCMTLCommandPackage *getCommandPackage() const { return _commandPackage; }

private:
    void bindStates();

private:
    CCMTLCommandPackage *_commandPackage = nullptr;
    CCMTLCommandAllocator *_MTLCommandAllocator = nullptr;
    bool _isInRenderPass = false;
    bool _isStateInValid = false;

    CCMTLPipelineState *_currentPipelineState = nullptr;
    CCMTLInputAssembler *_currentInputAssembler = nullptr;
    CCMTLBindingLayout *_currentBindingLayout = nullptr;
    Viewport _currentViewport;
    Rect _currentScissor;
    // Just don't want to include "Commands.h", because "Commands.h" includes Objective-C codes.
    CCMTLDepthBias *_currentDepthBias = nullptr;
    CCMTLDepthBounds *_currentDepthBounds = nullptr;
    Color _currentBlendConstants;
    const static uint DYNAMIC_STATE_SIZE = 8;
    std::array<bool, DYNAMIC_STATE_SIZE> _dynamicStateDirty = {false, false, false, false, false, false, false, false};
};

} // namespace gfx
} // namespace cc
