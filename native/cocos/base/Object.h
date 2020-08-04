#ifndef CC_CORE_KERNEL_OBJECT_H_
#define CC_CORE_KERNEL_OBJECT_H_

#include "memory/AllocatedObj.h"
#include "memory/MemDef.h"

namespace cc {

// Now define all the base classes for each allocation
typedef AllocatedObject<GAP> Object;

} // namespace cc

#endif // CC_CORE_KERNEL_OBJECT_H_
