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

#include "BufferValidator.h"
#include "DescriptorSetLayoutValidator.h"
#include "DescriptorSetValidator.h"
#include "DeviceValidator.h"
#include "TextureValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

DescriptorSetValidator::DescriptorSetValidator(DescriptorSet *actor)
: Agent<DescriptorSet>(actor) {
    _typedID = actor->getTypedID();
}

DescriptorSetValidator::~DescriptorSetValidator() {
    DeviceResourceTracker<DescriptorSet>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void DescriptorSetValidator::doInit(const DescriptorSetInfo &info) {
    CCASSERT(info.layout, "Invalid set layout");

    /////////// execute ///////////

    DescriptorSetInfo actorInfo;
    actorInfo.layout = static_cast<DescriptorSetLayoutValidator *>(info.layout)->getActor();

    _actor->initialize(actorInfo);
}

void DescriptorSetValidator::doDestroy() {
    _actor->destroy();
}

void DescriptorSetValidator::update() {
    if (!_isDirty) return;

    _isDirty = false;
    _actor->update();
}

void DescriptorSetValidator::bindBuffer(uint binding, Buffer *buffer, uint index) {
    const vector<uint> &                  bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings       = _layout->getBindings();
    CCASSERT(binding < bindingIndices.size() && bindingIndices[binding] < bindings.size(), "Illegal binding");

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    if (hasAnyFlags(info.descriptorType, DESCRIPTOR_DYNAMIC_TYPE)) {
        CCASSERT(buffer->isBufferView(), "Should bind buffer views for dynamic descriptors");
    }
    CCASSERT(hasAnyFlags(info.descriptorType, DESCRIPTOR_BUFFER_TYPE), "Setting binding is not DESCRIPTOR_BUFFER_TYPE");

    /////////// execute ///////////

    DescriptorSet::bindBuffer(binding, buffer, index);

    _actor->bindBuffer(binding, static_cast<BufferValidator *>(buffer)->getActor(), index);
}

void DescriptorSetValidator::bindTexture(uint binding, Texture *texture, uint index) {
    const vector<uint> &                  bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings       = _layout->getBindings();
    CCASSERT(binding < bindingIndices.size() && bindingIndices[binding] < bindings.size(), "Illegal binding");

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    CCASSERT(hasAnyFlags(info.descriptorType, DESCRIPTOR_TEXTURE_TYPE), "Setting binding is not DESCRIPTOR_TEXTURE_TYPE");

    /////////// execute ///////////

    DescriptorSet::bindTexture(binding, texture, index);

    _actor->bindTexture(binding, static_cast<TextureValidator *>(texture)->getActor(), index);
}

void DescriptorSetValidator::bindSampler(uint binding, Sampler *sampler, uint index) {
    const vector<uint> &                  bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings       = _layout->getBindings();
    CCASSERT(binding < bindingIndices.size() && bindingIndices[binding] < bindings.size(), "Illegal binding");

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    CCASSERT(hasAnyFlags(info.descriptorType, DESCRIPTOR_TEXTURE_TYPE), "Setting binding is not DESCRIPTOR_TEXTURE_TYPE");

    /////////// execute ///////////

    DescriptorSet::bindSampler(binding, sampler, index);

    _actor->bindSampler(binding, sampler, index);
}

} // namespace gfx
} // namespace cc
