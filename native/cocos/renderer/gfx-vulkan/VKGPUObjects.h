/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#ifndef CC_GFXVULKAN_GPU_OBJECTS_H_
#define CC_GFXVULKAN_GPU_OBJECTS_H_

#include "VKUtils.h"
#include "vulkan/vulkan_core.h"

namespace cc {
namespace gfx {

class CCVKGPUContext final : public Object {
public:
    VkInstance vkInstance = VK_NULL_HANDLE;
    VkDebugUtilsMessengerEXT vkDebugUtilsMessenger = VK_NULL_HANDLE;
    VkDebugReportCallbackEXT vkDebugReport = VK_NULL_HANDLE;

    VkPhysicalDevice physicalDevice = VK_NULL_HANDLE;
    VkPhysicalDeviceFeatures physicalDeviceFeatures{};
    VkPhysicalDeviceFeatures2 physicalDeviceFeatures2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_FEATURES_2};
    VkPhysicalDeviceVulkan11Features physicalDeviceVulkan11Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_1_FEATURES};
    VkPhysicalDeviceVulkan12Features physicalDeviceVulkan12Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_2_FEATURES};
    VkPhysicalDeviceProperties physicalDeviceProperties{};
    VkPhysicalDeviceProperties2 physicalDeviceProperties2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_PROPERTIES_2};
    VkPhysicalDeviceMemoryProperties physicalDeviceMemoryProperties{};
    vector<VkQueueFamilyProperties> queueFamilyProperties;
    vector<VkBool32> queueFamilyPresentables;

    VkSurfaceKHR vkSurface = VK_NULL_HANDLE;

    VkSwapchainCreateInfoKHR swapchainCreateInfo{VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR};
};
class CCVKGPURenderPass final : public Object {
public:
    ColorAttachmentList colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    SubPassInfoList subPasses;
    VkRenderPass vkRenderPass;
    vector<VkClearValue> clearValues;
};

class CCVKGPUTexture final : public Object {
public:
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    TextureUsage usage = TextureUsageBit::NONE;
    uint width = 0u;
    uint height = 0u;
    uint depth = 1u;
    uint size = 0u;
    uint arrayLayers = 1u;
    uint mipLevels = 1u;
    SampleCount samples = SampleCount::X1;
    TextureFlags flags = TextureFlagBit::NONE;
    bool isPowerOf2 = false;

    VkImage vkImage = VK_NULL_HANDLE;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;
    VkImageLayout layout = VK_IMAGE_LAYOUT_UNDEFINED;
    VkImageLayout currentLayout = VK_IMAGE_LAYOUT_UNDEFINED;
    VkAccessFlags accessMask = VK_ACCESS_SHADER_READ_BIT;
    VkImageAspectFlags aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
    VkPipelineStageFlags targetStage = VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT;
};

class CCVKGPUTextureView final : public Object {
public:
    CCVKGPUTexture *gpuTexture = nullptr;
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    uint baseLevel = 0u;
    uint levelCount = 1u;
    uint baseLayer = 0u;
    uint layerCount = 1u;

    // descriptor infos
    VkImageView vkImageView = VK_NULL_HANDLE;
};
typedef vector<CCVKGPUTextureView *> CCVKGPUTextureViewList;

class CCVKGPUSampler final : public Object {
public:
    Filter minFilter = Filter::LINEAR;
    Filter magFilter = Filter::LINEAR;
    Filter mipFilter = Filter::NONE;
    Address addressU = Address::WRAP;
    Address addressV = Address::WRAP;
    Address addressW = Address::WRAP;
    uint maxAnisotropy = 16u;
    ComparisonFunc cmpFunc = ComparisonFunc::NEVER;
    Color borderColor;
    uint minLOD = 0u;
    uint maxLOD = 1000u;
    float mipLODBias = 0.0f;

    // descriptor infos
    VkSampler vkSampler;
};

class CCVKGPUBuffer final : public Object {
public:
    BufferUsage usage = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint stride = 0u;
    uint count = 0u;
    void *buffer = nullptr;

    bool isDrawIndirectByIndex = false;
    vector<VkDrawIndirectCommand> indirectCmds;
    vector<VkDrawIndexedIndirectCommand> indexedIndirectCmds;

    VkAccessFlags accessMask = VK_ACCESS_SHADER_READ_BIT;
    VkPipelineStageFlags targetStage = VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT;

    uint8_t *mappedData = nullptr;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;

