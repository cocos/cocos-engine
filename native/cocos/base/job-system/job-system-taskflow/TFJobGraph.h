#pragma once

#include "taskflow/taskflow.hpp"

namespace cc {

class TFJobGraph final {
public:
    template <typename Function>
    uint createJob(Function &&func) noexcept;

    template <typename B, typename E, typename S, typename Function>
    uint createForEachIndexJob(B &&begin, E &&end, S &&step, Function &&func) noexcept;

    template <typename B, typename E, typename T, typename Function>
    uint createReduceJob(B &&begin, E &&end, T &acc, Function &&func) noexcept;

    void makeEdge(uint j1, uint j2) noexcept;

    void run() noexcept;

    CC_INLINE void waitForAll() {
        if (_pending) {
            _future.wait();
            _pending = false;
        }
    }

private:
    friend class TFJobSystem;

    tf::Taskflow _flow;
    vector<tf::Task> _tasks;

    std::future<void> _future;
    bool _pending = false;
};

template <typename Function>
uint TFJobGraph::createJob(Function &&func) noexcept {
    _tasks.emplace_back(_flow.emplace(func));
    return _tasks.size();
}

template <typename B, typename E, typename S, typename Function>
uint TFJobGraph::createForEachIndexJob(B &&begin, E &&end, S &&step, Function &&func) noexcept {
    _tasks.emplace_back(_flow.for_each_index(begin, end, step, func));
    return _tasks.size();
}

template <typename B, typename E, typename T, typename Function>
uint TFJobGraph::createReduceJob(B &&begin, E &&end, T &acc, Function &&func) noexcept {
    _tasks.emplace_back(_flow.reduce(begin, end, acc, func));
    return _tasks.size();
}

} // namespace cc
