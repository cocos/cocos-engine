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
public:
    CCMTLCommandBuffer(GFXDevice* device);
    ~CCMTLCommandBuffer();
    
    virtual bool Initialize(const GFXCommandBufferInfo& info) override;
    virtual void Destroy() override;
    virtual void Begin() override;
    virtual void End() override;
    virtual void BeginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, GFXColor* colors, uint count, float depth, int stencil) override;
    virtual void EndRenderPass() override;
    virtual void BindPipelineState(GFXPipelineState* pso) override;
    virtual void BindBindingLayout(GFXBindingLayout* layout) override;
    virtual void BindInputAssembler(GFXInputAssembler* ia) override;
    virtual void SetViewport(const GFXViewport& vp) override;
    virtual void SetScissor(const GFXRect& rect) override;
    virtual void SetLineWidth(const float width) override;
    virtual void SetDepthBias(float constant, float clamp, float slope) override;
    virtual void SetBlendConstants(const GFXColor& constants) override;
    virtual void SetDepthBounds(float min_bounds, float max_bounds) override;
    virtual void SetStencilWriteMask(GFXStencilFace face, uint mask) override;
    virtual void SetStencilCompareMask(GFXStencilFace face, int ref, uint mask) override;
    virtual void Draw(GFXInputAssembler* ia) override;
    virtual void UpdateBuffer(GFXBuffer* buff, void* data, uint size, uint offset = 0) override;
    virtual void CopyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, GFXBufferTextureCopy* regions, uint count) override;
    virtual void Execute(GFXCommandBuffer** cmd_buffs, uint count) override;
    
    CC_INLINE const CCMTLCommandPackage* getCommandPackage() const { return _commandPackage; }
    
private:
    void bindStates();
    
private:
    CCMTLCommandPackage* _commandPackage = nullptr;
    CCMTLCommandAllocator* _MTLCommandAllocator = nullptr;
    bool _isInRenderPass = false;
    bool _isStateInValid = false;
    
    CCMTLGPUPipelineState* _currentGPUPipelineState = nullptr;
    CCMTLPipelineState* _currentPipelineState = nullptr;
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
