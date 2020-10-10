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
class CCMTLInputAssembler;
class CCMTLDevice;

class CCMTLCommandBuffer : public CommandBuffer {
    friend class CCMTLQueue;

public:
    CCMTLCommandBuffer(Device *device);
    ~CCMTLCommandBuffer();

    virtual bool initialize(const CommandBufferInfo &info) override;
    virtual void destroy() override;
    virtual void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) override;
    virtual void end() override;
    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) override;
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
    virtual void updateBuffer(Buffer *buff, void *data, uint size, uint offset = 0) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    virtual void execute(const CommandBuffer *const *cmdBuffs, uint32_t count) override;

private:
    void bindDescriptorSets();

private:
    CCMTLGPUPipelineState *_gpuPipelineState = nullptr;
    Viewport _currentViewport;
    Rect _currentScissor;

    CCMTLDepthBias _depthBias;
    CCMTLDepthBounds _depthBounds;
    Color _blendConstants;

    vector<CCMTLGPUDescriptorSet *> _GPUDescriptorSets;
    vector<vector<uint>> _dynamicOffsets;
    uint _firstDirtyDescriptorSet = UINT_MAX;

    bool _commandBufferBegan = false;
    CCMTLDevice *_mtlDevice = nullptr;
    id<MTLCommandQueue> _mtlCommandQueue = nil;
    MTKView *_mtkView = nil;
    id<MTLCommandBuffer> _mtlCommandBuffer = nil;
    id<MTLRenderCommandEncoder> _mtlEncoder = nil;
    dispatch_semaphore_t _frameBoundarySemaphore;
    CCMTLGPUBuffer _gpuIndexBuffer;
    CCMTLGPUBuffer _gpuIndirectBuffer;
    CCMTLInputAssembler *_inputAssembler = nullptr;
    MTLIndexType _indexType = MTLIndexTypeUInt16;
    MTLPrimitiveType _mtlPrimitiveType = MTLPrimitiveType::MTLPrimitiveTypeTriangle;
};

} // namespace gfx
} // namespace cc
