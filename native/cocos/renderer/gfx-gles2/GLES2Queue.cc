#include "GLES2Std.h"
#include "GLES2Queue.h"
#include "GLES2Commands.h"
#include "GLES2CommandBuffer.h"

NS_CC_BEGIN

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

void GLES2Queue::submit(const std::vector<GFXCommandBuffer *> &cmd_buffs, GFXFence *fence) {
    if (!_isAsync) {
        uint count = static_cast<uint>(cmd_buffs.size());
        for (uint i = 0; i < count; ++i) {
            GLES2CommandBuffer *cmd_buff = (GLES2CommandBuffer *)cmd_buffs[i];
            GLES2CmdFuncExecuteCmds((GLES2Device *)_device, cmd_buff->_cmdPackage);
            _numDrawCalls += cmd_buff->_numDrawCalls;
            _numInstances += cmd_buff->_numInstances;
            _numTriangles += cmd_buff->_numTriangles;
        }
    }
}

NS_CC_END
