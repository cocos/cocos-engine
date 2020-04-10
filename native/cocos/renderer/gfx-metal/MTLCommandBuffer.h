#pragma once

NS_CC_BEGIN

class CCMTLCommandPackage;
class CCMTLCommandAllocator;
struct CCMTLDepthBias;
struct CCMTLGPUPipelineState;
class CCMTLInputAssembler;
class CCMTLPipelineState;
class CCMTLBindingLayout;

class CCMTLCommandBuffer : public GFXCommandBuffer
{
    friend class CCMTLQueue;
public:
    CCMTLCommandBuffer(GFXDevice* device);
    ~CCMTLCommandBuffer();
    
    virtual bool initialize(const GFXCommandBufferInfo& info) override;
    virtual void destroy() override;
    virtual void begin() override;
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
    virtual void updateBuffer(GFXBuffer* buff, void* data, uint size, uint offset = 0) override;
    virtual void copyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, const GFXBufferTextureCopyList& regions) override;
    virtual void execute(const std::vector<GFXCommandBuffer*>& cmd_buffs, uint32_t count) override;
    
    CC_INLINE const CCMTLCommandPackage* getCommandPackage() const { return _commandPackage; }
    
private:
    void bindStates();
    
private:
    CCMTLCommandPackage* _commandPackage = nullptr;
    CCMTLCommandAllocator* _MTLCommandAllocator = nullptr;
    bool _isInRenderPass = false;
    bool _isStateInValid = false;
    
    CCMTLPipelineState* _currentPipelineState = nullptr;
    bool _needToRebindPipelineState = false;
    CCMTLInputAssembler* _currentInputAssembler = nullptr;
    CCMTLBindingLayout* _currentBindingLayout = nullptr;
    bool _isViewportDirty = false;
    GFXViewport _currentViewport;
    bool _isScissorDirty = false;
    GFXRect _currentScissor;
    // Just don't want to include "Commands.h", because "Commands.h" includes Objective-C codes.
    CCMTLDepthBias* _currentDepthBias = nullptr;
};

NS_CC_END
