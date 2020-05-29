#include "VKStd.h"
#include "VKFence.h"
#include "VKDevice.h"
#include "VKGPUObjects.h"

NS_CC_BEGIN

CCVKFence::CCVKFence(GFXDevice* device)
    : GFXFence(device)
{
}

CCVKFence::~CCVKFence()
{
}

bool CCVKFence::initialize(const GFXFenceInfo &info)
{
    _gpuFence = CC_NEW(CCVKGPUFence);
    if (!_gpuFence)
    {
        CC_LOG_ERROR("GLES2Fence: CC_NEW CCVKGPUFence failed.");
        return false;
    }

    VkFenceCreateInfo createInfo{ VK_STRUCTURE_TYPE_FENCE_CREATE_INFO };
    VK_CHECK(vkCreateFence(((CCVKDevice*)_device)->gpuDevice()->vkDevice, &createInfo, nullptr, &_gpuFence->vkFence));

    _status = GFXStatus::SUCCESS;
    return true;
}

void CCVKFence::destroy()
{
    if (_gpuFence)
    {
        vkDestroyFence(((CCVKDevice*)_device)->gpuDevice()->vkDevice, _gpuFence->vkFence, nullptr);

        CC_DELETE(_gpuFence);
        _gpuFence = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

void CCVKFence::wait()
{
    VK_CHECK(vkWaitForFences(((CCVKDevice*)_device)->gpuDevice()->vkDevice, 1, &_gpuFence->vkFence, VK_TRUE, DEFAULT_FENCE_TIMEOUT));
}

void CCVKFence::reset()
{
    VK_CHECK(vkResetFences(((CCVKDevice*)_device)->gpuDevice()->vkDevice, 1, &_gpuFence->vkFence));
}

NS_CC_END
