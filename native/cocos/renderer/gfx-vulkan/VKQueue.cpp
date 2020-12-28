#include "VKStd.h"

#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "VKFence.h"
#include "VKQueue.h"

namespace cc {
namespace gfx {

CCVKQueue::CCVKQueue(Device *device)
: Queue(device) {
}

CCVKQueue::~CCVKQueue() {
}

bool CCVKQueue::initialize(const QueueInfo &info) {
    _type = info.type;
    _isAsync = true;

    _gpuQueue = CC_NEW(CCVKGPUQueue);
    _gpuQueue->type = _type;
    CCVKCmdFuncGetDeviceQueue((CCVKDevice *)_device, _gpuQueue);

    return true;
}

void CCVKQueue::destroy() {
    if (_gpuQueue) {
        _gpuQueue->vkQueue = VK_NULL_HANDLE;
        CC_DELETE(_gpuQueue);
        _gpuQueue = nullptr;
    }
}

void CCVKQueue::submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) {
    CCVKDevice *device = (CCVKDevice *)_device;
    _gpuQueue->commandBuffers.clear();
    device->gpuTransportHub()->depart();

    for (uint i = 0u; i < count; ++i) {
        CCVKCommandBuffer *cmdBuff = (CCVKCommandBuffer *)cmdBuffs[i];
        if (!cmdBuff->_pendingQueue.empty()) {
            _gpuQueue->commandBuffers.push(cmdBuff->_pendingQueue.front());
            cmdBuff->_pendingQueue.pop();

            _numDrawCalls += cmdBuff->_numDrawCalls;
            _numInstances += cmdBuff->_numInstances;
            _numTriangles += cmdBuff->_numTriangles;
        }
    }

    VkSubmitInfo submitInfo{VK_STRUCTURE_TYPE_SUBMIT_INFO};
    submitInfo.waitSemaphoreCount = _gpuQueue->nextWaitSemaphore ? 1 : 0;
    submitInfo.pWaitSemaphores = &_gpuQueue->nextWaitSemaphore;
    submitInfo.pWaitDstStageMask = &_gpuQueue->submitStageMask;
    submitInfo.commandBufferCount = _gpuQueue->commandBuffers.size();
    submitInfo.pCommandBuffers = &_gpuQueue->commandBuffers[0];
    submitInfo.signalSemaphoreCount = _gpuQueue->nextSignalSemaphore ? 1 : 0;
    submitInfo.pSignalSemaphores = &_gpuQueue->nextSignalSemaphore;

    VkFence vkFence = fence ? ((CCVKFence *)fence)->gpuFence()->vkFence : device->gpuFencePool()->alloc();
    VK_CHECK(vkQueueSubmit(_gpuQueue->vkQueue, 1, &submitInfo, vkFence));

    _gpuQueue->nextWaitSemaphore = _gpuQueue->nextSignalSemaphore;
    _gpuQueue->nextSignalSemaphore = device->gpuSemaphorePool()->alloc();
}

} // namespace gfx
} // namespace cc
