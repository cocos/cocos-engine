#include "NativePipelineTypes.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/PipelineStateManager.h"

namespace cc {

namespace render {

bool RenderInstancingQueue::empty() const noexcept {
    return batches.empty();
}

void RenderInstancingQueue::clear() {
    for (auto *it : batches) {
        it->clear();
    }
    sortedBatches.clear();
    batches.clear();
}

void RenderInstancingQueue::sort() {
    std::copy(batches.cbegin(), batches.cend(), std::back_inserter(sortedBatches));
    auto isOpaque = [](const pipeline::InstancedBuffer *instance) {
        return instance->getPass()->getBlendState()->targets[0].blend == 0;
    };
    std::stable_partition(sortedBatches.begin(), sortedBatches.end(), isOpaque);
}

void RenderInstancingQueue::uploadBuffers(gfx::CommandBuffer *cmdBuffer) const {
    for (auto *instanceBuffer : batches) {
        if (instanceBuffer->hasPendingModels()) {
            instanceBuffer->uploadBuffers(cmdBuffer);
        }
    }
}

void RenderInstancingQueue::recordCommandBuffer(
    gfx::Device * /*device*/, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer,
    gfx::DescriptorSet *ds, uint32_t offset, const ccstd::vector<uint32_t> *dynamicOffsets) const {
    auto recordCommands = [&](const auto &renderQueue) {
        for (const auto *instanceBuffer : renderQueue) {
            if (!instanceBuffer->hasPendingModels()) continue;

            const auto &instances = instanceBuffer->getInstances();
            const auto *pass = instanceBuffer->getPass();
            cmdBuffer->bindDescriptorSet(pipeline::materialSet, pass->getDescriptorSet());
            gfx::PipelineState *lastPSO = nullptr;
            for (const auto &instance : instances) {
                if (!instance.count) {
                    continue;
                }
                auto *pso = pipeline::PipelineStateManager::getOrCreatePipelineState(pass, instance.shader, instance.ia, renderPass);
                if (lastPSO != pso) {
                    cmdBuffer->bindPipelineState(pso);
                    lastPSO = pso;
                }
                if (ds) cmdBuffer->bindDescriptorSet(pipeline::globalSet, ds, 1, &offset);
                if (dynamicOffsets) {
                    cmdBuffer->bindDescriptorSet(pipeline::localSet, instance.descriptorSet, *dynamicOffsets);
                } else {
                    cmdBuffer->bindDescriptorSet(pipeline::localSet, instance.descriptorSet, instanceBuffer->dynamicOffsets());
                }
                cmdBuffer->bindInputAssembler(instance.ia);
                cmdBuffer->draw(instance.ia);
            }
        }
    };

    if (sortedBatches.empty()) {
        recordCommands(batches);
    } else {
        recordCommands(sortedBatches);
    }
}

void RenderInstancingQueue::add(pipeline::InstancedBuffer *instancedBuffer) {
    batches.emplace(instancedBuffer);
}

} // namespace render

} // namespace cc