    // descriptor infos
    VkBuffer vkBuffer = VK_NULL_HANDLE;
    VkDeviceSize startOffset = 0u;
    VkDeviceSize size = 0u;

    VkDeviceSize instanceSize = 0u; // per-back-buffer instance
};
typedef vector<CCVKGPUBuffer *> CCVKGPUBufferList;

class CCVKGPUBufferView final : public Object {
public:
    CCVKGPUBuffer *gpuBuffer = nullptr;
    uint offset = 0u;
    uint range = 0u;
};

class CCVKGPUSwapchain;
class CCVKGPUFramebuffer final : public Object {
public:
    CCVKGPURenderPass *gpuRenderPass = nullptr;
    CCVKGPUTextureViewList gpuColorViews;
    CCVKGPUTextureView *gpuDepthStencilView = nullptr;
    VkFramebuffer vkFramebuffer = VK_NULL_HANDLE;
    CCVKGPUSwapchain *swapchain = nullptr;
    bool isOffscreen = true;
};

typedef vector<VkFramebuffer> FramebufferList;
typedef unordered_map<CCVKGPUFramebuffer *, FramebufferList> FramebufferListMap;
typedef FramebufferListMap::iterator FramebufferListMapIter;

class CCVKGPUSwapchain final : public Object {
public:
    uint curImageIndex = 0u;
    VkSwapchainKHR vkSwapchain = VK_NULL_HANDLE;
    vector<VkImageView> vkSwapchainImageViews;
    FramebufferListMap vkSwapchainFramebufferListMap;
    // external references
    vector<VkImage> swapchainImages;
    vector<VkImage> depthStencilImages;
    vector<VkImageView> depthStencilImageViews;
};

class CCVKGPUCommandBuffer final : public Object {
public:
    VkCommandBuffer vkCommandBuffer = VK_NULL_HANDLE;
    VkCommandBufferLevel level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
    uint queueFamilyIndex = 0u;
    bool began = false;
};

class CCVKGPUQueue final : public Object {
public:
    QueueType type = QueueType::GRAPHICS;
    VkQueue vkQueue = VK_NULL_HANDLE;
    uint queueFamilyIndex = 0u;
    VkSemaphore nextWaitSemaphore = VK_NULL_HANDLE;
    VkSemaphore nextSignalSemaphore = VK_NULL_HANDLE;
    VkPipelineStageFlags submitStageMask = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;
    CachedArray<VkCommandBuffer> commandBuffers;
};

struct CCVKGPUShaderStage {
    CCVKGPUShaderStage(ShaderStageFlagBit t, String s)
    : type(t), source(s) {
    }
    ShaderStageFlagBit type;
    String source;
    VkShaderModule vkShader = VK_NULL_HANDLE;
};
typedef vector<CCVKGPUShaderStage> CCVKGPUShaderStageList;

class CCVKGPUShader final : public Object {
public:
    String name;
    AttributeList attributes;
    UniformBlockList blocks;
    UniformSamplerList samplers;
    CCVKGPUShaderStageList gpuStages;
};

class CCVKGPUInputAssembler final : public Object {
public:
    AttributeList attributes;
    CCVKGPUBufferList gpuVertexBuffers;
    CCVKGPUBuffer *gpuIndexBuffer = nullptr;
    CCVKGPUBuffer *gpuIndirectBuffer = nullptr;
    vector<VkBuffer> vertexBuffers;
    vector<VkDeviceSize> vertexBufferOffsets;
};

union CCVKDescriptorInfo {
    VkDescriptorImageInfo image;
    VkDescriptorBufferInfo buffer;
    VkBufferView texelBufferView;
};
struct CCVKGPUDescriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    CCVKGPUBufferView *gpuBufferView = nullptr;
    CCVKGPUTextureView *gpuTextureView = nullptr;
    CCVKGPUSampler *gpuSampler = nullptr;
};
typedef vector<CCVKGPUDescriptor> CCVKGPUDescriptorList;

class CCVKGPUDescriptorSet final : public Object {
public:
    CCVKGPUDescriptorList gpuDescriptors;

    // references
    VkDescriptorUpdateTemplate *pUpdateTemplate = nullptr;

    struct DescriptorSetInstance {
        VkDescriptorSet vkDescriptorSet = VK_NULL_HANDLE;
        vector<CCVKDescriptorInfo> descriptorInfos;
        vector<VkWriteDescriptorSet> descriptorUpdateEntries;
    };
    vector<DescriptorSetInstance> instances; // per swapchain image
};

