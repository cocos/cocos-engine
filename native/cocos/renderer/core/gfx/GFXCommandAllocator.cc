#include "CoreStd.h"
#include "GFXCommandAllocator.h"

namespace cc {
namespace gfx {

GFXCommandAllocator::GFXCommandAllocator(GFXDevice *device)
: GFXObject(GFXObjectType::COMMAND_ALLOCATOR), _device(device) {
}

GFXCommandAllocator::~GFXCommandAllocator() {
}

} // namespace gfx
} // namespace cc
