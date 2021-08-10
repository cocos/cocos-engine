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

#include <thread>
#include <utility>

#include "base/CachedArray.h"

#include "VKStd.h"
#include "VKUtils.h"

#define TBB_USE_EXCEPTIONS 0 // no-rtti for now
#include "tbb/concurrent_unordered_map.h"

namespace cc {
namespace gfx {

class CCVKGPUContext final : public Object {
public:
    VkInstance               vkInstance            = VK_NULL_HANDLE;
    VkDebugUtilsMessengerEXT vkDebugUtilsMessenger = VK_NULL_HANDLE;
    VkDebugReportCallbackEXT vkDebugReport         = VK_NULL_HANDLE;

    VkPhysicalDevice                              physicalDevice = VK_NULL_HANDLE;
    VkPhysicalDeviceFeatures                      physicalDeviceFeatures{};
    VkPhysicalDeviceFeatures2                     physicalDeviceFeatures2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_FEATURES_2};
    VkPhysicalDeviceVulkan11Features              physicalDeviceVulkan11Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_1_FEATURES};
    VkPhysicalDeviceVulkan12Features              physicalDeviceVulkan12Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_2_FEATURES};
    VkPhysicalDeviceDepthStencilResolveProperties physicalDeviceDepthStencilResolveProperties{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_DEPTH_STENCIL_RESOLVE_PROPERTIES};
    VkPhysicalDeviceProperties                    physicalDeviceProperties{};
    VkPhysicalDeviceProperties2                   physicalDeviceProperties2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_PROPERTIES_2};
    VkPhysicalDeviceMemoryProperties              physicalDeviceMemoryProperties{};
    vector<VkQueueFamilyProperties>               queueFamilyProperties;
    vector<VkBool32>                              queueFamilyPresentables;

    VkSurfaceKHR vkSurface = VK_NULL_HANDLE;

    VkSwapchainCreateInfoKHR swapchainCreateInfo{VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR};

    VkSampleCountFlagBits getSampleCountForAttachments(Format format, SampleCount sampleCount) const;
};

struct CCVKAccessInfo {
    VkPipelineStageFlags stageMask;
    VkAccessFlags        accessMask;
    VkImageLayout        imageLayout;
    bool                 hasWriteAccess;
};

class CCVKGPURenderPass final : public Object {
public:
    ColorAttachmentList    colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    SubpassInfoList        subpasses;
    SubpassDependencyList  dependencies;

    // per attachment
    vector<vector<ThsvsAccessType>> beginAccesses;
    vector<vector<ThsvsAccessType>> endAccesses;

    VkRenderPass vkRenderPass;

    // helper storage
    vector<VkClearValue>          clearValues;
    vector<VkSampleCountFlagBits> sampleCounts; // per subpass
};

class CCVKGPUTexture final : public Object {
public:
    TextureType        type        = TextureType::TEX2D;
    Format             format      = Format::UNKNOWN;
    TextureUsage       usage       = TextureUsageBit::NONE;
    uint               width       = 0U;
    uint               height      = 0U;
    uint               depth       = 1U;
    uint               size        = 0U;
    uint               arrayLayers = 1U;
    uint               mipLevels   = 1U;
    SampleCount        samples     = SampleCount::X1;
    TextureFlags       flags       = TextureFlagBit::NONE;
    VkImageAspectFlags aspectMask  = VK_IMAGE_ASPECT_COLOR_BIT;
    bool               memoryless  = false;

    VkImage       vkImage       = VK_NULL_HANDLE;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;

    vector<ThsvsAccessType> currentAccessTypes;

    // for barrier manager
    vector<ThsvsAccessType> renderAccessTypes; // gathered from descriptor sets
    ThsvsAccessType         transferAccess = THSVS_ACCESS_NONE;
};

class CCVKGPUTextureView final : public Object {
public:
    CCVKGPUTexture *gpuTexture = nullptr;
    TextureType     type       = TextureType::TEX2D;
    Format          format     = Format::UNKNOWN;
    uint            baseLevel  = 0U;
    uint            levelCount = 1U;
    uint            baseLayer  = 0U;
    uint            layerCount = 1U;

    // descriptor infos
    VkImageView vkImageView = VK_NULL_HANDLE;
};
using CCVKGPUTextureViewList = vector<CCVKGPUTextureView *>;

class CCVKGPUSampler final : public Object {
public:
    Filter         minFilter     = Filter::LINEAR;
    Filter         magFilter     = Filter::LINEAR;
    Filter         mipFilter     = Filter::NONE;
    Address        addressU      = Address::WRAP;
    Address        addressV      = Address::WRAP;
    Address        addressW      = Address::WRAP;
    uint           maxAnisotropy = 0U;
    ComparisonFunc cmpFunc       = ComparisonFunc::NEVER;
    Color          borderColor;
    float          mipLODBias = 0.0F;

    // descriptor infos
    VkSampler vkSampler;
};

class CCVKGPUBuffer final : public Object {
public:
    BufferUsage usage    = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint        stride   = 0U;
    uint        count    = 0U;
    void *      buffer   = nullptr;

    bool                                 isDrawIndirectByIndex = false;
    vector<VkDrawIndirectCommand>        indirectCmds;
    vector<VkDrawIndexedIndirectCommand> indexedIndirectCmds;

    uint8_t *     mappedData    = nullptr;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;

    // descriptor infos
    VkBuffer     vkBuffer    = VK_NULL_HANDLE;
    VkDeviceSize startOffset = 0U;
    VkDeviceSize size        = 0U;

    VkDeviceSize instanceSize = 0U; // per-back-buffer instance

    // for barrier manager
    vector<ThsvsAccessType> renderAccessTypes; // gathered from descriptor sets
    ThsvsAccessType         transferAccess = THSVS_ACCESS_NONE;
};
using CCVKGPUBufferList = vector<CCVKGPUBuffer *>;

