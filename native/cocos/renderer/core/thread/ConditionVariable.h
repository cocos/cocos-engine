#pragma once

#include <thread>
#include <mutex>
#include <condition_variable>

namespace cc {
namespace gfx {

class ConditionVariable final
{
public:

    void                    Wait() noexcept;
    void                    Signal() noexcept;
    void                    SignalAll() noexcept;

private:

    std::mutex              mMutex;
    std::condition_variable mCV;
};

} // namespace gfx
} // namespace cc
