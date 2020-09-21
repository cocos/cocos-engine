#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommandBuffer.h"
#include "VKContext.h"
#include "VKDescriptorSet.h"
#include "VKDescriptorSetLayout.h"
#include "VKDevice.h"
#include "VKFence.h"
#include "VKFramebuffer.h"
#include "VKInputAssembler.h"
#include "VKPipelineLayout.h"
#include "VKPipelineState.h"
#include "VKQueue.h"
#include "VKRenderPass.h"
#include "VKSampler.h"
#include "VKShader.h"
#include "VKTexture.h"
#include "VKUtils.h"

CC_DISABLE_WARNINGS()
#define VMA_IMPLEMENTATION
#include "vk_mem_alloc.h"
CC_ENABLE_WARNINGS()

namespace cc {
namespace gfx {

CCVKDevice::CCVKDevice() {
    _clipSpaceMinZ = 0.0f;
    _screenSpaceSignY = -1.0f;
    _UVSpaceSignY = 1.0f;
}

CCVKDevice::~CCVKDevice() {
}

CCVKGPUContext *CCVKDevice::gpuContext() const {
    return ((CCVKContext *)_context)->gpuContext();
}

bool CCVKDevice::initialize(const DeviceInfo &info) {
    _API = API::VULKAN;
    _deviceName = "Vulkan";
    _width = info.width;
    _height = info.height;
    _nativeWidth = info.nativeWidth;
    _nativeHeight = info.nativeHeight;
    _windowHandle = info.windowHandle;

    _bindingMappingInfo = info.bindingMappingInfo;
    if (!_bindingMappingInfo.bufferOffsets.size()) {
        _bindingMappingInfo.bufferOffsets.push_back(0);
    }
    if (!_bindingMappingInfo.samplerOffsets.size()) {
        _bindingMappingInfo.samplerOffsets.push_back(0);
    }

    ContextInfo contextCreateInfo;
    contextCreateInfo.windowHandle = _windowHandle;
    contextCreateInfo.sharedCtx = info.sharedCtx;

    _context = CC_NEW(CCVKContext(this));
    if (!_context->initialize(contextCreateInfo)) {
        destroy();
        return false;
    }
    const CCVKContext *context = (CCVKContext *)_context;
    const CCVKGPUContext *gpuContext = ((CCVKContext *)_context)->gpuContext();
    const VkPhysicalDeviceFeatures2 &deviceFeatures2 = gpuContext->physicalDeviceFeatures2;
    const VkPhysicalDeviceFeatures &deviceFeatures = deviceFeatures2.features;
    //const VkPhysicalDeviceVulkan11Features &deviceVulkan11Features = gpuContext->physicalDeviceVulkan11Features;
    //const VkPhysicalDeviceVulkan12Features &deviceVulkan12Features = gpuContext->physicalDeviceVulkan12Features;

    // only enable the absolute essentials for now
    vector<const char *> requestedValidationLayers{};

#if CC_DEBUG > 0
    requestedValidationLayers.push_back("VK_LAYER_KHRONOS_validation");
#endif

    vector<const char *> requestedExtensions{
        VK_KHR_SWAPCHAIN_EXTENSION_NAME,
        VK_KHR_DESCRIPTOR_UPDATE_TEMPLATE_EXTENSION_NAME,
        VK_KHR_DEDICATED_ALLOCATION_EXTENSION_NAME,
        VK_KHR_GET_MEMORY_REQUIREMENTS_2_EXTENSION_NAME,
    };
    VkPhysicalDeviceFeatures2 requestedFeatures2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_FEATURES_2};
    VkPhysicalDeviceVulkan11Features requestedVulkan11Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_1_FEATURES};
    VkPhysicalDeviceVulkan12Features requestedVulkan12Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_2_FEATURES};
    // features should be enabled like this:
    requestedFeatures2.features.textureCompressionASTC_LDR = deviceFeatures.textureCompressionASTC_LDR;
    requestedFeatures2.features.textureCompressionBC = deviceFeatures.textureCompressionBC;
    requestedFeatures2.features.textureCompressionETC2 = deviceFeatures.textureCompressionETC2;
    requestedFeatures2.features.samplerAnisotropy = deviceFeatures.samplerAnisotropy;
    requestedFeatures2.features.depthBounds = deviceFeatures.depthBounds;
    requestedFeatures2.features.multiDrawIndirect = deviceFeatures.multiDrawIndirect;

#if CC_DEBUG > 0
    // GPU-assisted validation
    requestedFeatures2.features.shaderInt64 = deviceFeatures.shaderInt64;
    requestedFeatures2.features.fragmentStoresAndAtomics = deviceFeatures.fragmentStoresAndAtomics;
    requestedFeatures2.features.vertexPipelineStoresAndAtomics = deviceFeatures.vertexPipelineStoresAndAtomics;
