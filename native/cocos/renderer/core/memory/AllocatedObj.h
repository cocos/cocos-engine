#ifndef CC_CORE_ALLOCATED_OBJ_H_
#define CC_CORE_ALLOCATED_OBJ_H_

// Anything that has done a #define new <blah> will screw operator new definitions up
// so undefine
#ifdef new
#  undef new
#endif
#ifdef delete
#  undef delete
#endif

#include "core/CoreDef.h"

namespace cc {

/** Superclass for all objects that wish to use custom memory allocators
 when their new / delete operators are called.
 Requires a template parameter identifying the memory allocator policy
 to use (e.g. see StdAllocPolicy).
 */
template <class Alloc>
class CC_CORE_API AllocatedObject
{
 public:
	explicit AllocatedObject() {}
	~AllocatedObject() {}
	
	// operator new, with debug line info
	void* operator new(size_t sz, const char *file, int line, const char *func) {
		return Alloc::AllocateBytes(sz, file, line, func);
	}
	
	/// array operator new, with debug line info
	void* operator new[] ( size_t sz, const char *file, int line, const char *func ) {
		return Alloc::AllocateBytes(sz, file, line, func);
	}

	/// placement operator new
	void* operator new(size_t sz, void *ptr) {
		(void)sz;
		return ptr;
	}

#if 1
	void* operator new(size_t sz) {
		return Alloc::AllocateBytes(sz);
	}

	void* operator new[]( size_t sz ) {
		return Alloc::AllocateBytes(sz);
	}
#endif

	void operator delete(void* ptr) {
		Alloc::DeallocateBytes(ptr);
	}
	
	// Corresponding operator for placement delete (second param same as the first)
	void operator delete(void* ptr, void*) {
		Alloc::DeallocateBytes(ptr);
	}
	
	// only called if there is an exception in corresponding 'new'
	void operator delete(void* ptr, const char*, int , const char*) {
		Alloc::DeallocateBytes(ptr);
	}
	
	void operator delete[](void *ptr) {
		Alloc::DeallocateBytes(ptr);
	}
	
	
	void operator delete[](void* ptr, const char*, int, const char*) {
		Alloc::DeallocateBytes(ptr);
	}
};

}

#endif // CC_CORE_ALLOCATED_OBJ_H_
