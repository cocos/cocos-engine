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

#include "ForwardFlow.h"
#include "../SceneCulling.h"
#include "ForwardPipeline.h"
#include "ForwardStage.h"
#include "profiler/Profiler.h"

#if CC_USE_AR_MODULE
    #include "pipeline/xr/ar/ARStage.h"
#endif

namespace cc {
namespace pipeline {
RenderFlowInfo ForwardFlow::initInfo = {
    "ForwardFlow",
    static_cast<uint32_t>(ForwardFlowPriority::FORWARD),
    static_cast<uint32_t>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &ForwardFlow::getInitializeInfo() { return ForwardFlow::initInfo; }

ForwardFlow::~ForwardFlow() = default;

bool ForwardFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    if (_stages.empty()) {
        _isResourceOwner = true;

#if CC_USE_AR_MODULE
        auto *arStage = ccnew ARStage;
        arStage->initialize(ARStage::getInitializeInfo());
        _stages.emplace_back(arStage);
#endif
        auto *forwardStage = ccnew ForwardStage;
        forwardStage->initialize(ForwardStage::getInitializeInfo());
        _stages.emplace_back(forwardStage);
    }

    return true;
}

void ForwardFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void ForwardFlow::render(scene::Camera *camera) {
    CC_PROFILE(ForwardFlowRender);
    RenderFlow::render(camera);
}

void ForwardFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
