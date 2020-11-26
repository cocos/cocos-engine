#include "CoreStd.h"

#include "Memory.h"
#include "StlAlloc.h"

namespace cc {
CC_DLL SA<char, STLAP> stl_char_allocator;

#if 0
CC_DLL void* BareNewErroneouslyCalled(size_t sz) {
	return malloc(sz);
}
#endif

} // namespace cc
