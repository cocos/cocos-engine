#pragma once

#include "taskflow/taskflow.hpp"

class TFJobGraph;

namespace cc {

class TFJob final {
public:

    void precede(TFJob &other) noexcept;
    void succeed(TFJob &other) noexcept;

private:
    
    TFJob(tf::Task &&task) noexcept;
    
    friend class TFJobGraph;

    tf::Task _task;
};

} // namespace cc
