/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "gfx-base/GFXCommandBuffer.h"

#import <Metal/MTLCommandQueue.h>
#import <MetalKit/MTKView.h>
#include <bitset>
#include "MTLComputeCommandEncoder.h"
#include "MTLGPUObjects.h"
#include "MTLRenderCommandEncoder.h"

namespace cc {
namespace gfx {

struct CCMTLGPUPipelineState;
class CCMTLInputAssembler;
class CCMTLDevice;
class CCMTLRenderPass;
class CCMTLFence;
class CCMTLFramebuffer;

class CCMTLCommandBuffer final : public CommandBuffer {
public:
    explicit CCMTLCommandBuffer();
    ~CCMTLCommandBuffer();
    CCMTLCommandBuffer(const CCMTLCommandBuffer &) = delete;
    CCMTLCommandBuffer(CCMTLCommandBuffer &&) = delete;
    CCMTLCommandBuffer &operator=(const CCMTLCommandBuffer &) = delete;
    CCMTLCommandBuffer &operator=(CCMTLCommandBuffer &&) = delete;

    void begin(RenderPass *renderPass, uint32_t subpass, Framebuffer *frameBuffer) override;
    void end() override;
    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil, CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) override;
    void endRenderPass() override;
    void bindPipelineState(PipelineState *pso) override;
    void bindDescriptorSet(uint32_t set, DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) override;
    void bindInputAssembler(InputAssembler *ia) override;
    void setViewport(const Viewport &vp) override;
    void setScissor(const Rect &rect) override;
    void setLineWidth(float width) override;
    void setDepthBias(float constant, float clamp, float slope) override;
    void setBlendConstants(const Color &constants) override;
    void setDepthBound(float minBounds, float maxBounds) override;
    void setStencilWriteMask(StencilFace face, uint32_t mask) override;
    void setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) override;
    void nextSubpass() override;
    void draw(const DrawInfo &info) override;
    void updateBuffer(Buffer *buff, const void *data, uint32_t size) override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) override;
    void blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) override;
    void execute(CommandBuffer *const *cmdBuffs, uint32_t count) override;
    void dispatch(const DispatchInfo &info) override;
    void pipelineBarrier(const GeneralBarrier *barrier, const BufferBarrier *const *bufferBarriers, const Buffer *const *buffers, uint32_t bufferBarrierCount, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint32_t textureBarrierCount) override;
    void copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *regions, uint32_t count);
    void beginQuery(QueryPool *queryPool, uint32_t id) override;
    void endQuery(QueryPool *queryPool, uint32_t id) override;
    void resetQueryPool(QueryPool *queryPool) override;
    void completeQueryPool(QueryPool *queryPool) override;
    inline bool isCommandBufferBegan() const { return _commandBufferBegan; }
    inline CCMTLGPUCommandBufferObject *gpuCommandBufferObj() const { return _gpuCommandBufferObj; }

    void reset();

protected:
    friend class CCMTLQueue;

    void doInit(const CommandBufferInfo &info) override;
    void doDestroy() override;

    void bindDescriptorSets();
    void updateDepthStencilState(uint32_t subPassIndex, MTLRenderPassDescriptor *descriptor);
    static bool isRenderingEntireDrawable(const Rect &rect, const CCMTLFramebuffer *renderPass);

    id<MTLCommandBuffer> getMTLCommandBuffer();

    ccstd::vector<CCMTLGPUDescriptorSet *> _GPUDescriptorSets; // NOLINT(bugprone-reserved-identifier)
    ccstd::vector<ccstd::vector<uint32_t>> _dynamicOffsets;
    ccstd::vector<Texture*> _fboTextures;
    ccstd::unordered_map<uint32_t, std::pair<void*, void*>> _fsrAttachmentmap;
    
    Rect _renderArea;
    uint32_t _firstDirtyDescriptorSet = UINT_MAX;
    bool _indirectDrawSuppotred = false;
    bool _commandBufferBegan = false;
    bool _firstRenderPass = true;
    bool _fsrEnabled = false;
    CCMTLDevice *_mtlDevice = nullptr;
    id<MTLCommandQueue> _mtlCommandQueue = nil;
    CCMTLRenderCommandEncoder _renderEncoder;
    CCMTLComputeCommandEncoder _computeEncoder;
    id<MTLParallelRenderCommandEncoder> _parallelEncoder = nil;
    MTLPrimitiveType _mtlPrimitiveType = MTLPrimitiveType::MTLPrimitiveTypeTriangle;

    CCMTLGPUCommandBufferObject *_gpuCommandBufferObj = nullptr;

    CCMTLSemaphore *_texCopySemaphore = nullptr;

    std::bitset<MAX_COLORATTACHMENTS> _colorAppearedBefore;
};

} // namespace gfx
} // namespace cc
