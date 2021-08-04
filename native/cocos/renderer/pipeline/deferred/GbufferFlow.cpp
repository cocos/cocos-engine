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

#include "GbufferFlow.h"
#include "DeferredPipeline.h"
#include "GbufferStage.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXRenderPass.h"
#include "gfx-base/GFXSampler.h"
#include "pipeline/SceneCulling.h"

namespace cc {
namespace pipeline {
RenderFlowInfo GbufferFlow::initInfo = {
    "GbufferFlow",
    static_cast<uint>(DeferredFlowPriority::GBUFFER),
    static_cast<uint>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &GbufferFlow::getInitializeInfo() { return GbufferFlow::initInfo; }

GbufferFlow::~GbufferFlow() = default;

bool GbufferFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    if (_stages.empty()) {
        auto *gbufferStage = CC_NEW(GbufferStage);
        gbufferStage->initialize(GbufferStage::getInitializeInfo());
        _stages.emplace_back(gbufferStage);
    }

    return true;
}

void GbufferFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void GbufferFlow::render(scene::Camera *camera) {
    RenderFlow::render(camera);
}

void GbufferFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
