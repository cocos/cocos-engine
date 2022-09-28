/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "VKStd.h"
#include "VKUtils.h"
#include "base/Log.h"
#include "base/std/container/unordered_set.h"
#include "core/memop/CachedArray.h"
#include "gfx-base/GFXDeviceObject.h"

#define TBB_USE_EXCEPTIONS 0 // no-rtti for now
#include "tbb/concurrent_unordered_map.h"

namespace cc {
namespace gfx {

class CCVKGPUContext final {
public:
    bool initialize();
    void destroy();

    VkInstance vkInstance = VK_NULL_HANDLE;
    VkDebugUtilsMessengerEXT vkDebugUtilsMessenger = VK_NULL_HANDLE;
    VkDebugReportCallbackEXT vkDebugReport = VK_NULL_HANDLE;

    VkPhysicalDevice physicalDevice = VK_NULL_HANDLE;
    VkPhysicalDeviceFeatures physicalDeviceFeatures{};
    VkPhysicalDeviceFeatures2 physicalDeviceFeatures2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_FEATURES_2};
    VkPhysicalDeviceVulkan11Features physicalDeviceVulkan11Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_1_FEATURES};
    VkPhysicalDeviceVulkan12Features physicalDeviceVulkan12Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_2_FEATURES};
    VkPhysicalDeviceDepthStencilResolveProperties physicalDeviceDepthStencilResolveProperties{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_DEPTH_STENCIL_RESOLVE_PROPERTIES};
    VkPhysicalDeviceProperties physicalDeviceProperties{};
    VkPhysicalDeviceProperties2 physicalDeviceProperties2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_PROPERTIES_2};
    VkPhysicalDeviceMemoryProperties physicalDeviceMemoryProperties{};
    ccstd::vector<VkQueueFamilyProperties> queueFamilyProperties;

    uint32_t majorVersion = 0;
    uint32_t minorVersion = 0;

    bool validationEnabled = false;

    ccstd::vector<const char *> layers;
    ccstd::vector<const char *> extensions;

    inline bool checkExtension(const ccstd::string &extension) const {
        return std::any_of(extensions.begin(), extensions.end(), [&extension](auto &ext) {
            return std::strcmp(ext, extension.c_str()) == 0;
        });
    }

    VkSampleCountFlagBits getSampleCountForAttachments(Format format, VkFormat vkFormat, SampleCount sampleCount) const;
};

struct CCVKAccessInfo {
    VkPipelineStageFlags stageMask{0};
    VkAccessFlags accessMask{0};
    VkImageLayout imageLayout{VK_IMAGE_LAYOUT_UNDEFINED};
    bool hasWriteAccess{false};
};

struct CCVKGPUGeneralBarrier {
    VkPipelineStageFlags srcStageMask = 0U;
    VkPipelineStageFlags dstStageMask = 0U;
    VkMemoryBarrier vkBarrier{};

    ccstd::vector<ThsvsAccessType> prevAccesses;
    ccstd::vector<ThsvsAccessType> nextAccesses;

    ThsvsGlobalBarrier barrier{};
};

struct CCVKDeviceObjectDeleter {
    template <typename T>
    void operator()(T *ptr) const;
};

class CCVKGPUDeviceObject : public GFXDeviceObject<CCVKDeviceObjectDeleter> {
public:
    CCVKGPUDeviceObject() = default;
    ~CCVKGPUDeviceObject() = default;

    virtual void shutdown() {};
};

template <typename T>
void CCVKDeviceObjectDeleter::operator()(T *ptr) const {
    auto *object = const_cast<CCVKGPUDeviceObject*>(static_cast<const CCVKGPUDeviceObject*>(ptr));
    object->shutdown();
    delete object;
}

class CCVKGPURenderPass final : public CCVKGPUDeviceObject {
public:
    void shutdown() override;

    ColorAttachmentList colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    SubpassInfoList subpasses;
    SubpassDependencyList dependencies;

    VkRenderPass vkRenderPass;

    // helper storage
    ccstd::vector<VkClearValue> clearValues;
    ccstd::vector<VkSampleCountFlagBits> sampleCounts; // per subpass

    const CCVKGPUGeneralBarrier *getBarrier(size_t index, CCVKGPUDevice *gpuDevice) const;
};

struct CCVKGPUSwapchain;
struct CCVKGPUFramebuffer;
struct CCVKGPUTexture  : public CCVKGPUDeviceObject {
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    TextureUsage usage = TextureUsageBit::NONE;
    uint32_t width = 0U;
    uint32_t height = 0U;
    uint32_t depth = 1U;
    uint32_t size = 0U;
    uint32_t arrayLayers = 1U;
    uint32_t mipLevels = 1U;
    SampleCount samples = SampleCount::ONE;
    TextureFlags flags = TextureFlagBit::NONE;
    VkImageAspectFlags aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
    bool memoryless = false;

    VkImage vkImage = VK_NULL_HANDLE;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;

    CCVKGPUSwapchain *swapchain = nullptr;
    ccstd::vector<VkImage> swapchainVkImages;
    ccstd::vector<VmaAllocation> swapchainVmaAllocations;

    ccstd::vector<ThsvsAccessType> currentAccessTypes;

    // for barrier manager
    ccstd::vector<ThsvsAccessType> renderAccessTypes; // gathered from descriptor sets
    ThsvsAccessType transferAccess = THSVS_ACCESS_NONE;
};

