#pragma once

#include <thread>
#include <functional>
#include <mutex>
#include <atomic>
#include <condition_variable>
#include "base/std/container/vector.h"

namespace cc::gfx {

class GLESQueue {
public:
    GLESQueue() = default;
    virtual ~GLESQueue() = default;

    using TaskHandle = uint32_t;

    bool hasComplete(TaskHandle taskId);
    void wait(TaskHandle taskId);
    void waitIdle();

    template <typename T>
    TaskHandle queueTask(T &&task) {
        TaskHandle res = _taskCounter.fetch_add(1);
        {
            std::lock_guard<std::mutex> const lock(_taskMutex);
            _taskQueue.emplace_back(Task{res, std::forward<T>(task)});
        }
        {
            std::lock_guard<std::mutex> const lock(_mutex);
            _cv.notify_all();
        }
        return res;
    }

private:
    friend class Device;

    struct Task {
        TaskHandle taskId;
        std::function<void()> func;
    };

    void threadMain();
    bool runTask();
    bool hasTask();

    std::thread              _thread;

    // thread mutex
    std::mutex               _mutex;
    std::condition_variable  _cv;
    std::condition_variable  _taskCv;

    // task queue mutex
    std::mutex               _taskMutex;
    ccstd::vector<Task>      _taskQueue;

    // status
    std::atomic_bool        _exit        = false;
    std::atomic<TaskHandle> _taskCounter = 0;
    std::atomic<TaskHandle> _lastTaskId  = 0;
};

} // namespace cc::gfx