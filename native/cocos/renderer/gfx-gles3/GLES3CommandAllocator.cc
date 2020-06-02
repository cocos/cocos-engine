#include "GLES3Std.h"
#include "GLES3CommandAllocator.h"

NS_CC_BEGIN

GLES3CommandAllocator::GLES3CommandAllocator(GFXDevice* device)
: GFXCommandAllocator(device) {
}

GLES3CommandAllocator::~GLES3CommandAllocator() {
}

bool GLES3CommandAllocator::initialize(const GFXCommandAllocatorInfo& info) {
    _status = GFXStatus::SUCCESS;
    return true;
}

void GLES3CommandAllocator::destroy() {
    _status = GFXStatus::UNREADY;
}

void GLES3CommandAllocator::clearCmds(GLES3CmdPackage* cmd_package) {
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

NS_CC_END
