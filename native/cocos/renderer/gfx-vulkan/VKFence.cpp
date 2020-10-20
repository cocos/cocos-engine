#include "VKStd.h"

#include "VKDevice.h"
#include "VKFence.h"
#include "VKCommands.h"

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
        CC_LOG_ERROR("CCVKFence: CC_NEW CCVKGPUFence failed.");
        return false;
    }

    CCVKCmdFuncCreateFence((CCVKDevice *)_device, _gpuFence);

    return true;
}

void CCVKFence::destroy() {
    if (_gpuFence) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuFence);
        _gpuFence = nullptr;
    }
}

// TODO: move these two to device
void CCVKFence::wait() {
    VK_CHECK(vkWaitForFences(((CCVKDevice *)_device)->gpuDevice()->vkDevice, 1, &_gpuFence->vkFence, VK_TRUE, DEFAULT_TIMEOUT));
}

void CCVKFence::reset() {
    VK_CHECK(vkResetFences(((CCVKDevice *)_device)->gpuDevice()->vkDevice, 1, &_gpuFence->vkFence));
}

} // namespace gfx
} // namespace cc
