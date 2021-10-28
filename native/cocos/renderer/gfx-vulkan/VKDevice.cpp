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
#include "VKDescriptorSet.h"
#include "VKDescriptorSetLayout.h"
#include "VKDevice.h"
#include "VKFramebuffer.h"
#include "VKInputAssembler.h"
#include "VKPipelineLayout.h"
#include "VKPipelineState.h"
#include "VKQueryPool.h"
#include "VKQueue.h"
#include "VKRenderPass.h"
#include "VKShader.h"
#include "VKSwapchain.h"
#include "VKTexture.h"
#include "VKUtils.h"
#include "gfx-base/SPIRVUtils.h"
#include "gfx-vulkan/VKGPUObjects.h"
#include "states/VKGlobalBarrier.h"
#include "states/VKSampler.h"
#include "states/VKTextureBarrier.h"

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

static VkResult VKAPI_PTR vkCreateRenderPass2KHRFallback(
    VkDevice                       device,
    const VkRenderPassCreateInfo2 *pCreateInfo,
    const VkAllocationCallbacks *  pAllocator,
    VkRenderPass *                 pRenderPass);

CCVKDevice *CCVKDevice::instance = nullptr;

CCVKDevice *CCVKDevice::getInstance() {
    return CCVKDevice::instance;
}

CCVKDevice::CCVKDevice() {
    _api        = API::VULKAN;
    _deviceName = "Vulkan";

    _caps.supportQuery     = true;
    _caps.clipSpaceMinZ    = 0.0F;
    _caps.screenSpaceSignY = -1.0F;
    _caps.clipSpaceSignY   = -1.0F;
    CCVKDevice::instance   = this;
}

CCVKDevice::~CCVKDevice() {
    CCVKDevice::instance = nullptr;
}

