#include "RenderBatchedQueue.h"
#include "BatchedBuffer.h"
#include "PipelineStateManager.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXCommandBuffer.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {

void RenderBatchedQueue::clear() {
    for (auto it : _queues) {
        it->clear();
    }
    _queues.clear();
}

void RenderBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff) {
    for (auto batchedBuffer : _queues) {
        bool boundPSO = false;
        const auto pass = batchedBuffer->getPass();
        const auto &batches = batchedBuffer->getBaches();
        for (const auto &batch : batches) {
            if (!batch.mergeCount) continue;

            for (size_t i = 0; i < batch.vbs.size(); i++) {
                auto buffer = batch.vbs[i];
                buffer->update(batch.vbDatas[i].get(), 0, buffer->getSize());
            }
            batch.vbIdx->update(batch.vbIndexData.get(), 0, batch.vbIdx->getSize());
            batch.ubo->update(batch.uboData, 0, batch.ubo->getSize());

            auto pso = PipelineStateManager::getOrCreatePipelineStage(batch.psoci, pass, batch.ia, renderPass);
            if (!boundPSO) {
                cmdBuff->bindPipelineState(pso);
                boundPSO = true;
            }
            cmdBuff->bindBindingLayout(GET_BINDING_LAYOUT(batch.psoci->bindingLayoutID));
            cmdBuff->bindInputAssembler(batch.ia);
            cmdBuff->draw(batch.ia);
        }
    }
}

} // namespace pipeline
} // namespace cc
