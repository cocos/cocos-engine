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

#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommandBuffer.h"
#include "VKContext.h"
#include "VKDescriptorSet.h"
#include "VKDescriptorSetLayout.h"
#include "VKDevice.h"
#include "VKFramebuffer.h"
#include "VKGlobalBarrier.h"
#include "VKInputAssembler.h"
#include "VKPipelineLayout.h"
#include "VKPipelineState.h"
#include "VKQueue.h"
#include "VKRenderPass.h"
#include "VKSampler.h"
#include "VKShader.h"
#include "VKTexture.h"
#include "VKTextureBarrier.h"
#include "VKUtils.h"

CC_DISABLE_WARNINGS()
#define VMA_IMPLEMENTATION
#include "vk_mem_alloc.h"
#define THSVS_ERROR_CHECK_MIXED_IMAGE_LAYOUT
#define THSVS_ERROR_CHECK_COULD_USE_GLOBAL_BARRIER
#define THSVS_ERROR_CHECK_POTENTIAL_HAZARD
#define THSVS_SIMPLER_VULKAN_SYNCHRONIZATION_IMPLEMENTATION
#include "thsvs_simpler_vulkan_synchronization.h"
CC_ENABLE_WARNINGS()

namespace cc {
namespace gfx {

//#define DISABLE_PRE_TRANSFORM

CCVKDevice::CCVKDevice() {
    _caps.clipSpaceMinZ    = 0.0f;
    _caps.screenSpaceSignY = -1.0f;
    _caps.UVSpaceSignY     = 1.0f;
}

CCVKDevice::~CCVKDevice() {
}

CCVKGPUContext *CCVKDevice::gpuContext() const {
    return ((CCVKContext *)_context)->gpuContext();
}

bool CCVKDevice::initialize(const DeviceInfo &info) {
    _API          = API::VULKAN;
    _deviceName   = "Vulkan";
    _width        = info.width;
    _height       = info.height;
    _nativeWidth  = info.nativeWidth;
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
    contextCreateInfo.sharedCtx    = info.sharedCtx;

    _context = CC_NEW(CCVKContext(this));
    if (!_context->initialize(contextCreateInfo)) {
        destroy();
        return false;
    }
    const CCVKContext *              context         = (CCVKContext *)_context;
    const CCVKGPUContext *           gpuContext      = ((CCVKContext *)_context)->gpuContext();
    const VkPhysicalDeviceFeatures2 &deviceFeatures2 = gpuContext->physicalDeviceFeatures2;
    const VkPhysicalDeviceFeatures & deviceFeatures  = deviceFeatures2.features;
    //const VkPhysicalDeviceVulkan11Features &deviceVulkan11Features = gpuContext->physicalDeviceVulkan11Features;
    //const VkPhysicalDeviceVulkan12Features &deviceVulkan12Features = gpuContext->physicalDeviceVulkan12Features;

    ///////////////////// Device Creation /////////////////////

    _gpuDevice               = CC_NEW(CCVKGPUDevice);
    _gpuDevice->minorVersion = context->minorVersion();

    // only enable the absolute essentials for now
    vector<const char *> requestedValidationLayers{};

#if CC_DEBUG > 0
    requestedValidationLayers.push_back("VK_LAYER_KHRONOS_validation");
#endif

    vector<const char *> requestedExtensions{
        VK_KHR_SWAPCHAIN_EXTENSION_NAME,
    };
    if (_gpuDevice->minorVersion < 1) {
        requestedExtensions.push_back(VK_KHR_DEDICATED_ALLOCATION_EXTENSION_NAME);
        requestedExtensions.push_back(VK_KHR_GET_MEMORY_REQUIREMENTS_2_EXTENSION_NAME);
        requestedExtensions.push_back(VK_KHR_DESCRIPTOR_UPDATE_TEMPLATE_EXTENSION_NAME);
    }

    VkPhysicalDeviceFeatures2        requestedFeatures2{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_FEATURES_2};
    VkPhysicalDeviceVulkan11Features requestedVulkan11Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_1_FEATURES};
    VkPhysicalDeviceVulkan12Features requestedVulkan12Features{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_2_FEATURES};
    // features should be enabled like this:
    requestedFeatures2.features.textureCompressionASTC_LDR = deviceFeatures.textureCompressionASTC_LDR;
    requestedFeatures2.features.textureCompressionBC       = deviceFeatures.textureCompressionBC;
    requestedFeatures2.features.textureCompressionETC2     = deviceFeatures.textureCompressionETC2;
    requestedFeatures2.features.samplerAnisotropy          = deviceFeatures.samplerAnisotropy;
    requestedFeatures2.features.depthBounds                = deviceFeatures.depthBounds;
    requestedFeatures2.features.multiDrawIndirect          = deviceFeatures.multiDrawIndirect;

#if CC_DEBUG > 0
    // GPU-assisted validation
    requestedFeatures2.features.shaderInt64                    = deviceFeatures.shaderInt64;
    requestedFeatures2.features.fragmentStoresAndAtomics       = deviceFeatures.fragmentStoresAndAtomics;
    requestedFeatures2.features.vertexPipelineStoresAndAtomics = deviceFeatures.vertexPipelineStoresAndAtomics;
    requestedExtensions.push_back(VK_KHR_SHADER_NON_SEMANTIC_INFO_EXTENSION_NAME);
#endif

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
    uint                            queueFamilyPropertiesCount = toUint(gpuContext->queueFamilyProperties.size());
    vector<VkDeviceQueueCreateInfo> queueCreateInfos(queueFamilyPropertiesCount, {VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO});
    vector<vector<float>>           queuePriorities(queueFamilyPropertiesCount);

