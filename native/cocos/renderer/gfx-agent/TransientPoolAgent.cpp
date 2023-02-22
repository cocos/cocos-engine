/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "gfx-agent/TransientPoolAgent.h"
#include "gfx-agent/BufferAgent.h"
#include "gfx-agent/DeviceAgent.h"
#include "gfx-agent/CommandBufferAgent.h"
#include "gfx-agent/TextureAgent.h"

#define AGENT_TEST

#ifdef AGENT_TEST
#define FLUSH_MESSAGE DeviceAgent::getInstance()->getMessageQueue()->kickAndWait();
#else
#define FLUSH_MESSAGE
#endif

namespace cc {
namespace gfx {

TransientPoolAgent::TransientPoolAgent(TransientPool *actor) : Agent<TransientPool>(actor) {
    _typedID = generateObjectID<decltype(this)>();
}

TransientPoolAgent::~TransientPoolAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        BufferDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void TransientPoolAgent::doInit(const TransientPoolInfo &info) {
    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        TransientPoolAgentInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });
}

void TransientPoolAgent::doBeginFrame() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        TransientPoolAgentdoBeginFrame,
        actor, getActor(),
        {
            actor->beginFrame();
        });
}

void TransientPoolAgent::doEndFrame() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        TransientPoolAgentEndFrame,
        actor, getActor(),
        {
            actor->doEndFrame();
        });
}

void TransientPoolAgent::doInitBuffer(Buffer *buffer, PassScope scope, AccessFlags accessFlag) {
    auto *actorBuffer = static_cast<BufferAgent *>(buffer)->getActor();
    ENQUEUE_MESSAGE_4(
        DeviceAgent::getInstance()->getMessageQueue(),
        TransientPoolAgentInitBuffer,
        actor, getActor(),
        buffer, actorBuffer,
        scope, scope,
        accessFlag, accessFlag,
        {
            actor->doInitBuffer(buffer, scope, accessFlag);
        });
}

void TransientPoolAgent::doResetBuffer(Buffer *buffer, PassScope scope, AccessFlags accessFlag) {
    auto *actorBuffer = static_cast<BufferAgent *>(buffer)->getActor();
    ENQUEUE_MESSAGE_4(
        DeviceAgent::getInstance()->getMessageQueue(),
        TransientPoolAgentResetBuffer,
        actor, getActor(),
        buffer, actorBuffer,
        scope, scope,
        accessFlag, accessFlag,
        {
            actor->doResetBuffer(buffer, scope, accessFlag);
        });
}

void TransientPoolAgent::doInitTexture(Texture *texture, PassScope scope, AccessFlags accessFlag) {
    auto *actorTexture = static_cast<TextureAgent *>(texture)->getActor();
    ENQUEUE_MESSAGE_4(
        DeviceAgent::getInstance()->getMessageQueue(),
        TransientPoolAgentInitTexture,
        actor, getActor(),
        texture, actorTexture,
        scope, scope,
        accessFlag, accessFlag,
        {
            actor->doInitTexture(texture, scope, accessFlag);
        });
}

void TransientPoolAgent::doResetTexture(Texture *texture, PassScope scope, AccessFlags accessFlag) {
    auto *actorTexture = static_cast<TextureAgent *>(texture)->getActor();
    ENQUEUE_MESSAGE_4(
        DeviceAgent::getInstance()->getMessageQueue(),
        TransientPoolAgentResetTexture,
        actor, getActor(),
        texture, actorTexture,
        scope, scope,
        accessFlag, accessFlag,
        {
            actor->doResetTexture(texture, scope, accessFlag);
        });
}

void TransientPoolAgent::barrier(PassScope scope, CommandBuffer *cmdBuffer) {
    auto *actorCmd = static_cast<CommandBufferAgent*>(cmdBuffer)->getActor();
    ENQUEUE_MESSAGE_3(
        DeviceAgent::getInstance()->getMessageQueue(),
        TransientPoolAgentFrontBarrier,
        actor, getActor(),
        scope, scope,
        cmdBuffer, actorCmd,
        {
            actor->barrier(scope, cmdBuffer);
        });
}

} // namespace gfx
} // namespace cc
