#ifndef __CC_GFXVULKAN_VK_STD_H__
#define __CC_GFXVULKAN_VK_STD_H__

#include <Core.h>

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
#    if defined(CC_STATIC)
#       define CC_VULKAN_API
#    else
#	    ifdef CC_VK_EXPORTS
#		    define CC_VULKAN_API __declspec(dllexport)
#	    else
#		    define CC_VULKAN_API __declspec(dllimport)
#	    endif
#	endif
#else
#	define CC_VULKAN_API
#endif

#define VK_CHECK(x)                                                 \
	do                                                              \
	{                                                               \
		VkResult err = x;                                           \
		if (err)                                                    \
		{                                                           \
			CC_LOG_ERROR("Detected Vulkan error: %d", err);         \
			abort();                                                \
		}                                                           \
	} while (0)

#define ASSERT_VK_HANDLE(handle)            \
	do                                      \
	{                                       \
		if ((handle) == VK_NULL_HANDLE)     \
		{                                   \
			CC_LOG_ERROR("Handle is NULL"); \
			abort();                        \
		}                                   \
	} while (0)

#endif
