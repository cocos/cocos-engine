#pragma once

NS_CC_BEGIN

class CCMTLCommandPackage;
class CCMTLCommandAllocator;

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
    // Just for convenient.
    CCMTLCommandAllocator* _MTLCommandAllocator = nullptr;
    bool _isStateInvalid = false;
    bool _isInRenderPass = false;
};

NS_CC_END
