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
#include "cocos/renderer/pipeline/InstancedBuffer.h"
#include "cocos/renderer/pipeline/PipelineStateManager.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"

namespace cc {

namespace render {

LayoutGraphData::vertex_descriptor ProbeHelperQueue::getDefaultId(const LayoutGraphData &lg) {
    const auto passID = locate(LayoutGraphData::null_vertex(), "default", lg);
    CC_ENSURES(passID != LayoutGraphData::null_vertex());
    const auto phaseID = locate(passID, "default", lg);
    CC_ENSURES(phaseID != LayoutGraphData::null_vertex());
    return phaseID;
}

void ProbeHelperQueue::removeMacro() const {
    for (auto *subModel : probeMap) {
        std::vector<cc::scene::IMacroPatch> patches;
        patches.insert(patches.end(), subModel->getPatches().begin(), subModel->getPatches().end());

        for (int j = 0; j != patches.size(); ++j) {
            const cc::scene::IMacroPatch &patch = patches[j];
            if (patch.name == "CC_USE_RGBE_OUTPUT") {
                patches.erase(patches.begin() + j);
                break;
            }
        }

        subModel->onMacroPatchesStateChanged(patches);
    }
}

uint32_t ProbeHelperQueue::getPassIndexFromLayout(
    const cc::IntrusivePtr<cc::scene::SubModel> &subModel,
    LayoutGraphData::vertex_descriptor phaseLayoutId) {
    const auto &passes = subModel->getPasses();
    for (uint32_t k = 0; k != passes->size(); ++k) {
        if (passes->at(k)->getPhaseID() == phaseLayoutId) {
            return static_cast<int>(k);
        }
    }
    return 0xFFFFFFFF;
}

void ProbeHelperQueue::applyMacro(
    const LayoutGraphData &lg, const cc::scene::Model &model,
    LayoutGraphData::vertex_descriptor probeLayoutId) {
    const std::vector<cc::IntrusivePtr<cc::scene::SubModel>> &subModels = model.getSubModels();
    for (const auto &subModel : subModels) {
        const bool isTransparent = subModel->getPasses()->at(0)->getBlendState()->targets[0].blend;
        if (isTransparent) {
            continue;
        }

        auto passIdx = getPassIndexFromLayout(subModel, probeLayoutId);
        bool bUseReflectPass = true;
        if (passIdx < 0) {
            probeLayoutId = getDefaultId(lg);
            passIdx = getPassIndexFromLayout(subModel, probeLayoutId);
            bUseReflectPass = false;
        }
        if (passIdx < 0) {
            continue;
        }
        if (!bUseReflectPass) {
            std::vector<cc::scene::IMacroPatch> patches;
            patches.insert(patches.end(), subModel->getPatches().begin(), subModel->getPatches().end());
            const cc::scene::IMacroPatch useRGBEPatch = {"CC_USE_RGBE_OUTPUT", true};
            patches.emplace_back(useRGBEPatch);
            subModel->onMacroPatchesStateChanged(patches);
            probeMap.emplace_back(subModel);
        }
    }
}

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
    gfx::RenderPass *renderPass, uint32_t subpassIndex,
    gfx::CommandBuffer *cmdBuff,
    uint32_t lightByteOffset) const {
    for (const auto &instance : instances) {
        const auto *subModel = instance.subModel;

        const auto passIdx = instance.passIndex;
        auto *inputAssembler = subModel->getInputAssembler();
        const auto *pass = subModel->getPass(passIdx);
        auto *shader = subModel->getShader(passIdx);
        auto *pso = pipeline::PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass, subpassIndex);

        cmdBuff->bindPipelineState(pso);
        cmdBuff->bindDescriptorSet(pipeline::materialSet, pass->getDescriptorSet());
        if (lightByteOffset != 0xFFFFFFFF) {
            cmdBuff->bindDescriptorSet(pipeline::localSet, subModel->getDescriptorSet(), 1, &lightByteOffset);
        } else {
            cmdBuff->bindDescriptorSet(pipeline::localSet, subModel->getDescriptorSet());
        }
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
    gfx::RenderPass *renderPass, uint32_t subpassIndex,
    gfx::CommandBuffer *cmdBuffer,
    uint32_t lightByteOffset) const { //
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
                drawPass, instance.shader, instance.ia, renderPass, subpassIndex);
            if (lastPSO != pso) {
                cmdBuffer->bindPipelineState(pso);
                lastPSO = pso;
            }
            if (lightByteOffset != 0xFFFFFFFF) {
                cmdBuffer->bindDescriptorSet(pipeline::localSet, instance.descriptorSet, 1, &lightByteOffset);
            } else {
                cmdBuffer->bindDescriptorSet(pipeline::localSet, instance.descriptorSet, instanceBuffer->dynamicOffsets());
            }
            cmdBuffer->bindInputAssembler(instance.ia);
            cmdBuffer->draw(instance.ia);
        }
    }
}

void NativeRenderQueue::sort() {
    opaqueQueue.sortOpaqueOrCutout();
    transparentQueue.sortTransparent();
    opaqueInstancingQueue.sort();
    transparentInstancingQueue.sort();
}

void NativeRenderQueue::recordCommands(
    gfx::CommandBuffer *cmdBuffer,
    gfx::RenderPass *renderPass,
    uint32_t subpassIndex) const {
    opaqueQueue.recordCommandBuffer(
        renderPass, subpassIndex, cmdBuffer, lightByteOffset);
    opaqueInstancingQueue.recordCommandBuffer(
        renderPass, subpassIndex, cmdBuffer, lightByteOffset);
    transparentQueue.recordCommandBuffer(
        renderPass, subpassIndex, cmdBuffer, lightByteOffset);
    transparentInstancingQueue.recordCommandBuffer(
        renderPass, subpassIndex, cmdBuffer, lightByteOffset);
}

} // namespace render

} // namespace cc
