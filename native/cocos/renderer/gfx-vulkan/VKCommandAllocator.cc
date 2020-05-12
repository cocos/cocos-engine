#include "VKStd.h"
#include "VKCommandAllocator.h"
#include "VKCommands.h"
#include "VKDevice.h"

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

void CCVKCommandAllocator::reset()
{
    VK_CHECK(vkResetCommandPool(((CCVKDevice*)_device)->gpuDevice()->vkDevice, _gpuCommandPool->vkCommandPool, 0));

    for (uint i = 0u; i < 2u; i++)
    {
        auto &usedList = _gpuCommandPool->usedCommandBuffers[i];
        _gpuCommandPool->commandBuffers[i].concat(usedList);
        usedList.clear();
    }
}

NS_CC_END
