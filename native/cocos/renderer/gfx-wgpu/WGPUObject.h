/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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
#include <emscripten/html5_webgpu.h>
#include <utility>
#include "WGPUDef.h"
#include "base/Utils.h"
#include "base/std/container/map.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "gfx-base/GFXDef.h"

class WGPURenderPassDescriptor;
class WGPUComputePassDescriptor;

namespace cc {

namespace gfx {

constexpr uint8_t CC_WGPU_MAX_ATTACHMENTS = 16;

constexpr uint8_t CC_WGPU_MAX_STREAM = 256; //not sure

constexpr decltype(nullptr) wgpuDefaultHandle = nullptr;

const DescriptorType COMBINED_ST_IN_USE = DescriptorType::SAMPLER_TEXTURE | DescriptorType::INPUT_ATTACHMENT;

class CCWGPUTexture;
class CCWGPUBuffer;
class CCWGPUSampler;
class CCWGPUQueue;
class CCWGPUPipelineState;
class CCWGPUDescriptorSet;
class CCWGPUInputAssembler;

struct CCWGPUResource {
    CCWGPUBuffer *uniformBuffer = nullptr;
    CCWGPUBuffer *storageBuffer = nullptr;

    CCWGPUTexture *commonTexture = nullptr;
    CCWGPUTexture *storageTexture = nullptr;

    CCWGPUSampler *sampler = nullptr;
};

struct CCWGPUDeviceObject {
    WGPUDevice wgpuDevice = wgpuDefaultHandle;
    WGPUQueue wgpuQueue = wgpuDefaultHandle;

    CCWGPUResource defaultResources;
};

struct CCWGPUSwapchainObject {
    WGPUSwapChain wgpuSwapChain = wgpuDefaultHandle;
    WGPUSurface wgpuSurface = wgpuDefaultHandle;
    WGPUInstance wgpuInstance = wgpuDefaultHandle;

    CCWGPUTexture *swapchainColor = nullptr;
    CCWGPUTexture *swapchainDepthStencil = nullptr;
};

struct CCWGPURenderPassObject {
    RenderPassInfo info;
    ccstd::string label;
    uint8_t sampleCount = 1;
    WGPURenderPassDescriptor *wgpuRenderPassDesc = wgpuDefaultHandle;
};

struct CCWGPUTextureObject {
    WGPUTexture wgpuTexture = wgpuDefaultHandle;
    WGPUTextureView wgpuTextureView = wgpuDefaultHandle;
    WGPUTextureView selfView = wgpuDefaultHandle;
};

//The indirect drawIndexed parameters encoded in the buffer must be a tightly packed block
//of five 32-bit unsigned integer values (20 bytes total), given in the same order as the arguments for drawIndexed().
// let drawIndexedIndirectParameters = new Uint32Array(5);
// drawIndexedIndirectParameters[0] = indexCount;
// drawIndexedIndirectParameters[1] = instanceCount;
// drawIndexedIndirectParameters[2] = firstIndex;
// drawIndexedIndirectParameters[3] = baseVertex;
// drawIndexedIndirectParameters[4] = 0; // firstInstance. Must be 0.
struct CCWGPUDrawIndexedIndirectObject {
    uint32_t indexCount = 0;
    uint32_t instanceCount = 0;
    uint32_t firstIndex = 0;
    uint32_t baseVertex = 0;
    uint32_t firstInstance = 0;
};
static_assert(sizeof(CCWGPUDrawIndexedIndirectObject) == 20, "WGPU drawIndexedIndirect structure validation failed!");

//The indirect draw parameters encoded in the buffer must be a tightly packed block
//of four 32-bit unsigned integer values (16 bytes total), given in the same order as the arguments for draw().

// let drawIndirectParameters = new Uint32Array(4);
// drawIndirectParameters[0]  = vertexCount;
// drawIndirectParameters[1]  = instanceCount;
// drawIndirectParameters[2]  = firstVertex;
// drawIndirectParameters[3]  = 0; // firstInstance. Must be 0.
struct CCWGPUDrawIndirectObject {
    uint32_t vertexCount = 0;
    uint32_t instanceCount = 0;
    uint32_t firstIndex = 0;
    uint32_t firstInstance = 0;
};
static_assert(sizeof(CCWGPUDrawIndirectObject) == 16, "WGPU drawIndirect structure validation failed!");

struct CCWGPUBufferObject {
    WGPUBuffer wgpuBuffer = wgpuDefaultHandle;
    ccstd::vector<CCWGPUDrawIndexedIndirectObject> indexedIndirectObjs;
    ccstd::vector<CCWGPUDrawIndirectObject> indirectObjs;
    bool mapped = false;
    bool hasDynamicOffsets = false;
};

struct CCWGPUSamplerObject {
    WGPUSampler wgpuSampler = wgpuDefaultHandle;

