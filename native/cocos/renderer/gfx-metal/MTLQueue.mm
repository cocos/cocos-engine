#include "MTLStd.h"

#include "MTLQueue.h"

namespace cc {
namespace gfx {

CCMTLQueue::CCMTLQueue(Device *device) : Queue(device) {}

CCMTLQueue::~CCMTLQueue() {
    destroy();
}

bool CCMTLQueue::initialize(const QueueInfo &info) {
    _type = info.type;

    return true;
}

void CCMTLQueue::destroy() {
}

void CCMTLQueue::submit(const vector<CommandBuffer *> &cmdBuffs, Fence *fence) {
    for (const auto *cmdBuffer : cmdBuffs) {
        _numDrawCalls += cmdBuffer->getNumDrawCalls();
        _numInstances += cmdBuffer->getNumInstances();
        _numTriangles += cmdBuffer->getNumTris();
    }
}

} // namespace gfx
} // namespace cc