#endif

    ///////////////////// Device Creation /////////////////////

    _gpuDevice = CC_NEW(CCVKGPUDevice);

    // check extensions
    uint availableLayerCount;
    VK_CHECK(vkEnumerateDeviceLayerProperties(gpuContext->physicalDevice, &availableLayerCount, nullptr));
    _gpuDevice->layers.resize(availableLayerCount);
    VK_CHECK(vkEnumerateDeviceLayerProperties(gpuContext->physicalDevice, &availableLayerCount, _gpuDevice->layers.data()));

    uint availableExtensionCount;
    VK_CHECK(vkEnumerateDeviceExtensionProperties(gpuContext->physicalDevice, nullptr, &availableExtensionCount, nullptr));
    _gpuDevice->extensions.resize(availableExtensionCount);
    VK_CHECK(vkEnumerateDeviceExtensionProperties(gpuContext->physicalDevice, nullptr, &availableExtensionCount, _gpuDevice->extensions.data()));

    // just filter out the unsupported layers & extensions
    for (const char *layer : requestedValidationLayers) {
        if (isLayerSupported(layer, _gpuDevice->layers)) {
            _layers.push_back(layer);
        }
    }
    for (const char *extension : requestedExtensions) {
        if (isExtensionSupported(extension, _gpuDevice->extensions)) {
            _extensions.push_back(extension);
        }
    }

    // prepare the device queues
    uint queueFamilyPropertiesCount = toUint(gpuContext->queueFamilyProperties.size());
    vector<VkDeviceQueueCreateInfo> queueCreateInfos(queueFamilyPropertiesCount, {VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO});
    vector<vector<float>> queuePriorities(queueFamilyPropertiesCount);

    for (uint queueFamilyIndex = 0u; queueFamilyIndex < queueFamilyPropertiesCount; ++queueFamilyIndex) {
        const VkQueueFamilyProperties &queueFamilyProperty = gpuContext->queueFamilyProperties[queueFamilyIndex];

        queuePriorities[queueFamilyIndex].resize(queueFamilyProperty.queueCount, 1.0f);

        VkDeviceQueueCreateInfo &queueCreateInfo = queueCreateInfos[queueFamilyIndex];

        queueCreateInfo.queueFamilyIndex = queueFamilyIndex;
        queueCreateInfo.queueCount = queueFamilyProperty.queueCount;
        queueCreateInfo.pQueuePriorities = queuePriorities[queueFamilyIndex].data();
    }

    VkDeviceCreateInfo deviceCreateInfo{VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO};

    deviceCreateInfo.queueCreateInfoCount = toUint(queueCreateInfos.size());
    deviceCreateInfo.pQueueCreateInfos = queueCreateInfos.data();
    deviceCreateInfo.enabledLayerCount = toUint(_layers.size());
    deviceCreateInfo.ppEnabledLayerNames = _layers.data();
    deviceCreateInfo.enabledExtensionCount = toUint(_extensions.size());
    deviceCreateInfo.ppEnabledExtensionNames = _extensions.data();
    if (context->minorVersion() < 1 &&
        !context->checkExtension(VK_KHR_GET_PHYSICAL_DEVICE_PROPERTIES_2_EXTENSION_NAME)) {
        deviceCreateInfo.pEnabledFeatures = &requestedFeatures2.features;
    } else {
        deviceCreateInfo.pNext = &requestedFeatures2;
        if (context->minorVersion() >= 2) {
            requestedFeatures2.pNext = &requestedVulkan11Features;
            requestedVulkan11Features.pNext = &requestedVulkan12Features;
        }
    }

    VK_CHECK(vkCreateDevice(gpuContext->physicalDevice, &deviceCreateInfo, nullptr, &_gpuDevice->vkDevice));

    ///////////////////// Gather Device Properties /////////////////////

    _features[(uint)Feature::COLOR_FLOAT] = true;
    _features[(uint)Feature::COLOR_HALF_FLOAT] = true;
    _features[(uint)Feature::TEXTURE_FLOAT] = true;
    _features[(uint)Feature::TEXTURE_HALF_FLOAT] = true;
    _features[(uint)Feature::TEXTURE_FLOAT_LINEAR] = true;
    _features[(uint)Feature::TEXTURE_HALF_FLOAT_LINEAR] = true;
    _features[(uint)Feature::FORMAT_R11G11B10F] = true;
    _features[(uint)Feature::MSAA] = true;
    _features[(uint)Feature::ELEMENT_INDEX_UINT] = true;
    _features[(uint)Feature::INSTANCED_ARRAYS] = true;
    _features[(uint)Feature::DEPTH_BOUNDS] = deviceFeatures.depthBounds;
    _features[(uint)Feature::LINE_WIDTH] = true;
    _features[(uint)Feature::STENCIL_COMPARE_MASK] = true;
    _features[(uint)Feature::STENCIL_WRITE_MASK] = true;

    _gpuDevice->useMultiDrawIndirect = deviceFeatures.multiDrawIndirect;
    _gpuDevice->useDescriptorUpdateTemplate = checkExtension(VK_KHR_DESCRIPTOR_UPDATE_TEMPLATE_EXTENSION_NAME);

    VkFormatFeatureFlags requiredFeatures = VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_COLOR_ATTACHMENT_BIT;
    VkFormatProperties formatProperties;
    vkGetPhysicalDeviceFormatProperties(gpuContext->physicalDevice, VK_FORMAT_R8G8B8_UNORM, &formatProperties);
    if (formatProperties.optimalTilingFeatures & requiredFeatures) {
        _features[(uint)Feature::FORMAT_RGB8] = true;
    }
    requiredFeatures = VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT;
    vkGetPhysicalDeviceFormatProperties(gpuContext->physicalDevice, VK_FORMAT_D16_UNORM, &formatProperties);
    if (formatProperties.optimalTilingFeatures & requiredFeatures) {
        _features[(uint)Feature::FORMAT_D16] = true;
    }
    vkGetPhysicalDeviceFormatProperties(gpuContext->physicalDevice, VK_FORMAT_X8_D24_UNORM_PACK32, &formatProperties);
    if (formatProperties.optimalTilingFeatures & requiredFeatures) {
        _features[(uint)Feature::FORMAT_D24] = true;
    }
    vkGetPhysicalDeviceFormatProperties(gpuContext->physicalDevice, VK_FORMAT_D32_SFLOAT, &formatProperties);
    if (formatProperties.optimalTilingFeatures & requiredFeatures) {
        _features[(uint)Feature::FORMAT_D32F] = true;
    }
    vkGetPhysicalDeviceFormatProperties(gpuContext->physicalDevice, VK_FORMAT_D16_UNORM_S8_UINT, &formatProperties);
    if (formatProperties.optimalTilingFeatures & requiredFeatures) {
        _features[(uint)Feature::FORMAT_D16S8] = true;
    }
    vkGetPhysicalDeviceFormatProperties(gpuContext->physicalDevice, VK_FORMAT_D24_UNORM_S8_UINT, &formatProperties);
    if (formatProperties.optimalTilingFeatures & requiredFeatures) {
        _features[(uint)Feature::FORMAT_D24S8] = true;
    }
    vkGetPhysicalDeviceFormatProperties(gpuContext->physicalDevice, VK_FORMAT_D32_SFLOAT_S8_UINT, &formatProperties);
    if (formatProperties.optimalTilingFeatures & requiredFeatures) {
        _features[(uint)Feature::FORMAT_D32FS8] = true;
    }

    String compressedFmts;
    if (deviceFeatures.textureCompressionETC2) {
        _features[(uint)Feature::FORMAT_ETC2] = true;
        compressedFmts += "etc2 ";
    }
    if (deviceFeatures.textureCompressionASTC_LDR) {
        _features[(uint)Feature::FORMAT_ASTC] = true;
        compressedFmts += "astc ";
    }

    const VkPhysicalDeviceLimits &limits = gpuContext->physicalDeviceProperties.limits;
    _maxVertexAttributes = limits.maxVertexInputAttributes;
    _maxVertexUniformVectors = limits.maxPerStageDescriptorUniformBuffers;
    _maxFragmentUniformVectors = limits.maxPerStageDescriptorUniformBuffers;
    _maxUniformBufferBindings = limits.maxDescriptorSetUniformBuffers;
    _maxUniformBlockSize = limits.maxUniformBufferRange;
    _maxTextureUnits = limits.maxDescriptorSetSampledImages;
    _maxVertexTextureUnits = limits.maxPerStageDescriptorSampledImages;
    _maxTextureSize = limits.maxImageDimension2D;
    _maxCubeMapTextureSize = limits.maxImageDimensionCube;
    _uboOffsetAlignment = (uint)limits.minUniformBufferOffsetAlignment;
    MapDepthStencilBits(_context->getDepthStencilFormat(), _depthBits, _stencilBits);

    ///////////////////// Resource Initialization /////////////////////

    VmaVulkanFunctions vmaVulkanFunc{};
    vmaVulkanFunc.vkAllocateMemory = vkAllocateMemory;
    vmaVulkanFunc.vkBindBufferMemory = vkBindBufferMemory;
    vmaVulkanFunc.vkBindImageMemory = vkBindImageMemory;
    vmaVulkanFunc.vkCreateBuffer = vkCreateBuffer;
    vmaVulkanFunc.vkCreateImage = vkCreateImage;
    vmaVulkanFunc.vkDestroyBuffer = vkDestroyBuffer;
    vmaVulkanFunc.vkDestroyImage = vkDestroyImage;
    vmaVulkanFunc.vkFlushMappedMemoryRanges = vkFlushMappedMemoryRanges;
    vmaVulkanFunc.vkFreeMemory = vkFreeMemory;
    vmaVulkanFunc.vkGetBufferMemoryRequirements = vkGetBufferMemoryRequirements;
    vmaVulkanFunc.vkGetImageMemoryRequirements = vkGetImageMemoryRequirements;
    vmaVulkanFunc.vkGetPhysicalDeviceMemoryProperties = vkGetPhysicalDeviceMemoryProperties;
    vmaVulkanFunc.vkGetPhysicalDeviceProperties = vkGetPhysicalDeviceProperties;
    vmaVulkanFunc.vkInvalidateMappedMemoryRanges = vkInvalidateMappedMemoryRanges;
    vmaVulkanFunc.vkMapMemory = vkMapMemory;
    vmaVulkanFunc.vkUnmapMemory = vkUnmapMemory;

    VmaAllocatorCreateInfo allocatorInfo{};
    allocatorInfo.physicalDevice = gpuContext->physicalDevice;
    allocatorInfo.device = _gpuDevice->vkDevice;
    allocatorInfo.instance = gpuContext->vkInstance;

    if (checkExtension(VK_KHR_DEDICATED_ALLOCATION_EXTENSION_NAME) &&
        checkExtension(VK_KHR_GET_MEMORY_REQUIREMENTS_2_EXTENSION_NAME)) {
        allocatorInfo.flags |= VMA_ALLOCATOR_CREATE_KHR_DEDICATED_ALLOCATION_BIT;
        vmaVulkanFunc.vkGetBufferMemoryRequirements2KHR = vkGetBufferMemoryRequirements2KHR;
        vmaVulkanFunc.vkGetImageMemoryRequirements2KHR = vkGetImageMemoryRequirements2KHR;
    }

    allocatorInfo.pVulkanFunctions = &vmaVulkanFunc;

    VK_CHECK(vmaCreateAllocator(&allocatorInfo, &_gpuDevice->memoryAllocator));

    QueueInfo queueInfo;
    queueInfo.type = QueueType::GRAPHICS;
    _queue = createQueue(queueInfo);

    _gpuFencePool = CC_NEW(CCVKGPUFencePool(_gpuDevice));
    _gpuRecycleBin = CC_NEW(CCVKGPURecycleBin(_gpuDevice));
    _gpuTransportHub = CC_NEW(CCVKGPUTransportHub(_gpuDevice));
    _gpuDescriptorHub = CC_NEW(CCVKGPUDescriptorHub(_gpuDevice));
    _gpuSemaphorePool = CC_NEW(CCVKGPUSemaphorePool(_gpuDevice));
    _gpuDescriptorSetPool = CC_NEW(CCVKGPUDescriptorSetPool(_gpuDevice));
    _gpuCommandBufferPool = CC_NEW(CCVKGPUCommandBufferPool(_gpuDevice));
    _gpuStagingBufferPool = CC_NEW(CCVKGPUStagingBufferPool(_gpuDevice));

    _gpuTransportHub->link(((CCVKQueue *)_queue)->gpuQueue(), _gpuFencePool, _gpuCommandBufferPool, _gpuStagingBufferPool);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff = createCommandBuffer(cmdBuffInfo);

    CCVKCmdFuncCreateSampler(this, &_gpuDevice->defaultSampler);

    _gpuDevice->defaultTexture.format = Format::RGBA8;
    _gpuDevice->defaultTexture.usage = TextureUsageBit::SAMPLED;
    _gpuDevice->defaultTexture.width = _gpuDevice->defaultTexture.height = 1u;
    _gpuDevice->defaultTexture.size = FormatSize(Format::RGBA8, 1u, 1u, 1u);
    CCVKCmdFuncCreateTexture(this, &_gpuDevice->defaultTexture);

    _gpuDevice->defaultTextureView.gpuTexture = &_gpuDevice->defaultTexture;
    _gpuDevice->defaultTextureView.format = Format::RGBA8;
    CCVKCmdFuncCreateTextureView(this, &_gpuDevice->defaultTextureView);

    _gpuDevice->defaultBuffer.usage = BufferUsage::UNIFORM;
    _gpuDevice->defaultBuffer.memUsage = MemoryUsage::HOST | MemoryUsage::DEVICE;
    _gpuDevice->defaultBuffer.size = _gpuDevice->defaultBuffer.stride = 16u;
    _gpuDevice->defaultBuffer.count = 1u;
    CCVKCmdFuncCreateBuffer(this, &_gpuDevice->defaultBuffer);

    for (uint i = 0u; i < gpuContext->swapchainCreateInfo.minImageCount; i++) {
        TextureInfo depthStencilTexInfo;
        depthStencilTexInfo.type = TextureType::TEX2D;
        depthStencilTexInfo.usage = TextureUsageBit::DEPTH_STENCIL_ATTACHMENT | TextureUsageBit::SAMPLED;
        depthStencilTexInfo.format = _context->getDepthStencilFormat();
        depthStencilTexInfo.width = _width;
        depthStencilTexInfo.height = _height;
        CCVKTexture *texture = (CCVKTexture *)createTexture(depthStencilTexInfo);
        _depthStencilTextures.push_back(texture);
    }

    _gpuSwapchain = CC_NEW(CCVKGPUSwapchain);

    ///////////////////// Print Debug Info /////////////////////

    String instanceLayers, instanceExtensions, deviceLayers, deviceExtensions;
    for (const char *layer : ((CCVKContext *)_context)->getLayers()) {
        instanceLayers += layer + String(" ");
    }
    for (const char *extension : ((CCVKContext *)_context)->getExtensions()) {
        instanceExtensions += extension + String(" ");
    }
    for (const char *layer : _layers) {
        deviceLayers += layer + String(" ");
    }
    for (const char *extension : _extensions) {
        deviceExtensions += extension + String(" ");
    }

    uint32_t apiVersion = gpuContext->physicalDeviceProperties.apiVersion;
    _renderer = gpuContext->physicalDeviceProperties.deviceName;
    _vendor = MapVendorName(gpuContext->physicalDeviceProperties.vendorID);
    _version = StringUtil::Format("%d.%d.%d", VK_VERSION_MAJOR(apiVersion),
                                  VK_VERSION_MINOR(apiVersion), VK_VERSION_PATCH(apiVersion));

    CC_LOG_INFO("Vulkan device initialized.");
    CC_LOG_INFO("RENDERER: %s", _renderer.c_str());
    CC_LOG_INFO("VENDOR: %s", _vendor.c_str());
    CC_LOG_INFO("VERSION: %s", _version.c_str());
    CC_LOG_INFO("SCREEN_SIZE: %d x %d", _width, _height);
    CC_LOG_INFO("NATIVE_SIZE: %d x %d", _nativeWidth, _nativeHeight);
    CC_LOG_INFO("INSTANCE_LAYERS: %s", instanceLayers.c_str());
    CC_LOG_INFO("INSTANCE_EXTENSIONS: %s", instanceExtensions.c_str());
    CC_LOG_INFO("DEVICE_LAYERS: %s", deviceLayers.c_str());
    CC_LOG_INFO("DEVICE_EXTENSIONS: %s", deviceExtensions.c_str());
    CC_LOG_INFO("COMPRESSED_FORMATS: %s", compressedFmts.c_str());

    return true;
}

