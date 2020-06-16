#include "VKStd.h"

#include "VKBindingLayout.h"
#include "VKBuffer.h"
#include "VKCommandAllocator.h"
#include "VKCommandBuffer.h"
#include "VKContext.h"
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

CCVKDevice::CCVKDevice() {
    _minClipZ = 0.0f;
    _projectionSignY = -1.0f;
}

CCVKDevice::~CCVKDevice() {
}

CCVKGPUContext *CCVKDevice::gpuContext() const {
    return ((CCVKContext *)_context)->gpuContext();
}

bool CCVKDevice::initialize(const GFXDeviceInfo &info) {
    _gfxAPI = GFXAPI::VULKAN;
    _deviceName = "Vulkan";
    _width = info.width;
    _height = info.height;
    _nativeWidth = info.nativeWidth;
    _nativeHeight = info.nativeHeight;
    _windowHandle = info.windowHandle;

    GFXContextInfo contextCreateInfo;
    contextCreateInfo.windowHandle = _windowHandle;
    contextCreateInfo.sharedCtx = info.sharedCtx;

    _context = CC_NEW(CCVKContext(this));
    if (!_context->initialize(contextCreateInfo)) {
        destroy();
        return false;
    }
    const CCVKContext *context = (CCVKContext *)_context;
    const CCVKGPUContext *gpuContext = ((CCVKContext *)_context)->gpuContext();
    const VkPhysicalDeviceFeatures &deviceFeatures = gpuContext->physicalDeviceFeatures;
    const VkPhysicalDeviceFeatures2 &deviceFeatures2 = gpuContext->physicalDeviceFeatures2;
    const VkPhysicalDeviceVulkan11Features &deviceVulkan11Features = gpuContext->physicalDeviceVulkan11Features;
    const VkPhysicalDeviceVulkan12Features &deviceVulkan12Features = gpuContext->physicalDeviceVulkan12Features;

    // only enable the absolute essentials for now
    std::vector<const char *> requestedValidationLayers{
        "VK_LAYER_KHRONOS_validation",
    };
    std::vector<const char *> requestedExtensions{
        VK_KHR_SWAPCHAIN_EXTENSION_NAME,
        VK_KHR_DEDICATED_ALLOCATION_EXTENSION_NAME,
        VK_KHR_GET_MEMORY_REQUIREMENTS_2_EXTENSION_NAME,
    };
    VkPhysicalDeviceFeatures2 requestedFeatures2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_FEATURES_2};
    VkPhysicalDeviceVulkan11Features requestedVulkan11Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_1_FEATURES};
    VkPhysicalDeviceVulkan12Features requestedVulkan12Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_2_FEATURES};
    // features should be enabled like this:
    requestedFeatures2.features.textureCompressionASTC_LDR = deviceFeatures2.features.textureCompressionASTC_LDR;
    requestedFeatures2.features.textureCompressionBC = deviceFeatures2.features.textureCompressionBC;
    requestedFeatures2.features.textureCompressionETC2 = deviceFeatures2.features.textureCompressionETC2;
    requestedFeatures2.features.samplerAnisotropy = deviceFeatures2.features.samplerAnisotropy;

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
    std::vector<VkDeviceQueueCreateInfo> queueCreateInfos(queueFamilyPropertiesCount, {VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO});
    std::vector<std::vector<float>> queuePriorities(queueFamilyPropertiesCount);

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
        if (context->minorVersion() >= 1) requestedFeatures2.pNext = &requestedVulkan11Features;
        if (context->minorVersion() >= 2) requestedVulkan11Features.pNext = &requestedVulkan12Features;
    }

    VK_CHECK(vkCreateDevice(gpuContext->physicalDevice, &deviceCreateInfo, nullptr, &_gpuDevice->vkDevice));

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

    _gpuSemaphorePool = CC_NEW(CCVKGPUSemaphorePool(_gpuDevice));
    _gpuFencePool = CC_NEW(CCVKGPUFencePool(_gpuDevice));

    GFXBufferInfo stagingBufferInfo;
    stagingBufferInfo.usage = GFXBufferUsage::TRANSFER_SRC;
    stagingBufferInfo.memUsage = GFXMemoryUsage::HOST;
    stagingBufferInfo.stride = _defaultStagingBufferSize;
    stagingBufferInfo.size = _defaultStagingBufferSize;
    _stagingBuffer = (CCVKBuffer *)createBuffer(stagingBufferInfo);

    GFXQueueInfo queueInfo;
    queueInfo.type = GFXQueueType::GRAPHICS;
    _queue = createQueue(queueInfo);

    GFXCommandAllocatorInfo cmdAllocInfo;
    _cmdAllocator = createCommandAllocator(cmdAllocInfo);

    for (uint i = 0u; i < gpuContext->swapchainCreateInfo.minImageCount; i++) {
        GFXTextureInfo depthStecnilTexInfo;
        depthStecnilTexInfo.type = GFXTextureType::TEX2D;
        depthStecnilTexInfo.usage = GFXTextureUsageBit::DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
        depthStecnilTexInfo.format = _context->getDepthStencilFormat();
        depthStecnilTexInfo.width = 1;
        depthStecnilTexInfo.height = 1;
        CCVKTexture *texture = (CCVKTexture *)createTexture(depthStecnilTexInfo);
        _depthStencilTextures.push_back(texture);
    }

    _gpuSwapchain = CC_NEW(CCVKGPUSwapchain);
    buildSwapchain();

    GFXTextureInfo textureInfo;
    GFXTextureViewInfo texViewInfo;

    textureInfo.usage = GFXTextureUsageBit::SAMPLED;
    textureInfo.format = GFXFormat::RGBA8;
    textureInfo.width = 2;
    textureInfo.height = 2;
    GFXTexture *nullTexture2D = createTexture(textureInfo);

    texViewInfo.texture = nullTexture2D;
    texViewInfo.format = GFXFormat::RGBA8;
    nullTexView2D = (CCVKTexture *)createTexture(texViewInfo);

    textureInfo.arrayLayer = 6;
    textureInfo.flags = GFXTextureFlagBit::CUBEMAP;
    GFXTexture *nullTextureCube = createTexture(textureInfo);

    texViewInfo.texture = nullTextureCube;
    texViewInfo.layerCount = 6;
    nullTexViewCube = (CCVKTexture *)createTexture(texViewInfo);

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

    _features[(int)GFXFeature::COLOR_FLOAT] = true;
    _features[(int)GFXFeature::COLOR_HALF_FLOAT] = true;
    _features[(int)GFXFeature::TEXTURE_FLOAT] = true;
    _features[(int)GFXFeature::TEXTURE_HALF_FLOAT] = true;
    _features[(int)GFXFeature::TEXTURE_FLOAT_LINEAR] = true;
    _features[(int)GFXFeature::TEXTURE_HALF_FLOAT_LINEAR] = true;
    _features[(int)GFXFeature::FORMAT_R11G11B10F] = true;
    _features[(int)GFXFeature::FORMAT_D24S8] = true;
    _features[(int)GFXFeature::MSAA] = true;
    _features[(int)GFXFeature::ELEMENT_INDEX_UINT] = true;
    _features[(int)GFXFeature::INSTANCED_ARRAYS] = true;

    String compressedFmts;
    if (deviceFeatures.textureCompressionETC2) {
        _features[(int)GFXFeature::FORMAT_ETC2] = true;
        compressedFmts += "etc2 ";
    }
    if (deviceFeatures.textureCompressionASTC_LDR) {
        _features[(int)GFXFeature::FORMAT_ASTC] = true;
        compressedFmts += "astc ";
    }
    _features[static_cast<uint>(GFXFeature::DEPTH_BOUNDS)] = deviceFeatures.depthBounds;
    _features[static_cast<uint>(GFXFeature::LINE_WIDTH)] = true;
    _features[static_cast<uint>(GFXFeature::STENCIL_COMPARE_MASK)] = true;
    _features[static_cast<uint>(GFXFeature::STENCIL_WRITE_MASK)] = true;
    _features[static_cast<uint>(GFXFeature::FORMAT_RGB8)] = findSupportedFormat({ GFXFormat::RGB8, VK_FORMAT_R8G8B8_UNORM }, VK_IMAGE_TILING_OPTIMAL, VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_COLOR_ATTACHMENT_BIT, gpuContext->physicalDevice);
    _features[static_cast<uint>(GFXFeature::FORMAT_D16)] = findSupportedFormat({ GFXFormat::D16, VK_FORMAT_D16_UNORM }, VK_IMAGE_TILING_OPTIMAL, VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT, gpuContext->physicalDevice);
    _features[static_cast<uint>(GFXFeature::FORMAT_D16S8)] = findSupportedFormat({ GFXFormat::D16S8, VK_FORMAT_D16_UNORM_S8_UINT }, VK_IMAGE_TILING_OPTIMAL, VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT, gpuContext->physicalDevice);
    _features[static_cast<uint>(GFXFeature::FORMAT_D24)] = false;
    _features[static_cast<uint>(GFXFeature::FORMAT_D24S8)] = findSupportedFormat({ GFXFormat::D24S8, VK_FORMAT_D24_UNORM_S8_UINT }, VK_IMAGE_TILING_OPTIMAL, VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT, gpuContext->physicalDevice);
    _features[static_cast<uint>(GFXFeature::FORMAT_D32F)] = findSupportedFormat({ GFXFormat::D32F, VK_FORMAT_D32_SFLOAT }, VK_IMAGE_TILING_OPTIMAL, VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT, gpuContext->physicalDevice);
    _features[static_cast<uint>(GFXFeature::FORMAT_D32FS8)] = findSupportedFormat({ GFXFormat::D32F_S8, VK_FORMAT_D32_SFLOAT_S8_UINT }, VK_IMAGE_TILING_OPTIMAL, VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT, gpuContext->physicalDevice);

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
    MapDepthStencilBits(_context->getDepthStencilFormat(), _depthBits, _stencilBits);

    return true;
}

