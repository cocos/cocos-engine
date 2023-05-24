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

#include "GLES3Commands.h"
#include "GLES3DescriptorSetLayout.h"
#include "GLES3PipelineLayout.h"
#include "base/Utils.h"

namespace cc {
namespace gfx {

GLES3PipelineLayout::GLES3PipelineLayout() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3PipelineLayout::~GLES3PipelineLayout() {
    destroy();
}

void GLES3PipelineLayout::doInit(const PipelineLayoutInfo & /*info*/) {
    _gpuPipelineLayout = ccnew GLES3GPUPipelineLayout;

    uint32_t offset = 0U;
    auto &hash = _gpuPipelineLayout->hash;
    _gpuPipelineLayout->dynamicOffsetIndices.resize(_setLayouts.size());
    for (uint32_t i = 0U; i < _setLayouts.size(); i++) {
        DescriptorSetLayout *setLayout = _setLayouts[i];
        GLES3GPUDescriptorSetLayout *gpuSetLayout = static_cast<GLES3DescriptorSetLayout *>(setLayout)->gpuDescriptorSetLayout();
        uint32_t dynamicCount = utils::toUint(gpuSetLayout->dynamicBindings.size());
        ccstd::vector<int> &indices = _gpuPipelineLayout->dynamicOffsetIndices[i];
        indices.assign(setLayout->getBindingIndices().size(), -1);

        for (uint32_t j = 0U; j < dynamicCount; j++) {
            uint32_t binding = gpuSetLayout->dynamicBindings[j];
            if (indices[binding] < 0) indices[binding] = static_cast<int32_t>(offset + j);
        }
        _gpuPipelineLayout->dynamicOffsetOffsets.push_back(static_cast<uint32_t>(offset));
        _gpuPipelineLayout->setLayouts.push_back(gpuSetLayout);
        offset += dynamicCount;

        ccstd::hash_combine(hash, gpuSetLayout->hash);
    }
    _gpuPipelineLayout->dynamicOffsetOffsets.push_back(static_cast<uint32_t>(offset));
    _gpuPipelineLayout->dynamicOffsetCount = static_cast<uint32_t>(offset);
    _gpuPipelineLayout->dynamicOffsets.resize(offset);
}

void GLES3PipelineLayout::doDestroy() {
    CC_SAFE_DELETE(_gpuPipelineLayout);
}

} // namespace gfx
} // namespace cc