void CCVKDevice::destroy() {
    if (_gpuDevice && _gpuDevice->vkDevice) {
        VK_CHECK(vkDeviceWaitIdle(_gpuDevice->vkDevice));
    }

    if (_gpuSwapchain) {
        if (_gpuSwapchain->vkSwapchain != VK_NULL_HANDLE) {
            _gpuSwapchain->depthStencilImageViews.clear();
            _gpuSwapchain->depthStencilImages.clear();

            for (FramebufferListMapIter it = _gpuSwapchain->vkSwapchainFramebufferListMap.begin();
                 it != _gpuSwapchain->vkSwapchainFramebufferListMap.end(); it++) {
                FramebufferList &list = it->second;
                for (VkFramebuffer framebuffer : list) {
                    vkDestroyFramebuffer(_gpuDevice->vkDevice, framebuffer, nullptr);
                }
                list.clear();
            }
            _gpuSwapchain->vkSwapchainFramebufferListMap.clear();

            for (VkImageView imageView : _gpuSwapchain->vkSwapchainImageViews) {
                vkDestroyImageView(_gpuDevice->vkDevice, imageView, nullptr);
            }
            _gpuSwapchain->vkSwapchainImageViews.clear();
            _gpuSwapchain->swapchainImages.clear();

            vkDestroySwapchainKHR(_gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain, nullptr);
            _gpuSwapchain->vkSwapchain = VK_NULL_HANDLE;
        }
    }

    for (CCVKTexture *texture : _depthStencilTextures) {
        CC_SAFE_DESTROY(texture);
    }
    _depthStencilTextures.clear();

    if (_gpuRecycleBin) {
        _gpuRecycleBin->clear();
    }

    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_cmdBuff);
    CC_SAFE_DELETE(_gpuSwapchain);
    CC_SAFE_DELETE(_gpuStagingBufferPool);
    CC_SAFE_DELETE(_gpuCommandBufferPool);
    CC_SAFE_DELETE(_gpuDescriptorSetPool);
    CC_SAFE_DELETE(_gpuSemaphorePool);
    CC_SAFE_DELETE(_gpuDescriptorHub);
    CC_SAFE_DELETE(_gpuTransportHub);
    CC_SAFE_DELETE(_gpuRecycleBin);
    CC_SAFE_DELETE(_gpuFencePool);

    if (_gpuDevice) {
        if (_gpuDevice->defaultBuffer.vkBuffer) {
            vmaDestroyBuffer(_gpuDevice->memoryAllocator, _gpuDevice->defaultBuffer.vkBuffer, _gpuDevice->defaultBuffer.vmaAllocation);
            _gpuDevice->defaultBuffer.vkBuffer = VK_NULL_HANDLE;
            _gpuDevice->defaultBuffer.vmaAllocation = VK_NULL_HANDLE;
        }
        if (_gpuDevice->defaultTextureView.vkImageView) {
            vkDestroyImageView(_gpuDevice->vkDevice, _gpuDevice->defaultTextureView.vkImageView, nullptr);
            _gpuDevice->defaultTextureView.vkImageView = VK_NULL_HANDLE;
        }
        if (_gpuDevice->defaultTexture.vkImage) {
            vmaDestroyImage(_gpuDevice->memoryAllocator, _gpuDevice->defaultTexture.vkImage, _gpuDevice->defaultTexture.vmaAllocation);
            _gpuDevice->defaultTexture.vkImage = VK_NULL_HANDLE;
            _gpuDevice->defaultTexture.vmaAllocation = VK_NULL_HANDLE;
        }
        CCVKCmdFuncDestroySampler(_gpuDevice, &_gpuDevice->defaultSampler);

        if (_gpuDevice->memoryAllocator != VK_NULL_HANDLE) {
            VmaStats stats;
            vmaCalculateStats(_gpuDevice->memoryAllocator, &stats);
            CC_LOG_INFO("Total device memory leaked: %d bytes.", stats.total.usedBytes);

            vmaDestroyAllocator(_gpuDevice->memoryAllocator);
            _gpuDevice->memoryAllocator = VK_NULL_HANDLE;
        }

        if (_gpuDevice->vkDevice != VK_NULL_HANDLE) {
            vkDestroyDevice(_gpuDevice->vkDevice, nullptr);
            _gpuDevice->vkDevice = VK_NULL_HANDLE;
        }

        CC_DELETE(_gpuDevice);
        _gpuDevice = nullptr;
    }

    CC_SAFE_DESTROY(_context);
}

