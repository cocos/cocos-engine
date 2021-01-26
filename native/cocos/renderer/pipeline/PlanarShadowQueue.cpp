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
#include <array>

#include "PlanarShadowQueue.h"
#include "RenderPipeline.h"
#include "BatchedBuffer.h"
#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "gfx/GFXCommandBuffer.h"
#include "helper/SharedMemory.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXShader.h"

namespace cc {
namespace pipeline {

PlanarShadowQueue::PlanarShadowQueue(RenderPipeline *pipeline)
:_pipeline(pipeline){
    _instancedQueue = CC_NEW(RenderInstancedQueue);
}

void PlanarShadowQueue::gatherShadowPasses(Camera *camera, gfx::CommandBuffer *cmdBufferer) {
    clear();
    const auto sceneData = _pipeline->getPipelineSceneData();
    const auto sharedData = sceneData->getSharedData();
    const auto *shadowInfo = sharedData->getShadows();
    if (!shadowInfo->enabled || shadowInfo->getShadowType() != ShadowType::PLANAR) { return; }

    const auto pipelineUBO = _pipeline->getPipelineUBO();
    pipelineUBO->updateShadowUBO(camera);
    const auto *scene = camera->getScene();
    const bool shadowVisible = camera->visibility & static_cast<uint>(LayerList::DEFAULT);

    if (!scene->getMainLight() || !shadowVisible) { return; }
    
    const auto models = scene->getModels();
    const auto modelCount = models[0];
    auto *instancedBuffer = InstancedBuffer::get(shadowInfo->planarPass);

    uint visibility = 0, lenght = 0;
    for (uint i = 1; i <= modelCount; i++) {
        const auto *model = scene->getModelView(models[i]);
        const auto *node = model->getNode();
        if (model->enabled && model->castShadow) {
            visibility = camera->visibility;
            if ((model->nodeID && ((visibility & node->layer) == node->layer)) ||
                (visibility & model->visFlags)) {

                // frustum culling
                if ((model->worldBoundsID) && !aabb_frustum(model->getWorldBounds(), camera->getFrustum())) {
                    continue;
                }

                const auto *attributesID = model->getInstancedAttributeID();
                lenght = attributesID[0];
                if (lenght > 0) {
                    const auto *subModelID = model->getSubModelID();
                    const auto subModelCount = subModelID[0];
                    for (uint m = 1; m <= subModelCount; ++m) {
                        const auto *subModel = model->getSubModelView(subModelID[m]);
                        instancedBuffer->merge(model, subModel, m - 1);
                        _instancedQueue->add(instancedBuffer);
                    }
                } else {
                    _pendingModels.emplace_back(model);
                }
            }
        }
    }

    _instancedQueue->uploadBuffers(cmdBufferer);
}

void PlanarShadowQueue::clear() {
    _pendingModels.clear();
    if (_instancedQueue) _instancedQueue->clear();
}

void PlanarShadowQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    const auto sceneData = _pipeline->getPipelineSceneData();
    const auto sharedData = sceneData->getSharedData();
    const auto *shadowInfo = sharedData->getShadows();
    if (!shadowInfo->enabled || shadowInfo->getShadowType() != ShadowType::PLANAR || _pendingModels.empty()) { return; }

    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    const auto *pass = shadowInfo->getPlanarShadowPass();
    cmdBuffer->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
    auto *shader = shadowInfo->getPlanarShader();

    for (auto model : _pendingModels) {
        const auto subModelID = model->getSubModelID();
        const auto subModelCount = subModelID[0];
        for (unsigned m = 1; m <= subModelCount; ++m) {
            const auto subModel = model->getSubModelView(subModelID[m]);
            const auto ia = subModel->getInputAssembler();
            const auto pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

            cmdBuffer->bindPipelineState(pso);
            cmdBuffer->bindDescriptorSet(LOCAL_SET, subModel->getDescriptorSet());
            cmdBuffer->bindInputAssembler(ia);
            cmdBuffer->draw(ia);
        }
    }
}

void PlanarShadowQueue::destroy() {
    CC_SAFE_DELETE(_instancedQueue);
}
}
} // namespace cc