class CCVKGPUBufferView final : public Object {
public:
    CCVKGPUBuffer *gpuBuffer = nullptr;
    uint           offset    = 0U;
    uint           range     = 0U;
};

class CCVKGPUSwapchain;
class CCVKGPUFramebuffer final : public Object {
public:
    CCVKGPURenderPass *    gpuRenderPass = nullptr;
    CCVKGPUTextureViewList gpuColorViews;
    CCVKGPUTextureView *   gpuDepthStencilView = nullptr;
    VkFramebuffer          vkFramebuffer       = VK_NULL_HANDLE;
    CCVKGPUSwapchain *     swapchain           = nullptr;
    bool                   isOffscreen         = true;
};

using FramebufferList        = vector<VkFramebuffer>;
using FramebufferListMap     = unordered_map<CCVKGPUFramebuffer *, FramebufferList>;
using FramebufferListMapIter = FramebufferListMap::iterator;

class CCVKGPUSwapchain final : public Object {
public:
    uint                            curImageIndex = 0U;
    VkSwapchainKHR                  vkSwapchain   = VK_NULL_HANDLE;
    vector<VkImageView>             vkSwapchainImageViews;
    FramebufferListMap              vkSwapchainFramebufferListMap;
    vector<vector<ThsvsAccessType>> swapchainImageAccessTypes;
    vector<vector<ThsvsAccessType>> depthStencilImageAccessTypes;
    // external references
    vector<VkImage>     swapchainImages;
    vector<VkImage>     depthStencilImages;
    vector<VkImageView> depthStencilImageViews;
};

class CCVKGPUCommandBuffer final : public Object {
public:
    VkCommandBuffer                 vkCommandBuffer  = VK_NULL_HANDLE;
    VkCommandBufferLevel            level            = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
    uint                            queueFamilyIndex = 0U;
    bool                            began            = false;
    mutable unordered_set<VkBuffer> recordedBuffers;
};

class CCVKGPUQueue final : public Object {
public:
    QueueType                    type                = QueueType::GRAPHICS;
    VkQueue                      vkQueue             = VK_NULL_HANDLE;
    uint                         queueFamilyIndex    = 0U;
    VkSemaphore                  nextWaitSemaphore   = VK_NULL_HANDLE;
    VkSemaphore                  nextSignalSemaphore = VK_NULL_HANDLE;
    VkPipelineStageFlags         submitStageMask     = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;
    CachedArray<VkCommandBuffer> commandBuffers;
};

struct CCVKGPUShaderStage {
    CCVKGPUShaderStage(ShaderStageFlagBit t, String s)
    : type(t),
      source(std::move(s)) {
    }
    ShaderStageFlagBit type = ShaderStageFlagBit::NONE;
    String             source;
    VkShaderModule     vkShader = VK_NULL_HANDLE;
};
using CCVKGPUShaderStageList = vector<CCVKGPUShaderStage>;

class CCVKGPUShader final : public Object {
public:
    String                 name;
    AttributeList          attributes;
    UniformBlockList       blocks;
    UniformSamplerList     samplers;
    CCVKGPUShaderStageList gpuStages;
};

class CCVKGPUInputAssembler final : public Object {
public:
    AttributeList        attributes;
    CCVKGPUBufferList    gpuVertexBuffers;
    CCVKGPUBuffer *      gpuIndexBuffer    = nullptr;
    CCVKGPUBuffer *      gpuIndirectBuffer = nullptr;
    vector<VkBuffer>     vertexBuffers;
    vector<VkDeviceSize> vertexBufferOffsets;
};

union CCVKDescriptorInfo {
    VkDescriptorImageInfo  image;
    VkDescriptorBufferInfo buffer;
    VkBufferView           texelBufferView;
};
struct CCVKGPUDescriptor {
    DescriptorType          type = DescriptorType::UNKNOWN;
    vector<ThsvsAccessType> accessTypes;
    CCVKGPUBufferView *     gpuBufferView  = nullptr;
    CCVKGPUTextureView *    gpuTextureView = nullptr;
    CCVKGPUSampler *        gpuSampler     = nullptr;
};
using CCVKGPUDescriptorList = vector<CCVKGPUDescriptor>;

class CCVKGPUDescriptorSetLayout;
class CCVKGPUDescriptorSet final : public Object {
public:
    CCVKGPUDescriptorList gpuDescriptors;

    // references
    CCVKGPUDescriptorSetLayout *gpuLayout = nullptr;

    struct Instance {
        VkDescriptorSet              vkDescriptorSet = VK_NULL_HANDLE;
        vector<CCVKDescriptorInfo>   descriptorInfos;
        vector<VkWriteDescriptorSet> descriptorUpdateEntries;
    };
    vector<Instance> instances; // per swapchain image

    uint layoutID = 0U;
};

using CCVKGPUDescriptorSetLayoutList = vector<CCVKGPUDescriptorSetLayout *>;

class CCVKGPUPipelineLayout final : public Object {
public:
    CCVKGPUDescriptorSetLayoutList setLayouts;

    VkPipelineLayout vkPipelineLayout = VK_NULL_HANDLE;

    // helper storage
    vector<uint> dynamicOffsetOffsets;
    uint         dynamicOffsetCount;
};

class CCVKGPUPipelineState final : public Object {
public:
    PipelineBindPoint      bindPoint         = PipelineBindPoint::GRAPHICS;
    PrimitiveMode          primitive         = PrimitiveMode::TRIANGLE_LIST;
    CCVKGPUShader *        gpuShader         = nullptr;
    CCVKGPUPipelineLayout *gpuPipelineLayout = nullptr;
    InputState             inputState;
    RasterizerState        rs;
    DepthStencilState      dss;
    BlendState             bs;
    DynamicStateList       dynamicStates;
    CCVKGPURenderPass *    gpuRenderPass = nullptr;
    uint                   subpass       = 0U;
    VkPipeline             vkPipeline    = VK_NULL_HANDLE;
};