    for (uint queueFamilyIndex = 0u; queueFamilyIndex < queueFamilyPropertiesCount; ++queueFamilyIndex) {
        const VkQueueFamilyProperties &queueFamilyProperty = gpuContext->queueFamilyProperties[queueFamilyIndex];

        queuePriorities[queueFamilyIndex].resize(queueFamilyProperty.queueCount, 1.0f);

        VkDeviceQueueCreateInfo &queueCreateInfo = queueCreateInfos[queueFamilyIndex];

        queueCreateInfo.queueFamilyIndex = queueFamilyIndex;
        queueCreateInfo.queueCount       = queueFamilyProperty.queueCount;
        queueCreateInfo.pQueuePriorities = queuePriorities[queueFamilyIndex].data();
    }

    VkDeviceCreateInfo deviceCreateInfo{VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO};

    deviceCreateInfo.queueCreateInfoCount    = toUint(queueCreateInfos.size());
    deviceCreateInfo.pQueueCreateInfos       = queueCreateInfos.data();
    deviceCreateInfo.enabledLayerCount       = toUint(_layers.size());
    deviceCreateInfo.ppEnabledLayerNames     = _layers.data();
    deviceCreateInfo.enabledExtensionCount   = toUint(_extensions.size());
    deviceCreateInfo.ppEnabledExtensionNames = _extensions.data();
    if (_gpuDevice->minorVersion < 1 &&
        !context->checkExtension(VK_KHR_GET_PHYSICAL_DEVICE_PROPERTIES_2_EXTENSION_NAME)) {
        deviceCreateInfo.pEnabledFeatures = &requestedFeatures2.features;
    } else {
        deviceCreateInfo.pNext = &requestedFeatures2;
        if (_gpuDevice->minorVersion >= 2) {
            requestedFeatures2.pNext        = &requestedVulkan11Features;
            requestedVulkan11Features.pNext = &requestedVulkan12Features;
        }
    }

    VK_CHECK(vkCreateDevice(gpuContext->physicalDevice, &deviceCreateInfo, nullptr, &_gpuDevice->vkDevice));

    ///////////////////// Gather Device Properties /////////////////////

    _features[(uint)Feature::COLOR_FLOAT]               = true;
    _features[(uint)Feature::COLOR_HALF_FLOAT]          = true;
    _features[(uint)Feature::TEXTURE_FLOAT]             = true;
    _features[(uint)Feature::TEXTURE_HALF_FLOAT]        = true;
    _features[(uint)Feature::TEXTURE_FLOAT_LINEAR]      = true;
    _features[(uint)Feature::TEXTURE_HALF_FLOAT_LINEAR] = true;
    _features[(uint)Feature::FORMAT_R11G11B10F]         = true;
    _features[(uint)Feature::MSAA]                      = true;
    _features[(uint)Feature::ELEMENT_INDEX_UINT]        = true;
    _features[(uint)Feature::INSTANCED_ARRAYS]          = true;
    _features[(uint)Feature::MULTIPLE_RENDER_TARGETS]   = true;
    _features[(uint)Feature::BLEND_MINMAX]              = true;
    _features[(uint)Feature::DEPTH_BOUNDS]              = deviceFeatures.depthBounds;
    _features[(uint)Feature::LINE_WIDTH]                = true;
    _features[(uint)Feature::STENCIL_COMPARE_MASK]      = true;
    _features[(uint)Feature::STENCIL_WRITE_MASK]        = true;
    _features[(uint)Feature::MULTITHREADED_SUBMISSION]  = true;
    _features[(uint)Feature::COMPUTE_SHADER]            = true;

