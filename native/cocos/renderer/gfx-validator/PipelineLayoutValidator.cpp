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
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;

    for (auto *layout : info.setLayouts) {
        CCASSERT(layout && static_cast<DescriptorSetLayoutValidator *>(layout)->isInited(), "already destroyed?");
    }

    /////////// execute ///////////

    PipelineLayoutInfo actorInfo;
    actorInfo.setLayouts.resize(info.setLayouts.size());
    for (uint32_t i = 0U; i < info.setLayouts.size(); i++) {
        actorInfo.setLayouts[i] = static_cast<DescriptorSetLayoutValidator *>(info.setLayouts[i])->getActor();
    }

    _actor->initialize(actorInfo);
}

void PipelineLayoutValidator::doDestroy() {
    CCASSERT(isInited(), "destroying twice?");
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