class CCVKGPUDescriptorSetLayout;
typedef vector<CCVKGPUDescriptorSetLayout *> CCVKGPUDescriptorSetLayoutList;

class CCVKGPUPipelineLayout final : public Object {
public:
    CCVKGPUDescriptorSetLayoutList setLayouts;

    VkPipelineLayout vkPipelineLayout = VK_NULL_HANDLE;

    // helper storage
    vector<uint> dynamicOffsetOffsets;
    uint dynamicOffsetCount;
};

class CCVKGPUPipelineState final : public Object {
public:
    PrimitiveMode primitive = PrimitiveMode::TRIANGLE_LIST;
    CCVKGPUShader *gpuShader = nullptr;
    CCVKGPUPipelineLayout *gpuPipelineLayout = nullptr;
    InputState inputState;
    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    DynamicStateList dynamicStates;
    CCVKGPURenderPass *gpuRenderPass = nullptr;
    VkPipeline vkPipeline = VK_NULL_HANDLE;
};

class CCVKGPUFence final : public Object {
public:
    VkFence vkFence;
};

class CCVKGPUCommandBufferPool;
class CCVKGPUDevice final : public Object {
public:
    VkDevice vkDevice = VK_NULL_HANDLE;
    vector<VkLayerProperties> layers;
    vector<VkExtensionProperties> extensions;
    VmaAllocator memoryAllocator = VK_NULL_HANDLE;
    VkPipelineCache vkPipelineCache = VK_NULL_HANDLE;

    uint curBackBufferIndex = 0u;
    uint backBufferCount = 3u;

    bool useDescriptorUpdateTemplate = false;
    bool useMultiDrawIndirect = false;

    // for default backup usages
    CCVKGPUSampler defaultSampler;
    CCVKGPUTexture defaultTexture;
    CCVKGPUTextureView defaultTextureView;
    CCVKGPUBuffer defaultBuffer;

    CCVKGPUSwapchain *swapchain = nullptr; // reference

    /* *
    using CommandBufferPools = tbb::concurrent_unordered_map<
        std::thread::id, CCVKGPUCommandBufferPool *, std::hash<std::thread::id>>;
    /* */
    using CommandBufferPools = unordered_map<std::thread::id, CCVKGPUCommandBufferPool *>;
    std::mutex mutex;
    /* */

    CommandBufferPools commandBufferPools;

    CCVKGPUCommandBufferPool *getCommandBufferPool(std::thread::id threadID);
};

/**
 * A simple pool for reusing fences.
 */
class CCVKGPUFencePool final : public Object {
public:
    CCVKGPUFencePool(CCVKGPUDevice *device, CCVKGPUSwapchain *gpuSwapchain)
    : _device(device) {
        uint poolCount = gpuSwapchain->swapchainImages.size();
        _counts.resize(poolCount);
        _pools.resize(poolCount);
        _gpuSwapchain = gpuSwapchain;
    }

    ~CCVKGPUFencePool() {
        for (const vector<VkFence> &fencePool : _pools) {
            for (VkFence fence : fencePool) {
                vkDestroyFence(_device->vkDevice, fence, nullptr);
            }
        }
        _pools.clear();
        _counts.clear();
    }

    VkFence alloc() {
        uint index = _gpuSwapchain->curImageIndex;
        uint &count = _counts[index];
        vector<VkFence> &pool = _pools[index];

        if (count < pool.size()) {
            return pool[count++];
        }

        VkFence fence = VK_NULL_HANDLE;
        VkFenceCreateInfo createInfo{VK_STRUCTURE_TYPE_FENCE_CREATE_INFO};
        VK_CHECK(vkCreateFence(_device->vkDevice, &createInfo, nullptr, &fence));
        pool.push_back(fence);
        count++;

        return fence;
    }

    void reset() {
        uint index = _gpuSwapchain->curImageIndex;
        uint &count = _counts[index];
        vector<VkFence> &pool = _pools[index];

        if (count) {
            VK_CHECK(vkResetFences(_device->vkDevice, count, pool.data()));
            count = 0;
        }
    }

    CC_INLINE const VkFence *getFences() const {
        return _pools[_gpuSwapchain->curImageIndex].data();
    }
    CC_INLINE const uint getFenceCount() const {
        return _counts[_gpuSwapchain->curImageIndex];
    }

private:
    CCVKGPUDevice *_device;
    CCVKGPUSwapchain *_gpuSwapchain;
    vector<uint> _counts;
    vector<vector<VkFence>> _pools;
};

