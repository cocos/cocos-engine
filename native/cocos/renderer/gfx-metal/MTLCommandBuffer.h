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

#include "MTLGPUObjects.h"
#include "MTLRenderCommandEncoder.h"
#import <Metal/MTLCommandQueue.h>
#import <MetalKit/MTKView.h>

namespace cc {
namespace gfx {

struct CCMTLGPUPipelineState;
class CCMTLInputAssembler;
class CCMTLDevice;
class CCMTLRenderPass;
class CCMTLFence;

class CCMTLCommandBuffer final : public CommandBuffer {
    friend class CCMTLQueue;

public:
    explicit CCMTLCommandBuffer(Device *device);
    ~CCMTLCommandBuffer() override = default;
    CCMTLCommandBuffer(const CCMTLCommandBuffer &) = delete;
    CCMTLCommandBuffer(CCMTLCommandBuffer &&) = delete;
    CCMTLCommandBuffer &operator=(const CCMTLCommandBuffer &) = delete;
    CCMTLCommandBuffer &operator=(CCMTLCommandBuffer &&) = delete;

    bool initialize(const CommandBufferInfo &info) override;
    void destroy() override;
    void begin(RenderPass *renderPass, uint subPass, Framebuffer *frameBuffer, int submitIndex) override;
    void end() override;
    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, bool fromSecondaryCB) override;
    void endRenderPass() override;
    void bindPipelineState(PipelineState *pso) override;
    void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) override;
    void bindInputAssembler(InputAssembler *ia) override;
    void setViewport(const Viewport &vp) override;
    void setScissor(const Rect &rect) override;
    void setLineWidth(float width) override;
    void setDepthBias(float constant, float clamp, float slope) override;
    void setBlendConstants(const Color &constants) override;
    void setDepthBound(float minBounds, float maxBounds) override;
    void setStencilWriteMask(StencilFace face, uint mask) override;
    void setStencilCompareMask(StencilFace face, int ref, uint mask) override;
    void draw(InputAssembler *ia) override;
    void updateBuffer(Buffer *buff, const void *data, uint size) override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    void execute(const CommandBuffer *const *cmdBuffs, uint32_t count) override;

    CC_INLINE id<MTLCommandBuffer> getMTLCommandBuffer() const { return _mtlCommandBuffer; }

private:
    void bindDescriptorSets();
    static bool isRenderingEntireDrawable(const Rect &rect, const CCMTLRenderPass *renderPass);

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
