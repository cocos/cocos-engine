/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#pragma once

#include "MTLCommands.h"
#include "MTLGPUObjects.h"
#include "MTLRenderCommandEncoder.h"
#import <Metal/MTLCommandQueue.h>
#import <MetalKit/MTKView.h>

namespace cc {
namespace gfx {

struct CCMTLDepthBias;
struct CCMTLDepthBounds;
struct CCMTLGPUPipelineState;
class CCMTLInputAssembler;
class CCMTLDevice;
class CCMTLRenderPass;
class CCMTLFence;

class CCMTLCommandBuffer : public CommandBuffer {
    friend class CCMTLQueue;

public:
    CCMTLCommandBuffer(Device *device);
    ~CCMTLCommandBuffer() = default;

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

    CC_INLINE bool isCommandBufferBegan() const { return _commandBufferBegan; }
    CC_INLINE id<MTLCommandBuffer> getMTLCommandBuffer() const { return _mtlCommandBuffer; }
    id<CAMetalDrawable> getCurrentDrawable();

private:
    void bindDescriptorSets();
    bool isRenderingEntireDrawable(const Rect &rect, const CCMTLRenderPass *renderPass);

    CCMTLGPUPipelineState *_gpuPipelineState = nullptr;

    vector<CCMTLGPUDescriptorSet *> _GPUDescriptorSets;
    vector<vector<uint>> _dynamicOffsets;
    uint _firstDirtyDescriptorSet = UINT_MAX;

    bool _indirectDrawSuppotred = false;
    bool _commandBufferBegan = false;
    CCMTLDevice *_mtlDevice = nullptr;
//    id<CAMetalDrawable> _currDrawable = nil;
    id<MTLCommandQueue> _mtlCommandQueue = nil;
    id<MTLCommandBuffer> _mtlCommandBuffer = nil;
    MTKView *_mtkView = nil;
    CCMTLRenderCommandEncoder _commandEncoder;
    CCMTLInputAssembler *_inputAssembler = nullptr;
    MTLIndexType _indexType = MTLIndexTypeUInt16;
    MTLPrimitiveType _mtlPrimitiveType = MTLPrimitiveType::MTLPrimitiveTypeTriangle;
};

} // namespace gfx
} // namespace cc
