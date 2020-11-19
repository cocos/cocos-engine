#pragma once

#include <cassert>
#include "concurrentqueue.h"
#include "lightweightsemaphore.h"

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