class CCVKGPUGlobalBarrier final : public Object {
public:
    VkPipelineStageFlags srcStageMask = 0U;
    VkPipelineStageFlags dstStageMask = 0U;
    VkMemoryBarrier      vkBarrier{};

    vector<ThsvsAccessType> accessTypes;
    ThsvsGlobalBarrier      barrier{};
};

class CCVKGPUTextureBarrier final : public Object {
public:
    VkPipelineStageFlags srcStageMask = 0U;
    VkPipelineStageFlags dstStageMask = 0U;
    VkImageMemoryBarrier vkBarrier{};

    vector<ThsvsAccessType> accessTypes;
    ThsvsImageBarrier       barrier{};
};

class CCVKGPUCommandBufferPool;
class CCVKGPUDescriptorSetPool;
class CCVKGPUDevice final : public Object {
public:
    VkDevice                      vkDevice = VK_NULL_HANDLE;
    vector<VkLayerProperties>     layers;
    vector<VkExtensionProperties> extensions;
    VmaAllocator                  memoryAllocator = VK_NULL_HANDLE;
    VkPipelineCache               vkPipelineCache = VK_NULL_HANDLE;
    uint                          minorVersion    = 0U;

    uint curBackBufferIndex = 0U;
    uint backBufferCount    = 3U;

    bool useDescriptorUpdateTemplate = false;
    bool useMultiDrawIndirect        = false;

    PFN_vkCreateRenderPass2 createRenderPass2 = nullptr;

    // for default backup usages
    CCVKGPUSampler     defaultSampler;
    CCVKGPUTexture     defaultTexture;
    CCVKGPUTextureView defaultTextureView;
    CCVKGPUBuffer      defaultBuffer;

    CCVKGPUSwapchain *swapchain = nullptr; // reference

    CCVKGPUCommandBufferPool *getCommandBufferPool();
    CCVKGPUDescriptorSetPool *getDescriptorSetPool(uint layoutID);

private:
    friend class CCVKDevice;

    // cannot use thread_local here because we need explicit control over their destruction
    using CommandBufferPools = tbb::concurrent_unordered_map<size_t, CCVKGPUCommandBufferPool *, std::hash<size_t>>;
    CommandBufferPools _commandBufferPools;

    unordered_map<uint, CCVKGPUDescriptorSetPool> _descriptorSetPools;
};

/**
 * A simple pool for reusing fences.
 */
class CCVKGPUFencePool final : public Object {
public:
    explicit CCVKGPUFencePool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUFencePool() override {
        for (VkFence fence : _fences) {
            vkDestroyFence(_device->vkDevice, fence, nullptr);
        }
        _fences.clear();
        _count = 0;
    }

    VkFence alloc() {
        if (_count < _fences.size()) {
            return _fences[_count++];
        }

        VkFence           fence = VK_NULL_HANDLE;
        VkFenceCreateInfo createInfo{VK_STRUCTURE_TYPE_FENCE_CREATE_INFO};
        VK_CHECK(vkCreateFence(_device->vkDevice, &createInfo, nullptr, &fence));
        _fences.push_back(fence);
        _count++;

        return fence;
    }

    void reset() {
        if (_count) {
            VK_CHECK(vkResetFences(_device->vkDevice, _count, _fences.data()));
            _count = 0;
        }
    }

    VkFence *data() {
        return _fences.data();
    }

    uint size() const {
        return _count;
    }

private:
    CCVKGPUDevice * _device = nullptr;
    uint            _count  = 0U;
    vector<VkFence> _fences;
};

/**
 * A simple pool for reusing semaphores.
 */
class CCVKGPUSemaphorePool final : public Object {
public:
    explicit CCVKGPUSemaphorePool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUSemaphorePool() override {
        for (VkSemaphore semaphore : _semaphores) {
            vkDestroySemaphore(_device->vkDevice, semaphore, nullptr);
        }
        _semaphores.clear();
        _count = 0;
    }

    VkSemaphore alloc() {
        if (_count < _semaphores.size()) {
            return _semaphores[_count++];
        }

        VkSemaphore           semaphore = VK_NULL_HANDLE;
        VkSemaphoreCreateInfo createInfo{VK_STRUCTURE_TYPE_SEMAPHORE_CREATE_INFO};
        VK_CHECK(vkCreateSemaphore(_device->vkDevice, &createInfo, nullptr, &semaphore));
        _semaphores.push_back(semaphore);
        _count++;

        return semaphore;
    }

    void reset() {
        _count = 0;
    }

    uint size() const {
        return _count;
    }

private:
    CCVKGPUDevice *     _device;
    uint                _count = 0U;
    vector<VkSemaphore> _semaphores;
};

/**
 * Unlimited descriptor set pool, based on multiple fix-sized VkDescriptorPools.
 */
class CCVKGPUDescriptorSetPool final : public Object {
public:
    ~CCVKGPUDescriptorSetPool() override {
        for (vector<VkDescriptorSet> &market : _fleaMarkets) {
            for (VkDescriptorSet set : market) {
                for (DescriptorSetPool &pool : _pools) {
                    if (pool.activeSets.count(set)) {
                        pool.activeSets.erase(set);
                        break;
                    }
                }
            }
        }

        size_t leakedSetCount = 0U;
        for (DescriptorSetPool &pool : _pools) {
            leakedSetCount += pool.activeSets.size();
            vkDestroyDescriptorPool(_device->vkDevice, pool.vkPool, nullptr);
        }
        if (leakedSetCount) CC_LOG_DEBUG("Leaked %d descriptor sets.", leakedSetCount);

        _pools.clear();
    }

