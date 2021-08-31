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
#include "DescriptorSetAgent.h"
#include "DescriptorSetLayoutAgent.h"
#include "DeviceAgent.h"
#include "TextureAgent.h"

namespace cc {
namespace gfx {

DescriptorSetAgent::DescriptorSetAgent(DescriptorSet *actor)
: Agent<DescriptorSet>(actor) {
    _typedID = actor->getTypedID();
}

DescriptorSetAgent::~DescriptorSetAgent() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetDestruct,
        actor, _actor,
        {
            CC_SAFE_DELETE(actor);
        });
}

void DescriptorSetAgent::doInit(const DescriptorSetInfo &info) {
    DescriptorSetInfo actorInfo;
    actorInfo.layout = static_cast<DescriptorSetLayoutAgent *>(info.layout)->getActor();

    ENQUEUE_MESSAGE_2(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });
}

void DescriptorSetAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void DescriptorSetAgent::update() {
    // Avoid enqueueing unnecessary command
    if (!_isDirty) return;

    _isDirty = false;

    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetUpdate,
        actor, getActor(),
        {
            actor->update();
        });
}

void DescriptorSetAgent::bindBuffer(uint binding, Buffer *buffer, uint index) {
    DescriptorSet::bindBuffer(binding, buffer, index);

    ENQUEUE_MESSAGE_4(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetBindBuffer,
        actor, getActor(),
        binding, binding,
        buffer, static_cast<BufferAgent *>(buffer)->getActor(),
        index, index,
        {
            actor->bindBuffer(binding, buffer, index);
        });
}

void DescriptorSetAgent::bindTexture(uint binding, Texture *texture, uint index) {
    DescriptorSet::bindTexture(binding, texture, index);

    ENQUEUE_MESSAGE_4(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetBindTexture,
        actor, getActor(),
        binding, binding,
        texture, static_cast<TextureAgent *>(texture)->getActor(),
        index, index,
        {
            actor->bindTexture(binding, texture, index);
        });
}

void DescriptorSetAgent::bindSampler(uint binding, Sampler *sampler, uint index) {
    DescriptorSet::bindSampler(binding, sampler, index);

    ENQUEUE_MESSAGE_4(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetBindSampler,
        actor, getActor(),
        binding, binding,
        sampler, sampler,
        index, index,
        {
            actor->bindSampler(binding, sampler, index);
        });
}

} // namespace gfx
} // namespace cc
