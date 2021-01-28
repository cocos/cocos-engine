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

#include "MTLGPUObjects.h"

#import <Metal/MTLDepthStencil.h>
#import <Metal/MTLRenderPipeline.h>

namespace cc {
namespace gfx {

class CCMTLPipelineState final : public PipelineState {
public:
    explicit CCMTLPipelineState(Device *device);
    ~CCMTLPipelineState() override = default;
    CCMTLPipelineState(const CCMTLPipelineState &)=delete;
    CCMTLPipelineState(CCMTLPipelineState &&)=delete;
    CCMTLPipelineState &operator=(const CCMTLPipelineState &)=delete;
    CCMTLPipelineState &operator=(CCMTLPipelineState &&)=delete;

    bool initialize(const PipelineStateInfo &info) override;
    void destroy() override;

    CC_INLINE CCMTLGPUPipelineState *getGPUPipelineState() const { return _GPUPipelineState; }

private:
    bool createMTLDepthStencilState();
    bool createGPUPipelineState();
    bool createMTLRenderPipelineState();
    void setVertexDescriptor(MTLRenderPipelineDescriptor *);
    void setMTLFunctions(MTLRenderPipelineDescriptor *);
    void setFormats(MTLRenderPipelineDescriptor *);
    void setBlendStates(MTLRenderPipelineDescriptor *);
    bool createMTLRenderPipeline(MTLRenderPipelineDescriptor *);

private:
    id<MTLRenderPipelineState> _mtlRenderPipelineState = nil;
    id<MTLDepthStencilState> _mtlDepthStencilState = nil;
    CCMTLGPUPipelineState *_GPUPipelineState = nullptr;
};

} // namespace gfx
} // namespace cc
