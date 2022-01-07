/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#import "MTLStd.h"

#import "MTLQueue.h"
#import "MTLDevice.h"
#import "MTLCommandBuffer.h"
#import "MTLGPUObjects.h"
#import "MTLFramebuffer.h"
#import "MTLSwapchain.h"
namespace cc {
namespace gfx {

CCMTLQueue::CCMTLQueue()
: Queue() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLQueue::~CCMTLQueue() {
    destroy();
}

void CCMTLQueue::doInit(const QueueInfo &info) {
    _gpuQueueObj = CC_NEW(CCMTLGPUQueueObject);
    auto device = static_cast<id<MTLDevice>>(CCMTLDevice::getInstance()->getMTLDevice());
    _gpuQueueObj->mtlCommandQueue = [device newCommandQueue];
}

void CCMTLQueue::doDestroy() {
    if(_gpuQueueObj) {
        id<MTLCommandQueue> mtlCmdQueue = _gpuQueueObj->mtlCommandQueue;
        _gpuQueueObj->mtlCommandQueue = nil;
        
        auto destroyFunc = [mtlCmdQueue]() {
            if(mtlCmdQueue) {
                [mtlCmdQueue release];
            }
        };
        CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
        
        CC_SAFE_DELETE(_gpuQueueObj);
    }
}

void CCMTLQueue::submit(CommandBuffer *const *cmdBuffs, uint count) {
    for (uint i = 0u; i < count; ++i) {
        CCMTLCommandBuffer *cmdBuffer = static_cast<CCMTLCommandBuffer*>(cmdBuffs[i]);
        _gpuQueueObj->numDrawCalls += cmdBuffer->getNumDrawCalls();
        _gpuQueueObj->numInstances += cmdBuffer->getNumInstances();
        _gpuQueueObj->numTriangles += cmdBuffer->getNumTris();
        id<MTLCommandBuffer> mtlCmdBuffer = cmdBuffer->gpuCommandBufferObj()->mtlCommandBuffer;
        [mtlCmdBuffer commit];
        cmdBuffer->reset();
    }
}

} // namespace gfx
} // namespace cc
