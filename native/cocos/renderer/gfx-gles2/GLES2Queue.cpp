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
            GLES2CommandBuffer *cmdBuff = (GLES2CommandBuffer *)cmdBuffs[i];
            GLES2CmdPackage *cmdPackage = cmdBuff->_pendingPackages.front();

            GLES2CmdFuncExecuteCmds((GLES2Device *)_device, cmdPackage);

            _numDrawCalls += cmdBuff->_numDrawCalls;
            _numInstances += cmdBuff->_numInstances;
            _numTriangles += cmdBuff->_numTriangles;

            cmdBuff->_pendingPackages.pop();
            cmdBuff->_freePackages.push(cmdPackage);
        }
    }
}

} // namespace gfx
} // namespace cc