struct CCVKGPUTextureView  : public CCVKGPUDeviceObject {
    CCVKGPUTexture *gpuTexture = nullptr;
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    uint32_t baseLevel = 0U;
    uint32_t levelCount = 1U;
    uint32_t baseLayer = 0U;
    uint32_t layerCount = 1U;

    ccstd::vector<VkImageView> swapchainVkImageViews;

    // descriptor infos
    VkImageView vkImageView = VK_NULL_HANDLE;
};

struct CCVKGPUSampler  : public CCVKGPUDeviceObject {
    Filter minFilter = Filter::LINEAR;
    Filter magFilter = Filter::LINEAR;
    Filter mipFilter = Filter::NONE;
    Address addressU = Address::WRAP;
    Address addressV = Address::WRAP;
    Address addressW = Address::WRAP;
    uint32_t maxAnisotropy = 0U;
    ComparisonFunc cmpFunc = ComparisonFunc::NEVER;

    // descriptor infos
    VkSampler vkSampler;
};

struct CCVKGPUBuffer  : public CCVKGPUDeviceObject {
    BufferUsage usage = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint32_t stride = 0U;
    uint32_t count = 0U;
    void *buffer = nullptr;

    bool isDrawIndirectByIndex = false;
    ccstd::vector<VkDrawIndirectCommand> indirectCmds;
    ccstd::vector<VkDrawIndexedIndirectCommand> indexedIndirectCmds;

    uint8_t *mappedData = nullptr;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;

    // descriptor infos
    VkBuffer vkBuffer = VK_NULL_HANDLE;
    VkDeviceSize startOffset = 0U;
    VkDeviceSize size = 0U;

    VkDeviceSize instanceSize = 0U; // per-back-buffer instance
    ccstd::vector<ThsvsAccessType> currentAccessTypes;

    // for barrier manager
    ccstd::vector<ThsvsAccessType> renderAccessTypes; // gathered from descriptor sets
    ThsvsAccessType transferAccess = THSVS_ACCESS_NONE;

    VkDeviceSize getStartOffset(uint32_t curBackBufferIndex) const {
        return startOffset + instanceSize * curBackBufferIndex;
    }
};

struct CCVKGPUBufferView  : public CCVKGPUDeviceObject {
    CCVKGPUBuffer *gpuBuffer = nullptr;
    uint32_t offset = 0U;
    uint32_t range = 0U;

    VkDeviceSize getStartOffset(uint32_t curBackBufferIndex) const {
        return gpuBuffer->getStartOffset(curBackBufferIndex) + offset;
    }
};

struct CCVKGPUFramebuffer  : public CCVKGPUDeviceObject {
    void shutdown() override;

    ConstPtr<CCVKGPURenderPass> gpuRenderPass;
    ccstd::vector<CCVKGPUTextureView *> gpuColorViews;
    CCVKGPUTextureView *gpuDepthStencilView = nullptr;
    VkFramebuffer vkFramebuffer = VK_NULL_HANDLE;
    std::vector<VkFramebuffer> vkFrameBuffers;
    CCVKGPUSwapchain *swapchain = nullptr;
    bool isOffscreen = true;
    uint32_t width = 0U;
    uint32_t height = 0U;
};

struct CCVKGPUSwapchain : public CCVKGPUDeviceObject {
    VkSurfaceKHR vkSurface = VK_NULL_HANDLE;
    VkSwapchainCreateInfoKHR createInfo{VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR};

    uint32_t curImageIndex = 0U;
    VkSwapchainKHR vkSwapchain = VK_NULL_HANDLE;
    ccstd::vector<VkBool32> queueFamilyPresentables;
    VkResult lastPresentResult = VK_NOT_READY;

    // external references
    ccstd::vector<VkImage> swapchainImages;
};

struct CCVKGPUCommandBuffer : public CCVKGPUDeviceObject {
    VkCommandBuffer vkCommandBuffer = VK_NULL_HANDLE;
    VkCommandBufferLevel level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
    uint32_t queueFamilyIndex = 0U;
    bool began = false;
    mutable ccstd::unordered_set<VkBuffer> recordedBuffers;
};

struct CCVKGPUQueue {
    QueueType type = QueueType::GRAPHICS;
    VkQueue vkQueue = VK_NULL_HANDLE;
    uint32_t queueFamilyIndex = 0U;
    ccstd::vector<uint32_t> possibleQueueFamilyIndices;
    ccstd::vector<VkSemaphore> lastSignaledSemaphores;
    ccstd::vector<VkPipelineStageFlags> submitStageMasks;
    ccstd::vector<VkCommandBuffer> commandBuffers;
};

struct CCVKGPUQueryPool : public CCVKGPUDeviceObject {
    void shutdown() override;

    QueryType type{QueryType::OCCLUSION};
    uint32_t maxQueryObjects{0};
    bool forceWait{true};
    VkQueryPool vkPool{VK_NULL_HANDLE};
};

struct CCVKGPUShaderStage {
    CCVKGPUShaderStage(ShaderStageFlagBit t, ccstd::string s)
    : type(t),
      source(std::move(s)) {
    }
    ShaderStageFlagBit type = ShaderStageFlagBit::NONE;
    ccstd::string source;
    VkShaderModule vkShader = VK_NULL_HANDLE;
};

