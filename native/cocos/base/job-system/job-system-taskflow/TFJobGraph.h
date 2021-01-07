#pragma once

#include "TFJobSystem.h"
#include "taskflow/taskflow.hpp"

namespace cc {

using TFJobToken = void;

class TFJobGraph final {
public:
    TFJobGraph(TFJobSystem *system) : _executor(&system->_executor) {}

    template <typename Function>
    uint createJob(Function &&func) noexcept;

    template <typename Function>
    uint createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept;

    void makeEdge(uint j1, uint j2) noexcept;

    void run() noexcept;

    CC_INLINE void waitForAll() {
        if (_pending) {
            _future.wait();
            _pending = false;
        }
    }

private:
    tf::Executor *_executor = nullptr;

    tf::Taskflow _flow;
    deque<tf::Task> _tasks; // existing tasks cannot be invalidated

    std::future<void> _future;
    bool _pending = false;
};

template <typename Function>
uint TFJobGraph::createJob(Function &&func) noexcept {
    _tasks.emplace_back(_flow.emplace(func));
    return _tasks.size() - 1u;
}

template <typename Function>
uint TFJobGraph::createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept {
    _tasks.emplace_back(_flow.for_each_index(begin, end, step, func));
    return _tasks.size() - 1u;
}

} // namespace cc
