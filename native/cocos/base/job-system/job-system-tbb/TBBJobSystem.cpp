#include "CoreStd.h"

#include "TBBJobSystem.h"
#include "TBBJobGraph.h"

namespace cc {

TBBJobSystem *TBBJobSystem::_instance = nullptr;

TBBJobSystem::TBBJobSystem(uint threadCount) noexcept
: _control(tbb::global_control::max_allowed_parallelism, threadCount), _threadCount(threadCount) {
    CC_LOG_INFO("TBB Job system initialized: %d worker threads", threadCount);
}

} // namespace cc
