#pragma once

#include <vector>

#import <Metal/MTLBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLSampler.h>

namespace cc {
namespace gfx {
class CCMTLBuffer;
class CCMTLTexture;
class CCMTLSampler;
class CCMTLShader;

struct CCMTLGPUTexture {
    uint mtlBinding = 0;
    uint originBinding = 0;
    id<MTLTexture> texture = nil;

    CCMTLGPUTexture(uint _mtlBinding, uint _originBinding, id<MTLTexture> _texture)
    : mtlBinding(_mtlBinding), originBinding(_originBinding), texture(_texture) {}
};
typedef vector<CCMTLGPUTexture> CCMTLGPUTextureList;

struct CCMTLGPUSamplerState {
    uint mtlBinding = 0;
    uint originBinding = 0;
    id<MTLSamplerState> samplerState = nil;

    CCMTLGPUSamplerState(uint _mtlBinding, uint _originBinding, id<MTLSamplerState> _samplerState)
    : mtlBinding(_mtlBinding), originBinding(_originBinding), samplerState(_samplerState) {}
};
typedef vector<CCMTLGPUSamplerState> CCMTLGPUSamplerStateList;

class CCMTLGPUDescriptorSetLayout : public Object {
public:
    DescriptorSetLayoutBindingList bindings;
    vector<uint> dynamicBindings;
};
typedef vector<CCMTLGPUDescriptorSetLayout *> MTLGPUDescriptorSetLayoutList;

class CCMTLGPUPipelineLayout : public Object {
public:
    MTLGPUDescriptorSetLayoutList setLayouts;
    vector<vector<int>> dynamicOffsetIndices;
};

struct CCMTLGPUUniformBlock {
    String name;
    uint set = GFX_INVALID_BINDING;
    uint binding = GFX_INVALID_BINDING;
    uint mappedBinding = GFX_INVALID_BINDING;
    ShaderStageFlags stages = ShaderStageFlagBit::NONE;
    uint count = 0;
};
typedef vector<CCMTLGPUUniformBlock> CCMTLGPUUniformBlockList;

struct CCMTLGPUSamplerBlock {
    String name;
    uint set = GFX_INVALID_BINDING;
    uint binding = GFX_INVALID_BINDING;
    uint textureBinding = GFX_INVALID_BINDING;
    uint samplerBinding = GFX_INVALID_BINDING;
    ShaderStageFlags stages = ShaderStageFlagBit::NONE;
    Type type = Type::UNKNOWN;
    uint count = 0;
};
typedef vector<CCMTLGPUSamplerBlock> CCMTLGPUSamplerBlockList;

class CCMTLGPUShader : public Object {
public:
    unordered_map<uint, CCMTLGPUUniformBlock> blocks;
    unordered_map<uint, CCMTLGPUSamplerBlock> samplers;
};

struct CCMTLGPUPipelineState {
    MTLCullMode cullMode;
    MTLWinding winding;
    MTLTriangleFillMode fillMode;
    MTLDepthClipMode depthClipMode;
    MTLPrimitiveType primitiveType;
    id<MTLRenderPipelineState> mtlRenderPipelineState = nil;
    id<MTLDepthStencilState> mtlDepthStencilState = nil;
    uint stencilRefFront = 0;
    uint stencilRefBack = 0;
    vector<std::tuple<int /**vertexBufferBindingIndex*/, uint /**stream*/>> vertexBufferBindingInfo;
    const CCMTLGPUPipelineLayout *gpuPipelineLayout = nullptr;
    const CCMTLGPUShader *gpuShader = nullptr;
};

struct CCMTLGPUBuffer {
    uint stride = 0;
    uint count = 0;
    id<MTLBuffer> mtlBuffer = nil;
};

class CCMTLGPUInputAssembler : public Object {
public:
    id<MTLBuffer> mtlIndexBuffer = nil;
    id<MTLBuffer> mtlIndirectBuffer = nil;
    vector<id<MTLBuffer>> mtlVertexBufers;
};

struct CCMTLGPUDescriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    CCMTLBuffer *buffer = nullptr;
    CCMTLTexture *texture = nullptr;
    CCMTLSampler *sampler = nullptr;
};
typedef vector<CCMTLGPUDescriptor> MTLGPUDescriptorList;

class CCMTLGPUDescriptorSet : public Object {
public:
    MTLGPUDescriptorList gpuDescriptors;
};

} // namespace gfx
} // namespace cc
