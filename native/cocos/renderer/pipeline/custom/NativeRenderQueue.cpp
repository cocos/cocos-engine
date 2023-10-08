/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include <algorithm>
#include <iterator>
#include "NativePipelineTypes.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/PipelineStateManager.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"
#include "scene/gpu-scene/GPUBatchPool.h"
#include "scene/gpu-scene/GPUScene.h"
#include "scene/RenderScene.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

namespace render {

// NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
void RenderDrawQueue::add(const scene::Model &model, float depth, uint32_t subModelIdx, uint32_t passIdx) {
    const auto *subModel = model.getSubModels()[subModelIdx].get();
    const auto *const pass = subModel->getPass(passIdx);

    auto passPriority = static_cast<uint32_t>(pass->getPriority());
    auto modelPriority = static_cast<uint32_t>(subModel->getPriority());
    auto shaderId = static_cast<uint32_t>(reinterpret_cast<uintptr_t>(subModel->getShader(passIdx)));
    const auto hash = (0 << 30) | (passPriority << 16) | (modelPriority << 8) | passIdx;
    const auto priority = model.getPriority();

    instances.emplace_back(DrawInstance{subModel, priority, hash, depth, shaderId, passIdx});
}

void RenderDrawQueue::sortOpaqueOrCutout() {
    std::sort(instances.begin(), instances.end(), [](const DrawInstance &lhs, const DrawInstance &rhs) {
        return std::forward_as_tuple(lhs.hash, lhs.depth, lhs.shaderID) <
               std::forward_as_tuple(rhs.hash, rhs.depth, rhs.shaderID);
    });
}

void RenderDrawQueue::sortTransparent() {
    std::sort(instances.begin(), instances.end(), [](const DrawInstance &lhs, const DrawInstance &rhs) {
        return std::forward_as_tuple(lhs.priority, lhs.hash, -lhs.depth, lhs.shaderID) <
               std::forward_as_tuple(rhs.priority, rhs.hash, -rhs.depth, rhs.shaderID);
    });
}

void RenderDrawQueue::recordCommandBuffer(
    gfx::Device * /*device*/, const scene::Camera * /*camera*/,
    gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff,
    uint32_t subpassIndex) const {
    for (const auto &instance : instances) {
        const auto *subModel = instance.subModel;

        const auto passIdx = instance.passIndex;
        auto *inputAssembler = subModel->getInputAssembler();
        const auto *pass = subModel->getPass(passIdx);
        auto *shader = subModel->getShader(passIdx);
        auto *pso = pipeline::PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass, subpassIndex);

        cmdBuff->bindPipelineState(pso);
        cmdBuff->bindDescriptorSet(pipeline::materialSet, pass->getDescriptorSet());
        cmdBuff->bindDescriptorSet(pipeline::localSet, subModel->getDescriptorSet());
        cmdBuff->bindInputAssembler(inputAssembler);
        cmdBuff->draw(inputAssembler);
    }
}

bool RenderInstancingQueue::empty() const noexcept {
    CC_EXPECTS(!passInstances.empty() || sortedBatches.empty());
    return passInstances.empty();
}

void RenderInstancingQueue::clear() {
    sortedBatches.clear();
    passInstances.clear();
    for (auto &buffer : instanceBuffers) {
        buffer->clear();
    }
}

void RenderInstancingQueue::add(
    const scene::Pass &pass,
    scene::SubModel &submodel, uint32_t passID) {
    auto iter = passInstances.find(&pass);
    if (iter == passInstances.end()) {
        const auto instanceBufferID = static_cast<uint32_t>(passInstances.size());
        if (instanceBufferID >= instanceBuffers.size()) {
            CC_EXPECTS(instanceBufferID == instanceBuffers.size());
            instanceBuffers.emplace_back(ccnew pipeline::InstancedBuffer(nullptr));
        }
        bool added = false;
        std::tie(iter, added) = passInstances.emplace(&pass, instanceBufferID);
        CC_ENSURES(added);

        CC_ENSURES(iter->second < instanceBuffers.size());
        const auto &instanceBuffer = instanceBuffers[iter->second];
        instanceBuffer->setPass(&pass);
        const auto &instances = instanceBuffer->getInstances();
        for (const auto &item : instances) {
            CC_EXPECTS(item.drawInfo.instanceCount == 0);
        }
    }
    auto &instancedBuffer = *instanceBuffers[iter->second];
    instancedBuffer.merge(&submodel, passID);
}

void RenderInstancingQueue::sort() {
    sortedBatches.reserve(passInstances.size());
    for (const auto &[pass, bufferID] : passInstances) {
        sortedBatches.emplace_back(instanceBuffers[bufferID]);
    }
}

void RenderInstancingQueue::uploadBuffers(gfx::CommandBuffer *cmdBuffer) const {
    for (const auto &[pass, bufferID] : passInstances) {
        const auto &ib = instanceBuffers[bufferID];
        if (ib->hasPendingModels()) {
            ib->uploadBuffers(cmdBuffer);
        }
    }
}

