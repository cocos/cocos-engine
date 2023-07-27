#include "GLESQueue.h"

namespace cc::gfx {

bool GLESQueue::hasComplete(TaskHandle taskId) {
    return _lastTaskId.load() >= taskId;
}

void GLESQueue::wait(TaskHandle taskId) {
    std::unique_lock<std::mutex> lock(_mutex);
    _taskCv.wait(lock, [=]() {return hasComplete(taskId); });
}

void GLESQueue::waitIdle() {
    auto task = queueTask([](){});
    wait(task);
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

} // namespace cc::gfx