#include "GLES2Std.h"
#include "GLES2Queue.h"
#include "GLES2Commands.h"
#include "GLES2CommandBuffer.h"

NS_CC_BEGIN

GLES2Queue::GLES2Queue(GFXDevice* device)
    : GFXQueue(device),
      is_async_(false) {
}

GLES2Queue::~GLES2Queue() {
}

bool GLES2Queue::Initialize(const GFXQueueInfo &info) {
  type_ = info.type;
  
  return true;
}

void GLES2Queue::Destroy() {
}

void GLES2Queue::submit(GFXCommandBuffer** cmd_buffs, uint count) {
  if (!is_async_) {
    for (uint i = 0; i < count; ++i) {
      GLES2CommandBuffer* cmd_buff = (GLES2CommandBuffer*)cmd_buffs[i];
      GLES2CmdFuncExecuteCmds((GLES2Device*)device_, cmd_buff->cmd_package_);
      num_draw_calls_ += cmd_buff->num_draw_calls_;
      num_tris_ += cmd_buff->num_tris_;
    }
  }
}

NS_CC_END
