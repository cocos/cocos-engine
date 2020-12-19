#pragma once

#include "taskflow/taskflow.hpp"

namespace cc {

class TFJobSystem final {
public:
    static TFJobSystem *getInstance() {
        if (!_instance) {
            _instance = CC_NEW(TFJobSystem);
        }
        return _instance;
    }

    static void destroyInstance() {
        CC_SAFE_DELETE(_instance);
    }

    TFJobSystem() noexcept : TFJobSystem(std::thread::hardware_concurrency() - 2) {}
    TFJobSystem(uint threadCount) noexcept;

    CC_INLINE uint threadCount() { return _executor.num_workers(); }

private:
    friend class TFJobGraph;

    static TFJobSystem *_instance;
    
    tf::Executor _executor;
};

} // namespace cc
