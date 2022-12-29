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

#import <Metal/MTLCommandBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLRenderPass.h>
#include "MTLCommandEncoder.h"
#include "MTLUtils.h"
#include "base/Macros.h"
#include "base/std/container/unordered_map.h"
#include "math/Math.h"

namespace cc {
namespace gfx {

struct Color;

class CCMTLRenderCommandEncoder final : public CCMTLCommandEncoder {
    struct BufferBinding final {
        id<MTLBuffer> buffer;
        uint32_t offset = 0;
    };

public:
    CCMTLRenderCommandEncoder() = default;
    ~CCMTLRenderCommandEncoder() = default;
    CCMTLRenderCommandEncoder(const CCMTLRenderCommandEncoder &) = delete;
    CCMTLRenderCommandEncoder(CCMTLRenderCommandEncoder &&) = delete;
    CCMTLRenderCommandEncoder &operator=(const CCMTLRenderCommandEncoder &) = delete;
    CCMTLRenderCommandEncoder &operator=(CCMTLRenderCommandEncoder &&) = delete;

    void initialize(id<MTLCommandBuffer> commandBuffer, MTLRenderPassDescriptor *descriptor) {
        _mtlEncoder = [[commandBuffer renderCommandEncoderWithDescriptor:descriptor] retain];
        clearStates();
    }
    void initialize(id<MTLParallelRenderCommandEncoder> parallelEncoder) {
        _mtlEncoder = [[parallelEncoder renderCommandEncoder] retain];
        clearStates();
    }

    inline void clearStates() {
        _isViewportSet = false;
        _isScissorRectSet = false;
        _isCullModeSet = false;
        _isFrontFacingWinding = false;
        _isTriangleFillModeSet = false;
        _isDepthClipModeSet = false;
        _isDepthBiasSet = false;
        _isBlendColorSet = false;

        _pipelineState = nil;
        _depthStencilState = nil;

        _frontReferenceValue = UINT_MAX;
        _backReferenceValue = UINT_MAX;

        _vertexBufferMap.clear();
        _fragmentBufferMap.clear();
        _vertexTextureMap.clear();
        _fragmentTextureMap.clear();
        _vertexSamplerMap.clear();
        _fragmentSamplerMap.clear();
    }

    inline void setViewport(const Rect &rect) {
        Viewport viewport = {rect.x, rect.y, rect.width, rect.height};
        setViewport(viewport);
    }

    inline void setViewport(const Viewport &vp) {
        if (_isViewportSet && _viewport == vp)
            return;

        _viewport = vp;
        _isViewportSet = true;
        [_mtlEncoder setViewport:mu::toMTLViewport(_viewport)];
    }

    inline void setScissor(const Rect &rect) {
        if (_isScissorRectSet && _scissorRect == rect)
            return;

        _scissorRect = rect;
        _isScissorRectSet = true;
        [_mtlEncoder setScissorRect:mu::toMTLScissorRect(_scissorRect)];
    }

    inline void setCullMode(MTLCullMode mode) {
        if (_isCullModeSet && (_cullMode == mode))
            return;

        _cullMode = mode;
        _isCullModeSet = true;
        [_mtlEncoder setCullMode:mode];
    }

    inline void setFrontFacingWinding(MTLWinding winding) {
        if (_isFrontFacingWinding && (_frontFacingWinding == winding))
            return;

        _frontFacingWinding = winding;
        _isFrontFacingWinding = true;
        [_mtlEncoder setFrontFacingWinding:_frontFacingWinding];
    }

    inline void setDepthClipMode(MTLDepthClipMode mode) {
#ifndef TARGET_OS_SIMULATOR
        if (@available(iOS 11.0, macOS 10.11)) {
            if (_isDepthClipModeSet && (_depthClipMode == mode))
                return;

            _depthClipMode = mode;
            _isDepthClipModeSet = true;
            [_mtlEncoder setDepthClipMode:_depthClipMode];
        }
#endif
    }

    inline void setTriangleFillMode(MTLTriangleFillMode mode) {
        if (_isTriangleFillModeSet && (_triangleFillMode == mode))
            return;

        _triangleFillMode = mode;
        _isTriangleFillModeSet = true;
        [_mtlEncoder setTriangleFillMode:_triangleFillMode];
    }

    inline void setRenderPipelineState(id<MTLRenderPipelineState> pipelineState) {
        if (_pipelineState == pipelineState)
            return;

        [_mtlEncoder setRenderPipelineState:pipelineState];
        _pipelineState = pipelineState;
    }

    inline void setStencilFrontBackReferenceValue(uint32_t frontReferenceValue, uint32_t backReferenceValue) {
        if (_frontReferenceValue == frontReferenceValue && _backReferenceValue == backReferenceValue)
            return;

        _frontReferenceValue = frontReferenceValue;
        _backReferenceValue = backReferenceValue;
        [_mtlEncoder setStencilFrontReferenceValue:_frontReferenceValue
                                backReferenceValue:_backReferenceValue];
    }

    inline void setDepthStencilState(id<MTLDepthStencilState> depthStencilState) {
        if (_depthStencilState == depthStencilState)
            return;

        [_mtlEncoder setDepthStencilState:depthStencilState];
        _depthStencilState = depthStencilState;
    }

