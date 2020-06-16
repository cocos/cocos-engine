#include "CoreStd.h"
#include "GFXCommandAllocator.h"

namespace cc {

GFXCommandAllocator::GFXCommandAllocator(GFXDevice *device)
: GFXObject(GFXObjectType::COMMAND_ALLOCATOR), _device(device) {
}

GFXCommandAllocator::~GFXCommandAllocator() {
}

}