    void link(CCVKGPUDevice *device, uint maxSetsPerPool, const vector<VkDescriptorSetLayoutBinding> &bindings, VkDescriptorSetLayout setLayout) {
        _device         = device;
        _maxSetsPerPool = maxSetsPerPool;
        _setLayouts.insert(_setLayouts.cbegin(), _maxSetsPerPool, setLayout);
        _fleaMarkets.resize(device->backBufferCount);

        unordered_map<VkDescriptorType, uint> typeMap;
        for (const auto &vkBinding : bindings) {
            typeMap[vkBinding.descriptorType] += maxSetsPerPool * vkBinding.descriptorCount;
        }

        // minimal reserve for empty set layouts
        if (bindings.empty()) {
            typeMap[VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER] = 1;
        }

        _poolSizes.clear();
        for (auto &it : typeMap) {
            _poolSizes.push_back({it.first, it.second});
        }
    }

    VkDescriptorSet request(uint backBufferIndex) {
        VkDescriptorSet output = VK_NULL_HANDLE;

        if (!_fleaMarkets[backBufferIndex].empty()) {
            output = _fleaMarkets[backBufferIndex].back();
            _fleaMarkets[backBufferIndex].pop_back();
            return output;
        }

        size_t size = _pools.size();
        uint   idx  = 0U;
        for (; idx < size; idx++) {
            if (!_pools[idx].freeSets.empty()) {
                output = _pools[idx].freeSets.back();
                _pools[idx].freeSets.pop_back();
                _pools[idx].activeSets.insert(output);
                return output;
            }
        }

        if (idx >= size) {
            VkDescriptorPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO};
            createInfo.maxSets       = _maxSetsPerPool;
            createInfo.poolSizeCount = utils::toUint(_poolSizes.size());
            createInfo.pPoolSizes    = _poolSizes.data();

            VkDescriptorPool descriptorPool = VK_NULL_HANDLE;
            VK_CHECK(vkCreateDescriptorPool(_device->vkDevice, &createInfo, nullptr, &descriptorPool));
            _pools.push_back({descriptorPool});

            _pools[idx].freeSets.resize(_maxSetsPerPool);
            VkDescriptorSetAllocateInfo info{VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO};
            info.pSetLayouts        = _setLayouts.data();
            info.descriptorSetCount = _maxSetsPerPool;
            info.descriptorPool     = descriptorPool;
            VK_CHECK(vkAllocateDescriptorSets(_device->vkDevice, &info, _pools[idx].freeSets.data()));
        }

        output = _pools[idx].freeSets.back();
        _pools[idx].freeSets.pop_back();
        _pools[idx].activeSets.insert(output);
        return output;
    }

    void yield(VkDescriptorSet set, uint backBufferIndex) {
        bool found = false;
        for (DescriptorSetPool &pool : _pools) {
            if (pool.activeSets.count(set)) {
                found = true;
                break;
            }
        }
        CCASSERT(found, "wrong descriptor set layout to yield?");
        _fleaMarkets[backBufferIndex].push_back(set);
    }

private:
    CCVKGPUDevice *_device = nullptr;

    struct DescriptorSetPool {
        VkDescriptorPool               vkPool = VK_NULL_HANDLE;
        unordered_set<VkDescriptorSet> activeSets;
        vector<VkDescriptorSet>        freeSets;
    };
    vector<DescriptorSetPool> _pools;

    vector<vector<VkDescriptorSet>> _fleaMarkets; // per back buffer

    vector<VkDescriptorPoolSize>  _poolSizes;
    vector<VkDescriptorSetLayout> _setLayouts;
    uint                          _maxSetsPerPool = 0U;
};

class CCVKGPUDescriptorSetLayout final : public Object {
public:
    DescriptorSetLayoutBindingList bindings;
    vector<uint>                   dynamicBindings;

    vector<VkDescriptorSetLayoutBinding> vkBindings;
    VkDescriptorSetLayout                vkDescriptorSetLayout      = VK_NULL_HANDLE;
    VkDescriptorUpdateTemplate           vkDescriptorUpdateTemplate = VK_NULL_HANDLE;
    VkDescriptorSet                      defaultDescriptorSet       = VK_NULL_HANDLE;

    vector<uint> bindingIndices;
    vector<uint> descriptorIndices;
    uint         descriptorCount = 0U;

    uint id             = 0U;
    uint maxSetsPerPool = 10U;
};

/**
 * Command buffer pool based on VkCommandPools, always try to reuse previous allocations first.
 */
class CCVKGPUCommandBufferPool final : public Object {
public:
    explicit CCVKGPUCommandBufferPool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUCommandBufferPool() override {
        for (auto &it : _pools) {
            CommandBufferPool &pool = it.second;
            if (pool.vkCommandPool != VK_NULL_HANDLE) {
                vkDestroyCommandPool(_device->vkDevice, pool.vkCommandPool, nullptr);
                pool.vkCommandPool = VK_NULL_HANDLE;
            }
            pool.usedCommandBuffers->clear();
            pool.commandBuffers->clear();
        }
        _pools.clear();
    }

    uint getHash(uint queueFamilyIndex) {
        return (queueFamilyIndex << 10) | _device->curBackBufferIndex;
    }
    static uint getBackBufferIndex(uint hash) {
        return hash & ((1 << 10) - 1);
    }

    void request(CCVKGPUCommandBuffer *gpuCommandBuffer) {
        uint hash = getHash(gpuCommandBuffer->queueFamilyIndex);

        if (_device->curBackBufferIndex != _lastBackBufferIndex) {
            reset();
            _lastBackBufferIndex = _device->curBackBufferIndex;
        }

        if (!_pools.count(hash)) {
            VkCommandPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO};
            createInfo.queueFamilyIndex = gpuCommandBuffer->queueFamilyIndex;
            createInfo.flags            = VK_COMMAND_POOL_CREATE_TRANSIENT_BIT;
            VK_CHECK(vkCreateCommandPool(_device->vkDevice, &createInfo, nullptr, &_pools[hash].vkCommandPool));
        }
        CommandBufferPool &pool = _pools[hash];