void RenderInstancingQueue::recordCommandBuffer(
    gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer,
    gfx::DescriptorSet *ds, uint32_t offset, const ccstd::vector<uint32_t> *dynamicOffsets) const {
    const auto &renderQueue = sortedBatches;
    for (const auto *instanceBuffer : renderQueue) {
        if (!instanceBuffer->hasPendingModels()) {
            continue;
        }
        const auto &instances = instanceBuffer->getInstances();
        const auto *drawPass = instanceBuffer->getPass();
        cmdBuffer->bindDescriptorSet(pipeline::materialSet, drawPass->getDescriptorSet());
        gfx::PipelineState *lastPSO = nullptr;
        for (const auto &instance : instances) {
            if (!instance.drawInfo.instanceCount) {
                continue;
            }
            auto *pso = pipeline::PipelineStateManager::getOrCreatePipelineState(
                drawPass, instance.shader, instance.ia, renderPass);
            if (lastPSO != pso) {
                cmdBuffer->bindPipelineState(pso);
                lastPSO = pso;
            }
            if (ds) {
                cmdBuffer->bindDescriptorSet(pipeline::globalSet, ds, 1, &offset);
            }
            if (dynamicOffsets) {
                cmdBuffer->bindDescriptorSet(pipeline::localSet, instance.descriptorSet, *dynamicOffsets);
            } else {
                cmdBuffer->bindDescriptorSet(pipeline::localSet, instance.descriptorSet, instanceBuffer->dynamicOffsets());
            }
            cmdBuffer->bindInputAssembler(instance.ia);
            cmdBuffer->draw(instance.ia);
        }
    }
}

void GPUDrivenQueue::recordCommandBuffer(
    const ResourceGraph& resg,
    gfx::Device *device, const scene::Camera *camera, 
    gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer, uint32_t phaseLayoutID, SceneFlags sceneFlags, uint32_t cullingID) const {
    if (!any(sceneFlags & SceneFlags::GPU_DRIVEN)) {
        return;
    }

    auto *gpuScene = camera->getScene() ? camera->getScene()->getGPUScene() : nullptr;
    if (!gpuScene) {
        return;
    }

    const bool bDrawBlend = any(sceneFlags & SceneFlags::TRANSPARENT_OBJECT);
    const bool bDrawOpaqueOrMask = any(sceneFlags & (SceneFlags::OPAQUE_OBJECT | SceneFlags::CUTOUT_OBJECT));
    const bool bDrawShadowCaster = any(sceneFlags & SceneFlags::SHADOW_CASTER);
    if (!bDrawShadowCaster && !bDrawBlend && !bDrawOpaqueOrMask) {
        return; // nothing to draw
    }

    CC_EXPECTS(cullingID != 0xFFFFFFFF);
    ccstd::pmr::string indirectName("CCDrawIndirectBuffer", get_allocator());
    indirectName.append(std::to_string(cullingID));
    auto indirectResID = findVertex(indirectName, resg);
    const auto &indirectBuffer = get(ManagedBufferTag{}, indirectResID, resg).buffer.get();

    // Draw visible instances
    const auto supportFirstInstance = device->getCapabilities().supportFirstInstance;
    auto *batchPool = gpuScene->getBatchPool();
    gfx::PipelineState *lastPSO = nullptr;
    const auto indirectStride = scene::GPUBatchPool::getIndirectStride();

    for (const auto &iter : batchPool->getBatches()) {
        const auto *batch = iter.second;
        if (batch->empty()) {
            continue;
        }

        const auto *drawPass = batch->getPass();
        if (phaseLayoutID != drawPass->getPhaseID()) {
            continue;
        }

        const bool bBlend = drawPass->isBlend();
        const bool bOpaqueOrMask = !bBlend;
        if (!bDrawBlend && bBlend) {
            // skip transparent object
            continue;
        }
        if (!bDrawOpaqueOrMask && bOpaqueOrMask) {
            // skip opaque object
            continue;
        }

        cmdBuffer->bindDescriptorSet(pipeline::materialSet, drawPass->getDescriptorSet());

        const auto &items = batch->getItems();
        for (const auto &item : items) {
            if (!item.count) {
                continue;
            }

            auto *pso = pipeline::PipelineStateManager::getOrCreatePipelineState(
                drawPass, item.shader, item.inputAssembler, renderPass);

            if (lastPSO != pso) {
                cmdBuffer->bindPipelineState(pso);
                lastPSO = pso;
            }

            cmdBuffer->bindInputAssembler(item.inputAssembler);
            cmdBuffer->bindDescriptorSet(pipeline::localSet, item.descriptorSet);

            if (supportFirstInstance) {
                cmdBuffer->drawIndexedIndirect(indirectBuffer, item.first * indirectStride, item.count, indirectStride);
            } else {
                for (auto i = 0; i < item.count; i++) {
                    // Stanley TODO: bindDescriptorSet for cc_drawInstances with dynamicOffsets here.
                    cmdBuffer->drawIndexedIndirect(indirectBuffer, (item.first + i) * indirectStride, 1, indirectStride);
                }
            }
        }
    }
}

void NativeRenderQueue::sort() {
    opaqueQueue.sortOpaqueOrCutout();
    transparentQueue.sortTransparent();
    opaqueInstancingQueue.sort();
    transparentInstancingQueue.sort();
}

} // namespace render

} // namespace cc
