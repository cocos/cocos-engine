#pragma once

#include "MTLCommands.h"
#include "MTLGPUObjects.h"
#import <Metal/MTLCommandQueue.h>
#import <MetalKit/MTKView.h>

namespace cc {
namespace gfx {

struct CCMTLDepthBias;
struct CCMTLDepthBounds;
struct CCMTLGPUPipelineState;
struct CCMTLGPUBuffer;

class CCMTLCommandBuffer : public CommandBuffer {
    friend class CCMTLQueue;

public:
    CCMTLCommandBuffer(Device *device);
    ~CCMTLCommandBuffer();

    virtual bool initialize(const CommandBufferInfo &info) override;
    virtual void destroy() override;
    virtual void begin(RenderPass *renderPass = nullptr, uint subpass = 0, Framebuffer *frameBuffer = nullptr) override;
    virtual void end() override;
    virtual void beginRenderPass(Framebuffer *fbo, const Rect &renderArea, ClearFlags clearFlags, const vector<Color> &colors, float depth, int stencil) override;
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
    virtual void execute(const vector<CommandBuffer *> &cmd_buffs, uint32_t count) override;

private:
    void bindStates();

private:
    CCMTLGPUPipelineState *_gpuPipelineState = nullptr;
    Viewport _currentViewport;
    Rect _currentScissor;

    CCMTLDepthBias _depthBias;
    CCMTLDepthBounds _depthBounds;
    Color _blendConstants;

    MTKView *_mtkView = nil;
    id<MTLCommandBuffer> _mtlCommandBuffer = nil;
    id<MTLRenderCommandEncoder> _mtlEncoder = nil;
    dispatch_semaphore_t _frameBoundarySemaphore;
    CCMTLGPUBuffer _gpuIndexBuffer;
    CCMTLGPUBuffer _gpuIndirectBuffer;
    MTLIndexType _indexType = MTLIndexTypeUInt16;
    MTLPrimitiveType _mtlPrimitiveType = MTLPrimitiveType::MTLPrimitiveTypeTriangle;
};

} // namespace gfx
} // namespace cc
