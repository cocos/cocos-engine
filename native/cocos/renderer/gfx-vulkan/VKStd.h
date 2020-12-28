#ifndef __CC_GFXVULKAN_VK_STD_H__
#define __CC_GFXVULKAN_VK_STD_H__

#include <Core.h>

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #if defined(CC_STATIC)
        #define CC_VULKAN_API
    #else
        #ifdef CC_VK_EXPORTS
            #define CC_VULKAN_API __declspec(dllexport)
        #else
            #define CC_VULKAN_API __declspec(dllimport)
        #endif
    #endif
#else
    #define CC_VULKAN_API
#endif

#if CC_DEBUG > 0
#define VK_CHECK(x)                                                      \
    do {                                                                 \
        VkResult err = x;                                                \
        if (err) {                                                       \
            CC_LOG_ERROR("%s returned Vulkan error: %d", #x, err);       \
            CCASSERT(0, "Vulkan Error");                                 \
        }                                                                \
    } while (0)

#else
#define VK_CHECK(x) x
#endif

#endif
