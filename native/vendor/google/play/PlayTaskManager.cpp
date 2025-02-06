
#include "vendor/google/play/PlayTaskManager.h"
#include "cocos/platform/java/jni/JniHelper.h"
#include "vendor/google/play/PlayTask.h"

namespace cc {

void PlayTaskManager::onTaskCanceled(int taskId, int listenerId) {
    auto it = _tasks.find(taskId);
    if (it != _tasks.end()) {
        it->second->onTaskCanceled(listenerId);
    }
}

void PlayTaskManager::onTaskComplete(int taskId, int listenerId, int nextTaskId) {
    auto it = _tasks.find(taskId);
    if (it != _tasks.end()) {
        it->second->onTaskComplete(listenerId, nextTaskId);
    }
}

void PlayTaskManager::onTaskFailure(int taskId, int listenerId, void* obj, int exceptionId) {
    auto it = _tasks.find(taskId);
    if (it != _tasks.end()) {
        it->second->onTaskFailure(listenerId, obj, exceptionId);
    }
}

void PlayTaskManager::onTaskSucess(int taskId, int listenerId, void* obj) {
    auto it = _tasks.find(taskId);
    if (it != _tasks.end()) {
        it->second->onTaskSuccess(listenerId, obj);
    }
}

PlayTask* PlayTaskManager::addTask(int taskId) {
    auto it = _tasks.find(taskId);
    if (it != _tasks.end()) {
        CC_LOG_WARNING("The task already exists.");
        return nullptr;
    }
    auto* task = new PlayTask(taskId);
    _tasks.insert(std::make_pair(taskId, task));
    return task;
}

void PlayTaskManager::removeTask(int taskId) {
    auto it = _tasks.find(taskId);
    if (it == _tasks.end()) {
        CC_LOG_WARNING("The task does not exist.");
        return;
    }
    _tasks.erase(it);
}

void* PlayTaskManager::onContinueWith(int taskId, int listenerId, int nextTaskId) {
    auto it = _tasks.find(taskId);
    if (it != _tasks.end()) {
        return it->second->onTaskContinueWith(listenerId, nextTaskId);
    }
    return nullptr;
}

} // namespace cc
