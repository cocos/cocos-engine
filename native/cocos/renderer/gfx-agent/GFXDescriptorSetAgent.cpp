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

#include "GFXBufferAgent.h"
#include "GFXDescriptorSetAgent.h"
#include "GFXDescriptorSetLayoutAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXSamplerAgent.h"
#include "GFXTextureAgent.h"

namespace cc {
namespace gfx {

DescriptorSetAgent::~DescriptorSetAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool DescriptorSetAgent::initialize(const DescriptorSetInfo &info) {
    _layout = info.layout;
    uint descriptorCount = _layout->getDescriptorCount();
    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    DescriptorSetInfo actorInfo;
    actorInfo.layout = ((DescriptorSetLayoutAgent *)info.layout)->getActor();

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void DescriptorSetAgent::destroy() {
    // do remember to clear these or else it might not be properly updated when reused
    _buffers.clear();
    _textures.clear();
    _samplers.clear();

    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void DescriptorSetAgent::update() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetUpdate,
        actor, getActor(),
        {
            actor->update();
        });
}

void DescriptorSetAgent::bindBuffer(uint binding, Buffer *buffer, uint index) {
    DescriptorSet::bindBuffer(binding, buffer, index);

    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetBindBuffer,
        actor, getActor(),
        binding, binding,
        buffer, ((BufferAgent *)buffer)->getActor(),
        index, index,
        {
            actor->bindBuffer(binding, buffer, index);
        });
}

void DescriptorSetAgent::bindTexture(uint binding, Texture *texture, uint index) {
    DescriptorSet::bindTexture(binding, texture, index);

    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetBindTexture,
        actor, getActor(),
        binding, binding,
        texture, ((TextureAgent *)texture)->getActor(),
        index, index,
        {
            actor->bindTexture(binding, texture, index);
        });
}

void DescriptorSetAgent::bindSampler(uint binding, Sampler *sampler, uint index) {
    DescriptorSet::bindSampler(binding, sampler, index);

    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetBindSampler,
        actor, getActor(),
        binding, binding,
        sampler, ((SamplerAgent *)sampler)->getActor(),
        index, index,
        {
            actor->bindSampler(binding, sampler, index);
        });
}

} // namespace gfx
} // namespace cc
