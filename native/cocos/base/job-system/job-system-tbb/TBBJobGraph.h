#pragma once

#include <tbb/flow_graph.h>

namespace cc {

using TBBJobToken = tbb::flow::continue_msg;

class TBBJobSystem;

class TBBJobGraph final {
public:
    TBBJobGraph(TBBJobSystem *system) {}

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
            _graph.wait_for_all();
            _pending = false;
        }
    }

private:
    static constexpr uint PARALLEL_JOB_FLAG = 1u << 20;
    static constexpr uint PARALLEL_JOB_MASK = ~PARALLEL_JOB_FLAG;
    static constexpr uint REDUCE_JOB_FLAG = 1u << 21;
    static constexpr uint REDUCE_JOB_MASK = ~REDUCE_JOB_FLAG;

    tbb::flow::graph _graph;

    using TBBJobNode = tbb::flow::continue_node<tbb::flow::continue_msg>;
    vector<TBBJobNode> _nodes;

    struct TBBParallelJob {
        uint predecessor = 0u;
        uint successor = 0u;
    };
    vector<TBBParallelJob> _parallelJobs;

    bool _pending = false;
};

template <typename Function>
uint TBBJobGraph::createJob(Function &&func) noexcept {
    _nodes.emplace_back(_graph, func);
    return _nodes.size() - 1u;
}

template <typename Function>
uint TBBJobGraph::createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept {
    _nodes.reserve(_nodes.size() + (end - begin) / step + 2);

    _nodes.emplace_back(_graph, [](TBBJobToken t) {});
    uint predecessorIdx = _nodes.size() - 1u;
    TBBJobNode &predecessor = _nodes.back();

    _nodes.emplace_back(_graph, [](TBBJobToken t) {});
    uint successorIdx = _nodes.size() - 1u;
    TBBJobNode &successor = _nodes.back();

    for (uint i = begin; i < end; i += step) {
        _nodes.emplace_back(_graph, [i, &func](TBBJobToken t) { func(i); });
        tbb::flow::make_edge(predecessor, _nodes.back());
        tbb::flow::make_edge(_nodes.back(), successor);
    }

    _parallelJobs.push_back({predecessorIdx, successorIdx});
    return (_parallelJobs.size() - 1u) | PARALLEL_JOB_FLAG;
}

template <typename Function>
uint TBBJobGraph::createReduceJob(uint begin, uint end, uint acc, Function &&func) noexcept {
    // TODO
    return 0u;
}

} // namespace cc
