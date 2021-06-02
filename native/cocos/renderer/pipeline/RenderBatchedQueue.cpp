/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "RenderBatchedQueue.h"
#include "BatchedBuffer.h"
#include "PipelineStateManager.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXRenderPass.h"

namespace cc {
namespace pipeline {

void RenderBatchedQueue::clear() {
    for (auto *it : _queues) {
        it->clear();
    }
    _queues.clear();
}

void RenderBatchedQueue::uploadBuffers(gfx::CommandBuffer *cmdBuffer) {
    for (auto *batchedBuffer : _queues) {
        const auto &batches = batchedBuffer->getBatches();
        for (const auto &batch : batches) {
            if (!batch.mergeCount) continue;

            auto i = 0U;
            for (auto *vb : batch.vbs) {
                cmdBuffer->updateBuffer(vb, batch.vbDatas[i++], vb->getSize());
            }
            cmdBuffer->updateBuffer(batch.indexBuffer, batch.indexData, batch.indexBuffer->getSize());
            cmdBuffer->updateBuffer(batch.ubo, batch.uboData.data(), batch.ubo->getSize());
        }
    }
}

void RenderBatchedQueue::recordCommandBuffer(gfx::Device * /*device*/, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    for (auto *batchedBuffer : _queues) {
        bool        boundPSO = false;
        const auto &batches  = batchedBuffer->getBatches();
        for (const auto &batch : batches) {
            if (!batch.mergeCount) continue;
            if (!boundPSO) {
                auto *pso = PipelineStateManager::getOrCreatePipelineState(batch.pass, batch.shader, batch.ia, renderPass);
                cmdBuffer->bindPipelineState(pso);
                cmdBuffer->bindDescriptorSet(materialSet, batch.pass->getDescriptorSet());
                boundPSO = true;
            }

            cmdBuffer->bindDescriptorSet(localSet, batch.descriptorSet, batchedBuffer->getDynamicOffset());
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