void CCVKDevice::resize(uint width, uint height) {
    _width = width;
    _height = height;
}

void CCVKDevice::acquire() {
    if (!checkSwapchainStatus()) return;

    CCVKQueue *queue = (CCVKQueue *)_queue;
    // Clear queue stats
    queue->_numDrawCalls = 0;
    queue->_numInstances = 0;
    queue->_numTriangles = 0;

    _gpuSemaphorePool->reset();
    VkSemaphore acquireSemaphore = _gpuSemaphorePool->alloc();
    VK_CHECK(vkAcquireNextImageKHR(_gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain,
                                   ~0ull, acquireSemaphore, VK_NULL_HANDLE, &_gpuSwapchain->curImageIndex));

    queue->gpuQueue()->nextWaitSemaphore = acquireSemaphore;
    queue->gpuQueue()->nextSignalSemaphore = _gpuSemaphorePool->alloc();
}

void CCVKDevice::present() {
    CCVKQueue *queue = (CCVKQueue *)_queue;
    _numDrawCalls = queue->_numDrawCalls;
    _numInstances = queue->_numInstances;
    _numTriangles = queue->_numTriangles;

    if (queue->gpuQueue()->nextWaitSemaphore) { // don't present if not acquired
        VkPresentInfoKHR presentInfo{VK_STRUCTURE_TYPE_PRESENT_INFO_KHR};
        presentInfo.waitSemaphoreCount = 1;
        presentInfo.pWaitSemaphores = &queue->gpuQueue()->nextWaitSemaphore;
        presentInfo.swapchainCount = 1;
        presentInfo.pSwapchains = &_gpuSwapchain->vkSwapchain;
        presentInfo.pImageIndices = &_gpuSwapchain->curImageIndex;

        VkResult res = vkQueuePresentKHR(queue->gpuQueue()->vkQueue, &presentInfo);
        if (res) _swapchainReady = false;
    }

    // TODO: these can be moved to acquire-time after pipeline refactoring,
    // which should guarantee that no transfer operation will be issued before acquiring

    VK_CHECK(vkDeviceWaitIdle(_gpuDevice->vkDevice));

    queue->gpuQueue()->lastAutoFence = VK_NULL_HANDLE;
    queue->gpuQueue()->nextWaitSemaphore = VK_NULL_HANDLE;
    queue->gpuQueue()->nextSignalSemaphore = VK_NULL_HANDLE;

    // reset everything only when no pending commands
    if (_gpuTransportHub->empty()) {
        _gpuFencePool->reset();
        _gpuRecycleBin->clear();
        _gpuDescriptorSetPool->reset();
        _gpuCommandBufferPool->reset();
        _gpuStagingBufferPool->reset();
    }
}

