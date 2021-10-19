/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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

#include "VKCommands.h"

namespace cc {
namespace gfx {

class CC_VULKAN_API CCVKCommandBuffer final : public CommandBuffer {
public:
    CCVKCommandBuffer();
    ~CCVKCommandBuffer() override;

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
    void setStencilCompareMask(StencilFace face, uint32_t reference, uint32_t mask) override;
    void nextSubpass() override;
    void draw(const DrawInfo &info) override;
    void updateBuffer(Buffer *buffer, const void *data, uint32_t size) override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) override;
    void blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) override;
    void execute(CommandBuffer *const *cmdBuffs, uint32_t count) override;
    void dispatch(const DispatchInfo &info) override;
    void pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint32_t textureBarrierCount) override;
    void beginQuery(QueryPool *queryPool, uint32_t id) override;
    void endQuery(QueryPool *queryPool, uint32_t id) override;
    void resetQuery(QueryPool *queryPool) override;
    void completeQuery(QueryPool *queryPool) override {}

    CCVKGPUCommandBuffer *gpuCommandBuffer() const { return _gpuCommandBuffer; }

protected:
    friend class CCVKQueue;

    void doInit(const CommandBufferInfo &info) override;
    void doDestroy() override;

    void bindDescriptorSets(VkPipelineBindPoint bindPoint);

    CCVKGPUCommandBuffer *_gpuCommandBuffer = nullptr;

    CCVKGPUPipelineState *         _curGPUPipelineState = nullptr;
    vector<CCVKGPUDescriptorSet *> _curGPUDescriptorSets;
    vector<VkDescriptorSet>        _curVkDescriptorSets;
    vector<uint32_t>               _curDynamicOffsets;
    vector<vector<uint32_t>>       _curDynamicOffsetsArray;
    uint32_t                       _firstDirtyDescriptorSet = UINT_MAX;

    CCVKGPUInputAssembler *_curGPUInputAssember = nullptr;
    CCVKGPUFramebuffer *   _curGPUFBO           = nullptr;

    bool _secondaryRP = false;

    DynamicStates _curDynamicStates;

    // temp storage
    vector<VkImageBlit>          _blitRegions;
    vector<VkImageMemoryBarrier> _imageMemoryBarriers;
    vector<VkCommandBuffer>      _vkCommandBuffers;

    queue<VkCommandBuffer> _pendingQueue;
};

} // namespace gfx
} // namespace cc
