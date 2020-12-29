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
#include "VKStd.h"

#include "VKCommands.h"
#include "VKDescriptorSetLayout.h"
#include "VKDevice.h"
#include "VKPipelineLayout.h"

namespace cc {
namespace gfx {

CCVKPipelineLayout::CCVKPipelineLayout(Device *device)
: PipelineLayout(device) {
}

CCVKPipelineLayout::~CCVKPipelineLayout() {
}

bool CCVKPipelineLayout::initialize(const PipelineLayoutInfo &info) {

    _setLayouts = info.setLayouts;

    _gpuPipelineLayout = CC_NEW(CCVKGPUPipelineLayout);

    int offset = 0u;
    for (uint i = 0u; i < _setLayouts.size(); i++) {
        DescriptorSetLayout *setLayout = _setLayouts[i];
        CCASSERT(setLayout != nullptr, "SetLayout should not be nullptr.");
        CCVKGPUDescriptorSetLayout *gpuSetLayout = ((CCVKDescriptorSetLayout *)setLayout)->gpuDescriptorSetLayout();
        size_t dynamicCount = gpuSetLayout->dynamicBindings.size();
        _gpuPipelineLayout->dynamicOffsetOffsets.push_back(offset);
        _gpuPipelineLayout->setLayouts.push_back(gpuSetLayout);
        offset += dynamicCount;
    }
    _gpuPipelineLayout->dynamicOffsetOffsets.push_back(offset);
    _gpuPipelineLayout->dynamicOffsetCount = offset;

    CCVKCmdFuncCreatePipelineLayout((CCVKDevice *)_device, _gpuPipelineLayout);

    return true;
}

void CCVKPipelineLayout::destroy() {

    if (_gpuPipelineLayout) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
