/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "base/Log.h"

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
    #define VK_CHECK(x)                                                \
        do {                                                           \
            VkResult err = x;                                          \
            if (err) {                                                 \
                CC_LOG_ERROR("%s returned Vulkan error: %d", #x, err); \
                CC_ABORT();                                            \
            }                                                          \
        } while (0)

#else
    #define VK_CHECK(x) x
#endif
