/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "StringUtil.h"
#include "memory/Memory.h"
#include <string>
#include <cstdarg>

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #ifndef WIN32_LEAN_AND_MEAN
        #define WIN32_LEAN_AND_MEAN
    #endif
    #include <Windows.h>
#endif

namespace cc {

#if defined(_WIN32)
int StringUtil::vprintf(char *buf, const char *last, const char *fmt, va_list args) {
    if (last <= buf) return 0;

    int count = (int)(last - buf);
    int ret   = _vsnprintf_s(buf, count, _TRUNCATE, fmt, args);
    if (ret < 0) {
        if (errno == 0) {
            return count - 1;
        } else {
            return 0;
        }
    } else {
        return ret;
    }
}
#else
int StringUtil::vprintf(char *buf, const char *last, const char *fmt, va_list args) {
    if (last <= buf) {
        return 0;
    }

    int count = static_cast<int>(last - buf);
    int ret   = vsnprintf(buf, count, fmt, args);
    if (ret >= count - 1) {
        return count - 1;
    }
    if (ret < 0) {
        return 0;
    }
    return ret;
}
#endif

int StringUtil::printf(char *buf, const char *last, const char *fmt, ...) {
    va_list args;
    va_start(args, fmt);
    int ret = vprintf(buf, last, fmt, args);
    va_end(args);
    return ret;
}

String StringUtil::format(const char *fmt, ...) {
    char    sz[4096];
    va_list args;
    va_start(args, fmt);
    vprintf(sz, sz + sizeof(sz) - 1, fmt, args);
    va_end(args);
    return sz;
}

StringArray StringUtil::split(const String &str, const String &delims, uint maxSplits) {
    StringArray strs;
    if (str.empty()) {
        return strs;
    }

    // Pre-allocate some space for performance
    strs.reserve(maxSplits ? maxSplits + 1 : 16); // 16 is guessed capacity for most case

    uint numSplits = 0;

    // Use STL methods
    size_t start;
    size_t pos;
    start = 0;
    do {
        pos = str.find_first_of(delims, start);
        if (pos == start) {
            // Do nothing
            start = pos + 1;
        } else if (pos == String::npos || (maxSplits && numSplits == maxSplits)) {
            // Copy the rest of the string
            strs.push_back(str.substr(start));
            break;
        } else {
            // Copy up to delimiter
            strs.push_back(str.substr(start, pos - start));
            start = pos + 1;
        }
        // parse up to next real data
        start = str.find_first_not_of(delims, start);
        ++numSplits;
    } while (pos != String::npos);

    return strs;
}

} // namespace cc
