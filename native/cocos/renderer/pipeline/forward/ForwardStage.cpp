/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "ForwardStage.h"
#include "../BatchedBuffer.h"
#include "../InstancedBuffer.h"
#include "../PlanarShadowQueue.h"
#include "../RenderAdditiveLightQueue.h"
#include "../RenderBatchedQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "ForwardPipeline.h"
#include "UIPhase.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXQueue.h"

namespace cc {
namespace pipeline {
namespace {
void srgbToLinear(gfx::Color *out, const gfx::Color &gamma) {
    out->x = gamma.x * gamma.x;
    out->y = gamma.y * gamma.y;
    out->z = gamma.z * gamma.z;
}

void linearToSrgb(gfx::Color *out, const gfx::Color &linear) {
    out->x = std::sqrt(linear.x);
    out->y = std::sqrt(linear.y);
    out->z = std::sqrt(linear.z);
}
} // namespace

RenderStageInfo ForwardStage::initInfo = {
    "ForwardStage",
    static_cast<uint>(ForwardStagePriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE),
    {{false, RenderQueueSortMode::FRONT_TO_BACK, {"default"}},
     {true, RenderQueueSortMode::BACK_TO_FRONT, {"default", "planarShadow"}}}};
const RenderStageInfo &ForwardStage::getInitializeInfo() { return ForwardStage::initInfo; }

ForwardStage::ForwardStage() {
    _batchedQueue   = CC_NEW(RenderBatchedQueue);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
    _uiPhase        = CC_NEW(UIPhase);
}

ForwardStage::~ForwardStage() = default;

bool ForwardStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    _phaseID                = getPhaseID("default");
    return true;
}

void ForwardStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint                  phase    = convertPhase(descriptor.stages);
        RenderQueueSortFunc   sortFunc = convertQueueSortFunc(descriptor.sortMode);
        RenderQueueCreateInfo info     = {descriptor.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(std::move(info))));
    }

    _additiveLightQueue = CC_NEW(RenderAdditiveLightQueue(_pipeline));
    _planarShadowQueue  = CC_NEW(PlanarShadowQueue(_pipeline));
    _uiPhase->activate(pipeline);
}

void ForwardStage::destroy() {
    CC_SAFE_DELETE(_batchedQueue);
    CC_SAFE_DELETE(_instancedQueue);
    CC_SAFE_DELETE(_additiveLightQueue);
    CC_SAFE_DELETE(_planarShadowQueue);
    CC_SAFE_DELETE(_uiPhase);
    RenderStage::destroy();
}

void ForwardStage::render(scene::Camera *camera) {
    _instancedQueue->clear();
    _batchedQueue->clear();
    auto *      pipeline      = static_cast<ForwardPipeline *>(_pipeline);
    auto *const sceneData     = _pipeline->getPipelineSceneData();
    auto *const sharedData    = sceneData->getSharedData();
    const auto &renderObjects = sceneData->getRenderObjects();

    for (auto *queue : _renderQueues) {
        queue->clear();
    }

    uint   subModelIdx = 0;
    uint   passIdx     = 0;
    size_t k           = 0;
    for (auto ro : renderObjects) {
        const auto *const model = ro.model;
        const auto& subModels = model->getSubModels();
        auto subModelCount = subModels.size();
        for (subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
            const auto& subModel = subModels[subModelIdx];
            const auto& passes = subModel->getPasses();
            auto passCount = passes.size();
            for (passIdx = 0; passIdx < passCount; ++passIdx) {
                const auto& pass          = passes[passIdx];
                if (pass->getPhase() != _phaseID) continue;
                if (pass->getBatchingScheme() == scene::BatchingSchemes::INSTANCING) {
                    auto *instancedBuffer = InstancedBuffer::get(pass);
                    instancedBuffer->merge(model, subModel, passIdx);
                    _instancedQueue->add(instancedBuffer);
                } else if (pass->getBatchingScheme() == scene::BatchingSchemes::VB_MERGING) {
                    auto *batchedBuffer = BatchedBuffer::get(pass);
                    batchedBuffer->merge(subModel, passIdx, model);
                    _batchedQueue->add(batchedBuffer);
                } else {
                    for (k = 0; k < _renderQueues.size(); k++) {
                        _renderQueues[k]->insertRenderPass(ro, subModelIdx, passIdx);
                    }
                }
            }
        }
    }
        
    for (auto *queue : _renderQueues) {
        queue->sort();
    }

    auto *cmdBuff = pipeline->getCommandBuffers()[0];

    _instancedQueue->uploadBuffers(cmdBuff);
    _batchedQueue->uploadBuffers(cmdBuff);
    _additiveLightQueue->gatherLightPasses(camera, cmdBuff);
    _planarShadowQueue->gatherShadowPasses(camera, cmdBuff);

    // render area is not oriented
    uint w             = camera->window->hasOnScreenAttachments && static_cast<uint>(_device->getSurfaceTransform()) % 2 ? camera->height : camera->width;
    uint h             = camera->window->hasOnScreenAttachments && static_cast<uint>(_device->getSurfaceTransform()) % 2 ? camera->width : camera->height;
    _renderArea.x      = static_cast<int>(camera->viewPort.x * w);
    _renderArea.y      = static_cast<int>(camera->viewPort.y * h);
    _renderArea.width  = static_cast<uint>(camera->viewPort.z * w * sharedData->shadingScale);
    _renderArea.height = static_cast<uint>(camera->viewPort.w * h * sharedData->shadingScale);

    if (hasFlag(static_cast<gfx::ClearFlags>(camera->clearFlag), gfx::ClearFlagBit::COLOR)) {
        if (sharedData->isHDR) {
            srgbToLinear(&_clearColors[0], camera->clearColor);
            auto scale = sharedData->fpScale / camera->exposure;
            _clearColors[0].x *= scale;
            _clearColors[0].y *= scale;
            _clearColors[0].z *= scale;
        } else {
            _clearColors[0].x = camera->clearColor.x;
            _clearColors[0].y = camera->clearColor.y;
            _clearColors[0].z = camera->clearColor.z;
        }
    }

    _clearColors[0].w = camera->clearColor.w;

    auto *      framebuffer   = camera->window->frameBuffer;
    const auto &colorTextures = framebuffer->getColorTextures();

    auto *renderPass = !colorTextures.empty() && colorTextures[0] ? framebuffer->getRenderPass() : pipeline->getOrCreateRenderPass(static_cast<gfx::ClearFlagBit>(camera->clearFlag));

    cmdBuff->beginRenderPass(renderPass, framebuffer, _renderArea, _clearColors, camera->clearDepth, camera->clearStencil);

    uint const globalOffsets[] = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
    cmdBuff->bindDescriptorSet(globalSet, _pipeline->getDescriptorSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);

    _renderQueues[0]->recordCommandBuffer(_device, renderPass, cmdBuff);
    _instancedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _batchedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _additiveLightQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _planarShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _renderQueues[1]->recordCommandBuffer(_device, renderPass, cmdBuff);
    _uiPhase->render(camera, renderPass);

    cmdBuff->endRenderPass();
}

} // namespace pipeline
} // namespace cc
