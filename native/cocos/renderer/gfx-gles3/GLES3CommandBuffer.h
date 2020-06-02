#ifndef CC_GFXGLES3_GLES3_COMMAND_BUFFER_H_
#define CC_GFXGLES3_GLES3_COMMAND_BUFFER_H_

#include "GLES3Commands.h"

NS_CC_BEGIN

class GLES3CommandAllocator;

class CC_GLES3_API GLES3CommandBuffer : public GFXCommandBuffer {
    friend class GLES3Queue;
public:
    GLES3CommandBuffer(GFXDevice* device);
    ~GLES3CommandBuffer();
  
public:
    virtual bool initialize(const GFXCommandBufferInfo& info) override;
    virtual void destroy() override;

    virtual void begin(GFXRenderPass* renderPass = nullptr, uint subpass = 0, GFXFramebuffer* frameBuffer = nullptr) override;
    virtual void end() override;
    virtual void beginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, const std::vector<GFXColor>& colors, float depth, int stencil) override;
    virtual void endRenderPass() override;
    virtual void bindPipelineState(GFXPipelineState* pso) override;
    virtual void bindBindingLayout(GFXBindingLayout* layout) override;
    virtual void bindInputAssembler(GFXInputAssembler* ia) override;
    virtual void setViewport(const GFXViewport& vp) override;
    virtual void setScissor(const GFXRect& rect) override;
    virtual void setLineWidth(const float width) override;
    virtual void setDepthBias(float constant, float clamp, float slope) override;
    virtual void setBlendConstants(const GFXColor& constants) override;
    virtual void setDepthBound(float min_bounds, float max_bounds) override;
    virtual void setStencilWriteMask(GFXStencilFace face, uint mask) override;
    virtual void setStencilCompareMask(GFXStencilFace face, int ref, uint mask) override;
    virtual void draw(GFXInputAssembler* ia) override;
    virtual void updateBuffer(GFXBuffer* buff, void* data, uint size, uint offset) override;
    virtual void copyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, const GFXBufferTextureCopyList& regions) override;
    virtual void execute(const std::vector<GFXCommandBuffer*>& cmd_buffs, uint32_t count) override;
  
private:
    void BindStates();
  
private:
    GLES3CmdPackage* _cmdPackage = nullptr;
    GLES3CommandAllocator* _gles3Allocator = nullptr;
    bool _isInRenderPass = false;
    GLES3GPUPipelineState* _curGPUPipelineState = nullptr;
    GLES3GPUBindingLayout* _curGPUBlendLayout = nullptr;
    GLES3GPUInputAssembler* _curGPUInputAssember = nullptr;
    GFXViewport _curViewport;
    GFXRect _curScissor;
    float _curLineWidth = 1.0f;
    GLES3DepthBias _curDepthBias;
    GFXColor _curBlendConstants;
    GLES3DepthBounds _curDepthBounds;
    GLES3StencilWriteMask _curStencilWriteMask;
    GLES3StencilCompareMask _curStencilCompareMask;
    bool _isStateInvalid = false;
};

NS_CC_END

#endif
