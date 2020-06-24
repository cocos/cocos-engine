#ifndef CC_GFXVULKAN_GPU_OBJECTS_H_
#define CC_GFXVULKAN_GPU_OBJECTS_H_

#include "VKUtils.h"

namespace cc {
namespace gfx {

class CCVKGPUContext : public Object {
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
    VkPhysicalDevicePushDescriptorPropertiesKHR physicalDevicePushDescriptorProperties{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_PUSH_DESCRIPTOR_PROPERTIES_KHR};
    VkPhysicalDeviceMemoryProperties physicalDeviceMemoryProperties{};
    vector<VkQueueFamilyProperties> queueFamilyProperties;
    vector<VkBool32> queueFamilyPresentables;

    VkSurfaceKHR vkSurface = VK_NULL_HANDLE;

    VkSwapchainCreateInfoKHR swapchainCreateInfo{VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR};
};

class CCVKGPUDevice : public Object {
public:
    VkDevice vkDevice = VK_NULL_HANDLE;
    vector<VkLayerProperties> layers;
    vector<VkExtensionProperties> extensions;
    VmaAllocator memoryAllocator = VK_NULL_HANDLE;
};

class CCVKGPURenderPass : public Object {
public:
    ColorAttachmentList colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    SubPassList subPasses;
    VkRenderPass vkRenderPass;
    vector<VkClearValue> clearValues;
};

class CCVKGPUTexture : public Object {
public:
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    TextureUsage usage = TextureUsageBit::NONE;
    uint width = 0u;
    uint height = 0u;
    uint depth = 1u;
    uint size = 0u;
    uint arrayLayer = 1u;
    uint mipLevel = 1u;
    SampleCount samples = SampleCount::X1;
    TextureFlags flags = TextureFlagBit::NONE;
    bool isPowerOf2 = false;

    VkImage vkImage = VK_NULL_HANDLE;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;
    VkImageLayout currentLayout = VK_IMAGE_LAYOUT_UNDEFINED;
    VkAccessFlags accessMask = VK_ACCESS_SHADER_READ_BIT;
    VkImageAspectFlags aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
    VkPipelineStageFlags targetStage = VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT;
};

class CCVKGPUTextureView : public Object {
public:
    CCVKGPUTexture *gpuTexture = nullptr;
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    uint baseLevel = 0u;
    uint levelCount = 1u;
    VkImageView vkImageView = VK_NULL_HANDLE;
};

typedef vector<CCVKGPUTextureView *> CCVKGPUTextureViewList;

class CCVKGPUSwapchain;
class CCVKGPUFramebuffer : public Object {
public:
    CCVKGPURenderPass *gpuRenderPass = nullptr;
    CCVKGPUTextureViewList gpuColorViews;
    CCVKGPUTextureView *gpuDepthStencilView = nullptr;
    VkFramebuffer vkFramebuffer = VK_NULL_HANDLE;
    bool isOffscreen = false;
    CCVKGPUSwapchain *swapchain = nullptr;
};

typedef vector<VkFramebuffer> FramebufferList;
typedef map<CCVKGPUFramebuffer *, FramebufferList> FramebufferListMap;
typedef FramebufferListMap::iterator FramebufferListMapIter;

class CCVKGPUSwapchain : public Object {
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

class CCVKGPUCommandBuffer : public Object {
public:
    VkCommandBuffer vkCommandBuffer = VK_NULL_HANDLE;
    VkCommandBufferLevel level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
    uint queueFamilyIndex = 0u;
};

class CCVKGPUQueue : public Object {
public:
    QueueType type = QueueType::GRAPHICS;
    VkQueue vkQueue = VK_NULL_HANDLE;
    uint queueFamilyIndex = 0u;
    VkSemaphore nextWaitSemaphore = VK_NULL_HANDLE;
    VkSemaphore nextSignalSemaphore = VK_NULL_HANDLE;
    VkPipelineStageFlags submitStageMask = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
    CachedArray<VkCommandBuffer> commandBuffers;
};

class CCVKGPUBuffer : public Object {
public:
    BufferUsage usage = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint stride = 0u;
    uint count = 0u;
    void *buffer = nullptr;

    bool isDrawIndirectByIndex = false;
    vector<VkDrawIndirectCommand> indirectCmds;
    vector<VkDrawIndexedIndirectCommand> indexedIndirectCmds;

