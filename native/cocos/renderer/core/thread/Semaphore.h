#pragma once

#include <cassert>
#ifdef _WINDOWS
#include <windows.h>
using NativeSemaphoreType = HANDLE;
#elif defined(__APPLE__)
#include <dispatch/dispatch.h>
using NativeSemaphoreType = dispatch_semaphore_t;
#else // Android
#include <semaphore.h>
using NativeSemaphoreType = sem_t;
#endif

class Semaphore final
{
public:
    
    Semaphore() noexcept;
    ~Semaphore();
    
    void                Wait() noexcept;
    void                Signal() noexcept;
    void                SignalAll() noexcept { assert(false); }
    
private:
    
    NativeSemaphoreType mSemaphore;
};
