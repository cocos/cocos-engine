#include "VKStd.h"
#include "VKCommandAllocator.h"
#include "VKCommands.h"

NS_CC_BEGIN

CCVKCommandAllocator::CCVKCommandAllocator(GFXDevice* device)
    : GFXCommandAllocator(device)
{
}

CCVKCommandAllocator::~CCVKCommandAllocator()
{
}

bool CCVKCommandAllocator::initialize(const GFXCommandAllocatorInfo& info)
{
    _gpuCommandPool = CC_NEW(CCVKGPUCommandPool);

    CCVKCmdFuncCreateCommandPool((CCVKDevice*)_device, _gpuCommandPool);

    _status = GFXStatus::SUCCESS;
    return true;
}

void CCVKCommandAllocator::destroy()
{
    CCVKCmdFuncDestroyCommandPool((CCVKDevice*)_device, _gpuCommandPool);

    _status = GFXStatus::UNREADY;
}

NS_CC_END