struct CCVKGPUShader : public CCVKGPUDeviceObject {
    void shutdown() override;

    ccstd::string name;
    AttributeList attributes;
    ccstd::vector<CCVKGPUShaderStage> gpuStages;
    bool initialized = false;
};

struct CCVKGPUInputAssembler : public CCVKGPUDeviceObject {

    AttributeList attributes;
    ccstd::vector<CCVKGPUBufferView *> gpuVertexBuffers;
    CCVKGPUBufferView *gpuIndexBuffer = nullptr;
    CCVKGPUBufferView *gpuIndirectBuffer = nullptr;
    ccstd::vector<VkBuffer> vertexBuffers;
    ccstd::vector<VkDeviceSize> vertexBufferOffsets;
};

union CCVKDescriptorInfo {
    VkDescriptorImageInfo image;
    VkDescriptorBufferInfo buffer;
    VkBufferView texelBufferView;
};
struct CCVKGPUDescriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    ccstd::vector<ThsvsAccessType> accessTypes;
    CCVKGPUBufferView *gpuBufferView = nullptr;
    CCVKGPUTextureView *gpuTextureView = nullptr;
    CCVKGPUSampler *gpuSampler = nullptr;
};

struct CCVKGPUDescriptorSetLayout;
struct CCVKGPUDescriptorSet : public CCVKGPUDeviceObject {
    void shutdown() override;

    ccstd::vector<CCVKGPUDescriptor> gpuDescriptors;

    // references
    ConstPtr<CCVKGPUDescriptorSetLayout> gpuLayout;

    struct Instance {
        VkDescriptorSet vkDescriptorSet = VK_NULL_HANDLE;
        ccstd::vector<CCVKDescriptorInfo> descriptorInfos;
        ccstd::vector<VkWriteDescriptorSet> descriptorUpdateEntries;
    };
    ccstd::vector<Instance> instances; // per swapchain image

    uint32_t layoutID = 0U;
};

struct CCVKGPUPipelineLayout : public CCVKGPUDeviceObject {
    void shutdown() override;

    ccstd::vector<ConstPtr<CCVKGPUDescriptorSetLayout>> setLayouts;

    VkPipelineLayout vkPipelineLayout = VK_NULL_HANDLE;

    // helper storage
    ccstd::vector<uint32_t> dynamicOffsetOffsets;
    uint32_t dynamicOffsetCount;
};

struct CCVKGPUPipelineState : public CCVKGPUDeviceObject {
    void shutdown() override;

    PipelineBindPoint bindPoint = PipelineBindPoint::GRAPHICS;
    PrimitiveMode primitive = PrimitiveMode::TRIANGLE_LIST;
    ConstPtr<CCVKGPUShader> gpuShader;
    ConstPtr<CCVKGPUPipelineLayout> gpuPipelineLayout;
    InputState inputState;
    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    DynamicStateList dynamicStates;
    ConstPtr<CCVKGPURenderPass> gpuRenderPass;
    uint32_t subpass = 0U;
    VkPipeline vkPipeline = VK_NULL_HANDLE;
};

struct CCVKGPUBufferBarrier {
    VkPipelineStageFlags srcStageMask = 0U;
    VkPipelineStageFlags dstStageMask = 0U;
    VkBufferMemoryBarrier vkBarrier{};

    ccstd::vector<ThsvsAccessType> prevAccesses;
    ccstd::vector<ThsvsAccessType> nextAccesses;

    ThsvsBufferBarrier barrier{};
};

struct CCVKGPUTextureBarrier {
    VkPipelineStageFlags srcStageMask = 0U;
    VkPipelineStageFlags dstStageMask = 0U;
    VkImageMemoryBarrier vkBarrier{};

    ccstd::vector<ThsvsAccessType> prevAccesses;
    ccstd::vector<ThsvsAccessType> nextAccesses;

    ThsvsImageBarrier barrier{};
};

class CCVKGPUCommandBufferPool;
class CCVKGPUDescriptorSetPool;
class CCVKGPUDevice final {
public:
    VkDevice vkDevice{VK_NULL_HANDLE};
    ccstd::vector<VkLayerProperties> layers;
    ccstd::vector<VkExtensionProperties> extensions;
    VmaAllocator memoryAllocator{VK_NULL_HANDLE};
    VkPipelineCache vkPipelineCache{VK_NULL_HANDLE};
    uint32_t minorVersion{0U};

    VkFormat depthFormat{VK_FORMAT_UNDEFINED};
    VkFormat depthStencilFormat{VK_FORMAT_UNDEFINED};

    uint32_t curBackBufferIndex{0U};
    uint32_t backBufferCount{3U};

    bool useDescriptorUpdateTemplate{false};
    bool useMultiDrawIndirect{false};

    PFN_vkCreateRenderPass2 createRenderPass2{nullptr};

    // for default backup usages
    CCVKGPUSampler defaultSampler;
    CCVKGPUTexture defaultTexture;
    CCVKGPUTextureView defaultTextureView;
    CCVKGPUBuffer defaultBuffer;

    CCVKGPUGeneralBarrier defaultColorBarrier;
    CCVKGPUGeneralBarrier defaultDepthStencilBarrier;

    ccstd::unordered_set<CCVKGPUSwapchain *> swapchains;

