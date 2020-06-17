#include "GLES3Std.h"
#include "GLES3Queue.h"
#include "GLES3Commands.h"
#include "GLES3CommandBuffer.h"

namespace cc {
namespace gfx {

GLES3Queue::GLES3Queue(GFXDevice *device)
: GFXQueue(device) {
}

GLES3Queue::~GLES3Queue() {
}

bool GLES3Queue::initialize(const GFXQueueInfo &info) {
    _type = info.type;
    _status = GFXStatus::SUCCESS;

    return true;
}

void GLES3Queue::destroy() {
    _status = GFXStatus::UNREADY;
}

void GLES3Queue::submit(const vector<GFXCommandBuffer *> &cmdBuffs, GFXFence *fence) {
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
