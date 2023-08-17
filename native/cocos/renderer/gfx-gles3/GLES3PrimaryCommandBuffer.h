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

#include "GLES3CommandBuffer.h"

namespace cc {
namespace gfx {

class CC_GLES3_API GLES3PrimaryCommandBuffer final : public GLES3CommandBuffer {
public:
    GLES3PrimaryCommandBuffer() = default;
    ~GLES3PrimaryCommandBuffer() override;

    void begin(RenderPass *renderPass, uint32_t subpass, Framebuffer *frameBuffer) override;
    void end() override;
    void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil, CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) override;
    void endRenderPass() override;
    void nextSubpass() override;
    void insertMarker(const MarkerInfo &marker) override;
    void beginMarker(const MarkerInfo &marker) override;
    void endMarker() override;
    void draw(const DrawInfo &info) override;
    void setViewport(const Viewport &vp) override;
    void setScissor(const Rect &rect) override;
    void updateBuffer(Buffer *buff, const void *data, uint32_t size) override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) override;
    void execute(CommandBuffer *const *cmdBuffs, uint32_t count) override;
    void dispatch(const DispatchInfo &info) override;
    void pipelineBarrier(const GeneralBarrier *barrier, const BufferBarrier *const *bufferBarriers, const Buffer *const * /*buffers*/, uint32_t bufferBarrierCount, const TextureBarrier *const *textureBarriers, const Texture *const * /*textures*/, uint32_t textureBarrierCount) override;
    void blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) override;
    void copyTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) override;
    void resolveTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) override;
    void beginQuery(QueryPool *queryPool, uint32_t id) override;
    void endQuery(QueryPool *queryPool, uint32_t id) override;
    void resetQueryPool(QueryPool *queryPool) override;

protected:
    friend class GLES3Queue;
    friend class GLES3QueryPool;

    void getQueryPoolResults(QueryPool *query) override;

    void bindStates() override;
};

} // namespace gfx
} // namespace cc
