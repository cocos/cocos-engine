#include "VKStd.h"

#include "VKDevice.h"
#include "VKFence.h"
#include "VKGPUObjects.h"

namespace cc {
namespace gfx {

CCVKFence::CCVKFence(Device *device)
: Fence(device) {
}

CCVKFence::~CCVKFence() {
}

bool CCVKFence::initialize(const FenceInfo &info) {
    _gpuFence = CC_NEW(CCVKGPUFence);
    if (!_gpuFence) {
        CC_LOG_ERROR("GLES2Fence: CC_NEW CCVKGPUFence failed.");
        return false;
    }

    VkFenceCreateInfo createInfo{VK_STRUCTURE_TYPE_FENCE_CREATE_INFO};
    VK_CHECK(vkCreateFence(((CCVKDevice *)_device)->gpuDevice()->vkDevice, &createInfo, nullptr, &_gpuFence->vkFence));

    _status = Status::SUCCESS;
    return true;
}

void CCVKFence::destroy() {
    if (_gpuFence) {
        vkDestroyFence(((CCVKDevice *)_device)->gpuDevice()->vkDevice, _gpuFence->vkFence, nullptr);

        CC_DELETE(_gpuFence);
        _gpuFence = nullptr;
    }
    _status = Status::UNREADY;
}

void CCVKFence::wait() {
    VK_CHECK(vkWaitForFences(((CCVKDevice *)_device)->gpuDevice()->vkDevice, 1, &_gpuFence->vkFence, VK_TRUE, DEFAULT_FENCE_TIMEOUT));
}

void CCVKFence::reset() {
    VK_CHECK(vkResetFences(((CCVKDevice *)_device)->gpuDevice()->vkDevice, 1, &_gpuFence->vkFence));
}

} // namespace gfx
} // namespace cc
