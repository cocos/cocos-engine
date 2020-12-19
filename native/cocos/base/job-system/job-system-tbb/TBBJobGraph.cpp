#include "CoreStd.h"

#include "TBBJobGraph.h"

namespace cc {

void TBBJobGraph::makeEdge(uint j1, uint j2) noexcept {
    if (j1 & PARALLEL_JOB_FLAG) {
        j1 = _parallelJobs[j1 & PARALLEL_JOB_MASK].successor;
    } else if (j1 & REDUCE_JOB_FLAG) {
        // TODO
    }

    if (j2 & PARALLEL_JOB_FLAG) {
        j2 = _parallelJobs[j2 & PARALLEL_JOB_MASK].predecessor;
    } else if (j1 & REDUCE_JOB_FLAG) {
        // TODO
    }

    tbb::flow::make_edge(_nodes[j1], _nodes[j2]);
}

void TBBJobGraph::run(uint startJob) noexcept {
    if (startJob & PARALLEL_JOB_FLAG) {
        startJob = _parallelJobs[startJob & PARALLEL_JOB_MASK].predecessor;
    } else if (startJob & REDUCE_JOB_FLAG) {
        // TODO
    }
    if (startJob >= _nodes.size()) return;
    _nodes[startJob].try_put(tbb::flow::continue_msg());
    _pending = true;
}

} // namespace cc