    // VkDescriptorBufferInfo
    VkBuffer vkBuffer = VK_NULL_HANDLE;
    VkDeviceSize startOffset = 0u;
    VkDeviceSize size = 0u;

    uint8_t *mappedData = nullptr;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;
};
typedef vector<CCVKGPUBuffer *> CCVKGPUBufferList;

class CCVKGPUSampler : public Object {
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
    VkSampler vkSampler;
};

struct CCVKGPUShaderStage {
    CCVKGPUShaderStage(ShaderType t, String s, ShaderMacroList m)
    : type(t), source(s), macros(m) {
    }
    ShaderType type;
    String source;
    ShaderMacroList macros;
    VkShaderModule vkShader = VK_NULL_HANDLE;
};
typedef vector<CCVKGPUShaderStage> CCVKGPUShaderStageList;

class CCVKGPUShader : public Object {
public:
    String name;
    AttributeList attributes;
    UniformBlockList blocks;
    UniformSamplerList samplers;
    CCVKGPUShaderStageList gpuStages;

    vector<VkDescriptorSetLayout> vkDescriptorSetLayouts;
    vector<VkDescriptorUpdateTemplate> vkDescriptorUpdateTemplates;
    vector<vector<VkWriteDescriptorSet>> manualDescriptorUpdateTemplates;
    VkPipelineLayout vkPipelineLayout = VK_NULL_HANDLE;
};

class CCVKGPUInputAssembler : public Object {
public:
    AttributeList attributes;
    CCVKGPUBufferList gpuVertexBuffers;
    CCVKGPUBuffer *gpuIndexBuffer = nullptr;
    CCVKGPUBuffer *gpuIndirectBuffer = nullptr;
    vector<VkBuffer> vertexBuffers;
    vector<VkDeviceSize> vertexBufferOffsets;
};

struct CCVKDescriptorInfo {
    union {
        VkDescriptorImageInfo image;
        VkDescriptorBufferInfo buffer;
        VkBufferView texelBufferView;
    };
};
class CCVKGPUBinding : public Object {
public:
    CCVKGPUBuffer *buffer = nullptr;
    CCVKGPUTextureView *texView = nullptr;
    CCVKGPUSampler *sampler = nullptr;
};
class CCVKGPUBindingLayout : public Object {
public:
    vector<vector<CCVKGPUBinding>> gpuBindings;
    vector<vector<CCVKDescriptorInfo>> descriptorInfos;
    vector<VkDescriptorSet> descriptorSets;
};

class CCVKGPUPipelineState : public Object {
public:
    PrimitiveMode primitive = PrimitiveMode::TRIANGLE_LIST;
    CCVKGPUShader *gpuShader = nullptr;
    InputState inputState;
    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    DynamicStateList dynamicStates;
    CCVKGPURenderPass *gpuRenderPass = nullptr;
    VkPipeline vkPipeline = VK_NULL_HANDLE;
    VkPipelineCache vkPipelineCache = VK_NULL_HANDLE;
};

class CCVKGPUFence : public Object {
public:
    VkFence vkFence;
};

class CCVKGPUSemaphorePool : public Object {
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
    uint _count = 0;
    vector<VkSemaphore> _semaphores;
};

class CCVKGPUFencePool : public Object {
public:
    CCVKGPUFencePool(CCVKGPUDevice *device)
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

    uint size() {
        return _count;
    }

private:
    CCVKGPUDevice *_device;
    uint _count = 0;
    vector<VkFence> _fences;
};

class CCVKGPUDescriptorSetPool : public Object {
public:
    CCVKGPUDescriptorSetPool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUDescriptorSetPool() {
        for (VkDescriptorPool pool : _pools) {
            vkDestroyDescriptorPool(_device->vkDevice, pool, nullptr);
        }
        _pools.clear();
        _counts.clear();
    }

