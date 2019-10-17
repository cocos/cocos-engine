#include "CoreStd.h"
#include "Memory.h"
#include "StlAlloc.h"

CC_NAMESPACE_BEGIN
CC_CORE_API SA<char, STLAP> stl_char_allocator;
CC_NAMESPACE_END

#if 0
CC_CORE_API void* BareNewErroneouslyCalled(size_t sz) {
	return malloc(sz);
}
#endif
