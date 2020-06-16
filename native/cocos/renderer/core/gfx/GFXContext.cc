#include "CoreStd.h"
#include "GFXContext.h"

namespace cc {
namespace gfx {

GFXContext::GFXContext(GFXDevice *device)
: _device(device) {
}

GFXContext::~GFXContext() {
}

} // namespace gfx
} // namespace cc
