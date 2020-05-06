#ifndef __CC_GFXVULKAN_VK_UTILS_H__
#define __CC_GFXVULKAN_VK_UTILS_H__

#include "volk.h"

namespace
{

    template <typename T, size_t Size>
    char(*countof_helper(T(&_Array)[Size]))[Size];

    #define COUNTOF(array) (sizeof(*countof_helper(array)) + 0)

    template <class T>
    uint32_t toU32(T value)
    {
        static_assert(std::is_arithmetic<T>::value, "T must be numeric");

        if (static_cast<uintmax_t>(value) > static_cast<uintmax_t>(std::numeric_limits<uint32_t>::max()))
        {
            throw std::runtime_error("to_u32() failed, value is too big to be converted to uint32_t");
        }

        return static_cast<uint32_t>(value);
    }

    bool isLayerSupported(const char * required, const std::vector<VkLayerProperties> &available)
    {
        for (auto &availableLayer : available)
        {
            if (strcmp(availableLayer.layerName, required) == 0)
            {
                return true;
            }
        }
        return false;
    }

    bool isExtensionSupported(const char * required, const std::vector<VkExtensionProperties> &available)
    {
        for (auto &availableExtension : available)
        {
            if (strcmp(availableExtension.extensionName, required) == 0)
            {
                return true;
            }
        }
        return false;
    }
}

#endif
