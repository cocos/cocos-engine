#include "GLES3Std.h"
#include "GLES3Queue.h"
#include "GLES3Commands.h"
#include "GLES3CommandBuffer.h"

NS_CC_BEGIN

GLES3Queue::GLES3Queue(GFXDevice* device)
    : GFXQueue(device),
      is_async_(false) {
}

GLES3Queue::~GLES3Queue() {
}

bool GLES3Queue::Initialize(const GFXQueueInfo &info) {
  type_ = info.type;
  
  return true;
}

void GLES3Queue::destroy() {
}

void GLES3Queue::submit(GFXCommandBuffer** cmd_buffs, uint count) {
  if (!is_async_) {
    for (uint i = 0; i < count; ++i) {
      GLES3CommandBuffer* cmd_buff = (GLES3CommandBuffer*)cmd_buffs[i];
      GLES3CmdFuncExecuteCmds((GLES3Device*)device_, cmd_buff->cmd_package_);
      _numDrawCalls += cmd_buff->_numDrawCalls;
      _numTriangles += cmd_buff->_numTriangles;
    }
  }
}

NS_CC_END
