#include "ConditionVariable.h"

namespace cc {
namespace gfx {

void ConditionVariable::Wait() noexcept
{
    std::unique_lock<std::mutex> lock(mMutex);
    mCV.wait(lock);
}

void ConditionVariable::Signal() noexcept
{
    mCV.notify_one();
}

void ConditionVariable::SignalAll() noexcept
{
    mCV.notify_all();
}

} // namespace gfx
} // namespace cc
