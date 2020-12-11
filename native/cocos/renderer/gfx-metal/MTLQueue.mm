#include "MTLStd.h"

#include "MTLQueue.h"

namespace cc {
namespace gfx {

CCMTLQueue::CCMTLQueue(Device *device)
: Queue(device) {
}

bool CCMTLQueue::initialize(const QueueInfo &info) {
    _type = info.type;

    return true;
}

void CCMTLQueue::destroy() {
}

void CCMTLQueue::submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) {
    for (uint i = 0u; i < count; ++i) {
        const auto *cmdBuffer = cmdBuffs[i];
        _numDrawCalls += cmdBuffer->getNumDrawCalls();
        _numInstances += cmdBuffer->getNumInstances();
        _numTriangles += cmdBuffer->getNumTris();
    }
}

} // namespace gfx
} // namespace cc
