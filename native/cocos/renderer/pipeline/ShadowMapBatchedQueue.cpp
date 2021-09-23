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
#include "scene/SpotLight.h"

namespace cc {
namespace pipeline {
ShadowMapBatchedQueue::ShadowMapBatchedQueue(RenderPipeline *pipeline)
: _phaseID(getPhaseID("shadow-caster")) {
    _pipeline       = pipeline;
    _buffer         = pipeline->getDescriptorSet()->getBuffer(UBOShadow::BINDING);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
    _batchedQueue   = CC_NEW(RenderBatchedQueue);
}

void ShadowMapBatchedQueue::gatherLightPasses(const scene::Camera *camera, const scene::Light *light, gfx::CommandBuffer *cmdBuffer) {
    clear();

    const PipelineSceneData *sceneData         = _pipeline->getPipelineSceneData();
    const scene::Shadow *    shadowInfo        = sceneData->getSharedData()->shadow;
    const RenderObjectList & dirShadowObjects  = sceneData->getDirShadowObjects();
    const RenderObjectList & castShadowObjects = sceneData->getCastShadowObjects();
    if (light && shadowInfo->enabled && shadowInfo->shadowType == scene::ShadowType::SHADOWMAP) {
        _pipeline->getPipelineUBO()->updateShadowUBOLight(light);

        switch (light->getType()) {
            case scene::LightType::DIRECTIONAL: {
                for (const auto ro : dirShadowObjects) {
                    const auto *model = ro.model;
                    add(model, cmdBuffer);
                }
            } break;

            case scene::LightType::SPOT: {
                const auto *spotLight     = dynamic_cast<const scene::SpotLight *>(light);
                const Mat4  matShadowView = light->getNode()->getWorldMatrix().getInversed();
                Mat4        matShadowProj;
                Mat4::createPerspective(spotLight->getSpotAngle(), spotLight->getAspect(), 0.001F, spotLight->getRange(), &matShadowProj);
                const Mat4  matShadowViewProj = matShadowProj * matShadowView;
                scene::AABB ab;
                for (const auto ro : castShadowObjects) {
                    const auto *model = ro.model;
                    if (!model->getEnabled() || !model->getCastShadow() || !model->getNode()) {
                        continue;
                    }

                    if (model->getWorldBounds()) {
                        model->getWorldBounds()->transform(matShadowViewProj, &ab);
                        if (ab.aabbFrustum(camera->frustum)) {
                            add(model, cmdBuffer);
                        }
                    }
                }
            } break;

            case scene::LightType::SPHERE: {
            } break;

            case scene::LightType::UNKNOWN: {
            } break;

            default: {
            } break;
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

void ShadowMapBatchedQueue::add(const scene::Model *model, gfx::CommandBuffer *cmdBuffer) {
    // this assumes light pass index is the same for all subModels
    const auto shadowPassIdx = getShadowPassIndex(model);
    if (shadowPassIdx == -1) {
        return;
    }

    for (auto *subModel : model->getSubModels()) {
        const auto *pass           = subModel->getPass(shadowPassIdx);
        const auto  batchingScheme = pass->getBatchingScheme();

        if (batchingScheme == scene::BatchingSchemes::INSTANCING) {
            auto *instancedBuffer = InstancedBuffer::get(subModel->getPass(shadowPassIdx));
            instancedBuffer->merge(model, subModel, shadowPassIdx);
            _instancedQueue->add(instancedBuffer);
        } else if (batchingScheme == scene::BatchingSchemes::VB_MERGING) {
            auto *batchedBuffer = BatchedBuffer::get(subModel->getPass(shadowPassIdx));
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
        const auto *      pass     = _passes[i];
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
    CC_SAFE_DELETE(_batchedQueue)

    CC_SAFE_DELETE(_instancedQueue)

    _buffer = nullptr;
}

int ShadowMapBatchedQueue::getShadowPassIndex(const scene::Model *model) const {
    for (const scene::SubModel *subModel : model->getSubModels()) {
        int i = 0;
        for (const scene::Pass *pass : subModel->getPasses()) {
            if (pass->getPhase() == _phaseID) {
                return i;
            }
            ++i;
        }
    }
    return -1;
}

} // namespace pipeline
} // namespace cc
