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

void RenderInstancedQueue::uploadBuffers(gfx::CommandBuffer *cmdBuffer) {
    for (auto instanceBuffer : _queues) {
        if (instanceBuffer->hasPendingModels()) {
            instanceBuffer->uploadBuffers(cmdBuffer);
        }
    }
}

void RenderInstancedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    for (auto instanceBuffer : _queues) {
        if (!instanceBuffer->hasPendingModels()) continue;

        const auto &instances = instanceBuffer->getInstances();
        const auto pass = instanceBuffer->getPass();
        cmdBuffer->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
        gfx::PipelineState *lastPSO = nullptr;
        for (size_t b = 0; b < instances.size(); ++b) {
            const auto &instance = instances[b];
            if (!instance.count) {
                continue;
            }
            auto pso = PipelineStateManager::getOrCreatePipelineState(pass, instance.shader, instance.ia, renderPass);
            if (lastPSO != pso) {
                cmdBuffer->bindPipelineState(pso);
                lastPSO = pso;
            }
            cmdBuffer->bindDescriptorSet(LOCAL_SET, instance.descriptorSet, instanceBuffer->dynamicOffsets());
            cmdBuffer->bindInputAssembler(instance.ia);
            cmdBuffer->draw(instance.ia);
        }
    }
}

void RenderInstancedQueue::add(InstancedBuffer *instancedBuffer) {
    _queues.emplace(instancedBuffer);
}

} // namespace pipeline
} // namespace cc
