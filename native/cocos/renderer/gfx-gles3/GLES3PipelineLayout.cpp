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
    _gpuPipelineLayout = CC_NEW(GLES3GPUPipelineLayout);

    uint32_t offset = 0U;
    _gpuPipelineLayout->dynamicOffsetIndices.resize(_setLayouts.size());
    for (uint32_t i = 0U; i < _setLayouts.size(); i++) {
        DescriptorSetLayout *        setLayout    = _setLayouts[i];
        GLES3GPUDescriptorSetLayout *gpuSetLayout = static_cast<GLES3DescriptorSetLayout *>(setLayout)->gpuDescriptorSetLayout();
        uint32_t                     dynamicCount = utils::toUint(gpuSetLayout->dynamicBindings.size());
        vector<int> &                indices      = _gpuPipelineLayout->dynamicOffsetIndices[i];
        indices.assign(setLayout->getBindingIndices().size(), -1);

        for (uint32_t j = 0U; j < dynamicCount; j++) {
            uint32_t binding = gpuSetLayout->dynamicBindings[j];
            if (indices[binding] < 0) indices[binding] = static_cast<int32_t>(offset + j);
        }
        _gpuPipelineLayout->dynamicOffsetOffsets.push_back(offset);
        _gpuPipelineLayout->setLayouts.push_back(gpuSetLayout);
        offset += dynamicCount;
    }
    _gpuPipelineLayout->dynamicOffsetOffsets.push_back(offset);
    _gpuPipelineLayout->dynamicOffsetCount = offset;
    _gpuPipelineLayout->dynamicOffsets.resize(offset);
}

void GLES3PipelineLayout::doDestroy() {
    if (_gpuPipelineLayout) {
        CC_DELETE(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
