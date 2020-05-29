#include "GLES3Std.h"
#include "GLES3Queue.h"
#include "GLES3Commands.h"
#include "GLES3CommandBuffer.h"

NS_CC_BEGIN

GLES3Queue::GLES3Queue(GFXDevice* device)
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

void GLES3Queue::submit(const std::vector<GFXCommandBuffer*>& cmd_buffs, GFXFence* fence) {
  if (!_isAsync) {
    uint count = static_cast<uint>(cmd_buffs.size());
    for (uint i = 0; i < count; ++i) {
      GLES3CommandBuffer* cmd_buff = (GLES3CommandBuffer*)cmd_buffs[i];
      GLES3CmdFuncExecuteCmds((GLES3Device*)_device, cmd_buff->_cmdPackage);
      _numDrawCalls += cmd_buff->_numDrawCalls;
      _numInstances += cmd_buff->_numInstances;
      _numTriangles += cmd_buff->_numTriangles;
    }
  }
}

NS_CC_END
