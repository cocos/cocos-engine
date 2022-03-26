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

#include "DeviceValidator.h"
#include "PipelineLayoutValidator.h"
#include "PipelineStateValidator.h"
#include "RenderPassValidator.h"
#include "ShaderValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

PipelineStateValidator::PipelineStateValidator(PipelineState *actor)
: Agent<PipelineState>(actor) {
    _typedID = actor->getTypedID();
}

PipelineStateValidator::~PipelineStateValidator() {
    DeviceResourceTracker<PipelineState>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void PipelineStateValidator::doInit(const PipelineStateInfo &info) {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;
    CCASSERT(info.shader && static_cast<ShaderValidator *>(info.shader)->isInited(), "already destroyed?");
    CCASSERT(info.pipelineLayout && static_cast<PipelineLayoutValidator *>(info.pipelineLayout)->isInited(), "already destroyed?");
    CCASSERT(!info.renderPass || static_cast<RenderPassValidator *>(info.renderPass)->isInited(), "already destroyed?");

    /////////// execute ///////////

    PipelineStateInfo actorInfo = info;
    actorInfo.shader            = static_cast<ShaderValidator *>(info.shader)->getActor();
    actorInfo.pipelineLayout    = static_cast<PipelineLayoutValidator *>(info.pipelineLayout)->getActor();
    if (info.renderPass) actorInfo.renderPass = static_cast<RenderPassValidator *>(info.renderPass)->getActor();

    _actor->initialize(actorInfo);
}

void PipelineStateValidator::doDestroy() {
    CCASSERT(isInited(), "destroying twice?");
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
