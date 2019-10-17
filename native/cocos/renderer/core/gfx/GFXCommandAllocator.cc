#include "CoreStd.h"
#include "GFXCommandAllocator.h"

CC_NAMESPACE_BEGIN

GFXCommandAllocator::GFXCommandAllocator(GFXDevice* device)
    : device_(device) {
}

GFXCommandAllocator::~GFXCommandAllocator() {
}

CC_NAMESPACE_END
