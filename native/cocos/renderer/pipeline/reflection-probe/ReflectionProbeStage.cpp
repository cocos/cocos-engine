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

#include "ReflectionProbeStage.h"
#include "../Define.h"
#include "../PipelineSceneData.h"
#include "../PipelineUBO.h"
#include "../RenderPipeline.h"
#include "../ReflectionProbeBatchedQueue.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXFramebuffer.h"
#include "math/Vec2.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"

namespace cc {
namespace pipeline {

    ReflectionProbeStage::ReflectionProbeStage() = default;
    ReflectionProbeStage::~ReflectionProbeStage() = default;

RenderStageInfo ReflectionProbeStage::initInfo = {
    "ReflectionStage",
    static_cast<uint32_t>(ForwardStagePriority::FORWARD),
    static_cast<uint32_t>(RenderFlowTag::SCENE),
    {}};
const RenderStageInfo &ReflectionProbeStage::getInitializeInfo() { return ReflectionProbeStage::initInfo; }

bool ReflectionProbeStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    RenderQueueDesc descriptor = {true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}};
    _renderQueueDescriptors.emplace_back(std::move(descriptor));

    return true;
}

void ReflectionProbeStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    _reflectionProbeBatchedQueue = ccnew ReflectionProbeBatchedQueue(pipeline);
}

void ReflectionProbeStage::render(scene::Camera *camera) {
    CC_PROFILE(ShadowStageRender);
    const auto *sceneData = _pipeline->getPipelineSceneData();

    auto *cmdBuffer = _pipeline->getCommandBuffers()[0];

    _reflectionProbeBatchedQueue->gatherRenderObjects(camera, cmdBuffer);

    _renderArea.x = 0;
    _renderArea.y = 0;
    _renderArea.width = static_cast<uint32_t>(1280);
    _renderArea.height = static_cast<uint32_t>(720);

    _clearColors[0] = {1.0F, 1.0F, 1.0F, 1.0F};
    auto *renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, camera->getClearDepth(), camera->getClearStencil());

    const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
    cmdBuffer->bindDescriptorSet(globalSet, _pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());
    _reflectionProbeBatchedQueue->recordCommandBuffer(_device, renderPass, cmdBuffer);

    cmdBuffer->endRenderPass();
    _reflectionProbeBatchedQueue->resetMacro();
}
void ReflectionProbeStage::destroy() {
    _framebuffer = nullptr;

    CC_SAFE_DESTROY_AND_DELETE(_reflectionProbeBatchedQueue);
    RenderStage::destroy();
}

void ReflectionProbeStage::clearFramebuffer(const scene::Camera *camera) {
    if ( !_framebuffer) {
        return;
    }

    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto *shadowInfo = sceneData->getShadows();
    const Vec4 &viewport = camera->getViewport();
    const Vec2 &shadowMapSize = shadowInfo->getSize();

    auto *cmdBuffer = _pipeline->getCommandBuffers()[0];

    _renderArea.x = static_cast<int>(viewport.x * shadowMapSize.x);
    _renderArea.y = static_cast<int>(viewport.y * shadowMapSize.y);
    _renderArea.width = static_cast<uint32_t>(viewport.z * shadowMapSize.x * sceneData->getShadingScale());
    _renderArea.height = static_cast<uint32_t>(viewport.w * shadowMapSize.y * sceneData->getShadingScale());

    _clearColors[0] = {1.0F, 1.0F, 1.0F, 1.0F};
    auto *renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, camera->getClearDepth(), camera->getClearStencil());

    cmdBuffer->endRenderPass();
}

} // namespace pipeline
} // namespace cc
