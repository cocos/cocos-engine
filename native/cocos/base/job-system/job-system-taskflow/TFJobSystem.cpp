#include "CoreStd.h"

#include "TFJobSystem.h"
#include "TFJobGraph.h"

namespace cc {

TFJobSystem *TFJobSystem::_instance = nullptr;

TFJobSystem::TFJobSystem(uint threadCount) noexcept
: _executor(threadCount)
{
    CC_LOG_INFO("Taskflow Job system initialized: %d worker threads", threadCount);
}

} // namespace cc