    WGPUAddressMode addressModeU = WGPUAddressMode_Repeat;
    WGPUAddressMode addressModeV = WGPUAddressMode_Repeat;
    WGPUAddressMode addressModeW = WGPUAddressMode_Repeat;
    WGPUFilterMode magFilter = WGPUFilterMode_Linear;
    WGPUFilterMode minFilter = WGPUFilterMode_Linear;
    WGPUFilterMode mipmapFilter = WGPUFilterMode_Linear;
    float lodMinClamp = 0.1f;
    float lodMaxClamp = 1000.0f;
    WGPUCompareFunction compare = WGPUCompareFunction_Always;
    uint16_t maxAnisotropy = 0;
};

struct CCWGPUBindGroupLayoutObject {
    WGPUBindGroupLayout bindGroupLayout = wgpuDefaultHandle;
    ccstd::vector<WGPUBindGroupLayoutEntry> bindGroupLayoutEntries;
};

struct CCWGPUBindGroupObject {
    WGPUBindGroup bindgroup = wgpuDefaultHandle;
    ccstd::vector<WGPUBindGroupEntry> bindGroupEntries;
    ccstd::set<uint8_t> bindingSet;
};

struct CCWGPUPipelineLayoutObject {
    WGPUPipelineLayout wgpuPipelineLayout = wgpuDefaultHandle;
};

struct CCWGPUPipelineStateObject {
    WGPURenderPipeline wgpuRenderPipeline = wgpuDefaultHandle;
    WGPUComputePipeline wgpuComputePipeline = wgpuDefaultHandle;

    ccstd::vector<WGPUVertexAttribute> redundantAttr;
    uint32_t maxAttrLength = 0;
};

struct CCWGPUShaderObject {
    ccstd::string name;
    WGPUShaderModule wgpuShaderVertexModule = wgpuDefaultHandle;
    WGPUShaderModule wgpuShaderFragmentModule = wgpuDefaultHandle;
    WGPUShaderModule wgpuShaderComputeModule = wgpuDefaultHandle;
};

struct CCWGPUInputAssemblerObject {
    WGPUVertexState wgpuVertexState;
};

struct CCWGPUQueueObject {
    WGPUQueue wgpuQueue = wgpuDefaultHandle;
    QueueType type = QueueType::GRAPHICS;
};

struct CCWGPUDescriptorSetObject {
    uint32_t index = 0;
    CCWGPUDescriptorSet *descriptorSet = nullptr;
    uint32_t dynamicOffsetCount = 0;
    const uint32_t *dynamicOffsets = nullptr;
};

struct CCWGPUStencilMasks {
    uint32_t writeMask = 0;
    uint32_t compareRef = 0;
    uint32_t compareMask = 0;
};

struct CCWGPUStateCache {
    CCWGPUPipelineState *pipelineState = nullptr;
    CCWGPUInputAssembler *inputAssembler = nullptr;

    float depthBiasConstant = 0.0f;
    float depthBiasClamp = 0.0f;
    float depthBiasSlope = 0.0f;
    float depthMinBound = 0.0f;
    float depthMaxBound = 100.0f;

    Color blendConstants;
    Viewport viewport;
    Rect rect;

    uint32_t minAttachmentWidth = 0;
    uint32_t minAttachmentHeight = 0;

    ccstd::vector<CCWGPUDescriptorSetObject> descriptorSets;
    ccstd::map<StencilFace, CCWGPUStencilMasks> stencilMasks;
};

struct CCWGPUCommandBufferObject {
    bool renderPassBegan = false;

    WGPUCommandEncoder wgpuCommandEncoder = wgpuDefaultHandle;
    WGPURenderPassEncoder wgpuRenderPassEncoder = wgpuDefaultHandle;
    WGPUComputePassEncoder wgpuComputeEncoder = wgpuDefaultHandle;
    CommandBufferType type = CommandBufferType::PRIMARY;
    CCWGPUQueue *queue = nullptr;

    WGPURenderPassDescriptor renderPassDescriptor;
    CCWGPUStateCache stateCache;

    ccstd::unordered_map<uint32_t, CCWGPUBuffer *> redundantVertexBufferMap;
};

struct CCWGPUQueryPoolObject {
    QueryType type = QueryType::OCCLUSION;
    uint32_t maxQueryObjects = 0;
    ccstd::vector<uint32_t> idPool;
};

} // namespace gfx

} // namespace cc
