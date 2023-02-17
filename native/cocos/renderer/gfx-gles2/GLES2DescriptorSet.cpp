/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2Commands.h"
#include "GLES2DescriptorSet.h"
#include "GLES2DescriptorSetLayout.h"
#include "GLES2Texture.h"
#include "states/GLES2Sampler.h"

namespace cc {
namespace gfx {

GLES2DescriptorSet::GLES2DescriptorSet() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES2DescriptorSet::~GLES2DescriptorSet() {
    destroy();
}

void GLES2DescriptorSet::doInit(const DescriptorSetInfo & /*info*/) {
    const GLES2GPUDescriptorSetLayout *gpuDescriptorSetLayout = static_cast<const GLES2DescriptorSetLayout *>(_layout)->gpuDescriptorSetLayout();
    const size_t descriptorCount = gpuDescriptorSetLayout->descriptorCount;
    const size_t bindingCount = gpuDescriptorSetLayout->bindings.size();

    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    _gpuDescriptorSet = ccnew GLES2GPUDescriptorSet;
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (size_t i = 0U, k = 0U; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = gpuDescriptorSetLayout->bindings[i];
        for (uint32_t j = 0; j < binding.count; j++, k++) {
            _gpuDescriptorSet->gpuDescriptors[k].type = binding.descriptorType;
        }
    }

    _gpuDescriptorSet->descriptorIndices = &gpuDescriptorSetLayout->descriptorIndices;
}

void GLES2DescriptorSet::doDestroy() {
    CC_SAFE_DELETE(_gpuDescriptorSet);
}

void GLES2DescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        auto &descriptors = _gpuDescriptorSet->gpuDescriptors;
        for (size_t i = 0; i < descriptors.size(); i++) {
            if (hasAnyFlags(descriptors[i].type, DESCRIPTOR_BUFFER_TYPE)) {
                auto *buffer = static_cast<GLES2Buffer *>(_buffers[i].ptr);
                if (buffer) {
                    if (buffer->gpuBuffer()) {
                        descriptors[i].gpuBuffer = buffer->gpuBuffer();
                    } else if (buffer->gpuBufferView()) {
                        descriptors[i].gpuBufferView = buffer->gpuBufferView();
                    }
                }
            } else if (hasAnyFlags(descriptors[i].type, DESCRIPTOR_TEXTURE_TYPE)) {
                if (_textures[i].ptr) {
                    descriptors[i].gpuTexture = static_cast<GLES2Texture *>(_textures[i].ptr)->gpuTexture();
                }
                if (_samplers[i].ptr) {
                    descriptors[i].gpuSampler = static_cast<GLES2Sampler *>(_samplers[i].ptr)->gpuSampler();
                }
            }
        }
        _isDirty = false;
    }
}

void GLES2DescriptorSet::forceUpdate() {
    _isDirty = true;
    update();
}

} // namespace gfx
} // namespace cc
