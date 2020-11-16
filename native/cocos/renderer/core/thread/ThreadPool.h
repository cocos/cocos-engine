#pragma once

#include <thread>
#include <future>
#include <atomic>
#include <functional>
#include <list>
#include <queue>
#include <cassert>
#include <cstdint>
#include "boost/lockfree/stack.hpp"
#include "Event.h"

namespace cc {
namespace gfx {

class ThreadPool final
{
public:

    using Task                      = std::function<void()>;

    static uint8_t const            kCpuCoreCount;
    static uint8_t const            kMaxThreadCount;

                                    ThreadPool() noexcept = default;
                                    ~ThreadPool() = default;
                                    ThreadPool(ThreadPool const&) = delete;
                                    ThreadPool(ThreadPool&&) = delete;
                                    ThreadPool& operator=(ThreadPool const&) = delete;
                                    ThreadPool& operator=(ThreadPool&&) = delete;

    template <typename Function, typename... Args>
    auto                            DispatchTask(Function&& func, Args&&... args) noexcept -> std::future<decltype(func(std::forward<Args>(args)...))>;
    void                            Start() noexcept;
    void                            Stop() noexcept;

private:

    using Event                     = EventCV;

    void                            AddThread() noexcept;

    boost::lockfree::stack<Task>    mTasks          { 64 };
    std::list<std::thread>          mWorkers        {};
    Event                           mEvent          {};
    std::atomic<bool>               mRunning        { false };
    uint8_t                         mWorkerCount    { kMaxThreadCount };
};

template <typename Function, typename... Args>
auto ThreadPool::DispatchTask(Function&& func, Args&&... args) noexcept -> std::future<decltype(func(std::forward<Args>(args)...))>
{
    assert(mRunning);

    using ReturnType = decltype(func(std::forward<Args>(args)...));
    auto task = std::make_shared<std::packaged_task<ReturnType()>>(std::bind(std::forward<Function>(func), std::forward<Args>(args)...));
    mTasks.push([task]()
    {
        (*task)();
    });
    mEvent.Signal();
    return task->get_future();
}

} // namespace gfx
} // namespace cc
