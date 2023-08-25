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

#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3Commands.h"
#include "GLES3DescriptorSet.h"
#include "GLES3DescriptorSetLayout.h"
#include "GLES3Device.h"
#include "GLES3Texture.h"
#include "gfx-gles3/GLES3GPUObjects.h"
#include "states/GLES3Sampler.h"

namespace cc {
namespace gfx {

GLES3DescriptorSet::GLES3DescriptorSet() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3DescriptorSet::~GLES3DescriptorSet() {
    destroy();
}

void GLES3DescriptorSet::doInit(const DescriptorSetInfo & /*info*/) {
    const GLES3GPUDescriptorSetLayout *gpuDescriptorSetLayout = static_cast<const GLES3DescriptorSetLayout *>(_layout)->gpuDescriptorSetLayout();
    const size_t descriptorCount = gpuDescriptorSetLayout->descriptorCount;
    const size_t bindingCount = gpuDescriptorSetLayout->bindings.size();

    _gpuDescriptorSet = ccnew GLES3GPUDescriptorSet;
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (size_t i = 0U, k = 0U; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = gpuDescriptorSetLayout->bindings[i];
        for (uint32_t j = 0; j < binding.count; j++, k++) {
            _gpuDescriptorSet->gpuDescriptors[k].type = binding.descriptorType;
        }
    }

    _gpuDescriptorSet->descriptorIndices = &gpuDescriptorSetLayout->descriptorIndices;
}

void GLES3DescriptorSet::doDestroy() {
    CC_SAFE_DELETE(_gpuDescriptorSet);
}

void GLES3DescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        auto &descriptors = _gpuDescriptorSet->gpuDescriptors;
        for (size_t i = 0; i < descriptors.size(); i++) {
            if (hasAnyFlags(descriptors[i].type, DESCRIPTOR_BUFFER_TYPE)) {
                if (_buffers[i].ptr) {
                    descriptors[i].gpuBuffer = static_cast<GLES3Buffer *>(_buffers[i].ptr)->gpuBuffer();
                }
            } else if (hasAnyFlags(descriptors[i].type, DESCRIPTOR_TEXTURE_TYPE)) {
                if (_samplers[i].ptr) {
                    descriptors[i].gpuSampler = static_cast<GLES3Sampler *>(_samplers[i].ptr)->gpuSampler();
                }

                if (_textures[i].ptr) {
                    _gpuDescriptorSet->gpuDescriptors[i].gpuTextureView = static_cast<GLES3Texture *>(_textures[i].ptr)->gpuTextureView();

                    // work around for sample depth stencil texture, delete when rdg support set sampler.
                    const FormatInfo &info = GFX_FORMAT_INFOS[toNumber(
                        _textures[i].ptr->getFormat())];
                    if (info.hasDepth || info.hasStencil) {
                        gfx::SamplerInfo samplerInfo = {};
                        samplerInfo.minFilter = gfx::Filter::POINT;
                        samplerInfo.magFilter = gfx::Filter::POINT;
                        descriptors[i].gpuSampler = static_cast<GLES3Sampler *>(Device::getInstance()->getSampler(
                                                                                    samplerInfo))
                                                        ->gpuSampler();
                    }
                }
            }
        }
        _isDirty = false;
    }
}

void GLES3DescriptorSet::forceUpdate() {
    _isDirty = true;
    update();
}

} // namespace gfx
} // namespace cc
