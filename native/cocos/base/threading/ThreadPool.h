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

#include <atomic>
#include <cstdint>
#include <functional>
#include <future>
#include <thread>
#include "Event.h"
#include "base/Macros.h"
#include "base/std/container/list.h"
#include "concurrentqueue/concurrentqueue.h"

namespace cc {

class ThreadPool final {
public:
    using Task = std::function<void()>;
    using TaskQueue = moodycamel::ConcurrentQueue<Task>;

    static uint8_t const CPU_CORE_COUNT;
    static uint8_t const MAX_THREAD_COUNT;

    ThreadPool() = default;
    ~ThreadPool() = default;
    ThreadPool(ThreadPool const &) = delete;
    ThreadPool(ThreadPool &&) noexcept = delete;
    ThreadPool &operator=(ThreadPool const &) = delete;
    ThreadPool &operator=(ThreadPool &&) noexcept = delete;

    template <typename Function, typename... Args>
    auto dispatchTask(Function &&func, Args &&...args) -> std::future<decltype(func(std::forward<Args>(args)...))>;
    void start();
    void stop();

private:
    using Event = ConditionVariable;

    void addThread();

    TaskQueue _tasks{};
    ccstd::list<std::thread> _workers{};
    Event _event{};
    std::atomic<bool> _running{false};
    uint8_t _workerCount{MAX_THREAD_COUNT};
};

template <typename Function, typename... Args>
auto ThreadPool::dispatchTask(Function &&func, Args &&...args) -> std::future<decltype(func(std::forward<Args>(args)...))> {
    CC_ASSERT(_running);

    using ReturnType = decltype(func(std::forward<Args>(args)...));
    auto task = std::make_shared<std::packaged_task<ReturnType()>>(std::bind(std::forward<Function>(func), std::forward<Args>(args)...));
    bool const succeed = _tasks.enqueue([task]() {
        (*task)();
    });
    CC_ASSERT(succeed);
    _event.signal();
    return task->get_future();
}

} // namespace cc