bool CCVKDevice::doInit(const DeviceInfo & /*info*/) {
    _gpuContext = CC_NEW(CCVKGPUContext);
    if (!_gpuContext->initialize()) {
        CC_SAFE_DESTROY(_gpuContext)
        return false;
    }

    const VkPhysicalDeviceFeatures2 &deviceFeatures2 = _gpuContext->physicalDeviceFeatures2;
    const VkPhysicalDeviceFeatures & deviceFeatures  = deviceFeatures2.features;
    //const VkPhysicalDeviceVulkan11Features &deviceVulkan11Features = _gpuContext->physicalDeviceVulkan11Features;
    //const VkPhysicalDeviceVulkan12Features &deviceVulkan12Features = _gpuContext->physicalDeviceVulkan12Features;

    ///////////////////// Device Creation /////////////////////

    _gpuDevice               = CC_NEW(CCVKGPUDevice);
    _gpuDevice->minorVersion = _gpuContext->minorVersion;

    // only enable the absolute essentials
    vector<const char *> requestedLayers{};
    vector<const char *> requestedExtensions{
        VK_KHR_SWAPCHAIN_EXTENSION_NAME,
    };
    if (_gpuDevice->minorVersion < 2) {
        requestedExtensions.push_back(VK_KHR_CREATE_RENDERPASS_2_EXTENSION_NAME);
    }
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

    if (_gpuContext->validationEnabled) {
        requestedLayers.push_back("VK_LAYER_KHRONOS_validation");
    }

    // check extensions
    uint32_t availableLayerCount;
    VK_CHECK(vkEnumerateDeviceLayerProperties(_gpuContext->physicalDevice, &availableLayerCount, nullptr));
    _gpuDevice->layers.resize(availableLayerCount);
    VK_CHECK(vkEnumerateDeviceLayerProperties(_gpuContext->physicalDevice, &availableLayerCount, _gpuDevice->layers.data()));

    uint32_t availableExtensionCount;
    VK_CHECK(vkEnumerateDeviceExtensionProperties(_gpuContext->physicalDevice, nullptr, &availableExtensionCount, nullptr));
    _gpuDevice->extensions.resize(availableExtensionCount);
    VK_CHECK(vkEnumerateDeviceExtensionProperties(_gpuContext->physicalDevice, nullptr, &availableExtensionCount, _gpuDevice->extensions.data()));

    // just filter out the unsupported layers & extensions
    for (const char *layer : requestedLayers) {
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
    uint32_t                        queueFamilyPropertiesCount = utils::toUint(_gpuContext->queueFamilyProperties.size());
    vector<VkDeviceQueueCreateInfo> queueCreateInfos(queueFamilyPropertiesCount, {VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO});
    vector<vector<float>>           queuePriorities(queueFamilyPropertiesCount);

    for (uint32_t queueFamilyIndex = 0U; queueFamilyIndex < queueFamilyPropertiesCount; ++queueFamilyIndex) {
        const VkQueueFamilyProperties &queueFamilyProperty = _gpuContext->queueFamilyProperties[queueFamilyIndex];

        queuePriorities[queueFamilyIndex].resize(queueFamilyProperty.queueCount, 1.0F);

        VkDeviceQueueCreateInfo &queueCreateInfo = queueCreateInfos[queueFamilyIndex];

        queueCreateInfo.queueFamilyIndex = queueFamilyIndex;
        queueCreateInfo.queueCount       = queueFamilyProperty.queueCount;
        queueCreateInfo.pQueuePriorities = queuePriorities[queueFamilyIndex].data();
    }

    VkDeviceCreateInfo deviceCreateInfo{VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO};

    deviceCreateInfo.queueCreateInfoCount    = utils::toUint(queueCreateInfos.size());
    deviceCreateInfo.pQueueCreateInfos       = queueCreateInfos.data();
    deviceCreateInfo.enabledLayerCount       = utils::toUint(_layers.size());
    deviceCreateInfo.ppEnabledLayerNames     = _layers.data();
    deviceCreateInfo.enabledExtensionCount   = utils::toUint(_extensions.size());
    deviceCreateInfo.ppEnabledExtensionNames = _extensions.data();
    if (_gpuDevice->minorVersion < 1 && !_gpuContext->checkExtension(VK_KHR_GET_PHYSICAL_DEVICE_PROPERTIES_2_EXTENSION_NAME)) {
        deviceCreateInfo.pEnabledFeatures = &requestedFeatures2.features;
    } else {
        deviceCreateInfo.pNext = &requestedFeatures2;
        if (_gpuDevice->minorVersion >= 2) {
            requestedFeatures2.pNext        = &requestedVulkan11Features;
            requestedVulkan11Features.pNext = &requestedVulkan12Features;
        }
    }

    VK_CHECK(vkCreateDevice(_gpuContext->physicalDevice, &deviceCreateInfo, nullptr, &_gpuDevice->vkDevice));

    volkLoadDevice(_gpuDevice->vkDevice);

    SPIRVUtils::getInstance()->initialize(static_cast<int>(_gpuDevice->minorVersion));

    ///////////////////// Gather Device Properties /////////////////////

    auto findPreferredDepthFormat = [this](const VkFormat *formats, uint32_t count, VkFormat *pFormat) {
        for (uint32_t i = 0; i < count; ++i) {
            VkFormat           format = formats[i];
            VkFormatProperties formatProperties;
            vkGetPhysicalDeviceFormatProperties(_gpuContext->physicalDevice, format, &formatProperties);
            // Format must support depth stencil attachment for optimal tiling
            if (formatProperties.optimalTilingFeatures & VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT) {
                if (formatProperties.optimalTilingFeatures & VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT) {
                    *pFormat = format;
                    break;
                }
            }
        }
    };

    VkFormat depthFormatPriorityList[]{
        VK_FORMAT_D32_SFLOAT,
        VK_FORMAT_X8_D24_UNORM_PACK32,
        VK_FORMAT_D16_UNORM,
    };
    findPreferredDepthFormat(depthFormatPriorityList, 3, &_gpuDevice->depthFormat);

    VkFormat depthStencilFormatPriorityList[]{
        VK_FORMAT_D32_SFLOAT_S8_UINT,
        VK_FORMAT_D24_UNORM_S8_UINT,
        VK_FORMAT_D16_UNORM_S8_UINT,
    };
    findPreferredDepthFormat(depthStencilFormatPriorityList, 3, &_gpuDevice->depthStencilFormat);

    _features[toNumber(Feature::COLOR_FLOAT)]               = true;
    _features[toNumber(Feature::COLOR_HALF_FLOAT)]          = true;
    _features[toNumber(Feature::TEXTURE_FLOAT)]             = true;
    _features[toNumber(Feature::TEXTURE_HALF_FLOAT)]        = true;
    _features[toNumber(Feature::TEXTURE_FLOAT_LINEAR)]      = true;
    _features[toNumber(Feature::TEXTURE_HALF_FLOAT_LINEAR)] = true;
    _features[toNumber(Feature::FORMAT_R11G11B10F)]         = true;
    _features[toNumber(Feature::FORMAT_SRGB)]               = true;
    _features[toNumber(Feature::ELEMENT_INDEX_UINT)]        = true;
    _features[toNumber(Feature::INSTANCED_ARRAYS)]          = true;
    _features[toNumber(Feature::MULTIPLE_RENDER_TARGETS)]   = true;
    _features[toNumber(Feature::BLEND_MINMAX)]              = true;
    _features[toNumber(Feature::COMPUTE_SHADER)]            = true;
    _features[toNumber(Feature::INPUT_ATTACHMENT_BENEFIT)]  = true;

    _gpuDevice->useMultiDrawIndirect        = deviceFeatures.multiDrawIndirect;
    _gpuDevice->useDescriptorUpdateTemplate = _gpuDevice->minorVersion > 0 || checkExtension(VK_KHR_DESCRIPTOR_UPDATE_TEMPLATE_EXTENSION_NAME);

    if (_gpuDevice->minorVersion > 1) {
        _gpuDevice->createRenderPass2 = vkCreateRenderPass2;
    } else if (checkExtension(VK_KHR_CREATE_RENDERPASS_2_EXTENSION_NAME)) {
        _gpuDevice->createRenderPass2 = vkCreateRenderPass2KHR;
    } else {
        _gpuDevice->createRenderPass2 = vkCreateRenderPass2KHRFallback;
    }

    VkFormatFeatureFlags requiredFeatures = VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT | VK_FORMAT_FEATURE_COLOR_ATTACHMENT_BIT;
    VkFormatProperties   formatProperties;
    vkGetPhysicalDeviceFormatProperties(_gpuContext->physicalDevice, VK_FORMAT_R8G8B8_UNORM, &formatProperties);
    if (formatProperties.optimalTilingFeatures & requiredFeatures) {
        _features[toNumber(Feature::FORMAT_RGB8)] = true;
    }

    String compressedFmts;
    if (deviceFeatures.textureCompressionETC2) {
        _features[toNumber(Feature::FORMAT_ETC2)] = true;
        compressedFmts += "etc2 ";
    }
    if (deviceFeatures.textureCompressionASTC_LDR) {
        _features[toNumber(Feature::FORMAT_ASTC)] = true;
        compressedFmts += "astc ";
    }

    const VkPhysicalDeviceLimits &limits = _gpuContext->physicalDeviceProperties.limits;
    _caps.maxVertexAttributes            = limits.maxVertexInputAttributes;
    _caps.maxVertexUniformVectors        = limits.maxUniformBufferRange / 16;
    _caps.maxFragmentUniformVectors      = limits.maxUniformBufferRange / 16;
    _caps.maxUniformBufferBindings       = limits.maxDescriptorSetUniformBuffers;
    _caps.maxUniformBlockSize            = limits.maxUniformBufferRange;
    _caps.maxShaderStorageBlockSize      = limits.maxStorageBufferRange;
    _caps.maxShaderStorageBufferBindings = limits.maxDescriptorSetStorageBuffers;
    _caps.maxTextureUnits                = limits.maxDescriptorSetSampledImages;
    _caps.maxVertexTextureUnits          = limits.maxPerStageDescriptorSampledImages;
    _caps.maxTextureSize                 = limits.maxImageDimension2D;
    _caps.maxCubeMapTextureSize          = limits.maxImageDimensionCube;
    _caps.uboOffsetAlignment             = static_cast<uint32_t>(limits.minUniformBufferOffsetAlignment);
    // compute shaders
    _caps.maxComputeSharedMemorySize     = limits.maxComputeSharedMemorySize;
    _caps.maxComputeWorkGroupInvocations = limits.maxComputeWorkGroupInvocations;
    _caps.maxComputeWorkGroupCount       = {limits.maxComputeWorkGroupCount[0], limits.maxComputeWorkGroupCount[1], limits.maxComputeWorkGroupCount[2]};
    _caps.maxComputeWorkGroupSize        = {limits.maxComputeWorkGroupSize[0], limits.maxComputeWorkGroupSize[1], limits.maxComputeWorkGroupSize[2]};
#if defined(VK_USE_PLATFORM_ANDROID_KHR)
    // UNASSIGNED-BestPractices-vkCreateComputePipelines-compute-work-group-size
    _caps.maxComputeWorkGroupInvocations = 64;
#endif // defined(VK_USE_PLATFORM_ANDROID_KHR)

    ///////////////////// Resource Initialization /////////////////////

    QueueInfo queueInfo;
    queueInfo.type = QueueType::GRAPHICS;
    _queue         = createQueue(queueInfo);

    QueryPoolInfo queryPoolInfo{QueryType::OCCLUSION, DEFAULT_MAX_QUERY_OBJECTS};
    _queryPool = createQueryPool(queryPoolInfo);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type  = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff          = createCommandBuffer(cmdBuffInfo);

    VmaAllocatorCreateInfo allocatorInfo{};
    allocatorInfo.physicalDevice = _gpuContext->physicalDevice;
    allocatorInfo.device         = _gpuDevice->vkDevice;
    allocatorInfo.instance       = _gpuContext->vkInstance;

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
    vmaVulkanFunc.vkCmdCopyBuffer                     = vkCmdCopyBuffer;

    if (_gpuDevice->minorVersion > 0) {
        allocatorInfo.flags |= VMA_ALLOCATOR_CREATE_KHR_DEDICATED_ALLOCATION_BIT;
        vmaVulkanFunc.vkGetBufferMemoryRequirements2KHR = vkGetBufferMemoryRequirements2;
        vmaVulkanFunc.vkGetImageMemoryRequirements2KHR  = vkGetImageMemoryRequirements2;
        vmaVulkanFunc.vkBindBufferMemory2KHR            = vkBindBufferMemory2;
        vmaVulkanFunc.vkBindImageMemory2KHR             = vkBindImageMemory2;
    } else {
        if (checkExtension(VK_KHR_DEDICATED_ALLOCATION_EXTENSION_NAME) &&
            checkExtension(VK_KHR_GET_MEMORY_REQUIREMENTS_2_EXTENSION_NAME)) {
            allocatorInfo.flags |= VMA_ALLOCATOR_CREATE_KHR_DEDICATED_ALLOCATION_BIT;
            vmaVulkanFunc.vkGetBufferMemoryRequirements2KHR = vkGetBufferMemoryRequirements2KHR;
            vmaVulkanFunc.vkGetImageMemoryRequirements2KHR  = vkGetImageMemoryRequirements2KHR;
        }
        if (checkExtension(VK_KHR_BIND_MEMORY_2_EXTENSION_NAME)) {
            vmaVulkanFunc.vkBindBufferMemory2KHR = vkBindBufferMemory2KHR;
            vmaVulkanFunc.vkBindImageMemory2KHR  = vkBindImageMemory2KHR;
        }
    }
    if (checkExtension(VK_EXT_MEMORY_BUDGET_EXTENSION_NAME)) {
        if (_gpuDevice->minorVersion > 0) {
            vmaVulkanFunc.vkGetPhysicalDeviceMemoryProperties2KHR = vkGetPhysicalDeviceMemoryProperties2;
        } else if (checkExtension(VK_KHR_GET_PHYSICAL_DEVICE_PROPERTIES_2_EXTENSION_NAME)) {
            vmaVulkanFunc.vkGetPhysicalDeviceMemoryProperties2KHR = vkGetPhysicalDeviceMemoryProperties2KHR;
        }
    }

    allocatorInfo.pVulkanFunctions = &vmaVulkanFunc;

    VK_CHECK(vmaCreateAllocator(&allocatorInfo, &_gpuDevice->memoryAllocator));

    uint32_t backBufferCount = _gpuDevice->backBufferCount;
    for (uint32_t i = 0U; i < backBufferCount; i++) {
        _gpuFencePools.push_back(CC_NEW(CCVKGPUFencePool(_gpuDevice)));
        _gpuRecycleBins.push_back(CC_NEW(CCVKGPURecycleBin(_gpuDevice)));
        _gpuStagingBufferPools.push_back(CC_NEW(CCVKGPUStagingBufferPool(_gpuDevice)));
    }

    _gpuBufferHub        = CC_NEW(CCVKGPUBufferHub(_gpuDevice));
    _gpuTransportHub     = CC_NEW(CCVKGPUTransportHub(_gpuDevice, static_cast<CCVKQueue *>(_queue)->gpuQueue()));
    _gpuDescriptorHub    = CC_NEW(CCVKGPUDescriptorHub(_gpuDevice));
    _gpuSemaphorePool    = CC_NEW(CCVKGPUSemaphorePool(_gpuDevice));
    _gpuBarrierManager   = CC_NEW(CCVKGPUBarrierManager(_gpuDevice));
    _gpuFramebufferHub   = CC_NEW(CCVKGPUFramebufferHub);
    _gpuDescriptorSetHub = CC_NEW(CCVKGPUDescriptorSetHub(_gpuDevice));

    _gpuDescriptorHub->link(_gpuDescriptorSetHub);

    cmdFuncCCVKCreateSampler(this, &_gpuDevice->defaultSampler);

    _gpuDevice->defaultTexture.format = Format::RGBA8;
    _gpuDevice->defaultTexture.usage  = TextureUsageBit::SAMPLED | TextureUsage::STORAGE;
    _gpuDevice->defaultTexture.width = _gpuDevice->defaultTexture.height = 1U;
    _gpuDevice->defaultTexture.size                                      = formatSize(Format::RGBA8, 1U, 1U, 1U);
    cmdFuncCCVKCreateTexture(this, &_gpuDevice->defaultTexture);

    _gpuDevice->defaultTextureView.gpuTexture = &_gpuDevice->defaultTexture;
    _gpuDevice->defaultTextureView.format     = Format::RGBA8;
    cmdFuncCCVKCreateTextureView(this, &_gpuDevice->defaultTextureView);

    ThsvsImageBarrier barrier{};
    barrier.nextAccessCount             = 1;
    barrier.pNextAccesses               = &THSVS_ACCESS_TYPES[toNumber(AccessType::VERTEX_SHADER_READ_TEXTURE)];
    barrier.image                       = _gpuDevice->defaultTexture.vkImage;
    barrier.srcQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    barrier.dstQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    barrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
    barrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
    barrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
    gpuTransportHub()->checkIn(
        [&barrier](const CCVKGPUCommandBuffer *gpuCommandBuffer) {
            cmdFuncCCVKImageMemoryBarrier(gpuCommandBuffer, barrier);
        },
        true);

    _gpuDevice->defaultBuffer.usage    = BufferUsage::UNIFORM | BufferUsage::STORAGE;
    _gpuDevice->defaultBuffer.memUsage = MemoryUsage::HOST | MemoryUsage::DEVICE;
    _gpuDevice->defaultBuffer.size = _gpuDevice->defaultBuffer.stride = 16U;
    _gpuDevice->defaultBuffer.count                                   = 1U;
    cmdFuncCCVKCreateBuffer(this, &_gpuDevice->defaultBuffer);

    VkPipelineCacheCreateInfo pipelineCacheInfo{VK_STRUCTURE_TYPE_PIPELINE_CACHE_CREATE_INFO};
    VK_CHECK(vkCreatePipelineCache(_gpuDevice->vkDevice, &pipelineCacheInfo, nullptr, &_gpuDevice->vkPipelineCache));

    ///////////////////// Print Debug Info /////////////////////

    String instanceLayers;
    String instanceExtensions;
    String deviceLayers;
    String deviceExtensions;
    for (const char *layer : _gpuContext->layers) {
        instanceLayers += layer + String(" ");
    }
    for (const char *extension : _gpuContext->extensions) {
        instanceExtensions += extension + String(" ");
    }
    for (const char *layer : _layers) {
        deviceLayers += layer + String(" ");
    }
    for (const char *extension : _extensions) {
        deviceExtensions += extension + String(" ");
    }

    uint32_t apiVersion = _gpuContext->physicalDeviceProperties.apiVersion;
    _renderer           = _gpuContext->physicalDeviceProperties.deviceName;
    _vendor             = mapVendorName(_gpuContext->physicalDeviceProperties.vendorID);
    _version            = StringUtil::format("%d.%d.%d", VK_VERSION_MAJOR(apiVersion),
                                  VK_VERSION_MINOR(apiVersion), VK_VERSION_PATCH(apiVersion));

    CC_LOG_INFO("Vulkan device initialized.");
    CC_LOG_INFO("RENDERER: %s", _renderer.c_str());
    CC_LOG_INFO("VENDOR: %s", _vendor.c_str());
    CC_LOG_INFO("VERSION: %s", _version.c_str());
    CC_LOG_INFO("INSTANCE_LAYERS: %s", instanceLayers.c_str());
    CC_LOG_INFO("INSTANCE_EXTENSIONS: %s", instanceExtensions.c_str());
    CC_LOG_INFO("DEVICE_LAYERS: %s", deviceLayers.c_str());
    CC_LOG_INFO("DEVICE_EXTENSIONS: %s", deviceExtensions.c_str());
    CC_LOG_INFO("COMPRESSED_FORMATS: %s", compressedFmts.c_str());

    return true;
}

void CCVKDevice::doDestroy() {
    waitAllFences();

    SPIRVUtils::getInstance()->destroy();

    for (CCVKTexture *texture : _depthStencilTextures) {
        CC_SAFE_DESTROY(texture)
    }
    _depthStencilTextures.clear();

    CC_SAFE_DESTROY(_queryPool)
    CC_SAFE_DESTROY(_queue)
    CC_SAFE_DESTROY(_cmdBuff)

    CC_SAFE_DELETE(_gpuBufferHub)
    CC_SAFE_DELETE(_gpuTransportHub)
    CC_SAFE_DELETE(_gpuSemaphorePool)
    CC_SAFE_DELETE(_gpuDescriptorHub)
    CC_SAFE_DELETE(_gpuBarrierManager)
    CC_SAFE_DELETE(_gpuFramebufferHub)
    CC_SAFE_DELETE(_gpuDescriptorSetHub)

    uint32_t backBufferCount = _gpuDevice->backBufferCount;
    for (uint32_t i = 0U; i < backBufferCount; i++) {
        _gpuRecycleBins[i]->clear();

        CC_SAFE_DELETE(_gpuStagingBufferPools[i])
        CC_SAFE_DELETE(_gpuRecycleBins[i])
        CC_SAFE_DELETE(_gpuFencePools[i])
    }
    _gpuStagingBufferPools.clear();
    _gpuRecycleBins.clear();
    _gpuFencePools.clear();

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
        cmdFuncCCVKDestroySampler(_gpuDevice, &_gpuDevice->defaultSampler);

        if (_gpuDevice->memoryAllocator != VK_NULL_HANDLE) {
            VmaStats stats;
            vmaCalculateStats(_gpuDevice->memoryAllocator, &stats);
            CC_LOG_INFO("Total device memory leaked: %d bytes.", stats.total.usedBytes);
            CCASSERT(!_memoryStatus.bufferSize, "Buffer memory leaked");
            CCASSERT(!_memoryStatus.textureSize, "Texture memory leaked");

            vmaDestroyAllocator(_gpuDevice->memoryAllocator);
            _gpuDevice->memoryAllocator = VK_NULL_HANDLE;
        }

        for (auto it = _gpuDevice->_commandBufferPools.begin(); it != _gpuDevice->_commandBufferPools.end(); ++it) {
            CC_SAFE_DELETE(it->second)
        }
        _gpuDevice->_commandBufferPools.clear();
        _gpuDevice->_descriptorSetPools.clear();

        if (_gpuDevice->vkDevice != VK_NULL_HANDLE) {
            vkDestroyDevice(_gpuDevice->vkDevice, nullptr);
            _gpuDevice->vkDevice = VK_NULL_HANDLE;
        }

        CC_DELETE(_gpuDevice);
        _gpuDevice = nullptr;
    }

    CC_SAFE_DESTROY(_gpuContext)
}

