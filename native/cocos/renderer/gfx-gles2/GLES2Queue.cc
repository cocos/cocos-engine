#include "GLES2Std.h"
#include "GLES2Queue.h"
#include "GLES2Commands.h"
#include "GLES2CommandBuffer.h"

namespace cc {

GLES2Queue::GLES2Queue(GFXDevice *device)
: GFXQueue(device) {
}

GLES2Queue::~GLES2Queue() {
}

bool GLES2Queue::initialize(const GFXQueueInfo &info) {
    _type = info.type;
    _status = GFXStatus::SUCCESS;

    return true;
}

void GLES2Queue::destroy() {
    _status = GFXStatus::UNREADY;
}

void GLES2Queue::submit(const vector<GFXCommandBuffer *>::type &cmdBuffs, GFXFence *fence) {
    if (!_isAsync) {
        uint count = static_cast<uint>(cmdBuffs.size());
        for (uint i = 0; i < count; ++i) {
            GLES2CommandBuffer *cmdBuffer = (GLES2CommandBuffer *)cmdBuffs[i];
            GLES2CmdFuncExecuteCmds((GLES2Device *)_device, cmdBuffer->_cmdPackage);
            _numDrawCalls += cmdBuffer->_numDrawCalls;
            _numInstances += cmdBuffer->_numInstances;
            _numTriangles += cmdBuffer->_numTriangles;
        }
    }
}

}
