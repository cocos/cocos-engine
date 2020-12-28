#pragma once

#import <Metal/MTLPixelFormat.h>
#import <Metal/MTLRenderPass.h>
#import <Metal/MTLTexture.h>
#include "math/Vec2.h"

namespace cc {
namespace gfx {

class TextureView;

class CCMTLRenderPass : public RenderPass {
public:
    CCMTLRenderPass(Device *device);
    ~CCMTLRenderPass() = default;

    virtual bool initialize(const RenderPassInfo &info) override;
    virtual void destroy() override;

    void setColorAttachment(size_t slot, id<MTLTexture> texture, int level);
    void setDepthStencilAttachment(id<MTLTexture> texture, int level);

    CC_INLINE MTLRenderPassDescriptor *getMTLRenderPassDescriptor() const { return _mtlRenderPassDescriptor; }
    CC_INLINE size_t getColorRenderTargetNums() const { return _colorRenderTargetNums; }
    CC_INLINE const vector<Vec2> &getRenderTargetSizes() const { return _renderTargetSizes; }

private:
    MTLRenderPassDescriptor *_mtlRenderPassDescriptor = nil;
    size_t _colorRenderTargetNums = 0;
    vector<Vec2> _renderTargetSizes;
};

} // namespace gfx
} // namespace cc
