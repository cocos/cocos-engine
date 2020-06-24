#include "MTLStd.h"

#include "MTLCommandAllocator.h"
#include "MTLCommands.h"

namespace cc {
namespace gfx {

CCMTLCommandAllocator::CCMTLCommandAllocator() {}
CCMTLCommandAllocator::~CCMTLCommandAllocator() {}

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
