/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "MainFlow.h"
#include "BloomStage.h"
#include "DeferredPipeline.h"
#include "GbufferStage.h"
#include "LightingStage.h"
#include "PostProcessStage.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline/SceneCulling.h"
#include "profiler/Profiler.h"

namespace cc {
namespace pipeline {
RenderFlowInfo MainFlow::initInfo = {
    "MainFlow",
    static_cast<uint32_t>(DeferredFlowPriority::MAIN),
    static_cast<uint32_t>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &MainFlow::getInitializeInfo() { return MainFlow::initInfo; }

MainFlow::~MainFlow() = default;

bool MainFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    if (_stages.empty()) {
        _isResourceOwner = true;

        auto *gbufferStage = ccnew GbufferStage;
        gbufferStage->initialize(GbufferStage::getInitializeInfo());
        _stages.emplace_back(gbufferStage);
        auto *lightingStage = ccnew LightingStage;
        lightingStage->initialize(LightingStage::getInitializeInfo());
        _stages.emplace_back(lightingStage);
        auto *bloomStage = ccnew BloomStage;
        bloomStage->initialize(BloomStage::getInitializeInfo());
        _stages.emplace_back(bloomStage);
        auto *postProcessStage = ccnew PostProcessStage;
        postProcessStage->initialize(PostProcessStage::getInitializeInfo());
        _stages.emplace_back(postProcessStage);
    }

    return true;
}

void MainFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void MainFlow::render(scene::Camera *camera) {
    CC_PROFILE(MainFlowRender);
    RenderFlow::render(camera);
}

void MainFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
