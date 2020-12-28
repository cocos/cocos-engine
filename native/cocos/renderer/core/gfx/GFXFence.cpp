#include "CoreStd.h"

#include "GFXFence.h"

namespace cc {
namespace gfx {

Fence::Fence(Device *device)
: GFXObject(ObjectType::FENCE), _device(device) {
}

Fence::~Fence() {
}

} // namespace gfx
} // namespace cc
