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

#include "DescriptorSetLayoutAgent.h"
#include "DeviceAgent.h"
#include "PipelineLayoutAgent.h"

namespace cc {
namespace gfx {

PipelineLayoutAgent::PipelineLayoutAgent(PipelineLayout *actor)
: Agent<PipelineLayout>(actor) {
    _typedID = actor->getTypedID();
}

PipelineLayoutAgent::~PipelineLayoutAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        PipelineLayoutDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void PipelineLayoutAgent::doInit(const PipelineLayoutInfo &info) {
    PipelineLayoutInfo actorInfo;
    actorInfo.setLayouts.resize(info.setLayouts.size());
    for (uint32_t i = 0U; i < info.setLayouts.size(); i++) {
        actorInfo.setLayouts[i] = static_cast<DescriptorSetLayoutAgent *>(info.setLayouts[i])->getActor();
    }

    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        PipelineLayoutInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });
}

void PipelineLayoutAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        PipelineLayoutDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
