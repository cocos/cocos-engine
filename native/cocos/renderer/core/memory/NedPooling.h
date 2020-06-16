#ifndef CC_CORE_NED_POOLING_H_
#define CC_CORE_NED_POOLING_H_

#if (CC_MEMORY_ALLOCATOR == CC_MEMORY_ALLOCATOR_NEDPOOLING)

namespace cc {
namespace gfx {

//Non-templated utility class just to hide nedmalloc.
class CC_CORE_API NedPoolingImpl {
public:
    static CC_DECL_MALLOC void *AllocBytes(size_t count, const char *file, int line, const char *func);
    static CC_DECL_MALLOC void *ReallocBytes(void *ptr, size_t count, const char *file, int line, const char *func);
    static CC_DECL_MALLOC void *AllocBytesAligned(size_t align, size_t count, const char *file, int line, const char *func);
    static void DeallocBytes(void *ptr);
};

/**	An allocation policy for use with AllocatedObject and
 STLAllocator. This is the class that actually does the allocation
 and deallocation of physical memory, and is what you will want to
 provide a custom version of if you wish to change how memory is allocated.
 @par
 This allocation policy uses nedmalloc (http://nedprod.com/programs/portable/nedmalloc/index.html).
 */
class CC_CORE_API NedPoolingAllocPolicy {
public:
    static CC_INLINE CC_DECL_MALLOC void *AllocateBytes(size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return NedPoolingImpl::AllocBytes(count, file, line, func);
    }
    static CC_INLINE CC_DECL_MALLOC void *ReallocateBytes(void *ptr, size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return NedPoolingImpl::ReallocBytes(ptr, count, file, line, func);
    }
    static CC_INLINE void DeallocateBytes(void *ptr) {
        NedPoolingImpl::DeallocBytes(ptr);
    }
    static CC_INLINE CC_DECL_MALLOC void *AllocateBytesAligned(size_t alignment, size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return NedPoolingImpl::AllocBytesAligned(alignment, count, file, line, func);
    }
    static CC_INLINE void DeallocateBytesAligned(void *ptr) {
        NedPoolingImpl::DeallocBytes(ptr);
    }

    // Get the maximum size of a single allocation
    static CC_INLINE size_t getMaxAllocationSize() {
        return (std::numeric_limits<size_t>::max)();
    }

private:
    // No instantiation
    NedPoolingAllocPolicy() {}
};

} // namespace gfx
} // namespace cc

#endif // end - #ifdef CC_MEMORY_ALLOCATOR_NEDPOOLING

#endif // CC_CORE_NED_POOLING_H_
