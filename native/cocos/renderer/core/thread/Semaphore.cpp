#include "Semaphore.h"

#ifdef _WINDOWS

Semaphore::Semaphore() noexcept
{
    mSemaphore = CreateSemaphore(nullptr, 0, 0xFFFFFFFF, nullptr);
}

Semaphore::~Semaphore()
{
    CloseHandle(mSemaphore);
}

void Semaphore::Wait() noexcept
{
    WaitForSingleObject(mSemaphore, 0xFFFFFFFF);
}

void Semaphore::Signal() noexcept
{
    ReleaseSemaphore(mSemaphore, 1, nullptr);
}

#elif defined(__APPLE__)

Semaphore::Semaphore() noexcept
{
    mSemaphore = dispatch_semaphore_create(0);
}

Semaphore::~Semaphore()
{
    dispatch_release(mSemaphore);
}

void Semaphore::Wait() noexcept
{
    dispatch_semaphore_wait(mSemaphore, DISPATCH_TIME_FOREVER);
}

void Semaphore::Signal() noexcept
{
    dispatch_semaphore_signal(mSemaphore);
}

#else // Android

Semaphore::Semaphore() noexcept
{
    sem_init(&mSemaphore, 0, 0);
}

Semaphore::~Semaphore()
{
    sem_destroy(&mSemaphore);
}

void Semaphore::Wait() noexcept
{
    sem_wait(&mSemaphore);
}

void Semaphore::Signal() noexcept
{
    sem_post(&mSemaphore);
}

#endif
