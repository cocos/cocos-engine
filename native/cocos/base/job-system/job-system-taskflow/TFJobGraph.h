#pragma once

#include "TFJobSystem.h"
#include "taskflow/taskflow.hpp"

namespace cc {

using TFJobToken = void;

class TFJobGraph final {
public:
    TFJobGraph(TFJobSystem *system) : _executor(&system->_executor) {}
    ~TFJobGraph() { _tasks.clear(); }

    template <typename Function>
    uint createJob(Function &&func) noexcept;

    template <typename Function>
    uint createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept;

    template <typename Function>
    uint createReduceJob(uint begin, uint end, uint acc, Function &&func) noexcept;

    void makeEdge(uint j1, uint j2) noexcept;

    void run(uint startJob) noexcept;

    CC_INLINE void waitForAll() {
        if (_pending) {
            _future.wait();
            _pending = false;
        }
    }

private:
    tf::Executor *_executor = nullptr;

    tf::Taskflow _flow;
    vector<tf::Task> _tasks;

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

template <typename Function>
uint TFJobGraph::createReduceJob(uint begin, uint end, uint acc, Function &&func) noexcept {
    _tasks.emplace_back(_flow.reduce(begin, end, acc, func));
    return _tasks.size() - 1u;
}

} // namespace cc
