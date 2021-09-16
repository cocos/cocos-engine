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

#include "GFXObject.h"
#include "base/CoreStd.h"
#include "base/Utils.h"

#include "GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

DescriptorSetLayout::DescriptorSetLayout()
: GFXObject(ObjectType::DESCRIPTOR_SET_LAYOUT) {
}

DescriptorSetLayout::~DescriptorSetLayout() = default;

void DescriptorSetLayout::initialize(const DescriptorSetLayoutInfo &info) {
    _bindings         = info.bindings;
    auto bindingCount = utils::toUint(_bindings.size());
    _descriptorCount  = 0U;

    if (bindingCount) {
        uint32_t         maxBinding = 0U;
        vector<uint32_t> flattenedIndices(bindingCount);
        for (uint32_t i = 0U; i < bindingCount; i++) {
            const DescriptorSetLayoutBinding &binding = _bindings[i];
            if (binding.binding > maxBinding) maxBinding = binding.binding;
            flattenedIndices[i] = _descriptorCount;
            _descriptorCount += binding.count;
        }

        _bindingIndices.resize(maxBinding + 1, INVALID_BINDING);
        _descriptorIndices.resize(maxBinding + 1, INVALID_BINDING);
        for (uint32_t i = 0U; i < bindingCount; i++) {
            const DescriptorSetLayoutBinding &binding = _bindings[i];
            _bindingIndices[binding.binding]          = i;
            _descriptorIndices[binding.binding]       = flattenedIndices[i];
            if (hasFlag(DESCRIPTOR_DYNAMIC_TYPE, binding.descriptorType)) {
                for (uint32_t j = 0U; j < binding.count; ++j) {
                    _dynamicBindings.push_back(binding.binding);
                }
            }
        }
    }

    doInit(info);
}

void DescriptorSetLayout::destroy() {
    doDestroy();

    _bindings.clear();
    _descriptorCount = 0U;
    _bindingIndices.clear();
    _descriptorIndices.clear();
}

} // namespace gfx
} // namespace cc