    void alloc(VkDescriptorSetLayout *layouts, VkDescriptorSet *output, uint count) {
        VkDescriptorSetAllocateInfo info{VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO};
        info.pSetLayouts = layouts;
        info.descriptorSetCount = count;

        size_t size = _pools.size();
        uint idx = 0u;
        for (; idx < size; idx++) {
            if (_counts[idx] + count <= 128) {
                info.descriptorPool = _pools[idx];
                VkResult res = vkAllocateDescriptorSets(_device->vkDevice, &info, output);
                if (res) continue;
                _counts[idx] += count;
                return;
            }
        }

        if (idx >= size) {
            VkDescriptorPoolSize poolSizes[] = {
                {VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER, 128},
                {VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER, 128},
            };

            VkDescriptorPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO};
            createInfo.maxSets = 128;
            createInfo.poolSizeCount = COUNTOF(poolSizes);
            createInfo.pPoolSizes = poolSizes;

            VkDescriptorPool descriptorPool;
            VK_CHECK(vkCreateDescriptorPool(_device->vkDevice, &createInfo, nullptr, &descriptorPool));
            _pools.push_back(descriptorPool);
            _counts.push_back(0);
        }

        info.descriptorPool = _pools[idx];
        VK_CHECK(vkAllocateDescriptorSets(_device->vkDevice, &info, output));
        _counts[idx] += count;
    }

    void reset() {
        size_t size = _pools.size();
        for (uint i = 0u; i < size; i++) {
            VK_CHECK(vkResetDescriptorPool(_device->vkDevice, _pools[i], 0));
            _counts[i] = 0;
        }
    }

private:
    CCVKGPUDevice *_device;
    vector<VkDescriptorPool> _pools;
    vector<uint> _counts;
};

class CCVKGPUCommandBufferPool : public Object {
public:
    struct CommandBufferPool {
        VkCommandPool vkCommandPool = VK_NULL_HANDLE;
        CachedArray<VkCommandBuffer> commandBuffers[2];
        CachedArray<VkCommandBuffer> usedCommandBuffers[2];
    };

    CCVKGPUCommandBufferPool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUCommandBufferPool() {
        for (map<uint, CommandBufferPool>::iterator it = _pools.begin(); it != _pools.end(); it++) {
            CommandBufferPool &pool = it->second;
            if (pool.vkCommandPool != VK_NULL_HANDLE) {
                vkDestroyCommandPool(_device->vkDevice, pool.vkCommandPool, nullptr);
                pool.vkCommandPool = VK_NULL_HANDLE;
            }
            pool.usedCommandBuffers->clear();
            pool.commandBuffers->clear();
        }
        _pools.clear();
    }

    void request(CCVKGPUCommandBuffer *gpuCommandBuffer) {
        if (!_pools.count(gpuCommandBuffer->queueFamilyIndex)) {
            _pools.emplace(std::piecewise_construct,
                           std::forward_as_tuple(gpuCommandBuffer->queueFamilyIndex),
                           std::forward_as_tuple());
            VkCommandPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO};
            createInfo.queueFamilyIndex = gpuCommandBuffer->queueFamilyIndex;
            createInfo.flags = VK_COMMAND_POOL_CREATE_TRANSIENT_BIT;
            VK_CHECK(vkCreateCommandPool(_device->vkDevice, &createInfo, nullptr, &_pools[gpuCommandBuffer->queueFamilyIndex].vkCommandPool));
        }
        CommandBufferPool &pool = _pools[gpuCommandBuffer->queueFamilyIndex];

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
            if (!_pools.count(gpuCommandBuffer->queueFamilyIndex)) return;
            CommandBufferPool &pool = _pools[gpuCommandBuffer->queueFamilyIndex];
            pool.usedCommandBuffers[gpuCommandBuffer->level].push(gpuCommandBuffer->vkCommandBuffer);
            gpuCommandBuffer->vkCommandBuffer = VK_NULL_HANDLE;
        }
    }

    void reset() {
        for (map<uint, CommandBufferPool>::iterator it = _pools.begin(); it != _pools.end(); it++) {
            CommandBufferPool &pool = it->second;
            VK_CHECK(vkResetCommandPool(_device->vkDevice, pool.vkCommandPool, 0));

            for (uint i = 0u; i < 2u; i++) {
                CachedArray<VkCommandBuffer> &usedList = pool.usedCommandBuffers[i];
                pool.commandBuffers[i].concat(usedList);
                usedList.clear();
            }
        }
    }

private:
    CCVKGPUDevice *_device = nullptr;
    map<uint, CommandBufferPool> _pools;
    vector<uint> _counts;
};

} // namespace gfx
} // namespace cc

#endif
