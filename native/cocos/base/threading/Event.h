#pragma once

#include "ConditionVariable.h"
#include "Semaphore.h"

namespace cc {

template <typename T>
class Event final
{
public:

    inline void Wait() noexcept         { mSyncObject.Wait(); }
    inline void Signal() noexcept       { mSyncObject.Signal(); };
    inline void SignalAll() noexcept    { mSyncObject.SignalAll(); }

private:

    T           mSyncObject {};
};

using EventCV   = Event<ConditionVariable>;
using EventSem  = Event<Semaphore>;

} // namespace cc
