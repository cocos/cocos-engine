#pragma once

#include <thread>
#include <functional>
#include <mutex>
#include <atomic>
#include <condition_variable>
#include "base/std/container/vector.h"
#include "gfx-base/GFXQueue.h"

namespace cc::gfx {
namespace egl {
class Context;
class Surface;
} // namespace egl

class GLESQueue : public Queue {
public:
    GLESQueue() = default;
    ~GLESQueue() override;

    using TaskHandle = uint32_t;

    void startThread();
    void initContext(egl::Context *context);
    void surfaceDestroy(egl::Surface *surface);

    bool hasComplete(TaskHandle taskId);
    void wait(TaskHandle taskId);
    void waitIdle();

    bool isAsyncQueue() const { return _isAsyncQueue; }

    template <typename T>
    TaskHandle queueTask(T &&task) {
        if (_isAsyncQueue) {
            return queueTaskInternal(std::forward<T>(task));
        }
        task();
        return _taskCounter;
    }
private:
    friend class GLESDevice;

    template <typename T>
    TaskHandle queueTaskInternal (T &&task) {
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

    struct Task {
        TaskHandle taskId;
        std::function<void()> func;
    };

    void submit(CommandBuffer *const *cmdBuffs, uint32_t count) override;
    void doInit(const QueueInfo &info) override;
    void doDestroy() override;

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

    bool _isAsyncQueue{false};
    egl::Context *_eglContext = nullptr;
};

} // namespace cc::gfx
