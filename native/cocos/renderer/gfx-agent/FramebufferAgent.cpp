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

#include "DeviceAgent.h"
#include "FramebufferAgent.h"
#include "RenderPassAgent.h"
#include "TextureAgent.h"

namespace cc {
namespace gfx {

FramebufferAgent::FramebufferAgent(Framebuffer *actor)
: Agent<Framebuffer>(actor) {
    _typedID = actor->getTypedID();
}

FramebufferAgent::~FramebufferAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        FramebufferDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void FramebufferAgent::doInit(const FramebufferInfo &info) {
    FramebufferInfo actorInfo = info;
    for (uint32_t i = 0U; i < info.colorTextures.size(); ++i) {
        if (info.colorTextures[i]) {
            actorInfo.colorTextures[i] = static_cast<TextureAgent *>(info.colorTextures[i])->getActor();
        }
    }
    if (info.depthStencilTexture) {
        actorInfo.depthStencilTexture = static_cast<TextureAgent *>(info.depthStencilTexture)->getActor();
    }
    actorInfo.renderPass = static_cast<RenderPassAgent *>(info.renderPass)->getActor();

    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        FramebufferInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });
}

void FramebufferAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        FramebufferDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