namespace {
vector<VkSwapchainKHR>       vkSwapchains;
vector<uint32_t>             vkSwapchainIndices;
vector<CCVKGPUSwapchain *>   gpuSwapchains;
vector<VkImageMemoryBarrier> vkAcquireBarriers;
vector<VkImageMemoryBarrier> vkPresentBarriers;

VkImageMemoryBarrier acquireBarrier{
    VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER,
    nullptr,
    0,
    VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT,
    VK_IMAGE_LAYOUT_PRESENT_SRC_KHR,
    VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL,
    VK_QUEUE_FAMILY_IGNORED,
    VK_QUEUE_FAMILY_IGNORED,
    0,
    {VK_IMAGE_ASPECT_COLOR_BIT, 0, 1, 0, 1},
};
VkImageMemoryBarrier presentBarrier{
    VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER,
    nullptr,
    VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT,
    0,
    VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL,
    VK_IMAGE_LAYOUT_PRESENT_SRC_KHR,
    VK_QUEUE_FAMILY_IGNORED,
    VK_QUEUE_FAMILY_IGNORED,
    0,
    {VK_IMAGE_ASPECT_COLOR_BIT, 0, 1, 0, 1},
};
} // namespace

void CCVKDevice::acquire(Swapchain *const *swapchains, uint32_t count) {
    auto *queue = static_cast<CCVKQueue *>(_queue);
    queue->gpuQueue()->lastSignaledSemaphores.clear();
    vkSwapchainIndices.clear();
    gpuSwapchains.clear();
    vkSwapchains.clear();
    vkAcquireBarriers.resize(count, acquireBarrier);
    vkPresentBarriers.resize(count, presentBarrier);

    for (uint32_t i = 0U; i < count; ++i) {
        auto *swapchain = static_cast<CCVKSwapchain *>(swapchains[i]);
        if (swapchain->gpuSwapchain()->lastPresentResult == VK_NOT_READY) {
            if (!swapchain->checkSwapchainStatus()) continue;
        }
        vkSwapchains.push_back(swapchain->gpuSwapchain()->vkSwapchain);
        gpuSwapchains.push_back(swapchain->gpuSwapchain());
        vkSwapchainIndices.push_back(swapchain->gpuSwapchain()->curImageIndex);
    }

    _gpuDescriptorSetHub->flush();
    _gpuSemaphorePool->reset();

    for (uint32_t i = 0; i < vkSwapchains.size(); ++i) {
        VkSemaphore acquireSemaphore = _gpuSemaphorePool->alloc();
        VK_CHECK(vkAcquireNextImageKHR(_gpuDevice->vkDevice, vkSwapchains[i], ~0ULL,
                                       acquireSemaphore, VK_NULL_HANDLE, &vkSwapchainIndices[i]));
        gpuSwapchains[i]->curImageIndex = vkSwapchainIndices[i];
        queue->gpuQueue()->lastSignaledSemaphores.push_back(acquireSemaphore);

        // swapchain indices may be different
        //CCASSERT(_gpuDevice->curBackBufferIndex == vkSwapchainIndices[i], "wrong image index?");

        vkAcquireBarriers[i].image = gpuSwapchains[i]->swapchainImages[vkSwapchainIndices[i]];
        vkPresentBarriers[i].image = gpuSwapchains[i]->swapchainImages[vkSwapchainIndices[i]];
    }

    _gpuTransportHub->checkIn(
        [&](const CCVKGPUCommandBuffer *gpuCommandBuffer) {
            vkCmdPipelineBarrier(gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT, VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
                                 0, 0, nullptr, 0, nullptr, utils::toUint(vkSwapchains.size()), vkAcquireBarriers.data());
        },
        false, false);

    _gpuTransportHub->checkIn(
        [&](const CCVKGPUCommandBuffer *gpuCommandBuffer) {
            vkCmdPipelineBarrier(gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT, VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT,
                                 0, 0, nullptr, 0, nullptr, utils::toUint(vkSwapchains.size()), vkPresentBarriers.data());
        },
        false, true);
}

