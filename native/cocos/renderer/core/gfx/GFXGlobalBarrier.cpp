#include "CoreStd.h"

#include "GFXGlobalBarrier.h"

namespace cc {
namespace gfx {

GlobalBarrier::GlobalBarrier(Device *device)
: GFXObject(ObjectType::GLOBAL_BARRIER), _device(device) {
}

GlobalBarrier::~GlobalBarrier() {
}

uint GlobalBarrier::computeHash(const GlobalBarrierInfo& info) {
    uint seed = info.prevAccesses.size() + info.nextAccesses.size();

    for (const AccessType type : info.prevAccesses) {
        seed ^= (uint)(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }
    for (const AccessType type : info.nextAccesses) {
        seed ^= (uint)(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }

    return seed;
}

} // namespace gfx
} // namespace cc
