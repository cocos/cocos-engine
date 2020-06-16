#include "CoreStd.h"
#include "GFXFence.h"

namespace cc {
namespace gfx {

GFXFence::GFXFence(GFXDevice *device)
: GFXObject(GFXObjectType::FENCE), _device(device) {
}

GFXFence::~GFXFence() {
}

} // namespace gfx
} // namespace cc
