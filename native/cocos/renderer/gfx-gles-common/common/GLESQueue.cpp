#include "GLESQueue.h"
#include "gfx-gles-common/egl/Context.h"
#include "gfx-gles-common/common/GLESCommandBuffer.h"

namespace cc::gfx {
GLESQueue::~GLESQueue() {
    destroy();
}

void GLESQueue::startThread() {
    _isAsyncQueue = true;
    _thread = std::thread(&GLESQueue::threadMain, this);
}

void GLESQueue::initContext(egl::Context *context) {
    _eglContext = context;
    queueTask([this]() {
        _eglContext->makeCurrent();
    });
}

void GLESQueue::surfaceDestroy(egl::Surface *surface) {
    IntrusivePtr<egl::Surface> const tmpSurface(surface); // hold reference
    queueTask([=]() {
        _eglContext->makeCurrent();
    });
}

void GLESQueue::waitIdle() {
    auto task = queueTask([](){});
    wait(task);
}

bool GLESQueue::hasComplete(TaskHandle taskId) {
    return !_isAsyncQueue || _lastTaskId.load() >= taskId;
}

void GLESQueue::wait(TaskHandle taskId) {
    if (_isAsyncQueue) {
        std::unique_lock<std::mutex> lock(_mutex);
        _taskCv.wait(lock, [=]() { return hasComplete(taskId); });
    }
}

void GLESQueue::threadMain() {
    while (!_exit.load()) {
        if (!runTask()) {
            std::unique_lock<std::mutex> lock(_mutex);
            while (!_exit.load() && !hasTask()) {
                _cv.wait(lock);
            }
        }
    }
}

bool GLESQueue::runTask() {
    ccstd::vector<Task> tasks;
    {
        std::lock_guard<std::mutex> const lock(_taskMutex);
        if (_taskQueue.empty()) {
            return false;
        }
        tasks.swap(_taskQueue);
    }
    for (auto &task : tasks) {
        task.func();
        _lastTaskId.store(task.taskId);
        {
            std::unique_lock<std::mutex> const lock(_mutex);
            _taskCv.notify_all();
        }
    }

    return true;
}

bool GLESQueue::hasTask() {
    std::lock_guard<std::mutex> const lock(_taskMutex);
    return !_taskQueue.empty();
}

void GLESQueue::submit(CommandBuffer *const *cmdBuffs, uint32_t count) {
    for (uint32_t i = 0; i < count; ++i) {
        auto *commandBuffer = static_cast<GLESCommandBuffer *>(cmdBuffs[i]);
        commandBuffer->attachContext(_eglContext);
        commandBuffer->setTaskHandle(
            queueTask([=]() {
                glFlush();
                commandBuffer->executeCommands();
            })
        );
    }
}

void GLESQueue::doInit(const QueueInfo &info) {
    std::ignore = info;
}

void GLESQueue::doDestroy() {
    _exit.store(true);
    {
        std::lock_guard<std::mutex> const lock(_mutex);
        _cv.notify_all();
    }
    if (_thread.joinable()) {
        _thread.join();
    }
}

} // namespace cc::gfx
