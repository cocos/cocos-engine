#include "ThreadSafeLinearAllocator.h"
#include "acl/core/memory_utils.h"

namespace cc {

ThreadSafeLinearAllocator::ThreadSafeLinearAllocator(uint32_t const size) noexcept
: mCapacity(size)
{
    mBuffer = malloc(size);
}

ThreadSafeLinearAllocator::~ThreadSafeLinearAllocator()
{
    free(mBuffer);
}

void* ThreadSafeLinearAllocator::Allocate(size_t const size, size_t const alignment) noexcept
{
    if (size == 0)
    {
        return nullptr;
    }

    void* allocatedMemory   = nullptr;
    uint32_t oldUsedSize    = 0;
    uint64_t newUsedSize    = 0;    // 为了判断溢出用64位
    
    do
    {
        oldUsedSize = GetUsedSize();
        allocatedMemory = acl::align_to(acl::add_offset_to_ptr<void>(mBuffer, oldUsedSize), alignment);
        newUsedSize = reinterpret_cast<uintptr_t>(allocatedMemory) - reinterpret_cast<uintptr_t>(mBuffer) + size;
        
        if (newUsedSize > mCapacity)   // 溢出
        {
            return nullptr;
        }
    } while (! mUsedSize.compare_exchange_weak(oldUsedSize, static_cast<uint32_t>(newUsedSize), std::memory_order_relaxed, std::memory_order_relaxed)); // 不可能存在ABA 不处理
    
    return allocatedMemory;
}

} // namespace cc
