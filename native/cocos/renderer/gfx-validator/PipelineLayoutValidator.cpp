/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Macros.h"
#include "base/threading/MessageQueue.h"

#include "DescriptorSetLayoutValidator.h"
#include "DeviceValidator.h"
#include "PipelineLayoutValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

PipelineLayoutValidator::PipelineLayoutValidator(PipelineLayout *actor)
: Agent<PipelineLayout>(actor) {
    _typedID = actor->getTypedID();
}

PipelineLayoutValidator::~PipelineLayoutValidator() {
    DeviceResourceTracker<PipelineLayout>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void PipelineLayoutValidator::doInit(const PipelineLayoutInfo &info) {
    CC_ASSERT(!isInited());
    _inited = true;

    const auto &bindingMappings{DeviceValidator::getInstance()->bindingMappingInfo()};
    // deffered pipeline issue: https://github.com/cocos/cocos-engine/pull/10701
    // for (uint32_t i = 0; i < info.setLayouts.size(); ++i) {
    //     auto *layout{static_cast<DescriptorSetLayoutValidator *>(info.setLayouts[i])};
    //     CC_ASSERT(layout && layout->isInited());
    //     // check against limits specified in BindingMappingInfo
    //     if (bindingMappings.setIndices.back() == i) continue; // flexible set
    //     CC_ASSERT(layout->_typeCounts[0] <= bindingMappings.maxBlockCounts[i]);
    //     CC_ASSERT(layout->_typeCounts[1] <= bindingMappings.maxSamplerTextureCounts[i]);
    //     CC_ASSERT(layout->_typeCounts[2] <= bindingMappings.maxSamplerCounts[i]);
    //     CC_ASSERT(layout->_typeCounts[3] <= bindingMappings.maxTextureCounts[i]);
    //     CC_ASSERT(layout->_typeCounts[4] <= bindingMappings.maxBufferCounts[i]);
    //     CC_ASSERT(layout->_typeCounts[5] <= bindingMappings.maxImageCounts[i]);
    //     CC_ASSERT(layout->_typeCounts[6] <= bindingMappings.maxSubpassInputCounts[i]);
    // }

    /////////// execute ///////////

    PipelineLayoutInfo actorInfo;
    actorInfo.setLayouts.resize(info.setLayouts.size());
    for (uint32_t i = 0U; i < info.setLayouts.size(); i++) {
        actorInfo.setLayouts[i] = static_cast<DescriptorSetLayoutValidator *>(info.setLayouts[i])->getActor();
    }

    _actor->initialize(actorInfo);
}

void PipelineLayoutValidator::doDestroy() {
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
