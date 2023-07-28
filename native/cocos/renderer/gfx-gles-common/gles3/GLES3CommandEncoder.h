#pragma once

#include "base/std/container/array.h"
#include "gfx-gles-common/common/GLESCommandEncoder.h"

namespace cc::gfx {
struct GLESGPUFramebuffer;
struct GLESGPURenderPass;

class GLES3CommandEncoder : public GLESCommandEncoder {
public:
    GLES3CommandEncoder() = default;
    ~GLES3CommandEncoder() override = default;

    static constexpr uint32_t MAX_SET = 4;

    void beginRenderPass(const PassBeginInfo &beginInfo) override;
    void endRenderPass() override;
    void nextSubPass() override;
    void bindPipelineState(GLESGPUPipelineState *pso) override;
    void bindDescriptorSet(uint32_t setID, const DescriptorBindInfo &bindInfo) override;
    void bindInputAssembler(GLESGPUInputAssembler *ia) override;
    void setViewport(const Viewport &vp) override;
    void setScissor(const Rect &rect) override;
    void setLineWidth(float width) override;
    void setDepthBias(float constant, float clamp, float slope) override;
    void setBlendConstants(const Color &constants) override;
    void setDepthBound(float minBounds, float maxBounds) override;
    void setStencilWriteMask(StencilFace face, uint32_t mask) override;
    void setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) override;
    void draw(const DrawInfo &drawInfo) override;
    void drawIndirect() override;
    void drawIndexedIndirect() override;
    void dispatch(uint32_t x, uint32_t y, uint32_t z) override;
    void dispatchIndirect(GLESGPUBuffer *buffer, uint32_t offset) override;
    void updateBuffer(GLESGPUBuffer *buffer, const void *data, uint32_t size) override;
    void begin(GLESGPUFence *waitFence) override;
    void end(GLESGPUFence *signalFence) override;

    // invoke only main thread.
    void attachContext(egl::Context *context, GLESGPUStateCache *cacheState) override;
private:
    void bindDescriptorSets();

    egl::Context *_context = nullptr;
    GLESGPUStateCache *_cacheState = nullptr;

    uint32_t _curSubPassIdx = 0;
    GLESGPUInputAssembler *_currentIA = nullptr;
    GLESGPUPipelineState *_currentPipelineState = nullptr;
    GLESGPUFramebuffer *_currentFramebuffer = nullptr;
    const GLESGPURenderPass *_currentRenderPass = nullptr;
    DynamicStates _curDynamicStates;

    ccstd::array<ccstd::vector<uint32_t>, MAX_SET> _dynamicOffsets;
    ccstd::array<GLESGPUDescriptorSet *, MAX_SET> _descriptorSets;
};
} // namespace cc::gfx
