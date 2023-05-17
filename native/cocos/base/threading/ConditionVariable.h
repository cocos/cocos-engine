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

#include <condition_variable>
#include <functional>
#include <mutex>
#include <thread>

namespace cc {

class ConditionVariable final {
public:
    void wait() noexcept;
    template <typename Function, typename... Args>
    void wait(Function &&func, Args &&...args) noexcept;
    void signal() noexcept;
    void signalAll() noexcept;

private:
    std::mutex _mutex;
    std::condition_variable _condVar;
};

// DO NOT MANIPULATE ANY SYCHRONIZATION PRIMITIVES INSIDE THE CALLBACK
template <typename Function, typename... Args>
void ConditionVariable::wait(Function &&func, Args &&...args) noexcept {
    std::unique_lock<std::mutex> lock(_mutex);
    _condVar.wait(lock, std::bind(std::forward<Function>(func), std::forward<Args>(args)...));
}

} // namespace cc
