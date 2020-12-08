#pragma once

#include <cstdint>
#include <atomic>

namespace cc {

template <typename T, typename = typename std::enable_if_t<std::is_integral_v<T>>>
class ThreadSafeCounter final
{
public:

    inline T        Increment() noexcept            { return Add(1); }
    inline T        Add(T const v) noexcept         { return mCounter.fetch_add(v, std::memory_order_relaxed); }
    inline T        Decrement() noexcept            { return Subtract(1); }
    inline T        Subtract(T const v) noexcept    { return mCounter.fetch_sub(v, std::memory_order_relaxed); }
    inline void     Set(T const v) noexcept         { mCounter.store(v, std::memory_order_relaxed); }
    inline T        Get() const noexcept            { return mCounter.load(std::memory_order_relaxed); }
    inline T        Reset() noexcept                { Set(0); }

private:

    std::atomic<T>  mCounter    { 0 };
};

} // namespace cc
