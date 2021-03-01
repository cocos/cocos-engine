/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#ifndef CC_CORE_GFX_COMMAND_BUFFER_H_
#define CC_CORE_GFX_COMMAND_BUFFER_H_

#include "GFXObject.h"
#include "GFXBuffer.h"

namespace cc {
namespace gfx {

class CC_DLL CommandBuffer : public GFXObject {
public:
    CommandBuffer(Device *device);
    virtual ~CommandBuffer();

public:
    virtual bool initialize(const CommandBufferInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) = 0;
    virtual void end() = 0;
    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const *secondaryCBs, uint secondaryCBCount) = 0;
    virtual void endRenderPass() = 0;
    virtual void bindPipelineState(PipelineState *pso) = 0;
    virtual void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) = 0;
    virtual void bindInputAssembler(InputAssembler *ia) = 0;
    virtual void setViewport(const Viewport &vp) = 0;
    virtual void setScissor(const Rect &rect) = 0;
    virtual void setLineWidth(float width) = 0;
    virtual void setDepthBias(float constant, float clamp, float slope) = 0;
    virtual void setBlendConstants(const Color &constants) = 0;
    virtual void setDepthBound(float minBounds, float maxBounds) = 0;
    virtual void setStencilWriteMask(StencilFace face, uint mask) = 0;
    virtual void setStencilCompareMask(StencilFace face, int ref, uint mask) = 0;
    virtual void draw(InputAssembler *ia) = 0;
    virtual void updateBuffer(Buffer *buff, const void *data, uint size) = 0;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) = 0;
    virtual void blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint count, Filter filter) = 0;
    virtual void execute(CommandBuffer *const *cmdBuffs, uint32_t count) = 0;
    virtual void dispatch(const DispatchInfo &info) = 0;
    virtual void pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint textureBarrierCount) = 0;

    CC_INLINE void begin() { begin(nullptr, 0, nullptr); }
    // secondary command buffer specifics
    CC_INLINE void begin(RenderPass *renderPass) { begin(renderPass, 0, nullptr); }
    CC_INLINE void begin(RenderPass *renderPass, uint subpass) { begin(renderPass, subpass, nullptr); }

    CC_INLINE void updateBuffer(Buffer *buff, const void *data) { updateBuffer(buff, data, buff->getSize()); }
    CC_INLINE void execute(CommandBufferList &cmdBuffs, uint32_t count) { execute(cmdBuffs.data(), count); }
    CC_INLINE void bindDescriptorSet(uint set, DescriptorSet *descriptorSet) { bindDescriptorSet(set, descriptorSet, 0, nullptr); }
    CC_INLINE void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, const vector<uint> &dynamicOffsets) {
        bindDescriptorSet(set, descriptorSet, static_cast<uint>(dynamicOffsets.size()), dynamicOffsets.data());
    }
    CC_INLINE void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const ColorList &colors, float depth, int stencil, const CommandBufferList &secondaryCBs) {
        beginRenderPass(renderPass, fbo, renderArea, colors.data(), depth, stencil, secondaryCBs.data(), secondaryCBs.size());
    }
    CC_INLINE void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const ColorList &colors, float depth, int stencil) {
        beginRenderPass(renderPass, fbo, renderArea, colors.data(), depth, stencil, nullptr, 0);
    }
    CC_INLINE void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) {
        beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil, nullptr, 0);
    }
    CC_INLINE void copyBuffersToTexture(const BufferDataList &buffers, Texture *texture, const BufferTextureCopyList &regions) {
        copyBuffersToTexture(buffers.data(), texture, regions.data(), static_cast<uint>(regions.size()));
    }
    CC_INLINE void blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlitList &regions, Filter filter) {
        blitTexture(srcTexture, dstTexture, regions.data(), regions.size(), filter);
    }
    CC_INLINE void pipelineBarrier(const GlobalBarrier *barrier) { pipelineBarrier(barrier, nullptr, nullptr, 0u); }
    CC_INLINE void pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrierList &textureBarriers, const TextureList &textures) {
        pipelineBarrier(barrier, textureBarriers.data(), textures.data(), textureBarriers.size());
    }

    CC_INLINE void bindDescriptorSetForJS(uint set, DescriptorSet *descriptorSet) {
        bindDescriptorSet(set, descriptorSet, 0, nullptr);
    }
    CC_INLINE void bindDescriptorSetForJS(uint set, DescriptorSet *descriptorSet, const vector<uint> &dynamicOffsets) {
        bindDescriptorSet(set, descriptorSet, static_cast<uint>(dynamicOffsets.size()), dynamicOffsets.data());
    }
    CC_INLINE void beginRenderPassForJS(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const ColorList &colors, float depth, int stencil, const CommandBufferList &secondaryCBs) {
        beginRenderPass(renderPass, fbo, renderArea, colors.data(), depth, stencil, secondaryCBs.data(), secondaryCBs.size());
    }
    CC_INLINE void beginRenderPassForJS(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const ColorList &colors, float depth, int stencil) {
        beginRenderPass(renderPass, fbo, renderArea, colors.data(), depth, stencil, nullptr, 0);
    }

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE Queue *getQueue() const { return _queue; }
    CC_INLINE CommandBufferType getType() const { return _type; }

    virtual uint getNumDrawCalls() const { return _numDrawCalls; }
    virtual uint getNumInstances() const { return _numInstances; }
    virtual uint getNumTris() const { return _numTriangles; }

protected:
    Device *_device = nullptr;
    Queue *_queue = nullptr;
    CommandBufferType _type = CommandBufferType::PRIMARY;

    uint32_t _numDrawCalls = 0;
    uint32_t _numInstances = 0;
    uint32_t _numTriangles = 0;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_COMMAND_ALLOCATOR_H_
