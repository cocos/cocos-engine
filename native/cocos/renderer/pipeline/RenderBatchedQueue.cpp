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
        auto &batches = batchedBuffer->getBatches();
        for (auto &batch : batches) {
            if (!batch.mergeCount) continue;

            auto i = 0u;
            for (auto vb : batch.vbs) {
                cmdBuff->updateBuffer(vb, batch.vbDatas[i++], vb->getSize());
            }
            cmdBuff->updateBuffer(batch.indexBuffer, batch.indexData, batch.indexBuffer->getSize());
            cmdBuff->updateBuffer(batch.ubo, batch.uboData.data(), batch.ubo->getSize());
        }
    }
}

void RenderBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff) {
    for (auto batchedBuffer : _queues) {
        bool boundPSO = false;
        const auto &batches = batchedBuffer->getBatches();
        for (const auto &batch : batches) {
            if (!batch.mergeCount) continue;
            if (!boundPSO) {
                auto pso = PipelineStateManager::getOrCreatePipelineState(batch.pass, batch.shader, batch.ia, renderPass);
                cmdBuff->bindPipelineState(pso);
                cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::MATERIAL), batch.pass->getDescriptorSet());
                boundPSO = true;
            }

            cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::LOCAL), batch.descriptorSet);
            cmdBuff->bindInputAssembler(batch.ia);
            cmdBuff->draw(batch.ia);
        }
    }
}

void RenderBatchedQueue::push(BatchedBuffer *batchedBuffer) {
    _queues.emplace(batchedBuffer);
}

} // namespace pipeline
} // namespace cc
