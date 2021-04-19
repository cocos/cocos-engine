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

#include <array>

#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "PlanarShadowQueue.h"
#include "RenderInstancedQueue.h"
#include "RenderPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXShader.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {

PlanarShadowQueue::PlanarShadowQueue(RenderPipeline *pipeline)
: _pipeline(pipeline) {
    _instancedQueue = CC_NEW(RenderInstancedQueue);
}

void PlanarShadowQueue::gatherShadowPasses(Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    clear();
    auto *const sceneData  = _pipeline->getPipelineSceneData();
    auto *const sharedData = sceneData->getSharedData();
    const auto *shadowInfo = sharedData->getShadows();
    if (!shadowInfo->enabled || shadowInfo->getShadowType() != ShadowType::PLANAR) {
        return;
    }

    auto *const pipelineUBO = _pipeline->getPipelineUBO();
    pipelineUBO->updateShadowUBO(camera);
    const auto *scene         = camera->getScene();
    const bool  shadowVisible = camera->visibility & static_cast<uint>(LayerList::DEFAULT);

    if (!scene->getMainLight() || !shadowVisible) {
        return;
    }

    const auto *models          = scene->getModels();
    const auto modelCount = models[0];
    auto *instancedBuffer = InstancedBuffer::get(shadowInfo->instancePass);

    for (uint i = 1; i <= modelCount; i++) {
        const auto *model = cc::pipeline::Scene::getModelView(models[i]);
        const auto *node  = model->getNode();
        if (model->enabled && model->castShadow) {
            const auto visibility = camera->visibility;
            if ((model->nodeID && ((visibility & node->layer) == node->layer)) ||
                (visibility & model->visFlags)) {
                // frustum culling
                if ((model->worldBoundsID) && !aabbFrustum(model->getWorldBounds(), camera->getFrustum())) {
                    continue;
                }

                const auto *attributesID = model->getInstancedAttributeID();
                const auto length                   = attributesID[0];
                if (length > 0) {
                    const auto *subModelID    = model->getSubModelID();
                    const auto  subModelCount = subModelID[0];
                    for (uint m = 1; m <= subModelCount; ++m) {
                        const auto *subModel = cc::pipeline::ModelView::getSubModelView(subModelID[m]);
                        instancedBuffer->merge(model, subModel, m - 1, subModel->getPlanarInstanceShader());
                        _instancedQueue->add(instancedBuffer);
                    }
                } else {
                    _pendingModels.emplace_back(model);
                }
            }
        }
    }

    _instancedQueue->uploadBuffers(cmdBuffer);
}

void PlanarShadowQueue::clear() {
    _pendingModels.clear();
    if (_instancedQueue) _instancedQueue->clear();
}

void PlanarShadowQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    auto *const sceneData  = _pipeline->getPipelineSceneData();
    auto *const sharedData = sceneData->getSharedData();
    const auto *shadowInfo = sharedData->getShadows();
    if (!shadowInfo->enabled || shadowInfo->getShadowType() != ShadowType::PLANAR) {
        return;
    }

    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    if (_pendingModels.empty()) {
        return;
    }

    const auto *pass = shadowInfo->getPlanarShadowPass();
    cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());

    for (const auto *model : _pendingModels) {
        const auto *const subModelID    = model->getSubModelID();
        const auto        subModelCount = subModelID[0];
        for (unsigned m = 1; m <= subModelCount; ++m) {
            const auto *const subModel = cc::pipeline::ModelView::getSubModelView(subModelID[m]);
            auto *const       shader   = subModel->getPlanarShader();
            auto *const       ia       = subModel->getInputAssembler();
            auto *const       pso      = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

            cmdBuffer->bindPipelineState(pso);
            cmdBuffer->bindDescriptorSet(localSet, subModel->getDescriptorSet());
            cmdBuffer->bindInputAssembler(ia);
            cmdBuffer->draw(ia);
        }
    }
}

void PlanarShadowQueue::destroy() {
    CC_SAFE_DELETE(_instancedQueue);
}

} // namespace pipeline
} // namespace cc
