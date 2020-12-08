#include "ThreadPool.h"

namespace cc {

uint8_t const ThreadPool::kCpuCoreCount = std::thread::hardware_concurrency();
uint8_t const ThreadPool::kMaxThreadCount = kCpuCoreCount - 1;

void ThreadPool::Start() noexcept
{
    if (mRunning)
    {
        return;
    }
    
    mRunning = true;
    
    for (uint8_t i = 0; i < kMaxThreadCount; ++i)
    {
        AddThread();
    }
}

void ThreadPool::Stop() noexcept
{
    if (! mRunning)
    {
        return;
    }
    
    mRunning = false;
    mEvent.SignalAll();
    
    for (auto& worker : mWorkers)
    {
        if (worker.joinable())
        {
            worker.join();
        }
    }
    
    mWorkers.clear();
}

void ThreadPool::AddThread() noexcept
{
    assert(mWorkers.size() < kMaxThreadCount);

    auto workerLoop = [this]()
    {
        while (mRunning)
        {
            Task task = nullptr;
            
            if (mTasks.try_dequeue(task))
            {
                task();
            }
            else
            {
                // Double Check
                mEvent.Wait([this]()
                {
                    return mTasks.size_approx() != 0;
                });
            }
        }
    };
    
    mWorkers.emplace_back(workerLoop);
}

} // namespace cc
