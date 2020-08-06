#include "RenderInstancedQueue.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "gfx/GFXCommandBuffer.h"
#include "helper/Pass.h"

namespace cc {
namespace pipeline {
void RenderInstancedQueue::clear() {
    for (auto it : _queues) {
        it->clear();
    }
    _queues.clear();
}

void RenderInstancedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff) {
    for (auto instanceBuffer : _queues) {
        const auto &instances = instanceBuffer->getInstances();
        const auto psoci = instanceBuffer->getPSOCI();
        const auto pass = instanceBuffer->getPass();
        if (psoci) {
            instanceBuffer->uploadBuffers();
            gfx::PipelineState *lastPSO = nullptr;
            for (size_t b = 0; b < instances.size(); ++b) {
                const auto &instance = instances[b];
                if (!instance.count) {
                    continue;
                }
                auto pso = PipelineStateManager::getOrCreatePipelineStage(psoci, pass, instance.ia, renderPass);
                if (lastPSO != pso) {
                    cmdBuff->bindPipelineState(pso);
                    cmdBuff->bindBindingLayout(GET_BINDING_LAYOUT(psoci->bindingLayoutID));
                    lastPSO = pso;
                }
                cmdBuff->bindInputAssembler(instance.ia);
                cmdBuff->draw(instance.ia);
            }
        }
    }
}

} // namespace pipeline
} // namespace cc