    _gpuDevice->useMultiDrawIndirect        = deviceFeatures.multiDrawIndirect;
    _gpuDevice->useDescriptorUpdateTemplate = _gpuDevice->minorVersion > 0 || checkExtension(VK_KHR_DESCRIPTOR_UPDATE_TEMPLATE_EXTENSION_NAME);

    VkFormatFeatureFlags requiredFeatures = VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_COLOR_ATTACHMENT_BIT;
    VkFormatProperties   formatProperties;
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
    _caps.maxVertexAttributes            = limits.maxVertexInputAttributes;
    _caps.maxVertexUniformVectors        = limits.maxPerStageDescriptorUniformBuffers;
    _caps.maxFragmentUniformVectors      = limits.maxPerStageDescriptorUniformBuffers;
    _caps.maxUniformBufferBindings       = limits.maxDescriptorSetUniformBuffers;
    _caps.maxUniformBlockSize            = limits.maxUniformBufferRange;
    _caps.maxShaderStorageBlockSize      = limits.maxStorageBufferRange;
    _caps.maxShaderStorageBufferBindings = limits.maxDescriptorSetStorageBuffers;
    _caps.maxTextureUnits                = limits.maxDescriptorSetSampledImages;
    _caps.maxVertexTextureUnits          = limits.maxPerStageDescriptorSampledImages;
    _caps.maxTextureSize                 = limits.maxImageDimension2D;
    _caps.maxCubeMapTextureSize          = limits.maxImageDimensionCube;
    _caps.uboOffsetAlignment             = (uint)limits.minUniformBufferOffsetAlignment;
    MapDepthStencilBits(_context->getDepthStencilFormat(), _caps.depthBits, _caps.stencilBits);
    // compute shaders
    _caps.maxComputeSharedMemorySize     = limits.maxComputeSharedMemorySize;
    _caps.maxComputeWorkGroupInvocations = limits.maxComputeWorkGroupInvocations;
    _caps.maxComputeWorkGroupCount       = {limits.maxComputeWorkGroupCount[0], limits.maxComputeWorkGroupCount[1], limits.maxComputeWorkGroupCount[2]};
    _caps.maxComputeWorkGroupSize        = {limits.maxComputeWorkGroupSize[0], limits.maxComputeWorkGroupSize[1], limits.maxComputeWorkGroupSize[2]};
#if defined(VK_USE_PLATFORM_ANDROID_KHR)
    _caps.maxComputeWorkGroupInvocations = 64; // UNASSIGNED-BestPractices-vkCreateComputePipelines-compute-work-group-size
#endif                                         // defined(VK_USE_PLATFORM_ANDROID_KHR)

    ///////////////////// Resource Initialization /////////////////////

    VmaVulkanFunctions vmaVulkanFunc{};
    vmaVulkanFunc.vkAllocateMemory                    = vkAllocateMemory;
    vmaVulkanFunc.vkBindBufferMemory                  = vkBindBufferMemory;
    vmaVulkanFunc.vkBindImageMemory                   = vkBindImageMemory;
    vmaVulkanFunc.vkCreateBuffer                      = vkCreateBuffer;
    vmaVulkanFunc.vkCreateImage                       = vkCreateImage;
    vmaVulkanFunc.vkDestroyBuffer                     = vkDestroyBuffer;
    vmaVulkanFunc.vkDestroyImage                      = vkDestroyImage;
    vmaVulkanFunc.vkFlushMappedMemoryRanges           = vkFlushMappedMemoryRanges;
    vmaVulkanFunc.vkFreeMemory                        = vkFreeMemory;
    vmaVulkanFunc.vkGetBufferMemoryRequirements       = vkGetBufferMemoryRequirements;
    vmaVulkanFunc.vkGetImageMemoryRequirements        = vkGetImageMemoryRequirements;
    vmaVulkanFunc.vkGetPhysicalDeviceMemoryProperties = vkGetPhysicalDeviceMemoryProperties;
    vmaVulkanFunc.vkGetPhysicalDeviceProperties       = vkGetPhysicalDeviceProperties;
    vmaVulkanFunc.vkInvalidateMappedMemoryRanges      = vkInvalidateMappedMemoryRanges;
    vmaVulkanFunc.vkMapMemory                         = vkMapMemory;
    vmaVulkanFunc.vkUnmapMemory                       = vkUnmapMemory;

    VmaAllocatorCreateInfo allocatorInfo{};
    allocatorInfo.physicalDevice = gpuContext->physicalDevice;
    allocatorInfo.device         = _gpuDevice->vkDevice;
    allocatorInfo.instance       = gpuContext->vkInstance;

