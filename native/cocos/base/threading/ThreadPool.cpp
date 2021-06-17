/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "ThreadPool.h"

namespace cc {

uint8_t const ThreadPool::CPU_CORE_COUNT   = std::thread::hardware_concurrency();
uint8_t const ThreadPool::MAX_THREAD_COUNT = CPU_CORE_COUNT - 1;

void ThreadPool::start() {
    if (_running) {
        return;
    }

    _running = true;

    for (uint8_t i = 0; i < MAX_THREAD_COUNT; ++i) {
        addThread();
    }
}

void ThreadPool::stop() {
    if (!_running) {
        return;
    }

    _running = false;
    _event.signalAll();

    for (auto &worker : _workers) {
        if (worker.joinable()) {
            worker.join();
        }
    }

    _workers.clear();
}

void ThreadPool::addThread() {
    assert(_workers.size() < MAX_THREAD_COUNT);

    auto workerLoop = [this]() {
        while (_running) {
            Task task = nullptr;

            if (_tasks.try_dequeue(task)) {
                task();
            } else {
                // Double Check
                _event.wait([this]() {
                    return _tasks.size_approx() != 0;
                });
            }
        }
    };

    _workers.emplace_back(workerLoop);
}

} // namespace cc
