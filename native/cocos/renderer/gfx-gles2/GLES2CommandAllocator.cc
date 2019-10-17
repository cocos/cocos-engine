#include "GLES2Std.h"
#include "GLES2CommandAllocator.h"

CC_NAMESPACE_BEGIN

GLES2CommandAllocator::GLES2CommandAllocator(GFXDevice* device)
    : GFXCommandAllocator(device) {
}

GLES2CommandAllocator::~GLES2CommandAllocator() {
}

bool GLES2CommandAllocator::Initialize(const GFXCommandAllocatorInfo& info) {
  return true;
}

void GLES2CommandAllocator::Destroy() {
}

void GLES2CommandAllocator::ClearCmds(GLES2CmdPackage* cmd_package) {
  if (cmd_package->begin_render_pass_cmds.Size()) {
    begin_render_pass_cmd_pool.FreeCmds(cmd_package->begin_render_pass_cmds);
  }
  if (cmd_package->bind_states_cmds.Size()) {
    bind_states_cmd_pool.FreeCmds(cmd_package->bind_states_cmds);
  }
  if (cmd_package->draw_cmds.Size()) {
    draw_cmd_pool.FreeCmds(cmd_package->draw_cmds);
  }
  if (cmd_package->update_buffer_cmds.Size()) {
    update_buffer_cmd_pool.FreeCmds(cmd_package->update_buffer_cmds);
  }
  if (cmd_package->copy_buffer_to_texture_cmds.Size()) {
    copy_buffer_to_texture_cmd_pool.FreeCmds(cmd_package->copy_buffer_to_texture_cmds);
  }

  cmd_package->cmd_types.Clear();
}

CC_NAMESPACE_END
