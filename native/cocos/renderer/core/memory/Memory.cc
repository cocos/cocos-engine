#include "CoreStd.h"
#include "Memory.h"
#include "StlAlloc.h"

namespace cc {
CC_CORE_API SA<char, STLAP> stl_char_allocator;
}

#if 0
CC_CORE_API void* BareNewErroneouslyCalled(size_t sz) {
	return malloc(sz);
}
#endif
