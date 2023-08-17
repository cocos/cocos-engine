/****************************************************************************
 Copyright (c) 2010 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Utils.h"

#if CC_PLATFORM == CC_PLATFORM_IOS || CC_PLATFORM == CC_PLATFORM_MACOS
    #include <sys/time.h>
#endif

#include <cmath>
#include <cstdlib>
#include <cstring>

#define BOOST_STACKTRACE_GNU_SOURCE_NOT_REQUIRED
#include "boost/stacktrace.hpp"

#include "base/base64.h"
#include "base/memory/MemoryHook.h"
#include "platform/FileUtils.h"

namespace cc {
namespace utils {

#define MAX_ITOA_BUFFER_SIZE 256
double atof(const char *str) {
    if (str == nullptr) {
        return 0.0;
    }

    char buf[MAX_ITOA_BUFFER_SIZE];
    strncpy(buf, str, MAX_ITOA_BUFFER_SIZE);

    // strip string, only remain 7 numbers after '.'
    char *dot = strchr(buf, '.');
    if (dot != nullptr && dot - buf + 8 < MAX_ITOA_BUFFER_SIZE) {
        dot[8] = '\0';
    }

    return ::atof(buf);
}

uint32_t nextPOT(uint32_t x) {
    x = x - 1;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    return x + 1;
}

// painfully slow to execute, use with caution
ccstd::string getStacktrace(uint32_t skip, uint32_t maxDepth) {
    return boost::stacktrace::to_string(boost::stacktrace::stacktrace(skip, maxDepth));
}

} // namespace utils

#if USE_MEMORY_LEAK_DETECTOR

    // Make sure GMemoryHook to be initialized first.
    #if (CC_COMPILER == CC_COMPILER_MSVC)
        #pragma warning(push)
        #pragma warning(disable : 4073)
        #pragma init_seg(lib)
MemoryHook GMemoryHook;
        #pragma warning(pop)
    #elif (CC_COMPILER == CC_COMPILER_GNUC || CC_COMPILER == CC_COMPILER_CLANG)
MemoryHook GMemoryHook __attribute__((init_priority(101)));
    #endif

#endif
} // namespace cc
