/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
#include "PipelineSceneData.h"
#include "PipelineStateManager.h"
#include "PlanarShadowQueue.h"
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
: _pipeline(pipeline) {
    _instancedQueue = CC_NEW(RenderInstancedQueue);
}

PlanarShadowQueue::~PlanarShadowQueue() = default;

void PlanarShadowQueue::gatherShadowPasses(scene::Camera *camera, gfx::CommandBuffer *cmdBuffer) {
    clear();

    const PipelineSceneData *sceneData = _pipeline->getPipelineSceneData();
    const scene::Shadows *   shadows   = sceneData->getShadows();
    if (shadows == nullptr || !shadows->isEnabled() || shadows->getType() != scene::ShadowType::PLANAR || shadows->getNormal().length() < 0.000001) {
        return;
    }

    const auto *scene         = camera->getScene();
    const bool  shadowVisible = camera->getVisibility() & static_cast<uint>(LayerList::DEFAULT);
    if (!scene->getMainLight() || !shadowVisible) {
        return;
    }

    const auto &models = scene->getModels();
    for (const auto &model : models) {
        if (!model->isEnabled() || !model->isCastShadow() || !model->getNode()) {
            continue;
        }

        if (model->getWorldBounds() && model->isCastShadow()) {
            _castModels.emplace_back(model);
        }
    }

    auto &           passes          = *shadows->getInstancingMaterial()->getPasses();
    InstancedBuffer *instancedBuffer = passes[0]->getInstancedBuffer();

    geometry::AABB ab;
    for (const auto *model : _castModels) {
        // frustum culling
        model->getWorldBounds()->transform(shadows->getMatLight(), &ab);
        if (!ab.aabbFrustum(camera->getFrustum())) {
            continue;
        }

        if (!model->getInstanceAttributes().empty()) {
            int i = 0;
            for (const auto &subModel : model->getSubModels()) {
                instancedBuffer->merge(model, subModel, i, subModel->getPlanarInstanceShader());
                _instancedQueue->add(instancedBuffer);
                ++i;
            }
        } else {
            _pendingModels.emplace_back(model);
        }
    }

    _instancedQueue->uploadBuffers(cmdBuffer);
}

void PlanarShadowQueue::clear() {
    _castModels.clear();
    _pendingModels.clear();
    if (_instancedQueue) _instancedQueue->clear();
}

void PlanarShadowQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    const PipelineSceneData *sceneData = _pipeline->getPipelineSceneData();
    const auto *             shadows   = sceneData->getShadows();
    if (shadows == nullptr || !shadows->isEnabled() || shadows->getType() != scene::ShadowType::PLANAR || shadows->getNormal().length() < 0.000001F) {
        return;
    }

    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    if (_pendingModels.empty()) {
        return;
    }

    const scene::Pass *pass = (*shadows->getMaterial()->getPasses())[0];
    cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());

    for (const auto *model : _pendingModels) {
        for (const auto &subModel : model->getSubModels()) {
            auto *const shader = subModel->getPlanarShader();
            auto *const ia     = subModel->getInputAssembler();
            auto *const pso    = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

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
