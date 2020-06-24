#include "GLES3Std.h"
#include "GLES3CommandAllocator.h"

namespace cc {
namespace gfx {

GLES3CommandAllocator::GLES3CommandAllocator(Device *device)
: CommandAllocator(device) {
}

GLES3CommandAllocator::~GLES3CommandAllocator() {
}

bool GLES3CommandAllocator::initialize(const CommandAllocatorInfo &info) {
    _status = Status::SUCCESS;
    return true;
}

void GLES3CommandAllocator::destroy() {
    _status = Status::UNREADY;
}

void GLES3CommandAllocator::clearCmds(GLES3CmdPackage *cmd_package) {
    if (cmd_package->beginRenderPassCmds.size()) {
        beginRenderPassCmdPool.freeCmds(cmd_package->beginRenderPassCmds);
    }
    if (cmd_package->bindStatesCmds.size()) {
        bindStatesCmdPool.freeCmds(cmd_package->bindStatesCmds);
    }
    if (cmd_package->drawCmds.size()) {
        drawCmdPool.freeCmds(cmd_package->drawCmds);
    }
    if (cmd_package->updateBufferCmds.size()) {
        updateBufferCmdPool.freeCmds(cmd_package->updateBufferCmds);
    }
    if (cmd_package->copyBufferToTextureCmds.size()) {
        copyBufferToTextureCmdPool.freeCmds(cmd_package->copyBufferToTextureCmds);
    }

    cmd_package->cmds.clear();
}

} // namespace gfx
} // namespace cc
