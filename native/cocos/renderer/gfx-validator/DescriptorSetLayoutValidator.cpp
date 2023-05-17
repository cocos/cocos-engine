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

#include "base/threading/MessageQueue.h"
#include "gfx-base/GFXDef-common.h"
#include "math/Math.h"

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
    // Initialize twice?
    CC_ASSERT(!isInited());
    _inited = true;

    DescriptorSetLayoutBindingList bindings{info.bindings};
    std::sort(bindings.begin(), bindings.end(), [&](const auto &a, const auto &b) {
        return a.binding < b.binding;
    });

    static constexpr uint32_t DESCRIPTOR_TYPE_ORDERS[]{
        INVALID_BINDING, // UNKNOWN
        0,               // UNIFORM_BUFFER
        0,               // DYNAMIC_UNIFORM_BUFFER
        4,               // STORAGE_BUFFER
        4,               // DYNAMIC_STORAGE_BUFFER
        1,               // SAMPLER_TEXTURE
        2,               // SAMPLER
        3,               // TEXTURE
        5,               // STORAGE_IMAGE
        6,               // INPUT_ATTACHMENT
    };
    _typeCounts.resize(DESCRIPTOR_TYPE_ORDERS[utils::getBitPosition(toNumber(DescriptorType::INPUT_ATTACHMENT))] + 1);
    uint32_t lastType{0};
    for (const auto &binding : bindings) {
        CC_ASSERT(binding.binding != INVALID_BINDING);
        CC_ASSERT_NE(binding.descriptorType, DescriptorType::UNKNOWN);
        CC_ASSERT(math::isPowerOfTwo(toNumber(binding.descriptorType)));
        CC_ASSERT(binding.count);
        CC_ASSERT_NE(binding.stageFlags, ShaderStageFlagBit::NONE);
        for (const Sampler *sampler : binding.immutableSamplers) {
            CC_ASSERT(sampler);
        }
        /**
         * Descriptors should be defined strictly in the following order,
         * with consecutive bindings within each type:
         * * Block
         * * SamplerTexture
         * * Sampler
         * * Texture
         * * Buffer
         * * Image
         * * SubpassInput
         */
        uint32_t type{DESCRIPTOR_TYPE_ORDERS[utils::getBitPosition(toNumber(binding.descriptorType))]};
        // deffered pipeline issue: https://github.com/cocos/cocos-engine/pull/10701
        // CC_ASSERT_LE(lastType, type);
        lastType = type;
        ++_typeCounts[type];
    }

    /////////// execute ///////////

    _actor->initialize(info);
}

void DescriptorSetLayoutValidator::doDestroy() {
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
