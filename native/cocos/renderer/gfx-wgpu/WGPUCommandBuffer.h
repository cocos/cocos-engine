/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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
#ifdef CC_WGPU_WASM
    #include "WGPUDef.h"
#endif
#include <functional>
#include "base/std/container/vector.h"
#include "gfx-base/GFXCommandBuffer.h"

namespace cc {
namespace gfx {

struct CCWGPUCommandBufferObject;

typedef std::function<void(CCWGPUCommandBufferObject *)> EncodeFunc;

class CCWGPUCommandBuffer final : public CommandBuffer {
public:
    CCWGPUCommandBuffer();
    ~CCWGPUCommandBuffer();

    void begin(RenderPass *renderPass, uint32_t subpass, Framebuffer *frameBuffer) override;
    void end() override;
    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil, CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) override;
    void endRenderPass() override;
    void insertMarker(const MarkerInfo &marker) override;
    void beginMarker(const MarkerInfo &marker) override;
    void endMarker() override;
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
    void copyTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) override;

    void updateIndirectBuffer(Buffer *buff, const DrawInfoList &info);
    void resolveTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) override{};

    // TODO_Zeqiang: wgpu query pool
    void beginQuery(QueryPool *queryPool, uint32_t id) override{};
    void endQuery(QueryPool *queryPool, uint32_t id) override{};
    void resetQueryPool(QueryPool *queryPool) override{};
    void completeQueryPool(QueryPool *queryPool) override{};

    inline CCWGPUCommandBufferObject *gpuCommandBufferObject() const { return _gpuCommandBufferObj; }

    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const ColorList &colors, float depth, uint32_t stencil) {
        this->CommandBuffer::beginRenderPass(renderPass, fbo, renderArea, colors.data(), depth, stencil);
    }

    void reset();

    void bindDescriptorSet(uint32_t set, DescriptorSet *descriptorSet, const std::vector<uint32_t> &dynamicOffsets) {
        bindDescriptorSet(set, descriptorSet, dynamicOffsets.size(), dynamicOffsets.data());
    }

    // emscripten export
    EXPORT_EMS(
        void updateBuffer(Buffer *buff, const emscripten::val &v, uint32_t size);)

protected:
    void doInit(const CommandBufferInfo &info) override;
    void doDestroy() override;

    // delay binding.
    void bindStates();

    CCWGPUCommandBufferObject *_gpuCommandBufferObj = nullptr;

    RenderPass *_renderPass = nullptr;
    Framebuffer *_frameBuffer = nullptr;

    // first meet?
    std::set<void *> _attachmentSet;

    // command buffer inner impl
    // std::queue<EncodeFunc> _renderPassFuncQ;
    // std::queue<EncodeFunc> _computeFuncQ;
};

} // namespace gfx
} // namespace cc
