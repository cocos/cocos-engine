#include "GLES3Std.h"
#include "GLES3Queue.h"
#include "GLES3Commands.h"
#include "GLES3CommandBuffer.h"

namespace cc {
namespace gfx {

GLES3Queue::GLES3Queue(Device *device)
: Queue(device) {
}

GLES3Queue::~GLES3Queue() {
}

bool GLES3Queue::initialize(const QueueInfo &info) {
    _type = info.type;

    return true;
}

void GLES3Queue::destroy() {
}

void GLES3Queue::submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) {
    if (!_isAsync) {
        for (uint i = 0; i < count; ++i) {
            GLES3CommandBuffer *cmdBuffer = (GLES3CommandBuffer *)cmdBuffs[i];
            GLES3CmdFuncExecuteCmds((GLES3Device *)_device, cmdBuffer->_cmdPackage);
            _numDrawCalls += cmdBuffer->_numDrawCalls;
            _numInstances += cmdBuffer->_numInstances;
            _numTriangles += cmdBuffer->_numTriangles;
        }
    }
}

} // namespace gfx
} // namespace cc
