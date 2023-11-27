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

#include "base/Log.h"
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
    CC_ASSERT(!isInited());
    _inited = true;
    CC_ASSERT(info.layout && static_cast<const DescriptorSetLayoutValidator *>(info.layout)->isInited());

    /////////// execute ///////////

    DescriptorSetInfo actorInfo;
    actorInfo.layout = static_cast<const DescriptorSetLayoutValidator *>(info.layout)->getActor();

    _actor->initialize(actorInfo);
}

void DescriptorSetValidator::doDestroy() {
    // Destroy twice.
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

void DescriptorSetValidator::update() {
    CC_ASSERT(isInited());

    const auto descriptorCount = _textures.size();

    Texture *texture = nullptr;
    Sampler *sampler = nullptr;
    Format format = {};

    for (size_t i = 0; i < descriptorCount; ++i) {
        texture = _textures[i].ptr;
        sampler = _samplers[i].ptr;
        if (texture == nullptr || sampler == nullptr) continue;
        format = texture->getInfo().format;

        if (sampler->getInfo().magFilter == Filter::LINEAR ||
            sampler->getInfo().mipFilter == Filter::LINEAR ||
            sampler->getInfo().minFilter == Filter::LINEAR) {
            if (!hasFlag(DeviceValidator::getInstance()->getFormatFeatures(format), FormatFeature::LINEAR_FILTER)) {
                CC_LOG_WARNING("[WARNING]: Format doesn't support linear filter.");
            }
        }
    }

    // DescriptorSet can not be updated after bound to CommandBuffer.
    CC_ASSERT(_referenceStamp < DeviceValidator::getInstance()->currentFrame());

    /////////// execute ///////////

    if (!_isDirty) return;

    _actor->update();
    _isDirty = false;
}

void DescriptorSetValidator::forceUpdate() {
    _isDirty = true;
    _actor->forceUpdate();
    _isDirty = false;
}

void DescriptorSetValidator::updateReferenceStamp() {
    _referenceStamp = DeviceValidator::getInstance()->currentFrame();
}

void DescriptorSetValidator::bindBuffer(uint32_t binding, Buffer *buffer, uint32_t index, AccessFlags flags) {
    CC_ASSERT(isInited());
    auto *vBuffer = static_cast<BufferValidator *>(buffer);
    CC_ASSERT(buffer && vBuffer->isInited());
    CC_ASSERT(vBuffer->isValid() && "Buffer View Expired");

    const ccstd::vector<uint32_t> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    CC_ASSERT(binding < bindingIndices.size() && bindingIndices[binding] < bindings.size());

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    CC_ASSERT(hasAnyFlags(info.descriptorType, DESCRIPTOR_BUFFER_TYPE));

    if (hasAnyFlags(info.descriptorType, DESCRIPTOR_DYNAMIC_TYPE)) {
        // Should bind buffer views for dynamic descriptors.
        CC_ASSERT(buffer->isBufferView());
    }

    if (hasAnyFlags(info.descriptorType, DescriptorType::UNIFORM_BUFFER | DescriptorType::DYNAMIC_UNIFORM_BUFFER)) {
        CC_ASSERT(hasFlag(buffer->getUsage(), BufferUsageBit::UNIFORM));
    } else if (hasAnyFlags(info.descriptorType, DescriptorType::STORAGE_BUFFER | DescriptorType::DYNAMIC_STORAGE_BUFFER)) {
        CC_ASSERT(hasFlag(buffer->getUsage(), BufferUsageBit::STORAGE));
    }

    /////////// execute ///////////

    DescriptorSet::bindBuffer(binding, buffer, index, flags);

    _actor->bindBuffer(binding, vBuffer->getActor(), index, flags);
}

void DescriptorSetValidator::bindTexture(uint32_t binding, Texture *texture, uint32_t index, AccessFlags flags) {
    CC_ASSERT(isInited());
    CC_ASSERT(texture && static_cast<TextureValidator *>(texture)->isInited());

    const ccstd::vector<uint32_t> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    CC_ASSERT(binding < bindingIndices.size() && bindingIndices[binding] < bindings.size());

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    CC_ASSERT(hasAnyFlags(info.descriptorType, DESCRIPTOR_TEXTURE_TYPE));

    if (hasFlag(info.descriptorType, DescriptorType::INPUT_ATTACHMENT)) {
        CC_ASSERT(hasFlag(texture->getInfo().usage, TextureUsageBit::INPUT_ATTACHMENT));
    } else if (hasFlag(info.descriptorType, DescriptorType::STORAGE_IMAGE)) {
        CC_ASSERT(hasFlag(texture->getInfo().usage, TextureUsageBit::STORAGE));
    } else {
        CC_ASSERT(hasFlag(texture->getInfo().usage, TextureUsageBit::SAMPLED));
    }

    /////////// execute ///////////

    DescriptorSet::bindTexture(binding, texture, index, flags);

    _actor->bindTexture(binding, static_cast<TextureValidator *>(texture)->getActor(), index, flags);
}

void DescriptorSetValidator::bindSampler(uint32_t binding, Sampler *sampler, uint32_t index) {
    CC_ASSERT(isInited());

    const ccstd::vector<uint32_t> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    CC_ASSERT(binding < bindingIndices.size() && bindingIndices[binding] < bindings.size());

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    CC_ASSERT(hasAnyFlags(info.descriptorType, DESCRIPTOR_TEXTURE_TYPE));

    /////////// execute ///////////

    DescriptorSet::bindSampler(binding, sampler, index);

    _actor->bindSampler(binding, sampler, index);
}

} // namespace gfx
} // namespace cc
