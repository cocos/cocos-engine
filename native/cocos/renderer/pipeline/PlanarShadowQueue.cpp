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
#include "forward/ForwardPipeline.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "renderer/pipeline/RenderView.h"
#include "gfx/GFXShader.h"

namespace cc {
namespace pipeline {

PlanarShadowQueue::PlanarShadowQueue(RenderPipeline *pipeline)
:_pipeline(static_cast<ForwardPipeline *>(pipeline)){
    _instancedQueue = CC_NEW(RenderInstancedQueue);
}

void PlanarShadowQueue::gatherShadowPasses(RenderView *view, gfx::CommandBuffer *cmdBufferer) {
    clear();
    const auto *shadowInfo = _pipeline->getShadows();
    if (!shadowInfo->enabled || shadowInfo->getShadowType() != ShadowType::PLANAR) { return; }

    const auto *camera = view->getCamera();
    const auto *scene = camera->getScene();
    const bool shadowVisible = view->getVisibility() & static_cast<uint>(LayerList::DEFAULT);

    if (!scene->getMainLight() || !shadowVisible) { return; }
    
    const auto models = scene->getModels();
    const auto modelCount = models[0];
    auto *instancedBuffer = InstancedBuffer::get(shadowInfo->planarPass);

    uint visibility = 0, lenght = 0;
    for (uint i = 1; i <= modelCount; i++) {
        const auto *model = scene->getModelView(models[i]);
        const auto *node = model->getNode();
        if (model->enabled && model->castShadow) {
            visibility = view->getVisibility();
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
                        instancedBuffer->merge(model, subModel, m);
                        _instancedQueue->add(instancedBuffer);
                    }
                } else {
                    _pendingModels.emplace_back(model);
                }
            }
        }
    }
}

void PlanarShadowQueue::clear() {
    _pendingModels.clear();
    if (_instancedQueue) _instancedQueue->clear();
}

void PlanarShadowQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    const auto *shadowInfo = _pipeline->getShadows();
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
