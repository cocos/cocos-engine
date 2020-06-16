#ifndef CC_CORE_GFX_COMMAND_BUFFER_H_
#define CC_CORE_GFX_COMMAND_BUFFER_H_

#include "GFXDef.h"

namespace cc {

class CC_CORE_API GFXCommandBuffer : public GFXObject {
public:
    GFXCommandBuffer(GFXDevice *device);
    virtual ~GFXCommandBuffer();

public:
    virtual bool initialize(const GFXCommandBufferInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void begin(GFXRenderPass *renderPass = nullptr, uint subpass = 0, GFXFramebuffer *frameBuffer = nullptr) = 0;
    virtual void end() = 0;
    virtual void beginRenderPass(GFXFramebuffer *fbo, const GFXRect &render_area, GFXClearFlags clear_flags, const std::vector<GFXColor> &colors, float depth, int stencil) = 0;
    virtual void endRenderPass() = 0;
    virtual void bindPipelineState(GFXPipelineState *pso) = 0;
    virtual void bindBindingLayout(GFXBindingLayout *layout) = 0;
    virtual void bindInputAssembler(GFXInputAssembler *ia) = 0;
    virtual void setViewport(const GFXViewport &vp) = 0;
    virtual void setScissor(const GFXRect &rect) = 0;
    virtual void setLineWidth(const float width) = 0;
    virtual void setDepthBias(float constant, float clamp, float slope) = 0;
    virtual void setBlendConstants(const GFXColor &constants) = 0;
    virtual void setDepthBound(float min_bounds, float max_bounds) = 0;
    virtual void setStencilWriteMask(GFXStencilFace face, uint mask) = 0;
    virtual void setStencilCompareMask(GFXStencilFace face, int ref, uint mask) = 0;
    virtual void draw(GFXInputAssembler *ia) = 0;
    virtual void updateBuffer(GFXBuffer *buff, void *data, uint size, uint offset = 0) = 0;
    virtual void copyBufferToTexture(GFXBuffer *src, GFXTexture *dst, GFXTextureLayout layout, const GFXBufferTextureCopyList &regions) = 0;
    virtual void execute(const std::vector<GFXCommandBuffer *> &cmd_buffs, uint32_t count) = 0;

    CC_INLINE GFXDevice *getDevice() const { return _device; }
    CC_INLINE GFXCommandAllocator *getAllocator() const { return _allocator; }
    CC_INLINE GFXCommandBufferType getType() const { return _type; }
    CC_INLINE uint getNumDrawCalls() const { return _numDrawCalls; }
    CC_INLINE uint getNumInstances() const { return _numInstances; }
    CC_INLINE uint getNumTris() const { return _numTriangles; }

protected:
    GFXDevice *_device = nullptr;
    GFXCommandAllocator *_allocator = nullptr;
    GFXCommandBufferType _type = GFXCommandBufferType::PRIMARY;
    uint32_t _numDrawCalls = 0;
    uint32_t _numInstances = 0;
    uint32_t _numTriangles = 0;
};

}

#endif // CC_CORE_GFX_COMMAND_ALLOCATOR_H_
