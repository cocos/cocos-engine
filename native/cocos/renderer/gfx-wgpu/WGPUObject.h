/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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
#include <emscripten/html5_webgpu.h>
#include <utility>
#include "WGPUDef.h"
#include "base/Utils.h"
#include "base/std/container/map.h"
#include "base/std/container/set.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "base/threading/Semaphore.h"
#include "gfx-base/GFXDef.h"

class WGPURenderPassDescriptor;
class WGPUComputePassDescriptor;

namespace cc {

namespace gfx {

constexpr uint8_t CC_WGPU_MAX_ATTACHMENTS = 16;
constexpr decltype(nullptr) wgpuDefaultHandle = nullptr;
constexpr ccstd::hash_t WGPU_HASH_SEED = 0x811C9DC5;
constexpr uint8_t CC_WGPU_MAX_FRAME_COUNT = 3;

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

    CCWGPUSampler *filterableSampler = nullptr;
    CCWGPUSampler *unfilterableSampler = nullptr;
};

struct CCWGPUInstanceObject {
    WGPUInstance wgpuInstance = wgpuDefaultHandle;
    WGPUSurface wgpuSurface = wgpuDefaultHandle;
    WGPUAdapter wgpuAdapter = wgpuDefaultHandle;
};

struct CCWGPUDeviceObject {
    WGPUDevice wgpuDevice = wgpuDefaultHandle;
    WGPUQueue wgpuQueue = wgpuDefaultHandle;

    CCWGPUInstanceObject instance;
    CCWGPUResource defaultResources;
};

struct CCWGPUSwapchainObject {
    WGPUSwapChain wgpuSwapChain = wgpuDefaultHandle;
    WGPUSurface wgpuSurface = wgpuDefaultHandle;

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
    std::vector<WGPUTextureView> planeViews;
};

// The indirect drawIndexed parameters encoded in the buffer must be a tightly packed block
// of five 32-bit unsigned integer values (20 bytes total), given in the same order as the arguments for drawIndexed().
//  let drawIndexedIndirectParameters = new Uint32Array(5);
//  drawIndexedIndirectParameters[0] = indexCount;
//  drawIndexedIndirectParameters[1] = instanceCount;
//  drawIndexedIndirectParameters[2] = firstIndex;
//  drawIndexedIndirectParameters[3] = baseVertex;
//  drawIndexedIndirectParameters[4] = 0; // firstInstance. Must be 0.
struct CCWGPUDrawIndexedIndirectObject {
    uint32_t indexCount = 0;
    uint32_t instanceCount = 0;
    uint32_t firstIndex = 0;
    uint32_t baseVertex = 0;
    uint32_t firstInstance = 0;
};
static_assert(sizeof(CCWGPUDrawIndexedIndirectObject) == 20, "WGPU drawIndexedIndirect structure validation failed!");

// The indirect draw parameters encoded in the buffer must be a tightly packed block
// of four 32-bit unsigned integer values (16 bytes total), given in the same order as the arguments for draw().

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
    ccstd::map<uint32_t, WGPUBindGroupLayoutEntry> bindGroupLayoutEntries;
};

struct CCWGPUBindGroupObject {
    WGPUBindGroup bindgroup = wgpuDefaultHandle;
    ccstd::vector<WGPUBindGroupEntry> bindGroupEntries;
    ccstd::set<uint8_t> bindingSet;      // bindingInDesc
    ccstd::set<uint8_t> bindingInShader; // bindingInShader
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

using BindingList = ccstd::vector<uint8_t>;
struct CCWGPUShaderObject {
    ccstd::string name;
    WGPUShaderModule wgpuShaderVertexModule = wgpuDefaultHandle;
    WGPUShaderModule wgpuShaderFragmentModule = wgpuDefaultHandle;
    WGPUShaderModule wgpuShaderComputeModule = wgpuDefaultHandle;

    ccstd::vector<BindingList> bindings;
};

struct CCWGPUInputAssemblerObject {
    WGPUVertexState wgpuVertexState;
};

struct CCWGPUQueueObject {
    WGPUQueue wgpuQueue = wgpuDefaultHandle;
    QueueType type = QueueType::GRAPHICS;
};

struct CCWGPUDescriptorSetObject {
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

    WGPUCommandBuffer wgpuCommandBuffer = wgpuDefaultHandle;
    WGPUCommandEncoder wgpuCommandEncoder = wgpuDefaultHandle;
    WGPURenderPassEncoder wgpuRenderPassEncoder = wgpuDefaultHandle;
    WGPUComputePassEncoder wgpuComputeEncoder = wgpuDefaultHandle;
    CommandBufferType type = CommandBufferType::PRIMARY;
    CCWGPUQueue *queue = nullptr;

    WGPURenderPassDescriptor renderPassDescriptor;
    CCWGPUStateCache stateCache;