void CCVKDevice::present() {
    auto *queue          = static_cast<CCVKQueue *>(_queue);
    _numDrawCalls        = queue->_numDrawCalls;
    _numInstances        = queue->_numInstances;
    _numTriangles        = queue->_numTriangles;
    queue->_numDrawCalls = 0;
    queue->_numInstances = 0;
    queue->_numTriangles = 0;

    if (!_gpuTransportHub->empty(false)) _gpuTransportHub->packageForFlight(false);
    if (!_gpuTransportHub->empty(true)) _gpuTransportHub->packageForFlight(true);

    if (!vkSwapchains.empty()) { // don't present if not acquired
        VkPresentInfoKHR presentInfo{VK_STRUCTURE_TYPE_PRESENT_INFO_KHR};
        presentInfo.waitSemaphoreCount = utils::toUint(queue->gpuQueue()->lastSignaledSemaphores.size());
        presentInfo.pWaitSemaphores    = queue->gpuQueue()->lastSignaledSemaphores.data();
        presentInfo.swapchainCount     = utils::toUint(vkSwapchains.size());
        presentInfo.pSwapchains        = vkSwapchains.data();
        presentInfo.pImageIndices      = vkSwapchainIndices.data();

        VkResult res = vkQueuePresentKHR(queue->gpuQueue()->vkQueue, &presentInfo);
        for (auto *gpuSwapchain : gpuSwapchains) {
            gpuSwapchain->lastPresentResult = res;
        }
    }

    _gpuDevice->curBackBufferIndex = (_gpuDevice->curBackBufferIndex + 1) % _gpuDevice->backBufferCount;

    uint32_t fenceCount = gpuFencePool()->size();
    if (fenceCount) {
        VK_CHECK(vkWaitForFences(_gpuDevice->vkDevice, fenceCount,
                                 gpuFencePool()->data(), VK_TRUE, DEFAULT_TIMEOUT));
    }

    gpuFencePool()->reset();
    gpuRecycleBin()->clear();
    gpuStagingBufferPool()->reset();
}