    if (_gpuDevice->minorVersion > 0) {
        allocatorInfo.flags |= VMA_ALLOCATOR_CREATE_KHR_DEDICATED_ALLOCATION_BIT;
        vmaVulkanFunc.vkGetBufferMemoryRequirements2KHR = vkGetBufferMemoryRequirements2;
        vmaVulkanFunc.vkGetImageMemoryRequirements2KHR  = vkGetImageMemoryRequirements2;
    } else if (checkExtension(VK_KHR_DEDICATED_ALLOCATION_EXTENSION_NAME) &&
               checkExtension(VK_KHR_GET_MEMORY_REQUIREMENTS_2_EXTENSION_NAME)) {
        allocatorInfo.flags |= VMA_ALLOCATOR_CREATE_KHR_DEDICATED_ALLOCATION_BIT;
        vmaVulkanFunc.vkGetBufferMemoryRequirements2KHR = vkGetBufferMemoryRequirements2KHR;
        vmaVulkanFunc.vkGetImageMemoryRequirements2KHR  = vkGetImageMemoryRequirements2KHR;
    }

    allocatorInfo.pVulkanFunctions = &vmaVulkanFunc;

    VK_CHECK(vmaCreateAllocator(&allocatorInfo, &_gpuDevice->memoryAllocator));

    QueueInfo queueInfo;
    queueInfo.type = QueueType::GRAPHICS;
    _queue         = createQueue(queueInfo);

    uint backBufferCount = gpuContext->swapchainCreateInfo.minImageCount;
    for (uint i = 0u; i < backBufferCount; i++) {
        _gpuFencePools.push_back(CC_NEW(CCVKGPUFencePool(_gpuDevice)));
        _gpuRecycleBins.push_back(CC_NEW(CCVKGPURecycleBin(_gpuDevice)));
        _gpuStagingBufferPools.push_back(CC_NEW(CCVKGPUStagingBufferPool(_gpuDevice)));
    }

    _gpuBufferHub        = CC_NEW(CCVKGPUBufferHub(_gpuDevice));
    _gpuTransportHub     = CC_NEW(CCVKGPUTransportHub(_gpuDevice, ((CCVKQueue *)_queue)->gpuQueue()));
    _gpuDescriptorHub    = CC_NEW(CCVKGPUDescriptorHub(_gpuDevice));
    _gpuSemaphorePool    = CC_NEW(CCVKGPUSemaphorePool(_gpuDevice));
    _gpuBarrierManager   = CC_NEW(CCVKGPUBarrierManager(_gpuDevice));
    _gpuDescriptorSetHub = CC_NEW(CCVKGPUDescriptorSetHub(_gpuDevice));

    _gpuDescriptorHub->link(_gpuDescriptorSetHub);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type  = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff          = createCommandBuffer(cmdBuffInfo);

    CCVKCmdFuncCreateSampler(this, &_gpuDevice->defaultSampler);

    _gpuDevice->defaultTexture.format = Format::RGBA8;
    _gpuDevice->defaultTexture.usage  = TextureUsageBit::SAMPLED;
    _gpuDevice->defaultTexture.width = _gpuDevice->defaultTexture.height = 1u;
    _gpuDevice->defaultTexture.size                                      = FormatSize(Format::RGBA8, 1u, 1u, 1u);
    CCVKCmdFuncCreateTexture(this, &_gpuDevice->defaultTexture);

    _gpuDevice->defaultTextureView.gpuTexture = &_gpuDevice->defaultTexture;
    _gpuDevice->defaultTextureView.format     = Format::RGBA8;
    CCVKCmdFuncCreateTextureView(this, &_gpuDevice->defaultTextureView);

    ThsvsImageBarrier barrier{};
    barrier.nextAccessCount             = 1;
    barrier.pNextAccesses               = &THSVS_ACCESS_TYPES[(uint)AccessType::VERTEX_SHADER_READ_TEXTURE];
    barrier.image                       = _gpuDevice->defaultTexture.vkImage;
    barrier.srcQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    barrier.dstQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    barrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
    barrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
    barrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
    gpuTransportHub()->checkIn(
        [&barrier](const CCVKGPUCommandBuffer *gpuCommandBuffer) {
            CCVKCmdFuncImageMemoryBarrier(gpuCommandBuffer, barrier);
        },
        true); // submit immediately

