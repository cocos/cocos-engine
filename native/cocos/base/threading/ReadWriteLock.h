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

#pragma once

#include <shared_mutex>

namespace cc {

class ReadWriteLock final {
public:
    ReadWriteLock() = default;

    template <typename Function, typename... Args>
    auto lockRead(Function &&func, Args &&...args) noexcept -> decltype(func(std::forward<Args>(args)...));

    template <typename Function, typename... Args>
    auto lockWrite(Function &&func, Args &&...args) noexcept -> decltype(func(std::forward<Args>(args)...));

private:
    std::shared_mutex _mutex;
};

template <typename Function, typename... Args>
auto ReadWriteLock::lockRead(Function &&func, Args &&...args) noexcept -> decltype(func(std::forward<Args>(args)...)) {
    std::shared_lock<std::shared_mutex> lock(_mutex);
    return func(std::forward<Args>(args)...);
}

template <typename Function, typename... Args>
auto ReadWriteLock::lockWrite(Function &&func, Args &&...args) noexcept -> decltype(func(std::forward<Args>(args)...)) {
    std::lock_guard<std::shared_mutex> lock(_mutex);
    return func(std::forward<Args>(args)...);
}

} // namespace cc
