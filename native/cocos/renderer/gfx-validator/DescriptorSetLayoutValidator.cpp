/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"
#include "base/threading/MessageQueue.h"

#include "DescriptorSetLayoutValidator.h"
#include "DeviceValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

DescriptorSetLayoutValidator::DescriptorSetLayoutValidator(DescriptorSetLayout *actor)
: Agent<DescriptorSetLayout>(actor) {
    _typedID = actor->getTypedID();
}

DescriptorSetLayoutValidator::~DescriptorSetLayoutValidator() {
    DeviceResourceTracker<DescriptorSetLayout>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void DescriptorSetLayoutValidator::doInit(const DescriptorSetLayoutInfo &info) {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;

    for (const DescriptorSetLayoutBinding &binding : info.bindings) {
        CCASSERT(binding.binding != INVALID_BINDING, "Invalid binding");
        CCASSERT(binding.descriptorType != DescriptorType::UNKNOWN, "Invalid binding type");
        CCASSERT(binding.count, "Invalid binding count");
        CCASSERT(binding.stageFlags != ShaderStageFlagBit::NONE, "Invalid binding stage flags");
        for (const Sampler *sampler : binding.immutableSamplers) {
            CCASSERT(sampler, "Invalid immutable sampler");
        }
    }

    /////////// execute ///////////

    _actor->initialize(info);
}

void DescriptorSetLayoutValidator::doDestroy() {
    CCASSERT(isInited(), "destroying twice?");
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