    CCVKGPUCommandBufferPool *getCommandBufferPool();
    CCVKGPUDescriptorSetPool *getDescriptorSetPool(uint32_t layoutID);

private:
    friend class CCVKDevice;

    // cannot use thread_local here because we need explicit control over their destruction
    using CommandBufferPools = tbb::concurrent_unordered_map<size_t, CCVKGPUCommandBufferPool *, std::hash<size_t>>;
    CommandBufferPools _commandBufferPools;

    ccstd::unordered_map<uint32_t, std::unique_ptr<CCVKGPUDescriptorSetPool>> _descriptorSetPools;
};

/**
 * A simple pool for reusing fences.
 */
class CCVKGPUFencePool final {
public:
    explicit CCVKGPUFencePool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUFencePool() {
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

        VkFence fence = VK_NULL_HANDLE;
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

    uint32_t size() const {
        return _count;
    }

private:
    CCVKGPUDevice *_device = nullptr;
    uint32_t _count = 0U;
    ccstd::vector<VkFence> _fences;
};

/**
 * A simple pool for reusing semaphores.
 */
class CCVKGPUSemaphorePool final {
public:
    explicit CCVKGPUSemaphorePool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUSemaphorePool() {
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

        VkSemaphore semaphore = VK_NULL_HANDLE;
        VkSemaphoreCreateInfo createInfo{VK_STRUCTURE_TYPE_SEMAPHORE_CREATE_INFO};
        VK_CHECK(vkCreateSemaphore(_device->vkDevice, &createInfo, nullptr, &semaphore));
        _semaphores.push_back(semaphore);
        _count++;

        return semaphore;
    }

    void reset() {
        _count = 0;
    }

    uint32_t size() const {
        return _count;
    }

private:
    CCVKGPUDevice *_device;
    uint32_t _count = 0U;
    ccstd::vector<VkSemaphore> _semaphores;
};

/**
 * Unlimited descriptor set pool, based on multiple fix-sized VkDescriptorPools.
 */
class CCVKGPUDescriptorSetPool final {
public:
    ~CCVKGPUDescriptorSetPool() {
        for (auto &pool : _pools) {
            vkDestroyDescriptorPool(_device->vkDevice, pool, nullptr);
        }
    }

    void link(CCVKGPUDevice *device, uint32_t maxSetsPerPool, const ccstd::vector<VkDescriptorSetLayoutBinding> &bindings, VkDescriptorSetLayout setLayout) {
        _device = device;
        _maxSetsPerPool = maxSetsPerPool;
        _setLayouts.insert(_setLayouts.cbegin(), _maxSetsPerPool, setLayout);

        ccstd::unordered_map<VkDescriptorType, uint32_t> typeMap;
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

    VkDescriptorSet request() {
        if (_freeList.empty()) {
            requestPool();
        }
        return pop();
    }

    void requestPool() {
        VkDescriptorPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO};
        createInfo.maxSets = _maxSetsPerPool;
        createInfo.poolSizeCount = utils::toUint(_poolSizes.size());
        createInfo.pPoolSizes = _poolSizes.data();

        VkDescriptorPool descriptorPool = VK_NULL_HANDLE;
        VK_CHECK(vkCreateDescriptorPool(_device->vkDevice, &createInfo, nullptr, &descriptorPool));
        _pools.push_back(descriptorPool);

        std::vector<VkDescriptorSet> sets(_maxSetsPerPool, VK_NULL_HANDLE);
        VkDescriptorSetAllocateInfo info{VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO};
        info.pSetLayouts = _setLayouts.data();
        info.descriptorSetCount = _maxSetsPerPool;
        info.descriptorPool = descriptorPool;
        VK_CHECK(vkAllocateDescriptorSets(_device->vkDevice, &info, sets.data()));

        _freeList.insert(_freeList.end(), sets.begin(), sets.end());
    }

    void yield(VkDescriptorSet set) {
        _freeList.emplace_back(set);
    }

private:
    VkDescriptorSet pop() {
        VkDescriptorSet output = VK_NULL_HANDLE;
        if (!_freeList.empty()) {
            output = _freeList.back();
            _freeList.pop_back();
            return output;
        }
        return VK_NULL_HANDLE;
    }

    CCVKGPUDevice *_device = nullptr;

    ccstd::vector<VkDescriptorPool> _pools;
    ccstd::vector<VkDescriptorSet> _freeList;

    ccstd::vector<VkDescriptorPoolSize> _poolSizes;
    ccstd::vector<VkDescriptorSetLayout> _setLayouts;
    uint32_t _maxSetsPerPool = 0U;
};

struct CCVKGPUDescriptorSetLayout : public CCVKGPUDeviceObject {
    void shutdown() override;

    DescriptorSetLayoutBindingList bindings;
    ccstd::vector<uint32_t> dynamicBindings;

    ccstd::vector<VkDescriptorSetLayoutBinding> vkBindings;
    VkDescriptorSetLayout vkDescriptorSetLayout = VK_NULL_HANDLE;
    VkDescriptorUpdateTemplate vkDescriptorUpdateTemplate = VK_NULL_HANDLE;
    VkDescriptorSet defaultDescriptorSet = VK_NULL_HANDLE;

    ccstd::vector<uint32_t> bindingIndices;
    ccstd::vector<uint32_t> descriptorIndices;
    uint32_t descriptorCount = 0U;

