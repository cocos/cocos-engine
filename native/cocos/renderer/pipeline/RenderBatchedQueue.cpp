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

void RenderBatchedQueue::uploadBuffers(gfx::CommandBuffer *cmdBuffer) {
    for (auto batchedBuffer : _queues) {
        auto &batches = batchedBuffer->getBatches();
        for (auto &batch : batches) {
            if (!batch.mergeCount) continue;

            auto i = 0u;
            for (auto vb : batch.vbs) {
                cmdBuffer->updateBuffer(vb, batch.vbDatas[i++], vb->getSize());
            }
            cmdBuffer->updateBuffer(batch.indexBuffer, batch.indexData, batch.indexBuffer->getSize());
            cmdBuffer->updateBuffer(batch.ubo, batch.uboData.data(), batch.ubo->getSize());
        }
    }
}

void RenderBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    for (auto batchedBuffer : _queues) {
        bool boundPSO = false;
        const auto &batches = batchedBuffer->getBatches();
        for (const auto &batch : batches) {
            if (!batch.mergeCount) continue;
            if (!boundPSO) {
                auto pso = PipelineStateManager::getOrCreatePipelineState(batch.pass, batch.shader, batch.ia, renderPass);
                cmdBuffer->bindPipelineState(pso);
                cmdBuffer->bindDescriptorSet(MATERIAL_SET, batch.pass->getDescriptorSet());
                boundPSO = true;
            }

            cmdBuffer->bindDescriptorSet(LOCAL_SET, batch.descriptorSet);
            cmdBuffer->bindInputAssembler(batch.ia);
            cmdBuffer->draw(batch.ia);
        }
    }
}

void RenderBatchedQueue::add(BatchedBuffer *batchedBuffer) {
    _queues.emplace(batchedBuffer);
}

} // namespace pipeline
} // namespace cc
