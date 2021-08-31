/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.

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

#include "MainFlow.h"
#include "DeferredPipeline.h"
#include "GbufferStage.h"
#include "LightingStage.h"
#include "PostprocessStage.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline/SceneCulling.h"

namespace cc {
namespace pipeline {
RenderFlowInfo MainFlow::initInfo = {
    "MainFlow",
    static_cast<uint>(DeferredFlowPriority::MAIN),
    static_cast<uint>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &MainFlow::getInitializeInfo() { return MainFlow::initInfo; }

MainFlow::~MainFlow() = default;

bool MainFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    if (_stages.empty()) {
        auto *gbufferStage = CC_NEW(GbufferStage);
        gbufferStage->initialize(GbufferStage::getInitializeInfo());
        _stages.emplace_back(gbufferStage);
        auto *lightingStage = CC_NEW(LightingStage);
        lightingStage->initialize(LightingStage::getInitializeInfo());
        _stages.emplace_back(lightingStage);
        auto *postprocessStage = CC_NEW(PostprocessStage);
        postprocessStage->initialize(PostprocessStage::getInitializeInfo());
        _stages.emplace_back(postprocessStage);
    }

    return true;
}

void MainFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void MainFlow::render(scene::Camera *camera) {
    RenderFlow::render(camera);
}

void MainFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