CCVKGPUFencePool *        CCVKDevice::gpuFencePool() { return _gpuFencePools[_gpuDevice->curBackBufferIndex]; }
CCVKGPURecycleBin *       CCVKDevice::gpuRecycleBin() { return _gpuRecycleBins[_gpuDevice->curBackBufferIndex]; }
CCVKGPUStagingBufferPool *CCVKDevice::gpuStagingBufferPool() { return _gpuStagingBufferPools[_gpuDevice->curBackBufferIndex]; }

void CCVKDevice::waitAllFences() {
    static vector<VkFence> fences;
    fences.clear();

    for (auto *fencePool : _gpuFencePools) {
        fences.insert(fences.end(), fencePool->data(), fencePool->data() + fencePool->size());
    }

    if (!fences.empty()) {
        VK_CHECK(vkWaitForFences(_gpuDevice->vkDevice, utils::toUint(fences.size()), fences.data(), VK_TRUE, DEFAULT_TIMEOUT));

        for (auto *fencePool : _gpuFencePools) {
            fencePool->reset();
        }
    }
}

CommandBuffer *CCVKDevice::createCommandBuffer(const CommandBufferInfo & /*info*/, bool /*hasAgent*/) {
    return CC_NEW(CCVKCommandBuffer);
}

Queue *CCVKDevice::createQueue() {
    return CC_NEW(CCVKQueue);
}

