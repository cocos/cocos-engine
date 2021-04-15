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
#include "DeferredPipeline.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "../helper/SharedMemory.h"
#include "../PipelineStateManager.h"
#include "gfx-base/GFXDevice.h"
#include "../forward/UIPhase.h"
#include "../RenderQueue.h"

namespace cc {
namespace pipeline {
RenderStageInfo PostprocessStage::initInfo = {
    "PostprocessStage",
    static_cast<uint>(DeferredStagePriority::POSTPROCESS),
    0,
    {{true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}}},
};

PostprocessStage::PostprocessStage()  {
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

void PostprocessStage::render(Camera *camera) {
    auto *pp = dynamic_cast<DeferredPipeline *>(_pipeline);
    assert(pp != nullptr);
    gfx::Device *device = pp->getDevice();
    gfx::CommandBuffer *cmdBf = pp->getCommandBuffers()[0];

    _pipeline->getPipelineUBO()->updateCameraUBO(camera, camera->getWindow()->hasOffScreenAttachments);
    gfx::Rect renderArea = pp->getRenderArea(camera, !camera->getWindow()->hasOffScreenAttachments);

    if (static_cast<gfx::ClearFlags>(camera->clearFlag) & gfx::ClearFlagBit::COLOR) {
        _clearColors[0].x = camera->clearColor.x;
        _clearColors[0].y = camera->clearColor.y;
        _clearColors[0].z = camera->clearColor.z;
    }

    _clearColors[0].w = camera->clearColor.w;

    gfx::Framebuffer *fb = camera->getWindow()->getFramebuffer();
    const auto &colorTextures = fb->getColorTextures();
    gfx::RenderPass *rp = !colorTextures.empty() && colorTextures[0] ? 
        fb->getRenderPass() : pp->getOrCreateRenderPass(static_cast<gfx::ClearFlags>(camera->clearFlag));

    cmdBf->beginRenderPass(rp, fb, renderArea, _clearColors, camera->clearDepth, camera->clearStencil);
    cmdBf->bindDescriptorSet(static_cast<uint>(SetIndex::GLOBAL), pp->getDescriptorSet());

    // post proces
    auto *const sceneData = _pipeline->getPipelineSceneData();
    PassView *pv = sceneData->getSharedData()->getDeferredPostPass();
    gfx::Shader *sd = sceneData->getSharedData()->getDeferredPostPassShader();
    const auto &renderObjects = sceneData->getRenderObjects();
    
    if (!renderObjects.empty()) {
        gfx::InputAssembler *ia = camera->getWindow()->hasOffScreenAttachments ? pp->getQuadIAOffScreen() : pp->getQuadIAOnScreen();
        gfx::PipelineState *pso = PipelineStateManager::getOrCreatePipelineState(pv, sd, ia, rp);
        assert(pso != nullptr);

        cmdBf->bindPipelineState(pso);
        cmdBf->bindInputAssembler(ia);
        cmdBf->draw(ia);
    }
    
    // transparent
    for (auto *queue : _renderQueues) {
        queue->clear();
    }

    uint m = 0;
    uint p = 0;
    size_t k = 0;
    for (auto ro : renderObjects) {
        const auto *const model = ro.model;
        const auto *const subModelID = model->getSubModelID();
        const auto subModelCount = subModelID[0];
        for (m = 1; m <= subModelCount; ++m) {
            const auto *subModel = model->getSubModelView(subModelID[m]);
            for (p = 0; p < subModel->passCount; ++p) {
                const PassView *pass = subModel->getPassView(p);
                // TODO(xwx): need fallback of ulit and gizmo material.
                if (pass->phase != _phaseID) continue;
                for (k = 0; k < _renderQueues.size(); k++) {
                    _renderQueues[k]->insertRenderPass(ro, m, p);
                }
            }
        }
    }
    
    for (auto *queue : _renderQueues) {
        queue->sort();
        queue->recordCommandBuffer(_device, rp, cmdBf);
    }

    _uiPhase->render(camera, rp);
    cmdBf->endRenderPass();
}
} // namespace pipeline
} // namespace cc
