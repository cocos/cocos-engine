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
    actorInfo.layout = static_cast<const DescriptorSetLayoutAgent *>(info.layout)->getActor();

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

void DescriptorSetAgent::forceUpdate() {
    _isDirty = false;
    ENQUEUE_MESSAGE_1(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetForceUpdate,
        actor, getActor(),
        {
            actor->forceUpdate();
        });
}

void DescriptorSetAgent::bindBuffer(uint32_t binding, Buffer *buffer, uint32_t index, AccessFlags flags) {
    DescriptorSet::bindBuffer(binding, buffer, index, flags);

    ENQUEUE_MESSAGE_5(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetBindBuffer,
        actor, getActor(),
        binding, binding,
        buffer, static_cast<BufferAgent *>(buffer)->getActor(),
        index, index,
        flags, flags,
        {
            actor->bindBuffer(binding, buffer, index, flags);
        });
}

void DescriptorSetAgent::bindTexture(uint32_t binding, Texture *texture, uint32_t index, AccessFlags flags) {
    DescriptorSet::bindTexture(binding, texture, index, flags);

    ENQUEUE_MESSAGE_5(
        DeviceAgent::getInstance()->getMessageQueue(),
        DescriptorSetBindTexture,
        actor, getActor(),
        binding, binding,
        texture, static_cast<TextureAgent *>(texture)->getActor(),
        index, index,
        flags, flags,
        {
            actor->bindTexture(binding, texture, index, flags);
        });
}

void DescriptorSetAgent::bindSampler(uint32_t binding, Sampler *sampler, uint32_t index) {
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