QueryPool *CCVKDevice::createQueryPool() {
    return CC_NEW(CCVKQueryPool);
}

Swapchain *CCVKDevice::createSwapchain() {
    return CC_NEW(CCVKSwapchain);
}

Buffer *CCVKDevice::createBuffer() {
    return CC_NEW(CCVKBuffer);
}

Texture *CCVKDevice::createTexture() {
    return CC_NEW(CCVKTexture);
}

Shader *CCVKDevice::createShader() {
    return CC_NEW(CCVKShader);
}

InputAssembler *CCVKDevice::createInputAssembler() {
    return CC_NEW(CCVKInputAssembler);
}

RenderPass *CCVKDevice::createRenderPass() {
    return CC_NEW(CCVKRenderPass);
}

Framebuffer *CCVKDevice::createFramebuffer() {
    return CC_NEW(CCVKFramebuffer);
}

DescriptorSet *CCVKDevice::createDescriptorSet() {
    return CC_NEW(CCVKDescriptorSet);
}

DescriptorSetLayout *CCVKDevice::createDescriptorSetLayout() {
    return CC_NEW(CCVKDescriptorSetLayout);
}

PipelineLayout *CCVKDevice::createPipelineLayout() {
    return CC_NEW(CCVKPipelineLayout);
}

PipelineState *CCVKDevice::createPipelineState() {
    return CC_NEW(CCVKPipelineState);
}

