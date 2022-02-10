/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include <cstring>
#include <map>
#include <vector>
#include "StringHandle.h"
#include "base/Macros.h"
#include "threading/ReadWriteLock.h"

namespace cc {

struct StringCompare final {
    inline bool operator()(char const *lhs, char const *rhs) const noexcept {
        return strcmp(lhs, rhs) < 0;
    }
};

template <bool ThreadSafe>
class StringPool final {
public:
    StringPool() = default;
    ~StringPool();
    StringPool(const StringPool &) = delete;
    StringPool(StringPool &&)      = delete;
    StringPool &operator=(const StringPool &) = delete;
    StringPool &operator=(StringPool &&) = delete;

    StringHandle stringToHandle(const char *str) noexcept;
    char const * handleToString(const StringHandle &handle) const noexcept;
    StringHandle find(const char *str) const noexcept;

private:
    StringHandle doStringToHandle(const char *str) noexcept;
    char const * doHandleToString(const StringHandle &handle) const noexcept;
    StringHandle doFind(const char *str) const noexcept;

    std::map<char const *, StringHandle, StringCompare> _stringToHandles{};
    std::vector<char const *>                           _handleToStrings{};
    mutable ReadWriteLock                               _readWriteLock{};
};

using ThreadSafeStringPool = StringPool<true>;

template <bool ThreadSafe>
StringPool<ThreadSafe>::~StringPool() {
    for (char const *strCache : _handleToStrings) {
        delete[] strCache;
    }
}

template <bool ThreadSafe>
inline StringHandle StringPool<ThreadSafe>::stringToHandle(const char *str) noexcept {
    if (ThreadSafe) {
        return _readWriteLock.lockWrite([this, str]() {
            return doStringToHandle(str);
        });
    }
    return doStringToHandle(str);
}

template <bool ThreadSafe>
inline char const *StringPool<ThreadSafe>::handleToString(const StringHandle &handle) const noexcept {
    if (ThreadSafe) {
        return _readWriteLock.lockRead([this, handle]() {
            return doHandleToString(handle);
        });
    }
    return doHandleToString(handle);
}

template <bool ThreadSafe>
StringHandle StringPool<ThreadSafe>::find(const char *str) const noexcept {
    if (ThreadSafe) {
        return _readWriteLock.lockRead([this, str]() {
            return doFind(str);
        });
    }
    return doFind(str);
}

template <bool ThreadSafe>
inline StringHandle StringPool<ThreadSafe>::doStringToHandle(const char *str) noexcept {
    const auto it = _stringToHandles.find(str);

    if (it == _stringToHandles.end()) {
        size_t const strLength = strlen(str) + 1;
        char *const  strCache  = new char[strLength];
        strcpy(strCache, str);
        StringHandle name(static_cast<StringHandle::IndexType>(_handleToStrings.size()), strCache);
        _handleToStrings.emplace_back(strCache);
        _stringToHandles.emplace(strCache, name);
        return name;
    }
    return it->second;
}

template <bool ThreadSafe>
inline const char *StringPool<ThreadSafe>::doHandleToString(const StringHandle &handle) const noexcept {
    CC_ASSERT(handle < _handleToStrings.size());
    return _handleToStrings[handle];
}

template <bool ThreadSafe>
StringHandle StringPool<ThreadSafe>::doFind(char const *str) const noexcept {
    auto const it = _stringToHandles.find(str);
    return it == _stringToHandles.end() ? StringHandle{} : it->second;
}

} // namespace cc
