#include "CoreStd.h"

#include "TFJobGraph.h"
#include "TFJobSystem.h"

namespace cc {

void TFJobGraph::makeEdge(uint j1, uint j2) noexcept {
    _tasks[j1].precede(_tasks[j2]);
}

void TFJobGraph::run(uint startJob) noexcept {
    if (_pending) return;
    _future = _executor->run(_flow);
    _pending = true;
}

} // namespace cc
