#pragma once

#include "MTLStd.h"
#include "MTLUtils.h"
#include "base/Macros.h"
#include "math/Math.h"
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLCommandBuffer.h>
#import <Metal/MTLRenderPass.h>
#include <unordered_map>

namespace cc {
namespace gfx {

struct Color;

class CCMTLRenderCommandEncoder final {
    struct BufferBinding final {
        id<MTLBuffer> buffer;
        uint offset = 0;
    };

public:
    CCMTLRenderCommandEncoder() = default;
    ~CCMTLRenderCommandEncoder() = default;
    CCMTLRenderCommandEncoder(const CCMTLRenderCommandEncoder &) = delete;
    CCMTLRenderCommandEncoder(CCMTLRenderCommandEncoder &&) = delete;
    CCMTLRenderCommandEncoder &operator=(const CCMTLRenderCommandEncoder &) = delete;
    CCMTLRenderCommandEncoder &operator=(CCMTLRenderCommandEncoder &&) = delete;

    CC_INLINE void initialize(id<MTLCommandBuffer> commandBuffer, MTLRenderPassDescriptor *descriptor) {
        _mtlEncoder = [commandBuffer renderCommandEncoderWithDescriptor:descriptor];
        [_mtlEncoder retain];

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

    CC_INLINE void setViewport(const Rect &rect) {
        Viewport viewport = {rect.x, rect.y, rect.width, rect.height};
        setViewport(viewport);
    }

    CC_INLINE void setViewport(const Viewport &vp) {
        if (_isViewportSet && _viewport == vp)
            return;

        _viewport = vp;
        _isViewportSet = true;
        [_mtlEncoder setViewport:mu::toMTLViewport(_viewport)];
    }

    CC_INLINE void setScissor(const Rect &rect) {
        if (_isScissorRectSet && _scissorRect == rect)
            return;

        _scissorRect = rect;
        _isScissorRectSet = true;
        [_mtlEncoder setScissorRect:mu::toMTLScissorRect(_scissorRect)];
    }

    CC_INLINE void setCullMode(MTLCullMode mode) {
        if (_isCullModeSet && (_cullMode == mode))
            return;

        _cullMode = mode;
        _isCullModeSet = true;
        [_mtlEncoder setCullMode:mode];
    }

    CC_INLINE void setFrontFacingWinding(MTLWinding winding) {
        if (_isFrontFacingWinding && (_frontFacingWinding == winding))
            return;

        _frontFacingWinding = winding;
        _isFrontFacingWinding = true;
        [_mtlEncoder setFrontFacingWinding:_frontFacingWinding];
    }

    CC_INLINE void setDepthClipMode(MTLDepthClipMode mode) {
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

    CC_INLINE void setTriangleFillMode(MTLTriangleFillMode mode) {
        if (_isTriangleFillModeSet && (_triangleFillMode == mode))
            return;

        _triangleFillMode = mode;
        _isTriangleFillModeSet = true;
        [_mtlEncoder setTriangleFillMode:_triangleFillMode];
    }

    CC_INLINE void setRenderPipelineState(id<MTLRenderPipelineState> pipelineState) {
        if (_pipelineState == pipelineState)
            return;

        [_mtlEncoder setRenderPipelineState:pipelineState];
        _pipelineState = pipelineState;
    }

    CC_INLINE void setStencilFrontBackReferenceValue(uint frontReferenceValue, uint backReferenceValue) {
        if (_frontReferenceValue == frontReferenceValue && _backReferenceValue == backReferenceValue)
            return;

        _frontReferenceValue = frontReferenceValue;
        _backReferenceValue = backReferenceValue;
        [_mtlEncoder setStencilFrontReferenceValue:_frontReferenceValue
                                backReferenceValue:_backReferenceValue];
    }

    CC_INLINE void setDepthStencilState(id<MTLDepthStencilState> depthStencilState) {
        if (_depthStencilState == depthStencilState)
            return;

        [_mtlEncoder setDepthStencilState:depthStencilState];
        _depthStencilState = depthStencilState;
    }

    CC_INLINE void setDepthBias(float depthBias, float clamp, float slope) {
        if (_isDepthBiasSet &&
            math::IsEqualF(_depthBias, depthBias) &&
            math::IsEqualF(_clamp, clamp) &&
            math::IsEqualF(_slope, slope)) {
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

    CC_INLINE void setBlendColor(const Color &color) {
        if (_isBlendColorSet && _blendColor == color)
            return;

        _blendColor = color;
        _isBlendColorSet = true;
        [_mtlEncoder setBlendColorRed:_blendColor.x
                                green:_blendColor.y
                                 blue:_blendColor.z
                                alpha:_blendColor.w];
    }

    CC_INLINE void setVertexBuffer(const id<MTLBuffer> buffer, uint offset, uint index) {
        if (_vertexBufferMap.count(index) > 0 && (buffer == _vertexBufferMap[index]))
            return;

        _vertexBufferMap[index] = buffer;
        [_mtlEncoder setVertexBuffer:buffer
                              offset:offset
                             atIndex:index];
    }

    CC_INLINE void setFragmentBuffer(const id<MTLBuffer> buffer, uint offset, uint index) {
        if (_fragmentBufferMap.count(index) > 0) {
            const auto &bufferBinding = _fragmentBufferMap[index];
            if (buffer == bufferBinding.buffer && offset == bufferBinding.offset)
                return;
        }

        _fragmentBufferMap[index] = {buffer, offset};
        [_mtlEncoder setFragmentBuffer:buffer
                                offset:offset
                               atIndex:index];
    }

    void setVertexTexture(const id<MTLTexture> texture, uint index) {
        if (_vertexTextureMap.count(index) > 0 && (texture == _vertexTextureMap[index]))
            return;

        _vertexTextureMap[index] = texture;
        [_mtlEncoder setVertexTexture:texture atIndex:index];
    }

    void setFragmentTexture(const id<MTLTexture> texture, uint index) {
        if (_fragmentTextureMap.count(index) > 0 && (texture == _fragmentTextureMap[index]))
            return;

        _fragmentTextureMap[index] = texture;
        [_mtlEncoder setFragmentTexture:texture atIndex:index];
    }

    void setVertexSampler(const id<MTLSamplerState> sampler, uint index) {
        if (_vertexSamplerMap.count(index) > 0 && (sampler == _vertexSamplerMap[index]))
            return;

        _vertexSamplerMap[index] = sampler;
        [_mtlEncoder setVertexSamplerState:sampler atIndex:index];
    }

    void setFragmentSampler(const id<MTLSamplerState> sampler, uint index) {
        if (_fragmentSamplerMap.count(index) > 0 && (sampler == _fragmentSamplerMap[index]))
            return;

        _fragmentSamplerMap[index] = sampler;
        [_mtlEncoder setFragmentSamplerState:sampler atIndex:index];
    }

    CC_INLINE void endEncoding() {
        [_mtlEncoder endEncoding];
        [_mtlEncoder release];
        _mtlEncoder = nil;
    }

    CC_INLINE id<MTLRenderCommandEncoder> const getMTLEncoder() {
        return _mtlEncoder;
    }

private:
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
    uint _frontReferenceValue = UINT_MAX;
    uint _backReferenceValue = UINT_MAX;
    float _depthBias = 0.f;
    float _clamp = 0.f;
    float _slope = 0.f;
    MTLCullMode _cullMode = MTLCullModeNone;
    MTLWinding _frontFacingWinding = MTLWindingClockwise;
    MTLDepthClipMode _depthClipMode = MTLDepthClipModeClip;
    MTLTriangleFillMode _triangleFillMode = MTLTriangleFillModeFill;
    Viewport _viewport;
    Rect _scissorRect;
    Color _blendColor;
    // Offset will always be 0 for vertex buffer.
    std::unordered_map<uint, id<MTLBuffer>> _vertexBufferMap;
    std::unordered_map<uint, BufferBinding> _fragmentBufferMap;
    std::unordered_map<uint, id<MTLTexture>> _vertexTextureMap;
    std::unordered_map<uint, id<MTLTexture>> _fragmentTextureMap;
    std::unordered_map<uint, id<MTLSamplerState>> _vertexSamplerMap;
    std::unordered_map<uint, id<MTLSamplerState>> _fragmentSamplerMap;
};

} // namespace gfx
} // namespace cc
