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

#include "ShadowStage.h"
#include "../Define.h"
#include "../RenderPipeline.h"
#include "../ShadowMapBatchedQueue.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXFramebuffer.h"
#include "math/Vec2.h"

namespace cc {
namespace pipeline {

RenderStageInfo ShadowStage::initInfo = {
    "ShadowStage",
    static_cast<uint>(ForwardStagePriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE),
    {}};
const RenderStageInfo &ShadowStage::getInitializeInfo() { return ShadowStage::initInfo; }

bool ShadowStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    RenderQueueDesc descriptor = {true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}};
    _renderQueueDescriptors.emplace_back(std::move(descriptor));

    return true;
}

void ShadowStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    _additiveShadowQueue = CC_NEW(ShadowMapBatchedQueue(pipeline));
}

void ShadowStage::render(scene::Camera *camera) {
    const auto *sceneData  = _pipeline->getPipelineSceneData();
    const auto *sharedData = sceneData->getSharedData();
    const auto *shadowInfo = sceneData->getSharedData()->shadow;

    if (!_light || !_framebuffer) {
        return;
    }

    auto *cmdBuffer = _pipeline->getCommandBuffers()[0];
    _pipeline->getPipelineUBO()->updateShadowUBOLight(_globalDS, _light);
    _additiveShadowQueue->gatherLightPasses(camera, _light, cmdBuffer);

    const auto  shadowMapSize = shadowInfo->size;
    const auto &viewport      = camera->viewPort;
    _renderArea.x             = static_cast<int>(viewport.x * shadowMapSize.x);
    _renderArea.y             = static_cast<int>(viewport.y * shadowMapSize.y);
    _renderArea.width         = static_cast<uint>(viewport.z * shadowMapSize.x * sharedData->shadingScale);
    _renderArea.height        = static_cast<uint>(viewport.w * shadowMapSize.y * sharedData->shadingScale);

    _clearColors[0]  = {1.0F, 1.0F, 1.0F, 1.0F};
    auto *renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, camera->clearDepth, camera->clearStencil);

    const std::array<uint, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
    cmdBuffer->bindDescriptorSet(globalSet, _globalDS, utils::toUint(globalOffsets.size()), globalOffsets.data());
    _additiveShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuffer);

    cmdBuffer->endRenderPass();
}

void ShadowStage::destroy() {
    _framebuffer = nullptr;
    _globalDS    = nullptr;
    _light       = nullptr;

    CC_SAFE_DESTROY(_additiveShadowQueue);

    RenderStage::destroy();
}

void ShadowStage::clearFramebuffer(scene::Camera *camera) {
    if (!_light || !_framebuffer) {
        return;
    }

    auto *cmdBuffer = _pipeline->getCommandBuffers()[0];

    _clearColors[0]  = {1.0F, 1.0F, 1.0F, 1.0F};
    auto *renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, camera->clearDepth, camera->clearStencil);

    cmdBuffer->endRenderPass();
}

} // namespace pipeline
} // namespace cc
