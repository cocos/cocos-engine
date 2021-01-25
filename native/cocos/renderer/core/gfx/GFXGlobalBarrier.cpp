#include "CoreStd.h"

#include "GFXGlobalBarrier.h"

namespace cc {
namespace gfx {

GlobalBarrier::GlobalBarrier(Device *device)
: GFXObject(ObjectType::GLOBAL_BARRIER), _device(device) {
}

GlobalBarrier::~GlobalBarrier() {
}

} // namespace gfx
} // namespace cc