void CCVKDevice::destroy() {
    CC_SAFE_DESTROY(_cmdAllocator);
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_stagingBuffer);
    CC_SAFE_DELETE(_gpuSemaphorePool);
    CC_SAFE_DELETE(_gpuFencePool);

    for (CCVKTexture *texture : _depthStencilTextures) {
        CC_SAFE_DESTROY(texture);
    }
    _depthStencilTextures.clear();

    if (_gpuSwapchain) {
        if (_gpuSwapchain->vkSwapchain != VK_NULL_HANDLE) {
            _gpuSwapchain->depthStencilImageViews.clear();
            _gpuSwapchain->depthStencilImages.clear();

            for (FramebufferListMapPair pair : _gpuSwapchain->vkSwapchainFramebufferListMap) {
                for (VkFramebuffer framebuffer : pair.second) {
                    vkDestroyFramebuffer(_gpuDevice->vkDevice, framebuffer, nullptr);
                }
                pair.second.clear();
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

        CC_DELETE(_gpuSwapchain);
        _gpuSwapchain = nullptr;
    }

    if (_gpuDevice) {
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
    buildSwapchain();
}

void CCVKDevice::buildSwapchain() {
    CCVKGPUContext *context = ((CCVKContext *)_context)->gpuContext();
    context->swapchainCreateInfo.oldSwapchain = _gpuSwapchain->vkSwapchain;
    _gpuSwapchain->curImageIndex = 0;

    VkSurfaceCapabilitiesKHR surfaceCapabilities;
    VK_CHECK(vkGetPhysicalDeviceSurfaceCapabilitiesKHR(context->physicalDevice, context->vkSurface, &surfaceCapabilities));

    if (context->swapchainCreateInfo.imageExtent.width == surfaceCapabilities.currentExtent.width &&
        context->swapchainCreateInfo.imageExtent.height == surfaceCapabilities.currentExtent.height) {
        return;
    }

    if (surfaceCapabilities.currentExtent.width == (uint)-1) {
        context->swapchainCreateInfo.imageExtent.width = _width;
        context->swapchainCreateInfo.imageExtent.height = _height;
    } else {
        _width = context->swapchainCreateInfo.imageExtent.width = surfaceCapabilities.currentExtent.width;
        _height = context->swapchainCreateInfo.imageExtent.height = surfaceCapabilities.currentExtent.height;
    }
    VK_CHECK(vkCreateSwapchainKHR(_gpuDevice->vkDevice, &context->swapchainCreateInfo, nullptr, &_gpuSwapchain->vkSwapchain));

    if (context->swapchainCreateInfo.oldSwapchain != VK_NULL_HANDLE) {
        _gpuSwapchain->depthStencilImageViews.clear();
        _gpuSwapchain->depthStencilImages.clear();

        for (FramebufferListMapPair pair : _gpuSwapchain->vkSwapchainFramebufferListMap) {
            for (VkFramebuffer framebuffer : pair.second) {
                vkDestroyFramebuffer(_gpuDevice->vkDevice, framebuffer, nullptr);
            }
            pair.second.clear();
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

        GFXTextureViewInfo textureViewInfo;
        textureViewInfo.texture = _depthStencilTextures[i];
        textureViewInfo.type = GFXTextureType::TEX2D;
        textureViewInfo.format = _context->getDepthStencilFormat();
        _depthStencilTextures[i]->initialize(textureViewInfo);
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

    for (FramebufferListMapPair pair : _gpuSwapchain->vkSwapchainFramebufferListMap) {
        CCVKCmdFuncCreateFramebuffer(this, pair.first);
    }
}

void CCVKDevice::acquire() {
    VK_CHECK(vkDeviceWaitIdle(_gpuDevice->vkDevice));
    _gpuSemaphorePool->reset();
    _gpuFencePool->reset();
    ((CCVKCommandAllocator *)_cmdAllocator)->reset();

    VkSemaphore acquireSemaphore = _gpuSemaphorePool->alloc();
    VK_CHECK(vkAcquireNextImageKHR(_gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain,
                                   ~0ull, acquireSemaphore, VK_NULL_HANDLE, &_gpuSwapchain->curImageIndex));

    // Clear queue stats
    CCVKQueue *queue = (CCVKQueue *)_queue;
    queue->_numDrawCalls = 0;
    queue->_numInstances = 0;
    queue->_numTriangles = 0;
    queue->gpuQueue()->nextWaitSemaphore = acquireSemaphore;
    queue->gpuQueue()->nextSignalSemaphore = _gpuSemaphorePool->alloc();
}

void CCVKDevice::present() {
    CCVKQueue *queue = (CCVKQueue *)_queue;
    _numDrawCalls = queue->_numDrawCalls;
    _numInstances = queue->_numInstances;
    _numTriangles = queue->_numTriangles;

    VkPresentInfoKHR presentInfo{VK_STRUCTURE_TYPE_PRESENT_INFO_KHR};
    presentInfo.waitSemaphoreCount = 1;
    presentInfo.pWaitSemaphores = &queue->gpuQueue()->nextWaitSemaphore;
    presentInfo.swapchainCount = 1;
    presentInfo.pSwapchains = &_gpuSwapchain->vkSwapchain;
    presentInfo.pImageIndices = &_gpuSwapchain->curImageIndex;

    VK_CHECK(vkQueuePresentKHR(queue->gpuQueue()->vkQueue, &presentInfo));
}

GFXFence *CCVKDevice::createFence(const GFXFenceInfo &info) {
    GFXFence *fence = CC_NEW(CCVKFence(this));
    if (fence->initialize(info))
        return fence;

    CC_SAFE_DESTROY(fence);
    return nullptr;
}

GFXQueue *CCVKDevice::createQueue(const GFXQueueInfo &info) {
    GFXQueue *queue = CC_NEW(CCVKQueue(this));
    if (queue->initialize(info))
        return queue;

    CC_SAFE_DESTROY(queue);
    return nullptr;
}

GFXCommandAllocator *CCVKDevice::createCommandAllocator(const GFXCommandAllocatorInfo &info) {
    GFXCommandAllocator *cmdAllocator = CC_NEW(CCVKCommandAllocator(this));
    if (cmdAllocator->initialize(info))
        return cmdAllocator;

    CC_SAFE_DESTROY(cmdAllocator);
    return nullptr;
}

GFXCommandBuffer *CCVKDevice::createCommandBuffer(const GFXCommandBufferInfo &info) {
    GFXCommandBuffer *gfx_cmd_buff = CC_NEW(CCVKCommandBuffer(this));
    if (gfx_cmd_buff->initialize(info))
        return gfx_cmd_buff;

    CC_SAFE_DESTROY(gfx_cmd_buff)
    return nullptr;
}

GFXBuffer *CCVKDevice::createBuffer(const GFXBufferInfo &info) {
    GFXBuffer *buffer = CC_NEW(CCVKBuffer(this));
    if (buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

GFXTexture *CCVKDevice::createTexture(const GFXTextureInfo &info) {
    GFXTexture *texture = CC_NEW(CCVKTexture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

GFXTexture *CCVKDevice::createTexture(const GFXTextureViewInfo &info) {
    GFXTexture *texture = CC_NEW(CCVKTexture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

GFXSampler *CCVKDevice::createSampler(const GFXSamplerInfo &info) {
    GFXSampler *sampler = CC_NEW(CCVKSampler(this));
    if (sampler->initialize(info))
        return sampler;

    CC_SAFE_DESTROY(sampler);
    return nullptr;
}

GFXShader *CCVKDevice::createShader(const GFXShaderInfo &info) {
    GFXShader *shader = CC_NEW(CCVKShader(this));
    if (shader->initialize(info))
        return shader;

    CC_SAFE_DESTROY(shader);
    return nullptr;
}

GFXInputAssembler *CCVKDevice::createInputAssembler(const GFXInputAssemblerInfo &info) {
    GFXInputAssembler *inputAssembler = CC_NEW(CCVKInputAssembler(this));
    if (inputAssembler->initialize(info))
        return inputAssembler;

    CC_SAFE_DESTROY(inputAssembler);
    return nullptr;
}

GFXRenderPass *CCVKDevice::createRenderPass(const GFXRenderPassInfo &info) {
    GFXRenderPass *renderPass = CC_NEW(CCVKRenderPass(this));
    if (renderPass->initialize(info))
        return renderPass;

    CC_SAFE_DESTROY(renderPass);
    return nullptr;
}

GFXFramebuffer *CCVKDevice::createFramebuffer(const GFXFramebufferInfo &info) {
    GFXFramebuffer *framebuffer = CC_NEW(CCVKFramebuffer(this));
    if (framebuffer->initialize(info))
        return framebuffer;

    CC_SAFE_DESTROY(framebuffer);
    return nullptr;
}

GFXBindingLayout *CCVKDevice::createBindingLayout(const GFXBindingLayoutInfo &info) {
    GFXBindingLayout *bindingLayout = CC_NEW(CCVKBindingLayout(this));
    if (bindingLayout->initialize(info))
        return bindingLayout;

    CC_SAFE_DESTROY(bindingLayout);
    return nullptr;
}

GFXPipelineState *CCVKDevice::createPipelineState(const GFXPipelineStateInfo &info) {
    GFXPipelineState *pipelineState = CC_NEW(CCVKPipelineState(this));
    if (pipelineState->initialize(info))
        return pipelineState;

    CC_SAFE_DESTROY(pipelineState);
    return nullptr;
}

GFXPipelineLayout *CCVKDevice::createPipelineLayout(const GFXPipelineLayoutInfo &info) {
    GFXPipelineLayout *layout = CC_NEW(CCVKPipelineLayout(this));
    if (layout->initialize(info))
        return layout;

    CC_SAFE_DESTROY(layout);
    return nullptr;
}

void CCVKDevice::copyBuffersToTexture(const GFXDataArray &buffers, GFXTexture *dst, const GFXBufferTextureCopyList &regions) {
    CCVKCmdFuncCopyBuffersToTexture(this, buffers.datas.data(), ((CCVKTexture *)dst)->gpuTexture(), regions);
}

}
