/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "RenderInstancedQueue.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXRenderPass.h"

namespace cc {
namespace pipeline {

void RenderInstancedQueue::clear() {
    for (auto *it : _queues) {
        it->clear();
    }
    _renderQueues.clear();
    _queues.clear();
}

void RenderInstancedQueue::sort() {
    std::copy(_queues.cbegin(), _queues.cend(), std::back_inserter(_renderQueues));
    auto isOpaque = [](const InstancedBuffer *instance) {
        return instance->getPass()->getBlendState()->targets[0].blend == 0;
    };
    std::stable_partition(_renderQueues.begin(), _renderQueues.end(), isOpaque);
}

void RenderInstancedQueue::uploadBuffers(gfx::CommandBuffer *cmdBuffer) {
    for (auto *instanceBuffer : _queues) {
        if (instanceBuffer->hasPendingModels()) {
            instanceBuffer->uploadBuffers(cmdBuffer);
        }
    }
}

void RenderInstancedQueue::recordCommandBuffer(gfx::Device * /*device*/, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer,
                                               gfx::DescriptorSet *ds, uint32_t offset, const ccstd::vector<uint32_t> *dynamicOffsets) {
    auto recordCommands = [&](const auto &renderQueue) {
        for (const auto *instanceBuffer : renderQueue) {
            if (!instanceBuffer->hasPendingModels()) continue;

            const auto &instances = instanceBuffer->getInstances();
            const auto *pass = instanceBuffer->getPass();
            cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            gfx::PipelineState *lastPSO = nullptr;
            for (const auto &instance : instances) {
                if (!instance.drawInfo.instanceCount) {
                    continue;
                }
                auto *pso = PipelineStateManager::getOrCreatePipelineState(pass, instance.shader, instance.ia, renderPass);
                if (lastPSO != pso) {
                    cmdBuffer->bindPipelineState(pso);
                    lastPSO = pso;
                }
                if (ds) cmdBuffer->bindDescriptorSet(globalSet, ds, 1, &offset);
                if (dynamicOffsets) {
                    cmdBuffer->bindDescriptorSet(localSet, instance.descriptorSet, *dynamicOffsets);
                } else {
                    cmdBuffer->bindDescriptorSet(localSet, instance.descriptorSet, instanceBuffer->dynamicOffsets());
                }
                cmdBuffer->bindInputAssembler(instance.ia);
                cmdBuffer->draw(instance.ia);
            }
        }
    };

    if (_renderQueues.empty()) {
        recordCommands(_queues);
    } else {
        recordCommands(_renderQueues);
    }
}

void RenderInstancedQueue::add(InstancedBuffer *instancedBuffer) {
    _queues.emplace(instancedBuffer);
}

} // namespace pipeline
} // namespace cc
