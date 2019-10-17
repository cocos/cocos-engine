#include "GLES3Std.h"
#include "GLES3Queue.h"
#include "GLES3Commands.h"
#include "GLES3CommandBuffer.h"

CC_NAMESPACE_BEGIN

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

void GLES3Queue::Destroy() {
}

void GLES3Queue::submit(GFXCommandBuffer** cmd_buffs, uint count) {
  if (!is_async_) {
    for (uint i = 0; i < count; ++i) {
      GLES3CommandBuffer* cmd_buff = (GLES3CommandBuffer*)cmd_buffs[i];
      GLES3CmdFuncExecuteCmds((GLES3Device*)device_, cmd_buff->cmd_package_);
      num_draw_calls_ += cmd_buff->num_draw_calls_;
      num_tris_ += cmd_buff->num_tris_;
    }
  }
}

CC_NAMESPACE_END
