#include "CoreStd.h"
#include "GFXCommandAllocator.h"

NS_CC_BEGIN

GFXCommandAllocator::GFXCommandAllocator(GFXDevice *device)
: GFXObject(GFXObjectType::COMMAND_ALLOCATOR), _device(device) {
}

GFXCommandAllocator::~GFXCommandAllocator() {
}

NS_CC_END
