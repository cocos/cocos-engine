#include "GFXDeviceManager.h"


#ifdef CC_USE_NVN
    #include "gfx-nvn/NVNDevice.h"
#endif

#ifdef CC_USE_VULKAN
    #include "gfx-vulkan/VKDevice.h"
#endif

#ifdef CC_USE_METAL
    #include "gfx-metal/MTLDevice.h"
#endif

#ifdef CC_USE_GLES3
    #include "gfx-gles3/GLES3Device.h"
#endif

#ifdef CC_USE_GLES2
    #include "gfx-gles2/GLES2Device.h"
#endif

#ifdef CC_USE_GLES_NEW
    #include "gfx-gles-common/common/GLESDevice.h"
#endif

#include "gfx-empty/EmptyDevice.h"

namespace cc::gfx {
namespace {
#ifdef CC_USE_GLES_NEW
constexpr bool DETACH_DEVICE_THREAD{false};
constexpr bool FORCE_DISABLE_VALIDATION{true};
constexpr bool FORCE_ENABLE_VALIDATION{false};
#else
constexpr bool DETACH_DEVICE_THREAD{true};
constexpr bool FORCE_DISABLE_VALIDATION{false};
constexpr bool FORCE_ENABLE_VALIDATION{false};
#endif
} // namespace

bool DeviceManager::isDetachDeviceThread() {
    return DETACH_DEVICE_THREAD && Device::isSupportDetachDeviceThread;
}

bool DeviceManager::isValidationSupported() {
    return !FORCE_DISABLE_VALIDATION || FORCE_ENABLE_VALIDATION;
}

Device *DeviceManager::create(const DeviceInfo &info) {
    if (Device::instance) return Device::instance;

    Device *device = nullptr;

#ifdef CC_USE_NVN
    if (tryCreate<CCNVNDevice>(info, &device)) return device;
#endif

#ifdef CC_USE_VULKAN
    #if XR_OEM_PICO
    Device::isSupportDetachDeviceThread = false;
    #endif

    bool skipVulkan = false;
    #if CC_PLATFORM == CC_PLATFORM_ANDROID
    auto sdkVersion = BasePlatform::getPlatform()->getSdkVersion();
    skipVulkan = sdkVersion <= 27; // Android 8
    #endif
//    if (!skipVulkan && tryCreate<CCVKDevice>(info, &device)) return device;
#endif

#ifdef CC_USE_METAL
    if (tryCreate<CCMTLDevice>(info, &device)) return device;
#endif

#ifdef CC_USE_GLES_NEW
    if (tryCreate<GLESDevice>(info, &device)) return device;
#endif

#ifdef CC_USE_GLES3
    #if CC_USE_XR || CC_USE_AR_MODULE
    Device::isSupportDetachDeviceThread = false;
    #endif
    if (tryCreate<GLES3Device>(info, &device)) return device;
#endif

#ifdef CC_USE_GLES2
    // arcore & arengine currently only supports gles, session update requires gl context
    #if CC_USE_AR_MODULE
    Device::isSupportDetachDeviceThread = false;
    #endif
    if (tryCreate<GLES2Device>(info, &device)) return device;
#endif

#ifdef CC_EDITOR
    Device::isSupportDetachDeviceThread = false;
#endif
    if (tryCreate<EmptyDevice>(info, &device)) return device;

    return nullptr;
}
}  // namespace cc::gfx