Sampler *CCVKDevice::createSampler(const SamplerInfo &info) {
    return CC_NEW(CCVKSampler(info));
}

GlobalBarrier *CCVKDevice::createGlobalBarrier(const GlobalBarrierInfo &info) {
    return CC_NEW(CCVKGlobalBarrier(info));
}

TextureBarrier *CCVKDevice::createTextureBarrier(const TextureBarrierInfo &info) {
    return CC_NEW(CCVKTextureBarrier(info));
}

void CCVKDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint32_t count) {
    gpuTransportHub()->checkIn([this, buffers, dst, regions, count](CCVKGPUCommandBuffer *gpuCommandBuffer) {
        cmdFuncCCVKCopyBuffersToTexture(this, buffers, static_cast<CCVKTexture *>(dst)->gpuTexture(), regions, count, gpuCommandBuffer);
    });
}

void CCVKDevice::copyTextureToBuffers(Texture *srcTexture, uint8_t *const *buffers, const BufferTextureCopy *regions, uint32_t count) {
    uint32_t                              totalSize = 0U;
    Format                                format    = srcTexture->getFormat();
    vector<std::pair<uint32_t, uint32_t>> regionOffsetSizes(count);
    for (size_t i = 0U; i < count; ++i) {
        const BufferTextureCopy &region     = regions[i];
        uint32_t                 w          = region.buffStride > 0 ? region.buffStride : region.texExtent.width;
        uint32_t                 h          = region.buffTexHeight > 0 ? region.buffTexHeight : region.texExtent.height;
        uint32_t                 regionSize = formatSize(format, w, h, region.texExtent.depth);
        regionOffsetSizes[i]                = {totalSize, regionSize};
        totalSize += regionSize;
    }

    CCVKGPUBuffer stagingBuffer;
    stagingBuffer.size = totalSize;
    uint32_t texelSize = GFX_FORMAT_INFOS[toNumber(format)].size;
    gpuStagingBufferPool()->alloc(&stagingBuffer, texelSize);

    // make sure the src texture is up-to-date
    waitAllFences();

    _gpuTransportHub->checkIn(
        [&](CCVKGPUCommandBuffer *cmdBuffer) {
            cmdFuncCCVKCopyTextureToBuffers(this, static_cast<CCVKTexture *>(srcTexture)->gpuTexture(), &stagingBuffer, regions, count, cmdBuffer);
        },
        true);

    for (uint32_t i = 0; i < count; ++i) {
        uint32_t regionOffset              = 0;
        uint32_t regionSize                = 0;
        std::tie(regionOffset, regionSize) = regionOffsetSizes[i];
        memcpy(buffers[i], stagingBuffer.mappedData + regionOffset, regionSize);
    }
}

void CCVKDevice::getQueryPoolResults(QueryPool *queryPool) {
    auto *vkQueryPool = static_cast<CCVKQueryPool *>(queryPool);
    auto  queryCount  = static_cast<uint32_t>(vkQueryPool->_ids.size());
    CCASSERT(queryCount <= vkQueryPool->getMaxQueryObjects(), "Too many query commands.");
    std::vector<uint64_t> results(queryCount, 0ULL);

    if (queryCount > 0U) {
        VK_CHECK(vkGetQueryPoolResults(
            gpuDevice()->vkDevice,
            vkQueryPool->_gpuQueryPool->vkPool,
            0,
            queryCount,
            queryCount * sizeof(uint64_t),
            results.data(),
            sizeof(uint64_t),
            VK_QUERY_RESULT_64_BIT | VK_QUERY_RESULT_WAIT_BIT));
    }

    std::unordered_map<uint32_t, uint64_t> mapResults;
    for (auto queryId = 0U; queryId < queryCount; queryId++) {
        uint32_t id   = vkQueryPool->_ids[queryId];
        auto     iter = mapResults.find(id);
        if (iter != mapResults.end()) {
            iter->second += results[queryId];
        } else {
            mapResults[id] = results[queryId];
        }
    }

    {
        std::lock_guard<std::mutex> lock(vkQueryPool->_mutex);
        vkQueryPool->_results = std::move(mapResults);
    }
}

//////////////////////////// Function Fallbacks /////////////////////////////////////////