        CachedArray<VkCommandBuffer> &availableList = pool.commandBuffers[gpuCommandBuffer->level];
        if (availableList.size()) {
            gpuCommandBuffer->vkCommandBuffer = availableList.pop();
        } else {
            VkCommandBufferAllocateInfo allocateInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO};
            allocateInfo.commandPool        = pool.vkCommandPool;
            allocateInfo.commandBufferCount = 1;
            allocateInfo.level              = gpuCommandBuffer->level;
            VK_CHECK(vkAllocateCommandBuffers(_device->vkDevice, &allocateInfo, &gpuCommandBuffer->vkCommandBuffer));
        }
    }

    void yield(CCVKGPUCommandBuffer *gpuCommandBuffer) {
        if (gpuCommandBuffer->vkCommandBuffer) {
            uint hash = getHash(gpuCommandBuffer->queueFamilyIndex);
            CCASSERT(_pools.count(hash), "wrong command pool to yield?");

            CommandBufferPool &pool = _pools[hash];
            pool.usedCommandBuffers[gpuCommandBuffer->level].push(gpuCommandBuffer->vkCommandBuffer);
            gpuCommandBuffer->vkCommandBuffer = VK_NULL_HANDLE;
        }
    }

    void reset() {
        for (auto &it : _pools) {
            if (getBackBufferIndex(it.first) != _device->curBackBufferIndex) {
                continue;
            }
            CommandBufferPool &pool = it.second;

            bool needsReset = false;
            for (uint i = 0U; i < 2U; ++i) {
                CachedArray<VkCommandBuffer> &usedList = pool.usedCommandBuffers[i];
                if (usedList.size()) {
                    pool.commandBuffers[i].concat(usedList);
                    usedList.clear();
                    needsReset = true;
                }
            }
            if (needsReset) {
                VK_CHECK(vkResetCommandPool(_device->vkDevice, pool.vkCommandPool, 0));
            }
        }
    }

private:
    struct CommandBufferPool {
        VkCommandPool                vkCommandPool = VK_NULL_HANDLE;
        CachedArray<VkCommandBuffer> commandBuffers[2];
        CachedArray<VkCommandBuffer> usedCommandBuffers[2];
    };

    CCVKGPUDevice *_device              = nullptr;
    uint           _lastBackBufferIndex = 0U;

    unordered_map<uint, CommandBufferPool> _pools;
};

/**
 * Staging buffer pool, based on multiple fix-sized VkBuffer blocks.
 */
constexpr size_t               CHUNK_SIZE = 32 * 1024 * 1024; // 32M per block by default
class CCVKGPUStagingBufferPool final : public Object {
public:
    explicit CCVKGPUStagingBufferPool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUStagingBufferPool() override {
        for (Buffer &buffer : _pool) {
            vmaDestroyBuffer(_device->memoryAllocator, buffer.vkBuffer, buffer.vmaAllocation);
        }
        _pool.clear();
    }

    void alloc(CCVKGPUBuffer *gpuBuffer) { alloc(gpuBuffer, 1U); }
    void alloc(CCVKGPUBuffer *gpuBuffer, uint alignment) {
        size_t       bufferCount = _pool.size();
        Buffer *     buffer      = nullptr;
        VkDeviceSize offset      = 0U;
        for (size_t idx = 0U; idx < bufferCount; idx++) {
            Buffer *cur = &_pool[idx];
            offset      = roundUp(cur->curOffset, alignment);
            if (CHUNK_SIZE - offset >= gpuBuffer->size) {
                buffer = cur;
                break;
            }
        }
        if (!buffer) {
            _pool.resize(bufferCount + 1);
            buffer = &_pool.back();
            VkBufferCreateInfo bufferInfo{VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO};
            bufferInfo.size  = CHUNK_SIZE;
            bufferInfo.usage = VK_BUFFER_USAGE_TRANSFER_SRC_BIT | VK_BUFFER_USAGE_TRANSFER_DST_BIT;
            VmaAllocationCreateInfo allocInfo{};
            allocInfo.flags = VMA_ALLOCATION_CREATE_MAPPED_BIT;
            allocInfo.usage = VMA_MEMORY_USAGE_CPU_ONLY;
            VmaAllocationInfo res;
            VK_CHECK(vmaCreateBuffer(_device->memoryAllocator, &bufferInfo, &allocInfo, &buffer->vkBuffer, &buffer->vmaAllocation, &res));
            buffer->mappedData = reinterpret_cast<uint8_t *>(res.pMappedData);
            offset             = 0U;
        }
        gpuBuffer->vkBuffer    = buffer->vkBuffer;
        gpuBuffer->startOffset = offset;
        gpuBuffer->mappedData  = buffer->mappedData + offset;
        buffer->curOffset      = offset + gpuBuffer->size;
    }

    void reset() {
        for (Buffer &buffer : _pool) {
            buffer.curOffset = 0U;
        }
    }

private:
    struct Buffer {
        VkBuffer      vkBuffer      = VK_NULL_HANDLE;
        uint8_t *     mappedData    = nullptr;
        VmaAllocation vmaAllocation = VK_NULL_HANDLE;

        VkDeviceSize curOffset = 0U;
    };

    CCVKGPUDevice *_device = nullptr;
    vector<Buffer> _pool;
};

/**
 * Manages descriptor set update events, across all back buffer instances.
 */
class CCVKGPUDescriptorSetHub final : public Object {
public:
    explicit CCVKGPUDescriptorSetHub(CCVKGPUDevice *device)
    : _device(device) {
        _setsToBeUpdated.resize(device->backBufferCount);
        if (device->minorVersion > 0) {
            _updateFn = vkUpdateDescriptorSetWithTemplate;
        } else {
            _updateFn = vkUpdateDescriptorSetWithTemplateKHR;
        }
    }

