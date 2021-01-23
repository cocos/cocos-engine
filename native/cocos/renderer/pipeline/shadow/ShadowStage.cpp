/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "ShadowStage.h"
#include "../Define.h"
#include "../ShadowMapBatchedQueue.h"
#include "../forward/ForwardPipeline.h"
#include "../helper/SharedMemory.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXTexture.h"
#include "math/Vec2.h"

namespace cc {
namespace pipeline {
ShadowStage::ShadowStage() {
}

ShadowStage::~ShadowStage() {
}

RenderStageInfo ShadowStage::_initInfo = {
    "ShadowStage",
    static_cast<uint>(ForwardStagePriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE),
    {}};
const RenderStageInfo &ShadowStage::getInitializeInfo() { return ShadowStage::_initInfo; }

bool ShadowStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    RenderQueueDesc descriptor = {true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}};
    _renderQueueDescriptors.emplace_back(std::move(descriptor));

    return true;
}

void ShadowStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    _additiveShadowQueue = CC_NEW(ShadowMapBatchedQueue(static_cast<ForwardPipeline *>(pipeline)));
}

void ShadowStage::render(Camera *camera) {
    const auto sceneData = _pipeline->getPipelineSceneData();
    const auto sharedData = sceneData->getSharedData();
    const auto *shadowInfo = sceneData->getSharedData()->getShadows();

    if (!_light || !_framebuffer) {
        return;
    }

    auto cmdBuffer = _pipeline->getCommandBuffers()[0];

    _additiveShadowQueue->gatherLightPasses(_light, cmdBuffer);

    const auto shadowMapSize = shadowInfo->size;
    _renderArea.x = (int)(camera->viewportX * shadowMapSize.x);
    _renderArea.y = (int)(camera->viewportY * shadowMapSize.y);
    _renderArea.width = (uint)(camera->viewportWidth * shadowMapSize.x * sharedData->shadingScale);
    _renderArea.height = (uint)(camera->viewportHeight * shadowMapSize.y * sharedData->shadingScale);

    _clearColors[0] = {1.0f, 1.0f, 1.0f, 1.0f};
    auto* renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, camera->clearDepth, camera->clearStencil);
    cmdBuffer->bindDescriptorSet(GLOBAL_SET, _pipeline->getDescriptorSet());
    _additiveShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuffer);

    cmdBuffer->endRenderPass();
}

void ShadowStage::destroy() {	
    CC_SAFE_DESTROY(_additiveShadowQueue);

    RenderStage::destroy();
}

} // namespace pipeline
} // namespace cc
