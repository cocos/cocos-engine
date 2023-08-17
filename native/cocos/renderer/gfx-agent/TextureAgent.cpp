/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "base/threading/MessageQueue.h"

#include "DeviceAgent.h"
#include "TextureAgent.h"
#include "gfx-agent/SwapchainAgent.h"
#include "gfx-base/GFXDef.h"

namespace cc {
namespace gfx {

TextureAgent::TextureAgent(Texture *actor)
: Agent<Texture>(actor) {
    _typedID = actor->getTypedID();
}

TextureAgent::~TextureAgent() {
    if (_ownTheActor) {
        ENQUEUE_MESSAGE_1(
            DeviceAgent::getInstance()->getMessageQueue(),
            TextureDestruct,
            actor, _actor,
            {
                CC_SAFE_DELETE(actor);
            });
    }
}

void TextureAgent::doInit(const TextureInfo &info) {
    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        TextureInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });
}

void TextureAgent::doInit(const TextureViewInfo &info) {
    TextureViewInfo actorInfo = info;
    actorInfo.texture = static_cast<TextureAgent *>(info.texture)->getActor();

    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        TextureViewInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });
}

void TextureAgent::doInit(const SwapchainTextureInfo &info) {
    // the actor is already initialized
}

void TextureAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        TextureDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void TextureAgent::doResize(uint32_t width, uint32_t height, uint32_t /*size*/) {
    ENQUEUE_MESSAGE_3(
        DeviceAgent::getInstance()->getMessageQueue(),
        TextureResize,
        actor, getActor(),
        width, width,
        height, height,
        {
            actor->resize(width, height);
        });
}

} // namespace gfx
} // namespace cc
