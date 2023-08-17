/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "ShadowStage.h"
#include "../Define.h"
#include "../PipelineSceneData.h"
#include "../PipelineUBO.h"
#include "../RenderPipeline.h"
#include "../ShadowMapBatchedQueue.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXFramebuffer.h"
#include "math/Vec2.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/Light.h"
#include "scene/Shadow.h"
#include "scene/SpotLight.h"

namespace cc {
namespace pipeline {

ShadowStage::ShadowStage() = default;
ShadowStage::~ShadowStage() = default;

RenderStageInfo ShadowStage::initInfo = {
    "ShadowStage",
    static_cast<uint32_t>(ForwardStagePriority::FORWARD),
    static_cast<uint32_t>(RenderFlowTag::SCENE),
    {}};
const RenderStageInfo &ShadowStage::getInitializeInfo() { return ShadowStage::initInfo; }

bool ShadowStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    auto *descriptor = ccnew RenderQueueDesc(true, RenderQueueSortMode::BACK_TO_FRONT, {"default"});
    _renderQueueDescriptors.emplace_back(descriptor);

    return true;
}

void ShadowStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    _additiveShadowQueue = ccnew ShadowMapBatchedQueue(pipeline);
    _isShadowMapCleared = false;
}

void ShadowStage::render(scene::Camera *camera) {
    CC_PROFILE(ShadowStageRender);
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto *shadowInfo = sceneData->getShadows();

    if (!_light || !_framebuffer) {
        return;
    }

    if (_light->getType() == scene::LightType::DIRECTIONAL) {
        const auto *dirLight = static_cast<const scene::DirectionalLight *>(_light);
        if (!dirLight->isShadowEnabled()) return;
    }

    if (_light->getType() == scene::LightType::SPOT) {
        const auto *spotLight = static_cast<const scene::SpotLight *>(_light);
        if (!spotLight->isShadowEnabled()) return;
    }

    auto *cmdBuffer = _pipeline->getCommandBuffers()[0];
    _pipeline->getPipelineUBO()->updateShadowUBOLight(_globalDS, _light, _level);
    _additiveShadowQueue->gatherLightPasses(camera, _light, cmdBuffer, _level);

    const Vec2 &shadowMapSize = shadowInfo->getSize();
    switch (_light->getType()) {
        case scene::LightType::DIRECTIONAL: {
            const auto *mainLight = static_cast<const scene::DirectionalLight *>(_light);
            if (mainLight->isShadowFixedArea() || mainLight->getCSMLevel() == scene::CSMLevel::LEVEL_1 || !sceneData->getCSMSupported()) {
                _renderArea.x = 0;
                _renderArea.y = 0;
                _renderArea.width = static_cast<uint32_t>(shadowMapSize.x);
                _renderArea.height = static_cast<uint32_t>(shadowMapSize.y);
            } else {
                const gfx::Device *device = gfx::Device::getInstance();
                const float screenSpaceSignY = device->getCapabilities().screenSpaceSignY;
                _renderArea.x = static_cast<int>(static_cast<float>(_level % 2) * 0.5F * shadowMapSize.x);
                if (screenSpaceSignY > 0.0F) {
                    _renderArea.y = static_cast<int>((1 - floorf(static_cast<float>(_level) / 2)) * 0.5F * shadowMapSize.y);
                } else {
                    _renderArea.y = static_cast<int>((floorf(static_cast<float>(_level) / 2)) * 0.5F * shadowMapSize.y);
                }
                _renderArea.width = static_cast<int>(0.5F * shadowMapSize.x);
                _renderArea.height = static_cast<int>(0.5F * shadowMapSize.y);
            }
            break;
        }
        case scene::LightType::SPOT: {
            _renderArea.x = 0;
            _renderArea.y = 0;
            _renderArea.width = static_cast<uint32_t>(shadowMapSize.x);
            _renderArea.height = static_cast<uint32_t>(shadowMapSize.y);
            break;
        }
        default:
            break;
    }

    _clearColors[0] = {1.0F, 1.0F, 1.0F, 1.0F};
    auto *renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, camera->getClearDepth(), camera->getClearStencil());

    const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
    cmdBuffer->bindDescriptorSet(globalSet, _globalDS, utils::toUint(globalOffsets.size()), globalOffsets.data());
    _additiveShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuffer);

    cmdBuffer->endRenderPass();
    _isShadowMapCleared = false;
}

void ShadowStage::destroy() {
    _framebuffer = nullptr;
    _globalDS = nullptr;
    _light = nullptr;

    CC_SAFE_DESTROY_AND_DELETE(_additiveShadowQueue);

    RenderStage::destroy();
}

void ShadowStage::clearFramebuffer(const scene::Camera *camera) {
    if (!_light || !_framebuffer || _isShadowMapCleared) {
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
    _isShadowMapCleared = true;
}

} // namespace pipeline
} // namespace cc