CommandBuffer *CCVKDevice::createCommandBuffer(const CommandBufferInfo &info) {
    CommandBuffer *cmdBuff = CC_NEW(CCVKCommandBuffer(this));
    if (cmdBuff->initialize(info))
        return cmdBuff;

    CC_SAFE_DESTROY(cmdBuff)
    return nullptr;
}

Fence *CCVKDevice::createFence(const FenceInfo &info) {
    Fence *fence = CC_NEW(CCVKFence(this));
    if (fence->initialize(info))
        return fence;

    CC_SAFE_DESTROY(fence);
    return nullptr;
}

Queue *CCVKDevice::createQueue(const QueueInfo &info) {
    Queue *queue = CC_NEW(CCVKQueue(this));
    if (queue->initialize(info))
        return queue;

    CC_SAFE_DESTROY(queue);
    return nullptr;
}

Buffer *CCVKDevice::createBuffer(const BufferInfo &info) {
    Buffer *buffer = CC_NEW(CCVKBuffer(this));
    if (buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

Buffer *CCVKDevice::createBuffer(const BufferViewInfo &info) {
    Buffer *buffer = CC_NEW(CCVKBuffer(this));
    if (buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

Texture *CCVKDevice::createTexture(const TextureInfo &info) {
    Texture *texture = CC_NEW(CCVKTexture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

Texture *CCVKDevice::createTexture(const TextureViewInfo &info) {
    Texture *texture = CC_NEW(CCVKTexture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

Sampler *CCVKDevice::createSampler(const SamplerInfo &info) {
    Sampler *sampler = CC_NEW(CCVKSampler(this));
    if (sampler->initialize(info))
        return sampler;

    CC_SAFE_DESTROY(sampler);
    return nullptr;
}

Shader *CCVKDevice::createShader(const ShaderInfo &info) {
    Shader *shader = CC_NEW(CCVKShader(this));
    if (shader->initialize(info))
        return shader;

    CC_SAFE_DESTROY(shader);
    return nullptr;
}

InputAssembler *CCVKDevice::createInputAssembler(const InputAssemblerInfo &info) {
    InputAssembler *inputAssembler = CC_NEW(CCVKInputAssembler(this));
    if (inputAssembler->initialize(info))
        return inputAssembler;

    CC_SAFE_DESTROY(inputAssembler);
    return nullptr;
}

RenderPass *CCVKDevice::createRenderPass(const RenderPassInfo &info) {
    RenderPass *renderPass = CC_NEW(CCVKRenderPass(this));
    if (renderPass->initialize(info))
        return renderPass;

    CC_SAFE_DESTROY(renderPass);
    return nullptr;
}

Framebuffer *CCVKDevice::createFramebuffer(const FramebufferInfo &info) {
    Framebuffer *framebuffer = CC_NEW(CCVKFramebuffer(this));
    if (framebuffer->initialize(info))
        return framebuffer;

    CC_SAFE_DESTROY(framebuffer);
    return nullptr;
}

DescriptorSet *CCVKDevice::createDescriptorSet(const DescriptorSetInfo &info) {
    DescriptorSet *descriptorSet = CC_NEW(CCVKDescriptorSet(this));
    if (descriptorSet->initialize(info))
        return descriptorSet;

    CC_SAFE_DESTROY(descriptorSet);
    return nullptr;
}

DescriptorSetLayout *CCVKDevice::createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) {
    DescriptorSetLayout *descriptorSetLayout = CC_NEW(CCVKDescriptorSetLayout(this));
    if (descriptorSetLayout->initialize(info))
        return descriptorSetLayout;

    CC_SAFE_DESTROY(descriptorSetLayout);
    return nullptr;
}

PipelineLayout *CCVKDevice::createPipelineLayout(const PipelineLayoutInfo &info) {
    PipelineLayout *pipelineLayout = CC_NEW(CCVKPipelineLayout(this));
    if (pipelineLayout->initialize(info))
        return pipelineLayout;

    CC_SAFE_DESTROY(pipelineLayout);
    return nullptr;
}

PipelineState *CCVKDevice::createPipelineState(const PipelineStateInfo &info) {
    PipelineState *pipelineState = CC_NEW(CCVKPipelineState(this));
    if (pipelineState->initialize(info))
        return pipelineState;

    CC_SAFE_DESTROY(pipelineState);
    return nullptr;
}

void CCVKDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    // This assumes the default command buffer will get submitted every frame,
    // which is true for now but may change in the future. This appoach gives us
    // the wiggle room to leverage immediate update vs. copy-upload strategies without
    // breaking compatabilities. When we reached some conclusion on this subject,
    // getting rid of this interface all together may become a better option.
    _cmdBuff->begin();
    const CCVKGPUCommandBuffer *gpuCommandBuffer = ((CCVKCommandBuffer *)_cmdBuff)->gpuCommandBuffer();
    CCVKCmdFuncCopyBuffersToTexture(this, buffers, ((CCVKTexture *)dst)->gpuTexture(), regions, count, gpuCommandBuffer);
}

bool CCVKDevice::checkSwapchainStatus() {
    CCVKGPUContext *context = ((CCVKContext *)_context)->gpuContext();
    context->swapchainCreateInfo.oldSwapchain = _gpuSwapchain->vkSwapchain;
    _gpuSwapchain->curImageIndex = 0;

    VkSurfaceCapabilitiesKHR surfaceCapabilities;
    VK_CHECK(vkGetPhysicalDeviceSurfaceCapabilitiesKHR(context->physicalDevice, context->vkSurface, &surfaceCapabilities));
    uint newWidth = surfaceCapabilities.currentExtent.width;
    uint newHeight = surfaceCapabilities.currentExtent.height;

    if (context->swapchainCreateInfo.imageExtent.width == newWidth &&
        context->swapchainCreateInfo.imageExtent.height == newHeight && _swapchainReady) {
        return true;
    }

    if (newWidth == (uint)-1) {
        context->swapchainCreateInfo.imageExtent.width = _width;
        context->swapchainCreateInfo.imageExtent.height = _height;
    } else {
        _width = context->swapchainCreateInfo.imageExtent.width = newWidth;
        _height = context->swapchainCreateInfo.imageExtent.height = newHeight;
    }

    if (newWidth == 0 || newHeight == 0) {
        return _swapchainReady = false;
    }

    VK_CHECK(vkCreateSwapchainKHR(_gpuDevice->vkDevice, &context->swapchainCreateInfo, nullptr, &_gpuSwapchain->vkSwapchain));

    if (context->swapchainCreateInfo.oldSwapchain != VK_NULL_HANDLE) {
        _gpuSwapchain->depthStencilImageViews.clear();
        _gpuSwapchain->depthStencilImages.clear();

        for (FramebufferListMapIter it = _gpuSwapchain->vkSwapchainFramebufferListMap.begin();
             it != _gpuSwapchain->vkSwapchainFramebufferListMap.end(); it++) {
            FramebufferList &list = it->second;
            for (VkFramebuffer framebuffer : list) {
                vkDestroyFramebuffer(_gpuDevice->vkDevice, framebuffer, nullptr);
            }
            list.clear();
        }

        for (VkImageView imageView : _gpuSwapchain->vkSwapchainImageViews) {
            vkDestroyImageView(_gpuDevice->vkDevice, imageView, nullptr);
        }
        _gpuSwapchain->vkSwapchainImageViews.clear();
        _gpuSwapchain->swapchainImages.clear();

        vkDestroySwapchainKHR(_gpuDevice->vkDevice, context->swapchainCreateInfo.oldSwapchain, nullptr);
    }

    uint imageCount;
    VK_CHECK(vkGetSwapchainImagesKHR(_gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain, &imageCount, nullptr));
    _gpuSwapchain->swapchainImages.resize(imageCount);
    VK_CHECK(vkGetSwapchainImagesKHR(_gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain, &imageCount, _gpuSwapchain->swapchainImages.data()));
    assert(imageCount == context->swapchainCreateInfo.minImageCount); // assert if swapchain image count assumption is broken

    _gpuSwapchain->vkSwapchainImageViews.resize(imageCount);
    for (uint i = 0u; i < imageCount; i++) {
        _depthStencilTextures[i]->resize(_width, _height);
        _gpuSwapchain->depthStencilImages.push_back(((CCVKTexture *)_depthStencilTextures[i])->gpuTexture()->vkImage);
        _gpuSwapchain->depthStencilImageViews.push_back(((CCVKTexture *)_depthStencilTextures[i])->gpuTextureView()->vkImageView);

        VkImageViewCreateInfo imageViewCreateInfo{VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO};
        imageViewCreateInfo.image = _gpuSwapchain->swapchainImages[i];
        imageViewCreateInfo.viewType = VK_IMAGE_VIEW_TYPE_2D;
        imageViewCreateInfo.format = context->swapchainCreateInfo.imageFormat;
        imageViewCreateInfo.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        imageViewCreateInfo.subresourceRange.levelCount = 1;
        imageViewCreateInfo.subresourceRange.layerCount = 1;

        VK_CHECK(vkCreateImageView(_gpuDevice->vkDevice, &imageViewCreateInfo, nullptr, &_gpuSwapchain->vkSwapchainImageViews[i]));
    }

    bool hasStencil = GFX_FORMAT_INFOS[(uint)_context->getDepthStencilFormat()].hasStencil;
    vector<VkImageMemoryBarrier> barriers(imageCount * 2, {VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER});
    for (uint i = 0u; i < imageCount; i++) {
        barriers[i].image = _gpuSwapchain->swapchainImages[i];
        barriers[i].srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        barriers[i].dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        barriers[i].subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        barriers[i].subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
        barriers[i].subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
        barriers[i].srcAccessMask = 0;
        barriers[i].dstAccessMask = VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;
        barriers[i].oldLayout = VK_IMAGE_LAYOUT_UNDEFINED;
        barriers[i].newLayout = VK_IMAGE_LAYOUT_PRESENT_SRC_KHR;

        barriers[imageCount + i].image = _gpuSwapchain->depthStencilImages[i];
        barriers[imageCount + i].srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        barriers[imageCount + i].dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        barriers[imageCount + i].subresourceRange.aspectMask = hasStencil ? VK_IMAGE_ASPECT_DEPTH_BIT | VK_IMAGE_ASPECT_STENCIL_BIT : VK_IMAGE_ASPECT_DEPTH_BIT;
        barriers[imageCount + i].subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
        barriers[imageCount + i].subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
        barriers[imageCount + i].srcAccessMask = 0;
        barriers[imageCount + i].dstAccessMask = VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT;
        barriers[imageCount + i].oldLayout = VK_IMAGE_LAYOUT_UNDEFINED;
        barriers[imageCount + i].newLayout = hasStencil ? VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL : VK_IMAGE_LAYOUT_DEPTH_ATTACHMENT_OPTIMAL;
    }
    _gpuTransportHub->checkIn(
        [&](const CCVKGPUCommandBuffer *cmdBuff) {
            vkCmdPipelineBarrier(cmdBuff->vkCommandBuffer, VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT, VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
                                 VK_DEPENDENCY_BY_REGION_BIT, 0, nullptr, 0, nullptr, imageCount, barriers.data());
            vkCmdPipelineBarrier(cmdBuff->vkCommandBuffer, VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT, VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT,
                                 VK_DEPENDENCY_BY_REGION_BIT, 0, nullptr, 0, nullptr, imageCount, barriers.data() + imageCount);
        },
        true); // submit immediately

    for (FramebufferListMapIter it = _gpuSwapchain->vkSwapchainFramebufferListMap.begin();
         it != _gpuSwapchain->vkSwapchainFramebufferListMap.end(); it++) {
        CCVKCmdFuncCreateFramebuffer(this, it->first);
    }

    return _swapchainReady = true;
}

} // namespace gfx
} // namespace cc
