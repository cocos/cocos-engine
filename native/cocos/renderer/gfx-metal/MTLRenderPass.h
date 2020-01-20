#pragma once

#import <Metal/MTLRenderPass.h>
#import <Metal/MTLPixelFormat.h>

NS_CC_BEGIN

class CCMTLRenderPass : public GFXRenderPass
{
public:
    CCMTLRenderPass(GFXDevice* device);
    ~CCMTLRenderPass();
    
    virtual bool Initialize(const GFXRenderPassInfo& info) override;
    virtual void destroy() override;
    
    CC_INLINE MTLRenderPassDescriptor* getMTLRenderPassDescriptor() const { return _mtlRenderPassDescriptor; }
    
private:
    MTLRenderPassDescriptor* _mtlRenderPassDescriptor = nil;
};

NS_CC_END
