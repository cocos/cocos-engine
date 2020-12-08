#include "CoreStd.h"

#include "TFJobSystem.h"
#include "TFJobGraph.h"

namespace cc {

TFJobSystem TFJobSystem::_instance;

TFJobSystem::TFJobSystem(uint threadCount) noexcept
: _executor(threadCount)
{
    _nextHandle.Set(1 << 10); // start from non-zero
}

uint TFJobSystem::run(TFJobGraph &g) noexcept {
    uint nextHandle = _nextHandle.Increment();
    _futures[nextHandle] = _executor.run(g._flow);
    return nextHandle;
}

void TFJobSystem::wait(uint handle) noexcept {
    if (_futures.count(handle) == 0) return;
    _futures[handle].wait();
    _futures.erase(handle);
}

void TFJobSystem::waitForAll() noexcept {
    _executor.wait_for_all();
    _futures.clear();
}

} // namespace cc
