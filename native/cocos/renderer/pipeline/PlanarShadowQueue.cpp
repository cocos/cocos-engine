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

#include "PlanarShadowQueue.h"
#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineSceneData.h"
#include "PipelineStateManager.h"
#include "RenderInstancedQueue.h"
#include "RenderPipeline.h"
#include "core/geometry/AABB.h"
#include "gfx-base/GFXDevice.h"
#include "scene/Camera.h"
#include "scene/Model.h"
#include "scene/RenderScene.h"
#include "scene/Shadow.h"

namespace cc {
namespace pipeline {

PlanarShadowQueue::PlanarShadowQueue(RenderPipeline *pipeline)
: _pipeline(pipeline),
  _phaseID(getPhaseID("planar-shadow")) {
    _instancedQueue = ccnew RenderInstancedQueue;
}

PlanarShadowQueue::~PlanarShadowQueue() {
    destroy();
}

void PlanarShadowQueue::gatherShadowPasses(scene::Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    clear();

    const PipelineSceneData *sceneData = _pipeline->getPipelineSceneData();
    scene::Shadows *shadowInfo = sceneData->getShadows();
    if (shadowInfo == nullptr || !shadowInfo->isEnabled() || shadowInfo->getType() != scene::ShadowType::PLANAR || shadowInfo->getNormal().length() < 0.000001F) {
        return;
    }

    const auto *scene = camera->getScene();
    const bool shadowVisible = camera->getVisibility() & static_cast<uint32_t>(LayerList::DEFAULT);
    if (!scene->getMainLight() || !shadowVisible) {
        return;
    }

    const auto &models = scene->getModels();
    for (const auto &model : models) {
        if (scene->isCulledByLod(camera, model)) {
            continue;
        }
        if (!model->isEnabled() || !model->isCastShadow() || !model->getNode()) {
            continue;
        }

        if (model->getWorldBounds() && model->isCastShadow()) {
            _castModels.emplace_back(model);
        }
    }

    geometry::AABB ab;
    for (const auto *model : _castModels) {
        // frustum culling
        model->getWorldBounds()->transform(shadowInfo->getMatLight(), &ab);
        if (!ab.aabbFrustum(camera->getFrustum())) {
            continue;
        }

        const auto &subModels = model->getSubModels();
        for (const auto &subModel : subModels) {
            const auto shadowPassIdx = getShadowPassIndex(subModel);
            if (shadowPassIdx == -1) {
                _subModelArray.emplace_back(subModel);
                _shaderArray.emplace_back(shadowInfo->getPlanarShader(subModel->getPatches()));
                _passArray.emplace_back((*shadowInfo->getMaterial()->getPasses())[0]);
                continue;
            }
            auto *const pass = subModel->getPass(shadowPassIdx);
            const auto batchingScheme = pass->getBatchingScheme();
            if (batchingScheme == scene::BatchingSchemes::INSTANCING) {
                auto *instancedBuffer = pass->getInstancedBuffer();
                instancedBuffer->merge(subModel, shadowPassIdx);
                _instancedQueue->add(instancedBuffer);
            } else { // standard draw
                _subModelArray.emplace_back(subModel);
                _shaderArray.emplace_back(subModel->getShader(shadowPassIdx));
                _passArray.emplace_back(pass);
            }
        }
    }

    _instancedQueue->uploadBuffers(cmdBuffer);
}

void PlanarShadowQueue::clear() {
    _castModels.clear();
    _subModelArray.clear();
    _shaderArray.clear();
    _passArray.clear();
    if (_instancedQueue) _instancedQueue->clear();
}

void PlanarShadowQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer, uint32_t subpassID) {
    const PipelineSceneData *sceneData = _pipeline->getPipelineSceneData();
    const auto *shadowInfo = sceneData->getShadows();
    if (shadowInfo == nullptr || !shadowInfo->isEnabled() || shadowInfo->getType() != scene::ShadowType::PLANAR || shadowInfo->getNormal().length() < 0.000001F) {
        return;
    }

    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    for (size_t i = 0; i < _subModelArray.size(); ++i) {
        const auto *const subModel = _subModelArray[i];
        auto *const shader = _shaderArray[i];
        const auto *pass = _passArray[i];
        auto *const ia = subModel->getInputAssembler();
        auto *const pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass, subpassID);

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        cmdBuffer->bindDescriptorSet(localSet, subModel->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);
        cmdBuffer->draw(ia);
    }
}

void PlanarShadowQueue::destroy() {
    _pipeline = nullptr;
    CC_SAFE_DELETE(_instancedQueue);
    _castModels.clear();
    _subModelArray.clear();
}

int PlanarShadowQueue::getShadowPassIndex(const scene::SubModel *subModel) const {
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