    ccstd::vector<WGPUCommandBuffer> computeCmdBuffs;
    ccstd::unordered_map<uint32_t, CCWGPUBuffer *> redundantVertexBufferMap;
};

struct CCWGPUQueryPoolObject {
    QueryType type = QueryType::OCCLUSION;
    uint32_t maxQueryObjects = 0;
    ccstd::vector<uint32_t> idPool;
};

template <typename T>
class RecycleBin {
public:
    RecycleBin() = default;
    ~RecycleBin() = default;
    RecycleBin(const RecycleBin &) = delete;
    RecycleBin &operator=(const RecycleBin &) = delete;

    void collect(T t) {
        _recycleBin.emplace(t);
    }

    void purge() {
        for (auto &t : _recycleBin) {
            purge(t);
        }
        _recycleBin.clear();
    }

private:
    void purge(T t);

    ccstd::set<T> _recycleBin;
};

template <>
inline void RecycleBin<WGPUBuffer>::purge(WGPUBuffer buffer) {
    wgpuBufferDestroy(buffer);
    wgpuBufferRelease(buffer);
}

template <>
inline void RecycleBin<WGPUQuerySet>::purge(WGPUQuerySet querySet) {
    wgpuQuerySetDestroy(querySet);
    wgpuQuerySetRelease(querySet);
}

template <>
inline void RecycleBin<WGPUTexture>::purge(WGPUTexture texture) {
    wgpuTextureDestroy(texture);
    wgpuTextureRelease(texture);
}

struct CCWGPURecycleBin {
    RecycleBin<WGPUBuffer> bufferBin;
    RecycleBin<WGPUTexture> textureBin;
    RecycleBin<WGPUQuerySet> queryBin;
};

namespace {
inline void onStagingBufferMapDone(WGPUBufferMapAsyncStatus status, void *userdata) {
    if (status == WGPUBufferMapAsyncStatus_Success) {
        auto *semaphore = static_cast<Semaphore *>(userdata);
        semaphore->signal();
    }
}
} // namespace
constexpr uint32_t INIT_BUFFER_SIZE = 1024 * 1024 * 1; // 1MB

class CCWGPUStagingBuffer {
    CCWGPUStagingBuffer(const CCWGPUStagingBuffer &) = delete;
    CCWGPUStagingBuffer &operator=(const CCWGPUStagingBuffer &) = delete;
    CCWGPUStagingBuffer() = default;
    ~CCWGPUStagingBuffer() = default;

public:
    explicit CCWGPUStagingBuffer(WGPUDevice device, const std::function<void(WGPUBuffer)> &recycleFunc)
    : _device(device), _size(INIT_BUFFER_SIZE), _recycleFunc(recycleFunc) {
        WGPUBufferDescriptor desc = {
            .label = "staging buffer",
            .usage = WGPUBufferUsage_CopySrc | WGPUBufferUsage_MapWrite,
            .size = _size,
            .mappedAtCreation = true,
        };
        _buffer = wgpuDeviceCreateBuffer(device, &desc);
        _mappedData = wgpuBufferGetMappedRange(_buffer, 0, _size);
    }

    uint32_t alloc(uint32_t size) {
        // 1. what if it's still unmapped
        if (!_mapped) {
            Semaphore sem{0};
            wgpuBufferMapAsync(_buffer, WGPUMapMode_Write, 0, _size, onStagingBufferMapDone, &sem);
            sem.wait();
            _mappedData = wgpuBufferGetMappedRange(_buffer, 0, _size);
            _mapped = true;
        }

        const auto oldOffset = _offset;
        if (_offset + size > _size) {
            const auto oldBuffer = _buffer;
            const auto oldSize = _size;
            const auto *oldMappedData = _mappedData;

            _size = utils::nextPOT(_offset + size);
            WGPUBufferDescriptor desc = {
                .label = "staging buffer",
                .usage = WGPUBufferUsage_CopySrc | WGPUBufferUsage_MapWrite,
                .size = _size,
                .mappedAtCreation = true,
            };
            _buffer = wgpuDeviceCreateBuffer(_device, &desc);
            _mappedData = wgpuBufferGetMappedRange(_buffer, 0, _size);
            _offset = 0;

            if (_mapped) {
                memcpy(_mappedData, oldMappedData, oldSize);
                _offset = oldOffset;
            } else {
                // do nothing, unmap means this buffer has flush its data to gpu
            }
            _recycleFunc(oldBuffer);
        }
        _offset += size;
        return oldOffset;
    }

    void destroy() {
        if (_mapped) {
            wgpuBufferUnmap(_buffer);
        }
        if (_recycleFunc) {
            _recycleFunc(_buffer);
        }
    }

    void unmap() {
        if (_mapped) {
            wgpuBufferUnmap(_buffer);
            _mapped = false;
        }
        _offset = 0;
    }

    void *getMappedData(uint32_t offset) {
        return static_cast<uint8_t *>(_mappedData) + offset;
    }

    WGPUBuffer getBuffer() {
        return _buffer;
    }

private:
    WGPUDevice _device{wgpuDefaultHandle};
    WGPUBuffer _buffer{wgpuDefaultHandle};
    void *_mappedData{nullptr};
    uint32_t _size{0};
    uint32_t _offset{0};
    std::function<void(WGPUBuffer)> _recycleFunc;
    bool _mapped{false};
};

} // namespace gfx

} // namespace cc
