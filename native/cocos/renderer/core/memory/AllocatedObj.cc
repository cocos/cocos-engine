#include "CoreStd.h"
#include "MemDef.h"
#include "AllocatedObj.h"

CC_NAMESPACE_BEGIN

/*
 The problem is that operator new/delete are *implicitly* static. We have to
 instantiate them for each combination exactly once throughout all the compilation
 units that are linked together, and this appears to be the only way to do it.
 */

template class AllocatedObject<GAP>;

CC_NAMESPACE_END
