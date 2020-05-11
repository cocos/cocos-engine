#pragma once

#include <vector>

#import <Metal/MTLBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLSampler.h>

NS_CC_BEGIN

struct CCMTLGPUUniformBlock
{
    uint mtlBinding = 0;
    uint originBinding = 0;
    id<MTLBuffer> buffer = nil;
    
    CCMTLGPUUniformBlock(uint _mtlBinding, uint _originBinding, id<MTLBuffer> _buffer)
    : mtlBinding(_mtlBinding), originBinding(_originBinding), buffer(_buffer) {}
};
typedef vector<CCMTLGPUUniformBlock>::type CCMTLGPUUniformBlockList;

struct CCMTLGPUTexture
{
    uint mtlBinding = 0;
    uint originBinding = 0;
    id<MTLTexture> texture = nil;
    
    CCMTLGPUTexture(uint _mtlBinding, uint _originBinding, id<MTLTexture> _texture)
    : mtlBinding(_mtlBinding), originBinding(_originBinding), texture(_texture) {}
};
typedef vector<CCMTLGPUTexture>::type CCMTLGPUTextureList;

struct CCMTLGPUSamplerState
{
    uint mtlBinding = 0;
    uint originBinding = 0;
    id<MTLSamplerState> samplerState = nil;
    
    CCMTLGPUSamplerState(uint _mtlBinding, uint _originBinding, id<MTLSamplerState> _samplerState)
    : mtlBinding(_mtlBinding), originBinding(_originBinding), samplerState(_samplerState) {}
};
typedef vector<CCMTLGPUSamplerState>::type CCMTLGPUSamplerStateList;

struct CCMTLGPUPipelineState
{
    MTLCullMode cullMode;
    MTLWinding winding;
    MTLTriangleFillMode fillMode;
    MTLDepthClipMode depthClipMode;
    MTLPrimitiveType primitiveType;
    id<MTLRenderPipelineState> mtlRenderPipelineState = nil;
    id<MTLDepthStencilState> mtlDepthStencilState = nil;
    uint stencilRefFront = 0;
    uint stencilRefBack = 0;
    std::vector<std::tuple<int /**vertexBufferBindingIndex*/, uint /**stream*/>> vertexBufferBindingInfo;
};

class CCMTLGPUInputAssembler : public Object
{
public:
    id<MTLBuffer> mtlIndexBuffer = nil;
    id<MTLBuffer> mtlIndirectBuffer = nil;
    std::vector<id<MTLBuffer>> mtlVertexBufers;
};

NS_CC_END
