/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include <tbb/flow_graph.h>

namespace cc {

using TBBJobToken = tbb::flow::continue_msg;

class TBBJobSystem;

class TBBJobGraph final {
public:
    explicit TBBJobGraph(TBBJobSystem *system) noexcept {
        _nodes.emplace_back(_graph, [](TBBJobToken t) {});
    }

    template <typename Function>
    uint createJob(Function &&func) noexcept;

    template <typename Function>
    uint createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept;

    void makeEdge(uint j1, uint j2) noexcept;

    void run() noexcept;

    inline void waitForAll() {
        if (_pending) {
            _graph.wait_for_all();
            _pending = false;
        }
    }

private:
    static constexpr uint PARALLEL_JOB_FLAG = 1u << 20;
    static constexpr uint PARALLEL_JOB_MASK = ~PARALLEL_JOB_FLAG;

    tbb::flow::graph _graph;

    using TBBJobNode = tbb::flow::continue_node<tbb::flow::continue_msg>;
    deque<TBBJobNode> _nodes; // existing nodes cannot be invalidated

    struct TBBParallelJob {
        uint predecessor = 0u;
        uint successor   = 0u;
    };
    vector<TBBParallelJob> _parallelJobs;

    bool _pending = false;
};

template <typename Function>
uint TBBJobGraph::createJob(Function &&func) noexcept {
    _nodes.emplace_back(_graph, func);
    tbb::flow::make_edge(_nodes.front(), _nodes.back());
    return static_cast<uint>(_nodes.size() - 1u);
}

template <typename Function>
uint TBBJobGraph::createForEachIndexJob(uint begin, uint end, uint step, Function &&func) noexcept {
    _nodes.emplace_back(_graph, [](TBBJobToken t) {});
    uint        predecessorIdx = static_cast<uint>(_nodes.size() - 1u);
    TBBJobNode &predecessor    = _nodes.back();

    tbb::flow::make_edge(_nodes.front(), predecessor);

    _nodes.emplace_back(_graph, [](TBBJobToken t) {});
    uint        successorIdx = static_cast<uint>(_nodes.size() - 1u);
    TBBJobNode &successor    = _nodes.back();

    for (uint i = begin; i < end; i += step) {
        _nodes.emplace_back(_graph, [i, &func](TBBJobToken t) { func(i); });
        tbb::flow::make_edge(predecessor, _nodes.back());
        tbb::flow::make_edge(_nodes.back(), successor);
    }

    _parallelJobs.push_back({predecessorIdx, successorIdx});
    return static_cast<uint>((_parallelJobs.size() - 1u)) | PARALLEL_JOB_FLAG;
}

} // namespace cc
