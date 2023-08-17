/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "ThreadPool.h"

namespace cc {

uint8_t const ThreadPool::CPU_CORE_COUNT = std::thread::hardware_concurrency();
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
    CC_ASSERT(_workers.size() < MAX_THREAD_COUNT);

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
