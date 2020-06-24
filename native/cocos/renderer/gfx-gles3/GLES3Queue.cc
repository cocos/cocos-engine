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
    _status = Status::SUCCESS;

    return true;
}

void GLES3Queue::destroy() {
    _status = Status::UNREADY;
}

void GLES3Queue::submit(const vector<CommandBuffer *> &cmdBuffs, Fence *fence) {
    if (!_isAsync) {
        uint count = static_cast<uint>(cmdBuffs.size());
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
