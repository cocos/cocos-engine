#include "CoreStd.h"

#include "GFXContext.h"

namespace cc {
namespace gfx {

Context::Context(Device *device)
: _device(device) {
}

Context::~Context() {
}

} // namespace gfx
} // namespace cc