    _gpuDevice->defaultBuffer.usage    = BufferUsage::UNIFORM;
    _gpuDevice->defaultBuffer.memUsage = MemoryUsage::HOST | MemoryUsage::DEVICE;
    _gpuDevice->defaultBuffer.size = _gpuDevice->defaultBuffer.stride = 16u;
    _gpuDevice->defaultBuffer.count                                   = 1u;
    CCVKCmdFuncCreateBuffer(this, &_gpuDevice->defaultBuffer);

    VkPipelineCacheCreateInfo pipelineCacheInfo{VK_STRUCTURE_TYPE_PIPELINE_CACHE_CREATE_INFO};
    VK_CHECK(vkCreatePipelineCache(_gpuDevice->vkDevice, &pipelineCacheInfo, nullptr, &_gpuDevice->vkPipelineCache));

    for (uint i = 0u; i < gpuContext->swapchainCreateInfo.minImageCount; i++) {
        TextureInfo depthStencilTexInfo;
        depthStencilTexInfo.type   = TextureType::TEX2D;
        depthStencilTexInfo.usage  = TextureUsageBit::DEPTH_STENCIL_ATTACHMENT | TextureUsageBit::SAMPLED;
        depthStencilTexInfo.format = _context->getDepthStencilFormat();
        depthStencilTexInfo.width  = _width;
        depthStencilTexInfo.height = _height;
        CCVKTexture *texture       = (CCVKTexture *)createTexture(depthStencilTexInfo);
        _depthStencilTextures.push_back(texture);
    }

    _gpuDevice->swapchain = _gpuSwapchain = CC_NEW(CCVKGPUSwapchain);
    checkSwapchainStatus();

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
    _renderer           = gpuContext->physicalDeviceProperties.deviceName;
    _vendor             = MapVendorName(gpuContext->physicalDeviceProperties.vendorID);
    _version            = StringUtil::Format("%d.%d.%d", VK_VERSION_MAJOR(apiVersion),
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
    CC_LOG_INFO("SWAPCHAIN_IMAGE_COUNT: %d", gpuContext->swapchainCreateInfo.minImageCount);

    return true;
}

void CCVKDevice::destroy() {
    if (_gpuDevice && _gpuDevice->vkDevice) {
        VK_CHECK(vkDeviceWaitIdle(_gpuDevice->vkDevice));
    }

    for (CCVKTexture *texture : _depthStencilTextures) {
        CC_SAFE_DESTROY(texture);
    }
    _depthStencilTextures.clear();

    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_cmdBuff);

    CC_SAFE_DELETE(_gpuBufferHub);
    CC_SAFE_DELETE(_gpuTransportHub);
    CC_SAFE_DELETE(_gpuSemaphorePool);
    CC_SAFE_DELETE(_gpuDescriptorHub);
    CC_SAFE_DELETE(_gpuBarrierManager);
    CC_SAFE_DELETE(_gpuDescriptorSetHub);

    uint backBufferCount = ((CCVKContext *)_context)->gpuContext()->swapchainCreateInfo.minImageCount;
    for (uint i = 0u; i < backBufferCount; i++) {
        _gpuRecycleBins[i]->clear();

        CC_SAFE_DELETE(_gpuStagingBufferPools[i]);
        CC_SAFE_DELETE(_gpuRecycleBins[i]);
        CC_SAFE_DELETE(_gpuFencePools[i]);
    }
    _gpuStagingBufferPools.clear();
    _gpuRecycleBins.clear();
    _gpuFencePools.clear();

    if (_gpuSwapchain) {
        destroySwapchain();
        CC_DELETE(_gpuSwapchain);
        _gpuSwapchain = nullptr;
    }

