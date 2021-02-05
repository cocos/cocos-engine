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

#ifndef CC_GFXVULKAN_COMMAND_BUFFER_H_
#define CC_GFXVULKAN_COMMAND_BUFFER_H_

#include "VKCommands.h"

namespace cc {
namespace gfx {

class CC_VULKAN_API CCVKCommandBuffer final : public CommandBuffer {
public:
    CCVKCommandBuffer(Device *device);
    ~CCVKCommandBuffer();

    friend class CCVKQueue;

public:
    virtual bool initialize(const CommandBufferInfo &info) override;
    virtual void destroy() override;

    virtual void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) override;
    virtual void end() override;
    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const *secondaryCBs, uint secondaryCBCount) override;
    virtual void endRenderPass() override;
    virtual void bindPipelineState(PipelineState *pso) override;
    virtual void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) override;
    virtual void bindInputAssembler(InputAssembler *ia) override;
    virtual void setViewport(const Viewport &vp) override;
    virtual void setScissor(const Rect &rect) override;
    virtual void setLineWidth(float width) override;
    virtual void setDepthBias(float constant, float clamp, float slope) override;
    virtual void setBlendConstants(const Color &constants) override;
    virtual void setDepthBound(float minBounds, float maxBounds) override;
    virtual void setStencilWriteMask(StencilFace face, uint mask) override;
    virtual void setStencilCompareMask(StencilFace face, int reference, uint mask) override;
    virtual void draw(InputAssembler *ia) override;
    virtual void updateBuffer(Buffer *buffer, const void *data, uint size) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) override;
    virtual void blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint count, Filter filter) override;
    virtual void execute(CommandBuffer *const *cmdBuffs, uint count) override;
    virtual void dispatch(const DispatchInfo &info) override;
    virtual void pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint textureBarrierCount) override;

    CCVKGPUCommandBuffer *gpuCommandBuffer() const { return _gpuCommandBuffer; }

private:
    void bindDescriptorSets(VkPipelineBindPoint bindPoint);

    CCVKGPUCommandBuffer *_gpuCommandBuffer = nullptr;

    CCVKGPUPipelineState *_curGPUPipelineState = nullptr;
    vector<CCVKGPUDescriptorSet *> _curGPUDescriptorSets;
    vector<VkDescriptorSet> _curVkDescriptorSets;
    vector<uint> _curDynamicOffsets;
    vector<const uint *> _curDynamicOffsetPtrs;
    vector<uint> _curDynamicOffsetCounts;
    uint _firstDirtyDescriptorSet = UINT_MAX;

    CCVKGPUInputAssembler *_curGPUInputAssember = nullptr;
    CCVKGPUFramebuffer *_curGPUFBO = nullptr;

    Viewport _curViewport;
    Rect _curScissor;
    float _curLineWidth = 1.0f;
    CCVKDepthBias _curDepthBias;
    Color _curBlendConstants;
    CCVKDepthBounds _curDepthBounds;
    CCVKStencilWriteMask _curStencilWriteMask;
    CCVKStencilCompareMask _curStencilCompareMask;

    // temp storage
    vector<VkImageBlit> _blitRegions;
    vector<VkImageMemoryBarrier> _imageMemoryBarriers;
    vector<VkCommandBuffer> _vkCommandBuffers;

    queue<VkCommandBuffer> _pendingQueue;
};

} // namespace gfx
} // namespace cc

#endif
