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
            GLES3CommandBuffer *cmdBuff = (GLES3CommandBuffer *)cmdBuffs[i];
            GLES3CmdPackage *cmdPackage = cmdBuff->_pendingPackages.front();

            GLES3CmdFuncExecuteCmds((GLES3Device *)_device, cmdPackage);

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