    if (_gpuDevice) {
        if (_gpuDevice->vkPipelineCache) {
            vkDestroyPipelineCache(_gpuDevice->vkDevice, _gpuDevice->vkPipelineCache, nullptr);
            _gpuDevice->vkPipelineCache = VK_NULL_HANDLE;
        }

        if (_gpuDevice->defaultBuffer.vkBuffer) {
            vmaDestroyBuffer(_gpuDevice->memoryAllocator, _gpuDevice->defaultBuffer.vkBuffer, _gpuDevice->defaultBuffer.vmaAllocation);
            _gpuDevice->defaultBuffer.vkBuffer      = VK_NULL_HANDLE;
            _gpuDevice->defaultBuffer.vmaAllocation = VK_NULL_HANDLE;
        }
        if (_gpuDevice->defaultTextureView.vkImageView) {
            vkDestroyImageView(_gpuDevice->vkDevice, _gpuDevice->defaultTextureView.vkImageView, nullptr);
            _gpuDevice->defaultTextureView.vkImageView = VK_NULL_HANDLE;
        }
        if (_gpuDevice->defaultTexture.vkImage) {
            vmaDestroyImage(_gpuDevice->memoryAllocator, _gpuDevice->defaultTexture.vkImage, _gpuDevice->defaultTexture.vmaAllocation);
            _gpuDevice->defaultTexture.vkImage       = VK_NULL_HANDLE;
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

        for (CCVKGPUDevice::CommandBufferPools::iterator it = _gpuDevice->commandBufferPools.begin();
             it != _gpuDevice->commandBufferPools.end(); ++it) {
            CC_SAFE_DELETE(it->second);
        }
        _gpuDevice->commandBufferPools.clear();

        if (_gpuDevice->vkDevice != VK_NULL_HANDLE) {
            vkDestroyDevice(_gpuDevice->vkDevice, nullptr);
            _gpuDevice->vkDevice = VK_NULL_HANDLE;
        }

        CC_DELETE(_gpuDevice);
        _gpuDevice = nullptr;
    }

    CC_SAFE_DESTROY(_context);
}

// no-op since we maintain surface size internally
void CCVKDevice::resize(uint width, uint height) {}

void CCVKDevice::acquire() {
    CCVKQueue *queue = (CCVKQueue *)_queue;

    if (!checkSwapchainStatus()) return;

    queue->_numDrawCalls                   = 0;
    queue->_numInstances                   = 0;
    queue->_numTriangles                   = 0;
    queue->gpuQueue()->nextWaitSemaphore   = VK_NULL_HANDLE;
    queue->gpuQueue()->nextSignalSemaphore = VK_NULL_HANDLE;

    _gpuBufferHub->flush();
    _gpuDescriptorSetHub->flush();

    _gpuSemaphorePool->reset();
    VkSemaphore acquireSemaphore = _gpuSemaphorePool->alloc();
    VK_CHECK(vkAcquireNextImageKHR(_gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain, ~0ull,
                                   acquireSemaphore, VK_NULL_HANDLE, &_gpuSwapchain->curImageIndex));

#if defined(VK_USE_PLATFORM_METAL_EXT)
    assert(_gpuDevice->curBackBufferIndex == _gpuSwapchain->curImageIndex); // MoltenVK seems to be not consistent
#endif                                                                      // defined(VK_USE_PLATFORM_METAL_EXT)

    queue->gpuQueue()->nextWaitSemaphore   = acquireSemaphore;
    queue->gpuQueue()->nextSignalSemaphore = _gpuSemaphorePool->alloc();
}

void CCVKDevice::present() {
    CCVKQueue *queue = (CCVKQueue *)_queue;
    _numDrawCalls    = queue->_numDrawCalls;
    _numInstances    = queue->_numInstances;
    _numTriangles    = queue->_numTriangles;

    if (queue->gpuQueue()->nextWaitSemaphore) { // don't present if not acquired
        VkPresentInfoKHR presentInfo{VK_STRUCTURE_TYPE_PRESENT_INFO_KHR};
        presentInfo.waitSemaphoreCount = 1;
        presentInfo.pWaitSemaphores    = &queue->gpuQueue()->nextWaitSemaphore;
        presentInfo.swapchainCount     = 1;
        presentInfo.pSwapchains        = &_gpuSwapchain->vkSwapchain;
        presentInfo.pImageIndices      = &_gpuSwapchain->curImageIndex;

        VkResult res = vkQueuePresentKHR(queue->gpuQueue()->vkQueue, &presentInfo);
#ifndef DISABLE_PRE_TRANSFORM
        if (res) _swapchainReady = false;
#endif

        _gpuDevice->curBackBufferIndex = (_gpuDevice->curBackBufferIndex + 1) % _gpuDevice->backBufferCount;

        uint fenceCount = gpuFencePool()->size();
        if (fenceCount) {
            VK_CHECK(vkWaitForFences(_gpuDevice->vkDevice, fenceCount,
                                     gpuFencePool()->data(), VK_TRUE, DEFAULT_TIMEOUT));
        }

        gpuFencePool()->reset();
        gpuRecycleBin()->clear();
        gpuStagingBufferPool()->reset();
    }
}

CCVKGPUFencePool *        CCVKDevice::gpuFencePool() { return _gpuFencePools[_gpuDevice->curBackBufferIndex]; }
CCVKGPURecycleBin *       CCVKDevice::gpuRecycleBin() { return _gpuRecycleBins[_gpuDevice->curBackBufferIndex]; }
CCVKGPUStagingBufferPool *CCVKDevice::gpuStagingBufferPool() { return _gpuStagingBufferPools[_gpuDevice->curBackBufferIndex]; }

CommandBuffer *CCVKDevice::doCreateCommandBuffer(const CommandBufferInfo &info, bool hasAgent) {
    return CC_NEW(CCVKCommandBuffer(this));
}

Queue *CCVKDevice::createQueue() {
    return CC_NEW(CCVKQueue(this));
}

Buffer *CCVKDevice::createBuffer() {
    return CC_NEW(CCVKBuffer(this));
}

Texture *CCVKDevice::createTexture() {
    return CC_NEW(CCVKTexture(this));
}

Sampler *CCVKDevice::createSampler() {
    return CC_NEW(CCVKSampler(this));
}

Shader *CCVKDevice::createShader() {
    return CC_NEW(CCVKShader(this));
}

InputAssembler *CCVKDevice::createInputAssembler() {
    return CC_NEW(CCVKInputAssembler(this));
}

RenderPass *CCVKDevice::createRenderPass() {
    return CC_NEW(CCVKRenderPass(this));
}

Framebuffer *CCVKDevice::createFramebuffer() {
    return CC_NEW(CCVKFramebuffer(this));
}

DescriptorSet *CCVKDevice::createDescriptorSet() {
    return CC_NEW(CCVKDescriptorSet(this));
}

DescriptorSetLayout *CCVKDevice::createDescriptorSetLayout() {
    return CC_NEW(CCVKDescriptorSetLayout(this));
}

PipelineLayout *CCVKDevice::createPipelineLayout() {
    return CC_NEW(CCVKPipelineLayout(this));
}

PipelineState *CCVKDevice::createPipelineState() {
    return CC_NEW(CCVKPipelineState(this));
}

GlobalBarrier *CCVKDevice::createGlobalBarrier() {
    return CC_NEW(CCVKGlobalBarrier(this));
}

TextureBarrier *CCVKDevice::createTextureBarrier() {
    return CC_NEW(CCVKTextureBarrier(this));
}

void CCVKDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    gpuTransportHub()->checkIn([this, buffers, dst, regions, count](CCVKGPUCommandBuffer *gpuCommandBuffer) {
        CCVKCmdFuncCopyBuffersToTexture(this, buffers, ((CCVKTexture *)dst)->gpuTexture(), regions, count, gpuCommandBuffer);
    });
}

bool CCVKDevice::checkSwapchainStatus() {
    CCVKGPUContext *context = ((CCVKContext *)_context)->gpuContext();

    VkSurfaceCapabilitiesKHR surfaceCapabilities;
    VK_CHECK(vkGetPhysicalDeviceSurfaceCapabilitiesKHR(context->physicalDevice, context->vkSurface, &surfaceCapabilities));

    uint newWidth  = surfaceCapabilities.currentExtent.width;
    uint newHeight = surfaceCapabilities.currentExtent.height;

    VkSurfaceTransformFlagBitsKHR preTransform = surfaceCapabilities.currentTransform;
#ifdef DISABLE_PRE_TRANSFORM
    preTransform = VK_SURFACE_TRANSFORM_IDENTITY_BIT_KHR;
#endif

    if (preTransform & TRANSFORMS_THAT_REQUIRE_FLIPPING) {
        newHeight = surfaceCapabilities.currentExtent.width;
        newWidth  = surfaceCapabilities.currentExtent.height;
    }

    if (context->swapchainCreateInfo.preTransform == preTransform &&
        context->swapchainCreateInfo.imageExtent.width == newWidth &&
        context->swapchainCreateInfo.imageExtent.height == newHeight && _swapchainReady) {
        return true;
    }

    if (newWidth == (uint)-1) {
        context->swapchainCreateInfo.imageExtent.width  = _width;
        context->swapchainCreateInfo.imageExtent.height = _height;
    } else {
        _nativeWidth = _width = context->swapchainCreateInfo.imageExtent.width = newWidth;
        _nativeHeight = _height = context->swapchainCreateInfo.imageExtent.height = newHeight;
    }

    if (newWidth == 0 || newHeight == 0) {
        return _swapchainReady = false;
    }

    _transform                                = MapSurfaceTransform(preTransform);
    context->swapchainCreateInfo.preTransform = preTransform;
    context->swapchainCreateInfo.surface      = context->vkSurface;
    context->swapchainCreateInfo.oldSwapchain = _gpuSwapchain->vkSwapchain;

    CC_LOG_INFO("Resizing surface: %dx%d, surface rotation: %d degrees", newWidth, newHeight, (uint)_transform * 90);

    VkSwapchainKHR vkSwapchain = VK_NULL_HANDLE;
    VK_CHECK(vkCreateSwapchainKHR(_gpuDevice->vkDevice, &context->swapchainCreateInfo, nullptr, &vkSwapchain));

    VK_CHECK(vkDeviceWaitIdle(_gpuDevice->vkDevice));

    destroySwapchain();

    _gpuDevice->curBackBufferIndex = 0u;
    _gpuSwapchain->curImageIndex   = 0;
    _gpuSwapchain->vkSwapchain     = vkSwapchain;

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
        imageViewCreateInfo.image                       = _gpuSwapchain->swapchainImages[i];
        imageViewCreateInfo.viewType                    = VK_IMAGE_VIEW_TYPE_2D;
        imageViewCreateInfo.format                      = context->swapchainCreateInfo.imageFormat;
        imageViewCreateInfo.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        imageViewCreateInfo.subresourceRange.levelCount = 1;
        imageViewCreateInfo.subresourceRange.layerCount = 1;

        VK_CHECK(vkCreateImageView(_gpuDevice->vkDevice, &imageViewCreateInfo, nullptr, &_gpuSwapchain->vkSwapchainImageViews[i]));
    }

