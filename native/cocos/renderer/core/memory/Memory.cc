#include "CoreStd.h"
#include "Memory.h"
#include "StlAlloc.h"

NS_CC_BEGIN
CC_CORE_API SA<char, STLAP> stl_char_allocator;
NS_CC_END

#if 0
CC_CORE_API void* BareNewErroneouslyCalled(size_t sz) {
	return malloc(sz);
}
#endif
