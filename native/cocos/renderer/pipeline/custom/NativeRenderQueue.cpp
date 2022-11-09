#include <algorithm>
#include <iterator>
#include "GslUtils.h"
#include "NativePipelineTypes.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/PipelineStateManager.h"

namespace cc {

namespace render {

void RenderDrawQueue::add(const scene::Model &model, float depth, uint32_t subModelIdx, uint32_t passIdx) {

}

void RenderDrawQueue::sort() {

}

void RenderDrawQueue::recordCommandBuffer(
    gfx::Device *device, const scene::Camera *camera,
    gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer,
    uint32_t subpassIndex) const {
}

void RenderInstancingQueue::add(pipeline::InstancedBuffer &instancedBuffer) {
    batches.emplace(&instancedBuffer);
}

void RenderInstancingQueue::sort() {
    sortedBatches.reserve(batches.size());
    std::copy(batches.begin(), batches.end(), std::back_inserter(sortedBatches));
    std::stable_partition(
        sortedBatches.begin(), sortedBatches.end(),
        [](const pipeline::InstancedBuffer *instance) {
            return instance->getPass()->getBlendState()->targets[0].blend == 0;
        });
}

void RenderInstancingQueue::uploadBuffers(gfx::CommandBuffer *cmdBuffer) const {
    for (const auto *instanceBuffer : batches) {
        if (instanceBuffer->hasPendingModels()) {
            instanceBuffer->uploadBuffers(cmdBuffer);
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
            if (!instance.count) {
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

} // namespace render

} // namespace cc
