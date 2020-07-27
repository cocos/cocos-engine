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

    bool useDescriptorUpdateTemplate = false;
    bool usePushDescriptorSet = false;
    bool useMultiDrawIndirect = false;
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

class CCVKGPUTextureView : public Object {
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

    // descriptor infos
    VkSampler vkSampler;
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

    uint8_t *mappedData = nullptr;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;

    // descriptor infos
    VkBuffer vkBuffer = VK_NULL_HANDLE;
    VkDeviceSize startOffset = 0u;
    VkDeviceSize size = 0u;
};
typedef vector<CCVKGPUBuffer *> CCVKGPUBufferList;

class CCVKGPUSwapchain;
class CCVKGPUFramebuffer : public Object {
public:
    CCVKGPURenderPass *gpuRenderPass = nullptr;
    CCVKGPUTextureViewList gpuColorViews;
    CCVKGPUTextureView *gpuDepthStencilView = nullptr;
    VkFramebuffer vkFramebuffer = VK_NULL_HANDLE;
    CCVKGPUSwapchain *swapchain = nullptr;
    bool isOffscreen = true;
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
    VkFence lastAutoFence = VK_NULL_HANDLE;
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

struct CCVKGPUPipelineLayout {
    vector<VkDescriptorSetLayout> vkDescriptorSetLayouts;
    vector<VkDescriptorUpdateTemplate> vkDescriptorUpdateTemplates;
    VkPipelineLayout vkPipelineLayout = VK_NULL_HANDLE;
    vector<vector<uint>> descriptorIndices;
    vector<uint> descriptorCounts;
};
class CCVKGPUShader : public Object {
public:
    String name;
    AttributeList attributes;
    UniformBlockList blocks;
    UniformSamplerList samplers;
    CCVKGPUShaderStageList gpuStages;
    CCVKGPUPipelineLayout *pipelineLayout = nullptr;
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

union CCVKGPUDescriptorInfo {
    VkDescriptorImageInfo image;
    VkDescriptorBufferInfo buffer;
    VkBufferView texelBufferView;
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
    // contiguous across different sets
    vector<CCVKGPUDescriptorInfo> descriptorInfos;
    vector<VkWriteDescriptorSet> descriptorUpdateEntries;

    vector<VkDescriptorSet> descriptorSets;

    // external references
    const vector<vector<uint>> *descriptorIndices = nullptr;
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
    uint _count = 0u;
    vector<VkFence> _fences;
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
    uint _count = 0u;
    vector<VkSemaphore> _semaphores;
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
            _pools.emplace(std::piecewise_construct, std::forward_as_tuple(gpuCommandBuffer->queueFamilyIndex), std::forward_as_tuple());
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
    struct CommandBufferPool {
        VkCommandPool vkCommandPool = VK_NULL_HANDLE;
        CachedArray<VkCommandBuffer> commandBuffers[2];
        CachedArray<VkCommandBuffer> usedCommandBuffers[2];
    };

    CCVKGPUDevice *_device = nullptr;
    map<uint, CommandBufferPool> _pools;
    vector<uint> _counts;
};

class CCVKGPUStagingBufferPool : public Object {
public:
    CCVKGPUStagingBufferPool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUStagingBufferPool() {
        for (Buffer &buffer : _pool) {
            vmaDestroyBuffer(_device->memoryAllocator, buffer.vkBuffer, buffer.vmaAllocation);
        }
        _pool.clear();
    }

