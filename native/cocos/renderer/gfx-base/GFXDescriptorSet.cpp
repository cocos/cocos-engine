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

#include "base/CoreStd.h"

#include "GFXDescriptorSet.h"
#include "GFXDescriptorSetLayout.h"
#include "GFXObject.h"

namespace cc {
namespace gfx {

DescriptorSet::DescriptorSet()
: GFXObject(ObjectType::DESCRIPTOR_SET) {
}

DescriptorSet::~DescriptorSet() = default;

void DescriptorSet::initialize(const DescriptorSetInfo &info) {
    CCASSERT(info.layout, "Invalid set layout");

    _layout                  = info.layout;
    uint32_t descriptorCount = _layout->getDescriptorCount();
    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    doInit(info);
}

void DescriptorSet::destroy() {
    doDestroy();

    _layout = nullptr;
    // have to clear these or else it might not be properly updated when reused
    _buffers.clear();
    _textures.clear();
    _samplers.clear();
}

void DescriptorSet::bindBuffer(uint32_t binding, Buffer *buffer, uint32_t index) {
    const uint32_t descriptorIndex = _layout->getDescriptorIndices()[binding];
    if (_buffers[descriptorIndex + index] != buffer) {
        _buffers[descriptorIndex + index] = buffer;
        _isDirty                          = true;
    }
}

void DescriptorSet::bindTexture(uint32_t binding, Texture *texture, uint32_t index) {
    const uint32_t descriptorIndex = _layout->getDescriptorIndices()[binding];
    if (_textures[descriptorIndex + index] != texture) {
        _textures[descriptorIndex + index] = texture;
        _isDirty                           = true;
    }
}

void DescriptorSet::bindSampler(uint32_t binding, Sampler *sampler, uint32_t index) {
    const uint32_t descriptorIndex = _layout->getDescriptorIndices()[binding];
    if (_samplers[descriptorIndex + index] != sampler) {
        _samplers[descriptorIndex + index] = sampler;
        _isDirty                           = true;
    }
}

bool DescriptorSet::bindBufferJSB(uint32_t binding, Buffer *buffer, uint32_t index) {
    bindBuffer(binding, buffer, index);
    return _isDirty;
}

bool DescriptorSet::bindTextureJSB(uint32_t binding, Texture *texture, uint32_t index) {
    bindTexture(binding, texture, index);
    return _isDirty;
}

bool DescriptorSet::bindSamplerJSB(uint32_t binding, Sampler *sampler, uint32_t index) {
    bindSampler(binding, sampler, index);
    return _isDirty;
}

Buffer *DescriptorSet::getBuffer(uint32_t binding, uint32_t index) const {
    const vector<uint32_t> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint32_t descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _buffers.size()) return nullptr;
    return _buffers[descriptorIndex];
}

Texture *DescriptorSet::getTexture(uint32_t binding, uint32_t index) const {
    const vector<uint32_t> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint32_t descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _textures.size()) return nullptr;
    return _textures[descriptorIndex];
}

Sampler *DescriptorSet::getSampler(uint32_t binding, uint32_t index) const {
    const vector<uint32_t> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint32_t descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _samplers.size()) return nullptr;
    return _samplers[descriptorIndex];
}

} // namespace gfx
} // namespace cc
