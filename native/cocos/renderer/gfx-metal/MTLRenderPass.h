#pragma once

#import <Metal/MTLPixelFormat.h>
#import <Metal/MTLRenderPass.h>
#import <Metal/MTLTexture.h>

namespace cc {
namespace gfx {

class TextureView;

class CCMTLRenderPass : public RenderPass {
public:
    CCMTLRenderPass(Device *device);
    ~CCMTLRenderPass();

    virtual bool initialize(const RenderPassInfo &info) override;
    virtual void destroy() override;

    void setColorAttachment(size_t slot, id<MTLTexture> texture, int level);
    void setDepthStencilAttachment(id<MTLTexture> texture, int level);

    CC_INLINE MTLRenderPassDescriptor *getMTLRenderPassDescriptor() const { return _mtlRenderPassDescriptor; }
    CC_INLINE size_t getColorRenderTargetNums() const { return _colorRenderTargetNums; }
    CC_INLINE uint getRenderTargetWidth() const { return _renderTargetWidth; }
    CC_INLINE uint getRenderTargetHeight() const { return _renderTargetHeight; }

private:
    MTLRenderPassDescriptor *_mtlRenderPassDescriptor = nil;
    size_t _colorRenderTargetNums = 0;
    uint _renderTargetWidth = 0;
    uint _renderTargetHeight = 0;
};

} // namespace gfx
} // namespace cc