    void alloc(CCVKGPUBuffer *gpuBuffer) { alloc(gpuBuffer, 1u); }
    void alloc(CCVKGPUBuffer *gpuBuffer, uint alignment) {
        size_t bufferCount = _pool.size();
        Buffer *buffer = nullptr;
        VkDeviceSize offset = 0u;
        for (size_t idx = 0u; idx < bufferCount; idx++) {
            Buffer *cur = &_pool[idx];
            offset = roundUp(cur->curOffset, alignment);
            if (cur->size - offset > gpuBuffer->size) {
                buffer = cur;
                break;
            }
        }
        if (!buffer) {
            _pool.resize(bufferCount + 1);
            buffer = &_pool.back();
            VkBufferCreateInfo bufferInfo{VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO};
            bufferInfo.size = buffer->size;
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
        for (Buffer &buffer : _pool) {
            buffer.curOffset = 0u;
        }
    }

private:
    struct Buffer {
        VkBuffer vkBuffer = VK_NULL_HANDLE;
        VkDeviceSize size = 16 * 1024 * 1024; // 16M per block by default
        uint8_t *mappedData = nullptr;
        VmaAllocation vmaAllocation = VK_NULL_HANDLE;

        VkDeviceSize curOffset = 0u;
    };

    CCVKGPUDevice *_device = nullptr;
    vector<Buffer> _pool;
};

class CCVKGPUPipelineLayoutPool : public Object {
public:
    CCVKGPUPipelineLayoutPool(CCVKGPUDevice *device)
    : _device(device) {
    }

    ~CCVKGPUPipelineLayoutPool() {
        for (PipelineLayoutPool::iterator it = _pool.begin(); it != _pool.end(); it++) {
            CCVKGPUPipelineLayout &pipelineLayout = it->second;
            for (uint i = 0u; i < pipelineLayout.vkDescriptorUpdateTemplates.size(); i++) {
                if (pipelineLayout.vkDescriptorUpdateTemplates[i] != VK_NULL_HANDLE) {
                    vkDestroyDescriptorUpdateTemplateKHR(_device->vkDevice, pipelineLayout.vkDescriptorUpdateTemplates[i], nullptr);
                }
            }
            pipelineLayout.vkDescriptorUpdateTemplates.clear();

            if (pipelineLayout.vkPipelineLayout != VK_NULL_HANDLE) {
                vkDestroyPipelineLayout(_device->vkDevice, pipelineLayout.vkPipelineLayout, nullptr);
                pipelineLayout.vkPipelineLayout = VK_NULL_HANDLE;
            }

            for (uint i = 0u; i < pipelineLayout.vkDescriptorSetLayouts.size(); i++) {
                if (pipelineLayout.vkDescriptorSetLayouts[i] != VK_NULL_HANDLE) {
                    vkDestroyDescriptorSetLayout(_device->vkDevice, pipelineLayout.vkDescriptorSetLayouts[i], nullptr);
                }
            }
            pipelineLayout.vkDescriptorSetLayouts.clear();
        }
        _pool.clear();
    }

    void request(CCVKGPUShader *gpuShader);

private:
    typedef map<uint, CCVKGPUPipelineLayout> PipelineLayoutPool;
    typedef PipelineLayoutPool::iterator PipelineLayoutPoolIt;

    CCVKGPUDevice *_device;
    PipelineLayoutPool _pool;
};

class CCVKGPUDescriptorHub : public Object {
public:
    CCVKGPUDescriptorHub(CCVKGPUDevice *device)
    : _device(device) {
    }

#define DEFINE_DESCRIPTOR_HUB_FN(name)                                                                                            \
    CC_INLINE void name(const CCVKGPUBuffer *buffer) { name(_buffers, buffer, (VkDescriptorBufferInfo *)nullptr); }                     \
    CC_INLINE void name(const CCVKGPUBuffer *buffer, VkDescriptorBufferInfo *descriptor) { name(_buffers, buffer, descriptor); }        \
    CC_INLINE void name(const CCVKGPUTextureView *texture) { name(_textures, texture, (VkDescriptorImageInfo *)nullptr); }              \
    CC_INLINE void name(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) { name(_textures, texture, descriptor); } \
    CC_INLINE void name(const CCVKGPUSampler *sampler) { name(_samplers, sampler, (VkDescriptorImageInfo *)nullptr); }                  \
    CC_INLINE void name(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) { name(_samplers, sampler, descriptor); }

    DEFINE_DESCRIPTOR_HUB_FN(connect)
    DEFINE_DESCRIPTOR_HUB_FN(update)
    DEFINE_DESCRIPTOR_HUB_FN(disengage)

private:
    template <typename M, typename K, typename V>
    void connect(M &map, const K *name, V *descriptor) {
        map[name].push(descriptor);
    }

