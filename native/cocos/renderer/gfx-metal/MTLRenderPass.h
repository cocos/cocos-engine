/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#pragma once

#import <Metal/MTLPixelFormat.h>
#import <Metal/MTLRenderPass.h>
#import <Metal/MTLTexture.h>
#include "math/Vec2.h"

namespace cc {
namespace gfx {

class CCMTLRenderPass final : public RenderPass {
public:
    explicit CCMTLRenderPass(Device *device);
    ~CCMTLRenderPass() override = default;

    bool initialize(const RenderPassInfo &info) override;
    void destroy() override;

    void setColorAttachment(size_t slot, id<MTLTexture> texture, int level);
    void setDepthStencilAttachment(id<MTLTexture> texture, int level);

    CC_INLINE MTLRenderPassDescriptor *getMTLRenderPassDescriptor() const { return _mtlRenderPassDescriptor; }
    CC_INLINE uint getColorRenderTargetNums() const { return _colorRenderTargetNums; }
    CC_INLINE const vector<Vec2> &getRenderTargetSizes() const { return _renderTargetSizes; }

private:
    MTLRenderPassDescriptor *_mtlRenderPassDescriptor = nil;
    uint _colorRenderTargetNums = 0;
    vector<Vec2> _renderTargetSizes;
};

} // namespace gfx
} // namespace cc