    void record(const CCVKGPUDescriptorSet *gpuDescriptorSet) {
        update(gpuDescriptorSet);
        for (uint i = 0U; i < _device->backBufferCount; ++i) {
            if (i == _device->curBackBufferIndex) {
                _setsToBeUpdated[i].erase(gpuDescriptorSet);
            } else {
                _setsToBeUpdated[i].insert(gpuDescriptorSet);
            }
        }
    }

    void erase(CCVKGPUDescriptorSet *gpuDescriptorSet) {
        for (uint i = 0U; i < _device->backBufferCount; ++i) {
            if (_setsToBeUpdated[i].count(gpuDescriptorSet)) {
                _setsToBeUpdated[i].erase(gpuDescriptorSet);
            }
        }
    }

    void flush() {
        DescriptorSetList &sets = _setsToBeUpdated[_device->curBackBufferIndex];
        for (const auto *set : sets) {
            update(set);
        }
        sets.clear();
    }

private:
    void update(const CCVKGPUDescriptorSet *gpuDescriptorSet) {
        const CCVKGPUDescriptorSet::Instance &instance = gpuDescriptorSet->instances[_device->curBackBufferIndex];
        if (gpuDescriptorSet->gpuLayout->vkDescriptorUpdateTemplate) {
            _updateFn(_device->vkDevice, instance.vkDescriptorSet,
                      gpuDescriptorSet->gpuLayout->vkDescriptorUpdateTemplate, instance.descriptorInfos.data());
        } else {
            const vector<VkWriteDescriptorSet> &entries = instance.descriptorUpdateEntries;
            vkUpdateDescriptorSets(_device->vkDevice, utils::toUint(entries.size()), entries.data(), 0, nullptr);
        }
    }

    using DescriptorSetList = unordered_set<const CCVKGPUDescriptorSet *>;

    CCVKGPUDevice *                       _device = nullptr;
    vector<DescriptorSetList>             _setsToBeUpdated;
    PFN_vkUpdateDescriptorSetWithTemplate _updateFn = nullptr;
};

/**
 * Descriptor data maintenance hub, events like buffer/texture resizing,
 * descriptor set binding change, etc. should all request an update operation here.
 */
class CCVKGPUDescriptorHub final : public Object {
public:
    explicit CCVKGPUDescriptorHub(CCVKGPUDevice * /*device*/) {
    }

    void link(CCVKGPUDescriptorSetHub *descriptorSetHub) {
        _descriptorSetHub = descriptorSetHub;
    }

    void connect(const CCVKGPUDescriptorSet *set, const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor, uint instanceIdx) {
        _buffers[buffer].sets.insert(set);
        _buffers[buffer].descriptors.push(descriptor);
        _bufferInstanceIndices[descriptor] = instanceIdx;
    }
    void connect(const CCVKGPUDescriptorSet *set, const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        _textures[texture].sets.insert(set);
        _textures[texture].descriptors.push(descriptor);
    }
    void connect(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        _samplers[sampler].push(descriptor);
    }

    void update(const CCVKGPUBufferView *buffer) {
        for (const auto &it : _buffers) {
            if (it.first->gpuBuffer != buffer->gpuBuffer) continue;
            const auto &info = it.second;
            for (uint i = 0U; i < info.descriptors.size(); i++) {
                doUpdate(buffer, info.descriptors[i]);
            }
            for (const auto *set : info.sets) {
                _descriptorSetHub->record(set);
            }
        }
    }
    void update(const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        auto &descriptors = it->second.descriptors;
        for (uint i = 0U; i < descriptors.size(); i++) {
            if (descriptors[i] == descriptor) {
                doUpdate(buffer, descriptor);
                break;
            }
        }
    }
    void update(const CCVKGPUTextureView *texture) {
        for (const auto &it : _textures) {
            if (it.first->gpuTexture != texture->gpuTexture) continue;
            const auto &info = it.second;
            for (uint i = 0U; i < info.descriptors.size(); i++) {
                doUpdate(texture, info.descriptors[i]);
            }
            for (const auto *set : info.sets) {
                _descriptorSetHub->record(set);
            }
        }
    }
    void update(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        auto &descriptors = it->second.descriptors;
        for (uint i = 0U; i < descriptors.size(); i++) {
            if (descriptors[i] == descriptor) {
                doUpdate(texture, descriptor);
                break;
            }
        }
    }
    void update(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        auto it = _samplers.find(sampler);
        if (it == _samplers.end()) return;
        auto &descriptors = it->second;
        for (uint i = 0U; i < descriptors.size(); ++i) {
            if (descriptors[i] == descriptor) {
                doUpdate(sampler, descriptor);
                break;
            }
        }
    }
    // for resize events
    void update(const CCVKGPUBuffer *buffer, uint oldStartOffset) {
        for (const auto &it : _buffers) {
            if (it.first->gpuBuffer != buffer) continue;
            const auto &info = it.second;
            for (uint i = 0U; i < info.descriptors.size(); i++) {
                info.descriptors[i]->buffer = buffer->vkBuffer;
                info.descriptors[i]->offset += buffer->startOffset - oldStartOffset;
            }
            for (const auto *set : info.sets) {
                _descriptorSetHub->record(set);
            }
        }
    }

