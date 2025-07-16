/****************************************************************************
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

#include "ReflectionProbeStage.h"
#include "../Define.h"
#include "../PipelineUBO.h"
#include "../ReflectionProbeBatchedQueue.h"
#include "../RenderPipeline.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/ReflectionProbe.h"
#include "scene/ReflectionProbeManager.h"
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
    auto *descriptor = ccnew RenderQueueDesc{true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}};
    _renderQueueDescriptors.emplace_back(descriptor);

    return true;
}

void ReflectionProbeStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    _reflectionProbeBatchedQueue = ccnew ReflectionProbeBatchedQueue(pipeline);
}

void ReflectionProbeStage::render(scene::Camera *camera) {
    CC_PROFILE(ReflectionProbeStage);
    const auto *sceneData = _pipeline->getPipelineSceneData();

    auto *cmdBuffer = _pipeline->getCommandBuffers()[0];

    _reflectionProbeBatchedQueue->gatherRenderObjects(camera, cmdBuffer, _probe);
    _pipeline->getPipelineUBO()->updateCameraUBO(_probe->getCamera(), camera->getScene());

    _renderArea.x = 0;
    _renderArea.y = 0;
    _renderArea.width = _probe->renderArea().x;
    _renderArea.height = _probe->renderArea().y;

    if (hasFlag(static_cast<gfx::ClearFlags>(_probe->getCamera()->getClearFlag()), gfx::ClearFlagBit::COLOR)) {
        _clearColors[0] = _probe->getCamera()->getClearColor();
    }

    auto *renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, _probe->getCamera()->getClearDepth(), _probe->getCamera()->getClearStencil());

    const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
    cmdBuffer->bindDescriptorSet(globalSet, _pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());
    _reflectionProbeBatchedQueue->recordCommandBuffer(_device, renderPass, cmdBuffer);

    cmdBuffer->endRenderPass();

    _pipeline->getPipelineUBO()->updateCameraUBO(camera);
}

void ReflectionProbeStage::destroy() {
    _framebuffer = nullptr;

    CC_SAFE_DELETE(_reflectionProbeBatchedQueue);
    RenderStage::destroy();
}

} // namespace pipeline
} // namespace cc
