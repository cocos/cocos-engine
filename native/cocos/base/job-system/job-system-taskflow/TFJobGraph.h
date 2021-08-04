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

#pragma once

#include "TFJobSystem.h"
#include "taskflow/taskflow.hpp"

namespace cc {

using TFJobToken = void;

class TFJobGraph final {
public:
    explicit TFJobGraph(TFJobSystem *system) noexcept : _executor(&system->_executor) {}

    template <typename Function>
    uint createJob(Function &&func) noexcept;

    template <typename Function>
    uint createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept;

    void makeEdge(uint j1, uint j2) noexcept;

    void run() noexcept;

    inline void waitForAll() {
        if (_pending) {
            _future.wait();
            _pending = false;
        }
    }

private:
    tf::Executor *_executor = nullptr;

    tf::Taskflow    _flow;
    deque<tf::Task> _tasks; // existing tasks cannot be invalidated

    std::future<void> _future;
    bool              _pending = false;
};

template <typename Function>
uint TFJobGraph::createJob(Function &&func) noexcept {
    _tasks.emplace_back(_flow.emplace(func));
    return static_cast<uint>(_tasks.size() - 1u);
}

template <typename Function>
uint TFJobGraph::createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept {
    _tasks.emplace_back(_flow.for_each_index(begin, end, step, func));
    return static_cast<uint>(_tasks.size() - 1u);
}

} // namespace cc
