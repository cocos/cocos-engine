/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <cstdarg>
#include <cstddef>
#include "Macros.h"
#include "base/std/container/string.h"
#include "base/std/container/vector.h"

namespace cc {

class CC_DLL StringUtil {
public:
    static int vprintf(char *buf, const char *last, const char *fmt, va_list args);
    static int printf(char *buf, const char *last, const char *fmt, ...);
    static ccstd::string format(const char *fmt, ...);
    static ccstd::vector<ccstd::string> split(const ccstd::string &str, const ccstd::string &delims, uint32_t maxSplits = 0);
    static ccstd::string &replace(ccstd::string &str, const ccstd::string &findStr, const ccstd::string &replaceStr);
    static ccstd::string &replaceAll(ccstd::string &str, const ccstd::string &findStr, const ccstd::string &replaceStr);
    static ccstd::string &tolower(ccstd::string &str);
    static ccstd::string &toupper(ccstd::string &str);
};

/**
 * Store compressed text which compressed with gzip & base64
 * fetch plain-text with `value()`.
 */
class CC_DLL GzipedString {
public:
    explicit GzipedString(ccstd::string &&dat) : _str(dat) {}
    explicit GzipedString(const char *dat) : _str(dat) {}
    GzipedString(const GzipedString &o) = default;
    GzipedString &operator=(const GzipedString &d) = default;

    GzipedString(GzipedString &&o) noexcept {
        _str = std::move(o._str);
    }
    GzipedString &operator=(ccstd::string &&d) {
        _str = std::move(d);
        return *this;
    }
    GzipedString &operator=(GzipedString &&d) noexcept {
        _str = std::move(d._str);
        return *this;
    }
    /**
    * return text decompress with base64decode | un-gzip
    */
    ccstd::string value() const;

private:
    ccstd::string _str{};
};

} // namespace cc
