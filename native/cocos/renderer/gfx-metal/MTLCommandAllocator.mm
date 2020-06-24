#include "MTLStd.h"

#include "MTLCommandAllocator.h"
#include "MTLCommands.h"

namespace cc {
namespace gfx {

CCMTLCommandAllocator::CCMTLCommandAllocator(Device *device) : CommandAllocator(device) {}
CCMTLCommandAllocator::~CCMTLCommandAllocator() { destroy(); }

bool CCMTLCommandAllocator::initialize(const CommandAllocatorInfo &info) {
    _status = Status::SUCCESS;
    return true;
}

void CCMTLCommandAllocator::destroy() {
    _status = Status::UNREADY;
}

void CCMTLCommandAllocator::clearCommands(CCMTLCommandPackage *commandPackage) {
    //FIXME: it is not a good idea to use like this.
    if (commandPackage->beginRenderPassCmds.size())
        _beginRenderPassCmdPool.freeCmds(commandPackage->beginRenderPassCmds);

    if (commandPackage->bindStatesCmds.size())
        _bindStatesCmdPool.freeCmds(commandPackage->bindStatesCmds);

    if (commandPackage->drawCmds.size())
        _drawCmdPool.freeCmds(commandPackage->drawCmds);

    if (commandPackage->updateBufferCmds.size())
        _updateBufferCmdPool.freeCmds(commandPackage->updateBufferCmds);

    if (commandPackage->copyBufferToTextureCmds.size())
        _copyBufferToTextureCmdPool.freeCmds(commandPackage->copyBufferToTextureCmds);

    commandPackage->commandTypes.clear();
}

} // namespace gfx
} // namespace cc
