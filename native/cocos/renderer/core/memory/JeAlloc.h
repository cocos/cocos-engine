#ifndef CC_JE_ALLOC_H_
#define CC_JE_ALLOC_H_

#if (CC_MEMORY_ALLOCATOR == CC_MEMORY_ALLOCATOR_JEMALLOC)

namespace cc {

//Non-templated utility class just to hide jemalloc.
class CC_CORE_API JeAllocImpl {
 public:
	static CC_DECL_MALLOC void*	AllocBytes(size_t count, const char* file, int line, const char* func);
	static CC_DECL_MALLOC void*	ReallocBytes(void* ptr, size_t count, const char* file, int line, const char *func);
	static CC_DECL_MALLOC void*	AllocBytesAligned(size_t align, size_t count, const char* file, int line, const char* func);
	static void					DeallocBytes(void* ptr);
	static void					DumpStats(char* buf, int bufsize);
	static void					TrimAlloc();
};

/**	An allocation policy for use with AllocatedObject and
 STLAllocator. This is the class that actually does the allocation
 and deallocation of physical memory, and is what you will want to
 provide a custom version of if you wish to change how memory is allocated.
 */
class CC_CORE_API JeAllocPolicy {
 public:
	static CC_INLINE CC_DECL_MALLOC void* AllocateBytes(size_t count, const char* file = nullptr, int line = 0, const char* func = nullptr) {
		return JeAllocImpl::AllocBytes(count, file, line, func);
	}

	static CC_INLINE CC_DECL_MALLOC void* ReallocateBytes(void* ptr, size_t count, const char* file = nullptr, int line = 0, const char* func = nullptr) {
		return JeAllocImpl::ReallocBytes(ptr, count, file, line, func);
	}

	static CC_INLINE void DeallocateBytes(void* ptr) {
		JeAllocImpl::DeallocBytes(ptr);
	}

	static CC_INLINE CC_DECL_MALLOC void* AllocateBytesAligned(size_t alignment, size_t count, const char* file = nullptr, int line = 0, const char* func = nullptr) {
		return JeAllocImpl::AllocBytesAligned(alignment, count, file, line, func);
	}

	static CC_INLINE void DeallocateBytesAligned(void* ptr) {
		JeAllocImpl::DeallocBytes(ptr);
	}

	// Get the maximum size of a single allocation
	static CC_INLINE size_t GetMaxAllocationSize() {
		return (std::numeric_limits<size_t>::max)();
	}
	
 private:
	// No instantiation
	JeAllocPolicy() {}
};

}

#endif // end - #ifdef COCOS_MEMORY_ALLOCATOR_JEMALLOC

#endif // CC_JE_ALLOC_H_
