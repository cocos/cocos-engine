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

#include "LightingFlow.h"
#include "../SceneCulling.h"
#include "DeferredPipeline.h"
#include "LightingStage.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"

namespace cc {
namespace pipeline {
RenderFlowInfo LightingFlow::initInfo = {
    "LightingFlow",
    static_cast<uint>(DeferredFlowPriority::LIGHTING),
    static_cast<uint>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &LightingFlow::getInitializeInfo() { return LightingFlow::initInfo; }

LightingFlow::~LightingFlow() = default;

bool LightingFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    if (_stages.empty()) {
        auto *stage = CC_NEW(LightingStage);
        stage->initialize(LightingStage::getInitializeInfo());
        _stages.emplace_back(stage);
    }

    return true;
}

void LightingFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void LightingFlow::render(scene::Camera *camera) {
    RenderFlow::render(camera);
}

void LightingFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
