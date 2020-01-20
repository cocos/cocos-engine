#include "GLES2Std.h"
#include "GLES2CommandAllocator.h"

NS_CC_BEGIN

GLES2CommandAllocator::GLES2CommandAllocator(GFXDevice* device)
    : GFXCommandAllocator(device) {
}

GLES2CommandAllocator::~GLES2CommandAllocator() {
}

bool GLES2CommandAllocator::initialize(const GFXCommandAllocatorInfo& info) {
  return true;
}

void GLES2CommandAllocator::destroy() {
}

void GLES2CommandAllocator::clearCmds(GLES2CmdPackage* cmd_package) {
  if (cmd_package->begin_render_pass_cmds.size()) {
    beginRenderPassCmdPool.freeCmds(cmd_package->begin_render_pass_cmds);
  }
  if (cmd_package->bind_states_cmds.size()) {
    bindStatesCmdPool.freeCmds(cmd_package->bind_states_cmds);
  }
  if (cmd_package->draw_cmds.size()) {
    drawCmdPool.freeCmds(cmd_package->draw_cmds);
  }
  if (cmd_package->update_buffer_cmds.size()) {
    updateBufferCmdPool.freeCmds(cmd_package->update_buffer_cmds);
  }
  if (cmd_package->copy_buffer_to_texture_cmds.size()) {
    copyBufferToTextureCmdPool.freeCmds(cmd_package->copy_buffer_to_texture_cmds);
  }

  cmd_package->cmd_types.clear();
}

NS_CC_END
