/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "gfx-base/GFXRenderPass.h"

#import <Metal/MTLPixelFormat.h>
#import <Metal/MTLRenderPass.h>
#import <Metal/MTLTexture.h>
#include "math/Vec2.h"

namespace cc {
namespace gfx {

class CCMTLTexture;

class CCMTLRenderPass final : public RenderPass {
public:
    explicit CCMTLRenderPass();
    ~CCMTLRenderPass();

    using BufferList = ccstd::vector<uint32_t>; // offset to draw buffer, also means [[color(N)]] of input

    void setColorAttachment(size_t slot, CCMTLTexture *texture, int level);
    void setDepthStencilAttachment(CCMTLTexture *texture, int level);

    inline MTLRenderPassDescriptor *getMTLRenderPassDescriptor() const { return _mtlRenderPassDescriptor; }
    inline uint32_t getColorRenderTargetNums() const { return _colorRenderTargetNums; }
    inline const ccstd::vector<Vec2> &getRenderTargetSizes() const { return _renderTargetSizes; }
    inline void nextSubpass() { _currentSubpassIndex++; }
    inline uint32_t getCurrentSubpassIndex() { return _currentSubpassIndex; }
    inline void reset() { _currentSubpassIndex = 0; }
    inline const BufferList &getDrawBuffer(uint32_t subPassIndex) { return _drawBuffers[subPassIndex]; }
    inline const BufferList &getReadBuffer(uint32_t subPassIndex) { return _readBuffers[subPassIndex]; }

protected:
    void doInit(const RenderPassInfo &info) override;
    void doDestroy() override;

    uint32_t _currentSubpassIndex = 0;
    MTLRenderPassDescriptor *_mtlRenderPassDescriptor = nil;
    uint32_t _colorRenderTargetNums = 0;
    ccstd::vector<Vec2> _renderTargetSizes;
    ccstd::vector<BufferList> _drawBuffers;
    ccstd::vector<BufferList> _readBuffers;
    ccstd::vector<uint32_t> _colorIndices; // attachment index to draw buffer index
};

} // namespace gfx
} // namespace cc
