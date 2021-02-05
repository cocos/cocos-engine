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

#include "VKStd.h"

#include "VKCommands.h"
#include "VKDescriptorSetLayout.h"
#include "VKDevice.h"

namespace cc {
namespace gfx {

CCVKDescriptorSetLayout::CCVKDescriptorSetLayout(Device *device)
: DescriptorSetLayout(device) {
}

CCVKDescriptorSetLayout::~CCVKDescriptorSetLayout() {
}

bool CCVKDescriptorSetLayout::initialize(const DescriptorSetLayoutInfo &info) {

    _bindings = info.bindings;
    uint bindingCount = _bindings.size();
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

    _gpuDescriptorSetLayout = CC_NEW(CCVKGPUDescriptorSetLayout);
    _gpuDescriptorSetLayout->descriptorCount = _descriptorCount;
    _gpuDescriptorSetLayout->bindingIndices = _bindingIndices;
    _gpuDescriptorSetLayout->descriptorIndices = _descriptorIndices;
    _gpuDescriptorSetLayout->bindings = _bindings;

    for (uint i = 0u; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = _bindings[i];
        if (binding.descriptorType & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0u; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(binding.binding);
            }
        }
    }

    CCVKCmdFuncCreateDescriptorSetLayout((CCVKDevice *)_device, _gpuDescriptorSetLayout);

    return true;
}

void CCVKDescriptorSetLayout::destroy() {
    if (_gpuDescriptorSetLayout) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuDescriptorSetLayout);
        _gpuDescriptorSetLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