    inline void setDepthBias(float depthBias, float clamp, float slope) {
        if (_isDepthBiasSet &&
            math::isEqualF(_depthBias, depthBias) &&
            math::isEqualF(_clamp, clamp) &&
            math::isEqualF(_slope, slope)) {
            return;
        }

        _depthBias = depthBias;
        _clamp = clamp;
        _slope = slope;
        _isDepthBiasSet = true;
        [_mtlEncoder setDepthBias:_depthBias
                       slopeScale:_slope
                            clamp:_clamp];
    }

    inline void setBlendColor(const Color &color) {
        if (_isBlendColorSet && _blendColor == color)
            return;

        _blendColor = color;
        _isBlendColorSet = true;
        [_mtlEncoder setBlendColorRed:_blendColor.x
                                green:_blendColor.y
                                 blue:_blendColor.z
                                alpha:_blendColor.w];
    }

    inline void setVertexBuffer(const id<MTLBuffer> buffer, uint32_t offset, uint32_t index) {
        if (_vertexBufferMap.count(index) > 0) {
            const auto &bufferBinding = _vertexBufferMap[index];
            if (buffer == bufferBinding.buffer && offset == bufferBinding.offset) {
                return;
            }
        }

        _vertexBufferMap[index] = {buffer, offset};
        [_mtlEncoder setVertexBuffer:buffer
                              offset:offset
                             atIndex:index];
    }

    inline void setFragmentBuffer(const id<MTLBuffer> buffer, uint32_t offset, uint32_t index) {
        if (_fragmentBufferMap.count(index) > 0) {
            const auto &bufferBinding = _fragmentBufferMap[index];
            if (buffer == bufferBinding.buffer && offset == bufferBinding.offset) {
                return;
            }
        }

        _fragmentBufferMap[index] = {buffer, offset};
        [_mtlEncoder setFragmentBuffer:buffer
                                offset:offset
                               atIndex:index];
    }

    void setVertexTexture(const id<MTLTexture> texture, uint32_t index) {
        if (_vertexTextureMap.count(index) > 0 && (texture == _vertexTextureMap[index]))
            return;

        _vertexTextureMap[index] = texture;
        [_mtlEncoder setVertexTexture:texture atIndex:index];
    }

    void setFragmentTexture(const id<MTLTexture> texture, uint32_t index) {
        if (_fragmentTextureMap.count(index) > 0 && (texture == _fragmentTextureMap[index]))
            return;

        _fragmentTextureMap[index] = texture;
        [_mtlEncoder setFragmentTexture:texture atIndex:index];
    }

    void setVertexSampler(const id<MTLSamplerState> sampler, uint32_t index) {
        if (_vertexSamplerMap.count(index) > 0 && (sampler == _vertexSamplerMap[index]))
            return;

        _vertexSamplerMap[index] = sampler;
        [_mtlEncoder setVertexSamplerState:sampler atIndex:index];
    }

    void setFragmentSampler(const id<MTLSamplerState> sampler, uint32_t index) {
        if (_fragmentSamplerMap.count(index) > 0 && (sampler == _fragmentSamplerMap[index]))
            return;

        _fragmentSamplerMap[index] = sampler;
        [_mtlEncoder setFragmentSamplerState:sampler atIndex:index];
    }

    inline void endEncoding() {
        [_mtlEncoder endEncoding];
        [_mtlEncoder release];
        _mtlEncoder = nil;
    }

    inline id<MTLRenderCommandEncoder> const getMTLEncoder() {
        return _mtlEncoder;
    }

protected:
    bool _isViewportSet = false;
    bool _isScissorRectSet = false;
    bool _isCullModeSet = false;
    bool _isFrontFacingWinding = false;
    bool _isTriangleFillModeSet = false;
    bool _isDepthClipModeSet = false;
    bool _isDepthBiasSet = false;
    bool _isBlendColorSet = false;
    id<MTLRenderCommandEncoder> _mtlEncoder = nil;
    id<MTLRenderPipelineState> _pipelineState = nil;
    id<MTLDepthStencilState> _depthStencilState = nil;
    uint32_t _frontReferenceValue = UINT_MAX;
    uint32_t _backReferenceValue = UINT_MAX;
    float _depthBias = 0.f;
    float _clamp = 0.f;
    float _slope = 0.f;
    MTLCullMode _cullMode = MTLCullModeNone;
    MTLWinding _frontFacingWinding = MTLWindingClockwise;
    CC_UNUSED MTLDepthClipMode _depthClipMode = MTLDepthClipModeClip;
    MTLTriangleFillMode _triangleFillMode = MTLTriangleFillModeFill;
    Viewport _viewport;
    Rect _scissorRect;
    Color _blendColor;
    ccstd::unordered_map<uint32_t, BufferBinding> _vertexBufferMap;
    ccstd::unordered_map<uint32_t, BufferBinding> _fragmentBufferMap;
    ccstd::unordered_map<uint32_t, id<MTLTexture>> _vertexTextureMap;
    ccstd::unordered_map<uint32_t, id<MTLTexture>> _fragmentTextureMap;
    ccstd::unordered_map<uint32_t, id<MTLSamplerState>> _vertexSamplerMap;
    ccstd::unordered_map<uint32_t, id<MTLSamplerState>> _fragmentSamplerMap;
};

} // namespace gfx
} // namespace cc
