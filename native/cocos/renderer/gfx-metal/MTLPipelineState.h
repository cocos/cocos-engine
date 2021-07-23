/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "gfx-base/GFXPipelineState.h"

#include "MTLGPUObjects.h"

#import <Metal/MTLDepthStencil.h>
#import <Metal/MTLRenderPipeline.h>

namespace cc {
namespace gfx {

class CCMTLPipelineState final : public PipelineState {
public:
    explicit CCMTLPipelineState();
    ~CCMTLPipelineState();
    CCMTLPipelineState(const CCMTLPipelineState &)=delete;
    CCMTLPipelineState(CCMTLPipelineState &&)=delete;
    CCMTLPipelineState &operator=(const CCMTLPipelineState &)=delete;
    CCMTLPipelineState &operator=(CCMTLPipelineState &&)=delete;

    inline CCMTLGPUPipelineState *getGPUPipelineState() const { return _GPUPipelineState; }
    
    void check();

protected:
    void doInit(const PipelineStateInfo &info) override;
    void doDestroy() override;

    bool initRenderPipeline();
    bool createMTLDepthStencilState();
    bool createGPUPipelineState();
    bool createMTLComputePipelineState();
    bool createMTLRenderPipelineState();
    void setVertexDescriptor(MTLRenderPipelineDescriptor *);
    void setMTLFunctionsAndFormats(MTLRenderPipelineDescriptor *);
    void setBlendStates(MTLRenderPipelineDescriptor *);
    bool createMTLRenderPipeline(MTLRenderPipelineDescriptor *);

    bool _renderPipelineReady = false;
    id<MTLRenderPipelineState> _mtlRenderPipelineState = nil;
    id<MTLDepthStencilState> _mtlDepthStencilState = nil;
    id<MTLComputePipelineState> _mtlComputePipeline = nil;
    CCMTLGPUPipelineState *_GPUPipelineState = nullptr;
};

} // namespace gfx
} // namespace cc
