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

#pragma once

#include <cstdarg>
#include <cstddef>
#include "Macros.h"
#include "TypeDef.h"
#include "memory/Memory.h"

namespace cc {

class CC_DLL StringUtil {
public:
    static int         vprintf(char *buf, const char *last, const char *fmt, va_list args);
    static int         printf(char *buf, const char *last, const char *fmt, ...);
    static String      format(const char *fmt, ...);
    static StringArray split(const String &str, const String &delims, uint maxSplits = 0);
    static String &    replace(String &str, const String &findStr, const String &replaceStr);
    static String &    replaceAll(String &str, const String &findStr, const String &replaceStr);
    static String &    tolower(String &str);
    static String &    toupper(String &str);
};

/**
 * Store compressed text which compressed with gzip & base64
 * fetch plain-text with `value()`.
 */
class CC_DLL GzipedString {
public:
    explicit GzipedString(std::string &&dat) : _str(dat) {}
    explicit GzipedString(const char *dat) : _str(dat) {}
    GzipedString(const GzipedString &o) = default;
    GzipedString &operator=(const GzipedString &d) = default;

    GzipedString(GzipedString &&o) noexcept {
        _str = std::move(o._str);
    }
    GzipedString &operator=(std::string &&d) {
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
    std::string value() const;

private:
    std::string _str{};
};

} // namespace cc
