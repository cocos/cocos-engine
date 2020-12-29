/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
