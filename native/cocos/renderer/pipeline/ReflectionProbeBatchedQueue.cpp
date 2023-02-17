/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "ReflectionProbeBatchedQueue.h"
#include "BatchedBuffer.h"
#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineSceneData.h"
#include "PipelineStateManager.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "core/geometry/AABB.h"
#include "core/geometry/Intersect.h"
#include "forward/ForwardPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "renderer/core/ProgramLib.h"
#include "scene/Camera.h"
#include "scene/Define.h"
#include "scene/ReflectionProbe.h"
#include "scene/ReflectionProbeManager.h"
#include "scene/Skybox.h"
namespace cc {
namespace pipeline {
const static uint32_t REFLECTION_PROBE_DEFAULT_MASK = ~static_cast<uint32_t>(LayerList::UI_2D) & ~static_cast<uint32_t>(LayerList::PROFILER) & ~static_cast<uint32_t>(LayerList::UI_3D) & ~static_cast<uint32_t>(LayerList::GIZMOS) & ~static_cast<uint32_t>(LayerList::SCENE_GIZMO) & ~static_cast<uint32_t>(LayerList::EDITOR);
const ccstd::string CC_USE_RGBE_OUTPUT = "CC_USE_RGBE_OUTPUT";
const cc::scene::IMacroPatch MACRO_PATCH_RGBE_OUTPUT{CC_USE_RGBE_OUTPUT, true};
ReflectionProbeBatchedQueue::ReflectionProbeBatchedQueue(RenderPipeline *pipeline)
: _phaseID(getPhaseID("default")), _phaseReflectMapID(getPhaseID("reflect-map")) {
    _pipeline = pipeline;
    _instancedQueue = ccnew RenderInstancedQueue;
    _batchedQueue = ccnew RenderBatchedQueue;
}

ReflectionProbeBatchedQueue::~ReflectionProbeBatchedQueue() {
    destroy();
}

void ReflectionProbeBatchedQueue::destroy() {
    CC_SAFE_DELETE(_batchedQueue)
    CC_SAFE_DELETE(_instancedQueue)
}

void ReflectionProbeBatchedQueue::gatherRenderObjects(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer, const scene::ReflectionProbe *probe) {
    if (probe == nullptr) {
        return;
    }
    clear();
    const PipelineSceneData *sceneData = _pipeline->getPipelineSceneData();

    const scene::Skybox *skyBox = sceneData->getSkybox();
    const scene::RenderScene *const scene = camera->getScene();

    if (static_cast<uint32_t>(probe->getCamera()->getClearFlag()) & skyboxFlag) {
        if (skyBox != nullptr && skyBox->isEnabled() && skyBox->getModel()) {
            add(skyBox->getModel());
        }
    }
    for (const auto &model : scene->getModels()) {
        const auto *node = model->getNode();
        const auto *worldBounds = model->getWorldBounds();
        if (scene->isCulledByLod(camera, model)) {
            continue;
        }
        if (!node || !model->isEnabled() || !worldBounds || !model->getBakeToReflectionProbe()) continue;
        uint32_t visibility = probe->getCamera()->getVisibility();
        if (probe->getProbeType() == scene::ReflectionProbe::ProbeType::CUBE) {
            if (((visibility & node->getLayer()) == node->getLayer()) ||
                (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                if (aabbWithAABB(*worldBounds, *probe->getBoundingBox())) {
                    add(model);
                }
            }
        } else {
            if (((node->getLayer() & REFLECTION_PROBE_DEFAULT_MASK) == node->getLayer()) || (REFLECTION_PROBE_DEFAULT_MASK & static_cast<uint32_t>(model->getVisFlags()))) {
                if (worldBounds->aabbFrustum(probe->getCamera()->getFrustum())) {
                    add(model);
                }
            }
        }
    }

    _instancedQueue->uploadBuffers(cmdBuffer);
    _batchedQueue->uploadBuffers(cmdBuffer);
}

void ReflectionProbeBatchedQueue::clear() {
    _subModels.clear();
    _shaders.clear();
    _passes.clear();
    _rgbeSubModels.clear();
    if (_instancedQueue) _instancedQueue->clear();
    if (_batchedQueue) _batchedQueue->clear();
}

void ReflectionProbeBatchedQueue::add(const scene::Model *model) {
    for (const auto &subModel : model->getSubModels()) {
        auto passIdx = getReflectMapPassIndex(subModel);
        bool bUseReflectPass = true;
        if (passIdx == -1) {
            passIdx = getDefaultPassIndex(subModel);
            bUseReflectPass = false;
        }
        if (passIdx == -1) {
            continue;
        }

        auto *pass = subModel->getPass(passIdx);
        const auto batchingScheme = pass->getBatchingScheme();

        if (!bUseReflectPass) {
            auto patches = const_cast<ccstd::vector<cc::scene::IMacroPatch> &>(subModel->getPatches());
            patches.emplace_back(MACRO_PATCH_RGBE_OUTPUT);
            subModel->onMacroPatchesStateChanged(patches);
            _rgbeSubModels.emplace_back(subModel);
        }

        if (batchingScheme == scene::BatchingSchemes::INSTANCING) {
            auto *instancedBuffer = subModel->getPass(passIdx)->getInstancedBuffer();
            instancedBuffer->merge(subModel, passIdx);
            _instancedQueue->add(instancedBuffer);
        } else if (batchingScheme == scene::BatchingSchemes::VB_MERGING) {
            auto *batchedBuffer = subModel->getPass(passIdx)->getBatchedBuffer();
            batchedBuffer->merge(subModel, passIdx, model);
            _batchedQueue->add(batchedBuffer);
        } else { // standard draw
            _subModels.emplace_back(subModel);
            _shaders.emplace_back(subModel->getShader(passIdx));
            _passes.emplace_back(pass);
        }
    }
}

void ReflectionProbeBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) const {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

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
    resetMacro();
    if (_instancedQueue) _instancedQueue->clear();
    if (_batchedQueue) _batchedQueue->clear();
}
void ReflectionProbeBatchedQueue::resetMacro() const {
    for (const auto &subModel : _rgbeSubModels) {
        auto patches = const_cast<ccstd::vector<cc::scene::IMacroPatch> &>(subModel->getPatches());
        for (auto iter = patches.begin(); iter != patches.end(); iter++) {
            if (iter->name == CC_USE_RGBE_OUTPUT) {
                patches.erase(iter);
                const_cast<scene::SubModel *>(subModel)->onMacroPatchesStateChanged(patches);
                break;
            }
        }
    }
}

bool ReflectionProbeBatchedQueue::isUseReflectMapPass(const scene::SubModel *subModel) const {
    auto passIdx = getReflectMapPassIndex(subModel);
    return passIdx != -1;
}

int ReflectionProbeBatchedQueue::getDefaultPassIndex(const scene::SubModel *subModel) const {
    int i = 0;
    for (const auto &pass : subModel->getPasses()) {
        if (pass->getPhase() == _phaseID) {
            return i;
        }
        ++i;
    }
    return -1;
}

int ReflectionProbeBatchedQueue::getReflectMapPassIndex(const scene::SubModel *subModel) const {
    int i = 0;
    for (const auto &pass : subModel->getPasses()) {
        if (pass->getPhase() == _phaseReflectMapID) {
            return i;
        }
        ++i;
    }
    return -1;
}

} // namespace pipeline
} // namespace cc
