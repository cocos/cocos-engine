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
#include "base/threading/MessageQueue.h"

#include "BufferAgent.h"
#include "DeviceAgent.h"
#include "InputAssemblerAgent.h"

namespace cc {
namespace gfx {

InputAssemblerAgent::InputAssemblerAgent(InputAssembler *actor)
: Agent<InputAssembler>(actor) {
    _typedID = actor->getTypedID();
}

InputAssemblerAgent::~InputAssemblerAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        InputAssemblerDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void InputAssemblerAgent::doInit(const InputAssemblerInfo &info) {
    InputAssemblerInfo actorInfo = info;
    for (auto &vertexBuffer : actorInfo.vertexBuffers) {
        vertexBuffer = static_cast<BufferAgent *>(vertexBuffer)->getActor();
    }
    if (actorInfo.indexBuffer) {
        actorInfo.indexBuffer = static_cast<BufferAgent *>(actorInfo.indexBuffer)->getActor();
    }
    if (actorInfo.indirectBuffer) {
        actorInfo.indirectBuffer = static_cast<BufferAgent *>(actorInfo.indirectBuffer)->getActor();
    }

    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        InputAssemblerInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });
}

void InputAssemblerAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        InputAssemblerDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
