#pragma once

#include "gfx-gles-new/GLESCore.h"
#include "gfx-gles-new/GLESRenderPass.h"
#include "gfx-gles-new/GLESFramebuffer.h"
#include "gfx-gles-new/GLESBuffer.h"
#include "gfx-gles-new/GLESTexture.h"
#include "gfx-gles-new/GLESPipelineState.h"
#include "gfx-gles-new/GLESInputAssembler.h"
#include "gfx-gles-new/GLESDescriptorSet.h"

namespace cc::gfx::gles {
struct PassBeginInfo {
    Color *clearColors    = nullptr;
    float clearDepth      = 1.f;
    uint32_t clearStencil = 0;
    Rect renderArea       = {};
    IntrusivePtr<GPUFramebuffer> framebuffer;
};

struct DescriptorBindInfo {
    IntrusivePtr<GPUDescriptorSet> descriptorSet;
    uint32_t  dynamicCount   = 0;
    uint32_t *dynamicOffsets = nullptr;
};

class Commands {
public:
    Commands() = default;
    ~Commands() = default;

    // common commands
    void bindPipelineState(const IntrusivePtr<GPUPipelineState> &pso);
    void bindDescriptorSet(uint32_t set, const DescriptorBindInfo &bindInfo);

    // pass scope
    void beginRenderPass(const PassBeginInfo &beginInfo);
    void endRenderPass();
    void nextSubpass();

    // ia
    void bindInputAssembler(const IntrusivePtr<GPUInputAssembler> &ia);

    // draw
    void draw(const DrawInfo &info);

    // graphics dynamic commands
    void setViewport(const Viewport &vp);
    void setScissor(const Rect &rect);

    // depth stencil
    void setDepthBias(float constant, float clamp, float slope);
    void setDepthBound(float minBounds, float maxBounds);
    void setStencilWriteMask(StencilFace face, uint32_t mask);
    void setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask);
    void setStencilFunc(StencilFace face, GLenum func, uint32_t ref, uint32_t mask);
    void setStencilOp(StencilFace face, GLenum sFail, GLenum dpFail, GLenum dpPass);
    void setDepthStencil(const DepthStencilState &depthState);

    // rasterizer
    void setRasterizerState(const RasterizerState &rs);
    void setLineWidth(float width);

    // blend
    void setBlendConstants(const Color &constants);
    void setBlendState(const BlendState &bs);

    // compute commands
    void dispatch(uint32_t groupX, uint32_t groupY, uint32_t groupZ);

    // transfer
    void updateBuffer(const IntrusivePtr<GPUBufferView> &buffer, uint8_t *ptr, uint32_t size);

    void attachContext(ContextState *ctx) { _context = ctx; }
private:
    void beginPassInternal();
    void endPassInternal();
    void bindVertexInternal();

    ContextState *_context = nullptr;
    ConstPtr<GPUInputAssembler> _currentIa;
    ConstPtr<GPUFramebuffer> _currentFb;
    ConstPtr<GPUPipelineState> _currentPso;
    Color *_clearColors    = nullptr;
    float _clearDepth      = 1.f;
    GLint _clearStencil    = 0;
    uint32_t _subPassIndex = 0;
    ccstd::vector<GLenum> _invalidAttachments;
    ccstd::vector<DescriptorBindInfo> _boundSets;
};


} // namespace cc::gfx::gles
