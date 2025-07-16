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

#include <tbb/flow_graph.h>
#include "base/std/container/deque.h"
#include "base/std/container/vector.h"

namespace cc {

using TBBJobToken = tbb::flow::continue_msg;

class TBBJobSystem;

class TBBJobGraph final {
public:
    explicit TBBJobGraph(TBBJobSystem *system) noexcept {
        _nodes.emplace_back(_graph, [](TBBJobToken t) {});
    }

    template <typename Function>
    uint32_t createJob(Function &&func) noexcept;

    template <typename Function>
    uint32_t createForEachIndexJob(uint32_t begin, uint32_t end, uint32_t step, Function &&func) noexcept;

    void makeEdge(uint32_t j1, uint32_t j2) noexcept;

    void run() noexcept;

    inline void waitForAll() {
        if (_pending) {
            _graph.wait_for_all();
            _pending = false;
        }
    }

private:
    static constexpr uint32_t PARALLEL_JOB_FLAG = 1u << 20;
    static constexpr uint32_t PARALLEL_JOB_MASK = ~PARALLEL_JOB_FLAG;

    tbb::flow::graph _graph;

    using TBBJobNode = tbb::flow::continue_node<tbb::flow::continue_msg>;
    ccstd::deque<TBBJobNode> _nodes; // existing nodes cannot be invalidated

    struct TBBParallelJob {
        uint32_t predecessor = 0u;
        uint32_t successor = 0u;
    };
    ccstd::vector<TBBParallelJob> _parallelJobs;

    bool _pending = false;
};

template <typename Function>
uint32_t TBBJobGraph::createJob(Function &&func) noexcept {
    _nodes.emplace_back(_graph, func);
    tbb::flow::make_edge(_nodes.front(), _nodes.back());
    return static_cast<uint32_t>(_nodes.size() - 1u);
}

template <typename Function>
uint32_t TBBJobGraph::createForEachIndexJob(uint32_t begin, uint32_t end, uint32_t step, Function &&func) noexcept {
    _nodes.emplace_back(_graph, [](TBBJobToken t) {});
    auto predecessorIdx = static_cast<uint32_t>(_nodes.size() - 1u);
    TBBJobNode &predecessor = _nodes.back();

    tbb::flow::make_edge(_nodes.front(), predecessor);

    _nodes.emplace_back(_graph, [](TBBJobToken t) {});
    auto successorIdx = static_cast<uint32_t>(_nodes.size() - 1u);
    TBBJobNode &successor = _nodes.back();

    for (uint32_t i = begin; i < end; i += step) {
        _nodes.emplace_back(_graph, [i, &func](TBBJobToken t) { func(i); });
        tbb::flow::make_edge(predecessor, _nodes.back());
        tbb::flow::make_edge(_nodes.back(), successor);
    }

    _parallelJobs.push_back({predecessorIdx, successorIdx});
    return static_cast<uint32_t>((_parallelJobs.size() - 1u)) | PARALLEL_JOB_FLAG;
}

} // namespace cc
