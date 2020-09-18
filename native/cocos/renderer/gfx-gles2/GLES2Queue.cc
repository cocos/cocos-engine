#include "GLES2Std.h"
#include "GLES2Queue.h"
#include "GLES2Commands.h"
#include "GLES2CommandBuffer.h"

namespace cc {
namespace gfx {

GLES2Queue::GLES2Queue(Device *device)
: Queue(device) {
}

GLES2Queue::~GLES2Queue() {
}

bool GLES2Queue::initialize(const QueueInfo &info) {
    _type = info.type;

    return true;
}

void GLES2Queue::destroy() {
}

void GLES2Queue::submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) {
    if (!_isAsync) {
        for (uint i = 0; i < count; ++i) {
            GLES2CommandBuffer *cmdBuffer = (GLES2CommandBuffer *)cmdBuffs[i];
            GLES2CmdFuncExecuteCmds((GLES2Device *)_device, cmdBuffer->_cmdPackage);
            _numDrawCalls += cmdBuffer->_numDrawCalls;
            _numInstances += cmdBuffer->_numInstances;
            _numTriangles += cmdBuffer->_numTriangles;
        }
    }
}

} // namespace gfx
} // namespace cc
