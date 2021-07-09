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

#include "base/CoreStd.h"
#include "base/threading/ThreadSafeLinearAllocator.h"
#include "base/threading/MessageQueue.h"

#include "BufferAgent.h"
#include "DeviceAgent.h"

namespace cc {
namespace gfx {

BufferAgent::BufferAgent(Buffer *actor)
: Agent<Buffer>(actor) {
    _typedID = generateObjectID<decltype(this)>();
}

BufferAgent::~BufferAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        BufferDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void BufferAgent::doInit(const BufferInfo &info) {
    uint size = getSize();
    if(size > MessageQueue::getChunckSize() / 2) {
        for (auto &allocator : _allocator) {
            allocator = CC_NEW(ThreadSafeLinearAllocator(size));
        }
    }
    
    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        BufferInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });
}

void BufferAgent::doInit(const BufferViewInfo &info) {
    BufferViewInfo actorInfo = info;
    actorInfo.buffer         = static_cast<BufferAgent *>(info.buffer)->getActor();
    
    uint size = getSize();
    if(size > MessageQueue::getChunckSize() / 2) {
        for (auto &allocator : _allocator) {
            allocator = CC_NEW(ThreadSafeLinearAllocator(size));
        }
    }

    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        BufferViewInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });
}

void BufferAgent::doResize(uint size, uint /*count*/) {
    uint originalSize = getSize();
    if(size > originalSize && size > MessageQueue::getChunckSize() / 2) {
        for (auto &allocator : _allocator) {
            CC_SAFE_DELETE(allocator);
        }
        
        for (auto &allocator : _allocator) {
            allocator = CC_NEW(ThreadSafeLinearAllocator(size));
        }
    }
    
    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        BufferResize,
        actor, getActor(),
        size, size,
        {
            actor->resize(size);
        });
}

void BufferAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        BufferDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
    
    for (auto &allocator : _allocator) {
        if(allocator) {
            ENQUEUE_MESSAGE_1(
                DeviceAgent::getInstance()->getMessageQueue(),
                BufferDestroy,
                allocator, allocator,
                {
                    CC_DELETE(allocator);
                });
        }
    }
}

void BufferAgent::update(const void *buffer, uint size) {
    update(buffer, size, DeviceAgent::getInstance()->getMessageQueue());
}

void BufferAgent::update(const void *buffer, uint size, MessageQueue* dstMsgQ) {
    ThreadSafeLinearAllocator *allocator = nullptr;
    uint8_t *actorBuffer = nullptr;
    
    uint frameIndex = DeviceAgent::getInstance()->getCurrentIndex();
                                                                                
    bool useMsgQ = size <= MessageQueue::getChunckSize() / 2;                   // reserve half for message itself
    if (useMsgQ) {                                                              // buffer will be allocated by message queue if it could be put in,
        auto *msgQ = DeviceAgent::getInstance()->getMessageQueue();             // memory fragment can be avoid by mem pool inside
        actorBuffer = msgQ->allocate<uint8_t>(size);
        memcpy(actorBuffer, buffer, size);
    } else {                                                                    // otherwise using threadSafeAllocator.
        if(hasFlag(getMemUsage(), MemoryUsageBit::HOST)) {                      // there's a staging buffer if frequently update
            allocator = _allocator[frameIndex];
            allocator->recycle();
        } else {                                                                // new and delete buffer if barely udpate
            allocator = CC_NEW(ThreadSafeLinearAllocator(size));
        }
        actorBuffer = allocator->allocate<uint8_t>(size);
        memcpy(actorBuffer, buffer, size);
    }

    ENQUEUE_MESSAGE_4(
        dstMsgQ,
        BufferUpdate,
        actor, getActor(),
        buffer, actorBuffer,
        size, size,
        allocator, allocator,
        {
            actor->update(buffer, size);
        
            if(!hasFlag(actor->getMemUsage(), MemoryUsageBit::HOST)) {
                CC_SAFE_DELETE(allocator);
            }
        });
}

} // namespace gfx
} // namespace cc
