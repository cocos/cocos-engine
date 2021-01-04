#pragma once

#include <cassert>
#include "concurrentqueue/concurrentqueue.h"
#include "concurrentqueue/lightweightsemaphore.h"

namespace cc {

class Semaphore final
{
public:

                                    Semaphore() noexcept;
    explicit                        Semaphore(uint32_t const initialCount) noexcept;

    void                            Wait() noexcept;
    void                            Signal() noexcept;
    void                            SignalAll() noexcept { assert(false); }

private:

    moodycamel::details::Semaphore  mSemaphore;
};

} // namespace cc
