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

#include "BatchedBuffer.h"
#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "ShadowMapBatchedQueue.h"
#include "forward/ForwardPipeline.h"
#include "SceneCulling.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "helper/SharedMemory.h"
#include "PipelineSceneData.h"
#include "PipelineUBO.h"

namespace cc {
namespace pipeline {
ShadowMapBatchedQueue::ShadowMapBatchedQueue(ForwardPipeline *pipeline)
: _phaseID(getPhaseID("shadow-caster")) {
    _pipeline = pipeline;
    _buffer = pipeline->getDescriptorSet()->getBuffer(UBOShadow::BINDING);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
    _batchedQueue = CC_NEW(RenderBatchedQueue);
}

void ShadowMapBatchedQueue::gatherLightPasses(const Light *light, gfx::CommandBuffer *cmdBufferer) {
    clear();
    
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto *shadowInfo = sceneData->getSharedData()->getShadows();
    const auto &shadowObjects = sceneData->getShadowObjects();
    if (light && shadowInfo->enabled && shadowInfo->getShadowType() == ShadowType::SHADOWMAP) {
        _pipeline->getPipelineUBO()->updateShadowUBOLight(light);

        for (const auto ro : shadowObjects) {
            const auto *model = ro.model;

            switch (light->getType()) {
                case LightType::DIRECTIONAL:
                    add(model, cmdBufferer);
                    break;
                case LightType::SPOT:
                    if (model->getWorldBounds() &&
                        (aabb_aabb(model->getWorldBounds(), light->getAABB()) ||
                         aabb_frustum(model->getWorldBounds(), light->getFrustum()))) {
                        add(model, cmdBufferer);
                    }
                    break;
                default:;
            }
        }
    }
}

void ShadowMapBatchedQueue::clear() {
    _subModels.clear();
    _shaders.clear();
    _passes.clear();
    if (_instancedQueue) _instancedQueue->clear();
    if (_batchedQueue) _batchedQueue->clear();
}

void ShadowMapBatchedQueue::add(const ModelView *model, gfx::CommandBuffer *cmdBufferer) {
    // this assumes light pass index is the same for all submodels
    const auto shadowPassIdx = getShadowPassIndex(model);
    if (shadowPassIdx < 0) {
        return;
    }

    const auto subModelID = model->getSubModelID();
    const auto subModelCount = subModelID[0];
    for (unsigned m = 1; m <= subModelCount; ++m) {
        const auto subModel = model->getSubModelView(subModelID[m]);
        const auto pass = subModel->getPassView(shadowPassIdx);
        const auto batchingScheme = pass->getBatchingScheme();
        subModel->getDescriptorSet()->bindBuffer(UBOShadow::BINDING, _buffer);
        subModel->getDescriptorSet()->update();

        if (batchingScheme == BatchingSchemes::INSTANCING) {
            auto *instancedBuffer = InstancedBuffer::get(subModel->passID[shadowPassIdx]);
            instancedBuffer->merge(model, subModel, shadowPassIdx);
            _instancedQueue->add(instancedBuffer);
        } else if (batchingScheme == BatchingSchemes::VB_MERGING) {
            auto *batchedBuffer = BatchedBuffer::get(subModel->passID[shadowPassIdx]);
            batchedBuffer->merge(subModel, shadowPassIdx, model);
            _batchedQueue->add(batchedBuffer);
        } else { // standard draw
            _subModels.emplace_back(subModel);
            _shaders.emplace_back(subModel->getShader(shadowPassIdx));
            _passes.emplace_back(pass);
        }
    }

    _instancedQueue->uploadBuffers(cmdBufferer);
    _batchedQueue->uploadBuffers(cmdBufferer);
}

void ShadowMapBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) const {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    for (size_t i = 0; i < _subModels.size(); i++) {
        const auto subModel = _subModels[i];
        const auto shader = _shaders[i];
        const auto pass = _passes[i];
        const auto ia = subModel->getInputAssembler();
        const auto pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
        cmdBuffer->bindDescriptorSet(LOCAL_SET, subModel->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);
        cmdBuffer->draw(ia);
    }
}

void ShadowMapBatchedQueue::destroy() {
    CC_SAFE_DELETE(_batchedQueue);

    CC_SAFE_DELETE(_instancedQueue);

    _buffer = nullptr;
}

int ShadowMapBatchedQueue::getShadowPassIndex(const ModelView *model) const {
    const auto subModelArrayID = model->getSubModelID();
    const auto count = subModelArrayID[0];
    for (unsigned i = 1; i <= count; i++) {
        const auto subModel = model->getSubModelView(subModelArrayID[i]);
        for (unsigned passIdx = 0; passIdx < subModel->passCount; passIdx++) {
            const auto pass = subModel->getPassView(passIdx);
            if (pass->phase == _phaseID) {
                return passIdx;
            }
        }
    }
    return -1;
}

} // namespace pipeline
} // namespace cc
