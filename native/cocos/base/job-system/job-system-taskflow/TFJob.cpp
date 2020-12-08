#include "CoreStd.h"

#include "TFJob.h"

namespace cc {

TFJob::TFJob(tf::Task &&task) noexcept
: _task(task)
{
    
}

void TFJob::precede(TFJob &other) noexcept {
    _task.precede(other._task);
}

void TFJob::succeed(TFJob &other) noexcept {
    _task.succeed(other._task);
}

} // namespace cc
