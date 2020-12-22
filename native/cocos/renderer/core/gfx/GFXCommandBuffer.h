#ifndef CC_CORE_GFX_COMMAND_BUFFER_H_
#define CC_CORE_GFX_COMMAND_BUFFER_H_

#include "GFXDef.h"
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
    virtual void begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer, int submitIndex) = 0;
    virtual void end() = 0;
    virtual void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, const CommandBuffer *const *cmdBuffs, uint32_t count) = 0;
    virtual void endRenderPass() = 0;
    virtual void bindPipelineState(PipelineState *pso) = 0;
    virtual void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) = 0;
    virtual void bindInputAssembler(InputAssembler *ia) = 0;
    virtual void setViewport(const Viewport &vp) = 0;
    virtual void setScissor(const Rect &rect) = 0;
    virtual void setLineWidth(const float width) = 0;
    virtual void setDepthBias(float constant, float clamp, float slope) = 0;
    virtual void setBlendConstants(const Color &constants) = 0;
    virtual void setDepthBound(float minBounds, float maxBounds) = 0;
    virtual void setStencilWriteMask(StencilFace face, uint mask) = 0;
    virtual void setStencilCompareMask(StencilFace face, int ref, uint mask) = 0;
    virtual void draw(InputAssembler *ia) = 0;
    virtual void updateBuffer(Buffer *buff, const void *data, uint size) = 0;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) = 0;
    virtual void execute(const CommandBuffer *const *cmdBuffs, uint32_t count) = 0;

    CC_INLINE void begin() { begin(nullptr, 0, nullptr, -1); }
    CC_INLINE void begin(int submitIndex) { begin(nullptr, 0, nullptr, submitIndex); }
    // secondary command buffer specifics
    CC_INLINE void begin(RenderPass *renderPass, uint subpass = 0, Framebuffer *frameBuffer = nullptr) { begin(renderPass, subpass, frameBuffer, -1); }
    CC_INLINE void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) {
        beginRenderPass(renderPass, fbo, renderArea, colors, depth, stencil, nullptr, 0);
    }
    CC_INLINE void beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const ColorList &colors, float depth, int stencil, const CommandBuffer *const *cmdBuffs = nullptr, uint32_t count = 0) {
        beginRenderPass(renderPass, fbo, renderArea, colors.data(), depth, stencil, cmdBuffs, count);
    }
    CC_INLINE void execute(const CommandBufferList &cmdBuffs, uint32_t count) { execute(cmdBuffs.data(), count); }

    CC_INLINE void updateBuffer(Buffer *buff, const void *data) { updateBuffer(buff, data, buff->getSize()); }
    CC_INLINE void bindDescriptorSet(uint set, DescriptorSet *descriptorSet) { bindDescriptorSet(set, descriptorSet, 0, {}); }
    CC_INLINE void bindDescriptorSet(uint set, DescriptorSet *descriptorSet, const vector<uint> &dynamicOffsets) {
        bindDescriptorSet(set, descriptorSet, static_cast<uint>(dynamicOffsets.size()), dynamicOffsets.data());
    }
    CC_INLINE void copyBuffersToTexture(const BufferDataList &buffers, Texture *texture, const BufferTextureCopyList &regions) {
        copyBuffersToTexture(buffers.data(), texture, regions.data(), static_cast<uint>(regions.size()));
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
