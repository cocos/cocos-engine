#include "Semaphore.h"

Semaphore::Semaphore() noexcept
: mSemaphore(0)
{
}

Semaphore::Semaphore(uint32_t const initialCount) noexcept
: mSemaphore(initialCount)
{
}

void Semaphore::Wait() noexcept
{
    mSemaphore.wait();
}

void Semaphore::Signal() noexcept
{
    mSemaphore.signal();
}