    uint32_t id = 0U;
    uint32_t maxSetsPerPool = 10U;
};

/**
 * Command buffer pool based on VkCommandPools, always try to reuse previous allocations first.
 */
class CCVKGPUCommandBufferPool final {
public:
    explicit CCVKGPUCommandBufferPool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUCommandBufferPool() {
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

    uint32_t getHash(uint32_t queueFamilyIndex) {
        return (queueFamilyIndex << 10) | _device->curBackBufferIndex;
    }
    static uint32_t getBackBufferIndex(uint32_t hash) {
        return hash & ((1 << 10) - 1);
    }

    void request(CCVKGPUCommandBuffer *gpuCommandBuffer) {
        uint32_t hash = getHash(gpuCommandBuffer->queueFamilyIndex);

        if (_device->curBackBufferIndex != _lastBackBufferIndex) {
            reset();
            _lastBackBufferIndex = _device->curBackBufferIndex;
        }

        if (!_pools.count(hash)) {
            VkCommandPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO};
            createInfo.queueFamilyIndex = gpuCommandBuffer->queueFamilyIndex;
            createInfo.flags = VK_COMMAND_POOL_CREATE_TRANSIENT_BIT;
            VK_CHECK(vkCreateCommandPool(_device->vkDevice, &createInfo, nullptr, &_pools[hash].vkCommandPool));
        }
        CommandBufferPool &pool = _pools[hash];

        CachedArray<VkCommandBuffer> &availableList = pool.commandBuffers[gpuCommandBuffer->level];
        if (availableList.size()) {
            gpuCommandBuffer->vkCommandBuffer = availableList.pop();
        } else {
            VkCommandBufferAllocateInfo allocateInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO};
            allocateInfo.commandPool = pool.vkCommandPool;
            allocateInfo.commandBufferCount = 1;
            allocateInfo.level = gpuCommandBuffer->level;
            VK_CHECK(vkAllocateCommandBuffers(_device->vkDevice, &allocateInfo, &gpuCommandBuffer->vkCommandBuffer));
        }
    }

