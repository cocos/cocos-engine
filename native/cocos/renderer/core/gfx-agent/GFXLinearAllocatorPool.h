#pragma once

#include <vector>
#include <algorithm>
#include "threading/ThreadSafeLinearAllocator.h"

namespace cc {
namespace gfx {

namespace {
constexpr size_t DEFAULT_BLOCK_SIZE = 16 * 1024 * 1024; // 16M per block by default

uint nextPowerOf2(uint v) {
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    return ++v;
}
}

class CC_DLL LinearAllocatorPool final {
public:
    LinearAllocatorPool() {
        _allocators.emplace_back(CC_NEW(ThreadSafeLinearAllocator(DEFAULT_BLOCK_SIZE)));
    }
    
    ~LinearAllocatorPool() {
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            CC_SAFE_DELETE(allocator);
        }
        _allocators.clear();
    }

    template<typename T>
    T* allocate(const uint count, uint alignment = 64u) noexcept {
        T* res = nullptr;
        size_t size = count * sizeof(T);
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            res = reinterpret_cast<T*>(allocator->Allocate(size, alignment));
            if (res) return res;
        }
        size_t capacity = nextPowerOf2(std::max(DEFAULT_BLOCK_SIZE, size));
        _allocators.emplace_back(CC_NEW(ThreadSafeLinearAllocator(capacity)));
        return reinterpret_cast<T*>(_allocators.back()->Allocate(size, alignment));
    }

    inline void reset() {
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            allocator->Recycle();
        }
    }

protected:
    vector<ThreadSafeLinearAllocator *> _allocators;
};

} // namespace gfx
} // namespace cc
