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

#pragma once

#include "TFJobSystem.h"
#include "base/std/container/deque.h"
#include "taskflow/taskflow.hpp"

namespace cc {

using TFJobToken = void;

class TFJobGraph final {
public:
    explicit TFJobGraph(TFJobSystem *system) noexcept : _executor(&system->_executor) {}

    template <typename Function>
    uint32_t createJob(Function &&func) noexcept;

    template <typename Function>
    uint32_t createForEachIndexJob(uint32_t begin, uint32_t end, uint32_t step, Function &&func) noexcept;

    void makeEdge(uint32_t j1, uint32_t j2) noexcept;

    void run() noexcept;

    inline void waitForAll() {
        if (_pending) {
            _future.wait();
            _pending = false;
        }
    }

private:
    tf::Executor *_executor = nullptr;

    tf::Taskflow _flow;
    ccstd::deque<tf::Task> _tasks; // existing tasks cannot be invalidated

    std::future<void> _future;
    bool _pending = false;
};

template <typename Function>
uint32_t TFJobGraph::createJob(Function &&func) noexcept {
    _tasks.emplace_back(_flow.emplace(func));
    return static_cast<uint32_t>(_tasks.size() - 1u);
}

template <typename Function>
uint32_t TFJobGraph::createForEachIndexJob(uint32_t begin, uint32_t end, uint32_t step, Function &&func) noexcept {
    _tasks.emplace_back(_flow.for_each_index(begin, end, step, func));
    return static_cast<uint32_t>(_tasks.size() - 1u);
}

} // namespace cc
