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

#include "WGPUPipelineLayout.h"
#include <emscripten/html5_webgpu.h>
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"

namespace cc {
namespace gfx {

using namespace emscripten;

CCWGPUPipelineLayout::CCWGPUPipelineLayout() : wrapper<PipelineLayout>(val::object()) {
}

void CCWGPUPipelineLayout::doInit(const PipelineLayoutInfo& info) {
    _gpuPipelineLayoutObj = CC_NEW(CCWGPUPipelineLayoutObject);
}

void CCWGPUPipelineLayout::prepare(const std::set<uint8_t>& setInUse) {
    std::vector<WGPUBindGroupLayout> layouts;
    // _bgLayouts.clear();
    for (size_t i = 0; i < _setLayouts.size(); i++) {
        auto* descriptorSetLayout = static_cast<CCWGPUDescriptorSetLayout*>(_setLayouts[i]);
        if (setInUse.find(i) == setInUse.end()) {
            // give it default bindgrouplayout if not in use
            layouts.push_back(static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::defaultBindGroupLayout()));
            // _bgLayouts.push_back(static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::defaultBindGroupLayout()));
        } else {
            if (!descriptorSetLayout->gpuLayoutEntryObject()->bindGroupLayout) {
                descriptorSetLayout->prepare();
            }
            layouts.push_back(descriptorSetLayout->gpuLayoutEntryObject()->bindGroupLayout);
            //  _bgLayouts.push_back(descriptorSetLayout->gpuLayoutEntryObject()->bindGroupLayout);
        }
    }

    WGPUPipelineLayoutDescriptor descriptor = {
        .nextInChain          = nullptr,
        .label                = nullptr,
        .bindGroupLayoutCount = layouts.size(),
        .bindGroupLayouts     = layouts.data(),
    };

    _gpuPipelineLayoutObj->wgpuPipelineLayout = wgpuDeviceCreatePipelineLayout(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
}

void CCWGPUPipelineLayout::doDestroy() {
    if (_gpuPipelineLayoutObj) {
        if (_gpuPipelineLayoutObj->wgpuPipelineLayout) {
            wgpuPipelineLayoutRelease(_gpuPipelineLayoutObj->wgpuPipelineLayout);
        }
        CC_DELETE(_gpuPipelineLayoutObj);
    }
}

} // namespace gfx
} // namespace cc