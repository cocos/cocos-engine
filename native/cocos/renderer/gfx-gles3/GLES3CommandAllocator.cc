#include "GLES3Std.h"
#include "GLES3CommandAllocator.h"

NS_CC_BEGIN

GLES3CommandAllocator::GLES3CommandAllocator(GFXDevice* device)
    : GFXCommandAllocator(device) {
}

GLES3CommandAllocator::~GLES3CommandAllocator() {
}

bool GLES3CommandAllocator::initialize(const GFXCommandAllocatorInfo& info) {
  return true;
}

void GLES3CommandAllocator::destroy() {
}

void GLES3CommandAllocator::clearCmds(GLES3CmdPackage* cmd_package) {
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