/**
 * A simple pool for reusing semaphores.
 */
class CCVKGPUSemaphorePool final : public Object {
public:
    CCVKGPUSemaphorePool(CCVKGPUDevice *device)
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

    uint size() {
        return _count;
    }

private:
    CCVKGPUDevice *_device;
    uint _count = 0u;
    vector<VkSemaphore> _semaphores;
};

/**
 * Unlimited descriptor set pool, based on multiple fix-sized VkDescriptorPools.
 */
class CCVKGPUDescriptorSetPool final : public Object {
public:
    CCVKGPUDescriptorSetPool(CCVKGPUDevice *device, CCVKGPUSwapchain *gpuSwapchain)
    : _device(device) {
        uint poolCount = gpuSwapchain->swapchainImages.size();
        _pools.resize(poolCount);
        _counts.resize(poolCount);
        _gpuSwapchain = gpuSwapchain;
    }

    ~CCVKGPUDescriptorSetPool() {
        for (vector<VkDescriptorPool> &pools : _pools) {
            for (VkDescriptorPool pool : pools) {
                vkDestroyDescriptorPool(_device->vkDevice, pool, nullptr);
            }
            pools.clear();
        }
        if (leakedSetCount) CC_LOG_DEBUG("Leaked %d descriptor sets.", leakedSetCount);
        _pools.clear();
    }

    void alloc(const VkDescriptorSetLayout *layouts, VkDescriptorSet *output, uint count) {
        uint index = _gpuSwapchain->curImageIndex;
        vector<VkDescriptorPool> &pools = _pools[index];
        vector<uint> &counts = _counts[index];

        VkDescriptorSetAllocateInfo info{VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO};
        info.pSetLayouts = layouts;
        info.descriptorSetCount = count;

        size_t size = pools.size();
        uint idx = 0u;
        for (; idx < size; idx++) {
            if (counts[idx] + count <= 128) {
                info.descriptorPool = pools[idx];
                VkResult res = vkAllocateDescriptorSets(_device->vkDevice, &info, output);
                if (res) continue;
                counts[idx] += count;
                return;
            }
        }

        if (idx >= size) {
            VkDescriptorPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO};
            createInfo.maxSets = _maxSetsPerPool;
            createInfo.poolSizeCount = _poolSizes.size();
            createInfo.pPoolSizes = _poolSizes.data();

            VkDescriptorPool descriptorPool;
            VK_CHECK(vkCreateDescriptorPool(_device->vkDevice, &createInfo, nullptr, &descriptorPool));
            pools.push_back(descriptorPool);
            counts.push_back(0);
        }

        info.descriptorPool = pools[idx];
        VK_CHECK(vkAllocateDescriptorSets(_device->vkDevice, &info, output));
        counts[idx] += count;
    }

    void reset() {
        uint index = _gpuSwapchain->curImageIndex;
        vector<VkDescriptorPool> &pools = _pools[index];
        vector<uint> &counts = _counts[index];

        size_t size = pools.size();
        for (uint i = 0u; i < size; i++) {
            if (counts[i]) {
                VK_CHECK(vkResetDescriptorPool(_device->vkDevice, pools[i], 0));
                counts[i] = 0;
            }
        }
    }

private:
    CCVKGPUDevice *_device;
    CCVKGPUSwapchain *_gpuSwapchain;
    vector<vector<VkDescriptorPool>> _pools;
    vector<vector<uint>> _counts;
};

/**
 * Command buffer pool based on VkCommandPools, always try to resue previous allocations first.
 */
class CCVKGPUCommandBufferPool final : public Object {
public:
    CCVKGPUCommandBufferPool(CCVKGPUDevice *device, CCVKGPUSwapchain *gpuSwapchain)
    : _device(device) {
        _pools.resize(gpuSwapchain->swapchainImages.size());
        _gpuSwapchain = gpuSwapchain;
    }

    ~CCVKGPUCommandBufferPool() {
        for (map<uint, CommandBufferPool> &pools : _pools) {
            for (map<uint, CommandBufferPool>::iterator it = pools.begin(); it != pools.end(); it++) {
                CommandBufferPool &pool = it->second;
                if (pool.vkCommandPool != VK_NULL_HANDLE) {
                    vkDestroyCommandPool(_device->vkDevice, pool.vkCommandPool, nullptr);
                    pool.vkCommandPool = VK_NULL_HANDLE;
                }
                pool.usedCommandBuffers->clear();
                pool.commandBuffers->clear();
            }
            pools.clear();
        }
        _pools.clear();
    }

