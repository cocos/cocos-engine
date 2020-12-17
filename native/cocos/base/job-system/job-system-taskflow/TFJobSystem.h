#pragma once

#include "taskflow/taskflow.hpp"

namespace cc {

class TFJobGraph;

class TFJobSystem final {
public:

    static TFJobSystem &getInstance() { return _instance; }

    TFJobSystem() noexcept : TFJobSystem(std::thread::hardware_concurrency() - 2) {}
    TFJobSystem(uint threadCount) noexcept;

    void run(TFJobGraph &g) noexcept;
    
    CC_INLINE uint threadCount() { return _executor.num_workers(); }

private:
    static TFJobSystem _instance;
    
    tf::Executor _executor;
};

} // namespace cc
