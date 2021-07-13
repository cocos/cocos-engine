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
#include "base/memory/Memory.h"

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
    if (size > STAGING_BUFFER_THRESHOLD && hasFlag(_memUsage, MemoryUsageBit::HOST)) {
        for (size_t i = 0; i < DeviceAgent::MAX_FRAME_INDEX; ++i) {
            _stagingBuffers.push_back(reinterpret_cast<uint8_t *>(malloc(size)));
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

    // buffer views don't need staging buffers

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
    auto *mq = DeviceAgent::getInstance()->getMessageQueue();

    if (!_stagingBuffers.empty()) {
        auto *oldStagingBuffers = mq->allocate<uint8_t *>(STAGING_BUFFER_THRESHOLD);
        for (size_t i = 0; i < DeviceAgent::MAX_FRAME_INDEX; ++i) {
            oldStagingBuffers[i] = _stagingBuffers[i];
        }
        _stagingBuffers.clear();
        ENQUEUE_MESSAGE_1(
            mq, BufferFreeStagingBuffer,
            stagingBuffers, oldStagingBuffers,
            {
                for (size_t i = 0; i < DeviceAgent::MAX_FRAME_INDEX; ++i) {
                    free(stagingBuffers[i]);
                }
            });
    }

    if (size > STAGING_BUFFER_THRESHOLD && hasFlag(_memUsage, MemoryUsageBit::HOST)) {
        for (size_t i = 0; i < DeviceAgent::MAX_FRAME_INDEX; ++i) {
            _stagingBuffers.push_back(reinterpret_cast<uint8_t *>(malloc(size)));
        }
    }

    ENQUEUE_MESSAGE_2(
        mq, BufferResize,
        actor, getActor(),
        size, size,
        {
            actor->resize(size);
        });
}

void BufferAgent::doDestroy() {
    auto *    mq = DeviceAgent::getInstance()->getMessageQueue();
    uint8_t **oldStagingBuffers{nullptr};
    if (!_stagingBuffers.empty()) {
        oldStagingBuffers = mq->allocate<uint8_t *>(DeviceAgent::MAX_FRAME_INDEX);
        for (size_t i = 0; i < DeviceAgent::MAX_FRAME_INDEX; ++i) {
            oldStagingBuffers[i] = _stagingBuffers[i];
        }
        _stagingBuffers.clear();
    }

    ENQUEUE_MESSAGE_2(
        mq, BufferDestroy,
        actor, getActor(),
        stagingBuffers, oldStagingBuffers,
        {
            actor->destroy();
            if (stagingBuffers) {
                for (size_t i = 0; i < DeviceAgent::MAX_FRAME_INDEX; ++i) {
                    free(stagingBuffers[i]);
                }
            }
        });
}

void BufferAgent::update(const void *buffer, uint size) {
    update(buffer, size, DeviceAgent::getInstance()->getMessageQueue());
}

void BufferAgent::update(const void *buffer, uint size, MessageQueue *mq) {
    uint8_t *actorBuffer{nullptr};
    bool     needToFreeActorBuffer{false};

    uint frameIndex = DeviceAgent::getInstance()->getCurrentIndex();

    if (!_stagingBuffers.empty()) { // for frequent updates on big buffers
        actorBuffer = _stagingBuffers[frameIndex];
    } else if (size > STAGING_BUFFER_THRESHOLD) { // less frequent updates on big buffers
        actorBuffer           = reinterpret_cast<uint8_t *>(malloc(size));
        needToFreeActorBuffer = true;
    } else { // for small enough buffers
        actorBuffer = mq->allocate<uint8_t>(size);
    }
    memcpy(actorBuffer, buffer, size);

    ENQUEUE_MESSAGE_4(
        mq, BufferUpdate,
        actor, getActor(),
        buffer, actorBuffer,
        size, size,
        needToFreeActorBuffer, needToFreeActorBuffer,
        {
            actor->update(buffer, size);
            if (needToFreeActorBuffer) free(buffer);
        });
}

} // namespace gfx
} // namespace cc