    void yield(CCVKGPUCommandBuffer *gpuCommandBuffer) {
        if (gpuCommandBuffer->vkCommandBuffer) {
            uint32_t hash = getHash(gpuCommandBuffer->queueFamilyIndex);
            CC_ASSERT(_pools.count(hash)); // Wrong command pool to yield?

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
            for (uint32_t i = 0U; i < 2U; ++i) {
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
        VkCommandPool vkCommandPool = VK_NULL_HANDLE;
        CachedArray<VkCommandBuffer> commandBuffers[2];
        CachedArray<VkCommandBuffer> usedCommandBuffers[2];
    };

    CCVKGPUDevice *_device = nullptr;
    uint32_t _lastBackBufferIndex = 0U;

    ccstd::unordered_map<uint32_t, CommandBufferPool> _pools;
};

/**
 * Staging buffer pool, based on multiple fix-sized VkBuffer blocks.
 */
class CCVKGPUStagingBufferPool final {
public:
    static constexpr size_t CHUNK_SIZE = 16 * 1024 * 1024; // 16M per block by default

    explicit CCVKGPUStagingBufferPool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUStagingBufferPool() {
        for (Buffer &buffer : _pool) {
            vmaDestroyBuffer(_device->memoryAllocator, buffer.vkBuffer, buffer.vmaAllocation);
        }
        _pool.clear();
    }

    void alloc(CCVKGPUBuffer *gpuBuffer) { alloc(gpuBuffer, 1U); }
    void alloc(CCVKGPUBuffer *gpuBuffer, uint32_t alignment) {
        CC_ASSERT(gpuBuffer->size <= CHUNK_SIZE);

        size_t bufferCount = _pool.size();
        Buffer *buffer = nullptr;
        VkDeviceSize offset = 0U;
        for (size_t idx = 0U; idx < bufferCount; idx++) {
            Buffer *cur = &_pool[idx];
            offset = roundUp(cur->curOffset, alignment);
            if (CHUNK_SIZE - offset >= gpuBuffer->size) {
                buffer = cur;
                break;
            }
        }
        if (!buffer) {
            _pool.resize(bufferCount + 1);
            buffer = &_pool.back();
            VkBufferCreateInfo bufferInfo{VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO};
            bufferInfo.size = CHUNK_SIZE;
            bufferInfo.usage = VK_BUFFER_USAGE_TRANSFER_SRC_BIT | VK_BUFFER_USAGE_TRANSFER_DST_BIT;
            VmaAllocationCreateInfo allocInfo{};
            allocInfo.flags = VMA_ALLOCATION_CREATE_MAPPED_BIT;
            allocInfo.usage = VMA_MEMORY_USAGE_CPU_ONLY;
            VmaAllocationInfo res;
            VK_CHECK(vmaCreateBuffer(_device->memoryAllocator, &bufferInfo, &allocInfo, &buffer->vkBuffer, &buffer->vmaAllocation, &res));
            buffer->mappedData = reinterpret_cast<uint8_t *>(res.pMappedData);
            offset = 0U;
        }
        gpuBuffer->vkBuffer = buffer->vkBuffer;
        gpuBuffer->startOffset = offset;
        gpuBuffer->mappedData = buffer->mappedData + offset;
        buffer->curOffset = offset + gpuBuffer->size;
    }

    void reset() {
        for (Buffer &buffer : _pool) {
            buffer.curOffset = 0U;
        }
    }

private:
    struct Buffer {
        VkBuffer vkBuffer = VK_NULL_HANDLE;
        uint8_t *mappedData = nullptr;
        VmaAllocation vmaAllocation = VK_NULL_HANDLE;

        VkDeviceSize curOffset = 0U;
    };

    CCVKGPUDevice *_device = nullptr;
    ccstd::vector<Buffer> _pool;
};

/**
 * Manages descriptor set update events, across all back buffer instances.
 */
class CCVKGPUDescriptorSetHub final {
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
        for (uint32_t i = 0U; i < _device->backBufferCount; ++i) {
            if (i == _device->curBackBufferIndex) {
                _setsToBeUpdated[i].erase(gpuDescriptorSet);
            } else {
                _setsToBeUpdated[i].insert(gpuDescriptorSet);
            }
        }
    }

    void erase(CCVKGPUDescriptorSet *gpuDescriptorSet) {
        for (uint32_t i = 0U; i < _device->backBufferCount; ++i) {
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

    void updateBackBufferCount(uint32_t backBufferCount) {
        _setsToBeUpdated.resize(backBufferCount);
    }

private:
    void update(const CCVKGPUDescriptorSet *gpuDescriptorSet) {
        const CCVKGPUDescriptorSet::Instance &instance = gpuDescriptorSet->instances[_device->curBackBufferIndex];
        if (gpuDescriptorSet->gpuLayout->vkDescriptorUpdateTemplate) {
            _updateFn(_device->vkDevice, instance.vkDescriptorSet,
                      gpuDescriptorSet->gpuLayout->vkDescriptorUpdateTemplate, instance.descriptorInfos.data());
        } else {
            const ccstd::vector<VkWriteDescriptorSet> &entries = instance.descriptorUpdateEntries;
            vkUpdateDescriptorSets(_device->vkDevice, utils::toUint(entries.size()), entries.data(), 0, nullptr);
        }
    }

    using DescriptorSetList = ccstd::unordered_set<const CCVKGPUDescriptorSet *>;

    CCVKGPUDevice *_device = nullptr;
    ccstd::vector<DescriptorSetList> _setsToBeUpdated;
    PFN_vkUpdateDescriptorSetWithTemplate _updateFn = nullptr;
};

/**
 * Descriptor data maintenance hub, events like buffer/texture resizing,
 * descriptor set binding change, etc. should all request an update operation here.
 */
class CCVKGPUDescriptorHub final {
public:
    explicit CCVKGPUDescriptorHub(CCVKGPUDevice * /*device*/) {
    }

    void link(CCVKGPUDescriptorSetHub *descriptorSetHub) {
        _descriptorSetHub = descriptorSetHub;
    }

    void connect(const CCVKGPUDescriptorSet *set, const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor, uint32_t instanceIdx) {
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
            for (uint32_t i = 0U; i < info.descriptors.size(); i++) {
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
        for (uint32_t i = 0U; i < descriptors.size(); i++) {
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
            for (uint32_t i = 0U; i < info.descriptors.size(); i++) {
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
        for (uint32_t i = 0U; i < descriptors.size(); i++) {
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
        for (uint32_t i = 0U; i < descriptors.size(); ++i) {
            if (descriptors[i] == descriptor) {
                doUpdate(sampler, descriptor);
                break;
            }
        }
    }
    // for resize events
    void update(const CCVKGPUBuffer *buffer) {
        for (const auto &it : _buffers) {
            if (it.first->gpuBuffer != buffer) continue;
            const auto &info = it.second;
            for (uint32_t i = 0U; i < info.descriptors.size(); i++) {
                doUpdate(it.first, info.descriptors[i]);
            }
            for (const auto *set : info.sets) {
                _descriptorSetHub->record(set);
            }
        }
    }
    void update(const CCVKGPUTexture *texture) {
        for (auto &it : _textures) {
            if (it.first->gpuTexture != texture) continue;
            const auto &info = it.second;
            for (uint32_t i = 0U; i < info.descriptors.size(); i++) {
                doUpdate(it.first, info.descriptors[i]);
            }
            for (const auto *set : info.sets) {
                _descriptorSetHub->record(set);
            }
        }
    }

    void disengage(const CCVKGPUBufferView *buffer) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        for (uint32_t i = 0; i < it->second.descriptors.size(); ++i) {
            _bufferInstanceIndices.erase(it->second.descriptors[i]);
        }
        _buffers.erase(it);
    }
    void disengage(const CCVKGPUDescriptorSet *set, const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        it->second.sets.erase(set);
        auto &descriptors = it->second.descriptors;
        descriptors.fastRemove(descriptors.indexOf(descriptor));
        _bufferInstanceIndices.erase(descriptor);
    }
    void disengage(const CCVKGPUTextureView *texture) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        _textures.erase(it);
    }
    void disengage(const CCVKGPUDescriptorSet *set, const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        it->second.sets.erase(set);
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
        descriptor->buffer = buffer->gpuBuffer->vkBuffer;
        descriptor->offset = buffer->getStartOffset(_bufferInstanceIndices[descriptor]);
        descriptor->range = buffer->range;
    }

    static void doUpdate(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        descriptor->imageView = texture->vkImageView;
        if (hasFlag(texture->gpuTexture->flags, TextureFlagBit::GENERAL_LAYOUT)) {
            descriptor->imageLayout = VK_IMAGE_LAYOUT_GENERAL;
        } else {
            if (hasFlag(texture->gpuTexture->usage, TextureUsage::DEPTH_STENCIL_ATTACHMENT)) {
                descriptor->imageLayout = VK_IMAGE_LAYOUT_DEPTH_STENCIL_READ_ONLY_OPTIMAL;
            } else {
                descriptor->imageLayout = VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL;
            }
        }
    }

    static void doUpdate(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        descriptor->sampler = sampler->vkSampler;
    }

    template <typename T>
    struct DescriptorInfo {
        ccstd::unordered_set<const CCVKGPUDescriptorSet *> sets;
        CachedArray<T *> descriptors;
    };

    ccstd::unordered_map<const VkDescriptorBufferInfo *, uint32_t> _bufferInstanceIndices;
    ccstd::unordered_map<const CCVKGPUBufferView *, DescriptorInfo<VkDescriptorBufferInfo>> _buffers;
    ccstd::unordered_map<const CCVKGPUTextureView *, DescriptorInfo<VkDescriptorImageInfo>> _textures;
    ccstd::unordered_map<const CCVKGPUSampler *, CachedArray<VkDescriptorImageInfo *>> _samplers;

    CCVKGPUDescriptorSetHub *_descriptorSetHub = nullptr;
};

/**
 * Recycle bin for GPU resources, clears after vkDeviceWaitIdle every frame.
 * All the destroy events will be postponed to that time.
 */
class CCVKGPURecycleBin final {
public:
    explicit CCVKGPURecycleBin(CCVKGPUDevice *device)
    : _device(device) {
        _resources.resize(16);
    }

    void collect(const CCVKGPUTexture *texture);
    void collect(const CCVKGPUTextureView *textureView);
    void collect(const CCVKGPUFramebuffer *frameBuffer);
    void collect(const CCVKGPUDescriptorSet *set);
    void collect(uint32_t layoutId, VkDescriptorSet set);
    void collect(const CCVKGPUBuffer *buffer);

#define DEFINE_RECYCLE_BIN_COLLECT_FN(_type, typeValue, expr)                           \
    void collect(const _type *gpuRes) { /* NOLINT(bugprone-macro-parentheses) N/A */ \
        Resource &res = emplaceBack();                                                  \
        res.type = typeValue;                                                           \
        expr;                                                                           \
    }

    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPURenderPass, RecycledType::RENDER_PASS, res.vkRenderPass = gpuRes->vkRenderPass)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUSampler, RecycledType::SAMPLER, res.vkSampler = gpuRes->vkSampler)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUQueryPool, RecycledType::QUERY_POOL, res.vkQueryPool = gpuRes->vkPool)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUPipelineState, RecycledType::PIPELINE_STATE, res.vkPipeline = gpuRes->vkPipeline)

    void clear();

private:
    enum class RecycledType {
        UNKNOWN,
        BUFFER,
        BUFFER_VIEW,
        TEXTURE,
        TEXTURE_VIEW,
        FRAMEBUFFER,
        QUERY_POOL,
        RENDER_PASS,
        SAMPLER,
        PIPELINE_STATE,
        DESCRIPTOR_SET,
        EVENT
    };
    struct Buffer {
        VkBuffer vkBuffer;
        VmaAllocation vmaAllocation;
    };
    struct Image {
        VkImage vkImage;
        VmaAllocation vmaAllocation;
    };
    struct Set {
        uint32_t layoutId;
        VkDescriptorSet vkSet;
    };
    struct Resource {
        RecycledType type = RecycledType::UNKNOWN;
        union {
            // resizable resources, cannot take over directly
            // or descriptor sets won't work
            Buffer buffer;
            Image image;
            Set set;
            VkBufferView vkBufferView;
            VkImageView vkImageView;
            VkFramebuffer vkFramebuffer;
            VkQueryPool vkQueryPool;
            VkRenderPass vkRenderPass;
            VkSampler vkSampler;
            VkEvent vkEvent;
            VkPipeline vkPipeline;
        };
    };

    Resource &emplaceBack() {
        if (_resources.size() <= _count) {
            _resources.resize(_count * 2);
        }
        return _resources[_count++];
    }

    CCVKGPUDevice *_device = nullptr;
    ccstd::vector<Resource> _resources;
    size_t _count = 0U;
};

/**
 * Transport hub for data traveling between host and devices.
 * Record all transfer commands until batched submission.
 */
//#define ASYNC_BUFFER_UPDATE
class CCVKGPUTransportHub final {
public:
    CCVKGPUTransportHub(CCVKGPUDevice *device, CCVKGPUQueue *queue)
    : _device(device),
      _queue(queue) {
        _earlyCmdBuff.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        _earlyCmdBuff.queueFamilyIndex = _queue->queueFamilyIndex;

        _lateCmdBuff.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        _lateCmdBuff.queueFamilyIndex = _queue->queueFamilyIndex;

        VkFenceCreateInfo createInfo{VK_STRUCTURE_TYPE_FENCE_CREATE_INFO};
        VK_CHECK(vkCreateFence(_device->vkDevice, &createInfo, nullptr, &_fence));
    }