static VkResult VKAPI_PTR vkCreateRenderPass2KHRFallback(
    VkDevice                       device,
    const VkRenderPassCreateInfo2 *pCreateInfo,
    const VkAllocationCallbacks *  pAllocator,
    VkRenderPass *                 pRenderPass) {
    static vector<VkAttachmentDescription> attachmentDescriptions;
    static vector<VkSubpassDescription>    subpassDescriptions;
    static vector<VkAttachmentReference>   attachmentReferences;
    static vector<VkSubpassDependency>     subpassDependencies;
    static vector<size_t>                  inputs;
    static vector<size_t>                  colors;
    static vector<size_t>                  resolves;
    static vector<size_t>                  depths;

    attachmentDescriptions.resize(pCreateInfo->attachmentCount);
    for (uint32_t i = 0; i < pCreateInfo->attachmentCount; ++i) {
        VkAttachmentDescription &       desc{attachmentDescriptions[i]};
        const VkAttachmentDescription2 &desc2{pCreateInfo->pAttachments[i]};
        desc.flags          = desc2.flags;
        desc.format         = desc2.format;
        desc.samples        = desc2.samples;
        desc.loadOp         = desc2.loadOp;
        desc.storeOp        = desc2.storeOp;
        desc.stencilLoadOp  = desc2.stencilLoadOp;
        desc.stencilStoreOp = desc2.stencilStoreOp;
        desc.initialLayout  = desc2.initialLayout;
        desc.finalLayout    = desc2.finalLayout;
    }

    subpassDescriptions.resize(pCreateInfo->subpassCount);
    attachmentReferences.clear();
    inputs.assign(pCreateInfo->subpassCount, std::numeric_limits<size_t>::max());
    colors.assign(pCreateInfo->subpassCount, std::numeric_limits<size_t>::max());
    resolves.assign(pCreateInfo->subpassCount, std::numeric_limits<size_t>::max());
    depths.assign(pCreateInfo->subpassCount, std::numeric_limits<size_t>::max());
    for (uint32_t i = 0; i < pCreateInfo->subpassCount; ++i) {
        const VkSubpassDescription2 &desc2{pCreateInfo->pSubpasses[i]};
        if (desc2.inputAttachmentCount) {
            inputs[i] = attachmentReferences.size();
            for (uint32_t j = 0; j < desc2.inputAttachmentCount; ++j) {
                attachmentReferences.push_back({desc2.pInputAttachments[j].attachment, desc2.pInputAttachments[j].layout});
            }
        }
        if (desc2.colorAttachmentCount) {
            colors[i] = attachmentReferences.size();
            for (uint32_t j = 0; j < desc2.colorAttachmentCount; ++j) {
                attachmentReferences.push_back({desc2.pColorAttachments[j].attachment, desc2.pColorAttachments[j].layout});
            }
            if (desc2.pResolveAttachments) {
                resolves[i] = attachmentReferences.size();
                for (uint32_t j = 0; j < desc2.colorAttachmentCount; ++j) {
                    attachmentReferences.push_back({desc2.pResolveAttachments[j].attachment, desc2.pResolveAttachments[j].layout});
                }
            }
        }
        if (desc2.pDepthStencilAttachment) {
            depths[i] = attachmentReferences.size();
            attachmentReferences.push_back({desc2.pDepthStencilAttachment->attachment, desc2.pDepthStencilAttachment->layout});
        }
    }
    for (uint32_t i = 0; i < pCreateInfo->subpassCount; ++i) {
        VkSubpassDescription &       desc{subpassDescriptions[i]};
        const VkSubpassDescription2 &desc2{pCreateInfo->pSubpasses[i]};
        desc.flags                   = desc2.flags;
        desc.pipelineBindPoint       = desc2.pipelineBindPoint;
        desc.inputAttachmentCount    = desc2.inputAttachmentCount;
        desc.pInputAttachments       = inputs[i] > attachmentReferences.size() ? nullptr : &attachmentReferences[inputs[i]];
        desc.colorAttachmentCount    = desc2.colorAttachmentCount;
        desc.pColorAttachments       = colors[i] > attachmentReferences.size() ? nullptr : &attachmentReferences[colors[i]];
        desc.pResolveAttachments     = resolves[i] > attachmentReferences.size() ? nullptr : &attachmentReferences[resolves[i]];
        desc.pDepthStencilAttachment = depths[i] > attachmentReferences.size() ? nullptr : &attachmentReferences[depths[i]];
        desc.preserveAttachmentCount = desc2.preserveAttachmentCount;
        desc.pPreserveAttachments    = desc2.pPreserveAttachments;
    }

    subpassDependencies.resize(pCreateInfo->dependencyCount);
    for (uint32_t i = 0; i < pCreateInfo->dependencyCount; ++i) {
        VkSubpassDependency &       desc{subpassDependencies[i]};
        const VkSubpassDependency2 &desc2{pCreateInfo->pDependencies[i]};
        desc.srcSubpass      = desc2.srcSubpass;
        desc.dstSubpass      = desc2.dstSubpass;
        desc.srcStageMask    = desc2.srcStageMask;
        desc.dstStageMask    = desc2.dstStageMask;
        desc.srcAccessMask   = desc2.srcAccessMask;
        desc.dstAccessMask   = desc2.dstAccessMask;
        desc.dependencyFlags = desc2.dependencyFlags;
    }

    VkRenderPassCreateInfo renderPassCreateInfo{VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO};
    renderPassCreateInfo.attachmentCount = utils::toUint(attachmentDescriptions.size());
    renderPassCreateInfo.pAttachments    = attachmentDescriptions.data();
    renderPassCreateInfo.subpassCount    = utils::toUint(subpassDescriptions.size());
    renderPassCreateInfo.pSubpasses      = subpassDescriptions.data();
    renderPassCreateInfo.dependencyCount = utils::toUint(subpassDependencies.size());
    renderPassCreateInfo.pDependencies   = subpassDependencies.data();

    return vkCreateRenderPass(device, &renderPassCreateInfo, pAllocator, pRenderPass);
}

} // namespace gfx
} // namespace cc
