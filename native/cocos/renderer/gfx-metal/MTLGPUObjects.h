#pragma once

#import <Metal/MTLBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLRenderPipeline.h>

NS_CC_BEGIN

class CCMTLBuffer;

struct CCMTLGPUUniformBlock
{
    uint mtlBinding = 0;
    uint originBinding = 0;
    id<MTLBuffer> buffer = nil;
};
typedef vector<CCMTLGPUUniformBlock>::type CCMTLGPUUniformBlockList;

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
};

NS_CC_END
