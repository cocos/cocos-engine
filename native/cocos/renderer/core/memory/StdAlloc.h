#ifndef CC_CORE_STD_ALLOC_H_
#define CC_CORE_STD_ALLOC_H_

#if (CC_MEMORY_ALLOCATOR == CC_MEMORY_ALLOCATOR_STD)

namespace cc {

/**	A "standard" allocation policy for use with AllocatedObject and 
	STLAllocator. This is the class that actually does the allocation
	and deallocation of physical memory, and is what you will want to 
	provide a custom version of if you wish to change how memory is allocated.
	@par
	This class just delegates to the global malloc/free.
*/
class CC_CORE_API StdAllocPolicy {
 public:
	static CC_INLINE CC_DECL_MALLOC void* AllocateBytes(size_t count,
#ifdef CC_MEMORY_TRACKER
		const char* file = nullptr, int line = 0, const char* func = nullptr
#else
		const char* = nullptr, int = 0, const char* = nullptr
#endif
		) {
		void* ptr = malloc(count);
#ifdef CC_MEMORY_TRACKER
		MemTracker::Instance()->RecordAlloc(ptr, count, file, line, func);
#endif
		return ptr;
	}

	static CC_INLINE CC_DECL_MALLOC void* ReallocateBytes(void* ptr, size_t count,
#ifdef CC_MEMORY_TRACKER
		const char* file = nullptr, int line = 0, const char* func = nullptr
#else
		const char* = nullptr, int = 0, const char* = nullptr
#endif
		) {
#ifdef CC_MEMORY_TRACKER
		if (ptr) {
			if (count == 0) {
				MemTracker::Instance()->RecordFree(ptr);
				free(ptr);
				return NULL;
			} else {
				int oldsz = MemTracker::Instance()->GetAllocSize(ptr);
				if (oldsz < 0) {
					printf("realloc: get old size of ptr fail!\n");
					assert(0);
					return realloc(ptr, count);
				} else {
					if (oldsz >(int)count) oldsz = (int)count;
				}

				void* nptr = malloc(count);
				memcpy(nptr, ptr, oldsz);
				MemTracker::Instance()->RecordAlloc(nptr, count, file, line, func);
				MemTracker::Instance()->RecordFree(ptr);
				free(ptr);
				return nptr;
			}
		} else {
			if (count) {
				ptr = malloc(count);
				MemTracker::Instance()->RecordAlloc(ptr, count, file, line, func);
				return ptr;
			} else {
				return nullptr;
			}
		}
#else
		return realloc(ptr, count);
#endif
	}

	static CC_INLINE void DeallocateBytes(void* ptr) {
#ifdef CC_MEMORY_TRACKER
		MemTracker::Instance()->RecordFree(ptr);
#endif
		free(ptr);
	}

	static CC_INLINE CC_DECL_MALLOC void* AllocateBytesAligned(size_t alignment, size_t count,
#ifdef CC_MEMORY_TRACKER
		const char* file = NULL, int line = 0, const char* func = NULL
#else
		const char* = NULL, int = 0, const char* = NULL
#endif
		) {
#ifdef _MSC_VER 
		void* ptr = _aligned_malloc(count, alignment);
#elif defined(__ANDROID__)
		//void* ptr = memalign(alignment, count);
		unsigned char* p = (unsigned char*)malloc(count + alignment);
		size_t offset = alignment - (size_t(p) & (alignment - 1));
		unsigned char* ptr = p + offset;
		ptr[-1] = (unsigned char)offset;
#else
		void* ptr = NULL;
		posix_memalign(&ptr, alignment, count);
#endif

#ifdef CC_MEMORY_TRACKER
		MemTracker::Instance()->RecordAlloc(ptr, count, file, line, func);
#endif
		return ptr;
	}

	static CC_INLINE void DeallocateBytesAligned(void *ptr)
	{
#ifdef CC_MEMORY_TRACKER
		MemTracker::Instance()->RecordFree(ptr);
#endif

#ifdef _MSC_VER
		_aligned_free(ptr);
#elif defined(__ANDROID__)
		if (ptr)
		{
			unsigned char* mem = (unsigned char*)ptr;
			mem = mem - mem[-1];
			free(mem);
		}
#else 
		free(ptr);
#endif
	}

	// Get the maximum size of a single allocation
	static CC_INLINE size_t getMaxAllocationSize() {
		return (std::numeric_limits<size_t>::max)();
	}
	
 private:
	// No instantiation
	StdAllocPolicy() {}
};

}

#endif

#endif // CC_CORE_STD_ALLOC_H_
