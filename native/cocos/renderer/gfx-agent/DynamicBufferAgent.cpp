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

#include "DynamicBufferAgent.h"
#include "BufferAgent.h"
#include "DeviceAgent.h"

namespace cc {
namespace gfx {

DynamicBufferAgent::DynamicBufferAgent(DynamicBuffer *actor)
: Agent<DynamicBuffer>(actor) {
    _typedID = actor->getTypedID();
}

DynamicBufferAgent::~DynamicBufferAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        DynamicBufferDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void DynamicBufferAgent::doInit(const DynamicBufferInfo &info) {
    DynamicBufferInfo tempInfo = info;
    tempInfo.allocHost = false;

    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        DynamicBufferInit,
        actor, _actor,
        info, tempInfo,
        {
            actor->initialize(info);
        });
}

void DynamicBufferAgent::doSwapBuffer() {
    _currentFrame = (_currentFrame + 1) % _frameNum;

    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        DynamicBufferDestruct,
        actor, _actor,
        {
            actor->swapBuffer();
        });
}

void DynamicBufferAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        DynamicBufferDestruct,
        actor, _actor,
        {
            actor->destroy();
        });
}

void DynamicBufferAgent::flush(const uint8_t *data, uint32_t size) {
    ENQUEUE_MESSAGE_3(
        DeviceAgent::getInstance()->getMessageQueue(),
        DynamicBufferDestruct,
        actor, _actor,
        data, data,
        size, size,
        {
            actor->flush(data, size);
        });
}

uint32_t DynamicBufferAgent::getInflightNum() const {
    return DeviceAgent::MAX_FRAME_INDEX;
}

uint32_t DynamicBufferAgent::getCurrentIndex() const {
    return _currentFrame;
}

} // namespace gfx
} // namespace cc