    void disengage(const CCVKGPUBufferView *buffer) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        for (uint i = 0; i < it->second.descriptors.size(); ++i) {
            _bufferInstanceIndices.erase(it->second.descriptors[i]);
        }
        _buffers.erase(it);
    }
    void disengage(const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        auto &descriptors = it->second.descriptors;
        descriptors.fastRemove(descriptors.indexOf(descriptor));
        _bufferInstanceIndices.erase(descriptor);
    }
    void disengage(const CCVKGPUTextureView *texture) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        _textures.erase(it);
    }
    void disengage(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        auto &descriptors = it->second.descriptors;
        descriptors.fastRemove(descriptors.indexOf(descriptor));
    }
    void disengage(const CCVKGPUSampler *sampler) {
        auto it = _samplers.find(sampler);
        if (it == _samplers.end()) return;
        _samplers.erase(it);
    }
    void disengage(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        auto it = _samplers.find(sampler);
        if (it == _samplers.end()) return;
        auto &descriptors = it->second;
        descriptors.fastRemove(descriptors.indexOf(descriptor));
    }

private:
    void doUpdate(const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor) {
        VkDeviceSize instanceOffset = _bufferInstanceIndices[descriptor] * buffer->gpuBuffer->instanceSize;
        descriptor->buffer          = buffer->gpuBuffer->vkBuffer;
        descriptor->offset          = buffer->gpuBuffer->startOffset + instanceOffset + buffer->offset;
        descriptor->range           = buffer->range;
    }

    static void doUpdate(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        descriptor->imageView = texture->vkImageView;
        if (hasFlag(texture->gpuTexture->flags, TextureFlagBit::GENERAL_LAYOUT)) {
            descriptor->imageLayout = VK_IMAGE_LAYOUT_GENERAL;
        } else {
            descriptor->imageLayout = VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL;
        }
    }

    static void doUpdate(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        descriptor->sampler = sampler->vkSampler;
    }

    template <typename T>
    struct DescriptorInfo {
        unordered_set<const CCVKGPUDescriptorSet *> sets;
        CachedArray<T *>                            descriptors;
    };

    unordered_map<const VkDescriptorBufferInfo *, uint>                              _bufferInstanceIndices;
    unordered_map<const CCVKGPUBufferView *, DescriptorInfo<VkDescriptorBufferInfo>> _buffers;
    unordered_map<const CCVKGPUTextureView *, DescriptorInfo<VkDescriptorImageInfo>> _textures;
    unordered_map<const CCVKGPUSampler *, CachedArray<VkDescriptorImageInfo *>>      _samplers;

    CCVKGPUDescriptorSetHub *_descriptorSetHub = nullptr;
};

/**
 * Recycle bin for GPU resources, clears after vkDeviceWaitIdle every frame.
 * All the destroy events will be postponed to that time.
 */
class CCVKGPURecycleBin final : public Object {
public:
    explicit CCVKGPURecycleBin(CCVKGPUDevice *device)
    : _device(device) {
        _resources.resize(16);
    }

#define DEFINE_RECYCLE_BIN_COLLECT_FN(_type, typeValue, expr)                  \
    void collect(_type *gpuRes) { /* NOLINT(bugprone-macro-parentheses) N/A */ \
        if (_resources.size() <= _count) {                                     \
            _resources.resize(_count * 2);                                     \
        }                                                                      \
        Resource &res = _resources[_count++];                                  \
        res.type      = typeValue;                                             \
        expr;                                                                  \
    }

    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUBuffer, RecycledType::BUFFER, (res.buffer = {gpuRes->vkBuffer, gpuRes->vmaAllocation}))
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUTexture, RecycledType::TEXTURE, (res.image = {gpuRes->vkImage, gpuRes->vmaAllocation}))
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUTextureView, RecycledType::TEXTURE_VIEW, res.vkImageView = gpuRes->vkImageView)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPURenderPass, RecycledType::RENDER_PASS, res.gpuRenderPass = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUFramebuffer, RecycledType::FRAMEBUFFER, res.gpuFramebuffer = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUSampler, RecycledType::SAMPLER, res.gpuSampler = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUShader, RecycledType::SHADER, res.gpuShader = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUDescriptorSetLayout, RecycledType::DESCRIPTOR_SET_LAYOUT, res.gpuDescriptorSetLayout = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUPipelineLayout, RecycledType::PIPELINE_LAYOUT, res.gpuPipelineLayout = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUPipelineState, RecycledType::PIPELINE_STATE, res.gpuPipelineState = gpuRes)

    void clear();

private:
    enum class RecycledType {
        UNKNOWN,
        BUFFER,
        TEXTURE,
        TEXTURE_VIEW,
        RENDER_PASS,
        FRAMEBUFFER,
        SAMPLER,
        SHADER,
        DESCRIPTOR_SET_LAYOUT,
        PIPELINE_LAYOUT,
        PIPELINE_STATE,
    };
    struct Buffer {
        VkBuffer      vkBuffer;
        VmaAllocation vmaAllocation;
    };
    struct Image {
        VkImage       vkImage;
        VmaAllocation vmaAllocation;
    };
    struct Resource {
        RecycledType type = RecycledType::UNKNOWN;
        union {
            // resizable resources, cannot take over directly
            // or descriptor sets won't work
            Buffer      buffer;
            Image       image;
            VkImageView vkImageView;

            CCVKGPURenderPass *         gpuRenderPass;
            CCVKGPUFramebuffer *        gpuFramebuffer;
            CCVKGPUSampler *            gpuSampler;
            CCVKGPUShader *             gpuShader;
            CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout;
            CCVKGPUPipelineLayout *     gpuPipelineLayout;
            CCVKGPUPipelineState *      gpuPipelineState;
        };
    };
    CCVKGPUDevice *  _device = nullptr;
    vector<Resource> _resources;
    uint             _count = 0U;
};

/**
 * Transport hub for data traveling between host and devices.
 * Record all transfer commands until batched submission.
 */
//#define ASYNC_BUFFER_UPDATE
class CCVKGPUTransportHub final : public Object {
public:
    CCVKGPUTransportHub(CCVKGPUDevice *device, CCVKGPUQueue *queue)
    : _device(device),
      _queue(queue) {
        _cmdBuff.level            = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        _cmdBuff.queueFamilyIndex = _queue->queueFamilyIndex;

        VkFenceCreateInfo createInfo{VK_STRUCTURE_TYPE_FENCE_CREATE_INFO};
        VK_CHECK(vkCreateFence(_device->vkDevice, &createInfo, nullptr, &_fence));
    }