    CC_INLINE void _doUpdate(const CCVKGPUBuffer *buffer, VkDescriptorBufferInfo *descriptor) {
        descriptor->buffer = buffer->vkBuffer;
        descriptor->offset = buffer->startOffset;
        descriptor->range = buffer->size;
    }

    CC_INLINE void _doUpdate(const CCVKGPUTextureView *texture, VkDescriptorImageInfo *descriptor) {
        descriptor->imageView = texture->vkImageView;
    }

    CC_INLINE void _doUpdate(const CCVKGPUSampler *sampler, VkDescriptorImageInfo *descriptor) {
        descriptor->sampler = sampler->vkSampler;
    }

    template <typename M, typename K, typename V>
    void update(M &map, const K *name, V *descriptor) {
        auto it = map.find(name);
        if (it == map.end()) return;
        auto &descriptors = it->second;
        if (!descriptor) {
            for (uint i = 0u; i < descriptors.size(); i++) {
                _doUpdate(name, descriptors[i]);
            }
        } else {
            for (uint i = 0u; i < descriptors.size(); i++) {
                if (descriptors[i] == descriptor) {
                    _doUpdate(name, descriptor);
                    break;
                }
            }
        }
    }

    template <typename M, typename K, typename V>
    void disengage(M &map, const K *name, V *descriptor) {
        auto it = map.find(name);
        if (it == map.end()) return;
        if (!descriptor) {
            map.erase(it);
        } else {
            auto &descriptors = it->second;
            descriptors.fastRemove(descriptors.indexOf(descriptor));
        }
    }

    CCVKGPUDevice *_device = nullptr;
    map<const CCVKGPUBuffer *, CachedArray<VkDescriptorBufferInfo *>> _buffers;
    map<const CCVKGPUTextureView *, CachedArray<VkDescriptorImageInfo *>> _textures;
    map<const CCVKGPUSampler *, CachedArray<VkDescriptorImageInfo *>> _samplers;
}; // namespace gfx

class CCVKGPURecycleBin : public Object {
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
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUBuffer, ObjectType::BUFFER, (res.buffer = {gpuRes->vkBuffer, gpuRes->vmaAllocation}))
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUTexture, ObjectType::TEXTURE, (res.image = {gpuRes->vkImage, gpuRes->vmaAllocation}))
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUTextureView, ObjectType::TEXTURE_VIEW, res.vkImageView = gpuRes->vkImageView)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPURenderPass, ObjectType::RENDER_PASS, res.gpuRenderPass = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUFramebuffer, ObjectType::FRAMEBUFFER, res.gpuFramebuffer = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUSampler, ObjectType::SAMPLER, res.gpuSampler = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUShader, ObjectType::SHADER, res.gpuShader = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUPipelineState, ObjectType::PIPELINE_STATE, res.gpuPipelineState = gpuRes)
    DEFINE_RECYCLE_BIN_COLLECT_FN(CCVKGPUFence, ObjectType::FENCE, res.gpuFence = gpuRes)

    void clear();

private:
    struct Buffer {
        VkBuffer vkBuffer;
        VmaAllocation vmaAllocation;
    };
    struct Image {
        VkImage vkImage;
        VmaAllocation vmaAllocation;
    };
    struct Resource {
        ObjectType type = ObjectType::UNKNOWN;
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
            CCVKGPUPipelineState *gpuPipelineState;
            CCVKGPUFence *gpuFence;
        };
    };
    CCVKGPUDevice *_device = nullptr;
    vector<Resource> _resources;
    uint _count = 0u;
};

//#define ASYNC_BUFFER_UPDATE
#define ASYNC_COMMAND_SUBMISSION
class CCVKGPUTransportHub : public Object {
public:
    CCVKGPUTransportHub(CCVKGPUDevice *device)
    : _device(device) {
        _transfers.resize(16);
    }

