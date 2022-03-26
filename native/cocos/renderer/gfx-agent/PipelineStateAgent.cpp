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
#include "base/threading/MessageQueue.h"

#include "DeviceAgent.h"
#include "PipelineLayoutAgent.h"
#include "PipelineStateAgent.h"
#include "RenderPassAgent.h"
#include "ShaderAgent.h"

namespace cc {
namespace gfx {

PipelineStateAgent::PipelineStateAgent(PipelineState *actor)
: Agent<PipelineState>(actor) {
    _typedID = actor->getTypedID();
}

PipelineStateAgent::~PipelineStateAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        PipelineStateDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void PipelineStateAgent::doInit(const PipelineStateInfo &info) {
    PipelineStateInfo actorInfo = info;
    actorInfo.shader            = static_cast<ShaderAgent *>(info.shader)->getActor();
    actorInfo.pipelineLayout    = static_cast<PipelineLayoutAgent *>(info.pipelineLayout)->getActor();
    if (info.renderPass) actorInfo.renderPass = static_cast<RenderPassAgent *>(info.renderPass)->getActor();

    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        PipelineStateInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });
}

void PipelineStateAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        PipelineStateDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