    ~CCVKGPUTransportHub() override {
        if (_fence) {
            vkDestroyFence(_device->vkDevice, _fence, nullptr);
            _fence = VK_NULL_HANDLE;
        }
    }

    void link(CCVKGPUQueue *queue) {
        _queue = queue;

        _cmdBuff.level            = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        _cmdBuff.queueFamilyIndex = _queue->queueFamilyIndex;

        VkFenceCreateInfo createInfo{VK_STRUCTURE_TYPE_FENCE_CREATE_INFO};
        VK_CHECK(vkCreateFence(_device->vkDevice, &createInfo, nullptr, &_fence));
    }

    bool empty() const {
        return !_cmdBuff.vkCommandBuffer;
    }

    template <typename TFunc>
    void checkIn(const TFunc &record, bool immediateSubmission = false) {
        CCVKGPUCommandBufferPool *commandBufferPool = _device->getCommandBufferPool();

        if (!_cmdBuff.vkCommandBuffer) {
            commandBufferPool->request(&_cmdBuff);
            VkCommandBufferBeginInfo beginInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO};
            beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
            VK_CHECK(vkBeginCommandBuffer(_cmdBuff.vkCommandBuffer, &beginInfo));
        }

        record(&_cmdBuff);

        if (immediateSubmission) {
            VK_CHECK(vkEndCommandBuffer(_cmdBuff.vkCommandBuffer));
            VkSubmitInfo submitInfo{VK_STRUCTURE_TYPE_SUBMIT_INFO};
            submitInfo.commandBufferCount = 1;
            submitInfo.pCommandBuffers    = &_cmdBuff.vkCommandBuffer;
            VK_CHECK(vkQueueSubmit(_queue->vkQueue, 1, &submitInfo, _fence));
            VK_CHECK(vkWaitForFences(_device->vkDevice, 1, &_fence, VK_TRUE, DEFAULT_TIMEOUT));
            vkResetFences(_device->vkDevice, 1, &_fence);
            commandBufferPool->yield(&_cmdBuff);
            _cmdBuff.vkCommandBuffer = VK_NULL_HANDLE;
        }
    }

    VkCommandBuffer packageForFlight() {
        VkCommandBuffer vkCommandBuffer = _cmdBuff.vkCommandBuffer;
        if (vkCommandBuffer) {
            VK_CHECK(vkEndCommandBuffer(vkCommandBuffer));
            _device->getCommandBufferPool()->yield(&_cmdBuff);
        }
        return vkCommandBuffer;
    }

private:
    CCVKGPUDevice *_device = nullptr;

    CCVKGPUQueue *       _queue = nullptr;
    CCVKGPUCommandBuffer _cmdBuff;
    VkFence              _fence = VK_NULL_HANDLE;
};

class CCVKGPUBarrierManager final : public Object {
public:
    explicit CCVKGPUBarrierManager(CCVKGPUDevice *device)
    : _device(device) {}

    void checkIn(CCVKGPUBuffer *gpuBuffer) {
        _buffersToBeChecked.insert(gpuBuffer);
    }

    void checkIn(CCVKGPUTexture *gpuTexture, const ThsvsAccessType *newTypes = nullptr, uint newTypeCount = 0) {
        vector<ThsvsAccessType> &target = gpuTexture->renderAccessTypes;
        for (uint i = 0U; i < newTypeCount; ++i) {
            if (std::find(target.begin(), target.end(), newTypes[i]) == target.end()) {
                target.push_back(newTypes[i]);
            }
        }
        _texturesToBeChecked.insert(gpuTexture);
    }

    void update(CCVKGPUTransportHub *transportHub);

    inline void cancel(CCVKGPUBuffer *gpuBuffer) { _buffersToBeChecked.erase(gpuBuffer); }
    inline void cancel(CCVKGPUTexture *gpuTexture) { _texturesToBeChecked.erase(gpuTexture); }

private:
    unordered_set<CCVKGPUBuffer *>  _buffersToBeChecked;
    unordered_set<CCVKGPUTexture *> _texturesToBeChecked;
    CCVKGPUDevice *                 _device = nullptr;
};

/**
 * Manages buffer update events, across all back buffer instances.
 */
class CCVKGPUBufferHub final : public Object {
public:
    explicit CCVKGPUBufferHub(CCVKGPUDevice *device)
    : _device(device) {
        _buffersToBeUpdated.resize(device->backBufferCount);
    }

    void record(CCVKGPUBuffer *gpuBuffer, uint backBufferIndex, size_t size, bool canMemcpy) {
        for (uint i = 0U; i < _device->backBufferCount; ++i) {
            if (i == backBufferIndex) {
                _buffersToBeUpdated[i].erase(gpuBuffer);
            } else {
                _buffersToBeUpdated[i][gpuBuffer] = {backBufferIndex, size, canMemcpy};
            }
        }
    }

    void erase(CCVKGPUBuffer *gpuBuffer) {
        for (uint i = 0U; i < _device->backBufferCount; ++i) {
            if (_buffersToBeUpdated[i].count(gpuBuffer)) {
                _buffersToBeUpdated[i].erase(gpuBuffer);
            }
        }
    }

    void flush(CCVKGPUTransportHub *transportHub);

private:
    struct BufferUpdate {
        uint   srcIndex  = 0U;
        size_t size      = 0U;
        bool   canMemcpy = false;
    };

    vector<unordered_map<CCVKGPUBuffer *, BufferUpdate>> _buffersToBeUpdated;

    CCVKGPUDevice *_device = nullptr;
};

} // namespace gfx
} // namespace cc
