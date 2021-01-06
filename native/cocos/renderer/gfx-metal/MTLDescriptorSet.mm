/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLDescriptorSet.h"
#include "MTLDescriptorSetLayout.h"
#include "MTLGPUObjects.h"
#include "MTLSampler.h"
#include "MTLTexture.h"

namespace cc {
namespace gfx {
CCMTLDescriptorSet::CCMTLDescriptorSet(Device *device) : DescriptorSet(device) {
}

bool CCMTLDescriptorSet::initialize(const DescriptorSetInfo &info) {
    _layout = info.layout;

    const auto gpuDescriptorSetLayout = static_cast<CCMTLDescriptorSetLayout *>(_layout)->gpuDescriptorSetLayout();
    const auto descriptorCount = gpuDescriptorSetLayout->descriptorCount;
    const auto bindingCount = gpuDescriptorSetLayout->bindings.size();

    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    _gpuDescriptorSet = CC_NEW(CCMTLGPUDescriptorSet);
    _gpuDescriptorSet->descriptorIndices = &gpuDescriptorSetLayout->descriptorIndices;
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (auto i = 0, k = 0; i < bindingCount; i++) {
        const auto &binding = gpuDescriptorSetLayout->bindings[i];
        for (auto j = 0; j < binding.count; j++, k++) {
            _gpuDescriptorSet->gpuDescriptors[k].type = binding.descriptorType;
        }
    }

    return true;
}
void CCMTLDescriptorSet::destroy() {
    _layout = nullptr;
    CC_SAFE_DELETE(_gpuDescriptorSet);
    // do remember to clear these or else it might not be properly updated when reused
    _buffers.clear();
    _textures.clear();
    _samplers.clear();
}

void CCMTLDescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        const auto &descriptors = _gpuDescriptorSet->gpuDescriptors;
        for (size_t i = 0; i < descriptors.size(); i++) {
            if (static_cast<uint>(descriptors[i].type) & DESCRIPTOR_BUFFER_TYPE) {
                if (_buffers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].buffer = static_cast<CCMTLBuffer *>(_buffers[i]);
                }
            } else if (static_cast<uint>(descriptors[i].type) & DESCRIPTOR_SAMPLER_TYPE) {
                if (_textures[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].texture = static_cast<CCMTLTexture *>(_textures[i]);
                }
                if (_samplers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].sampler = static_cast<CCMTLSampler *>(_samplers[i]);
                }
            }
        }
        _isDirty = false;
    }
}
}
}
