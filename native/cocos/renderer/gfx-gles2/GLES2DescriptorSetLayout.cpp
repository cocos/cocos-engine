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
#include "GLES2Std.h"

#include "GLES2Commands.h"
#include "GLES2DescriptorSetLayout.h"

namespace cc {
namespace gfx {

GLES2DescriptorSetLayout::GLES2DescriptorSetLayout(Device *device)
: DescriptorSetLayout(device) {
}

GLES2DescriptorSetLayout::~GLES2DescriptorSetLayout() {
}

bool GLES2DescriptorSetLayout::initialize(const DescriptorSetLayoutInfo &info) {

    _bindings = info.bindings;
    size_t bindingCount = _bindings.size();
    _descriptorCount = 0u;

    if (bindingCount) {
        uint maxBinding = 0u;
        vector<uint> flattenedIndices(bindingCount);
        for (uint i = 0u; i < bindingCount; i++) {
            const DescriptorSetLayoutBinding &binding = _bindings[i];
            flattenedIndices[i] = _descriptorCount;
            _descriptorCount += binding.count;
            if (binding.binding > maxBinding) maxBinding = binding.binding;
        }

        _bindingIndices.resize(maxBinding + 1, GFX_INVALID_BINDING);
        _descriptorIndices.resize(maxBinding + 1, GFX_INVALID_BINDING);
        for (uint i = 0u; i <  bindingCount; i++) {
            const DescriptorSetLayoutBinding &binding = _bindings[i];
            _bindingIndices[binding.binding] = i;
            _descriptorIndices[binding.binding] = flattenedIndices[i];
        }
    }

    _gpuDescriptorSetLayout = CC_NEW(GLES2GPUDescriptorSetLayout);
    _gpuDescriptorSetLayout->descriptorCount = _descriptorCount;
    _gpuDescriptorSetLayout->bindingIndices = _bindingIndices;
    _gpuDescriptorSetLayout->descriptorIndices = _descriptorIndices;
    _gpuDescriptorSetLayout->bindings = _bindings;

    for (uint i = 0u; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = _bindings[i];
        if ((uint)binding.descriptorType & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0u; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(binding.binding);
            }
        }
    }
    return true;
}

void GLES2DescriptorSetLayout::destroy() {
    if (_gpuDescriptorSetLayout) {
        CC_DELETE(_gpuDescriptorSetLayout);
        _gpuDescriptorSetLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
