/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "MTLDescriptorSetLayout.h"
#include "MTLGPUObjects.h"
#include "MTLPipelineLayout.h"
namespace cc {
namespace gfx {

CCMTLPipelineLayout::CCMTLPipelineLayout() : PipelineLayout() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLPipelineLayout::~CCMTLPipelineLayout() {
    destroy();
}

void CCMTLPipelineLayout::doInit(const PipelineLayoutInfo &info) {
    const auto setCount = _setLayouts.size();
    _gpuPipelineLayout = ccnew CCMTLGPUPipelineLayout;
    _gpuPipelineLayout->dynamicOffsetIndices.resize(setCount);

    for (size_t i = 0; i < setCount; i++) {
        const auto *setLayout = _setLayouts[i];
        CC_ASSERT_NOT_NULL(setLayout);
        auto gpuDescriptorSetLayout = static_cast<const CCMTLDescriptorSetLayout *>(setLayout)->gpuDescriptorSetLayout();
        auto dynamicCount = gpuDescriptorSetLayout->dynamicBindings.size();
        auto &indices = _gpuPipelineLayout->dynamicOffsetIndices[i];
        indices.assign(setLayout->getBindingIndices().size(), -1);

        for (int j = 0; j < dynamicCount; j++) {
            auto binding = gpuDescriptorSetLayout->dynamicBindings[j];
            if (indices[binding] < 0) indices[binding] = j;
        }
        _gpuPipelineLayout->setLayouts.emplace_back(gpuDescriptorSetLayout);
    }
}

void CCMTLPipelineLayout::doDestroy() {
    CC_SAFE_DELETE(_gpuPipelineLayout);
}

} // namespace gfx
} // namespace cc
