#include "ConditionVariable.h"

namespace cc {

void ConditionVariable::Wait() noexcept
{
    std::unique_lock<std::mutex> lock(mMutex);
    mCV.wait(lock);
}

void ConditionVariable::Signal() noexcept
{
    std::lock_guard<std::mutex> lock(mMutex);
    mCV.notify_one();
}

void ConditionVariable::SignalAll() noexcept
{
    std::lock_guard<std::mutex> lock(mMutex);
    mCV.notify_all();
}

} // namespace cc
