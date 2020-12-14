#include "CoreStd.h"

#include "TFJobSystem.h"
#include "TFJobGraph.h"

namespace cc {

TFJobSystem TFJobSystem::_instance;

TFJobSystem::TFJobSystem(uint threadCount) noexcept
: _executor(threadCount)
{
    CC_LOG_INFO("Job system initialized: %d worker threads", threadCount);
}

void TFJobSystem::run(TFJobGraph &g) noexcept {
    if (g._pending) return;
    g._future = _executor.run(g._flow);
    g._pending = true;
}

} // namespace cc
