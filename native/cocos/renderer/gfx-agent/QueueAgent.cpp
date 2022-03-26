/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
#include "base/job-system/JobSystem.h"
#include "base/threading/MessageQueue.h"

#include "CommandBufferAgent.h"
#include "DeviceAgent.h"
#include "QueueAgent.h"

namespace cc {
namespace gfx {

QueueAgent::QueueAgent(Queue *actor)
: Agent<Queue>(actor) {
    _typedID = actor->getTypedID();
}

QueueAgent::~QueueAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        QueueDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void QueueAgent::doInit(const QueueInfo &info) {
    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        QueueInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });
}

void QueueAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        QueueDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void QueueAgent::submit(CommandBuffer *const *cmdBuffs, uint32_t count) {
    if (!count) return;

    MessageQueue *msgQ          = DeviceAgent::getInstance()->getMessageQueue();
    auto **       actorCmdBuffs = msgQ->allocate<CommandBuffer *>(count);
    for (uint32_t i = 0U; i < count; ++i) {
        actorCmdBuffs[i] = static_cast<CommandBufferAgent *>(cmdBuffs[i])->getActor();
    }

    ENQUEUE_MESSAGE_3(
        DeviceAgent::getInstance()->getMessageQueue(),
        QueueSubmit,
        actor, getActor(),
        actorCmdBuffs, actorCmdBuffs,
        count, count,
        {
            //auto startTime = std::chrono::steady_clock::now();

            //auto endTime = std::chrono::steady_clock::now();
            //float dt = std::chrono::duration_cast<std::chrono::nanoseconds>(endTime - startTime).count() / 1e6;
            //static float timeAcc = 0.f;
            //if (!timeAcc) timeAcc = dt;
            //else timeAcc = timeAcc * 0.95f + dt * 0.05f;
            //CC_LOG_INFO("---------- %.2fms", timeAcc);

            //CC_LOG_INFO("======== one round ========");

            actor->submit(actorCmdBuffs, count);
        });
}

} // namespace gfx
} // namespace cc
