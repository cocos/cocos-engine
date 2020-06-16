#pragma once

#import <Metal/MTLRenderPass.h>
#import <Metal/MTLPixelFormat.h>
#import <Metal/MTLTexture.h>

namespace cc {

class GFXTextureView;

class CCMTLRenderPass : public GFXRenderPass {
public:
    CCMTLRenderPass(GFXDevice *device);
    ~CCMTLRenderPass();

    virtual bool initialize(const GFXRenderPassInfo &info) override;
    virtual void destroy() override;

    void setColorAttachment(size_t slot, id<MTLTexture> texture, int level);
    void setDepthStencilAttachment(id<MTLTexture> texture, int level);

    CC_INLINE MTLRenderPassDescriptor *getMTLRenderPassDescriptor() const { return _mtlRenderPassDescriptor; }
    CC_INLINE size_t getColorRenderTargetNums() const { return _colorRenderTargetNums; }

private:
    MTLRenderPassDescriptor *_mtlRenderPassDescriptor = nil;
    size_t _colorRenderTargetNums = 0;
};

}