    CC_INLINE uint getHash(uint queueFamilyIndex) {
        return (queueFamilyIndex << 10) | _device->curBackBufferIndex;
    }
    CC_INLINE uint getBackBufferIndex(uint hash) {
        return hash & ((1 << 10) - 1);
    }

    void request(CCVKGPUCommandBuffer *gpuCommandBuffer) {
        uint index = _gpuSwapchain->curImageIndex;
        map<uint, CommandBufferPool> &pools = _pools[index];

        if (!pools.count(gpuCommandBuffer->queueFamilyIndex)) {
            VkCommandPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO};
            createInfo.queueFamilyIndex = gpuCommandBuffer->queueFamilyIndex;
            createInfo.flags = VK_COMMAND_POOL_CREATE_TRANSIENT_BIT;
            VK_CHECK(vkCreateCommandPool(_device->vkDevice, &createInfo, nullptr, &pools[gpuCommandBuffer->queueFamilyIndex].vkCommandPool));
        }
        CommandBufferPool &pool = pools[gpuCommandBuffer->queueFamilyIndex];

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
        uint index = _gpuSwapchain->curImageIndex;
        map<uint, CommandBufferPool> &pools = _pools[index];

        if (gpuCommandBuffer->vkCommandBuffer) {
            if (!pools.count(gpuCommandBuffer->queueFamilyIndex)) return;
            CommandBufferPool &pool = pools[gpuCommandBuffer->queueFamilyIndex];
            pool.usedCommandBuffers[gpuCommandBuffer->level].push(gpuCommandBuffer->vkCommandBuffer);
            gpuCommandBuffer->vkCommandBuffer = VK_NULL_HANDLE;
        }
    }

    void reset() {
        uint index = _gpuSwapchain->curImageIndex;
        map<uint, CommandBufferPool> &pools = _pools[index];

        for (map<uint, CommandBufferPool>::iterator it = pools.begin(); it != pools.end(); it++) {
            CommandBufferPool &pool = it->second;

            bool needsReset = false;
            for (uint i = 0u; i < 2u; i++) {
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
    vector<map<uint, CommandBufferPool>> _pools;
    CCVKGPUSwapchain *_gpuSwapchain;
};

/**
 * Staging buffer pool, based on multiple fix-sized VkBuffer blocks.
 */
constexpr size_t chunkSize = 32 * 1024 * 1024; // 32M per block by default
class CCVKGPUStagingBufferPool final : public Object {
public:
    CCVKGPUStagingBufferPool(CCVKGPUDevice *device, CCVKGPUSwapchain *gpuSwapchain)
    : _device(device) {
        _pools.resize(gpuSwapchain->swapchainImages.size());
        _gpuSwapchain = gpuSwapchain;
    }

    ~CCVKGPUStagingBufferPool() {
        for (vector<Buffer> &pool : _pools) {
            for (Buffer &buffer : pool) {
                vmaDestroyBuffer(_device->memoryAllocator, buffer.vkBuffer, buffer.vmaAllocation);
            }
            pool.clear();
        }
        _pools.clear();
    }

    CC_INLINE void alloc(CCVKGPUBuffer *gpuBuffer) { alloc(gpuBuffer, 1u); }
    void alloc(CCVKGPUBuffer *gpuBuffer, uint alignment) {
        uint index = _gpuSwapchain->curImageIndex;
        vector<Buffer> &pool = _pools[index];

        size_t bufferCount = pool.size();
        Buffer *buffer = nullptr;
        VkDeviceSize offset = 0u;
        for (size_t idx = 0u; idx < bufferCount; idx++) {
            Buffer *cur = &pool[idx];
            offset = roundUp(cur->curOffset, alignment);
            if (chunkSize - offset >= gpuBuffer->size) {
                buffer = cur;
                break;
            }
        }
        if (!buffer) {
            pool.resize(bufferCount + 1);
            buffer = &pool.back();
            VkBufferCreateInfo bufferInfo{VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO};
            bufferInfo.size = chunkSize;
            bufferInfo.usage = VK_BUFFER_USAGE_TRANSFER_SRC_BIT;
            VmaAllocationCreateInfo allocInfo{};
            allocInfo.flags = VMA_ALLOCATION_CREATE_MAPPED_BIT;
            allocInfo.usage = VMA_MEMORY_USAGE_CPU_ONLY;
            VmaAllocationInfo res;
            VK_CHECK(vmaCreateBuffer(_device->memoryAllocator, &bufferInfo, &allocInfo, &buffer->vkBuffer, &buffer->vmaAllocation, &res));
            buffer->mappedData = (uint8_t *)res.pMappedData;
            offset = 0u;
        }
        gpuBuffer->vkBuffer = buffer->vkBuffer;
        gpuBuffer->startOffset = offset;
        gpuBuffer->mappedData = buffer->mappedData + offset;
        buffer->curOffset = offset + gpuBuffer->size;
    }

    void reset() {
        uint index = _gpuSwapchain->curImageIndex;
        vector<Buffer> &pool = _pools[index];

        for (Buffer &buffer : pool) {
            buffer.curOffset = 0u;
        }
    }

private:
    struct Buffer {
        VkBuffer vkBuffer = VK_NULL_HANDLE;
        uint8_t *mappedData = nullptr;
        VmaAllocation vmaAllocation = VK_NULL_HANDLE;

        VkDeviceSize curOffset = 0u;
    };

    CCVKGPUDevice *_device = nullptr;
    vector<vector<Buffer>> _pools;
    CCVKGPUSwapchain *_gpuSwapchain;
};

/**
 * Descriptor data maintenance hub, events like buffer/texture resizing,
 * descriptor set binding change, etc. should all request an update operation here.
 */
class CCVKGPUDescriptorHub final : public Object {
public:
    CCVKGPUDescriptorHub(CCVKGPUDevice *device) {
    }

    CC_INLINE void connect(const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor, uint instanceIdx) {
        _buffers[buffer].push(descriptor);
        _bufferInstaceIndices[descriptor] = instanceIdx;
    }
    CC_INLINE void connect(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        _textures[texture].push(descriptor);
    }
    CC_INLINE void connect(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        _samplers[sampler].push(descriptor);
    }

    CC_INLINE void update(const CCVKGPUBufferView *buffer) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        auto &descriptors = it->second;
        for (uint i = 0u; i < descriptors.size(); i++) {
            _doUpdate(buffer, descriptors[i]);
        }
    }
    CC_INLINE void update(const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        auto &descriptors = it->second;
        for (uint i = 0u; i < descriptors.size(); i++) {
            if (descriptors[i] == descriptor) {
                _doUpdate(buffer, descriptor);
                break;
            }
        }
    }
    CC_INLINE void update(const CCVKGPUTextureView *texture) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        auto &descriptors = it->second;
        for (uint i = 0u; i < descriptors.size(); i++) {
            _doUpdate(texture, descriptors[i]);
        }
    }
    CC_INLINE void update(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        auto &descriptors = it->second;
        for (uint i = 0u; i < descriptors.size(); i++) {
            if (descriptors[i] == descriptor) {
                _doUpdate(texture, descriptor);
                break;
            }
        }
    }
    CC_INLINE void update(const CCVKGPUSampler *sampler) {
        auto it = _samplers.find(sampler);
        if (it == _samplers.end()) return;
        auto &descriptors = it->second;
        for (uint i = 0u; i < descriptors.size(); i++) {
            _doUpdate(sampler, descriptors[i]);
        }
    }
    CC_INLINE void update(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        auto it = _samplers.find(sampler);
        if (it == _samplers.end()) return;
        auto &descriptors = it->second;
        for (uint i = 0u; i < descriptors.size(); i++) {
            if (descriptors[i] == descriptor) {
                _doUpdate(sampler, descriptor);
                break;
            }
        }
    }

    CC_INLINE void disengage(const CCVKGPUBufferView *buffer) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        for (uint i = 0; i < it->second.size(); ++i) {
            _bufferInstaceIndices.erase(it->second[i]);
        }
        _buffers.erase(it);
    }
    CC_INLINE void disengage(const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor) {
        auto it = _buffers.find(buffer);
        if (it == _buffers.end()) return;
        auto &descriptors = it->second;
        descriptors.fastRemove(descriptors.indexOf(descriptor));
        _bufferInstaceIndices.erase(descriptor);
    }
    CC_INLINE void disengage(const CCVKGPUTextureView *texture) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        _textures.erase(it);
    }
    CC_INLINE void disengage(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        auto it = _textures.find(texture);
        if (it == _textures.end()) return;
        auto &descriptors = it->second;
        descriptors.fastRemove(descriptors.indexOf(descriptor));
    }
    CC_INLINE void disengage(const CCVKGPUSampler *sampler) {
        auto it = _samplers.find(sampler);
        if (it == _samplers.end()) return;
        _samplers.erase(it);
    }
    CC_INLINE void disengage(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        auto it = _samplers.find(sampler);
        if (it == _samplers.end()) return;
        auto &descriptors = it->second;
        descriptors.fastRemove(descriptors.indexOf(descriptor));
    }

