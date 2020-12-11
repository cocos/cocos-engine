#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLFence.h"

namespace cc {
namespace gfx {

CCMTLFence::CCMTLFence(Device *device)
: Fence(device) {
}

bool CCMTLFence::initialize(const FenceInfo &info) {
    return true;
}

void CCMTLFence::destroy() {
}

void CCMTLFence::wait() {
}

void CCMTLFence::reset() {
}

} // namespace gfx
} // namespace cc
