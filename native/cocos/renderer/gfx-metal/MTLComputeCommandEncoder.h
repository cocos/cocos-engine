/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include <Metal/MTLComputeCommandEncoder.h>
#include <Metal/MTLComputePipeline.h>
#include "MTLCommandEncoder.h"
#include "MTLStd.h"
#include "MTLUtils.h"
#include "base/Macros.h"
#include "math/Math.h"

namespace cc {
namespace gfx {
class CCMTLComputeCommandEncoder final : public CCMTLCommandEncoder {
public:
    CCMTLComputeCommandEncoder()                                   = default;
    ~CCMTLComputeCommandEncoder()                                  = default;
    CCMTLComputeCommandEncoder(const CCMTLComputeCommandEncoder &) = delete;
    CCMTLComputeCommandEncoder(CCMTLComputeCommandEncoder &&)      = delete;
    CCMTLComputeCommandEncoder &operator=(const CCMTLComputeCommandEncoder &) = delete;
    CCMTLComputeCommandEncoder &operator=(CCMTLComputeCommandEncoder &&) = delete;

    void initialize(id<MTLCommandBuffer> commandBuffer) {
        _mtlEncoder  = [[commandBuffer computeCommandEncoder] retain];
        _initialized = true;
    }

    inline const bool isInitialized() {
        return _initialized;
    }

    inline void setComputePipelineState(id<MTLComputePipelineState> pipelineState) {
        if (_pipelineState == pipelineState)
            return;
        [_mtlEncoder setComputePipelineState:pipelineState];
        _pipelineState = pipelineState;
    }

    inline void setBuffer(const id<MTLBuffer> buffer, uint offset, uint index) {
        [_mtlEncoder setBuffer:buffer offset:offset atIndex:index];
    }

    inline void setTexture(const id<MTLTexture> texture, uint index) {
        [_mtlEncoder setTexture:texture atIndex:index];
        _resourceSize = {texture.width, texture.height, texture.depth};
    }

    inline void dispatch(MTLSize groupsPerGrid) {
        // GLSL -> SPIRV -> MSL
        // GLSL shader request to specify the compute thread size,
        // no such limit in Metal and have to set compute thread size explicity
        NSUInteger w                     = _pipelineState.threadExecutionWidth;
        NSUInteger h                     = _pipelineState.maxTotalThreadsPerThreadgroup / w;
        MTLSize    threadsPerThreadgroup = MTLSizeMake(w, h, 1);
        [_mtlEncoder dispatchThreadgroups:groupsPerGrid threadsPerThreadgroup:threadsPerThreadgroup];
    }

    inline void dispatch(id<MTLBuffer> indirectBuffer, NSUInteger offset, MTLSize groupsPerGrid) {
        [_mtlEncoder dispatchThreadgroupsWithIndirectBuffer:indirectBuffer indirectBufferOffset:offset threadsPerThreadgroup:groupsPerGrid];
    }

    inline void endEncoding() {
        [_mtlEncoder endEncoding];
        [_mtlEncoder release];
        _mtlEncoder    = nil;
        _pipelineState = nil;
        _initialized   = false;
    }

    inline id<MTLComputeCommandEncoder> const getMTLEncoder() {
        return _mtlEncoder;
    }

private:
    bool                         _initialized = false;
    MTLSize                      _resourceSize;
    id<MTLComputeCommandEncoder> _mtlEncoder    = nil;
    id<MTLComputePipelineState>  _pipelineState = nil;
};

} // namespace gfx
} // namespace cc
