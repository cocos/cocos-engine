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

void RenderInstancedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff) {
    for (auto instanceBuffer : _queues) {
        const auto &instances = instanceBuffer->getInstances();
        if (!instanceBuffer->hasPendingModels()) {
            continue;
        }

        instanceBuffer->uploadBuffers();
        gfx::PipelineState *lastPSO = nullptr;
        for (size_t b = 0; b < instances.size(); ++b) {
            const auto &instance = instances[b];
            if (!instance.count) {
                continue;
            }
            //                auto pso = PipelineStateManager::getOrCreatePipelineState(psoci, pass, instance.ia, renderPass);
            //                if (lastPSO != pso) {
            //                    cmdBuff->bindPipelineState(pso);
            //                    cmdBuff->bindBindingLayout(GET_BINDING_LAYOUT(psoci->bindingLayoutID));
            //                    lastPSO = pso;
            //                }
            cmdBuff->bindInputAssembler(instance.ia);
            cmdBuff->draw(instance.ia);
        }
    }
    //    const it = this.queue.values(); let res = it.next();
    //    while (!res.done) {
    //        const { instances, psoci } = res.value;
    //        if (psoci) {
    //            res.value.uploadBuffers();
    //            let lastPSO: GFXPipelineState | null = null;
    //            for (let b = 0; b < instances.length; ++b) {
    //                const instance = instances[b];
    //                if (!instance.count) { continue; }
    //                const pso = PipelineStateManager.getOrCreatePipelineState(device, psoci, renderPass, instance.ia);
    //                if (lastPSO !== pso) {
    //                    cmdBuff.bindPipelineState(pso);
    //                    cmdBuff.bindBindingLayout(psoci.bindingLayout);
    //                    lastPSO = pso;
    //                }
    //                cmdBuff.bindInputAssembler(instance.ia);
    //                cmdBuff.draw(instance.ia);
    //            }
    //        }
    //        res = it.next();
    //    }
}

} // namespace pipeline
} // namespace cc
