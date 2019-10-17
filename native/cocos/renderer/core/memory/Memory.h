#pragma once

#include "MemTracker.h"
#include "MemDef.h"
#include "StlAlloc.h"
#include "AllocatedObj.h"

// Global Interface Definitions

#define CC_NEW(T)								      _CC_NEW T
#define CC_NEW_ARRAY(T, count)				_CC_NEW T[count]
#define CC_DELETE(ptr)							  _CC_DELETE (ptr)
#define CC_DELETE_ARRAY(ptr)					_CC_DELETE[] (ptr)
#define CC_SAFE_DELETE(ptr)						if(ptr) { CC_DELETE(ptr); (ptr) = nullptr; }
#define CC_SAFE_DELETE_ARRAY(ptr)			if(ptr) { CC_DELETE_ARRAY(ptr); (ptr) = nullptr; }
#define CC_UNSAFE_DELETE(ptr)         if(ptr) { CC_DELETE(ptr); }
#define CC_UNSAFE_DELETE_ARRAY(ptr)   if(ptr) { CC_DELETE_ARRAY(ptr); }

#define CC_NEW_T(T)								              _CC_NEW_T(T)
#define CC_NEW_ARRAY_T(T, count)				        _CC_NEW_ARRAY_T(T, count)
#define CC_DELETE_T(ptr, T)						          _CC_DELETE_T(ptr, T)
#define CC_DELETE_ARRAY_T(ptr, T, count)	      _CC_DELETE_ARRAY_T(ptr, T, count)
#define CC_SAFE_DELETE_T(ptr, T)				        if(ptr) { CC_DELETE_T(ptr, T); (ptr) = nullptr; }
#define CC_SAFE_DELETE_ARRAY_T(ptr, T, count)	  if(ptr) { CC_DELETE_ARRAY_T(ptr, T, count); (ptr) = nullptr; }
#define CC_UNSAFE_DELETE_T(ptr, T)				      if(ptr) { CC_DELETE_T(ptr, T); }
#define CC_UNSAFE_DELETE_ARRAY_T(ptr, T, count)	if(ptr) { CC_DELETE_ARRAY_T(ptr, T, count); }

#define CC_MALLOC(bytes)					  _CC_MALLOC(bytes)
#define CC_REALLOC(ptr, bytes)		  _CC_REALLOC(ptr, bytes)
#define CC_ALLOC(T, count)				  _CC_ALLOC_T(T, count)
#define CC_FREE(ptr)							  _CC_FREE(ptr)
#define CC_SAFE_FREE(ptr)					  if(ptr) { CC_FREE(ptr); (ptr) = nullptr; }
#define CC_UNSAFE_FREE(ptr)				  if(ptr) { CC_FREE(ptr); }

#define CC_MALLOC_SIMD(bytes)			  _CC_MALLOC_SIMD(bytes)
#define CC_FREE_SIMD(ptr)					  _CC_FREE_SIMD(ptr)

#define CC_DESTROY(ptr)						  { (ptr)->Destroy(); CC_DELETE(ptr); }
#define CC_SAFE_DESTROY(ptr)			  if (ptr) { (ptr)->Destroy(); CC_DELETE(ptr); ptr = nullptr; }
#define CC_UNSAFE_DESTROY(ptr)		  if (ptr) { (ptr)->Destroy(); CC_DELETE(ptr); }

#define CC_SAFE_RELEASE_REF(ptr)	  if (ptr) { (ptr)->ReleaseRef(); ptr = nullptr; }
#define CC_UNSAFE_RELEASE_REF(ptr)	if (ptr) { (ptr)->ReleaseRef(); }

#if 0
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS) && (CC_MODE == CC_MODE_DEBUG)
CC_CORE_API void* BareNewErroneouslyCalled(size_t sz);
CC_INLINE void* operator new(size_t sz) { return BareNewErroneouslyCalled(sz); }
CC_INLINE void operator delete(void* ptr) throw() { free(ptr); }
#endif
#endif