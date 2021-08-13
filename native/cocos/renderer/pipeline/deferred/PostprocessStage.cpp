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

#include "PostprocessStage.h"
#include "../PipelineStateManager.h"
#include "../RenderQueue.h"
#include "../forward/UIPhase.h"
#include "DeferredPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "pipeline/Define.h"
#include "scene/SubModel.h"

namespace cc {
namespace pipeline {
RenderStageInfo PostprocessStage::initInfo = {
    "PostprocessStage",
    static_cast<uint>(DeferredStagePriority::POSTPROCESS),
    0,
    {{true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}}},
};

PostprocessStage::PostprocessStage() {
    _uiPhase = CC_NEW(UIPhase);
}

bool PostprocessStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    return true;
}

void PostprocessStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);
    _uiPhase->activate(pipeline);
    _phaseID = getPhaseID("default");

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint phase = 0;
        for (const auto &stage : descriptor.stages) {
            phase |= getPhaseID(stage);
        }

        std::function<int(const RenderPass &, const RenderPass &)> sortFunc = opaqueCompareFn;
        switch (descriptor.sortMode) {
            case RenderQueueSortMode::BACK_TO_FRONT:
                sortFunc = transparentCompareFn;
                break;
            case RenderQueueSortMode::FRONT_TO_BACK:
                sortFunc = opaqueCompareFn;
            default:
                break;
        }

        RenderQueueCreateInfo info = {descriptor.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(std::move(info))));
    }
}

void PostprocessStage::destroy() {
}

void PostprocessStage::render(scene::Camera *camera) {
    auto *pp = dynamic_cast<DeferredPipeline *>(_pipeline);
    assert(pp != nullptr);
    gfx::CommandBuffer *cmdBf = pp->getCommandBuffers()[0];

    gfx::Rect renderArea = pp->getRenderArea(camera, !camera->window->hasOffScreenAttachments);

    if (hasFlag(static_cast<gfx::ClearFlags>(camera->clearFlag), gfx::ClearFlagBit::COLOR)) {
        _clearColors[0].x = camera->clearColor.x;
        _clearColors[0].y = camera->clearColor.y;
        _clearColors[0].z = camera->clearColor.z;
    }

    _clearColors[0].w = camera->clearColor.w;

    gfx::Framebuffer *fb            = camera->window->frameBuffer;
    const auto &      colorTextures = fb->getColorTextures();
    gfx::RenderPass * rp            = !colorTextures.empty() && colorTextures[0] ? fb->getRenderPass() : pp->getOrCreateRenderPass(static_cast<gfx::ClearFlags>(camera->clearFlag));

    cmdBf->beginRenderPass(rp, fb, renderArea, _clearColors, camera->clearDepth, camera->clearStencil);
    uint const globalOffsets[] = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
    cmdBf->bindDescriptorSet(globalSet, pp->getDescriptorSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);

    // post proces
    auto *const  sceneData     = _pipeline->getPipelineSceneData();
    scene::Pass *pv            = sceneData->getSharedData()->deferredPostPass;
    gfx::Shader *sd            = sceneData->getSharedData()->deferredPostPassShader;
    const auto & renderObjects = sceneData->getRenderObjects();

    if (!renderObjects.empty()) {
        gfx::InputAssembler *ia  = pp->getQuadIAOffScreen();
        gfx::PipelineState * pso = PipelineStateManager::getOrCreatePipelineState(pv, sd, ia, rp);
        assert(pso != nullptr);

        cmdBf->bindPipelineState(pso);
        cmdBf->bindInputAssembler(ia);
        cmdBf->bindDescriptorSet(materialSet, pv->getDescriptorSet());
        cmdBf->draw(ia);
    }

    _uiPhase->render(camera, rp);
    cmdBf->endRenderPass();
}
} // namespace pipeline
} // namespace cc
