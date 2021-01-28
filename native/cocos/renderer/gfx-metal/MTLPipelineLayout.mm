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

#include "MTLDescriptorSetLayout.h"
#include "MTLGPUObjects.h"
#include "MTLPipelineLayout.h"
namespace cc {
namespace gfx {

CCMTLPipelineLayout::CCMTLPipelineLayout(Device *device) : PipelineLayout(device) {
}

bool CCMTLPipelineLayout::initialize(const PipelineLayoutInfo &info) {
    _setLayouts = info.setLayouts;
    const auto setCount = _setLayouts.size();
    _gpuPipelineLayout = CC_NEW(CCMTLGPUPipelineLayout);
    _gpuPipelineLayout->dynamicOffsetIndices.resize(setCount);

    for (size_t i = 0; i < setCount; i++) {
        const auto *setLayout = _setLayouts[i];
        CCASSERT(setLayout != nullptr, "SetLayout should not be nullptr.");
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

    return true;
}

void CCMTLPipelineLayout::destroy() {
    CC_SAFE_DELETE(_gpuPipelineLayout);
}

}
}