    ~CCVKGPUTransportHub() {
        if (_fence) {
            vkDestroyFence(_device->vkDevice, _fence, nullptr);
            _fence = VK_NULL_HANDLE;
        }
    }

    bool empty(bool late) const {
        const CCVKGPUCommandBuffer *cmdBuff = late ? &_lateCmdBuff : &_earlyCmdBuff;

        return !cmdBuff->vkCommandBuffer;
    }

    template <typename TFunc>
    void checkIn(const TFunc &record, bool immediateSubmission = false, bool late = false) {
        CCVKGPUCommandBufferPool *commandBufferPool = _device->getCommandBufferPool();
        CCVKGPUCommandBuffer *cmdBuff = late ? &_lateCmdBuff : &_earlyCmdBuff;

        if (!cmdBuff->vkCommandBuffer) {
            commandBufferPool->request(cmdBuff);
            VkCommandBufferBeginInfo beginInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO};
            beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
            VK_CHECK(vkBeginCommandBuffer(cmdBuff->vkCommandBuffer, &beginInfo));
        }

        record(cmdBuff);

        if (immediateSubmission) {
            VK_CHECK(vkEndCommandBuffer(cmdBuff->vkCommandBuffer));
            VkSubmitInfo submitInfo{VK_STRUCTURE_TYPE_SUBMIT_INFO};
            submitInfo.commandBufferCount = 1;
            submitInfo.pCommandBuffers = &cmdBuff->vkCommandBuffer;
            VK_CHECK(vkQueueSubmit(_queue->vkQueue, 1, &submitInfo, _fence));
            VK_CHECK(vkWaitForFences(_device->vkDevice, 1, &_fence, VK_TRUE, DEFAULT_TIMEOUT));
            vkResetFences(_device->vkDevice, 1, &_fence);
            commandBufferPool->yield(cmdBuff);
            cmdBuff->vkCommandBuffer = VK_NULL_HANDLE;
        }
    }

