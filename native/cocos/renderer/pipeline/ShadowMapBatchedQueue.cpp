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

#include "ShadowMapBatchedQueue.h"
#include "BatchedBuffer.h"
#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineSceneData.h"
#include "PipelineStateManager.h"
#include "PipelineUBO.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "forward/ForwardPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
ShadowMapBatchedQueue::ShadowMapBatchedQueue(RenderPipeline *pipeline)
: _phaseID(getPhaseID("shadow-caster")) {
    _pipeline       = pipeline;
    _buffer         = pipeline->getDescriptorSet()->getBuffer(UBOShadow::BINDING);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
    _batchedQueue   = CC_NEW(RenderBatchedQueue);
}

void ShadowMapBatchedQueue::gatherLightPasses(const Light *light, gfx::CommandBuffer *cmdBuffer) {
    clear();

    const auto *sceneData     = _pipeline->getPipelineSceneData();
    const auto *shadowInfo    = sceneData->getSharedData()->getShadows();
    const auto &shadowObjects = sceneData->getShadowObjects();
    if (light && shadowInfo->enabled && shadowInfo->getShadowType() == ShadowType::SHADOWMAP) {
        _pipeline->getPipelineUBO()->updateShadowUBOLight(light);

        for (const auto ro : shadowObjects) {
            const auto *model = ro.model;

            switch (light->getType()) {
                case LightType::DIRECTIONAL: {
                    add(model, cmdBuffer);
                } break;
                case LightType::SPOT: {
                    if (model->getWorldBounds() &&
                        (aabbAabb(model->getWorldBounds(), light->getAABB()) ||
                         aabbFrustum(model->getWorldBounds(), light->getFrustum()))) {
                        add(model, cmdBuffer);
                    }
                } break;
                default:
                    break;
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

void ShadowMapBatchedQueue::add(const ModelView *model, gfx::CommandBuffer *cmdBuffer) {
    // this assumes light pass index is the same for all subModels
    const auto shadowPassIdx = getShadowPassIndex(model);
    if (shadowPassIdx < 0) {
        return;
    }

    const auto *const subModelID    = model->getSubModelID();
    const auto        subModelCount = subModelID[0];
    for (unsigned m = 1; m <= subModelCount; ++m) {
        const auto *const subModel       = cc::pipeline::ModelView::getSubModelView(subModelID[m]);
        const auto *const pass           = subModel->getPassView(shadowPassIdx);
        const auto        batchingScheme = pass->getBatchingScheme();

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

    _instancedQueue->uploadBuffers(cmdBuffer);
    _batchedQueue->uploadBuffers(cmdBuffer);
}

void ShadowMapBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) const {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    for (size_t i = 0; i < _subModels.size(); i++) {
        const auto *const subModel = _subModels[i];
        auto *const       shader   = _shaders[i];
        const auto *const pass     = _passes[i];
        auto *const       ia       = subModel->getInputAssembler();
        auto *const       pso      = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        cmdBuffer->bindDescriptorSet(localSet, subModel->getDescriptorSet());
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
    const auto *const subModelArrayID = model->getSubModelID();
    const auto        count           = subModelArrayID[0];
    for (unsigned i = 1; i <= count; i++) {
        const auto *const subModel = cc::pipeline::ModelView::getSubModelView(subModelArrayID[i]);
        for (unsigned passIdx = 0; passIdx < subModel->passCount; passIdx++) {
            const auto *const pass = subModel->getPassView(passIdx);
            if (pass->phase == _phaseID) {
                return static_cast<int>(passIdx);
            }
        }
    }
    return -1;
}

} // namespace pipeline
} // namespace cc
