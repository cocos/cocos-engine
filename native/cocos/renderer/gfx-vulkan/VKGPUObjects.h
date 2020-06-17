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
    VkPhysicalDeviceMemoryProperties physicalDeviceMemoryProperties{};
    vector<VkQueueFamilyProperties>::type queueFamilyProperties;
    vector<VkBool32>::type queueFamilyPresentables;

    VkSurfaceKHR vkSurface = VK_NULL_HANDLE;

    VkSwapchainCreateInfoKHR swapchainCreateInfo{VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR};
};

class CCVKGPUDevice : public Object {
public:
    VkDevice vkDevice = VK_NULL_HANDLE;
    vector<VkLayerProperties>::type layers;
    vector<VkExtensionProperties>::type extensions;
    VmaAllocator memoryAllocator = VK_NULL_HANDLE;
};

class CCVKGPURenderPass : public Object {
public:
    GFXColorAttachmentList colorAttachments;
    GFXDepthStencilAttachment depthStencilAttachment;
    GFXSubPassList subPasses;
    VkRenderPass vkRenderPass;
    vector<VkClearValue>::type clearValues;
};

class CCVKGPUTexture : public Object {
public:
    GFXTextureType type = GFXTextureType::TEX2D;
    GFXFormat format = GFXFormat::UNKNOWN;
    GFXTextureUsage usage = GFXTextureUsageBit::NONE;
    uint width = 0;
    uint height = 0;
    uint depth = 1;
    uint size = 0;
    uint arrayLayer = 1;
    uint mipLevel = 1;
    GFXSampleCount samples = GFXSampleCount::X1;
    GFXTextureFlags flags = GFXTextureFlagBit::NONE;
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
    GFXTextureType type = GFXTextureType::TEX2D;
    GFXFormat format = GFXFormat::UNKNOWN;
    uint baseLevel = 0;
    uint levelCount = 1;
    VkImageView vkImageView = VK_NULL_HANDLE;
};

typedef vector<CCVKGPUTextureView *>::type CCVKGPUTextureViewList;

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

typedef vector<VkFramebuffer>::type FramebufferList;
typedef map<CCVKGPUFramebuffer *, FramebufferList>::type FramebufferListMap;
typedef FramebufferListMap::iterator FramebufferListMapIter;

class CCVKGPUSwapchain : public Object {
public:
    uint curImageIndex = 0;
    VkSwapchainKHR vkSwapchain = VK_NULL_HANDLE;
    vector<VkImageView>::type vkSwapchainImageViews;
    FramebufferListMap vkSwapchainFramebufferListMap;
    // external references
    vector<VkImage>::type swapchainImages;
    vector<VkImage>::type depthStencilImages;
    vector<VkImageView>::type depthStencilImageViews;
};

class CCVKGPUCommandPool : public Object {
public:
    VkCommandPool vkCommandPool = VK_NULL_HANDLE;
    CachedArray<VkCommandBuffer> commandBuffers[2];
    CachedArray<VkCommandBuffer> usedCommandBuffers[2];
};

class CCVKGPUCommandBuffer : public Object {
public:
    GFXCommandBufferType type;
    CCVKGPUCommandPool *commandPool = nullptr;
    VkCommandBuffer vkCommandBuffer = VK_NULL_HANDLE;
};

class CCVKGPUQueue : public Object {
public:
    GFXQueueType type;
    VkQueue vkQueue;
    uint queueFamilyIndex;
    VkSemaphore nextWaitSemaphore = VK_NULL_HANDLE;
    VkSemaphore nextSignalSemaphore = VK_NULL_HANDLE;
    VkPipelineStageFlags submitStageMask = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
    CachedArray<VkCommandBuffer> commandBuffers;
};

class CCVKGPUBuffer : public Object {
public:
    GFXBufferUsage usage = GFXBufferUsage::NONE;
    GFXMemoryUsage memUsage = GFXMemoryUsage::NONE;
    uint size = 0;
    uint stride = 0;
    uint count = 0;
    void *buffer = nullptr;
    bool isDrawIndirectByIndex = false;
    VkBuffer vkBuffer = VK_NULL_HANDLE;
    VkDeviceSize startOffset = 0u;
    uint8_t *mappedData = nullptr;
    VmaAllocation vmaAllocation = VK_NULL_HANDLE;
};
typedef vector<CCVKGPUBuffer *>::type CCVKGPUBufferList;

class CCVKGPUSampler : public Object {
public:
    GFXFilter minFilter = GFXFilter::LINEAR;
    GFXFilter magFilter = GFXFilter::LINEAR;
    GFXFilter mipFilter = GFXFilter::NONE;
    GFXAddress addressU = GFXAddress::WRAP;
    GFXAddress addressV = GFXAddress::WRAP;
    GFXAddress addressW = GFXAddress::WRAP;
    uint maxAnisotropy = 16;
    GFXComparisonFunc cmpFunc = GFXComparisonFunc::NEVER;
    GFXColor borderColor;
    uint minLOD = 0;
    uint maxLOD = 1000;
    float mipLODBias = 0.0f;
    VkSampler vkSampler;
};

struct CCVKGPUShaderStage {
    CCVKGPUShaderStage(GFXShaderType t, String s, GFXShaderMacroList m)
    : type(t), source(s), macros(m) {
    }
    GFXShaderType type;
    String source;
    GFXShaderMacroList macros;
    VkShaderModule vkShader = VK_NULL_HANDLE;
};
typedef vector<CCVKGPUShaderStage>::type CCVKGPUShaderStageList;

class CCVKGPUShader : public Object {
public:
    String name;
    GFXAttributeList attributes;
    GFXUniformBlockList blocks;
    GFXUniformSamplerList samplers;
    CCVKGPUShaderStageList gpuStages;
};

class CCVKGPUInputAssembler : public Object {
public:
    GFXAttributeList attributes;
    CCVKGPUBufferList gpuVertexBuffers;
    CCVKGPUBuffer *gpuIndexBuffer = nullptr;
    CCVKGPUBuffer *gpuIndirectBuffer = nullptr;
    vector<VkBuffer>::type vertexBuffers;
    vector<VkDeviceSize>::type vertexBufferOffsets;
};

class CCVKGPUBindingLayout : public Object {
public:
    vector<VkWriteDescriptorSet>::type bindings;
    VkDescriptorSetLayout vkDescriptorSetLayout = VK_NULL_HANDLE;
    VkDescriptorPool vkDescriptorPool = VK_NULL_HANDLE;
    VkDescriptorSet vkDescriptorSet = VK_NULL_HANDLE;
};

class CCVKGPUPipelineLayout : public Object {
public:
    GFXPushConstantRangeList pushConstantRanges;
    vector<CCVKGPUBindingLayout *>::type gpuBindingLayouts;
    VkPipelineLayout vkPipelineLayout;
};

class CCVKGPUPipelineState : public Object {
public:
    GFXPrimitiveMode primitive = GFXPrimitiveMode::TRIANGLE_LIST;
    CCVKGPUShader *gpuShader = nullptr;
    GFXInputState inputState;
    GFXRasterizerState rs;
    GFXDepthStencilState dss;
    GFXBlendState bs;
    GFXDynamicStateList dynamicStates;
    CCVKGPUPipelineLayout *gpuLayout = nullptr;
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
    vector<VkSemaphore>::type _semaphores;
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
    vector<VkFence>::type _fences;
};

} // namespace gfx
} // namespace cc

#endif
