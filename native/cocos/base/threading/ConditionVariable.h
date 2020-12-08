#pragma once

#include <thread>
#include <mutex>
#include <condition_variable>

namespace cc {

class ConditionVariable final
{
public:

    void                    Wait() noexcept;
    template <typename Function, typename... Args>
    void                    Wait(Function func, Args&&... args) noexcept;
    void                    Signal() noexcept;
    void                    SignalAll() noexcept;

private:

    std::mutex              mMutex;
    std::condition_variable mCV;
};

template <typename Function, typename... Args>
void ConditionVariable::Wait(Function func, Args&&... args) noexcept
{
    // ******** 注意 ********
    // func内不要操作任何同步对象!!!
    // 如果不确定 就不要调用这个函数!!!
    std::unique_lock<std::mutex> lock(mMutex);
    mCV.wait(lock, std::bind(std::forward<Function>(func), std::forward<Args>(args)...));
}

} // namespace cc
