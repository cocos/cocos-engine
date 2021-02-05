/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "CoreStd.h"

#include "GFXDescriptorSet.h"
#include "GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

DescriptorSet::DescriptorSet(Device *device)
: GFXObject(ObjectType::DESCRIPTOR_SET), _device(device) {
}

DescriptorSet::~DescriptorSet() {
}

void DescriptorSet::bindBuffer(uint binding, Buffer *buffer, uint index) {
    const vector<uint> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    if (binding >= bindingIndices.size() || bindingIndices[binding] >= bindings.size()) return;

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    if (info.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
        const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
        if (_buffers[descriptorIndex + index] != buffer) {
            _buffers[descriptorIndex + index] = buffer;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not DESCRIPTOR_BUFFER_TYPE.");
    }
}

void DescriptorSet::bindTexture(uint binding, Texture *texture, uint index) {
    const vector<uint> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    if (binding >= bindingIndices.size() || bindingIndices[binding] >= bindings.size()) return;

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    if (info.descriptorType & DESCRIPTOR_TEXTURE_TYPE) {
        const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
        if (_textures[descriptorIndex + index] != texture) {
            _textures[descriptorIndex + index] = texture;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not DESCRIPTOR_TEXTURE_TYPE.");
    }
}

void DescriptorSet::bindSampler(uint binding, Sampler *sampler, uint index) {
    const vector<uint> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    if (binding >= bindingIndices.size() || bindingIndices[binding] >= bindings.size()) return;

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    if (info.descriptorType & DESCRIPTOR_TEXTURE_TYPE) {
        const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
        if (_samplers[descriptorIndex + index] != sampler) {
            _samplers[descriptorIndex + index] = sampler;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not DESCRIPTOR_TEXTURE_TYPE.");
    }
}

bool DescriptorSet::bindBufferJSB(uint binding, Buffer *buffer, uint index) {
    bindBuffer(binding, buffer, index);
    return _isDirty;
}

bool DescriptorSet::bindTextureJSB(uint binding, Texture *texture, uint index) {
    bindTexture(binding, texture, index);
    return _isDirty;
}

bool DescriptorSet::bindSamplerJSB(uint binding, Sampler *sampler, uint index) {
    bindSampler(binding, sampler, index);
    return _isDirty;
}

Buffer *DescriptorSet::getBuffer(uint binding, uint index) const {
    const vector<uint> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _buffers.size()) return nullptr;
    return _buffers[descriptorIndex];
}

Texture *DescriptorSet::getTexture(uint binding, uint index) const {
    const vector<uint> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _textures.size()) return nullptr;
    return _textures[descriptorIndex];
}

Sampler *DescriptorSet::getSampler(uint binding, uint index) const {
    const vector<uint> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _samplers.size()) return nullptr;
    return _samplers[descriptorIndex];
}

} // namespace gfx
} // namespace cc
