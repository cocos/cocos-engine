#include "RenderInstancedQueue.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "gfx/GFXCommandBuffer.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {

void RenderInstancedQueue::clear() {
    for (auto it : _queues) {
        it->clear();
    }
    _queues.clear();
}

void RenderInstancedQueue::uploadBuffers(gfx::CommandBuffer *cmdBuff) {
    for (auto instanceBuffer : _queues) {
        if (instanceBuffer->hasPendingModels()) {
            instanceBuffer->uploadBuffers(cmdBuff);
        }
    }
}

void RenderInstancedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff) {
    for (auto instanceBuffer : _queues) {
        if (!instanceBuffer->hasPendingModels()) continue;

        const auto &instances = instanceBuffer->getInstances();
        const auto pass = instanceBuffer->getPass();
        cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::MATERIAL), pass->getDescriptorSet());
        gfx::PipelineState *lastPSO = nullptr;
        for (size_t b = 0; b < instances.size(); ++b) {
            const auto &instance = instances[b];
            if (!instance.count) {
                continue;
            }
            auto pso = PipelineStateManager::getOrCreatePipelineState(pass, instance.shader, instance.ia, renderPass);
            if (lastPSO != pso) {
                cmdBuff->bindPipelineState(pso);
                lastPSO = pso;
            }
            cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::LOCAL), instance.descriptorSet, instanceBuffer->dynamicOffsets());
            cmdBuff->bindInputAssembler(instance.ia);
            cmdBuff->draw(instance.ia);
        }
    }
}

} // namespace pipeline
} // namespace cc
