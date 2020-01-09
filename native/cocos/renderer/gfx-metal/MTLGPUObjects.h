#pragma once

#include <vector>

#import <Metal/MTLBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLSampler.h>

NS_CC_BEGIN

class CCMTLBuffer;

struct CCMTLGPUUniformBlock
{
    uint mtlBinding = 0;
    uint originBinding = 0;
    id<MTLBuffer> buffer = nil;
};
typedef vector<CCMTLGPUUniformBlock>::type CCMTLGPUUniformBlockList;

struct CCMTLGPUTexture
{
    uint mtlBinding = 0;
    uint originBinding = 0;
    id<MTLTexture> texture = nil;
};
typedef vector<CCMTLGPUTexture>::type CCMTLGPUTextureList;

struct CCMTLGPUSamplerState
{
    uint mtlBinding = 0;
    uint originBInding = 0;
    id<MTLSamplerState> samplerState = nil;
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
    CCMTLGPUUniformBlockList* vertexUniformBlocks = nullptr;
    CCMTLGPUUniformBlockList* fragmentUniformBlocks = nullptr;
    CCMTLGPUTextureList* vertexTextureList = nullptr;
    CCMTLGPUTextureList* fragmentTextureList = nullptr;
    CCMTLGPUSamplerStateList* vertexSampleStateList = nullptr;
    CCMTLGPUSamplerStateList* fragmentSampleStateList = nullptr;
};

class CCMTLGPUInputAssembler : public Object
{
public:
    id<MTLBuffer> mtlIndexBuffer = nil;
    id<MTLBuffer> mtlIndirectBuffer = nil;
    std::vector<id<MTLBuffer>> mtlVertexBufers;
};

NS_CC_END
