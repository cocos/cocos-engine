#include "MTLStd.h"
#include "MTLCommandAllocator.h"
#include "MTLCommands.h"

NS_CC_BEGIN

CCMTLCommandAllocator::CCMTLCommandAllocator(GFXDevice* device) : GFXCommandAllocator(device) {}
CCMTLCommandAllocator::~CCMTLCommandAllocator() { Destroy(); }

bool CCMTLCommandAllocator::Initialize(const GFXCommandAllocatorInfo& info)
{
    return true;
}

void CCMTLCommandAllocator::Destroy()
{
    
}

void CCMTLCommandAllocator::clearCommands(CCMTLCommandPackage* commandPackage)
{
    //FIXME: it is not a good idea to use like this.
    if (commandPackage->beginRenderPassCmds.Size() )
        _beginRenderPassCmdPool.FreeCmds(commandPackage->beginRenderPassCmds);
    
    if (commandPackage->bindStatesCmds.Size() )
        _bindStatesCmdPool.FreeCmds(commandPackage->bindStatesCmds);
    
    if (commandPackage->drawCmds.Size() )
        _drawCmdPool.FreeCmds(commandPackage->drawCmds);
    
    //TODO: free other commands.
    
    commandPackage->commandTypes.Clear();
}

NS_CC_END
