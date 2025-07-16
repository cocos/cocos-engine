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

#include "ShadowMapBatchedQueue.h"
#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineSceneData.h"
#include "PipelineStateManager.h"
#include "RenderInstancedQueue.h"
#include "SceneCulling.h"
#include "forward/ForwardPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/Shadow.h"
#include "scene/SpotLight.h"
#include "shadow/CSMLayers.h"

namespace cc {
namespace pipeline {

ShadowMapBatchedQueue::ShadowMapBatchedQueue(RenderPipeline *pipeline)
: _phaseID(getPhaseID("shadow-caster")) {
    _pipeline = pipeline;
    _instancedQueue = ccnew RenderInstancedQueue;
}

ShadowMapBatchedQueue::~ShadowMapBatchedQueue() = default;

void ShadowMapBatchedQueue::gatherLightPasses(const scene::Camera *camera, const scene::Light *light, gfx::CommandBuffer *cmdBuffer, uint32_t level) {
    clear();

    const PipelineSceneData *sceneData = _pipeline->getPipelineSceneData();
    const scene::Shadows *shadowInfo = sceneData->getShadows();
    const CSMLayers *csmLayers = sceneData->getCSMLayers();
    if (light && shadowInfo->isEnabled() && shadowInfo->getType() == scene::ShadowType::SHADOW_MAP) {
        switch (light->getType()) {
            case scene::LightType::DIRECTIONAL: {
                const auto *dirLight = static_cast<const scene::DirectionalLight *>(light);
                if (shadowInfo->isEnabled() && shadowInfo->getType() == scene::ShadowType::SHADOW_MAP) {
                    if (dirLight->isShadowEnabled()) {
                        ShadowTransformInfo *layer;
                        if (dirLight->isShadowFixedArea()) {
                            layer = csmLayers->getSpecialLayer();
                        } else {
                            layer = csmLayers->getLayers()[level];
                        }
                        bool isCullingEnable = camera->isCullingEnabled();
                        if (isCullingEnable) {
                            shadowCulling(_pipeline, camera, layer);
                        }
                        const RenderObjectList &dirShadowObjects = layer->getShadowObjects();
                        for (const auto &ro : dirShadowObjects) {
                            add(ro.model);
                        }
                    }
                }
            } break;
            case scene::LightType::SPOT: {
                const auto *spotLight = static_cast<const scene::SpotLight *>(light);
                const RenderObjectList &castShadowObjects = csmLayers->getCastShadowObjects();
                if (spotLight->isShadowEnabled()) {
                    const auto visibility = spotLight->getVisibility();
                    geometry::AABB ab;
                    for (const auto &ro : castShadowObjects) {
                        const auto *model = ro.model;
                        if ((visibility & model->getNode()->getLayer()) != model->getNode()->getLayer() || !model->isEnabled() || !model->isCastShadow() || !model->getNode()) {
                            continue;
                        }
                        if (model->getWorldBounds()) {
                            if (model->getWorldBounds()->aabbFrustum(spotLight->getFrustum())) {
                                add(model);
                            }
                        }
                    }
                }
            } break;
            default:
                break;
        }

        _instancedQueue->uploadBuffers(cmdBuffer);
    }
}

void ShadowMapBatchedQueue::clear() {
    _subModels.clear();
    _shaders.clear();
    _passes.clear();
    if (_instancedQueue) _instancedQueue->clear();
}

void ShadowMapBatchedQueue::add(const scene::Model *model) {
    for (const auto &subModel : model->getSubModels()) {
        const auto shadowPassIdx = getShadowPassIndex(subModel);
        if (shadowPassIdx == -1) {
            continue;
        }

        const auto *pass = subModel->getPass(shadowPassIdx);
        const auto batchingScheme = pass->getBatchingScheme();

        if (batchingScheme == scene::BatchingSchemes::INSTANCING) {
            auto *instancedBuffer = subModel->getPass(shadowPassIdx)->getInstancedBuffer();
            instancedBuffer->merge(subModel, shadowPassIdx);
            _instancedQueue->add(instancedBuffer);
        } else { // standard draw
            _subModels.emplace_back(subModel);
            _shaders.emplace_back(subModel->getShader(shadowPassIdx));
            _passes.emplace_back(pass);
        }
    }
}

void ShadowMapBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) const {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    for (size_t i = 0; i < _subModels.size(); i++) {
        const auto *const subModel = _subModels[i];
        auto *const shader = _shaders[i];
        const auto *pass = _passes[i];
        auto *const ia = subModel->getInputAssembler();
        auto *const pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        cmdBuffer->bindDescriptorSet(localSet, subModel->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);
        cmdBuffer->draw(ia);
    }
}

void ShadowMapBatchedQueue::destroy() {
    CC_SAFE_DELETE(_instancedQueue)
}

int ShadowMapBatchedQueue::getShadowPassIndex(const scene::SubModel *subModel) const {
    int i = 0;
    for (const auto &pass : *(subModel->getPasses())) {
        if (pass->getPhase() == _phaseID) {
            return i;
        }
        ++i;
    }
    return -1;
}

} // namespace pipeline
} // namespace cc