    bool                         hasStencil = GFX_FORMAT_INFOS[(uint)_context->getDepthStencilFormat()].hasStencil;
    vector<VkImageMemoryBarrier> barriers(imageCount * 2, VkImageMemoryBarrier{});
    VkPipelineStageFlags         srcStageMask = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
    VkPipelineStageFlags         dstStageMask = VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT;
    ThsvsImageBarrier            tempBarrier{};
    tempBarrier.srcQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    tempBarrier.dstQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    tempBarrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
    tempBarrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
    VkPipelineStageFlags tempSrcStageMask   = 0;
    VkPipelineStageFlags tempDstStageMask   = 0;
    for (uint i = 0u; i < imageCount; i++) {
        tempBarrier.nextAccessCount             = 1;
        tempBarrier.pNextAccesses               = &THSVS_ACCESS_TYPES[(uint)AccessType::COLOR_ATTACHMENT_WRITE];
        tempBarrier.image                       = _gpuSwapchain->swapchainImages[i];
        tempBarrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        thsvsGetVulkanImageMemoryBarrier(tempBarrier, &tempSrcStageMask, &tempDstStageMask, &barriers[i]);
        srcStageMask |= tempSrcStageMask;
        dstStageMask |= tempDstStageMask;

        tempBarrier.nextAccessCount             = 1;
        tempBarrier.pNextAccesses               = &THSVS_ACCESS_TYPES[(uint)AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE];
        tempBarrier.image                       = _gpuSwapchain->depthStencilImages[i];
        tempBarrier.subresourceRange.aspectMask = hasStencil ? VK_IMAGE_ASPECT_DEPTH_BIT | VK_IMAGE_ASPECT_STENCIL_BIT : VK_IMAGE_ASPECT_DEPTH_BIT;
        thsvsGetVulkanImageMemoryBarrier(tempBarrier, &tempSrcStageMask, &tempDstStageMask, &barriers[imageCount + i]);
        srcStageMask |= tempSrcStageMask;
        dstStageMask |= tempDstStageMask;
    }
    gpuTransportHub()->checkIn(
        [&](const CCVKGPUCommandBuffer *gpuCommandBuffer) {
            vkCmdPipelineBarrier(gpuCommandBuffer->vkCommandBuffer, srcStageMask, dstStageMask, 0, 0, nullptr, 0, nullptr, imageCount, barriers.data());
        },
        true); // submit immediately

    _gpuSwapchain->swapchainImageAccessTypes.assign(imageCount, {THSVS_ACCESS_PRESENT});
    _gpuSwapchain->depthStencilImageAccessTypes.assign(imageCount, {THSVS_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ});

    for (FramebufferListMapIter it = _gpuSwapchain->vkSwapchainFramebufferListMap.begin();
         it != _gpuSwapchain->vkSwapchainFramebufferListMap.end(); it++) {
        CCVKCmdFuncCreateFramebuffer(this, it->first);
    }

    return _swapchainReady = true;
}

void CCVKDevice::destroySwapchain() {
    if (_gpuSwapchain->vkSwapchain != VK_NULL_HANDLE) {
        _gpuSwapchain->swapchainImageAccessTypes.clear();
        _gpuSwapchain->depthStencilImageAccessTypes.clear();

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

        vkDestroySwapchainKHR(_gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain, nullptr);
        _gpuSwapchain->vkSwapchain = VK_NULL_HANDLE;
    }
}

} // namespace gfx
} // namespace cc
