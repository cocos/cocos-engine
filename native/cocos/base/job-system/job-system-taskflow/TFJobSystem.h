#pragma once

#include "taskflow/taskflow.hpp"
#include "threading/ThreadSafeCounter.h"

namespace cc {

class TFJobGraph;

class TFJobSystem final {
public:

    static TFJobSystem &getInstance() { return _instance; }

    TFJobSystem() noexcept : TFJobSystem(std::thread::hardware_concurrency() - 1) {}
    TFJobSystem(uint threadCount) noexcept;

    uint run(TFJobGraph &g) noexcept;
    void wait(uint handle) noexcept;
    void waitForAll() noexcept;
    
    CC_INLINE uint threadCount() { return _executor.num_workers(); }

private:
    static TFJobSystem _instance;
    
    tf::Executor _executor;
    map<uint, std::future<void>> _futures;
    ThreadSafeCounter<uint> _nextHandle;
};

} // namespace cc