private:
    CC_INLINE void _doUpdate(const CCVKGPUBufferView *buffer, VkDescriptorBufferInfo *descriptor) {
        VkDeviceSize instanceOffset = _bufferInstaceIndices[descriptor] * buffer->gpuBuffer->instanceSize;
        descriptor->buffer = buffer->gpuBuffer->vkBuffer;
        descriptor->offset = buffer->gpuBuffer->startOffset + instanceOffset + buffer->offset;
        descriptor->range = buffer->range;
    }

    CC_INLINE void _doUpdate(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        descriptor->imageView = texture->vkImageView;
    }

    CC_INLINE void _doUpdate(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        descriptor->sampler = sampler->vkSampler;
    }

    unordered_map<const VkDescriptorBufferInfo *, uint> _bufferInstaceIndices;
    unordered_map<const CCVKGPUBufferView *, CachedArray<VkDescriptorBufferInfo *>> _buffers;
    unordered_map<const CCVKGPUTextureView *, CachedArray<VkDescriptorImageInfo *>> _textures;
    unordered_map<const CCVKGPUSampler *, CachedArray<VkDescriptorImageInfo *>> _samplers;
};

/**
 * Manages descriptor set update events, across all back buffer instances.
 */
class CCVKGPUDescriptorSetHub final : public Object {
public:
    CCVKGPUDescriptorSetHub(CCVKGPUDevice *device)
    : _device(device) {
        _setsToBeUpdated.resize(device->backBufferCount);
    }

