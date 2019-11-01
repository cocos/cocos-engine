#include "CoreStd.h"
#include "GFXCommandAllocator.h"

NS_CC_BEGIN

GFXCommandAllocator::GFXCommandAllocator(GFXDevice* device)
    : device_(device) {
}

GFXCommandAllocator::~GFXCommandAllocator() {
}

NS_CC_END
