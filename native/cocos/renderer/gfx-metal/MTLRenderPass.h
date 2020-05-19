#pragma once

#import <Metal/MTLRenderPass.h>
#import <Metal/MTLPixelFormat.h>
#import <Metal/MTLTexture.h>

NS_CC_BEGIN

class GFXTextureView;

class CCMTLRenderPass : public GFXRenderPass
{
public:
    CCMTLRenderPass(GFXDevice* device);
    ~CCMTLRenderPass();
    
    virtual bool initialize(const GFXRenderPassInfo& info) override;
    virtual void destroy() override;
    
    void setColorAttachment(id<MTLTexture> texture, size_t slot);
    void setDepthStencilAttachment(id<MTLTexture> texture);
    
    CC_INLINE MTLRenderPassDescriptor* getMTLRenderPassDescriptor() const { return _mtlRenderPassDescriptor; }
    CC_INLINE size_t getColorRenderTargetNums() const { return _colorRenderTargetNums; }
    
private:
    MTLRenderPassDescriptor* _mtlRenderPassDescriptor = nil;
    size_t _colorRenderTargetNums = 0;
};

NS_CC_END