    void link(CCVKGPUQueue *queue, CCVKGPUFencePool *fencePool, CCVKGPUCommandBufferPool *commandBufferPool, CCVKGPUStagingBufferPool *stagingBufferPool) {
        _queue = queue;
        _fencePool = fencePool;
        _commandBufferPool = commandBufferPool;
        _stagingBufferPool = stagingBufferPool;

        _cmdBuff.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        _cmdBuff.queueFamilyIndex = _queue->queueFamilyIndex;
    }

    CC_INLINE bool empty() {
        return !_cmdBuff.vkCommandBuffer;
    }

    void checkIn(void *dst, const void *src, size_t size) {
#ifdef ASYNC_BUFFER_UPDATE
        CCVKGPUBuffer stagingBuffer;
        stagingBuffer.size = size;
        _stagingBufferPool->alloc(&stagingBuffer);
        memcpy(stagingBuffer.mappedData, src, size);

        if (_transfers.size() <= _count) {
            _transfers.resize(_count * 2);
        }
        Transfer &transfer = _transfers[_count++];
        transfer.dst = dst;
        transfer.src = stagingBuffer.mappedData;
        transfer.size = size;
#else
        memcpy(dst, src, size);
#endif // ASYNC_BUFFER_UPDATE
    }

    template <typename TFunc>
    void checkIn(const TFunc &record) {
        if (!_cmdBuff.vkCommandBuffer) {
            _commandBufferPool->request(&_cmdBuff);
            VkCommandBufferBeginInfo beginInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO};
            beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
            VK_CHECK(vkBeginCommandBuffer(_cmdBuff.vkCommandBuffer, &beginInfo));
        }

        record(_cmdBuff.vkCommandBuffer);

#ifndef ASYNC_COMMAND_SUBMISSION
        VK_CHECK(vkEndCommandBuffer(_cmdBuff.vkCommandBuffer));
        VkFence fence = _fencePool->alloc();
        VkSubmitInfo submitInfo{VK_STRUCTURE_TYPE_SUBMIT_INFO};
        submitInfo.commandBufferCount = 1;
        submitInfo.pCommandBuffers = &_cmdBuff.vkCommandBuffer;
        VK_CHECK(vkQueueSubmit(_queue->vkQueue, 1, &submitInfo, fence));
        VK_CHECK(vkWaitForFences(_device->vkDevice, 1, &fence, VK_TRUE, DEFAULT_FENCE_TIMEOUT));
        _commandBufferPool->yield(&_cmdBuff);
#endif // ASYNC_COMMAND_SUBMISSION
    }

    void depart() {
        if (_cmdBuff.vkCommandBuffer) {
            VK_CHECK(vkEndCommandBuffer(_cmdBuff.vkCommandBuffer));
            _queue->commandBuffers.push(_cmdBuff.vkCommandBuffer);
            _commandBufferPool->yield(&_cmdBuff);
        }

        if (_count) {
            if (_queue->lastAutoFence) {
                vkWaitForFences(_device->vkDevice, 1, &_queue->lastAutoFence, VK_TRUE, DEFAULT_FENCE_TIMEOUT);
                _queue->lastAutoFence = VK_NULL_HANDLE;
            }
            for (uint i = 0u; i < _count; i++) {
                const Transfer &transfer = _transfers[i];
                memcpy(transfer.dst, transfer.src, transfer.size);
            }
            _count = 0u;
        }
    }

private:
    struct Transfer {
        void *dst = nullptr;
        const void *src = nullptr;
        size_t size = 0u;
    };

    CCVKGPUDevice *_device = nullptr;

    CCVKGPUQueue *_queue = nullptr;
    CCVKGPUFencePool *_fencePool = nullptr;
    CCVKGPUCommandBufferPool *_commandBufferPool = nullptr;
    CCVKGPUStagingBufferPool *_stagingBufferPool = nullptr;

    CCVKGPUCommandBuffer _cmdBuff;
    vector<Transfer> _transfers;
    uint _count = 0u;
};

} // namespace gfx
} // namespace cc

#endif
