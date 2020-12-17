#include "CoreStd.h"

#include "TFJobGraph.h"
#include "TFJobSystem.h"

namespace cc {

void TFJobGraph::makeEdge(uint j1, uint j2) noexcept {
    _tasks[j1].precede(_tasks[j2]);
}

void TFJobGraph::run() noexcept {
    TFJobSystem::getInstance().run(*this);
}

} // namespace cc
