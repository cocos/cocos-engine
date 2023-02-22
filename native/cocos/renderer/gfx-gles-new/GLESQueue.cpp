#include "GLESQueue.h"
#include "egl/Context.h"
#include "GLESCommandBuffer.h"

namespace cc::gfx::gles {
Queue::Queue() {
    _typedID = generateObjectID<decltype(this)>();
}

Queue::~Queue() {
    destroy();
}

void Queue::submit(gfx::CommandBuffer *const *cmdBuffs, uint32_t count) {
    ccstd::vector<CommandBuffer *> commandBuffers(count);
    for (uint32_t i = 0; i < count; ++i) {
        commandBuffers[i] = static_cast<CommandBuffer *>(cmdBuffs[i]);
        commandBuffers[i]->attachContext(&_state);
    }

    queueTask([this, commandBuffers]() {
        for (auto &cmd : commandBuffers) {
            cmd->execute();
            cmd->signal();
        }
    });
}

void Queue::initContext(egl::Context *context) {
    _state.eglContext = context;
    queueTask([this]() {
        _state.eglContext->makeCurrent();
    });
}

void Queue::surfaceDestroy(egl::Surface *surface) {
    EGLSurface eglSurface = surface->getNativeHandle();
    queueTask([this, eglSurface]() {
        _state.eglContext->surfaceDestroy(eglSurface);
    });
}

bool Queue::hasComplete(uint32_t taskId) {
    return _lastTaskId.load() >= taskId;
}

void Queue::wait(uint32_t taskId) {
    std::unique_lock<std::mutex> lock(_mutex);
    _taskCv.wait(lock, [=]() {return hasComplete(taskId); });
}

void Queue::waitIdle() {
    auto task = queueTask([](){});
    wait(task);
}

void Queue::doInit(const QueueInfo &info) {
    _thread = std::thread(&Queue::threadMain, this);
}

void Queue::doDestroy() {
    _exit.store(true);
    {
        std::lock_guard<std::mutex> lock(_mutex);
        _cv.notify_all();
    }
    if (_thread.joinable()) {
        _thread.join();
    }
}

void Queue::threadMain() {
    while (!_exit.load()) {
        if (!runTask()) {
            std::unique_lock<std::mutex> lock(_mutex);
            while (!_exit.load() && !hasTask()) {
                _cv.wait(lock);
            }
        }
    }
}

bool Queue::runTask() {
    ccstd::vector<Task> tasks;
    {
        std::lock_guard<std::mutex> lock(_taskMutex);
        if (_taskQueue.empty()) {
            return false;
        }
        tasks.swap(_taskQueue);
    }
    for (auto &task : tasks) {
        task.func();
        _lastTaskId.store(task.taskId);
        {
            std::unique_lock<std::mutex> lock(_mutex);
            _taskCv.notify_all();
        }
    }

    return true;
}

bool Queue::hasTask() {
    std::lock_guard<std::mutex> lock(_taskMutex);
    return !_taskQueue.empty();
}

} // namespace cc::gfx::gles
