#pragma once

#include <vector>

#import "MTLUtils.h"
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
    vector<uint> descriptorIndices;
    uint descriptorCount = 0;
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
    size_t size = 0;
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
    uint size = 0;
    uint startOffset = 0;
    uint8_t *mappedData = nullptr;
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
    const vector<uint> *descriptorIndices = nullptr;
};

constexpr size_t chunkSize = 16 * 1024 * 1024; // 16M per block by default
class CCMTLGPUStagingBufferPool : public Object {
public:
    CCMTLGPUStagingBufferPool(id<MTLDevice> device)
    : _device(device) {
    }

    ~CCMTLGPUStagingBufferPool() {
        for (auto &buffer : _pool) {
            [buffer.mtlBuffer release];
        }
        _pool.clear();
    }

    CC_INLINE void alloc(CCMTLGPUBuffer *gpuBuffer) { alloc(gpuBuffer, 1); }
    void alloc(CCMTLGPUBuffer *gpuBuffer, uint alignment) {
        auto bufferCount = _pool.size();
        Buffer *buffer = nullptr;
        size_t offset = 0;
        for (size_t idx = 0; idx < bufferCount; idx++) {
            auto *cur = &_pool[idx];
            offset = mu::alignUp(cur->curOffset, alignment);
            if (gpuBuffer->size + offset <= chunkSize) {
                buffer = cur;
                break;
            }
        }
        if (!buffer) {
            _pool.resize(bufferCount + 1);
            buffer = &_pool.back();
            buffer->mtlBuffer = [_device newBufferWithLength:chunkSize options:MTLResourceStorageModeShared];
            buffer->mappedData = (uint8_t *)buffer->mtlBuffer.contents;
            offset = 0;
        }
        gpuBuffer->mtlBuffer = buffer->mtlBuffer;
        gpuBuffer->startOffset = offset;
        gpuBuffer->mappedData = buffer->mappedData + offset;
        buffer->curOffset = offset + gpuBuffer->size;
    }

    void reset() {
        for (auto &buffer : _pool) {
            buffer.curOffset = 0;
        }
    }

private:
    struct Buffer {
        id<MTLBuffer> mtlBuffer = nil;
        uint8_t *mappedData = nullptr;
        size_t curOffset = 0;
    };

    id<MTLDevice> _device = nil;
    vector<Buffer> _pool;
};

struct CCMTLGPUBufferImageCopy {
    NSUInteger sourceBytesPerRow = 0;
    NSUInteger sourceBytesPerImage = 0;
    MTLSize sourceSize = {0, 0, 0};
    NSUInteger destinationSlice = 0;
    NSUInteger destinationLevel = 0;
    MTLOrigin destinationOrigin = {0, 0, 0};
};

} // namespace gfx
} // namespace cc
