#pragma once

#include "taskflow/taskflow.hpp"
#include "TFJob.h"

namespace cc {

class TFJobGraph final {
public:

    template <typename Function>
    TFJob createJob(Function &&func) noexcept;

    template <typename B, typename E, typename S, typename Function>
    TFJob createForEachIndexJob(B &&begin, E &&end, S &&step, Function &&func) noexcept;
    
    template <typename B, typename E, typename T, typename Function>
    TFJob createReduceJob(B &&begin, E &&end, T &acc, Function &&func) noexcept;

private:

    friend class TFJobSystem;

    tf::Taskflow _flow;
};

template <typename Function>
TFJob TFJobGraph::createJob(Function &&func) noexcept {
    return TFJob(_flow.emplace(func));
}

template <typename B, typename E, typename S, typename Function>
TFJob TFJobGraph::createForEachIndexJob(B &&begin, E &&end, S &&step, Function &&func) noexcept {
    return TFJob(_flow.for_each_index(begin, end, step, func));
}

template <typename B, typename E, typename T, typename Function>
TFJob TFJobGraph::createReduceJob(B &&begin, E &&end, T &acc, Function &&func) noexcept {
    return TFJob(_flow.reduce(begin, end, acc, func));
}

} // namespace cc
