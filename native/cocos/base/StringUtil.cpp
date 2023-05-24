/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "StringUtil.h"

#include <algorithm>
#include <cctype>
#include <cstdarg>
#ifndef CC_WGPU_WASM
    #include "base/ZipUtils.h"
#endif
#include "base/base64.h"
#include "base/std/container/string.h"
#include "memory/Memory.h"

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
    int ret = _vsnprintf_s(buf, count, _TRUNCATE, fmt, args);
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

    auto count = static_cast<int>(last - buf);
    int ret = vsnprintf(buf, count, fmt, args);
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

ccstd::string StringUtil::format(const char *fmt, ...) {
    char sz[4096];
    va_list args;
    va_start(args, fmt);
    vprintf(sz, sz + sizeof(sz) - 1, fmt, args);
    va_end(args);
    return sz;
}

ccstd::vector<ccstd::string> StringUtil::split(const ccstd::string &str, const ccstd::string &delims, uint32_t maxSplits) {
    ccstd::vector<ccstd::string> strs;
    if (str.empty()) {
        return strs;
    }

    // Pre-allocate some space for performance
    strs.reserve(maxSplits ? maxSplits + 1 : 16); // 16 is guessed capacity for most case

    uint32_t numSplits{0};

    // Use STL methods
    size_t start{0};
    size_t pos{0};
    do {
        pos = str.find_first_of(delims, start);
        if (pos == start) {
            // Do nothing
            start = pos + 1;
        } else if (pos == ccstd::string::npos || (maxSplits && numSplits == maxSplits)) {
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
    } while (pos != ccstd::string::npos);

    return strs;
}

ccstd::string &StringUtil::replace(ccstd::string &str, const ccstd::string &findStr, const ccstd::string &replaceStr) {
    size_t startPos = str.find(findStr);
    if (startPos == ccstd::string::npos) {
        return str;
    }
    str.replace(startPos, findStr.length(), replaceStr);
    return str;
}

ccstd::string &StringUtil::replaceAll(ccstd::string &str, const ccstd::string &findStr, const ccstd::string &replaceStr) {
    if (findStr.empty()) {
        return str;
    }
    size_t startPos = 0;
    while ((startPos = str.find(findStr, startPos)) != ccstd::string::npos) {
        str.replace(startPos, findStr.length(), replaceStr);
        startPos += replaceStr.length();
    }
    return str;
}

ccstd::string &StringUtil::tolower(ccstd::string &str) {
    std::transform(str.begin(), str.end(), str.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return str;
}

ccstd::string &StringUtil::toupper(ccstd::string &str) {
    std::transform(str.begin(), str.end(), str.begin(),
                   [](unsigned char c) { return std::toupper(c); });
    return str;
}

ccstd::string GzipedString::value() const { // NOLINT(readability-convert-member-functions-to-static)
#ifndef CC_WGPU_WASM
    uint8_t *outGzip{nullptr};
    uint8_t *outBase64{nullptr};
    auto *input = reinterpret_cast<unsigned char *>(const_cast<char *>(_str.c_str()));
    auto lenOfBase64 = base64Decode(input, static_cast<unsigned int>(_str.size()), &outBase64);
    auto lenofUnzip = ZipUtils::inflateMemory(outBase64, static_cast<uint32_t>(lenOfBase64), &outGzip);
    ccstd::string ret(outGzip, outGzip + lenofUnzip);
    free(outGzip);
    free(outBase64);
    return ret;
#else
    return "";
#endif
}

} // namespace cc
