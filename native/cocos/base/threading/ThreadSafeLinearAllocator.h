#pragma once

#include <cstdint>
#include <atomic>
#include <cstdlib>

namespace cc {

class alignas(16) ThreadSafeLinearAllocator final
{
public:

    explicit                ThreadSafeLinearAllocator(uint32_t const size) noexcept;
                            ~ThreadSafeLinearAllocator();
                            ThreadSafeLinearAllocator(ThreadSafeLinearAllocator const&)             = delete;
                            ThreadSafeLinearAllocator(ThreadSafeLinearAllocator&&)                  = delete;
                            ThreadSafeLinearAllocator& operator=(ThreadSafeLinearAllocator const&)  = delete;
                            ThreadSafeLinearAllocator& operator=(ThreadSafeLinearAllocator&&)       = delete;

    void*                   Allocate(size_t const size, size_t const alignment) noexcept;

    inline void*            GetBuffer() const noexcept      { return mBuffer;                                       }
    inline uint32_t         GetCapacity() const noexcept    { return mCapacity;                                     }
    inline uint32_t         GetUsedSize() const noexcept    { return mUsedSize.load(std::memory_order_relaxed);     }
    inline uint32_t         GetBalance() const noexcept     { return GetCapacity() - GetUsedSize();                 }

    inline void             Recycle() noexcept              { mUsedSize.store(0, std::memory_order_relaxed);        }

private:

    void*                   mBuffer     { nullptr };
    uint32_t                mCapacity   { 0 };
    std::atomic<uint32_t>   mUsedSize   { 0 };
    // 16 bytes
};

} // namespace cc
