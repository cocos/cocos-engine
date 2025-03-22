/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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