    void record(CCVKGPUDescriptorSet *gpuDescriptorSet) {
        update(gpuDescriptorSet);
        for (uint i = 0u; i < _device->backBufferCount; ++i) {
            if (i == _device->curBackBufferIndex) {
                _setsToBeUpdated[i].erase(gpuDescriptorSet);
            } else {
                _setsToBeUpdated[i].insert(gpuDescriptorSet);
            }
        }
    }

    void erase(CCVKGPUDescriptorSet *gpuDescriptorSet) {
        for (uint i = 0u; i < _device->backBufferCount; ++i) {
            if (_setsToBeUpdated[i].count(gpuDescriptorSet)) {
                _setsToBeUpdated[i].erase(gpuDescriptorSet);
            }
        }
    }

    void flush() {
        unordered_set<CCVKGPUDescriptorSet *> &sets = _setsToBeUpdated[_device->curBackBufferIndex];
        for (unordered_set<CCVKGPUDescriptorSet *>::iterator it = sets.begin(); it != sets.end(); ++it) {
            update(*it);
        }
        sets.clear();
    }

private:
    void update(CCVKGPUDescriptorSet *gpuDescriptorSet) {
        CCVKGPUDescriptorSet::DescriptorSetInstance &instance = gpuDescriptorSet->instances[_device->curBackBufferIndex];
        if (gpuDescriptorSet->pUpdateTemplate) {
            vkUpdateDescriptorSetWithTemplateKHR(_device->vkDevice,
                                                 instance.vkDescriptorSet,
                                                 *gpuDescriptorSet->pUpdateTemplate, instance.descriptorInfos.data());
        } else {
            vector<VkWriteDescriptorSet> &entries = instance.descriptorUpdateEntries;
            vkUpdateDescriptorSets(_device->vkDevice, entries.size(), entries.data(), 0, nullptr);
        }
    }

    CCVKGPUDevice *_device = nullptr;
    map<const CCVKGPUBufferView *, CachedArray<VkDescriptorBufferInfo *>> _buffers;
    map<const CCVKGPUTextureView *, CachedArray<VkDescriptorImageInfo *>> _textures;
    map<const CCVKGPUSampler *, CachedArray<VkDescriptorImageInfo *>> _samplers;
};

