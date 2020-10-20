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

void RenderBatchedQueue::uploadBuffers(gfx::CommandBuffer *cmdBuff) {
    for (auto batchedBuffer : _queues) {
        const auto &batches = batchedBuffer->getBatches();
        for (const auto &batch : batches) {
            if (!batch.mergeCount) continue;
            for (size_t i = 0; i < batch.vbs.size(); i++) {
                auto buffer = batch.vbs[i];
                cmdBuff->updateBuffer(buffer, batch.vbDatas[i].get(), buffer->getSize());
            }
            cmdBuff->updateBuffer(batch.vbIdx, batch.vbIndexData.get(), batch.vbIdx->getSize());
            cmdBuff->updateBuffer(batch.ubo, batch.uboData, batch.ubo->getSize());
        }
    }
}

void RenderBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff) {
    for (auto batchedBuffer : _queues) {
        bool boundPSO = false;
        const auto &batches = batchedBuffer->getBatches();
        for (const auto &batch : batches) {
            if (!batch.mergeCount) continue;
            auto pso = PipelineStateManager::getOrCreatePipelineState(batch.pass, batch.shader, batch.ia, renderPass);
            if (!boundPSO) {
                cmdBuff->bindPipelineState(pso);
                boundPSO = true;
            }
            cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::MATERIAL), batch.pass->getDescriptorSet());
            cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::LOCAL), batch.descriptorSet);
            cmdBuff->bindInputAssembler(batch.ia);
            cmdBuff->draw(batch.ia);
        }
    }
}

} // namespace pipeline
} // namespace cc
