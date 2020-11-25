#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLFence.h"

namespace cc {
namespace gfx {

CCMTLFence::CCMTLFence(Device *device)
: Fence(device),
  _frameBoundarySemaphore(dispatch_semaphore_create(MAX_INFLIGHT_BUFFER)) {
}

CCMTLFence::~CCMTLFence() {
    destroy();
}

bool CCMTLFence::initialize(const FenceInfo &info) {
    // TODO

    return true;
}

void CCMTLFence::destroy() {
    dispatch_semaphore_signal(_frameBoundarySemaphore);
}

void CCMTLFence::signal() {
    dispatch_semaphore_signal(_frameBoundarySemaphore);
}

void CCMTLFence::wait() {
    dispatch_semaphore_wait(_frameBoundarySemaphore, DISPATCH_TIME_FOREVER);
}

void CCMTLFence::reset() {
    dispatch_semaphore_signal(_frameBoundarySemaphore);
}

} // namespace gfx
} // namespace cc
