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
#include <sstream>
#include <string_view>
#include "base/std/container/string.h"

namespace cc {

namespace render {

template <class String>
class Indent {
public:
    explicit Indent(String& indent)
    : mIndent(&indent) {
        mIndent->append("    ");
    }
    ~Indent() {
        reset();
    }
    Indent(Indent&& rhs) noexcept
    : mIndent(rhs.mIndent) {
        rhs.mIndent = nullptr;
    }
    Indent& operator=(Indent&& rhs) noexcept {
        mIndent = rhs.mIndent;
        rhs.mIndent = nullptr;
        return *this;
    }
    void reset() {
        if (mIndent) {
            mIndent->erase(mIndent->size() - 4);
            mIndent = nullptr;
        }
    }
    String* mIndent = nullptr;
};

inline void indent(ccstd::string& str) {
    str.append("    ");
}

inline void indent(ccstd::pmr::string& str) {
    str.append("    ");
}

inline void unindent(ccstd::string& str) noexcept {
    auto sz = str.size() < static_cast<size_t>(4) ? str.size() : static_cast<size_t>(4);
    str.erase(str.size() - sz);
}

inline void unindent(ccstd::pmr::string& str) noexcept {
    auto sz = str.size() < static_cast<size_t>(4) ? str.size() : static_cast<size_t>(4);
    str.erase(str.size() - sz);
}

inline void copyString(
    std::ostream& os,
    std::string_view space, std::string_view str, // NOLINT(bugprone-easily-swappable-parameters)
    bool append = false) {
    std::istringstream iss{ccstd::string(str)};
    ccstd::string line;
    int count = 0;
    while (std::getline(iss, line)) {
        if (line.empty()) {
            os << '\n';
        } else if (line[0] == '#') {
            os << line << '\n';
        } else {
            if (append) {
                if (count == 0) {
                    os << line;
                } else {
                    os << '\n'
                       << space << line;
                }
            } else {
                os << space << line << '\n';
            }
        }
        ++count;
    }
}

inline void copyString(std::ostream& os, std::string_view str) {
    std::istringstream iss{ccstd::string(str)};
    ccstd::string line;
    while (std::getline(iss, line)) {
        if (line.empty()) {
            os << '\n';
        } else {
            os << line << '\n';
        }
    }
}

inline void copyCppString(
    std::ostream& os,
    std::string_view space, std::string_view str, // NOLINT(bugprone-easily-swappable-parameters)
    bool append = false) {
    std::istringstream iss{ccstd::string(str)};
    ccstd::string line;
    int count = 0;
    while (std::getline(iss, line)) {
        if (line.empty()) {
            os << '\n';
        } else if (line[0] == '#') {
            os << line << '\n';
        } else if (*line.rbegin() == ':') {
#if defined(_MSC_VER) && _MSC_VER < 1920
            os << space << line << '\n';
#else
            os << space.substr(0, std::max(static_cast<size_t>(4), space.size()) - 4) << line << "\n";
#endif
        } else {
            if (append) {
                if (count == 0) {
                    os << line;
                } else {
                    os << '\n'
                       << space << line;
                }
            } else {
                os << space << line << '\n';
            }
        }
        ++count;
    }
}

} // namespace render

} // namespace cc

#define OSS oss << space

#define INDENT(...)   Indent<std::remove_reference_t<decltype(space)>> ind_##__VA_ARGS__(space)
#define UNINDENT(...) ind_##__VA_ARGS__.reset()

#define INDENT_BEG() space.append("    ")
#define INDENT_END() space.erase(std::max(space.size(), size_t(4)) - 4)