    VkCommandBuffer packageForFlight(bool late) {
        CCVKGPUCommandBuffer *cmdBuff = late ? &_lateCmdBuff : &_earlyCmdBuff;

        VkCommandBuffer vkCommandBuffer = cmdBuff->vkCommandBuffer;
        if (vkCommandBuffer) {
            VK_CHECK(vkEndCommandBuffer(vkCommandBuffer));
            _device->getCommandBufferPool()->yield(cmdBuff);
        }
        return vkCommandBuffer;
    }

private:
    CCVKGPUDevice *_device = nullptr;

    CCVKGPUQueue *_queue = nullptr;
    CCVKGPUCommandBuffer _earlyCmdBuff;
    CCVKGPUCommandBuffer _lateCmdBuff;
    VkFence _fence = VK_NULL_HANDLE;
};

class CCVKGPUBarrierManager final {
public:
    explicit CCVKGPUBarrierManager(CCVKGPUDevice *device)
    : _device(device) {}

    void checkIn(CCVKGPUBuffer *gpuBuffer) {
        _buffersToBeChecked.insert(gpuBuffer);
    }

    void checkIn(CCVKGPUTexture *gpuTexture, const ThsvsAccessType *newTypes = nullptr, uint32_t newTypeCount = 0) {
        ccstd::vector<ThsvsAccessType> &target = gpuTexture->renderAccessTypes;
        for (uint32_t i = 0U; i < newTypeCount; ++i) {
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
    ccstd::unordered_set<CCVKGPUBuffer *> _buffersToBeChecked;
    ccstd::unordered_set<CCVKGPUTexture *> _texturesToBeChecked;
    CCVKGPUDevice *_device = nullptr;
};

/**
 * Manages buffer update events, across all back buffer instances.
 */
class CCVKGPUBufferHub final {
public:
    explicit CCVKGPUBufferHub(CCVKGPUDevice *device)
    : _device(device) {
        _buffersToBeUpdated.resize(device->backBufferCount);
    }

    void record(CCVKGPUBuffer *gpuBuffer, uint32_t backBufferIndex, size_t size, bool canMemcpy) {
        for (uint32_t i = 0U; i < _device->backBufferCount; ++i) {
            if (i == backBufferIndex) {
                _buffersToBeUpdated[i].erase(gpuBuffer);
            } else {
                _buffersToBeUpdated[i][gpuBuffer] = {backBufferIndex, size, canMemcpy};
            }
        }
    }

    void erase(CCVKGPUBuffer *gpuBuffer) {
        for (uint32_t i = 0U; i < _device->backBufferCount; ++i) {
            if (_buffersToBeUpdated[i].count(gpuBuffer)) {
                _buffersToBeUpdated[i].erase(gpuBuffer);
            }
        }
    }

    void updateBackBufferCount(uint32_t backBufferCount) {
        _buffersToBeUpdated.resize(backBufferCount);
    }

    void flush(CCVKGPUTransportHub *transportHub);

private:
    struct BufferUpdate {
        uint32_t srcIndex = 0U;
        size_t size = 0U;
        bool canMemcpy = false;
    };

    ccstd::vector<ccstd::unordered_map<CCVKGPUBuffer *, BufferUpdate>> _buffersToBeUpdated;

    CCVKGPUDevice *_device = nullptr;
};

} // namespace gfx
} // namespace cc
