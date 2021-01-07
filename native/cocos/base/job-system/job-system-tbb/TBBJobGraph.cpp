#include "CoreStd.h"

#include "TBBJobGraph.h"

namespace cc {

void TBBJobGraph::makeEdge(uint j1, uint j2) noexcept {
    if (j1 & PARALLEL_JOB_FLAG) {
        j1 = _parallelJobs[j1 & PARALLEL_JOB_MASK].successor;
    }

    if (j2 & PARALLEL_JOB_FLAG) {
        j2 = _parallelJobs[j2 & PARALLEL_JOB_MASK].predecessor;
    }

    tbb::flow::make_edge(_nodes[j1], _nodes[j2]);
}

void TBBJobGraph::run() noexcept {
    _nodes.front().try_put(tbb::flow::continue_msg());
    _pending = true;
}

} // namespace cc
