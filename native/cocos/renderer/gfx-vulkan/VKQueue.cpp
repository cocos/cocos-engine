/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "VKStd.h"

#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "VKQueue.h"

namespace cc {
namespace gfx {

CCVKQueue::CCVKQueue() = default;

CCVKQueue::~CCVKQueue() {
    destroy();
}

void CCVKQueue::doInit(const QueueInfo & /*info*/) {
    _gpuQueue       = CC_NEW(CCVKGPUQueue);
    _gpuQueue->type = _type;
    cmdFuncCCVKGetDeviceQueue(CCVKDevice::getInstance(), _gpuQueue);
}

void CCVKQueue::doDestroy() {
    if (_gpuQueue) {
        _gpuQueue->vkQueue = VK_NULL_HANDLE;
        CC_DELETE(_gpuQueue);
        _gpuQueue = nullptr;
    }
}

void CCVKQueue::submit(CommandBuffer *const *cmdBuffs, uint count) {
    CCVKDevice *device = CCVKDevice::getInstance();
    _gpuQueue->commandBuffers.clear();

#if BARRIER_DEDUCTION_LEVEL >= BARRIER_DEDUCTION_LEVEL_BASIC
    device->gpuBarrierManager()->update(device->gpuTransportHub());
#endif
    device->gpuBufferHub()->flush(device->gpuTransportHub());

    if (!device->gpuTransportHub()->empty()) {
        _gpuQueue->commandBuffers.push(device->gpuTransportHub()->packageForFlight());
    }

    for (uint i = 0U; i < count; ++i) {
        auto *cmdBuff = static_cast<CCVKCommandBuffer *>(cmdBuffs[i]);
        if (!cmdBuff->_pendingQueue.empty()) {
            _gpuQueue->commandBuffers.push(cmdBuff->_pendingQueue.front());
            cmdBuff->_pendingQueue.pop();

            _numDrawCalls += cmdBuff->_numDrawCalls;
            _numInstances += cmdBuff->_numInstances;
            _numTriangles += cmdBuff->_numTriangles;
        }
    }

    VkSubmitInfo submitInfo{VK_STRUCTURE_TYPE_SUBMIT_INFO};
    submitInfo.waitSemaphoreCount   = _gpuQueue->nextWaitSemaphore ? 1 : 0;
    submitInfo.pWaitSemaphores      = &_gpuQueue->nextWaitSemaphore;
    submitInfo.pWaitDstStageMask    = &_gpuQueue->submitStageMask;
    submitInfo.commandBufferCount   = _gpuQueue->commandBuffers.size();
    submitInfo.pCommandBuffers      = &_gpuQueue->commandBuffers[0];
    submitInfo.signalSemaphoreCount = _gpuQueue->nextSignalSemaphore ? 1 : 0;
    submitInfo.pSignalSemaphores    = &_gpuQueue->nextSignalSemaphore;

    VkFence vkFence = device->gpuFencePool()->alloc();
    VK_CHECK(vkQueueSubmit(_gpuQueue->vkQueue, 1, &submitInfo, vkFence));

    _gpuQueue->nextWaitSemaphore   = _gpuQueue->nextSignalSemaphore;
    _gpuQueue->nextSignalSemaphore = device->gpuSemaphorePool()->alloc();
}

} // namespace gfx
} // namespace cc
