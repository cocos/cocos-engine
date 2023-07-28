#pragma once

#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {
namespace egl {
class Context;
} // namespace egl

struct PassBeginInfo {
    GLESGPUFramebuffer *framebuffer = nullptr;
    const Color *clearColors = nullptr;
    float clearDepth      = 1.F;
    uint32_t clearStencil = 0;
    Rect renderArea       = {};
};

struct DescriptorBindInfo {
    GLESGPUDescriptorSet *descriptorSet = nullptr;
    const uint32_t *dynamicOffsets = nullptr;
    uint32_t dynamicCount = 0;
};

class GLESCommandEncoder {
public:
    GLESCommandEncoder() = default;
    virtual ~GLESCommandEncoder() = default;

    virtual void beginRenderPass(const PassBeginInfo &beginInfo) {}
    virtual void endRenderPass() {}
    virtual void nextSubPass() {}
    virtual void bindPipelineState(GLESGPUPipelineState *pso) {}
    virtual void bindDescriptorSet(uint32_t setID, const DescriptorBindInfo &bindInfo) {}
    virtual void bindInputAssembler(GLESGPUInputAssembler *ia) {}
    virtual void setViewport(const Viewport &vp) {}
    virtual void setScissor(const Rect &rect) {}
    virtual void setLineWidth(float width) {}
    virtual void setDepthBias(float constant, float clamp, float slope) {}
    virtual void setBlendConstants(const Color &constants) {}
    virtual void setDepthBound(float minBounds, float maxBounds) {}
    virtual void setStencilWriteMask(StencilFace face, uint32_t mask) {}
    virtual void setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) {}
    virtual void draw(const DrawInfo &info) {}
    virtual void drawIndirect() {}
    virtual void drawIndexedIndirect() {}
    virtual void dispatch(uint32_t x, uint32_t y, uint32_t z) {}
    virtual void dispatchIndirect(GLESGPUBuffer *buffer, uint32_t offset) {}
    virtual void updateBuffer(GLESGPUBuffer *buffer, const void *data, uint32_t size) {}
    virtual void begin(GLESGPUFence *waitFence) {}
    virtual void end(GLESGPUFence *signalFence) {}

    virtual void attachContext(egl::Context *context, GLESGPUStateCache *cacheState) {}
};

} // namespace cc::gfx
