#pragma once

#include "gfx-base/GFXQueue.h"
#include "gfx-gles-new/GLESCore.h"
#include "base/std/container/deque.h"
#include <thread>
#include <condition_variable>

namespace cc::gfx::egl {
class Context;
class Surface;
}

namespace cc::gfx::gles {

class Queue : public gfx::Queue {
public:
    Queue();
    ~Queue() override;

    struct Task {
        uint32_t taskId = 0;
        std::function<void()> func;
    };

    void submit(gfx::CommandBuffer *const *cmdBuffs, uint32_t count) override;

    // context
    void initContext(egl::Context *context);
    void surfaceDestroy(egl::Surface *surface);

    bool hasComplete(uint32_t taskId);
    void wait(uint32_t taskId);
    void waitIdle();

    template <typename T>
    uint32_t queueTask(T &&task) {
        uint32_t res = _taskCounter.fetch_add(1);
        {
            std::lock_guard<std::mutex> lock(_taskMutex);
            _taskQueue.emplace_back(Task{res, std::forward<T>(task)});
        }
        {
            std::lock_guard<std::mutex> lock(_mutex);
            _cv.notify_all();
        }
        return res;
    }

private:
    friend class Device;
    void doInit(const QueueInfo &info) override;
    void doDestroy() override;

    void threadMain();
    bool runTask();
    bool hasTask();

private:
    std::thread              _thread;

    // thread mutex
    std::mutex               _mutex;
    std::condition_variable  _cv;
    std::condition_variable  _taskCv;

    // task queue mutex
    std::mutex               _taskMutex;
    ccstd::vector<Task>      _taskQueue;

    // status
    std::atomic_bool         _exit        = false;
    std::atomic_uint32_t     _taskCounter = 0;
    std::atomic_uint32_t     _lastTaskId  = 0;

    // context
    ContextState             _state;
};

} // namespace cc::gfx::gles