/**
 * Recycle bin for GPU resources, clears after vkDeviceWaitIdle every frame.
 * All the destroy events will be postponed to that time.
 */
class CCVKGPURecycleBin final : public Object {
public:
    CCVKGPURecycleBin(CCVKGPUDevice *device)
    : _device(device) {
        _resources.resize(16);
    }

#define DEFINE_RECYCLE_BIN_COLLECT_FN(_type, typeValue, expr) \
    void collect(_type *gpuRes) {                             \
        if (_resources.size() <= _count) {                    \
            _resources.resize(_count * 2);                    \
        }                                                     \
        Resource &res = _resources[_count++];                 \
        res.type = typeValue;                                 \
        expr;                                                 \
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
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUFence, RecycledType::FENCE, res.gpuFence = gpuRes)

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
        FENCE,
    };
    struct Buffer {
        VkBuffer vkBuffer;
        VmaAllocation vmaAllocation;
    };
    struct Image {
        VkImage vkImage;
        VmaAllocation vmaAllocation;
    };
    struct Resource {
        RecycledType type = RecycledType::UNKNOWN;
        bool isView = false;
        union {
            // resizable resources, cannot take over directly
            // or descriptor sets won't work
            Buffer buffer;
            Image image;
            VkImageView vkImageView;

            CCVKGPURenderPass *gpuRenderPass;
            CCVKGPUFramebuffer *gpuFramebuffer;
            CCVKGPUSampler *gpuSampler;
            CCVKGPUShader *gpuShader;
            CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout;
            CCVKGPUPipelineLayout *gpuPipelineLayout;
            CCVKGPUPipelineState *gpuPipelineState;
            CCVKGPUFence *gpuFence;
        };
    };
    CCVKGPUDevice *_device = nullptr;
    vector<Resource> _resources;
    uint _count = 0u;
};

/**
 * Transport hub for data traveling between host and devices.
 * Record all transfer commands until batched submission.
 */
//#define ASYNC_BUFFER_UPDATE
class CCVKGPUTransportHub final : public Object {
public:
    CCVKGPUTransportHub(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUTransportHub() {
        if (_fence) {
            vkDestroyFence(_device->vkDevice, _fence, nullptr);
            _fence = VK_NULL_HANDLE;
        }
    }

    void link(CCVKGPUQueue *queue) {
        _queue = queue;

        _cmdBuff.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        _cmdBuff.queueFamilyIndex = _queue->queueFamilyIndex;

        VkFenceCreateInfo createInfo{VK_STRUCTURE_TYPE_FENCE_CREATE_INFO};
        VK_CHECK(vkCreateFence(_device->vkDevice, &createInfo, nullptr, &_fence));
    }

    CC_INLINE bool empty() {
        return !_cmdBuff.vkCommandBuffer;
    }

    template <typename TFunc>
    void checkIn(const TFunc &record, bool immediateSubmission = false) {
        CCVKGPUCommandBufferPool *commandBufferPool = _device->getCommandBufferPool(std::this_thread::get_id());

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
            submitInfo.pCommandBuffers = &_cmdBuff.vkCommandBuffer;
            VK_CHECK(vkQueueSubmit(_queue->vkQueue, 1, &submitInfo, _fence));
            VK_CHECK(vkWaitForFences(_device->vkDevice, 1, &_fence, VK_TRUE, DEFAULT_TIMEOUT));
            vkResetFences(_device->vkDevice, 1, &_fence);
            commandBufferPool->yield(&_cmdBuff);
            _cmdBuff.vkCommandBuffer = VK_NULL_HANDLE;
        }
    }

    void depart() {
        if (_cmdBuff.vkCommandBuffer) {
            CCVKGPUCommandBufferPool *commandBufferPool = _device->getCommandBufferPool(std::this_thread::get_id());

            VK_CHECK(vkEndCommandBuffer(_cmdBuff.vkCommandBuffer));
            _queue->commandBuffers.push(_cmdBuff.vkCommandBuffer);
            commandBufferPool->yield(&_cmdBuff);
            _cmdBuff.vkCommandBuffer = VK_NULL_HANDLE;
        }
    }

private:
    CCVKGPUDevice *_device = nullptr;
    CCVKGPUQueue *_queue = nullptr;

    CCVKGPUCommandBuffer _cmdBuff;
    VkFence _fence = VK_NULL_HANDLE;
};

} // namespace gfx
} // namespace cc

#endif
