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

#include "VKGPUObjects.h"

namespace cc {
namespace gfx {

namespace {

constexpr uint32_t FORCE_MINOR_VERSION           = 0; // 0 for default version, otherwise minorVersion = (FORCE_MINOR_VERSION - 1)
constexpr uint32_t DISABLE_VALIDATION_ASSERTIONS = 1; // 0 for default behavior, otherwise assertions will be disabled

#define FORCE_ENABLE_VALIDATION  0
#define FORCE_DISABLE_VALIDATION 0

#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION || FORCE_ENABLE_VALIDATION
VKAPI_ATTR VkBool32 VKAPI_CALL debugUtilsMessengerCallback(VkDebugUtilsMessageSeverityFlagBitsEXT messageSeverity,
                                                           VkDebugUtilsMessageTypeFlagsEXT /*messageType*/,
                                                           const VkDebugUtilsMessengerCallbackDataEXT *callbackData,
                                                           void * /*userData*/) {
    if (messageSeverity & VK_DEBUG_UTILS_MESSAGE_SEVERITY_ERROR_BIT_EXT) {
        CC_LOG_ERROR("%s: %s", callbackData->pMessageIdName, callbackData->pMessage);
        CCASSERT(DISABLE_VALIDATION_ASSERTIONS, "Validation Error");
        return VK_FALSE;
    }
    if (messageSeverity & VK_DEBUG_UTILS_MESSAGE_SEVERITY_WARNING_BIT_EXT) {
        CC_LOG_WARNING("%s: %s", callbackData->pMessageIdName, callbackData->pMessage);
        return VK_FALSE;
    }
    if (messageSeverity & VK_DEBUG_UTILS_MESSAGE_SEVERITY_INFO_BIT_EXT) {
        //CC_LOG_INFO("%s: %s", callbackData->pMessageIdName, callbackData->pMessage);
        return VK_FALSE;
    }
    if (messageSeverity & VK_DEBUG_UTILS_MESSAGE_SEVERITY_VERBOSE_BIT_EXT) {
        //CC_LOG_DEBUG("%s: %s", callbackData->pMessageIdName, callbackData->pMessage);
        return VK_FALSE;
    }
    CC_LOG_ERROR("%s: %s", callbackData->pMessageIdName, callbackData->pMessage);
    return VK_FALSE;
}

VKAPI_ATTR VkBool32 VKAPI_CALL debugReportCallback(VkDebugReportFlagsEXT flags,
                                                   VkDebugReportObjectTypeEXT /*type*/,
                                                   uint64_t /*object*/,
                                                   size_t /*location*/,
                                                   int32_t /*messageCode*/,
                                                   const char *layerPrefix,
                                                   const char *message,
                                                   void * /*userData*/) {
    if (flags & VK_DEBUG_REPORT_ERROR_BIT_EXT) {
        CC_LOG_ERROR("%s: %s", layerPrefix, message);
        CCASSERT(DISABLE_VALIDATION_ASSERTIONS, "Validation Error");
        return VK_FALSE;
    }
    if (flags & (VK_DEBUG_REPORT_WARNING_BIT_EXT | VK_DEBUG_REPORT_PERFORMANCE_WARNING_BIT_EXT)) {
        CC_LOG_WARNING("%s: %s", layerPrefix, message);
        return VK_FALSE;
    }
    if (flags & VK_DEBUG_REPORT_INFORMATION_BIT_EXT) {
        //CC_LOG_INFO("%s: %s", layerPrefix, message);
        return VK_FALSE;
    }
    if (flags & VK_DEBUG_REPORT_DEBUG_BIT_EXT) {
        //CC_LOG_DEBUG("%s: %s", layerPrefix, message);
        return VK_FALSE;
    }
    CC_LOG_ERROR("%s: %s", layerPrefix, message);
    return VK_FALSE;
}
#endif
} // namespace

bool CCVKGPUContext::initialize() {
    // only enable the absolute essentials
    vector<const char *> requestedLayers{
        "VK_LAYER_KHRONOS_synchronization2"};
    vector<const char *> requestedExtensions{
        VK_KHR_SURFACE_EXTENSION_NAME,
    };

    ///////////////////// Instance Creation /////////////////////

    if (volkInitialize()) {
        return false;
    }

    uint32_t apiVersion = VK_API_VERSION_1_0;
    if (vkEnumerateInstanceVersion) {
        vkEnumerateInstanceVersion(&apiVersion);
        if (FORCE_MINOR_VERSION) {
            apiVersion = VK_MAKE_VERSION(1, FORCE_MINOR_VERSION - 1, 0);
        }
    }

    minorVersion = VK_VERSION_MINOR(apiVersion);
    if (minorVersion < 1) {
        requestedExtensions.push_back(VK_KHR_GET_PHYSICAL_DEVICE_PROPERTIES_2_EXTENSION_NAME);
    }

    uint32_t availableLayerCount;
    VK_CHECK(vkEnumerateInstanceLayerProperties(&availableLayerCount, nullptr));
    vector<VkLayerProperties> supportedLayers(availableLayerCount);
    VK_CHECK(vkEnumerateInstanceLayerProperties(&availableLayerCount, supportedLayers.data()));

    uint32_t availableExtensionCount;
    VK_CHECK(vkEnumerateInstanceExtensionProperties(nullptr, &availableExtensionCount, nullptr));
    vector<VkExtensionProperties> supportedExtensions(availableExtensionCount);
    VK_CHECK(vkEnumerateInstanceExtensionProperties(nullptr, &availableExtensionCount, supportedExtensions.data()));

#if defined(VK_USE_PLATFORM_ANDROID_KHR)
    requestedExtensions.push_back(VK_KHR_ANDROID_SURFACE_EXTENSION_NAME);
#elif defined(VK_USE_PLATFORM_WIN32_KHR)
    requestedExtensions.push_back(VK_KHR_WIN32_SURFACE_EXTENSION_NAME);
#elif defined(VK_USE_PLATFORM_METAL_EXT)
    requestedExtensions.push_back(VK_EXT_METAL_SURFACE_EXTENSION_NAME);
#elif defined(VK_USE_PLATFORM_WAYLAND_KHR)
    requestedExtensions.push_back(VK_KHR_WAYLAND_SURFACE_EXTENSION_NAME);
#elif defined(VK_USE_PLATFORM_XCB_KHR)
    requestedExtensions.push_back(VK_KHR_XCB_SURFACE_EXTENSION_NAME);
#else
    #pragma error Platform not supported
#endif

#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION || FORCE_ENABLE_VALIDATION
    // Determine the optimal validation layers to enable that are necessary for useful debugging
    vector<vector<const char *>> validationLayerPriorityList{
        // The preferred validation layer is "VK_LAYER_KHRONOS_validation"
        {"VK_LAYER_KHRONOS_validation"},

        // Otherwise we fallback to using the LunarG meta layer
        {"VK_LAYER_LUNARG_standard_validation"},

        // Otherwise we attempt to enable the individual layers that compose the LunarG meta layer since it doesn't exist
        {
            "VK_LAYER_GOOGLE_threading",
            "VK_LAYER_LUNARG_parameter_validation",
            "VK_LAYER_LUNARG_object_tracker",
            "VK_LAYER_LUNARG_core_validation",
            "VK_LAYER_GOOGLE_unique_objects",
        },

        // Otherwise as a last resort we fallback to attempting to enable the LunarG core layer
        {"VK_LAYER_LUNARG_core_validation"},
    };
    for (vector<const char *> &validationLayers : validationLayerPriorityList) {
        bool found = true;
        for (const char *layer : validationLayers) {
            if (!isLayerSupported(layer, supportedLayers)) {
                found = false;
                break;
            }
        }
        if (found) {
            requestedLayers.insert(requestedLayers.end(), validationLayers.begin(), validationLayers.end());
            break;
        }
    }

    // Check if VK_EXT_debug_utils is supported, which supersedes VK_EXT_Debug_Report
    bool debugUtils = false;
    if (isExtensionSupported(VK_EXT_DEBUG_UTILS_EXTENSION_NAME, supportedExtensions)) {
        debugUtils = true;
        requestedExtensions.push_back(VK_EXT_DEBUG_UTILS_EXTENSION_NAME);
    } else {
        requestedExtensions.push_back(VK_EXT_DEBUG_REPORT_EXTENSION_NAME);
    }
#endif

    // just filter out the unsupported layers & extensions
    for (const char *layer : requestedLayers) {
        if (isLayerSupported(layer, supportedLayers)) {
            layers.push_back(layer);
        }
    }
    for (const char *extension : requestedExtensions) {
        if (isExtensionSupported(extension, supportedExtensions)) {
            extensions.push_back(extension);
        }
    }

    VkApplicationInfo app{VK_STRUCTURE_TYPE_APPLICATION_INFO};
    app.pEngineName = "Cocos Creator";
    app.apiVersion  = apiVersion;

    VkInstanceCreateInfo instanceInfo{VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO};
    instanceInfo.pApplicationInfo        = &app;
    instanceInfo.enabledExtensionCount   = utils::toUint(extensions.size());
    instanceInfo.ppEnabledExtensionNames = extensions.data();
    instanceInfo.enabledLayerCount       = utils::toUint(layers.size());
    instanceInfo.ppEnabledLayerNames     = layers.data();

#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION || FORCE_ENABLE_VALIDATION
    VkDebugUtilsMessengerCreateInfoEXT debugUtilsCreateInfo{VK_STRUCTURE_TYPE_DEBUG_UTILS_MESSENGER_CREATE_INFO_EXT};
    VkDebugReportCallbackCreateInfoEXT debugReportCreateInfo{VK_STRUCTURE_TYPE_DEBUG_REPORT_CREATE_INFO_EXT};
    if (debugUtils) {
        debugUtilsCreateInfo.messageSeverity = VK_DEBUG_UTILS_MESSAGE_SEVERITY_ERROR_BIT_EXT |
                                               VK_DEBUG_UTILS_MESSAGE_SEVERITY_WARNING_BIT_EXT |
                                               VK_DEBUG_UTILS_MESSAGE_SEVERITY_INFO_BIT_EXT |
                                               VK_DEBUG_UTILS_MESSAGE_SEVERITY_VERBOSE_BIT_EXT;
        debugUtilsCreateInfo.messageType     = VK_DEBUG_UTILS_MESSAGE_TYPE_GENERAL_BIT_EXT | VK_DEBUG_UTILS_MESSAGE_TYPE_VALIDATION_BIT_EXT | VK_DEBUG_UTILS_MESSAGE_TYPE_PERFORMANCE_BIT_EXT;
        debugUtilsCreateInfo.pfnUserCallback = debugUtilsMessengerCallback;

        instanceInfo.pNext = &debugUtilsCreateInfo;
    } else {
        debugReportCreateInfo.flags = VK_DEBUG_REPORT_ERROR_BIT_EXT |
                                      VK_DEBUG_REPORT_WARNING_BIT_EXT |
                                      VK_DEBUG_REPORT_PERFORMANCE_WARNING_BIT_EXT |
                                      VK_DEBUG_REPORT_INFORMATION_BIT_EXT |
                                      VK_DEBUG_REPORT_DEBUG_BIT_EXT;
        debugReportCreateInfo.pfnCallback = debugReportCallback;

        instanceInfo.pNext = &debugReportCreateInfo;
    }
#endif

    // Create the Vulkan instance
    VkResult res = vkCreateInstance(&instanceInfo, nullptr, &vkInstance);
    if (res == VK_ERROR_LAYER_NOT_PRESENT) {
        CC_LOG_ERROR("Create Vulkan instance failed due to missing layers, aborting...");
        return false;
    }

    volkLoadInstanceOnly(vkInstance);

#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION || FORCE_ENABLE_VALIDATION
    if (debugUtils) {
        VK_CHECK(vkCreateDebugUtilsMessengerEXT(vkInstance, &debugUtilsCreateInfo, nullptr, &vkDebugUtilsMessenger));
    } else {
        VK_CHECK(vkCreateDebugReportCallbackEXT(vkInstance, &debugReportCreateInfo, nullptr, &vkDebugReport));
    }
    validationEnabled = true;
#endif

    ///////////////////// Physical Device Selection /////////////////////

    // Querying valid physical devices on the machine
    uint32_t physicalDeviceCount{0};
    res = vkEnumeratePhysicalDevices(vkInstance, &physicalDeviceCount, nullptr);

    if (res || physicalDeviceCount < 1) {
        return false;
    }

    vector<VkPhysicalDevice> physicalDeviceHandles(physicalDeviceCount);
    VK_CHECK(vkEnumeratePhysicalDevices(vkInstance, &physicalDeviceCount, physicalDeviceHandles.data()));

    vector<VkPhysicalDeviceProperties> physicalDevicePropertiesList(physicalDeviceCount);

    uint32_t deviceIndex;
    for (deviceIndex = 0U; deviceIndex < physicalDeviceCount; ++deviceIndex) {
        VkPhysicalDeviceProperties &properties = physicalDevicePropertiesList[deviceIndex];
        vkGetPhysicalDeviceProperties(physicalDeviceHandles[deviceIndex], &properties);
    }

    for (deviceIndex = 0U; deviceIndex < physicalDeviceCount; ++deviceIndex) {
        VkPhysicalDeviceProperties &properties = physicalDevicePropertiesList[deviceIndex];
        if (properties.deviceType == VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU) {
            break;
        }
    }

    if (deviceIndex == physicalDeviceCount) {
        deviceIndex = 0;
    }

    physicalDevice           = physicalDeviceHandles[deviceIndex];
    physicalDeviceProperties = physicalDevicePropertiesList[deviceIndex];
    vkGetPhysicalDeviceFeatures(physicalDevice, &physicalDeviceFeatures);

    majorVersion = VK_VERSION_MAJOR(physicalDeviceProperties.apiVersion);
    minorVersion = VK_VERSION_MINOR(physicalDeviceProperties.apiVersion);

    if (minorVersion >= 1 || checkExtension(VK_KHR_GET_PHYSICAL_DEVICE_PROPERTIES_2_EXTENSION_NAME)) {
        physicalDeviceFeatures2.pNext        = &physicalDeviceVulkan11Features;
        physicalDeviceVulkan11Features.pNext = &physicalDeviceVulkan12Features;
        physicalDeviceProperties2.pNext      = &physicalDeviceDepthStencilResolveProperties;
        if (minorVersion >= 1) {
            vkGetPhysicalDeviceProperties2(physicalDevice, &physicalDeviceProperties2);
            vkGetPhysicalDeviceFeatures2(physicalDevice, &physicalDeviceFeatures2);
        } else {
            vkGetPhysicalDeviceProperties2KHR(physicalDevice, &physicalDeviceProperties2);
            vkGetPhysicalDeviceFeatures2KHR(physicalDevice, &physicalDeviceFeatures2);
        }
    }

    vkGetPhysicalDeviceMemoryProperties(physicalDevice, &physicalDeviceMemoryProperties);
    uint32_t queueFamilyPropertiesCount = 0;
    vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, &queueFamilyPropertiesCount, nullptr);
    queueFamilyProperties.resize(queueFamilyPropertiesCount);
    vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, &queueFamilyPropertiesCount, queueFamilyProperties.data());

    return true;
}

void CCVKGPUContext::destroy() {
#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION || FORCE_ENABLE_VALIDATION
    if (vkDebugUtilsMessenger != VK_NULL_HANDLE) {
        vkDestroyDebugUtilsMessengerEXT(vkInstance, vkDebugUtilsMessenger, nullptr);
        vkDebugUtilsMessenger = VK_NULL_HANDLE;
    }
    if (vkDebugReport != VK_NULL_HANDLE) {
        vkDestroyDebugReportCallbackEXT(vkInstance, vkDebugReport, nullptr);
        vkDebugReport = VK_NULL_HANDLE;
    }
#endif

    if (vkInstance != VK_NULL_HANDLE) {
        vkDestroyInstance(vkInstance, nullptr);
        vkInstance = VK_NULL_HANDLE;
    }
}

} // namespace gfx
} // namespace cc
